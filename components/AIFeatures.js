import { motion } from "framer-motion";
import { useState } from "react";

const AIFeatures = () => {
  const [activeFeature, setActiveFeature] = useState(0);

  const features = [
    {
      title: "Hybrid Matching Engine",
      description:
        "Combines collaborative filtering with content-based matching for superior freelancer recommendations",
      icon: "🎯",
      details: [
        "Collaborative Model scoring based on historical success",
        "Content-based skills and profile matching",
        "Experience and rating weighted scoring",
        "Real-time refinement of matches",
      ],
    },
    {
      title: "Smart Skills Extraction",
      description: "AI-powered skill identification and validation system",
      icon: "🧠",
      details: [
        "NLTK-based keyword extraction",
        "Automatic skill normalization",
        "Smart verification against known skills",
        "Similarity matching for suggestions",
      ],
    },
    {
      title: "Intelligent Project Analysis",
      description: "Deep understanding of project requirements and matching",
      icon: "📊",
      details: [
        "TF-IDF vectorization of requirements",
        "Automated complexity assessment",
        "Budget range optimization",
        "Timeline-based matching",
      ],
    },
  ];

  return (
    <div className="py-20 bg-gradient-to-b from-primary to-primary/95">
      <div className="max-w-7xl mx-auto px-4">
        <motion.h2
          className="text-4xl font-heading text-accent text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Powered by Advanced AI
        </motion.h2>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className={`p-6 rounded-xl cursor-pointer transition-all duration-300
                ${
                  activeFeature === index
                    ? "bg-accent/20 scale-105"
                    : "bg-white/5 hover:bg-white/10"
                }
              `}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              onClick={() => setActiveFeature(index)}
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-heading text-accent mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-300 mb-4">{feature.description}</p>

              {activeFeature === index && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <ul className="space-y-2 text-sm text-gray-400">
                    {feature.details.map((detail, i) => (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="flex items-center gap-2"
                      >
                        <span className="w-1.5 h-1.5 bg-accent rounded-full" />
                        {detail}
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AIFeatures;
