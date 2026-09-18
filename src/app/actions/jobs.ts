"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { connectDb } from "@/lib/db";
import { Job } from "@/lib/models";
import { getSession } from "@/lib/auth";

export async function createJobAction(formData: FormData) {
  await connectDb();
  const session = await getSession();
  if (!session || session.role !== "recruiter") {
    return { error: "Only recruiters can post roles." };
  }

  const title = String(formData.get("title") ?? "").trim();
  const location = String(formData.get("location") ?? "").trim();
  const type = String(formData.get("type") ?? "full-time");
  const description = String(formData.get("description") ?? "").trim();
  const skills = String(formData.get("skills") ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const branches = formData.getAll("branches").map(String);
  const deadline = String(formData.get("deadline") ?? "");
  const ctcLpa = Number(formData.get("ctcLpa"));
  const stipend = String(formData.get("stipend") ?? "").trim();
  const minCgpa = Number(formData.get("minCgpa"));
  const openings = Number(formData.get("openings"));

  if (!title || !location || !description || !deadline) {
    return { error: "Title, location, description, and deadline are required." };
  }

  const job = await Job.create({
    title,
    companyName: session.companyName || "Independent recruiter",
    recruiterId: session.id,
    location,
    type: type === "internship" ? "internship" : "full-time",
    description,
    skills,
    branches: branches.length ? branches : ["CSE"],
    deadline: new Date(deadline),
    ctcLpa: Number.isFinite(ctcLpa) && ctcLpa > 0 ? ctcLpa : undefined,
    stipend: stipend || undefined,
    minCgpa: Number.isFinite(minCgpa) ? minCgpa : 0,
    openings: Number.isFinite(openings) && openings > 0 ? openings : 1,
    status: "open",
  });

  revalidatePath("/jobs");
  redirect(`/jobs/${job._id}`);
}

export async function closeJobAction(jobId: string) {
  await connectDb();
  const session = await getSession();
  if (!session) return { error: "Sign in required." };
  const job = await Job.findById(jobId);
  if (!job) return { error: "Role not found." };
  const allowed =
    session.role === "tpo" ||
    (session.role === "recruiter" && String(job.recruiterId) === session.id);
  if (!allowed) return { error: "You cannot close this role." };
  job.status = job.status === "open" ? "closed" : "open";
  await job.save();
  revalidatePath("/jobs");
  revalidatePath(`/jobs/${jobId}`);
  return { ok: true };
}
