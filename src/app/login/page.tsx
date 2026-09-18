import Link from "next/link";
import { redirect } from "next/navigation";
import { DemoFill, LoginForm } from "@/components/auth-forms";
import { getSession } from "@/lib/auth";

export default async function LoginPage() {
  const session = await getSession();
  if (session) redirect("/dashboard");

  return (
    <div className="flex min-h-full items-center justify-center bg-zinc-50 px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
        <p className="text-xs font-semibold tracking-[0.2em] text-indigo-700">
          ORBITHIRE
        </p>
        <h1 className="mt-2 text-2xl font-semibold">Sign in</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Use a seeded demo account or the student you registered.
        </p>
        <div className="mt-6">
          <LoginForm />
        </div>
        <div className="mt-5 grid gap-2">
          <p className="text-xs text-zinc-500">Fill a demo account</p>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
            <DemoFill email="student@orbithire.dev" label="Student" />
            <DemoFill email="recruiter@orbithire.dev" label="Recruiter" />
            <DemoFill email="tpo@orbithire.dev" label="TPO" />
          </div>
          <p className="text-xs text-zinc-400">Password for all demos: Campus@2026</p>
        </div>
        <p className="mt-6 text-center text-sm text-zinc-500">
          New student?{" "}
          <Link href="/register" className="text-indigo-700 hover:underline">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
