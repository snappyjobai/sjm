import { signIn } from "next-auth/react";

export default function Login() {
  return (
    <div className="text-center p-10">
      <h1 className="text-3xl font-bold">Login</h1>

      <button
        onClick={() => signIn("google")}
        className="mt-6 bg-blue-500 text-white px-6 py-2 rounded"
      >
        Sign in with Google
      </button>
    </div>
  );
}
