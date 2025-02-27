import { useState, useEffect } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import Link from "next/link";
import FootStep from "../components/FootStep";
import FootprintPath from "../components/FootprintPath";
import SjmProject from "../components/SjmProject";
import InFooter from "../components/inFooter";

export default function Footprints() {
  // State management
  const [activeStep, setActiveStep] = useState(0);
  const [visibleSteps, setVisibleSteps] = useState([0]);
  const [showProject, setShowProject] = useState(false);
  const [hasReachedEnd, setHasReachedEnd] = useState(false);
  const [scrollTimeout, setScrollTimeout] = useState(null);

  // Properly setup scroll progress and spring animation
  const { scrollYProgress } = useScroll({
    offset: ["start end", "end start"],
  });

  // Create spring animation for progress bar
  const progressBarScale = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  // Smooth transitions for content
  const footprintsOpacity = useTransform(
    scrollYProgress,
    [0, 0.8, 0.9],
    [1, 1, 0]
  );

  const footprintsScale = useTransform(
    scrollYProgress,
    [0, 0.8, 0.9],
    [1, 1, 0.95]
  );

  const footprints = [
    {
      title: "Initial Research & Planning",
      description:
        "Deep dive into freelance platform challenges and AI solutions",
      icon: "🔬",
      date: "2023 Q1",
      technologies: ["Python", "NLTK", "scikit-learn"],
      details: [
        "Analyzed existing freelance platforms",
        "Identified matching algorithm limitations",
        "Researched AI/ML approaches for talent matching",
      ],
    },
    {
      title: "Core Engine Development",
      description:
        "Built hybrid matching system with collaborative and content-based filtering",
      icon: "⚙️",
      date: "2023 Q2",
      technologies: ["TensorFlow", "NumPy", "Pandas"],
      details: [
        "Implemented SkillsExtract system",
        "Developed CollaborativeModel",
        "Created ContentBasedModel",
      ],
    },
    {
      title: "AI Interview System Integration",
      description: "Added GPT-4 and Claude-powered interview capabilities",
      icon: "🤖",
      date: "2023 Q3",
      technologies: ["OpenAI API", "Claude API", "FastAPI"],
      details: [
        "Integrated multiple AI models",
        "Developed fallback mechanisms",
        "Created standardized scoring system",
      ],
    },
    {
      title: "Enterprise Optimization",
      description: "Enhanced for high-performance enterprise use",
      icon: "🚀",
      date: "2023 Q4",
      technologies: ["Docker", "Redis", "PostgreSQL"],
      details: [
        "Optimized for 1000 requests/second",
        "Implemented caching system",
        "Added white-label capabilities",
      ],
    },
  ];

  // Handle project visibility smoothly
  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const scrollPosition = window.scrollY;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollPercentage = (scrollPosition + windowHeight) / documentHeight;

      // Show project section with threshold
      if (scrollPercentage >= 0.85 && !showProject) {
        setShowProject(true);
      } else if (scrollPercentage < 0.8 && showProject) {
        setShowProject(false);
      }

      const elements = document.querySelectorAll(".footstep");
      const visible = [0];

      // Check if we're near the end of the document
      const isNearEnd = windowHeight + scrollPosition >= documentHeight - 100;

      if (isNearEnd !== hasReachedEnd) {
        setHasReachedEnd(isNearEnd);

        if (isNearEnd) {
          setTimeout(() => {
            setShowProject(true);
          }, 800);
          setShowProject(false);
        }
      }

      // Handle footstep visibility
      elements.forEach((el, index) => {
        const rect = el.getBoundingClientRect();
        if (rect.top < windowHeight * 0.7 && rect.bottom > windowHeight * 0.3) {
          visible.push(index);

          // Clear existing timeout
          if (scrollTimeout) {
            clearTimeout(scrollTimeout);
          }

          // Set new timeout for step activation
          const newTimeout = setTimeout(() => {
            setActiveStep(index);
          }, 500);

          setScrollTimeout(newTimeout);
        }
      });

      setVisibleSteps(visible);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }
    };
  }, [showProject, hasReachedEnd, scrollTimeout]); // Added required dependencies

  return (
    <div className="relative overflow-x-hidden min-h-screen">
      {/* Background elements */}
      <div className="fixed inset-0 bg-gradient-to-b from-primary via-primary/95 to-primary" />
      <div className="fixed inset-0 bg-[radial-gradient(circle,rgba(var(--accent-rgb),0.1)_1px,transparent_1px)] bg-[size:20px_20px]" />

      {/* Progress bar with spring animation */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-accent z-50 origin-left"
        style={{ scaleX: progressBarScale }}
      />

      {/* Footprints Section */}
      <motion.div
        className="relative z-10"
        style={{
          opacity: footprintsOpacity,
          scale: footprintsScale,
          transformOrigin: "center top",
        }}
      >
        <div className="max-w-4xl mx-auto px-4 py-24">
          <motion.h1
            className="text-5xl md:text-6xl font-heading text-accent mb-8 text-center"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Our Journey
          </motion.h1>

          <div className="relative space-y-24">
            <FootprintPath
              activeStep={activeStep}
              totalSteps={footprints.length}
              scrollProgress={scrollYProgress}
            />

            {footprints.map((step, index) => (
              <motion.div
                key={index}
                className="footstep relative pl-32"
                initial={{ opacity: 0, x: -50 }}
                animate={{
                  opacity: visibleSteps.includes(index) ? 1 : 0.3,
                  x: visibleSteps.includes(index) ? 0 : -50,
                }}
                transition={{ duration: 0.7, delay: index * 0.1 }}
              >
                <FootStep
                  step={step}
                  index={index}
                  isActive={index === activeStep}
                  isVisible={visibleSteps.includes(index)}
                />
              </motion.div>
            ))}
          </div>

          <motion.div
            className="mt-24 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <Link
              href="/docs"
              className="inline-block bg-accent hover:bg-accent-hover text-white 
                     px-8 py-3 rounded-lg transition-all duration-300
                     transform hover:scale-105 hover:rotate-1"
            >
              View Technical Documentation
            </Link>
          </motion.div>
        </div>
      </motion.div>

      {/* Simplified Project Section */}
      <div className="relative min-h-screen">
        <div className="sticky top-0 min-h-screen flex items-start justify-center px-4 py-16">
          <SjmProject />
        </div>
      </div>

      {/* Footer */}
      <div className="relative bg-primary">
        <InFooter />
      </div>
    </div>
  );
}
