import { useState } from "react";
import { motion } from "framer-motion";
import { FiPlay, FiRefreshCw } from "react-icons/fi";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";

export default function InteractiveCode({
  initialCode,
  language = "javascript",
  onRun,
}) {
  const [code, setCode] = useState(initialCode);
  const [output, setOutput] = useState(null);
  const [isRunning, setIsRunning] = useState(false);

  const handleRun = async () => {
    setIsRunning(true);
    try {
      const result = await onRun(code);
      setOutput(result);
    } catch (error) {
      setOutput({ error: error.message });
    }
    setIsRunning(false);
  };

  return (
    <div className="border border-accent/20 rounded-lg overflow-hidden">
      <div className="bg-accent/10 p-4 flex justify-between items-center">
        <h3 className="text-lg font-medium text-white">Live Code Editor</h3>
        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleRun}
            disabled={isRunning}
            className="px-4 py-2 bg-accent text-white rounded-lg flex items-center gap-2
                     hover:bg-accent-hover disabled:opacity-50"
          >
            {isRunning ? (
              <FiRefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <FiPlay className="w-4 h-4" />
            )}
            Run Code
          </motion.button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 divide-x divide-accent/20">
        <div className="h-[400px] overflow-auto">
          <CodeMirror
            value={code}
            height="100%"
            extensions={[language === "javascript" ? javascript() : python()]}
            onChange={(value) => setCode(value)}
            theme="dark"
            className="text-sm"
          />
        </div>

        <div className="p-4 bg-black/30">
          <h4 className="text-sm font-medium text-gray-400 mb-4">Output</h4>
          {output && (
            <motion.pre
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="font-mono text-sm text-gray-300"
            >
              {typeof output === "object"
                ? JSON.stringify(output, null, 2)
                : output}
            </motion.pre>
          )}
        </div>
      </div>
    </div>
  );
}
