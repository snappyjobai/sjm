import { motion } from "framer-motion";
import { FiCode, FiZap } from "react-icons/fi";
import CodeHighlight from "./CodeHighlight";

export default function FeatureShowcase({
  title,
  description,
  code,
  icon: Icon = FiCode,
  liveDemoUrl,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="border border-accent/20 rounded-lg overflow-hidden bg-gray-900/50"
    >
      <div className="p-6 border-b border-accent/10">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-lg bg-accent/10">
            <Icon className="w-6 h-6 text-accent" />
          </div>
          <div>
            <h3 className="text-xl font-bold mb-2">{title}</h3>
            <p className="text-gray-400">{description}</p>
          </div>
        </div>
      </div>

      <div className="p-6">
        <CodeHighlight code={code} />

        {liveDemoUrl && (
          <a
            href={liveDemoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center px-4 py-2 bg-accent text-white rounded-lg
                     hover:bg-accent-dark transition-colors"
          >
            <FiZap className="mr-2" />
            Try it Live
          </a>
        )}
      </div>
    </motion.div>
  );
}
