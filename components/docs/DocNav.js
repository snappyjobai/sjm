import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { FiChevronRight } from "react-icons/fi";

export default function DocNav() {
  const router = useRouter();
  const [hoveredCategory, setHoveredCategory] = useState(null);

  const navigation = {
    "Getting Started": [
      { title: "Introduction", href: "/docs/introduction" },
      { title: "Quick Start", href: "/docs/quickstart" },
      { title: "Installation", href: "/docs/installation" },
    ],
    "SDK Integration": [
      { title: "Node.js SDK", href: "/docs/sdk/nodejs" },
      { title: "Python SDK", href: "/docs/sdk/python" },
      { title: "REST API", href: "/docs/sdk/rest" },
    ],
    "Core Features": [
      { title: "AI Matching", href: "/docs/features/ai-matching" },
      { title: "Interview System", href: "/docs/features/interview" },
      { title: "Definitions", href: "/docs/classes" },
    ],
  };

  return (
    <nav className="w-64 h-[calc(100vh-4rem)] overflow-y-auto sticky top-16 py-8 pr-4">
      {Object.entries(navigation).map(([category, items], categoryIndex) => (
        <div
          key={category}
          onMouseEnter={() => setHoveredCategory(category)}
          onMouseLeave={() => setHoveredCategory(null)}
          className="mb-8"
        >
          <motion.div
            className="relative"
            animate={{
              opacity: hoveredCategory === category ? 1 : 0.7,
            }}
          >
            <h3 className="text-sm font-semibold text-accent/80 uppercase tracking-wider mb-3">
              {category}
            </h3>
            {hoveredCategory === category && (
              <motion.div
                layoutId="category-highlight"
                className="absolute -left-4 top-0 h-full w-1 bg-accent"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
          </motion.div>

          <ul className="space-y-1">
            {items.map((item, itemIndex) => {
              const isActive = router.asPath === item.href;
              return (
                <motion.li
                  key={item.href}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    delay: categoryIndex * 0.1 + itemIndex * 0.05,
                    type: "spring",
                    stiffness: 300,
                    damping: 30,
                  }}
                >
                  <Link
                    href={item.href}
                    className={`group flex items-center px-4 py-2 rounded-lg transition-all duration-200
                      ${
                        isActive
                          ? "bg-accent text-white font-medium"
                          : "text-gray-400 hover:text-white hover:bg-accent/10"
                      }`}
                  >
                    <span className="flex-1">{item.title}</span>
                    <motion.span
                      animate={{
                        opacity: isActive ? 1 : 0,
                        x: isActive ? 0 : -10,
                      }}
                    >
                      <FiChevronRight
                        className={`w-4 h-4 ${
                          isActive ? "text-white" : "text-accent"
                        }`}
                      />
                    </motion.span>
                  </Link>
                </motion.li>
              );
            })}
          </ul>
        </div>
      ))}

      {/* Floating gradient effect */}
      <motion.div
        className="fixed bottom-0 left-0 w-64 h-32 pointer-events-none"
        animate={{
          background: [
            "radial-gradient(circle at center, rgba(var(--accent-rgb), 0.1) 0%, transparent 70%)",
            "radial-gradient(circle at center, rgba(var(--accent-rgb), 0.15) 0%, transparent 70%)",
            "radial-gradient(circle at center, rgba(var(--accent-rgb), 0.1) 0%, transparent 70%)",
          ],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </nav>
  );
}
