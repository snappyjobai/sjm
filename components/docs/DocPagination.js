import { motion } from "framer-motion";
import Link from "next/link";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";

export default function DocPagination({ prev, next }) {
  return (
    <div className="mt-16 border-t border-accent/10 pt-8">
      <div className="flex justify-between">
        {prev && prev.slug && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <Link
              href={`/docs/${prev.slug}`}
              className="group flex items-center space-x-4 text-gray-400 hover:text-white transition-colors"
            >
              <motion.span
                whileHover={{ x: -4 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                <FiArrowLeft className="w-5 h-5" />
              </motion.span>
              <div>
                <div className="text-sm text-gray-500">Previous</div>
                <div className="font-medium">{prev.title}</div>
              </div>
            </Link>
          </motion.div>
        )}

        {next && next.slug && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="ml-auto text-right"
          >
            <Link
              href={`/docs/${next.slug}`}
              className="group flex items-center space-x-4 text-gray-400 hover:text-white transition-colors"
            >
              <div>
                <div className="text-sm text-gray-500">Next</div>
                <div className="font-medium">{next.title}</div>
              </div>
              <motion.span
                whileHover={{ x: 4 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                <FiArrowRight className="w-5 h-5" />
              </motion.span>
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  );
}
