import { motion } from "framer-motion";
import { useState } from "react";
import {
  ClipboardIcon,
  CheckIcon,
  EyeIcon,
  XCircleIcon,
  TrashIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { AlertDialog } from "../ui/AlertDialog";

export default function ApiKeyCard({
  id,
  createdAt,
  isActive,
  revealed,
  onUpdate,
}) {
  const { data: session } = useSession();
  const [copied, setCopied] = useState(false);
  const [showRevealDialog, setShowRevealDialog] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [confirmText, setConfirmText] = useState("");
  const [revealedKey, setRevealedKey] = useState(null);

  const handleReveal = async () => {
    try {
      const response = await fetch("/api/keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reveal", keyId: id }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error);
      }

      setRevealedKey(data.key);
      setShowRevealDialog(true);
      onUpdate?.(); // Update parent state if needed
    } catch (error) {
      toast.error(error.message || "Error revealing API key");
    }
  };

  const handleCopy = () => {
    if (revealedKey) {
      navigator.clipboard.writeText(revealedKey);
      setCopied(true);
      toast.success("API key copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleAction = async (action) => {
    const expectedText =
      action === "toggle"
        ? `${isActive ? "disable" : "enable"} ${session?.user?.email} key`
        : `revoke ${session?.user?.email} key`;

    if (confirmText !== expectedText) {
      toast.error("Confirmation text doesn't match");
      return;
    }

    try {
      const response = await fetch("/api/keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action,
          keyId: id,
          enable: action === "toggle" ? !isActive : undefined,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error);
      }

      toast.success(
        action === "toggle"
          ? `API key ${isActive ? "disabled" : "enabled"} successfully`
          : "API key revoked successfully"
      );

      setShowConfirmDialog(false);
      setConfirmText("");
      onUpdate?.(); // Update parent state
    } catch (error) {
      toast.error(
        error.message ||
          `Error ${action === "toggle" ? "updating" : "revoking"} API key`
      );
    }
  };

  const confirmDialog = (
    <AlertDialog
      isOpen={showConfirmDialog}
      onClose={() => {
        setShowConfirmDialog(false);
        setConfirmText("");
        setConfirmAction(null);
      }}
      title={
        confirmAction === "toggle"
          ? `${isActive ? "Disable" : "Enable"} API Key`
          : "Revoke API Key"
      }
      description={
        <div className="space-y-4">
          <p className="text-gray-300">
            To{" "}
            {confirmAction === "toggle"
              ? isActive
                ? "disable"
                : "enable"
              : "revoke"}{" "}
            this API key, please type:
          </p>
          <code className="block bg-black/20 p-2 rounded text-accent">
            {confirmAction === "toggle"
              ? isActive
                ? "disable"
                : "enable"
              : "revoke"}{" "}
            {session?.user?.email} key
          </code>

          <input
            type="text"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white"
            placeholder="Type the confirmation text"
          />
        </div>
      }
      actionButton={
        <button
          onClick={() => handleAction(confirmAction)}
          className={`px-6 py-2 rounded-lg text-white ${
            confirmAction === "toggle"
              ? "bg-yellow-500 hover:bg-yellow-600"
              : "bg-red-500 hover:bg-red-600"
          }`}
        >
          Confirm
        </button>
      }
    />
  );

  return (
    <>
      <motion.div className="bg-white/5 backdrop-blur-sm rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div
              className={`w-2 h-2 rounded-full ${
                isActive ? "bg-green-500" : "bg-red-500"
              }`}
            />
            {revealed ? (
              <span className="text-gray-400 flex items-center gap-2">
                <CheckIcon className="w-4 h-4 text-green-500" />
                API Key Revealed
              </span>
            ) : (
              <button
                onClick={handleReveal}
                className="flex items-center space-x-2 text-accent hover:text-accent-hover"
              >
                <EyeIcon className="w-4 h-4" />
                <span>Reveal API Key</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setConfirmAction("toggle");
                setShowConfirmDialog(true);
              }}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors text-yellow-500"
              title={isActive ? "Disable API Key" : "Enable API Key"}
            >
              {isActive ? (
                <XCircleIcon className="w-5 h-5 text-yellow-500" /> // Disable Icon
              ) : (
                <CheckCircleIcon className="w-5 h-5 text-green-500" /> // Enable Icon
              )}
            </button>
            <button
              onClick={() => {
                setConfirmAction("revoke");
                setShowConfirmDialog(true);
              }}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors text-red-500"
              title="Revoke API Key"
            >
              <TrashIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="mt-2 text-xs text-gray-500">
          Created on {new Date(createdAt).toLocaleDateString()}
        </div>
      </motion.div>

      <AlertDialog
        isOpen={showRevealDialog}
        onClose={() => setShowRevealDialog(false)}
        title="🔑 Your API Key"
        description={
          <div className="space-y-4">
            <div className="bg-black/20 p-4 rounded-lg">
              <code className="text-accent break-all">{revealedKey}</code>
            </div>
            <div className="text-red-400">
              ⚠️ This key will only be shown once. Make sure to copy it now!
            </div>
            <button
              onClick={handleCopy}
              className="w-full bg-white/10 hover:bg-white/20 text-white py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {copied ? (
                <>
                  <CheckIcon className="w-5 h-5" /> Copied!
                </>
              ) : (
                <>
                  <ClipboardIcon className="w-5 h-5" /> Copy to Clipboard
                </>
              )}
            </button>
          </div>
        }
        actionButton={
          <button
            onClick={() => setShowRevealDialog(false)}
            className="bg-accent hover:bg-accent-hover text-white px-6 py-2 rounded-lg"
          >
            Done
          </button>
        }
      />

      {confirmDialog}
    </>
  );
}
