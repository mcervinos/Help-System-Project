import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth"; // Adjust path if needed

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session?.user?.name) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userName = session.user.name;
    const [rows] = await db.query(
      "SELECT * FROM faqs WHERE posterName = ? ORDER BY id DESC",
      [userName]
    );

    return NextResponse.json(rows);
  } catch (error) {
    console.error("Error fetching FAQ:", error);
    return NextResponse.json({ error: "Failed to fetch FAQ" }, { status: 500 });
  }
}
