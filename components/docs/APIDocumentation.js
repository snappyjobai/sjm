import { motion } from "framer-motion";
import CodeHighlight from "./CodeHighlight";
import ApiVisualizer from "./ApiVisualizer";

export default function APIDocumentation() {
  const endpoints = [
    {
      path: "/api/v1/match",
      method: "POST",
      description: "Find matching freelancers",
      parameters: {
        projectDescription: "string",
        requiredSkills: "string[]",
        budget: { min: "number", max: "number" },
      },
    },
    // More endpoints...
  ];

  return (
    <div className="space-y-12">
      {endpoints.map((endpoint) => (
        <motion.div
          key={endpoint.path}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="border border-accent/20 rounded-lg p-6"
        >
          <h3 className="text-xl font-bold text-white mb-4">
            {endpoint.method} {endpoint.path}
          </h3>
          <p className="text-gray-400 mb-6">{endpoint.description}</p>
          <ApiVisualizer endpoint={endpoint.path} method={endpoint.method} />
          <div className="mt-6">
            <h4 className="text-sm font-semibold text-gray-400 mb-2">
              Parameters
            </h4>
            <CodeHighlight
              code={JSON.stringify(endpoint.parameters, null, 2)}
              language="json"
            />
          </div>
        </motion.div>
      ))}
    </div>
  );
}
