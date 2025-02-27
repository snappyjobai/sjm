import FeatureBox from "../components/FeatureBox";
import InFooter from "../components/inFooter";

export default function Features() {
  const features = [
    {
      title: "B2B-Focused Solution",
      description: "Built for businesses, not just job seekers",
      icon: "🏢",
      fullText:
        "Unlike mass-application tools, SJM is a comprehensive B2B solution offering full API integration, white-labeling options, and industry-specific adaptability. Perfect for platforms like Upwork, Fiverr, or corporate hiring systems.",
      actionButtons: ["API Docs", "Integration Guide"],
    },
    {
      title: "Enterprise Performance",
      description: "Handle 1000 requests/second with 95% match precision",
      icon: "⚡",
      fullText:
        "Process API requests in under 200ms, generate AI interviews in less than 2 seconds, and maintain high accuracy across all operations. Built for high-traffic platforms that demand reliability and speed.",
      actionButtons: ["Performance Stats", "Technical Specs"],
    },
    {
      title: "Advanced AI Assessment",
      description: "GPT-4 and Claude-3 powered candidate evaluation",
      icon: "🤖",
      fullText:
        "Move beyond basic keyword matching with our AI-driven interviews, smart fallback mechanisms, and scenario-based technical evaluations. Eliminate bias through standardized AI scoring.",
      actionButtons: ["AI Features", "Demo Interview"],
    },
    {
      title: "Full Customization",
      description: "Tailor the system to your industry needs",
      icon: "🎨",
      fullText:
        "Adjust AI scoring weights, integrate via flexible APIs, and maintain your brand identity with white-labeling. SJM adapts to your business, not the other way around.",
      actionButtons: ["Customization Guide", "Integration Options"],
    },
  ];

  return (
    <div className="min-h-screen bg-primary p-10">
      <h1 className="text-4xl font-heading text-accent mb-10">Key Features</h1>
      <div className="grid md:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <div
            key={index}
            className="bg-white/5 p-6 rounded-lg hover:bg-white/10 transition-all"
          >
            <div className="text-4xl mb-4">{feature.icon}</div>
            <h3 className="text-xl font-heading text-accent mb-2">
              {feature.title}
            </h3>
            <p className="subtext text-gray-300">{feature.description}</p>
          </div>
        ))}
      </div>

      {/* Render FeatureBox components using the features array */}
      <div className="mt-6 sjmFeatureBox">
        {features.map((feature, index) => (
          <FeatureBox
            key={index}
            heading={feature.title}
            text={feature.fullText}
            actionButton={
              <>
                {feature.actionButtons.map((btn, i) => (
                  <button
                    key={i}
                    className="bg-primary text-white px-4 py-2 rounded-md mr-2 hover:bg-opacity-90 transition-all"
                  >
                    {btn}
                  </button>
                ))}
              </>
            }
          />
        ))}
      </div>

      <div className="mt-6">
        <InFooter />
      </div>
    </div>
  );
}
