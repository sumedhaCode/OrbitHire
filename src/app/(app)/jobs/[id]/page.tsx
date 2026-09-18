import { notFound, redirect } from "next/navigation";
import { ApplyForm } from "@/components/apply-form";
import { CloseJobButton } from "@/components/close-job-button";
import { Badge } from "@/components/ui/badge";
import {
  currentUser,
  getJob,
  listApplicationsFor,
} from "@/lib/data";
import { BRANCHES, formatCtc, formatDate } from "@/lib/format";

export default async function JobDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await currentUser();
  if (!session) redirect("/login");
  const { id } = await params;
  const job = await getJob(id);
  if (!job) notFound();

  const apps = await listApplicationsFor(session);
  const already = apps.find((a) => a.jobId === job.id);
  const canClose =
    session.role === "tpo" ||
    (session.role === "recruiter" && session.id === job.recruiterId);
  const closedOrLate =
    job.status !== "open" || new Date(job.deadline).getTime() < Date.now();

  return (
    <div className="grid gap-8 lg:grid-cols-[1.4fr_0.8fr]">
      <article className="space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-semibold tracking-tight">{job.title}</h1>
              <Badge variant="secondary">{job.type}</Badge>
            </div>
            <p className="mt-1 text-sm text-zinc-500">
              {job.companyName} · {job.location}
            </p>
          </div>
          {canClose ? (
            <CloseJobButton jobId={job.id} status={job.status} />
          ) : null}
        </div>
        <dl className="grid grid-cols-2 gap-3 rounded-xl border border-zinc-200 bg-white p-4 text-sm sm:grid-cols-4">
          <div>
            <dt className="text-zinc-500">Package</dt>
            <dd className="mt-1 font-medium">
              {job.type === "internship" ? job.stipend || "—" : formatCtc(job.ctcLpa)}
            </dd>
          </div>
          <div>
            <dt className="text-zinc-500">Min CGPA</dt>
            <dd className="mt-1 font-medium">{job.minCgpa}</dd>
          </div>
          <div>
            <dt className="text-zinc-500">Deadline</dt>
            <dd className="mt-1 font-medium">{formatDate(job.deadline)}</dd>
          </div>
          <div>
            <dt className="text-zinc-500">Openings</dt>
            <dd className="mt-1 font-medium">{job.openings}</dd>
          </div>
        </dl>
        <p className="text-sm text-zinc-600">
          Eligible branches: {job.branches.join(", ") || "All"}
        </p>
        <div className="whitespace-pre-wrap rounded-xl border border-zinc-200 bg-white p-5 text-sm leading-7 text-zinc-700">
          {job.description}
        </div>
      </article>
      <aside className="space-y-4">
        <div className="rounded-xl border border-zinc-200 bg-white p-4">
          <h2 className="font-medium">Apply</h2>
          {session.role !== "student" ? (
            <p className="mt-2 text-sm text-zinc-500">
              Switch to a student account to submit an application. Recruiters
              manage this role from Pipeline.
            </p>
          ) : already ? (
            <p className="mt-2 text-sm text-zinc-600">
              You already applied. Status is tracked under Applications.
            </p>
          ) : closedOrLate ? (
            <p className="mt-2 text-sm text-zinc-500">
              This role is closed or past deadline.
            </p>
          ) : (
            <div className="mt-3">
              <ApplyForm jobId={job.id} />
            </div>
          )}
        </div>
        <div className="rounded-xl border border-zinc-200 bg-white p-4">
          <h2 className="font-medium">Skills on the JD</h2>
          <div className="mt-2 flex flex-wrap gap-1">
            {job.skills.map((s) => (
              <span
                key={s}
                className="rounded-full bg-sky-50 px-2 py-0.5 text-xs text-sky-800"
              >
                {s}
              </span>
            ))}
          </div>
          <p className="mt-3 text-xs text-zinc-400">
            Known branches in the system: {BRANCHES.join(", ")}
          </p>
        </div>
      </aside>
    </div>
  );
}
