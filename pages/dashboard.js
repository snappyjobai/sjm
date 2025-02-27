import { useSession } from "next-auth/react";
import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import ApiManagement from "../components/dashboard/ApiManagement";
import Profile from "../components/dashboard/Profile";
import PlanOverview from "../components/dashboard/PlanOverview";
import {
  KeyIcon,
  UserIcon,
  DocumentTextIcon,
  SparklesIcon,
  ArrowTopRightOnSquareIcon,
} from "@heroicons/react/24/outline";

export default function Dashboard() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState("apis");

  const tabs = [
    { id: "apis", name: "API Keys", icon: KeyIcon },
    { id: "profile", name: "Profile", icon: UserIcon },
    { id: "plan", name: "Plan & Billing", icon: SparklesIcon },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return <Profile />;
      case "plan":
        return <PlanOverview />;
      default:
        return <ApiManagement />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary to-primary/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Side Navigation */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="md:w-64 shrink-0"
          >
            <div className="backdrop-blur-xl bg-white/5 rounded-2xl p-4 border border-white/10 shadow-xl">
              <div className="mb-6 p-4">
                <h2 className="text-xl font-bold text-white mb-2">Dashboard</h2>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent to-accent-hover flex items-center justify-center text-white font-semibold">
                    {session?.user?.name?.[0] || session?.user?.email?.[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white truncate">
                      {session?.user?.name}
                    </p>
                    <p className="text-xs text-gray-400 truncate">
                      {session?.user?.email}
                    </p>
                  </div>
                </div>
              </div>

              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <motion.button
                    key={tab.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                      activeTab === tab.id
                        ? "bg-accent text-white shadow-lg shadow-accent/25"
                        : "text-gray-400 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <tab.icon className="w-5 h-5" />
                    {tab.name}
                  </motion.button>
                ))}

                <Link
                  href="/docs"
                  target="_blank"
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all duration-200"
                >
                  <DocumentTextIcon className="w-5 h-5" />
                  <span className="flex-1">View Docs</span>
                  <ArrowTopRightOnSquareIcon className="w-4 h-4" />
                </Link>
              </nav>
            </div>
          </motion.div>

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex-1 backdrop-blur-xl bg-white/5 rounded-2xl p-6 border border-white/10 shadow-xl"
          >
            {renderContent()}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
