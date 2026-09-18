import Link from "next/link";
import { redirect } from "next/navigation";
import { StatusBadge } from "@/components/status-badge";
import { currentUser, listApplicationsFor } from "@/lib/data";
import { formatDate } from "@/lib/format";

export default async function ApplicationsPage() {
  const session = await currentUser();
  if (!session) redirect("/login");
  const apps = await listApplicationsFor(session);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Applications</h1>
        <p className="mt-1 text-sm text-zinc-500">
          {session.role === "student"
            ? "Everything you submitted, including interview times."
            : "Candidates on roles you can see."}
        </p>
      </div>
      {apps.length === 0 ? (
        <p className="rounded-xl border border-dashed border-zinc-300 bg-white p-8 text-center text-sm text-zinc-500">
          No applications yet.{" "}
          {session.role === "student" ? (
            <Link href="/jobs" className="text-[#3b82f6] hover:underline">
              Browse roles
            </Link>
          ) : null}
        </p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-zinc-200 bg-white">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="border-b border-zinc-200 text-xs text-zinc-500">
              <tr>
                <th className="px-4 py-3 font-medium">
                  {session.role === "student" ? "Role" : "Candidate"}
                </th>
                <th className="px-4 py-3 font-medium">
                  {session.role === "student" ? "Company" : "Role"}
                </th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Updated</th>
              </tr>
            </thead>
            <tbody>
              {apps.map((app) => (
                <tr key={app.id} className="border-b border-zinc-100 last:border-0">
                  <td className="px-4 py-3">
                    <Link href={`/applications/${app.id}`} className="font-medium hover:underline">
                      {session.role === "student"
                        ? app.job?.title
                        : app.student?.name}
                    </Link>
                    {session.role !== "student" && app.student?.branch ? (
                      <p className="text-xs text-zinc-400">
                        {app.student.branch} · CGPA {app.student.cgpa ?? "—"}
                      </p>
                    ) : null}
                  </td>
                  <td className="px-4 py-3 text-zinc-600">
                    {session.role === "student"
                      ? app.job?.companyName
                      : app.job?.title}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={app.status} />
                  </td>
                  <td className="px-4 py-3 text-zinc-500">
                    {formatDate(app.updatedAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
