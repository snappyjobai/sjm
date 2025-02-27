import { useRouter } from "next/router";
import { useSession, signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import Link from "next/link";

export default function Navigation() {
  const router = useRouter();
  const { data: session } = useSession();
  const [showDropdown, setShowDropdown] = useState(false);

  const navItems = [
    { path: "/", label: "Home" },
    { path: "/docs", label: "Docs" },
    { path: "/pricing", label: "Pricing" },
  ];

  const generateColor = (email) => {
    const colors = [
      "from-blue-500 to-blue-600",
      "from-purple-500 to-purple-600",
      "from-green-500 to-green-600",
      "from-red-500 to-red-600",
      "from-yellow-500 to-yellow-600",
      "from-pink-500 to-pink-600",
    ];
    const index =
      email?.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) || 0;
    return colors[index % colors.length];
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            {navItems.map((item) => (
              <Link key={item.path} href={item.path} className="relative group">
                <span
                  className={`text-sm ${
                    router.pathname === item.path
                      ? "text-white"
                      : "text-gray-300 hover:text-white"
                  } transition-colors`}
                >
                  {item.label}
                </span>
                {router.pathname === item.path && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-accent"
                    initial={false}
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            ))}
          </div>

          <div className="relative">
            {session ? (
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-lg transition-transform hover:scale-110 bg-gradient-to-br ${generateColor(
                    session.user.email
                  )}`}
                >
                  {session.user.name?.[0] || session.user.email?.[0]}
                </button>

                <AnimatePresence>
                  {showDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-48 bg-black/90 backdrop-blur-lg rounded-lg shadow-lg py-1 ring-1 ring-white/10"
                    >
                      <div className="px-4 py-2 border-b border-white/10">
                        <p className="text-sm text-white">
                          {session.user.name}
                        </p>
                        <p className="text-xs text-gray-400">
                          {session.user.email}
                        </p>
                      </div>
                      <Link href="/dashboard">
                        <span className="block px-4 py-2 text-sm text-gray-200 hover:bg-white/10 transition-colors">
                          Dashboard
                        </span>
                      </Link>
                      <button
                        onClick={() => signOut()}
                        className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-white/10 transition-colors"
                      >
                        Sign out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push("/auth/signin")}
                className="bg-gradient-to-r from-accent to-accent-hover text-white px-6 py-2 rounded-lg text-sm font-medium"
              >
                Sign In
              </motion.button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
