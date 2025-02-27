import { motion, useScroll } from "framer-motion";
import { useRef } from "react";

const SjmProject = () => {
  const containerRef = useRef(null);
  const { scrollY } = useScroll();

  const sections = [
    {
      title: "Our Vision",
      content:
        "We envisioned a system that could understand the nuances of both project requirements and freelancer capabilities at a deeper level. Not just matching keywords, but truly understanding the context, experience, and potential for success.",
    },
    {
      title: "Technical Innovation",
      content:
        "We built SJM from the ground up using cutting-edge AI technologies. Our hybrid matching engine combines collaborative filtering with content-based analysis, while our interview system leverages the latest in language models (GPT-4 and Claude) for unprecedented accuracy in technical assessment.",
    },
    {
      title: "Enterprise Focus",
      content:
        "While others focus on individual freelancers, we've built SJM specifically for businesses. Our system processes 1000 requests per second with 95% match accuracy, making it perfect for high-volume platforms and enterprise hiring systems.",
    },
    {
      title: "Integration & Customization",
      content:
        "We understand that every platform is unique. That's why we've made SJM highly customizable, offering multiple integration options:\n- PyPI package for direct implementation\n- REST API for seamless integration\n- White-label solutions for complete brand control\n- Custom deployments for specific needs",
    },
    {
      title: "Looking Forward",
      content:
        "We're continuously evolving SJM, incorporating new AI models and optimization techniques. Our commitment is to keep pushing the boundaries of what's possible in talent matching, making the hiring process faster, more accurate, and more efficient for platforms worldwide.",
    },
  ];

  return (
    <motion.div
      ref={containerRef}
      className="max-w-4xl mx-auto p-8 bg-primary/1 rounded-2xl"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.h2
        className="text-4xl font-heading text-accent mb-12 text-center sticky top-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        SJM: The Project
      </motion.h2>

      <div className="space-y-32">
        {" "}
        {/* Increased spacing between sections */}
        {sections.map((section, index) => (
          <motion.section
            key={index}
            className="relative"
            initial={{ opacity: 0 }}
            whileInView={{
              opacity: 1,
              transition: { duration: 0.5 },
            }}
            viewport={{
              once: false,
              margin: "-40% 0px -40% 0px",
            }}
          >
            <motion.div
              className="space-y-4"
              style={{
                opacity: scrollY.get() > 0 ? 1 : 0.3,
              }}
            >
              <motion.h3
                className="text-xl text-accent font-heading sticky top-24"
                style={{
                  opacity: 1,
                }}
              >
                {section.title}
              </motion.h3>

              <motion.p
                className="text-gray-300 leading-relaxed"
                whileInView={{
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.5 },
                }}
                viewport={{
                  once: false,
                  amount: 0.8,
                }}
                style={{
                  opacity: 0.3,
                  y: 20,
                }}
              >
                {section.content}
              </motion.p>
            </motion.div>

            {/* Progress indicator */}
            <motion.div
              className="absolute left-[-20px] top-0 w-1 h-full bg-accent/20"
              style={{
                scaleY: scrollY.get() > 0 ? 1 : 0,
                transformOrigin: "top",
              }}
            />
          </motion.section>
        ))}
      </div>
    </motion.div>
  );
};

export default SjmProject;
