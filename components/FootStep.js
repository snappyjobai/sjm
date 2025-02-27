import { motion } from "framer-motion";

const FootStep = ({ step, index, isActive, isVisible }) => {
  return (
    <motion.div
      className={`
        relative p-8 rounded-2xl transition-all duration-700
        ${isActive ? "bg-accent/20 scale-105" : "bg-white/5"}
        ${isVisible ? "opacity-100" : "opacity-30"}
      `}
      initial={{ opacity: 0, y: 50 }}
      animate={{
        opacity: isVisible ? 1 : 0.3,
        y: isVisible ? 0 : 50,
        scale: isActive ? 1.05 : 1,
      }}
      transition={{ duration: 0.7, delay: index * 0.2 }}
    >
      {/* Glowing background effect */}
      <div
        className={`
        absolute inset-0 rounded-2xl transition-opacity duration-700
        bg-gradient-to-r from-accent/20 via-accent/5 to-transparent
        opacity-0 group-hover:opacity-100
        ${isActive ? "opacity-100" : "opacity-0"}
      `}
      />

      <div className="relative z-10 flex items-start gap-6">
        <motion.div
          className={`
            w-16 h-16 rounded-2xl flex items-center justify-center text-2xl
            backdrop-blur-sm transition-all duration-500
            ${isActive ? "bg-accent text-white" : "bg-white/10 text-gray-300"}
          `}
          whileHover={{ scale: 1.1, rotate: 5 }}
        >
          {step.icon}
        </motion.div>

        <div className="flex-grow">
          <h3 className="text-xl font-heading text-accent mb-2">
            {step.title}
          </h3>
          <p className="text-gray-300 mb-4">{step.description}</p>

          {step.details && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{
                opacity: isActive ? 1 : 0,
                height: isActive ? "auto" : 0,
              }}
              transition={{ duration: 0.5 }}
              className="space-y-3 mt-4"
            >
              {step.details.map((detail, i) => (
                <motion.div
                  key={i}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: isActive ? 0 : -20, opacity: isActive ? 1 : 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-start gap-3 text-gray-400"
                >
                  <span className="w-2 h-2 bg-accent rounded-full mt-2 animate-pulse" />
                  <span>{detail}</span>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Animated tech tags */}
          {step.technologies && (
            <motion.div
              className="mt-6 flex flex-wrap gap-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: isActive ? 1 : 0.5 }}
              transition={{ delay: 0.2 }}
            >
              {step.technologies.map((tech, i) => (
                <motion.span
                  key={i}
                  className="px-4 py-1.5 rounded-full bg-accent/10 text-accent text-sm
                           backdrop-blur-sm border border-accent/20"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                >
                  {tech}
                </motion.span>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default FootStep;
