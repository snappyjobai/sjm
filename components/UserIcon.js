import { useRouter } from "next/router";
import { useMemo } from "react";

export default function UserIcon({ name, email }) {
  const router = useRouter();

  const backgroundColor = useMemo(() => {
    const colors = [
      "bg-blue-500",
      "bg-purple-500",
      "bg-green-500",
      "bg-red-500",
      "bg-yellow-500",
      "bg-pink-500",
    ];
    // Generate consistent color based on email
    const index = email
      .split("")
      .reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[index % colors.length];
  }, [email]);

  const initial = useMemo(() => {
    return (name || email || "?")[0].toUpperCase();
  }, [name, email]);

  return (
    <button
      onClick={() => router.push("/dashboard")}
      className={`${backgroundColor} w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-lg transition-transform hover:scale-110`}
      title="Go to Dashboard"
    >
      {initial}
    </button>
  );
}
