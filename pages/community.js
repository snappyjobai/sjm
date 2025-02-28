import { motion } from "framer-motion";
import FAQ from "../components/FAQ";
import InFooter from "../components/inFooter";
import {
  IoLogoDiscord,
  IoLogoWhatsapp,
  IoLogoSkype,
  IoMail,
} from "react-icons/io5";

export default function Community() {
  const socialPlatforms = [
    {
      name: "Discord",
      icon: IoLogoDiscord,
      color: "from-[#5865F2] to-[#7289DA]",
      link: "https://discord.gg/Snapjobs-community",
      description:
        "Join our developer community for real-time support and discussions",
    },
    {
      name: "WhatsApp",
      icon: IoLogoWhatsapp,
      color: "from-[#25D366] to-[#128C7E]",
      link: "https://wa.me/yourgroup",
      description: "Connect with our support team instantly",
    },
    {
      name: "Skype",
      icon: IoLogoSkype,
      color: "from-[#00AFF0] to-[#0078D7]",
      link: "skype:your.id?chat",
      description: "Schedule one-on-one integration support calls",
    },
    {
      name: "Email",
      icon: IoMail,
      color: "from-accent to-accent-dark",
      link: "mailto:support@Snapjobs.dev",
      description: "Reach out for enterprise support",
    },
  ];

  const faqs = [
    {
      question: "How quickly can I integrate Snapjobs into my platform?",
      answer:
        "With our comprehensive SDK and documentation, most platforms achieve full integration within 2-3 days. Our support team is available to assist throughout the process.",
    },
    {
      question:
        "What makes Snapjobs's AI matching better than traditional algorithms?",
      answer:
        "Snapjobs combines multiple AI models (GPT-4, Claude) with traditional algorithms, achieving 98% matching accuracy. We analyze context, experience, and potential beyond simple keyword matching.",
    },
    {
      question: "Can Snapjobs handle high-volume requests?",
      answer:
        "Absolutely! Our system is built for enterprise scale, processing 1000+ requests per second with 99.9% uptime and consistent response times under 200ms.",
    },
    {
      question: "Is there a trial period available?",
      answer:
        "Yes! We offer a 14-day full-feature trial with our Pro plan, including technical support and up to 1000 API calls to test the system thoroughly.",
    },
    {
      question: "How do you handle data privacy and security?",
      answer:
        "We maintain strict SOC 2 compliance, implement end-to-end encryption, and follow GDPR guidelines. Your data is processed in secure, regional servers with regular security audits.",
    },
  ];

  return (
    <div className="min-h-screen bg-primary">
      {/* Hero Section */}
      <motion.div
        className="relative py-24 px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <motion.h1
            className="text-5xl md:text-6xl font-heading text-accent mb-6"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
          >
            Join Our Community
          </motion.h1>
          <motion.p
            className="text-xl text-gray-300"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Got stuck? Just reach out to us on any of the platforms below
          </motion.p>
        </div>
      </motion.div>

      {/* Social Platforms */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-8">
          {socialPlatforms.map((platform, index) => (
            <motion.a
              key={index}
              href={platform.link}
              target="_blank"
              rel="noopener noreferrer"
              className={`
                p-6 rounded-2xl bg-gradient-to-r ${platform.color}
                transform hover:scale-105 transition-all duration-300
                flex items-center gap-6 group
              `}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <platform.icon className="w-12 h-12 text-white" />
              <div>
                <h3 className="text-xl font-heading text-white mb-2">
                  {platform.name}
                </h3>
                <p className="text-white/80">{platform.description}</p>
              </div>
            </motion.a>
          ))}
        </div>
      </div>

      {/* FAQs Section */}
      <motion.div
        className="max-w-4xl mx-auto px-4 py-24"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <h2 className="text-3xl font-heading text-accent mb-12 text-center">
          Frequently Asked Questions
        </h2>
        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <FAQ key={index} {...faq} />
          ))}
        </div>
      </motion.div>

      <InFooter />
    </div>
  );
}
