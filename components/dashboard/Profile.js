import { useState } from "react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { EnvelopeIcon, LockClosedIcon } from "@heroicons/react/24/outline";
import ChangePasswordDialog from "./ChangePasswordDialog";

export default function Profile() {
  const { data: session } = useSession();
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-white">Profile Settings</h2>

      <div className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm text-gray-400">Name</label>
          <div className="flex items-center gap-4">
            <p className="text-white bg-white/5 px-4 py-2 rounded-lg flex-1">
              {session?.user?.name || "Not available"}
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm text-gray-400">Email</label>
          <div className="flex items-center gap-4">
            <div className="bg-white/5 px-4 py-2 rounded-lg flex-1 flex items-center gap-2">
              <EnvelopeIcon className="w-5 h-5 text-gray-400" />
              <p className="text-white">
                {session?.user?.email || "Not available"}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm text-gray-400">Password</label>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowPasswordDialog(true)}
            className="w-full flex items-center gap-2 text-accent hover:text-accent-hover bg-white/5 px-4 py-2 rounded-lg transition-colors"
          >
            <LockClosedIcon className="w-5 h-5" />
            Change Password
          </motion.button>
        </div>
      </div>

      <ChangePasswordDialog
        isOpen={showPasswordDialog}
        onClose={() => setShowPasswordDialog(false)}
      />
    </div>
  );
}
