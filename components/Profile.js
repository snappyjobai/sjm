import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { LockClosedIcon, RocketLaunchIcon } from "@heroicons/react/24/outline";

export default function Profile() {
  const { data: session } = useSession();

  const planFeatures = {
    free: {
      name: "Free",
      features: [
        "1 API Key",
        "100 requests/day",
        "Basic Support",
        "Standard Security",
      ],
      price: "0",
    },
    pro: {
      name: "Pro",
      features: [
        "3 API Keys",
        "1000 requests/day",
        "Priority Support",
        "Enhanced Security",
        "Custom Headers",
      ],
      price: "29",
    },
    enterprise: {
      name: "Enterprise",
      features: [
        "Unlimited API Keys",
        "Unlimited requests",
        "24/7 Support",
        "Advanced Security",
        "Custom Integration",
        "Dedicated Server",
      ],
      price: "299",
    },
  };

  const currentPlan = planFeatures[session?.user?.planType || "free"];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      {/* User Info */}
      <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 space-y-4">
        <h2 className="text-xl font-bold text-white">Profile Information</h2>
        <div className="space-y-3">
          <div>
            <label className="text-sm text-gray-400">Name</label>
            <p className="text-white">{session?.user?.name}</p>
          </div>
          <div>
            <label className="text-sm text-gray-400">Email</label>
            <p className="text-white">{session?.user?.email}</p>
          </div>
        </div>
      </div>

      {/* Current Plan */}
      <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">Current Plan</h2>
          <span className="px-3 py-1 rounded-full bg-accent text-white text-sm">
            {currentPlan.name}
          </span>
        </div>

        <ul className="space-y-3 mb-6">
          {currentPlan.features.map((feature, index) => (
            <motion.li
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center text-gray-300"
            >
              <RocketLaunchIcon className="w-4 h-4 mr-2 text-accent" />
              {feature}
            </motion.li>
          ))}
        </ul>

        {session?.user?.planType !== "enterprise" && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-accent hover:bg-accent-hover text-white py-2 rounded-lg transition-colors"
          >
            Upgrade Plan
          </motion.button>
        )}
      </div>

      {/* Security */}
      <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <LockClosedIcon className="w-5 h-5 text-accent" />
          <h2 className="text-xl font-bold text-white">Security</h2>
        </div>
        <button className="text-accent hover:text-accent-hover transition-colors">
          Change Password
        </button>
      </div>
    </motion.div>
  );
}
