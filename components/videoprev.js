import React, { useState } from "react";
import { motion } from "framer-motion";

const VideoPrev = ({ src, title, description, demoLink }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className="relative w-full md:w-[400px] h-[300px] rounded-xl overflow-hidden group"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {/* Video Container */}
      <div className="w-full h-full">
        <video
          src={src}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          autoPlay
          muted
          loop
          playsInline
        />
      </div>

      {/* Overlay */}
      <motion.div
        className="absolute inset-0 bg-black/70 flex flex-col justify-end p-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      >
        <motion.h3
          className="text-white text-2xl font-bold mb-2"
          initial={{ y: 20 }}
          animate={{ y: isHovered ? 0 : 20 }}
          transition={{ duration: 0.3 }}
        >
          {title}
        </motion.h3>

        <motion.p
          className="text-gray-300 mb-4 line-clamp-2"
          initial={{ y: 20 }}
          animate={{ y: isHovered ? 0 : 20 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          {description}
        </motion.p>

        <motion.a
          href={demoLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-primary text-white px-6 py-2 rounded-lg 
                                        transform hover:scale-105 transition-transform duration-200
                                        text-center font-medium"
          initial={{ y: 20 }}
          animate={{ y: isHovered ? 0 : 20 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          View Demo
        </motion.a>
      </motion.div>
    </motion.div>
  );
};

export default VideoPrev;
