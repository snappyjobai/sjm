import { motion, AnimatePresence } from "framer-motion";

export function AlertDialog({
  isOpen,
  onClose,
  title,
  description,
  actionButton,
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative bg-primary border border-white/10 rounded-xl p-6 shadow-xl max-w-md w-full"
          >
            <h3 className="text-xl font-bold text-white mb-4">{title}</h3>
            <div className="mb-6">{description}</div>

            <div className="flex justify-end gap-4">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
              >
                Close
              </button>
              {actionButton}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
