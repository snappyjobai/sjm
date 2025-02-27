import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/router";
import { FiSearch, FiBook, FiCode, FiBox } from "react-icons/fi";
import { searchDocs } from "../../utils/search";

export default function SearchModal({ onClose }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (query.length > 1) {
      const searchResults = searchDocs(query);
      setResults(searchResults);
      setSelectedIndex(0);
    } else {
      setResults([]);
    }
  }, [query]);

  const handleKeyDown = (e) => {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((i) => (i < results.length - 1 ? i + 1 : i));
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((i) => (i > 0 ? i - 1 : i));
        break;
      case "Enter":
        e.preventDefault();
        if (results[selectedIndex]) {
          router.push(results[selectedIndex].path);
          onClose();
        }
        break;
      case "Escape":
        e.preventDefault();
        onClose();
        break;
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case "sdk":
        return <FiCode className="w-4 h-4" />;
      case "features":
        return <FiBox className="w-4 h-4" />;
      default:
        return <FiBook className="w-4 h-4" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 overflow-y-auto px-4 py-4 sm:py-20"
      onClick={onClose}
    >
      <div className="fixed inset-0 bg-gray-900/75 backdrop-blur-sm" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative max-w-xl mx-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-gray-800 rounded-lg shadow-2xl border border-gray-700">
          <div className="flex items-center px-4 py-3 border-b border-gray-700">
            <FiSearch className="w-5 h-5 text-gray-400" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full px-3 py-1 text-white bg-transparent border-0 focus:outline-none focus:ring-0"
              placeholder="Search documentation..."
            />
          </div>

          <AnimatePresence>
            {results.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="py-2 max-h-[60vh] overflow-y-auto"
              >
                {results.map((result, index) => (
                  <motion.div
                    key={result.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`px-4 py-2 cursor-pointer ${
                      index === selectedIndex
                        ? "bg-accent text-white"
                        : "hover:bg-gray-700"
                    }`}
                    onClick={() => {
                      router.push(result.path);
                      onClose();
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`${
                          index === selectedIndex
                            ? "text-white"
                            : "text-gray-400"
                        }`}
                      >
                        {getIcon(result.type)}
                      </div>
                      <div>
                        <div className="text-sm font-medium">
                          {result.title}
                        </div>
                        <div className="text-xs text-gray-400">
                          {result.path}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {query && results.length === 0 && (
            <div className="px-4 py-8 text-center text-gray-400">
              No results found for &quot;{query}&quot;
            </div>
          )}

          <div className="px-4 py-3 border-t border-gray-700 text-xs text-gray-400">
            <div className="flex justify-between">
              <div>
                Press <kbd className="px-2 py-1 bg-gray-700 rounded">↑</kbd>{" "}
                <kbd className="px-2 py-1 bg-gray-700 rounded">↓</kbd> to
                navigate
              </div>
              <div>
                Press <kbd className="px-2 py-1 bg-gray-700 rounded">Enter</kbd>{" "}
                to select
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
