import { motion } from "framer-motion";
import Link from "next/link";

const GetStarted = () => {
  const steps = [
    {
      title: "Choose Your Integration",
      description:
        "Select between PyPI package, API access, or managed solution",
      icon: "🎯",
    },
    {
      title: "Quick Setup",
      description: "Follow our documentation for seamless integration",
      icon: "⚡",
    },
    {
      title: "Start Matching",
      description: "Launch your enhanced freelancer matching system",
      icon: "🚀",
    },
  ];

  return (
    <section className="py-20 bg-primary">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-heading text-accent mb-4">
            Get Started in Minutes
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Choose the integration method that works best for your platform
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              className="bg-white/5 p-8 rounded-xl text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
            >
              <div className="text-4xl mb-4">{step.icon}</div>
              <h3 className="text-xl font-heading text-accent mb-3">
                {step.title}
              </h3>
              <p className="text-gray-300">{step.description}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <Link
            href="/auth/signin"
            className="inline-block bg-accent hover:bg-accent-hover text-white px-8 py-3 rounded-lg font-primary transition-all duration-300 transform hover:scale-105"
          >
            Start Integration
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default GetStarted;
