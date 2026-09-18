import { connectDb } from "./db";
import { ensureSeeded } from "./seed";
import { Application, Job, User, type ApplicationStatus } from "./models";
import { getSession, type SessionUser } from "./auth";

export async function boot() {
  await connectDb();
  await ensureSeeded();
}

export async function currentUser() {
  await boot();
  return getSession();
}

function strId(value: unknown) {
  return String(value);
}

export function serializeJob(job: Record<string, unknown>) {
  return {
    id: strId(job._id),
    title: String(job.title ?? ""),
    companyName: String(job.companyName ?? ""),
    companyIndustry: job.companyIndustry ? String(job.companyIndustry) : "",
    recruiterId: strId(job.recruiterId),
    location: String(job.location ?? ""),
    type: job.type as "full-time" | "internship",
    ctcLpa: typeof job.ctcLpa === "number" ? job.ctcLpa : null,
    stipend: job.stipend ? String(job.stipend) : null,
    minCgpa: typeof job.minCgpa === "number" ? job.minCgpa : 0,
    branches: Array.isArray(job.branches) ? (job.branches as string[]) : [],
    skills: Array.isArray(job.skills) ? (job.skills as string[]) : [],
    description: String(job.description ?? ""),
    openings: typeof job.openings === "number" ? job.openings : 1,
    deadline: job.deadline ? new Date(job.deadline as string).toISOString() : "",
    status: job.status as "open" | "closed",
    createdAt: job.createdAt
      ? new Date(job.createdAt as string).toISOString()
      : "",
  };
}

export type PublicJob = ReturnType<typeof serializeJob>;

export function serializeUser(user: Record<string, unknown>) {
  return {
    id: strId(user._id),
    name: String(user.name ?? ""),
    email: String(user.email ?? ""),
    role: user.role as SessionUser["role"],
    college: user.college ? String(user.college) : "",
    branch: user.branch ? String(user.branch) : "",
    cgpa: typeof user.cgpa === "number" ? user.cgpa : null,
    graduationYear:
      typeof user.graduationYear === "number" ? user.graduationYear : null,
    rollNumber: user.rollNumber ? String(user.rollNumber) : "",
    skills: Array.isArray(user.skills) ? (user.skills as string[]) : [],
    resumeUrl: user.resumeUrl ? String(user.resumeUrl) : "",
    bio: user.bio ? String(user.bio) : "",
    companyName: user.companyName ? String(user.companyName) : "",
    designation: user.designation ? String(user.designation) : "",
  };
}

export type PublicUser = ReturnType<typeof serializeUser>;

export function serializeApplication(app: Record<string, unknown>) {
  const job =
    app.jobId && typeof app.jobId === "object" && "_id" in (app.jobId as object)
      ? serializeJob(app.jobId as Record<string, unknown>)
      : null;
  const student =
    app.studentId &&
    typeof app.studentId === "object" &&
    "_id" in (app.studentId as object)
      ? serializeUser(app.studentId as Record<string, unknown>)
      : null;

  return {
    id: strId(app._id),
    jobId: job ? job.id : strId(app.jobId),
    studentId: student ? student.id : strId(app.studentId),
    status: app.status as ApplicationStatus,
    coverNote: String(app.coverNote ?? ""),
    interviewAt: app.interviewAt
      ? new Date(app.interviewAt as string).toISOString()
      : null,
    interviewMode: app.interviewMode ? String(app.interviewMode) : "",
    interviewNotes: app.interviewNotes ? String(app.interviewNotes) : "",
    offerCtcLpa: typeof app.offerCtcLpa === "number" ? app.offerCtcLpa : null,
    timeline: Array.isArray(app.timeline)
      ? (app.timeline as { status: string; at: Date; note?: string }[]).map(
          (t) => ({
            status: t.status,
            at: new Date(t.at).toISOString(),
            note: t.note ?? "",
          }),
        )
      : [],
    job,
    student,
    updatedAt: app.updatedAt
      ? new Date(app.updatedAt as string).toISOString()
      : "",
  };
}

export type PublicApplication = ReturnType<typeof serializeApplication>;

export async function listJobs(params: {
  q?: string;
  type?: string;
  session?: SessionUser | null;
}) {
  await boot();
  const query: Record<string, unknown> = {};
  if (params.type === "full-time" || params.type === "internship") {
    query.type = params.type;
  }
  if (params.q) {
    query.$or = [
      { title: { $regex: params.q, $options: "i" } },
      { companyName: { $regex: params.q, $options: "i" } },
      { skills: { $regex: params.q, $options: "i" } },
    ];
  }
  const jobs = await Job.find(query).sort({ createdAt: -1 }).lean();
  return jobs.map((j) => serializeJob(j as Record<string, unknown>));
}

export async function getJob(id: string) {
  await boot();
  const job = await Job.findById(id).lean();
  if (!job) return null;
  return serializeJob(job as Record<string, unknown>);
}

export async function listApplicationsFor(session: SessionUser) {
  await boot();
  const filter =
    session.role === "student"
      ? { studentId: session.id }
      : session.role === "recruiter"
        ? {
            jobId: {
              $in: (await Job.find({ recruiterId: session.id }).select("_id")).map(
                (j) => j._id,
              ),
            },
          }
        : {};
  const apps = await Application.find(filter)
    .populate("jobId")
    .populate("studentId")
    .sort({ updatedAt: -1 })
    .lean();
  return apps.map((a) => serializeApplication(a as Record<string, unknown>));
}

export async function getApplication(id: string) {
  await boot();
  const app = await Application.findById(id)
    .populate("jobId")
    .populate("studentId")
    .lean();
  if (!app) return null;
  return serializeApplication(app as Record<string, unknown>);
}

export async function getStudentProfile(id: string) {
  await boot();
  const user = await User.findById(id).lean();
  if (!user) return null;
  return serializeUser(user as Record<string, unknown>);
}

export async function dashboardStats(session: SessionUser) {
  await boot();
  const [jobCount, openJobs, apps, placed, students] = await Promise.all([
    Job.countDocuments(),
    Job.countDocuments({ status: "open" }),
    Application.countDocuments(),
    Application.countDocuments({ status: "placed" }),
    User.countDocuments({ role: "student" }),
  ]);

  const pipeline = await Application.aggregate<{
    _id: ApplicationStatus;
    count: number;
  }>([{ $group: { _id: "$status", count: { $sum: 1 } } }]);

  const byStatus = Object.fromEntries(
    pipeline.map((p) => [p._id, p.count]),
  ) as Record<string, number>;

  const offers = await Application.find({
    status: { $in: ["offer", "placed"] },
    offerCtcLpa: { $gt: 0 },
  })
    .select("offerCtcLpa")
    .lean();
  const ctcs = offers
    .map((o) => o.offerCtcLpa as number)
    .filter((n) => typeof n === "number");
  const avgCtc =
    ctcs.length > 0 ? ctcs.reduce((a, b) => a + b, 0) / ctcs.length : 0;

  let mine = 0;
  if (session.role === "student") {
    mine = await Application.countDocuments({ studentId: session.id });
  } else if (session.role === "recruiter") {
    const ids = await Job.find({ recruiterId: session.id }).select("_id");
    mine = await Application.countDocuments({
      jobId: { $in: ids.map((j) => j._id) },
    });
  }

  const branchStats = await User.aggregate([
    { $match: { role: "student", branch: { $ne: null } } },
    { $group: { _id: "$branch", students: { $sum: 1 } } },
    { $sort: { students: -1 } },
  ]);

  const placedByBranch = await Application.aggregate([
    { $match: { status: "placed" } },
    {
      $lookup: {
        from: "users",
        localField: "studentId",
        foreignField: "_id",
        as: "student",
      },
    },
    { $unwind: "$student" },
    { $group: { _id: "$student.branch", placed: { $sum: 1 } } },
  ]);

  return {
    jobCount,
    openJobs,
    apps,
    placed,
    students,
    mine,
    avgCtc,
    byStatus,
    branchStats: branchStats.map((b) => ({
      branch: String(b._id ?? "Other"),
      students: b.students as number,
    })),
    placedByBranch: placedByBranch.map((b) => ({
      branch: String(b._id ?? "Other"),
      placed: b.placed as number,
    })),
  };
}
