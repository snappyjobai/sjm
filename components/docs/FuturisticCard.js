import { motion } from "framer-motion";

export default function FuturisticCard({ children, gradient = true }) {
  return (
    <motion.div
      className="relative rounded-lg border border-accent/20 bg-black/20 overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      {gradient && (
        <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-transparent" />
      )}
      <div className="relative p-6">{children}</div>
    </motion.div>
  );
}
