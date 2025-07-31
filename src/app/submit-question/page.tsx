"use client";
import { useRouter } from "next/navigation";
import Navbar from "@/components/navbar";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import LoadingText from "@/components/loading";

const departments = [
  "IT",
  "HR",
  "Sales",
  "Marketing",
  "Finance",
  "Operations",
  "Customer Service",
];

export default function Submit() {
  const { data: _, status } = useSession();
  const router = useRouter();

  const [formData, setFormData] = useState({
    title: "",
    department: departments[0],
    question: "",
  });

  useEffect(() => {
    if (status !== "authenticated") {
      router.push("/login");
    }
  }, [status, router]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/submit-question", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        router.push("/faq");
      } else {
        alert("Submission failed. Please try again.");
      }
    } catch (err) {
      console.error("Submit error:", err);
      alert("Something went wrong.");
    }
  };

  if (status === "loading") {
    return <LoadingText />;
  }

  return (
    <>
      <Navbar />
      <main className="bg-gray-900 min-h-screen text-white p-8">
        <div className="max-w-2xl mx-auto bg-gray-800 p-6 rounded-lg shadow-lg">
          <h1 className="text-3xl font-bold mb-6 text-center">Submit a Question</h1>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="title" className="block font-medium mb-1">
                Title
              </label>
              <input
                id="title"
                name="title"
                type="text"
                className="w-full p-3 rounded-md bg-gray-900 text-white border border-gray-600 focus:outline-none focus:ring focus:ring-blue-500"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label htmlFor="department" className="block font-medium mb-1">
                Department
              </label>
              <select
                id="department"
                name="department"
                className="w-full p-3 rounded-md bg-gray-900 text-white border border-gray-600"
                value={formData.department}
                onChange={handleChange}
                required
              >
                {departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="question" className="block font-medium mb-1">
                Details (optional)
              </label>
              <textarea
                id="question"
                name="question"
                rows={4}
                className="w-full p-3 rounded-md bg-gray-900 text-white border border-gray-600"
                value={formData.question}
                onChange={handleChange}
              />
            </div>

            <div className="flex justify-center">
            <button
              type="submit"
              className="px-5 py-2 bg-blue-600 hover:bg-blue-500 rounded-md text-white font-medium transition"
            >
              Submit
            </button>
          </div>
          </form>
        </div>
      </main>
    </>
  );
}
