import { motion } from "framer-motion";
import Link from "next/link";

const HeroSection = () => {
  return (
    <div className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-radial from-accent/20 to-transparent pointer-events-none" />

      <motion.div
        className="text-center z-10 px-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <motion.h1
          className="text-7xl font-heading text-accent mb-6"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          Snappy Job Model (SJM)
        </motion.h1>
        <motion.p
          className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          Unleash the power of AI-driven talent matching. Our hybrid
          recommendation engine combines collaborative filtering and
          content-based matching to connect you with the perfect freelancers
          instantly.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex gap-4 justify-center"
        >
          <Link href="/demo">
            <button className="bg-accent hover:bg-accent-hover text-white px-8 py-3 rounded-lg font-primary transition-all duration-300 transform hover:scale-105">
              Try AI Matching
            </button>
          </Link>
          <Link href="/docs">
            <button className="border border-accent text-accent hover:bg-accent/10 px-8 py-3 rounded-lg font-primary transition-all duration-300">
              Get Started
            </button>
          </Link>
        </motion.div>
      </motion.div>

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 w-32 h-32 bg-accent/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
          }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-40 h-40 bg-accent/10 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.5, 0.3, 0.5],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
          }}
        />
      </div>
    </div>
  );
};

export default HeroSection;
