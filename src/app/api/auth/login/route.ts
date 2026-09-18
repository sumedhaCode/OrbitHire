import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDb } from "@/lib/db";
import { ensureSeeded } from "@/lib/seed";
import { User } from "@/lib/models";
import { encodeSession } from "@/lib/auth";

export async function POST(request: Request) {
  await connectDb();
  await ensureSeeded();
  const body = (await request.json().catch(() => null)) as {
    email?: string;
    password?: string;
  } | null;
  const email = String(body?.email ?? "")
    .trim()
    .toLowerCase();
  const password = String(body?.password ?? "");
  const user = await User.findOne({ email });
  if (!user) {
    return NextResponse.json({ error: "No account for that email." }, { status: 401 });
  }
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) {
    return NextResponse.json({ error: "Incorrect password." }, { status: 401 });
  }
  const token = encodeSession({
    id: String(user._id),
    name: user.name,
    email: user.email,
    role: user.role,
    companyName: user.companyName,
  });
  const res = NextResponse.json({
    ok: true,
    role: user.role,
    name: user.name,
  });
  res.cookies.set("oh_session", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return res;
}
