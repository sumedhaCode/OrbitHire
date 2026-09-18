"use server";

import { revalidatePath } from "next/cache";
import { connectDb } from "@/lib/db";
import { User } from "@/lib/models";
import { getSession } from "@/lib/auth";

export async function updateProfileAction(formData: FormData) {
  await connectDb();
  const session = await getSession();
  if (!session) return { error: "Sign in required." };
  const user = await User.findById(session.id);
  if (!user) return { error: "Profile not found." };

  user.name = String(formData.get("name") ?? user.name).trim() || user.name;
  user.bio = String(formData.get("bio") ?? "");
  if (session.role === "student") {
    user.branch = String(formData.get("branch") ?? user.branch);
    const cgpa = Number(formData.get("cgpa"));
    if (Number.isFinite(cgpa)) user.cgpa = cgpa;
    user.rollNumber = String(formData.get("rollNumber") ?? "");
    user.resumeUrl = String(formData.get("resumeUrl") ?? "");
    user.skills = String(formData.get("skills") ?? "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  }
  if (session.role === "recruiter") {
    user.designation = String(formData.get("designation") ?? "");
    user.companyName = String(formData.get("companyName") ?? user.companyName);
  }
  await user.save();
  revalidatePath("/profile");
  revalidatePath("/dashboard");
  return { ok: true };
}
