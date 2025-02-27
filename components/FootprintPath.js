import { motion } from "framer-motion";

const FootprintSVG = ({ isActive, direction = 1 }) => (
  <motion.svg
    width="24"
    height="36"
    viewBox="0 0 24 36"
    className={`transform ${direction > 0 ? "" : "scale-x-[-1]"}`}
  >
    <motion.path
      d="M9.5,3.5 C13,3.5 16,6 16,9.5 C16,13 13,15.5 9.5,15.5 C6,15.5 3.5,13 3.5,9.5 C3.5,6 6,3.5 9.5,3.5 M8,17 C11.5,17 14.5,19.5 14.5,23 C14.5,26.5 11.5,29 8,29 C4.5,29 2,26.5 2,23 C2,19.5 4.5,17 8,17"
      fill={isActive ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="1"
      className={isActive ? "text-accent" : "text-white/20"}
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 1, ease: "easeInOut" }}
    />
    {isActive && (
      <motion.circle
        cx="8"
        cy="23"
        r="2"
        className="text-accent/50"
        initial={{ scale: 0 }}
        animate={{ scale: [0, 1.5, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
    )}
  </motion.svg>
);

const FootprintPath = ({ activeStep, totalSteps }) => {
  return (
    <div className="absolute left-[60px] top-0 bottom-0 w-0.5">
      {/* Glowing line background */}
      <div className="absolute inset-0 bg-gradient-to-b from-accent/5 via-white/10 to-accent/5" />

      {/* Animated progress line */}
      <motion.div
        className="absolute top-0 left-0 right-0 bg-gradient-to-b from-accent via-accent/80 to-accent/50"
        style={{
          height: `${(activeStep / (totalSteps - 1)) * 100}%`,
          filter: "blur(1px)",
        }}
        transition={{ duration: 0.7, ease: "easeInOut" }}
      />

      {/* Animated footprints */}
      <div className="absolute inset-0">
        {[...Array(totalSteps)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute left-1/2 -translate-x-1/2"
            style={{ top: `${(i / (totalSteps - 1)) * 100}%` }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: i <= activeStep ? 1 : 0.2,
              scale: i <= activeStep ? 1 : 0.8,
            }}
            transition={{ delay: i * 0.2 }}
          >
            <FootprintSVG
              isActive={i <= activeStep}
              direction={i % 2 ? 1 : -1}
            />
          </motion.div>
        ))}
      </div>

      {/* Particles effect */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-accent/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, 100],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.2,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default FootprintPath;
