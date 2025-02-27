import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import ApiKeyCard from "./ApiKeyCard";
import { PlusIcon, SparklesIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import toast from "react-hot-toast";
import { AlertDialog } from "../ui/AlertDialog";

const PLAN_LIMITS = {
  free: { limit: 1, name: "Free" },
  pro: { limit: 3, name: "Pro" },
  enterprise: { limit: 10, name: "Enterprise" },
};

export default function ApiManagement() {
  const { data: session, status } = useSession();
  const [apiKeys, setApiKeys] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showLimitDialog, setShowLimitDialog] = useState(false);

  const userPlan = session?.user?.planType || "free";
  const planLimit = PLAN_LIMITS[userPlan]?.limit || 1;
  const hasReachedLimit = apiKeys.length >= planLimit;

  useEffect(() => {
    if (status === "authenticated") {
      fetchApiKeys();
    }
  }, [status]);

  const fetchApiKeys = async () => {
    try {
      const response = await fetch("/api/keys", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (!response.ok) throw new Error("Failed to fetch API keys");

      const data = await response.json();
      setApiKeys(data.keys || []);
    } catch (error) {
      toast.error("Failed to load API keys");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const generateNewKey = async () => {
    if (hasReachedLimit) {
      setShowLimitDialog(true);
      return;
    }

    setIsGenerating(true);
    try {
      const response = await fetch("/api/keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "generate" }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 403) {
          setShowLimitDialog(true);
        }
        throw new Error(data.error);
      }

      if (data.key) {
        setApiKeys([...apiKeys, data.key]);
        toast.success("API key generated successfully!");
      }
    } catch (error) {
      toast.error(error.message || "Failed to generate API key");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleKeyUpdate = async () => {
    await fetchApiKeys();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">API Keys</h2>
          <p className="text-sm text-gray-400 mt-1">
            {hasReachedLimit
              ? `You've reached the limit (${apiKeys.length}/${planLimit})`
              : `${apiKeys.length} of ${planLimit} API keys used`}
          </p>
        </div>

        {/* Generate Button */}
        <div className="relative group">
          <motion.button
            whileHover={!hasReachedLimit ? { scale: 1.02 } : {}}
            whileTap={!hasReachedLimit ? { scale: 0.98 } : {}}
            onClick={generateNewKey}
            disabled={isGenerating || hasReachedLimit}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-lg transition-colors
              ${
                hasReachedLimit
                  ? "bg-gray-600 cursor-not-allowed"
                  : "bg-accent hover:bg-accent-hover"
              } text-white disabled:opacity-50
            `}
          >
            <PlusIcon className="w-5 h-5" />
            {isGenerating ? "Generating..." : "Generate New Key"}
          </motion.button>

          {hasReachedLimit && (
            <div className="absolute bottom-full mb-2 w-max left-1/2 -translate-x-1/2 px-3 py-1 bg-black/90 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity">
              You've reached the limit. Upgrade or revoke existing keys.
              <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-black/90" />
            </div>
          )}
        </div>
      </div>

      {/* Limit Dialog */}
      <AlertDialog
        isOpen={showLimitDialog}
        onClose={() => setShowLimitDialog(false)}
        title={
          <div className="flex items-center gap-2 text-accent">
            <SparklesIcon className="w-6 h-6" />
            <span>API Key Limit Reached</span>
          </div>
        }
        description={
          <div className="space-y-4">
            <div className="p-4 bg-white/5 rounded-lg border border-white/10">
              <p className="text-white mb-2">
                You've reached the limit of {planLimit} API{" "}
                {planLimit === 1 ? "key" : "keys"} for your{" "}
                {PLAN_LIMITS[userPlan].name} plan.
              </p>
              <p className="text-sm text-gray-400">
                To generate more API keys, you can:
              </p>
              <ul className="list-disc list-inside mt-2 text-sm text-gray-400">
                <li>Upgrade to a higher plan</li>
                <li>Revoke unused API keys</li>
              </ul>
            </div>

            <div className="flex gap-3">
              <Link href="/pricing" className="flex-1">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-accent hover:bg-accent-hover text-white px-4 py-2 rounded-lg"
                >
                  View Plans
                </motion.button>
              </Link>
              <button
                onClick={() => setShowLimitDialog(false)}
                className="flex-1 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg"
              >
                Manage Keys
              </button>
            </div>
          </div>
        }
      />

      {/* API Keys List */}
      <div className="space-y-4">
        {apiKeys.map((key) => (
          <ApiKeyCard key={key.id} {...key} onUpdate={handleKeyUpdate} />
        ))}

        {apiKeys.length === 0 && (
          <div className="text-center py-12 text-gray-400 bg-white/5 rounded-lg backdrop-blur-sm">
            <p className="mb-2">No API keys generated yet</p>
            <p className="text-sm">
              Generate your first API key to get started
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
