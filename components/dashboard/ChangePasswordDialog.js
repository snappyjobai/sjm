import { useState } from "react";
import { motion } from "framer-motion";
import { AlertDialog } from "../ui/AlertDialog";
import toast from "react-hot-toast";

export default function ChangePasswordDialog({ isOpen, onClose }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("New passwords don't match");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/user/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error);
      }

      toast.success("Password changed successfully");
      onClose();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AlertDialog
      isOpen={isOpen}
      onClose={onClose}
      title="Change Password"
      description={
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm text-gray-400">Current Password</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 mt-1 text-white focus:outline-none focus:border-accent"
              required
            />
          </div>
          <div>
            <label className="text-sm text-gray-400">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 mt-1 text-white focus:outline-none focus:border-accent"
              required
            />
          </div>
          <div>
            <label className="text-sm text-gray-400">
              Confirm New Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 mt-1 text-white focus:outline-none focus:border-accent"
              required
            />
          </div>
        </form>
      }
      actionButton={
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSubmit}
          disabled={isLoading}
          className="bg-accent hover:bg-accent-hover text-white px-6 py-2 rounded-lg transition-colors disabled:opacity-50"
        >
          {isLoading ? "Changing..." : "Change Password"}
        </motion.button>
      }
    />
  );
}
