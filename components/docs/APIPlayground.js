import { motion } from "framer-motion";
import { useState } from "react";
import { FiPlay, FiSave, FiCopy } from "react-icons/fi";

export default function APIPlayground({ endpoint, method, defaultParams }) {
  const [params, setParams] = useState(defaultParams);
  const [response, setResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleTest = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/playground", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ endpoint, method, params }),
      });
      const data = await res.json();
      setResponse(data);
    } catch (error) {
      setResponse({ error: error.message });
    }
    setIsLoading(false);
  };

  return (
    <div className="border border-accent/20 rounded-lg overflow-hidden">
      <div className="bg-accent/10 p-4 flex items-center justify-between">
        <h3 className="text-lg font-medium text-white">API Playground</h3>
        <div className="flex gap-2">
          <button
            onClick={handleTest}
            disabled={isLoading}
            className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent-hover
                     disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <FiPlay className="w-4 h-4" />
            Test API
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 divide-x divide-accent/20">
        <div className="p-4">
          <h4 className="text-sm font-medium text-gray-400 mb-4">
            Request Parameters
          </h4>
          <div className="space-y-4">
            {Object.entries(params).map(([key, value]) => (
              <div key={key}>
                <label className="block text-sm text-gray-400 mb-1">
                  {key}
                </label>
                <input
                  type="text"
                  value={value}
                  onChange={(e) =>
                    setParams((prev) => ({ ...prev, [key]: e.target.value }))
                  }
                  className="w-full bg-white/5 border border-accent/20 rounded-lg px-3 py-2
                           text-white placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-accent"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="p-4">
          <h4 className="text-sm font-medium text-gray-400 mb-4">Response</h4>
          {response && (
            <motion.pre
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-black/30 p-4 rounded-lg overflow-x-auto"
            >
              <code className="text-gray-300">
                {JSON.stringify(response, null, 2)}
              </code>
            </motion.pre>
          )}
        </div>
      </div>
    </div>
  );
}
