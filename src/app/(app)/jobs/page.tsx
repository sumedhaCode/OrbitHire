import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { currentUser, listJobs } from "@/lib/data";
import { formatCtc, formatDate } from "@/lib/format";
import { redirect } from "next/navigation";

export default async function JobsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; type?: string }>;
}) {
  const session = await currentUser();
  if (!session) redirect("/login");
  const params = await searchParams;
  const jobs = await listJobs({ q: params.q, type: params.type });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Open market</h1>
          <p className="mt-1 text-sm text-zinc-500">
            {jobs.length} role{jobs.length === 1 ? "" : "s"} · filters run on the server
          </p>
        </div>
        {session.role === "recruiter" ? (
          <Link
            href="/jobs/new"
            className="rounded-lg bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground"
          >
            Post a role
          </Link>
        ) : null}
      </div>

      <form className="flex flex-wrap gap-2" action="/jobs">
        <Input
          name="q"
          placeholder="Search title, company, skill"
          defaultValue={params.q ?? ""}
          className="max-w-sm"
        />
        <select
          name="type"
          defaultValue={params.type ?? ""}
          className="h-8 rounded-lg border border-input bg-white px-2.5 text-sm"
        >
          <option value="">All types</option>
          <option value="full-time">Full-time</option>
          <option value="internship">Internship</option>
        </select>
        <button
          type="submit"
          className="h-8 rounded-lg border border-zinc-200 bg-white px-3 text-sm"
        >
          Filter
        </button>
      </form>

      {jobs.length === 0 ? (
        <p className="rounded-xl border border-dashed border-zinc-300 bg-white p-8 text-center text-sm text-zinc-500">
          No roles match those filters.
        </p>
      ) : (
        <ul className="grid gap-3">
          {jobs.map((job) => (
            <li key={job.id}>
              <Link
                href={`/jobs/${job.id}`}
                className="block rounded-xl border border-zinc-200 bg-white p-4 hover:border-indigo-200 hover:shadow-sm"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="font-medium">{job.title}</h2>
                      <Badge variant="secondary">{job.type}</Badge>
                      {job.status === "closed" ? (
                        <Badge variant="outline">Closed</Badge>
                      ) : null}
                    </div>
                    <p className="mt-1 text-sm text-zinc-500">
                      {job.companyName}
                      {job.companyIndustry ? ` · ${job.companyIndustry}` : ""} · {job.location}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium tabular-nums">
                      {job.type === "internship"
                        ? job.stipend || "Stipend TBA"
                        : formatCtc(job.ctcLpa)}
                    </p>
                    <p className="text-xs text-zinc-400">
                      Deadline {formatDate(job.deadline)}
                    </p>
                  </div>
                </div>
                <p className="mt-3 text-xs text-zinc-500">
                  Min CGPA {job.minCgpa || "—"} · {job.branches.join(", ") || "All branches"} ·{" "}
                  {job.openings} opening{job.openings === 1 ? "" : "s"}
                </p>
                <div className="mt-2 flex flex-wrap gap-1">
                  {job.skills.slice(0, 6).map((s) => (
                    <span
                      key={s}
                      className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-600"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
