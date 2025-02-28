import { signIn } from "next-auth/react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import Image from "next/image";
import {
  EnvelopeIcon,
  LockClosedIcon,
  ArrowLeftIcon,
  EyeIcon,
  EyeSlashIcon,
} from "@heroicons/react/24/outline";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";

export default function SignIn() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isNewUser, setIsNewUser] = useState(false);
  const [authStep, setAuthStep] = useState("options"); // options, email, password
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (session) {
      router.push("/dashboard");
    }
  }, [session, router]);

  // Show loading spinner while session is being fetched
  if (status === "loading") {
    return (
      <div className="min-h-screen auth-gradient animate-gradient flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-accent rounded-full border-t-transparent animate-spin"></div>
          <p className="text-white text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/email-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      setIsNewUser(!data.exists);
      setAuthStep("password");
    } catch (error) {
      // Log the error or handle it more specifically
      console.error(error); // Optional, you can log the error in the console
      toast.error("Error checking email");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignIn = async () => {
    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        throw new Error(result.error);
      }

      toast.success("Sign in successful!");
      router.push("/dashboard");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleRegister = async () => {
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          name: email.split("@")[0], // Default name from email
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error);
      }

      toast.success("Account created successfully!");
      await handleSignIn();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isNewUser) {
        if (password !== confirmPassword) {
          throw new Error("Passwords don't match");
        }
        await handleRegister();
      } else {
        await handleSignIn();
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const renderAuthStep = () => {
    switch (authStep) {
      case "options":
        return (
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => signIn("google")}
              className="w-full bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-lg flex items-center justify-center gap-3 transition-all"
            >
              <Image src="/google.svg" alt="Google" width={20} height={20} />
              Continue with Google
            </motion.button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-600" />
              </div>
              <div className="relative flex justify-center">
                <span className="px-2 bg-[#0d1117] text-gray-400">
                  Or continue with
                </span>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setAuthStep("email")}
              className="w-full bg-accent hover:bg-accent-hover text-white px-6 py-3 rounded-lg transition-colors shadow-lg shadow-accent/20"
            >
              Continue with Email
            </motion.button>
          </motion.div>
        );

      case "email":
        return (
          <motion.form
            onSubmit={handleEmailSubmit}
            className="space-y-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="space-y-2">
              <label className="text-sm text-gray-400">Email address</label>
              <div className="relative">
                <EnvelopeIcon className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 text-white pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/50 transition-all"
                  required
                  autoFocus
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={() => setAuthStep("options")}
                className="px-4 py-2 text-gray-400 hover:text-white flex items-center gap-2 hover:bg-white/5 rounded-lg transition-colors"
              >
                <ArrowLeftIcon className="w-4 h-4" /> Back
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-accent hover:bg-accent-hover text-white px-6 py-2 rounded-lg transition-colors disabled:opacity-50 shadow-lg shadow-accent/20"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Checking...
                  </span>
                ) : (
                  "Continue"
                )}
              </motion.button>
            </div>
          </motion.form>
        );

      case "password":
        return (
          <motion.form
            onSubmit={handlePasswordSubmit}
            className="space-y-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="mb-2">
              <div className="text-white text-sm mb-1">{email}</div>
              <div
                className="text-accent text-xs cursor-pointer hover:underline"
                onClick={() => setAuthStep("email")}
              >
                Change email
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-gray-400">
                {isNewUser ? "Create Password" : "Enter Password"}
              </label>
              <div className="relative">
                <LockClosedIcon className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 text-white pl-10 pr-10 py-2 rounded-lg focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/50 transition-all"
                  required
                  autoFocus
                />
                <button
                  type="button"
                  className="absolute right-3 top-3 text-gray-400 hover:text-white"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeSlashIcon className="w-5 h-5" />
                  ) : (
                    <EyeIcon className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {isNewUser && (
              <div className="space-y-2">
                <label className="text-sm text-gray-400">
                  Confirm Password
                </label>
                <div className="relative">
                  <LockClosedIcon className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 text-white pl-10 pr-10 py-2 rounded-lg focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/50 transition-all"
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-3 text-gray-400 hover:text-white"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeSlashIcon className="w-5 h-5" />
                    ) : (
                      <EyeIcon className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
            )}

            {!isNewUser && (
              <div className="text-right">
                <a
                  href="#"
                  className="text-accent text-sm hover:underline"
                  onClick={(e) => {
                    e.preventDefault();
                    toast.info(
                      "Password reset link will be sent to your email"
                    );
                  }}
                >
                  Forgot password?
                </a>
              </div>
            )}

            <div className="flex gap-3 mt-6">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={() => setAuthStep("email")}
                className="px-4 py-2 text-gray-400 hover:text-white flex items-center gap-2 hover:bg-white/5 rounded-lg transition-colors"
              >
                <ArrowLeftIcon className="w-4 h-4" /> Back
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-accent hover:bg-accent-hover text-white px-6 py-2 rounded-lg transition-colors disabled:opacity-50 shadow-lg shadow-accent/20"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    {isNewUser ? "Creating Account..." : "Signing In..."}
                  </span>
                ) : isNewUser ? (
                  "Create Account"
                ) : (
                  "Sign In"
                )}
              </motion.button>
            </div>
          </motion.form>
        );
    }
  };

  return (
    <div className="min-h-screen auth-gradient animate-gradient flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-effect w-full max-w-md p-8 rounded-2xl shadow-xl"
      >
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Welcome to Snapjobs
          </h1>
          <p className="text-gray-400 mt-2">
            {authStep === "options"
              ? "Choose how to sign in"
              : authStep === "email"
              ? "Enter your email to continue"
              : isNewUser
              ? "Create your account"
              : "Welcome back"}
          </p>
        </div>

        {renderAuthStep()}
      </motion.div>
    </div>
  );
}
