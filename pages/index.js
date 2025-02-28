import HeroSection from "../components/HeroSection";
import AIFeatures from "../components/AIFeatures";
import VideoPrev from "../components/videoprev";
import InFooter from "../components/inFooter";
import { motion } from "framer-motion";
import React, { useState } from "react";
import Navbar from "../components/Navbar";
import GetStarted from "../components/GetStarted";
import TechStack from "../components/TechStack";
import Stats from "../components/Status";

export default function Home() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const videos = [
    {
      src: "/videos/Upwork_demo.mp4",
      title: "Upwork has a faster uptime!",
      description:
        "While established platforms like Upwork connect millions globally, their matching process often takes days. Enter Snapjobs - transforming the waiting game into instant connections. Experience how our AI-powered platform reduces days of searching to mere minutes, revolutionizing the way talent meets opportunity.",
      demoLink: "#",
    },
    {
      src: "/videos/Fiverr_demo.mp4",
      title: "Fiverr historic beginning transiting into faster hiring",
      description:
        "Fiverr has been a go-to platform for freelancers and clients alike. However, their hiring process can be time-consuming. Snapjobs is here to change that. Watch how our AI-powered platform matches clients with freelancers in a snap, making the hiring process faster and more efficient.",
      demoLink: "#",
    },
  ];

  return (
    <div className="min-h-screen bg-primary">
      <Navbar />
      <HeroSection />
      <AIFeatures />
      {/* Stats Section with enhanced animation */}
      <motion.div
        className="bg-white/5 py-16"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <div className="container mx-auto grid md:grid-cols-3 gap-8 px-4">
          {[
            { number: "98%", label: "Match Accuracy" },
            { number: "24h", label: "Average Hiring Time" },
            { number: "10k+", label: "Successful Matches" },
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl font-heading text-accent mb-2">
                {stat.number}
              </div>
              <div className="subtext text-gray-300">{stat.label}</div>
            </div>
          ))}
        </div>
      </motion.div>
      {/* Video Preview Section */}
      <motion.div
        className="relative max-w-[900px] mx-auto px-4 py-16"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <h3 className="text-3xl font-heading text-accent mx-6">
          See it in action
        </h3>
        <div className="flex justify-center gap-8 mt-3">
          {videos.map((video, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.2 }}
            >
              <VideoPrev {...video} />
            </motion.div>
          ))}
        </div>

        <div className="flex justify-center gap-2 mt-8">
          {videos.map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                currentIndex === index ? "bg-accent" : "bg-gray-600"
              }`}
              onClick={() => setCurrentIndex(index)}
            />
          ))}
        </div>
      </motion.div>

      <motion.div>
        <TechStack />
        <GetStarted />

        <motion.div
          className="max-w-7xl mx-auto px-4 py-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <Stats />
        </motion.div>
      </motion.div>

      <InFooter />
    </div>
  );
}
