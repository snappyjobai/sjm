import { motion } from "framer-motion";

const TechnologyStack = () => {
  const technologies = [
    {
      category: "Core Technology",
      items: ["Python", "NLTK", "scikit-learn", "TensorFlow"],
      icon: "🔧",
    },
    {
      category: "Deployment Options",
      items: ["PyPI Package", "REST API", "Docker Container", "Cloud Hosting"],
      icon: "🚀",
    },
    {
      category: "Integration Methods",
      items: ["API Endpoints", "SDK", "Webhooks", "Direct Implementation"],
      icon: "🔌",
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-primary/95 to-primary">
      <div className="max-w-7xl mx-auto px-4">
        <motion.h2
          className="text-4xl font-heading text-accent text-center mb-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          Built with Enterprise-Grade Technology
        </motion.h2>

        <div className="grid md:grid-cols-3 gap-8">
          {technologies.map((tech, index) => (
            <motion.div
              key={index}
              className="bg-white/5 p-8 rounded-xl"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
            >
              <div className="text-4xl mb-4">{tech.icon}</div>
              <h3 className="text-xl font-heading text-accent mb-4">
                {tech.category}
              </h3>
              <ul className="space-y-3">
                {tech.items.map((item, i) => (
                  <li key={i} className="text-gray-300 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-accent rounded-full" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TechnologyStack;
