import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { IoClose, IoSend } from "react-icons/io5";

export default function InterviewDemo({ isOpen, onClose }) {
  const [messages, setMessages] = useState([
    {
      type: "bot",
      content:
        "Hi! I'm Snapjobs AI. I can help evaluate your skills or find the perfect freelancer from our test database of 500 professionals. What would you like to do?",
      options: ["Test Interview", "Find Freelancer"],
    },
  ]);
  const [inputValue, setInputValue] = useState("");

  const handleSend = () => {
    if (!inputValue.trim()) return;

    setMessages((prev) => [
      ...prev,
      {
        type: "user",
        content: inputValue,
      },
    ]);

    // Simulate AI response
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          type: "bot",
          content: "This is a demo version. Full AI integration coming soon!",
        },
      ]);
    }, 1000);

    setInputValue("");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed bottom-24 right-8 w-96 h-[600px] bg-primary rounded-2xl shadow-2xl z-40 overflow-hidden border border-accent/20"
          initial={{ opacity: 0, y: 100, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 100, scale: 0.8 }}
        >
          {/* Header */}
          <div className="p-4 bg-accent/10 border-b border-accent/20 flex justify-between items-center">
            <h3 className="text-lg font-medium text-accent">Snapjobs AI Demo</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white"
            >
              <IoClose className="w-6 h-6" />
            </button>
          </div>

          {/* Chat Area */}
          <div className="h-[calc(100%-8rem)] overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${
                  message.type === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.type === "user"
                      ? "bg-accent text-white"
                      : "bg-white/10 text-gray-300"
                  }`}
                >
                  {message.content}
                  {message.options && (
                    <div className="mt-3 space-y-2">
                      {message.options.map((option) => (
                        <button
                          key={option}
                          className="block w-full text-left px-3 py-2 rounded bg-white/10 hover:bg-white/20 transition-colors"
                          onClick={() => setInputValue(option)}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Input Area */}
          <div className="h-16 p-3 border-t border-accent/20 flex gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSend()}
              placeholder="Type your message..."
              className="flex-1 bg-white/10 rounded-lg px-4 text-white placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-accent"
            />
            <button
              onClick={handleSend}
              className="w-12 h-12 rounded-lg bg-accent text-white flex items-center justify-center hover:bg-accent-hover transition-colors"
            >
              <IoSend />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
