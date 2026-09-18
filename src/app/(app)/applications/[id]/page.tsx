import { notFound, redirect } from "next/navigation";
import { PipelineActions } from "@/components/pipeline-actions";
import { StatusBadge } from "@/components/status-badge";
import { currentUser, getApplication } from "@/lib/data";
import { formatCtc, formatDateTime } from "@/lib/format";
import { STATUS_LABEL } from "@/lib/format";

export default async function ApplicationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await currentUser();
  if (!session) redirect("/login");
  const { id } = await params;
  const app = await getApplication(id);
  if (!app) notFound();

  if (session.role === "student" && app.studentId !== session.id) notFound();
  if (
    session.role === "recruiter" &&
    app.job?.recruiterId !== session.id
  ) {
    notFound();
  }

  const canManage = session.role === "recruiter" || session.role === "tpo";

  return (
    <div className="grid gap-8 lg:grid-cols-[1.3fr_0.9fr]">
      <div className="space-y-4">
        <div>
          <p className="text-xs text-zinc-500">{app.job?.companyName}</p>
          <h1 className="text-2xl font-semibold tracking-tight">
            {app.job?.title}
          </h1>
          <div className="mt-2 flex items-center gap-2">
            <StatusBadge status={app.status} />
            {app.offerCtcLpa ? (
              <span className="text-sm text-zinc-600">
                Offer {formatCtc(app.offerCtcLpa)}
              </span>
            ) : null}
          </div>
        </div>
        <section className="rounded-xl border border-zinc-200 bg-white p-4">
          <h2 className="text-sm font-medium">Candidate</h2>
          <p className="mt-2 font-medium">{app.student?.name}</p>
          <p className="text-sm text-zinc-500">
            {app.student?.branch} · CGPA {app.student?.cgpa ?? "—"} ·{" "}
            {app.student?.rollNumber}
          </p>
          {app.student?.skills?.length ? (
            <div className="mt-2 flex flex-wrap gap-1">
              {app.student.skills.map((s) => (
                <span
                  key={s}
                  className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-600"
                >
                  {s}
                </span>
              ))}
            </div>
          ) : null}
          {app.student?.bio ? (
            <p className="mt-3 text-sm leading-6 text-zinc-600">{app.student.bio}</p>
          ) : null}
        </section>
        <section className="rounded-xl border border-zinc-200 bg-white p-4">
          <h2 className="text-sm font-medium">Cover note</h2>
          <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-zinc-700">
            {app.coverNote || "No note attached."}
          </p>
        </section>
        {app.interviewAt ? (
          <section className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm">
            <p className="font-medium text-amber-950">Interview</p>
            <p className="mt-1 text-amber-900">
              {formatDateTime(app.interviewAt)} · {app.interviewMode || "mode TBA"}
            </p>
            {app.interviewNotes ? (
              <p className="mt-1 text-amber-800">{app.interviewNotes}</p>
            ) : null}
          </section>
        ) : null}
      </div>
      <aside className="space-y-4">
        {canManage ? (
          <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4">
            <h2 className="text-sm font-medium">Advance pipeline</h2>
            <p className="mt-1 mb-3 text-xs text-zinc-500">
              Moves are validated against the current stage and written to the timeline.
            </p>
            <PipelineActions application={app} />
          </div>
        ) : (
          <p className="rounded-xl border border-zinc-200 bg-white p-4 text-sm text-zinc-500">
            Placement cell and the recruiter own status changes. You will see
            updates here as they happen.
          </p>
        )}
        <ol className="space-y-3 rounded-xl border border-zinc-200 bg-white p-4">
          {app.timeline.map((t, i) => (
            <li key={`${t.at}-${i}`} className="text-sm">
              <p className="font-medium">
                {STATUS_LABEL[t.status as keyof typeof STATUS_LABEL] ?? t.status}
              </p>
              <p className="text-xs text-zinc-500">{formatDateTime(t.at)}</p>
              {t.note ? <p className="mt-0.5 text-zinc-600">{t.note}</p> : null}
            </li>
          ))}
        </ol>
      </aside>
    </div>
  );
}
