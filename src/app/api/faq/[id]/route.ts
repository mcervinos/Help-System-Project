import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const id = params.id;

  const [faqRows] = await db.execute(
    `SELECT id, title, department, posterName, question, status, createdAt 
     FROM faqs WHERE id = ?`,
    [id]
  );

  if (!Array.isArray(faqRows) || faqRows.length === 0) {
    return NextResponse.json({ error: "FAQ not found" }, { status: 404 });
  }

  const faq = faqRows[0];

  const [responseRows] = await db.execute(
    `SELECT id, responderName, response, createdAt 
     FROM responses WHERE faqId = ? ORDER BY createdAt ASC`,
    [id]
  );

  return NextResponse.json({
    faq,
    responses: Array.isArray(responseRows) ? responseRows : [],
  });
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const id = params.id;
  const { status } = await req.json();

  const validStatuses = ["Pending", "In Progress", "Resolved", "Closed"];
  if (!validStatuses.includes(status)) {
    return NextResponse.json({ error: "Invalid status value" }, { status: 400 });
  }

  await db.execute(`UPDATE faqs SET status = ? WHERE id = ?`, [status, id]);

  return NextResponse.json({ message: "Status updated successfully" });
}