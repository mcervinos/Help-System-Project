import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  const { email, password, name, department } = await req.json();

  if (!email || !password || !name || !department) {
    return new NextResponse("Missing fields", { status: 400 });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  // Check if user already exists
  const [existing] = await db.execute("SELECT * FROM users WHERE email = ?", [email]);
  if (Array.isArray(existing) && existing.length > 0) {
    return new NextResponse("User already exists", { status: 409 });
  }

  // Insert new user
  await db.execute(
    "INSERT INTO users (email, password, name, department) VALUES (?, ?, ?, ?)",
    [email, hashedPassword, name, department]
  );

  return NextResponse.json({ success: true });
}
