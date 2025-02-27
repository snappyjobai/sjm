import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { SparklesIcon, CheckIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

export default function PlanOverview() {
  const { data: session } = useSession();
  const userPlan = session?.user?.planType || "free";

  const plans = {
    free: {
      name: "Free Plan",
      description: "For personal projects and testing",
      color: "from-blue-500 to-blue-600",
      features: [
        "1 API Key",
        "100 requests/day",
        "Basic Support",
        "Standard Security",
      ],
      apiKeyLimit: 1,
      requestLimit: 100,
    },
    pro: {
      name: "Pro Plan",
      description: "For growing businesses",
      color: "from-purple-500 to-purple-600",
      features: [
        "3 API Keys",
        "1000 requests/day",
        "Priority Support",
        "Enhanced Security",
        "Custom Headers",
      ],
      apiKeyLimit: 3,
      requestLimit: 1000,
    },
    enterprise: {
      name: "Enterprise Plan",
      description: "For large-scale operations",
      color: "from-accent to-accent-hover",
      features: [
        "Unlimited API Keys",
        "Unlimited requests",
        "24/7 Support",
        "Advanced Security",
        "Custom Integration",
        "White Labeling",
      ],
      apiKeyLimit: "Unlimited",
      requestLimit: "Unlimited",
    },
  };

  const currentPlan = plans[userPlan];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-white">Plan & Billing</h2>
          <p className="text-gray-400 mt-1">
            Manage your subscription and usage
          </p>
        </div>
        {userPlan !== "enterprise" && (
          <Link href="/pricing">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-accent hover:bg-accent-hover text-white px-4 py-2 rounded-lg transition-colors"
            >
              Upgrade Plan
            </motion.button>
          </Link>
        )}
      </div>

      {/* Current Plan Overview */}
      <div className={`bg-gradient-to-r ${currentPlan.color} rounded-xl p-6`}>
        <div className="flex items-center gap-3 mb-4">
          <SparklesIcon className="w-6 h-6 text-white" />
          <h3 className="text-xl font-bold text-white">{currentPlan.name}</h3>
        </div>
        <p className="text-white/80 mb-6">{currentPlan.description}</p>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-black/20 rounded-lg p-4">
            <p className="text-sm text-white/60">API Keys</p>
            <p className="text-2xl font-bold text-white">
              {currentPlan.apiKeyLimit}
            </p>
          </div>
          <div className="bg-black/20 rounded-lg p-4">
            <p className="text-sm text-white/60">Daily Requests</p>
            <p className="text-2xl font-bold text-white">
              {currentPlan.requestLimit}
            </p>
          </div>
        </div>
      </div>

      {/* Plan Features */}
      <div className="bg-white/5 rounded-xl p-6">
        <h4 className="text-lg font-semibold text-white mb-4">Plan Features</h4>
        <ul className="space-y-3">
          {currentPlan.features.map((feature, index) => (
            <motion.li
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center gap-3 text-gray-300"
            >
              <CheckIcon className="w-5 h-5 text-accent" />
              {feature}
            </motion.li>
          ))}
        </ul>
      </div>
    </div>
  );
}
