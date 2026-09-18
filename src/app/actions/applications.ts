"use server";

import { revalidatePath } from "next/cache";
import { connectDb } from "@/lib/db";
import {
  Application,
  Job,
  User,
  type ApplicationStatus,
} from "@/lib/models";
import { getSession } from "@/lib/auth";

const NEXT: Record<string, ApplicationStatus[]> = {
  applied: ["shortlisted", "rejected"],
  shortlisted: ["interview", "rejected"],
  interview: ["offer", "rejected"],
  offer: ["placed", "rejected"],
  placed: [],
  rejected: [],
};

export async function applyToJobAction(jobId: string, formData: FormData) {
  await connectDb();
  const session = await getSession();
  if (!session || session.role !== "student") {
    return { error: "Only students can apply." };
  }
  const job = await Job.findById(jobId);
  if (!job || job.status !== "open") {
    return { error: "This role is not accepting applications." };
  }
  if (job.deadline.getTime() < Date.now()) {
    return { error: "The deadline has passed." };
  }
  const student = await User.findById(session.id);
  if (student?.cgpa != null && student.cgpa < job.minCgpa) {
    return {
      error: `This role needs CGPA ≥ ${job.minCgpa}. Your profile shows ${student.cgpa}.`,
    };
  }
  if (
    job.branches.length > 0 &&
    student?.branch &&
    !job.branches.includes(student.branch)
  ) {
    return {
      error: `Eligible branches: ${job.branches.join(", ")}. Update your profile if this is wrong.`,
    };
  }

  const coverNote = String(formData.get("coverNote") ?? "").trim();
  try {
    await Application.create({
      jobId: job._id,
      studentId: session.id,
      status: "applied",
      coverNote,
      timeline: [
        { status: "applied", at: new Date(), note: "Application received" },
      ],
    });
  } catch {
    return { error: "You already applied to this role." };
  }
  revalidatePath("/applications");
  revalidatePath(`/jobs/${jobId}`);
  return { ok: true };
}

export async function updateApplicationStatusAction(
  applicationId: string,
  status: ApplicationStatus,
  extras?: { interviewAt?: string; interviewMode?: string; offerCtcLpa?: number; note?: string },
) {
  await connectDb();
  const session = await getSession();
  if (!session || session.role === "student") {
    return { error: "Students cannot move pipeline stages." };
  }
  const app = await Application.findById(applicationId).populate("jobId");
  if (!app) return { error: "Application not found." };
  const job = app.jobId as { recruiterId: unknown };
  if (
    session.role === "recruiter" &&
    String(job.recruiterId) !== session.id
  ) {
    return { error: "This application is not on one of your roles." };
  }
  const allowed = NEXT[app.status] ?? [];
  if (!allowed.includes(status)) {
    return { error: `Cannot move from ${app.status} to ${status}.` };
  }
  app.status = status;
  if (status === "interview") {
    if (extras?.interviewAt) app.interviewAt = new Date(extras.interviewAt);
    if (extras?.interviewMode) app.interviewMode = extras.interviewMode;
  }
  if (status === "offer" && extras?.offerCtcLpa) {
    app.offerCtcLpa = extras.offerCtcLpa;
  }
  app.timeline.push({
    status,
    at: new Date(),
    note: extras?.note || `Moved to ${status}`,
  });
  await app.save();
  revalidatePath("/pipeline");
  revalidatePath("/applications");
  revalidatePath(`/applications/${applicationId}`);
  revalidatePath("/dashboard");
  revalidatePath("/analytics");
  return { ok: true };
}

export async function scheduleInterviewAction(
  applicationId: string,
  formData: FormData,
) {
  const interviewAt = String(formData.get("interviewAt") ?? "");
  const interviewMode = String(formData.get("interviewMode") ?? "online");
  const note = String(formData.get("note") ?? "Interview scheduled");
  return updateApplicationStatusAction(applicationId, "interview", {
    interviewAt,
    interviewMode,
    note,
  });
}

export async function releaseOfferAction(
  applicationId: string,
  formData: FormData,
) {
  const offerCtcLpa = Number(formData.get("offerCtcLpa"));
  return updateApplicationStatusAction(applicationId, "offer", {
    offerCtcLpa: Number.isFinite(offerCtcLpa) ? offerCtcLpa : undefined,
    note: "Offer released",
  });
}
