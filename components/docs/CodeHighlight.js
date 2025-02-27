import { motion } from "framer-motion";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { useState } from "react";

export default function CodeHighlight({ code = "", language = "javascript" }) {
  const [isCopied, setIsCopied] = useState(false);

  // Ensure code is a string
  const codeString =
    typeof code === "string" ? code : JSON.stringify(code, null, 2);
  const lines = codeString.split("\n");

  const handleCopy = () => {
    navigator.clipboard.writeText(codeString);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const customStyle = {
    ...atomDark,
    'pre[class*="language-"]': {
      ...atomDark['pre[class*="language-"]'],
      background: "transparent",
      margin: 0,
    },
  };

  return (
    <motion.div className="relative group">
      <div className="absolute inset-0 bg-gradient-to-r from-accent/5 via-accent/10 to-accent/5 rounded-lg" />
      <div className="relative rounded-lg overflow-hidden">
        <SyntaxHighlighter
          language={language}
          style={customStyle}
          className="!bg-black/40 !p-4"
        >
          {codeString}
        </SyntaxHighlighter>

        <motion.button
          onClick={handleCopy}
          className="absolute top-2 right-2 px-3 py-1 rounded-md text-sm
                   bg-accent/10 hover:bg-accent/20 text-accent transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isCopied ? "Copied!" : "Copy"}
        </motion.button>

        <div className="absolute left-0 top-0 bottom-0 w-12 bg-black/20 flex flex-col items-center py-4 text-xs text-gray-500">
          {lines.map((_, i) => (
            <div key={i}>{i + 1}</div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
