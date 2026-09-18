import { redirect } from "next/navigation";
import { ProfileForm } from "@/components/profile-form";
import { currentUser, getStudentProfile } from "@/lib/data";

export default async function ProfilePage() {
  const session = await currentUser();
  if (!session) redirect("/login");
  const user = await getStudentProfile(session.id);
  if (!user) redirect("/login");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Profile</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Recruiters read CGPA, branch, and skills when they open an application.
          Keep this accurate — eligibility checks use these fields.
        </p>
      </div>
      <div className="rounded-xl border border-zinc-200 bg-white p-5">
        <p className="mb-4 text-xs text-zinc-400">
          {user.email} · {user.role}
          {user.college ? ` · ${user.college}` : ""}
        </p>
        <ProfileForm user={user} />
      </div>
    </div>
  );
}
