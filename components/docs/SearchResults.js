import { motion } from "framer-motion";
import Link from "next/link";
import { FiFile, FiCode, FiBook } from "react-icons/fi";

export default function SearchResults({ results = [], onSelect }) {
  if (results.length === 0) {
    return (
      <div className="p-4 text-center text-gray-400">
        No results found. Try a different search term.
      </div>
    );
  }

  const categories = {
    guide: { icon: FiBook, color: "text-blue-400" },
    api: { icon: FiCode, color: "text-green-400" },
    doc: { icon: FiFile, color: "text-purple-400" },
  };

  return (
    <div className="divide-y divide-accent/10">
      {results.map((result, index) => {
        const Category = categories[result.type || "doc"].icon;
        return (
          <motion.div
            key={result.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Link
              href={result.href}
              onClick={onSelect}
              className="block p-4 hover:bg-accent/5 transition-colors"
            >
              <div className="flex items-start gap-3">
                <Category
                  className={`w-5 h-5 mt-1 ${
                    categories[result.type || "doc"].color
                  }`}
                />
                <div>
                  <h4 className="text-white font-medium">{result.title}</h4>
                  {result.excerpt && (
                    <p className="text-sm text-gray-400 mt-1">
                      {result.excerpt}
                    </p>
                  )}
                  {result.breadcrumbs && (
                    <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                      {result.breadcrumbs.map((crumb, i) => (
                        <span key={i} className="flex items-center gap-2">
                          {i > 0 && <span>/</span>}
                          {crumb}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </Link>
          </motion.div>
        );
      })}
    </div>
  );
}
