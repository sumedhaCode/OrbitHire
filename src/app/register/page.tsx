import Link from "next/link";
import { redirect } from "next/navigation";
import { RegisterForm } from "@/components/auth-forms";
import { BrandMark } from "@/components/brand-mark";
import { getSession } from "@/lib/auth";

export default async function RegisterPage() {
  const session = await getSession();
  if (session) redirect("/dashboard");

  return (
    <div className="flex min-h-full items-center justify-center bg-[#e8ecf4] px-4 py-12">
      <div className="w-full max-w-md rounded-[28px] bg-white p-8 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
        <BrandMark />
        <h1 className="mt-6 text-3xl font-semibold tracking-tight text-slate-900">
          Student registration
        </h1>
        <p className="mt-1 text-sm text-slate-400">
          Recruiter and TPO seats are provisioned by the placement cell — use the demo logins for those roles.
        </p>
        <div className="mt-6">
          <RegisterForm />
        </div>
        <p className="mt-6 text-center text-sm text-slate-400">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-[#3b82f6] hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
