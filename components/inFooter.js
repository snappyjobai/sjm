import { motion } from "framer-motion";
import Link from "next/link";

const InFooter = () => {
  const navItems = [
    { text: "Docs", href: "/docs" },
    { text: "Demo", href: "/demo" },
    { text: "Our Footprints", href: "/footprints" },
    { text: "Join the Community", href: "/community" },
  ];

  return (
    <footer className="py-8">
      <div className="container mx-auto flex flex-col items-center">
        <nav className="flex flex-col space-y-4">
          {navItems.map((item, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.1 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Link
                href={item.href}
                className="text-lg font-medium text-white/70 hover:text-white transition-colors duration-300"
              >
                {item.text}
              </Link>
            </motion.div>
          ))}
        </nav>
        <div className="mt-8 text-white/50 text-sm">
          © {new Date().getFullYear()} All rights reserved
        </div>
      </div>
    </footer>
  );
};

export default InFooter;
