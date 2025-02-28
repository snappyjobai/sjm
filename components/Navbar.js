import { useRouter } from "next/router";
import { useSession, signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import Link from "next/link";

const MenuIcon = ({ isOpen }) => {
  return (
    <motion.div className="flex flex-col justify-center items-center w-6 h-6">
      <motion.span
        animate={isOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
        className="w-6 h-0.5 bg-white block transition-all"
      />
      <motion.span
        animate={isOpen ? { opacity: 0 } : { opacity: 1 }}
        className="w-6 h-0.5 bg-white block my-1 transition-all"
      />
      <motion.span
        animate={isOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
        className="w-6 h-0.5 bg-white block transition-all"
      />
    </motion.div>
  );
};

export default function Navbar() {
  const router = useRouter();
  const { data: session } = useSession();
  const [showDropdown, setShowDropdown] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navigation = [
    { name: "Our Footprints", href: "/footprints" },
    { name: "Features", href: "/features" },
    { name: "Pricing", href: "/pricing" },
    { name: "Docs", href: "/docs" },
  ];

  const getGradientColor = (email) => {
    const colors = [
      "from-blue-500 to-indigo-600",
      "from-purple-500 to-pink-600",
      "from-green-500 to-teal-600",
      "from-rose-500 to-red-600",
      "from-amber-500 to-orange-600",
    ];
    const index =
      email?.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) || 0;
    return colors[index % colors.length];
  };

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-black/50 backdrop-blur-lg" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/">
            <span className="text-xl font-bold text-accent">Snapjobs</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            <div className="flex items-center space-x-6 mr-4">
              {navigation.map((item) => (
                <Link key={item.href} href={item.href}>
                  <span className="relative group">
                    <span
                      className={`text-sm ${
                        router.pathname === item.href
                          ? "text-accent"
                          : "text-gray-300 hover:text-white"
                      } transition-colors duration-200`}
                    >
                      {item.name}
                    </span>
                    {router.pathname === item.href && (
                      <motion.div
                        layoutId="navUnderline"
                        className="absolute -bottom-1 left-0 right-0 h-0.5 bg-accent"
                      />
                    )}
                  </span>
                </Link>
              ))}
            </div>

            {/* Desktop Profile/Sign In */}
            {session ? (
              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowDropdown(!showDropdown)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-lg bg-gradient-to-br ${getGradientColor(
                    session.user.email
                  )}`}
                >
                  {session.user.name?.[0] || session.user.email?.[0]}
                </motion.button>

                {/* Desktop dropdown menu */}
                <AnimatePresence>
                  {showDropdown && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-48 bg-black/80 backdrop-blur-lg rounded-xl"
                    >
                      <div className="px-4 py-2 border-b border-white/10">
                        <p className="text-sm font-medium text-white">
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
                className="bg-gradient-to-r from-accent to-accent-hover text-white px-4 py-2 rounded-lg text-sm"
              >
                Sign In
              </motion.button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowDropdown(!showDropdown)}
              className="p-2"
            >
              <MenuIcon isOpen={showDropdown} />
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {showDropdown && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="absolute top-16 left-0 right-0 bg-black/90 backdrop-blur-lg md:hidden"
          >
            <div className="p-4 space-y-4">
              {/* Mobile Navigation Links */}
              {navigation.map((item) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <Link href={item.href}>
                    <span
                      className={`block p-2 rounded-lg ${
                        router.pathname === item.href
                          ? "bg-accent text-white"
                          : "text-gray-300 hover:bg-white/10"
                      } transition-colors`}
                    >
                      {item.name}
                    </span>
                  </Link>
                </motion.div>
              ))}

              {/* Mobile Profile/Sign In */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="pt-4 border-t border-white/10"
              >
                {session ? (
                  <>
                    <div className="p-2 mb-2">
                      <p className="text-sm font-medium text-white">
                        {session.user.name}
                      </p>
                      <p className="text-xs text-gray-400">
                        {session.user.email}
                      </p>
                    </div>
                    <Link href="/dashboard">
                      <span className="block p-2 text-sm text-gray-200 hover:bg-white/10 rounded-lg">
                        Dashboard
                      </span>
                    </Link>
                    <button
                      onClick={() => signOut()}
                      className="w-full p-2 text-left text-sm text-red-400 hover:bg-white/10 rounded-lg"
                    >
                      Sign out
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => router.push("/auth/signin")}
                    className="w-full p-2 text-sm text-center bg-accent hover:bg-accent-hover text-white rounded-lg"
                  >
                    Sign In
                  </button>
                )}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
