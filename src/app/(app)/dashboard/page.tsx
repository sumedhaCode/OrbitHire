import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { currentUser, dashboardStats, listApplicationsFor, listJobs } from "@/lib/data";
import { formatCtc, formatDate } from "@/lib/format";
import { StatusBadge } from "@/components/status-badge";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await currentUser();
  if (!session) redirect("/login");
  const [stats, jobs, apps] = await Promise.all([
    dashboardStats(session),
    listJobs({}),
    listApplicationsFor(session),
  ]);

  const headline =
    session.role === "student"
      ? `You have ${stats.mine} application${stats.mine === 1 ? "" : "s"} in flight.`
      : session.role === "recruiter"
        ? `${stats.mine} candidate${stats.mine === 1 ? "" : "s"} across your roles.`
        : `${stats.placed} placed · avg offer ${formatCtc(stats.avgCtc)}`;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          {session.role === "tpo" ? "Placement cell" : `Hello, ${session.name.split(" ")[0]}`}
        </h1>
        <p className="mt-1 text-sm text-zinc-500">{headline}</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Open roles" value={String(stats.openJobs)} />
        <Stat label="Applications" value={String(stats.apps)} />
        <Stat
          label={session.role === "student" ? "Yours" : session.role === "recruiter" ? "Your inbox" : "Placed"}
          value={String(session.role === "tpo" ? stats.placed : stats.mine)}
        />
        <Stat label="Avg offered CTC" value={formatCtc(stats.avgCtc)} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Open roles</CardTitle>
            <CardDescription>Newest first · eligibility is checked at apply time</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {jobs.filter((j) => j.status === "open").length === 0 ? (
              <p className="text-sm text-zinc-500">No open roles yet.</p>
            ) : (
              jobs
                .filter((j) => j.status === "open")
                .slice(0, 5)
                .map((job) => (
                  <Link
                    key={job.id}
                    href={`/jobs/${job.id}`}
                    className="block rounded-lg border border-zinc-100 p-3 hover:bg-zinc-50"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-medium">{job.title}</p>
                        <p className="text-sm text-zinc-500">
                          {job.companyName} · {job.location}
                        </p>
                      </div>
                      <p className="text-sm tabular-nums text-zinc-700">
                        {job.type === "internship" ? job.stipend : formatCtc(job.ctcLpa)}
                      </p>
                    </div>
                    <p className="mt-1 text-xs text-zinc-400">
                      Closes {formatDate(job.deadline)}
                    </p>
                  </Link>
                ))
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>
              {session.role === "student" ? "Your pipeline" : "Recent applications"}
            </CardTitle>
            <CardDescription>Status moves leave an audit trail</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {apps.length === 0 ? (
              <p className="text-sm text-zinc-500">Nothing in the pipeline yet.</p>
            ) : (
              apps.slice(0, 6).map((app) => (
                <Link
                  key={app.id}
                  href={`/applications/${app.id}`}
                  className="flex items-center justify-between gap-3 rounded-lg border border-zinc-100 p-3 hover:bg-zinc-50"
                >
                  <div className="min-w-0">
                    <p className="truncate font-medium">
                      {session.role === "student"
                        ? app.job?.title
                        : app.student?.name}
                    </p>
                    <p className="truncate text-sm text-zinc-500">
                      {session.role === "student"
                        ? app.job?.companyName
                        : app.job?.title}
                    </p>
                  </div>
                  <StatusBadge status={app.status} />
                </Link>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4">
      <p className="text-xs text-zinc-500">{label}</p>
      <p className="mt-1 text-2xl font-semibold tabular-nums">{value}</p>
    </div>
  );
}
