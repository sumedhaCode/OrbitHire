import Link from "next/link";
import { redirect } from "next/navigation";
import { StatusBadge } from "@/components/status-badge";
import { currentUser, listApplicationsFor } from "@/lib/data";
import type { ApplicationStatus } from "@/lib/models";
import { STATUS_LABEL } from "@/lib/format";

const COLUMNS: ApplicationStatus[] = [
  "applied",
  "shortlisted",
  "interview",
  "offer",
  "placed",
  "rejected",
];

export default async function PipelinePage() {
  const session = await currentUser();
  if (!session) redirect("/login");
  if (session.role === "student") redirect("/applications");
  const apps = await listApplicationsFor(session);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Hiring pipeline</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Open a card to shortlist, schedule, or release an offer. Illegal stage jumps are rejected by the server.
        </p>
      </div>
      <div className="flex gap-3 overflow-x-auto pb-2">
        {COLUMNS.map((col) => {
          const items = apps.filter((a) => a.status === col);
          return (
            <section
              key={col}
              className="w-64 shrink-0 rounded-xl border border-zinc-200 bg-zinc-50"
            >
              <header className="flex items-center justify-between px-3 py-2">
                <h2 className="text-sm font-medium">{STATUS_LABEL[col]}</h2>
                <span className="text-xs tabular-nums text-zinc-400">
                  {items.length}
                </span>
              </header>
              <div className="space-y-2 p-2">
                {items.length === 0 ? (
                  <p className="px-1 py-6 text-center text-xs text-zinc-400">Empty</p>
                ) : (
                  items.map((app) => (
                    <Link
                      key={app.id}
                      href={`/applications/${app.id}`}
                      className="block rounded-lg border border-slate-200 bg-white p-3 hover:border-sky-300"
                    >
                      <p className="text-sm font-medium">{app.student?.name}</p>
                      <p className="text-xs text-zinc-500">{app.job?.title}</p>
                      <p className="mt-1 text-[11px] text-zinc-400">
                        {app.student?.branch} · {app.job?.companyName}
                      </p>
                      <div className="mt-2">
                        <StatusBadge status={app.status} />
                      </div>
                    </Link>
                  ))
                )}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
