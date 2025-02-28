import { motion } from "framer-motion";
import DemoSite from "../components/DemoSite";
import InFooter from "../components/inFooter";
import Link from "next/link";
import { ChatbotIcon, SJMTestChatbot } from "../components/ChatbotIcon"; // Import the ChatbotIcon component
import { useState } from "react";

export default function Demo() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const demoSites = [
    {
      title: "Upwork Integration",
      videoUrl: "/videos/Upwork_demo.mp4",
      description:
        "Experience how Snapjobs transforms Upwork's talent matching with instant AI-powered connections. Watch freelancers get matched to perfect projects in seconds instead of days.",
      liveUrl: "/demos/upwork",
      techStack: ["Node.js", "React", "MongoDB", "GPT-4"],
      metrics: {
        matchAccuracy: "98%",
        responseTime: "0.2s",
        successRate: "95%",
      },
    },
    {
      title: "Fiverr Enhancement",
      videoUrl: "/videos/Fiverr_demo.mp4",
      description:
        "See how Snapjobs elevates Fiverr's marketplace with intelligent project-talent matching. Our AI ensures every connection is meaningful and high-potential.",
      liveUrl: "/demos/fiverr",
      techStack: ["Python", "Vue.js", "PostgreSQL", "Claude-3"],
      metrics: {
        matchAccuracy: "96%",
        responseTime: "0.3s",
        successRate: "93%",
      },
    },
  ];

  return (
    <div className="min-h-screen bg-primary">
      {/* Hero Section */}
      <div className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <motion.div
          className="absolute inset-0 bg-gradient-to-b from-accent/20 to-primary"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        />

        <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
          <h1 className="text-5xl md:text-6xl font-heading text-white mb-6">
            <motion.span
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              See Snapjobs in Action
            </motion.span>
          </h1>
          <motion.p
            className="text-xl text-gray-300"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Explore our live integrations with leading platforms
          </motion.p>
        </div>
      </div>
      {/* New AI Demo Section */}
      <motion.div
        className="bg-accent/5 py-24 px-4 border-y border-accent/20"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-heading text-accent mb-6">
              Try Our AI in Action
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Experience Snapjobs&apos;s AI capabilities firsthand. Test our
              interview system or search through our database of 500 test
              freelancers.
            </p>
          </motion.div>
        </div>
      </motion.div>
      {/* Demo Sites */}
      <div className="max-w-7xl mx-auto px-4 py-24 space-y-32">
        {demoSites.map((site, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <DemoSite {...site} reversed={index % 2 === 1} />
          </motion.div>
        ))}
      </div>
      {/* Call to Action */}
      <motion.div
        className="bg-accent/10 py-24 px-4"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-heading text-accent mb-6">
            Ready to Transform Your Platform?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join the future of talent matching. Integrate Snapjobs into your
            platform today.
          </p>
          <Link
            href="/pricing"
            className="inline-block bg-accent hover:bg-accent-hover text-white 
                     px-8 py-3 rounded-lg transition-all duration-300
                     transform hover:scale-105"
          >
            Get Started
          </Link>
        </div>
      </motion.div>
      {/* Chatbot Icon for Opening Chatbot */}
      <ChatbotIcon onOpen={() => setIsChatOpen(true)} />
      <SJMTestChatbot
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
      />
      <InFooter />
    </div>
  );
}
