import Link from "next/link";
import { redirect } from "next/navigation";
import { DemoFill, LoginForm } from "@/components/auth-forms";
import { BrandMark } from "@/components/brand-mark";
import { getSession } from "@/lib/auth";

export default async function LoginPage() {
  const session = await getSession();
  if (session) redirect("/dashboard");

  return (
    <div className="flex min-h-full items-center justify-center bg-[#e8ecf4] px-4 py-12">
      <div className="w-full max-w-md rounded-[28px] bg-white p-8 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
        <BrandMark />
        <h1 className="mt-6 text-3xl font-semibold tracking-tight text-slate-900">
          Sign in
        </h1>
        <p className="mt-1 text-sm text-slate-400">
          Use a seeded demo account or the student you registered.
        </p>
        <div className="mt-6">
          <LoginForm />
        </div>
        <div className="mt-5 grid gap-2">
          <p className="text-xs text-slate-400">Fill a demo account</p>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
            <DemoFill email="student@orbithire.dev" label="Student" />
            <DemoFill email="recruiter@orbithire.dev" label="Recruiter" />
            <DemoFill email="tpo@orbithire.dev" label="TPO" />
          </div>
          <p className="text-xs text-slate-400">Password for all demos: Campus@2026</p>
        </div>
        <p className="mt-6 text-center text-sm text-slate-400">
          New student?{" "}
          <Link href="/register" className="font-medium text-[#3b82f6] hover:underline">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
