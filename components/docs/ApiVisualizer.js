import { motion } from "framer-motion";
import { useState } from "react";
import FuturisticCard from "./FuturisticCard";
import { FiSend, FiServer, FiDatabase } from "react-icons/fi";

export default function ApiVisualizer({
  endpoint,
  method = "GET",
  sampleRequest,
}) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [flowSteps, setFlowSteps] = useState([]);

  const startVisualization = () => {
    setIsAnimating(true);
    setFlowSteps([
      { id: "request", label: "Client Request", status: "active" },
      { id: "auth", label: "Authentication", status: "pending" },
      { id: "processing", label: "AI Processing", status: "pending" },
      { id: "response", label: "Server Response", status: "pending" },
    ]);

    // Simulate flow
    const timings = [1000, 2000, 3000];
    timings.forEach((delay, index) => {
      setTimeout(() => {
        setFlowSteps((prev) =>
          prev.map((step, i) => ({
            ...step,
            status: i <= index + 1 ? "active" : "pending",
          }))
        );
      }, delay);
    });

    setTimeout(() => setIsAnimating(false), 4000);
  };

  return (
    <FuturisticCard>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-bold text-white">
            <span className="text-accent">{method}</span> {endpoint}
          </h3>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={startVisualization}
            disabled={isAnimating}
            className="px-4 py-2 bg-accent text-white rounded-lg"
          >
            Visualize Flow
          </motion.button>
        </div>

        <div className="relative py-12">
          {/* Connection lines */}
          <svg className="absolute inset-0 w-full h-full">
            {flowSteps.map(
              (_, index) =>
                index < flowSteps.length - 1 && (
                  <motion.line
                    key={index}
                    x1={`${(100 / (flowSteps.length - 1)) * index}%`}
                    y1="50%"
                    x2={`${(100 / (flowSteps.length - 1)) * (index + 1)}%`}
                    y2="50%"
                    stroke="currentColor"
                    className="text-accent/20"
                    strokeWidth="2"
                    initial={{ pathLength: 0 }}
                    animate={{
                      pathLength: flowSteps[index].status === "active" ? 1 : 0,
                    }}
                  />
                )
            )}
          </svg>

          {/* Steps */}
          <div className="relative flex justify-between">
            {flowSteps.map((step, index) => (
              <motion.div
                key={step.id}
                className="flex flex-col items-center"
                animate={{
                  scale: step.status === "active" ? 1.1 : 1,
                  opacity: step.status === "pending" ? 0.5 : 1,
                }}
              >
                <motion.div
                  className={`w-8 h-8 rounded-full ${
                    step.status === "active" ? "bg-accent" : "bg-accent/20"
                  } flex items-center justify-center`}
                  animate={{
                    boxShadow:
                      step.status === "active"
                        ? "0 0 20px rgba(var(--accent-rgb), 0.5)"
                        : "0 0 0 rgba(var(--accent-rgb), 0)",
                  }}
                >
                  {index + 1}
                </motion.div>
                <div className="mt-2 text-sm text-gray-400">{step.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      <div className="relative h-64 bg-black/20 rounded-lg p-6">
        <div className="flex justify-between items-center">
          <motion.div
            className="flex items-center gap-4"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
          >
            <FiSend className="text-accent" />
            <div className="text-sm">
              <div className="text-gray-400">Request</div>
              <div className="text-white font-mono">
                {method} {endpoint}
              </div>
            </div>
          </motion.div>

          <motion.div
            animate={{
              x: [0, 100, 0],
              opacity: [1, 0.5, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="h-0.5 w-20 bg-accent/30"
          />

          <motion.div
            className="flex items-center gap-4"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <FiServer className="text-accent" />
            <div className="text-sm text-gray-400">API Server</div>
          </motion.div>
        </div>
      </div>
    </FuturisticCard>
  );
}
