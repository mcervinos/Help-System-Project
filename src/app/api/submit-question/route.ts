import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.name) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title, department, question } = await req.json();

    const validDepartments = ['IT', 'HR', 'Sales', 'Marketing', 'Finance', 'Operations', 'Customer Service'];
    if (!validDepartments.includes(department)) {
      return NextResponse.json({ error: "Invalid department" }, { status: 400 });
    }

    const query = `
      INSERT INTO faqs (title, department, posterName, question)
      VALUES (?, ?, ?, ?)
    `;

    await db.execute(query, [title, department, session.user.name, question]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error submitting question:", error);
    return NextResponse.json({ error: "Failed to submit question" }, { status: 500 });
  }
}
