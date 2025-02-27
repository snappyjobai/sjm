import Link from "next/link";
import { motion } from "framer-motion";
import CodeTabs from "./CodeTabs";
import ApiVisualizer from "./ApiVisualizer";
import FuturisticCard from "./FuturisticCard";
import CodeHighlight from "./CodeHighlight";
import FeaturedExample from "./FeaturedExample";
import InteractiveDemo from "./InteractiveDemo";
import { FiArrowRight } from "react-icons/fi";

const MDXComponents = {
  // Basic HTML overrides
  h1: (props) => <h1 className="text-4xl font-bold mb-8" {...props} />,
  h2: (props) => <h2 className="text-3xl font-bold mb-6 mt-12" {...props} />,
  h3: (props) => <h3 className="text-2xl font-bold mb-4 mt-8" {...props} />,
  p: (props) => <p className="mb-4 text-gray-300" {...props} />,
  a: ({ href, ...props }) => (
    <Link
      href={href || "#"}
      className="text-blue-400 hover:text-blue-300"
      {...props}
    />
  ),

  // Custom components
  CodeTabs,
  ApiVisualizer,
  FuturisticCard,
  CodeHighlight,
  FeaturedExample,
  InteractiveDemo,
  motion,
  FiArrowRight,
  Link,

  // Code blocks
  pre: CodeHighlight,

  // Wrapper for consistent styling
  wrapper: ({ children }) => (
    <div className="mdx-wrapper prose prose-invert max-w-none">{children}</div>
  ),
};

export default MDXComponents;
