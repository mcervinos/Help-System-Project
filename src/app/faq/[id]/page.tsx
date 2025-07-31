"use client";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Navbar from "@/components/navbar";
import LoadingText from "@/components/loading";

type FAQ = {
  id: number;
  title: string;
  department: string;
  posterName: string;
  question: string;
  status: "Pending" | "In Progress" | "Resolved" | "Closed";
  createdAt: string;
};

type Response = {
  id: string;
  responderName: string;
  response: string;
  createdAt: string;
};

export default function FAQDetails() {
  const { status, data: session } = useSession();
  const { id } = useParams();
  const router = useRouter();

  const [faq, setFaq] = useState<FAQ | null>(null);
  const [responses, setResponses] = useState<Response[]>([]);
  const [newResponse, setNewResponse] = useState("");

 const [newStatus, setNewStatus] = useState<FAQ["status"]>(faq?.status ?? "Pending");

  const handleStatusUpdate = async () => {
    if (!faq) return;

    if (newStatus === faq.status) {
        alert("ℹThe selected status is already set. No update needed.");
        return;
    }

    const res = await fetch(`/api/faq/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
    });

    if (res.ok) {
        setFaq((prev) => prev && { ...prev, status: newStatus });
        alert("Status updated!");
    } else {
        alert("Failed to update status.");
    }
  };

  useEffect(() => {
    if (status === "authenticated") {
      fetch(`/api/faq/${id}`)
        .then((res) => res.json())
        .then((data) => {
          setFaq(data.faq);
          setResponses(data.responses);
        })
        .catch((err) => console.error("Error loading FAQ:", err));
    } else if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, id, router]);

  const handleResponseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch(`/api/faq/${id}/respond`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ response: newResponse }),
    });

    if (res.ok) {
      const updated: Response = await res.json();
      setResponses((prev) => [...prev, updated]);
      setNewResponse("");
    } else {
      alert("You can't respond to this question.");
    }
  };

  const badgeColor = (status: FAQ["status"]) => {
    const map = {
      Pending: "bg-yellow-600 text-yellow-100",
      "In Progress": "bg-blue-600 text-blue-100",
      Resolved: "bg-green-600 text-green-100",
      Closed: "bg-red-600 text-red-100",
    };
    return map[status] || "bg-gray-600 text-gray-100";
  };

  if (status === "loading" || !faq) {
    return <LoadingText />;
  }

  const alreadyResponded = responses.some((r) => r.responderName === session?.user?.name);
  const canRespond =
    session?.user?.department === faq.department &&
    session?.user?.name !== faq.posterName &&
    !alreadyResponded;

  return (
    <>
      <Navbar />
      <main className="bg-gray-900 text-white min-h-screen p-8">
        <div className="max-w-4xl mx-auto bg-gray-800 p-6 rounded-xl shadow-lg">
          <h1 className="text-3xl font-bold mb-2">{faq.title}</h1>

          <div className="flex justify-between text-sm text-gray-400 mb-2">
            <p>{faq.department}</p>
            <p>{faq.posterName}</p>
          </div>

          <p className="text-sm text-gray-400 mb-4">Asked on {new Date(faq.createdAt).toLocaleString()}</p>
          <span className={`inline-block mb-4 px-3 py-1 text-xs font-semibold rounded-full ${badgeColor(faq.status)}`}>
            {faq.status}
          </span>

          <p className="mb-6">{faq.question}</p>

          {session?.user?.name === faq.posterName && (
            <div className="mb-6">
                <label htmlFor="status" className="block text-sm text-gray-300 font-medium mb-1">
                Change Status
                </label>
                <div className="flex items-center gap-4">
                <select
                    id="status"
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as FAQ["status"])}
                    className="bg-gray-900 text-white border border-gray-600 p-2 rounded-lg w-full sm:w-auto"
                >
                    {["Pending", "In Progress", "Resolved", "Closed"].map((s) => (
                    <option key={s} value={s}>{s}</option>
                    ))}
                </select>
                <button
                    onClick={handleStatusUpdate}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition whitespace-nowrap"
                >
                    Update Status
                </button>
                </div>
            </div>
          )}
          <h2 className="text-2xl font-semibold mb-4">Responses</h2>

          {responses.length === 0 ? (
            <p>No responses yet.</p>
          ) : (
            responses.map((r) => (
              <div key={r.id} className="bg-gray-700 p-4 rounded-lg mb-4">
                <p className="text-sm text-blue-300 mb-1">
                  <strong>{r.responderName}</strong> responded on {new Date(r.createdAt).toLocaleString()}
                </p>
                <p>{r.response}</p>
              </div>
            ))
          )}
          {canRespond && (
            <form onSubmit={handleResponseSubmit} className="mt-8">
              <label htmlFor="response" className="block mb-2 font-medium text-gray-300">Your Response</label>
              <textarea
                id="response"
                name="response"
                className="w-full p-3 rounded-lg bg-gray-900 text-white border border-gray-600 mb-4"
                rows={4}
                value={newResponse}
                onChange={(e) => setNewResponse(e.target.value)}
                required
              />
              <button
                type="submit"
                className="py-2 px-4 bg-green-600 hover:bg-green-500 rounded-lg text-white font-medium transition duration-150 ease-in-out"
              >
                Submit Response
              </button>
            </form>
          )}
        </div>
      </main>
    </>
  );
}
