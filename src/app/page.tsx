import Link from "next/link";
import { BrandMark, PillLink } from "@/components/brand-mark";
import { HiringFunnel } from "@/components/hiring-funnel";
import { getSession } from "@/lib/auth";

export default async function HomePage() {
  const session = await getSession();

  return (
    <div className="min-h-full bg-[#e8ecf4] px-3 py-3 sm:px-5 sm:py-5">
      <div className="mx-auto min-h-[calc(100vh-2.5rem)] max-w-[1180px] rounded-[28px] bg-white px-5 py-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)] sm:px-10 sm:py-8">
        <header className="flex items-center justify-between gap-4">
          <BrandMark />
          <nav className="hidden items-center gap-7 text-sm text-slate-500 md:flex">
            <Link href="/" className="hover:text-slate-900">
              Home
            </Link>
            <Link href="/jobs" className="hover:text-slate-900">
              Roles
            </Link>
            <Link href="/login" className="hover:text-slate-900">
              Demo
            </Link>
            <Link href="/register" className="hover:text-slate-900">
              Students
            </Link>
          </nav>
          {session ? (
            <PillLink href="/dashboard" className="h-10 px-5">
              Open workspace
            </PillLink>
          ) : (
            <PillLink href="/login" className="h-10 px-5">
              Get early access
            </PillLink>
          )}
        </header>

        <section className="mt-10 grid items-center gap-12 pb-8 lg:grid-cols-[1.05fr_0.95fr] lg:mt-14">
          <div>
            <h1 className="text-[3.25rem] font-semibold leading-[0.95] tracking-tight text-slate-900 sm:text-7xl">
              Hiring
              <span className="mt-1 block font-medium text-[#9aa3b8]">Made</span>
              <span className="block font-medium text-[#9aa3b8]">Easy</span>
            </h1>
            <p className="mt-6 max-w-md text-[15px] leading-7 text-slate-400">
              Automatically find and assess campus talent. Cut hiring time for
              each role with eligibility checks, a recruiter pipeline, and
              placement-cell analytics.
            </p>
            <div className="mt-8">
              <PillLink href={session ? "/dashboard" : "/login"}>
                Get early access
              </PillLink>
            </div>
            <div className="mt-14">
              <p className="text-4xl font-semibold tracking-tight text-slate-900">
                3 roles
              </p>
              <p className="mt-1 text-sm text-slate-400">Partner with us</p>
              <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm font-medium text-slate-400">
                <span>HelixPay</span>
                <span>Vertex Cloud</span>
                <span>Northstar Labs</span>
                <span>NIT Nagpur</span>
              </div>
            </div>
          </div>
          <HiringFunnel />
        </section>

        <section className="mt-4 border-t border-slate-100 pt-10 pb-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
            Live demo · password Campus@2026
          </p>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            <DemoCard
              role="Student"
              email="student@orbithire.dev"
              body="Apply, track interviews, keep CGPA and skills current."
            />
            <DemoCard
              role="Recruiter"
              email="recruiter@orbithire.dev"
              body="Post roles, shortlist, schedule loops, release offers."
            />
            <DemoCard
              role="Placement cell"
              email="tpo@orbithire.dev"
              body="Funnel, average CTC, and branch mix on one screen."
            />
          </div>
        </section>
      </div>
    </div>
  );
}

function DemoCard({
  role,
  email,
  body,
}: {
  role: string;
  email: string;
  body: string;
}) {
  return (
    <div className="rounded-2xl bg-[#f3f5fa] p-5">
      <p className="font-semibold text-slate-900">{role}</p>
      <p className="mt-1 text-sm text-[#3b82f6]">{email}</p>
      <p className="mt-2 text-sm leading-6 text-slate-500">{body}</p>
    </div>
  );
}
