import { motion } from "framer-motion";
import { useState, useEffect } from "react";

export default function APIDocumentation() {
  const [apiSpec, setApiSpec] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeEndpoint, setActiveEndpoint] = useState(null);

  useEffect(() => {
    fetch("/api/docs")
      .then((res) => res.json())
      .then((data) => {
        setApiSpec(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error loading API docs:", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-accent"></div>
      </div>
    );
  }

  if (!apiSpec) {
    return (
      <div className="text-center text-gray-300">
        Error loading API documentation. Please try again later.
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-heading text-accent">API Reference</h2>

      <div className="space-y-12">
        {Object.entries(apiSpec.paths).map(([path, methods], index) => (
          <motion.div
            key={path}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="border border-accent/20 rounded-lg overflow-hidden"
          >
            <div className="p-4 bg-accent/10">
              <h3 className="text-xl text-white font-mono">{path}</h3>
            </div>

            <div className="divide-y divide-accent/10">
              {Object.entries(methods).map(([method, details]) => (
                <div key={method} className="p-4">
                  <button
                    onClick={() =>
                      setActiveEndpoint(
                        activeEndpoint === `${path}-${method}`
                          ? null
                          : `${path}-${method}`
                      )
                    }
                    className="w-full flex items-center justify-between text-left"
                  >
                    <div className="flex items-center gap-4">
                      <span
                        className={`px-2 py-1 rounded text-sm uppercase font-bold
                        ${
                          method === "get"
                            ? "bg-blue-500/20 text-blue-400"
                            : method === "post"
                            ? "bg-green-500/20 text-green-400"
                            : method === "put"
                            ? "bg-yellow-500/20 text-yellow-400"
                            : "bg-red-500/20 text-red-400"
                        }`}
                      >
                        {method}
                      </span>
                      <span className="text-gray-300">{details.summary}</span>
                    </div>
                  </button>

                  {activeEndpoint === `${path}-${method}` && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="mt-4 space-y-4"
                    >
                      {details.description && (
                        <p className="text-gray-400">{details.description}</p>
                      )}

                      {details.parameters && (
                        <div>
                          <h4 className="text-accent mb-2">Parameters</h4>
                          <div className="space-y-2">
                            {details.parameters.map((param, i) => (
                              <div
                                key={i}
                                className="flex items-start gap-2 text-sm"
                              >
                                <span className="text-gray-400">
                                  {param.name}
                                </span>
                                <span className="text-accent">
                                  {param.type}
                                </span>
                                {param.required && (
                                  <span className="text-red-400">required</span>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {details.requestBody && (
                        <div>
                          <h4 className="text-accent mb-2">Request Body</h4>
                          <pre className="bg-black/30 p-4 rounded-lg overflow-x-auto">
                            <code className="text-gray-300">
                              {JSON.stringify(details.requestBody, null, 2)}
                            </code>
                          </pre>
                        </div>
                      )}

                      {details.responses && (
                        <div>
                          <h4 className="text-accent mb-2">Responses</h4>
                          {Object.entries(details.responses).map(
                            ([code, response]) => (
                              <div key={code} className="space-y-2">
                                <div className="text-sm text-gray-400">
                                  Status: {code}
                                </div>
                                <pre className="bg-black/30 p-4 rounded-lg overflow-x-auto">
                                  <code className="text-gray-300">
                                    {JSON.stringify(response.content, null, 2)}
                                  </code>
                                </pre>
                              </div>
                            )
                          )}
                        </div>
                      )}
                    </motion.div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
