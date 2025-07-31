"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import LoadingText from "@/components/loading";

const departments = ['IT', 'HR', 'Sales', 'Marketing', 'Finance', 'Operations', 'Customer Service'];

export default function Register() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [department, setDepartment] = useState("");
  const { data: _, status } = useSession();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    const isPasswordComplex = (password: string) => {
      const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,32}$/;
      return regex.test(password);
    };

    if (!isPasswordComplex(password)) {
      alert("Password must be 8–32 characters and include a lowercase letter, an uppercase letter, a number, and a symbol.");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, name, department }),
    });

    if (res.ok) {
      alert("Registration successful!");
      router.push("/login");
    } else {
      const error = await res.text();
      alert("Registration failed: " + error);
    }
  };

  if (status === "loading") {
    return <LoadingText />;
  }

  return (
    <main className="bg-gray-900 min-h-screen text-white p-8">
      <div className="max-w-3xl mx-auto bg-gray-800 p-6 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold mb-6 text-center">Register</h2>
        <form onSubmit={handleRegister} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <input
                type="email"
                placeholder="Email"
                className="w-full p-3 bg-gray-900 text-white border border-gray-600 rounded-md"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                type="password"
                maxLength={32}
                placeholder="Password"
                className="w-full p-3 bg-gray-900 text-white border border-gray-600 rounded-md"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <input
                type="password"
                maxLength={32}
                placeholder="Confirm Password"
                className="w-full p-3 bg-gray-900 text-white border border-gray-600 rounded-md"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <input
                type="text"
                placeholder="Full Name"
                className="w-full p-3 bg-gray-900 text-white border border-gray-600 rounded-md"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <select
                className="w-full p-3 bg-gray-900 text-white border border-gray-600 rounded-md"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                required
              >
                <option value="" disabled>Select Department</option>
                {departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>

            <div className="bg-gray-700 p-4 rounded-md text-sm max-h-[180px]">
              <p className="font-semibold text-blue-300 mb-2">Password must contain:</p>
              <ul className="space-y-1 list-disc ml-5">
                <li className={/[a-z]/.test(password) ? "text-green-400 font-semibold" : "text-gray-400"}>Lowercase letter</li>
                <li className={/[A-Z]/.test(password) ? "text-green-400 font-semibold" : "text-gray-400"}>Uppercase letter</li>
                <li className={/\d/.test(password) ? "text-green-400 font-semibold" : "text-gray-400"}>Number</li>
                <li className={/[^A-Za-z0-9]/.test(password) ? "text-green-400 font-semibold" : "text-gray-400"}>Symbol</li>
                <li className={(password.length >= 8 && password.length <= 32) ? "text-green-400 font-semibold" : "text-gray-400"}>
                  8–32 characters
                </li>
              </ul>
            </div>
          </div>
          <div className="flex justify-center gap-4">
            <button
              type="submit"
              className="px-6 py-2 bg-green-600 hover:bg-green-500 text-white font-medium rounded-md transition"
            >
              Register
            </button>
            <button
              type="button"
              onClick={() => router.push("/login")}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-md transition"
            >
              Return
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
