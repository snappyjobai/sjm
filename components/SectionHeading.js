import { motion } from "framer-motion";

/**
 * SectionHeading component for page sections
 *
 * @param {object} props - Component props
 * @param {string} props.title - The main section title
 * @param {string} props.subtitle - Subtitle or description text
 * @returns {JSX.Element} Animated section heading
 */
const SectionHeading = ({ title, subtitle }) => {
  return (
    <div className="text-center mb-16">
      <motion.h2
        className="text-4xl font-heading mb-4 text-accent"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        {title}
      </motion.h2>
      <motion.p
        className="text-xl text-gray-400 max-w-2xl mx-auto"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {subtitle}
      </motion.p>
    </div>
  );
};

export default SectionHeading;
