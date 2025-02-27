import { useRouter } from "next/router";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import Link from "next/link";
import { FiSearch, FiCommand, FiMenu, FiX } from "react-icons/fi";
import DocNav from "./DocNav";
import SearchModal from "./SearchModal";
import TableOfContents from "./TableOfContents";

export default function DocsLayout({ children }) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const router = useRouter();

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Top Navigation */}
      <header className="sticky top-0 z-50 bg-gray-900/80 backdrop-blur-xl border-b border-gray-800">
        <nav className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-16 flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-800"
              >
                {isMobileNavOpen ? <FiX size={20} /> : <FiMenu size={20} />}
              </button>
              <Link href="/docs" className="text-xl font-bold text-white ml-3">
                SJM Docs
              </Link>
            </div>

            <button
              onClick={() => setIsSearchOpen(true)}
              className="flex items-center px-4 py-2 text-sm text-gray-400 bg-gray-800/50 
                       hover:bg-gray-800 rounded-lg border border-gray-700"
            >
              <FiSearch className="mr-2" />
              Quick search...
              <kbd className="ml-4 text-xs bg-gray-700 px-2 py-0.5 rounded">
                <FiCommand className="inline mr-1" />K
              </kbd>
            </button>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <div className="max-w-8xl mx-auto flex">
        {/* Sidebar Navigation */}
        <aside
          className={`fixed lg:sticky top-16 z-40 w-64 h-[calc(100vh-4rem)]
                   transform lg:transform-none lg:opacity-100
                   transition-all duration-300 ease-in-out
                   ${
                     isMobileNavOpen
                       ? "translate-x-0"
                       : "-translate-x-full lg:translate-x-0"
                   }
                   bg-gray-900 lg:bg-transparent
                   border-r border-gray-800`}
        >
          <DocNav />
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-h-screen lg:pl-64">
          <div className="max-w-4xl mx-auto px-4 py-12">
            <motion.article
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="prose prose-invert max-w-none"
            >
              {children}
            </motion.article>
          </div>
        </main>

        {/* Table of Contents */}
        <aside className="hidden xl:block w-64 sticky top-16 h-[calc(100vh-4rem)] pl-8 overflow-y-auto">
          <TableOfContents />
        </aside>
      </div>

      {/* Search Modal */}
      <AnimatePresence>
        {isSearchOpen && <SearchModal onClose={() => setIsSearchOpen(false)} />}
      </AnimatePresence>

      {/* Mobile Navigation Overlay */}
      <AnimatePresence>
        {isMobileNavOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileNavOpen(false)}
            className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden"
          />
        )}
      </AnimatePresence>
    </div>
  );
}
