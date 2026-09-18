"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { connectDb } from "@/lib/db";
import { ensureSeeded } from "@/lib/seed";
import { User } from "@/lib/models";
import { clearSession, setSession } from "@/lib/auth";

export async function loginAction(formData: FormData) {
  await connectDb();
  await ensureSeeded();
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") ?? "");
  const user = await User.findOne({ email });
  if (!user) return { error: "No account for that email." };
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return { error: "Incorrect password." };
  await setSession({
    id: String(user._id),
    name: user.name,
    email: user.email,
    role: user.role,
    companyName: user.companyName,
  });
  redirect("/dashboard");
}

export async function registerAction(formData: FormData) {
  await connectDb();
  await ensureSeeded();
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") ?? "");
  const branch = String(formData.get("branch") ?? "").trim();
  const cgpa = Number(formData.get("cgpa"));
  const rollNumber = String(formData.get("rollNumber") ?? "").trim();

  if (!name || !email || password.length < 8) {
    return { error: "Name, email, and an 8+ character password are required." };
  }
  const existing = await User.findOne({ email });
  if (existing) return { error: "That email is already registered." };

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({
    name,
    email,
    passwordHash,
    role: "student",
    branch: branch || "CSE",
    cgpa: Number.isFinite(cgpa) ? cgpa : undefined,
    graduationYear: 2026,
    rollNumber,
    skills: [],
  });
  await setSession({
    id: String(user._id),
    name: user.name,
    email: user.email,
    role: user.role,
  });
  redirect("/dashboard");
}

export async function logoutAction() {
  await clearSession();
  redirect("/");
}
