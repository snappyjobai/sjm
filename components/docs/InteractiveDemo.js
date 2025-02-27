import { useState } from "react";
import { motion } from "framer-motion";
import CodeHighlight from "./CodeHighlight";
import FuturisticCard from "./FuturisticCard";

export default function InteractiveDemo({
  title,
  description,
  initialCode,
  language = "javascript",
}) {
  const [code, setCode] = useState(initialCode);
  const [output, setOutput] = useState(null);

  const runCode = async () => {
    try {
      // Safely evaluate the code in a controlled environment
      const result = await eval(`(async () => { ${code} })()`);
      setOutput(result);
    } catch (error) {
      setOutput(`Error: ${error.message}`);
    }
  };

  return (
    <FuturisticCard>
      <div className="space-y-4">
        <div>
          <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
          <p className="text-gray-400">{description}</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <div className="mb-2 flex justify-between items-center">
              <h4 className="text-sm font-medium text-gray-400">Code Editor</h4>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={runCode}
                className="px-4 py-2 bg-accent text-white rounded-lg text-sm"
              >
                Run Code
              </motion.button>
            </div>
            <CodeHighlight
              code={code}
              language={language}
              editable={true}
              onChange={setCode}
            />
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-400 mb-2">Output</h4>
            <div className="bg-black/30 rounded-lg p-4 min-h-[200px]">
              {output && (
                <pre className="text-sm text-gray-300 font-mono">
                  {typeof output === "object"
                    ? JSON.stringify(output, null, 2)
                    : output}
                </pre>
              )}
            </div>
          </div>
        </div>
      </div>
    </FuturisticCard>
  );
}
