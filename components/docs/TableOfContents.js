import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function TableOfContents() {
  const [headings, setHeadings] = useState([]);
  const [activeId, setActiveId] = useState("");

  useEffect(() => {
    const headingElements = Array.from(document.querySelectorAll("h2, h3"));
    const headingData = headingElements.map((heading) => ({
      id: heading.id,
      text: heading.textContent,
      level: parseInt(heading.tagName.charAt(1)),
    }));
    setHeadings(headingData);

    const handleScroll = () => {
      const headingPositions = headingElements.map((heading) => ({
        id: heading.id,
        top: heading.getBoundingClientRect().top,
      }));

      const activeHeading =
        headingPositions.find(({ top }) => top > 0) || headingPositions[0];
      if (activeHeading) {
        setActiveId(activeHeading.id);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className="space-y-2 text-sm">
      {headings.map((heading) => (
        <motion.a
          key={heading.id}
          href={`#${heading.id}`}
          className={`
            block py-1 pl-${(heading.level - 2) * 4}
            ${
              activeId === heading.id
                ? "text-accent"
                : "text-gray-400 hover:text-white"
            }
            transition-colors
          `}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.2 }}
        >
          {heading.text}
        </motion.a>
      ))}
    </nav>
  );
}
