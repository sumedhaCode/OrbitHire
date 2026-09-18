import Link from "next/link";
import { ArrowRight, Building2, LineChart, ShieldCheck } from "lucide-react";
import { getSession } from "@/lib/auth";

export default async function HomePage() {
  const session = await getSession();

  return (
    <div className="min-h-full bg-[#0b1020] text-zinc-100">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5">
        <p className="text-xs font-semibold tracking-[0.22em] text-indigo-300">
          ORBITHIRE
        </p>
        <div className="flex items-center gap-2">
          {session ? (
            <Link
              href="/dashboard"
              className="inline-flex h-8 items-center rounded-lg bg-indigo-500 px-3 text-sm font-medium text-white hover:bg-indigo-400"
            >
              Open workspace
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="inline-flex h-8 items-center rounded-lg px-3 text-sm text-zinc-100 hover:bg-white/10"
              >
                Sign in
              </Link>
              <Link
                href="/register"
                className="inline-flex h-8 items-center rounded-lg bg-indigo-500 px-3 text-sm font-medium text-white hover:bg-indigo-400"
              >
                Student sign up
              </Link>
            </>
          )}
        </div>
      </header>

      <section className="mx-auto grid max-w-6xl gap-12 px-4 pb-20 pt-10 md:grid-cols-[1.2fr_0.8fr] md:pt-16">
        <div>
          <p className="text-sm text-indigo-300">Built for TPO cells, recruiters, and 2026 batches</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight md:text-5xl">
            Run campus hiring like a product team, not a spreadsheet.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-zinc-400">
            OrbitHire is a full-stack campus placement system: eligibility-aware
            applications, a recruiter pipeline with interviews and offers, and
            placement-cell analytics. Next.js App Router, MongoDB, role-based
            access — the stack MNCs actually ask about.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/login"
              className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-indigo-500 px-3 text-sm font-medium text-white hover:bg-indigo-400"
            >
              Try the live demo <ArrowRight className="size-4" />
            </Link>
            <Link
              href="/register"
              className="inline-flex h-9 items-center rounded-lg border border-white/20 px-3 text-sm text-white hover:bg-white/10"
            >
              Create a student account
            </Link>
          </div>
          <dl className="mt-12 grid max-w-lg grid-cols-3 gap-4 border-t border-white/10 pt-8 text-sm">
            <div>
              <dt className="text-zinc-500">Roles</dt>
              <dd className="mt-1 text-lg font-medium">3</dd>
            </div>
            <div>
              <dt className="text-zinc-500">Pipeline stages</dt>
              <dd className="mt-1 text-lg font-medium">6</dd>
            </div>
            <div>
              <dt className="text-zinc-500">Seeded demo</dt>
              <dd className="mt-1 text-lg font-medium">Ready</dd>
            </div>
          </dl>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <p className="text-xs font-medium uppercase tracking-wider text-zinc-400">
            Demo accounts · password <span className="text-zinc-200">Campus@2026</span>
          </p>
          <ul className="mt-4 space-y-3 text-sm">
            <li className="rounded-xl bg-black/30 p-3">
              <p className="font-medium">Student</p>
              <p className="text-zinc-400">student@orbithire.dev</p>
              <p className="mt-1 text-xs text-zinc-500">Apply, track interviews, maintain a profile with CGPA and skills.</p>
            </li>
            <li className="rounded-xl bg-black/30 p-3">
              <p className="font-medium">Recruiter · HelixPay</p>
              <p className="text-zinc-400">recruiter@orbithire.dev</p>
              <p className="mt-1 text-xs text-zinc-500">Post roles, shortlist, schedule loops, release offers.</p>
            </li>
            <li className="rounded-xl bg-black/30 p-3">
              <p className="font-medium">Training & Placement Officer</p>
              <p className="text-zinc-400">tpo@orbithire.dev</p>
              <p className="mt-1 text-xs text-zinc-500">See the full funnel, average CTC, and branch mix.</p>
            </li>
          </ul>
        </div>
      </section>

      <section className="border-t border-white/10 bg-[#0e1428]">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-16 md:grid-cols-3">
          <Feature
            icon={ShieldCheck}
            title="Eligibility is enforced"
            body="CGPA floors and branch filters run at apply-time, not as a polite note on a PDF. Duplicate applications are blocked in MongoDB."
          />
          <Feature
            icon={Building2}
            title="Recruiter pipeline"
            body="Kanban-style stages from applied → placed. Interviews carry time and mode; offers carry CTC so analytics are real numbers."
          />
          <Feature
            icon={LineChart}
            title="TPO analytics"
            body="Funnel counts, average offered CTC, and student headcount by branch — the slides placement cells actually present."
          />
        </div>
      </section>

      <footer className="border-t border-white/10 px-4 py-8 text-center text-xs text-zinc-500">
        OrbitHire · Next.js, MongoDB, Mongoose · demo data is local unless you set MONGODB_URI
      </footer>
    </div>
  );
}

function Feature({
  icon: Icon,
  title,
  body,
}: {
  icon: typeof ShieldCheck;
  title: string;
  body: string;
}) {
  return (
    <div>
      <Icon className="size-5 text-indigo-300" />
      <h2 className="mt-3 text-lg font-medium">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-zinc-400">{body}</p>
    </div>
  );
}
