import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { RowDataPacket } from "mysql2";

interface FAQRow extends RowDataPacket {
    posterName: string;
    department: string;
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = params;
  const { response } = await req.json();
  const responderName = session.user.name;
  const department = session.user.department;

  const [faqRows] = await db.execute<FAQRow[]>(
    "SELECT posterName, department FROM faqs WHERE id = ?",
    [id]
  );

  if (!Array.isArray(faqRows) || faqRows.length === 0) {
    return NextResponse.json({ error: "FAQ not found" }, { status: 404 });
  }

  const faq = faqRows[0];
  if (faq.department !== department || faq.posterName === responderName) {
    return NextResponse.json({ error: "Access denied" }, { status: 403 });
  }

  const [existing] = await db.execute(
    "SELECT id FROM responses WHERE faqId = ? AND responderName = ?",
    [id, responderName]
  );

  if (Array.isArray(existing) && existing.length > 0) {
    return NextResponse.json({ error: "Already responded" }, { status: 409 });
  }

  await db.execute(
    "INSERT INTO responses (faqId, responderName, response) VALUES (?, ?, ?)",
    [id, responderName, response]
  );

  return NextResponse.json({ responderName, response });
}
