"use client";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/navbar";
import LoadingText from "@/components/loading";

export default function FAQ() {
  const { status } = useSession();
  const router = useRouter();
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");


  type FAQItem = {
    id: number;
    title: string;
    department: string;
    posterName: string;
    status: "Pending" | "In Progress" | "Resolved" | "Closed";
  };

  const [faqs, setFaqs] = useState<FAQItem[]>([]);

  const statusColor = {
    Pending: "bg-yellow-600 text-yellow-100",
    "In Progress": "bg-blue-600 text-blue-100",
    Resolved: "bg-green-600 text-green-100",
    Closed: "bg-red-600 text-red-100",
  };

  useEffect(() => {
    if (status === "authenticated") {
      fetch("/api/my-questions")
        .then((res) => res.json())
        .then((data) => setFaqs(data))
        .catch((error) => console.error("Error fetching FAQs:", error));
    } else if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return <LoadingText />;
  }

  return (
    <>
      <Navbar />
      <main className="bg-gray-900 min-h-screen p-8 text-white">
        <div className="bg-gray-800 p-8 rounded-xl shadow-lg max-w-4xl mx-auto w-full">
          <h2 className="text-3xl font-bold text-center mb-6">My Questions</h2>

          {faqs.length === 0 ? (
            <p className="text-center text-gray-400">No questions found.</p>
          ) : (
            <div className="overflow-x-auto">
              <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <select
                  value={departmentFilter}
                  onChange={(e) => setDepartmentFilter(e.target.value)}
                  className="bg-gray-900 text-white border border-gray-600 p-2 rounded-lg"
                >
                  <option value="">All Departments</option>
                  {[...new Set(faqs.map((f) => f.department))].map((dept) => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-gray-900 text-white border border-gray-600 p-2 rounded-lg"
                >
                  <option value="">All Statuses</option>
                  {["Pending", "In Progress", "Resolved", "Closed"].map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <table className="min-w-full divide-y divide-gray-700 rounded-lg overflow-hidden">
                <thead className="bg-gray-700">
                  <tr>
                    {["Ticket ID", "Title", "Department", "Status", "Posted By"].map((heading) => {
                        let cornerClass = "";
                        if (heading === "Ticket ID") {
                        cornerClass = "rounded-tl-lg";
                        } else if (heading === "Posted By") {
                        cornerClass = "rounded-tr-lg";
                        }
                      return (
                        <th
                          key={heading}
                          className={`px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider ${cornerClass}`}
                        >
                          {heading}
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody className="bg-gray-800 divide-y divide-gray-700">
                  {faqs
                    .filter((faq) =>
                      (!departmentFilter || faq.department === departmentFilter) &&
                      (!statusFilter || faq.status === statusFilter)
                    )
                    .map((faq) => (
                    <tr
                      key={faq.id}
                      className="hover:bg-gray-700 cursor-pointer"
                      onClick={() => router.push(`/faq/${faq.id}`)}
                    >
                      <td className="px-6 py-4 text-sm font-medium text-gray-100">#{faq.id}</td>
                      <td className="px-6 py-4 text-sm text-gray-300">{faq.title}</td>
                      <td className="px-6 py-4 text-sm text-gray-300">{faq.department}</td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColor[faq.status]}`}>
                          {faq.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-300">{faq.posterName}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
