"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { signOut } from "next-auth/react";

const navItems = [
  { name: "Questions", path: "/faq" },
  { name: "Submit Question", path: "/submit-question" },
  { name: "My Questions", path: "/my-questions" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="bg-gray-800 px-8 py-4 flex justify-between items-center shadow-md">
      <div className="text-white text-2xl font-semibold">Help System</div>
      <div className="flex items-center gap-4">
        {navItems.map(({ name, path }) => (
          <Link
            key={name}
            href={path}
            className={`px-3 py-2 rounded-md transition-colors ${
              pathname === path
                ? "bg-gray-900 text-white font-medium"
                : "text-gray-300 hover:bg-gray-700 hover:text-white"
            }`}
          >
            {name}
          </Link>
        ))}
        <button
          onClick={() => signOut()}
          className="px-3 py-2 border border-gray-400 rounded-md text-blue-400 hover:bg-blue-700 hover:text-white transition-colors"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
