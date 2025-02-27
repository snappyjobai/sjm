import { motion } from "framer-motion";
import { useState } from "react";
import Link from "next/link";

export default function DemoSite({
  title,
  videoUrl,
  description,
  liveUrl,
  techStack,
  metrics,
  reversed,
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`flex flex-col ${
        reversed ? "md:flex-row-reverse" : "md:flex-row"
      } gap-12 items-center`}
    >
      {/* Video Card */}
      <motion.div
        className="w-full md:w-1/2 relative"
        whileHover={{ scale: 1.02 }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
      >
        <div className="rounded-2xl overflow-hidden border border-accent/20 bg-white/5 backdrop-blur-sm">
          <video className="w-full h-auto" autoPlay muted loop playsInline>
            <source src={videoUrl} type="video/mp4" />
          </video>

          {/* Hover Overlay */}
          <motion.div
            className="absolute inset-0 bg-accent/20 flex items-center justify-center opacity-0"
            animate={{ opacity: isHovered ? 1 : 0 }}
          >
            <Link
              href={liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-white text-accent rounded-lg font-medium
                       transform hover:scale-105 transition-all duration-300"
            >
              View Live Demo
            </Link>
          </motion.div>
        </div>
      </motion.div>

      {/* Content */}
      <div className="w-full md:w-1/2 space-y-6">
        <motion.h3
          className="text-3xl font-heading text-accent"
          initial={{ opacity: 0, x: reversed ? 50 : -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          {title}
        </motion.h3>

        <motion.p
          className="text-gray-300 text-lg"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          {description}
        </motion.p>

        {/* Metrics */}
        <div className="grid grid-cols-3 gap-4 my-8">
          {Object.entries(metrics).map(([key, value], index) => (
            <motion.div
              key={key}
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="text-2xl font-bold text-accent mb-1">{value}</div>
              <div className="text-sm text-gray-400">
                {key.replace(/([A-Z])/g, " $1").trim()}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Action Buttons */}
        <motion.div
          className="flex flex-wrap gap-4 mt-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <a
            href={liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-6 py-3 bg-accent hover:bg-accent-hover 
                     text-white rounded-lg transition-all duration-300 group"
          >
            Test Live Demo
            <svg
              className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </a>

          <button
            onClick={() => window.open(`${liveUrl}/api-test`, "_blank")}
            className="inline-flex items-center px-6 py-3 border border-accent/20 
                     text-accent hover:bg-accent/10 rounded-lg transition-all duration-300"
          >
            API Documentation
          </button>
        </motion.div>

        {/* Tech Stack */}
        <div className="flex flex-wrap gap-2">
          {techStack.map((tech, index) => (
            <motion.span
              key={tech}
              className="px-3 py-1 rounded-full bg-accent/10 text-accent text-sm"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              {tech}
            </motion.span>
          ))}
        </div>
      </div>
    </div>
  );
}
