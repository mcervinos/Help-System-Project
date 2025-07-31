"use client";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import LoadingText from "@/components/loading";

export default function Home() {
  const { data: _, status } = useSession();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await signIn("credentials", { email, password, redirect: false });

    if (res?.error) {
      alert("Login data invalid! Please try again.");
    } else {
      const session = await fetch("/api/auth/session").then((res) => res.json());

      if (session?.user) {
        router.push("/faq");
      }
    }
  };

  if (status === "loading") {
    return <LoadingText />;
  }

  return (
    <main className="bg-gray-900 min-h-screen text-white p-8">
      <div className="max-w-md mx-auto bg-gray-800 p-6 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold mb-6 text-center">Login</h2>
        <form onSubmit={handleLogin} className="space-y-5">
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 bg-gray-900 text-white border border-gray-600 rounded-md"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="username"
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 bg-gray-900 text-white border border-gray-600 rounded-md"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
          <button
            type="submit"
            className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-md transition"
          >
            Entrar
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-300">
          Don’t have an account?{" "}
          <button
            onClick={() => router.push("/register")}
            className="text-blue-400 hover:underline font-medium"
          >
            Register here
          </button>
        </p>
      </div>
    </main>
  );
}
