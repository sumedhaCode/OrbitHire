"use client";

import { useActionState } from "react";
import { updateProfileAction } from "@/app/actions/profile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { PublicUser } from "@/lib/data";
import { BRANCHES } from "@/lib/format";

type State = { error?: string; ok?: boolean } | null;

export function ProfileForm({ user }: { user: PublicUser }) {
  const [state, action, pending] = useActionState(
    async (_prev: State, formData: FormData) => updateProfileAction(formData),
    null,
  );

  return (
    <form action={action} className="max-w-xl space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input id="name" name="name" defaultValue={user.name} required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="bio">Bio</Label>
        <Textarea id="bio" name="bio" rows={4} defaultValue={user.bio} />
      </div>
      {user.role === "student" ? (
        <>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="branch">Branch</Label>
              <select
                id="branch"
                name="branch"
                defaultValue={user.branch || "CSE"}
                className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm"
              >
                {BRANCHES.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="cgpa">CGPA</Label>
              <Input
                id="cgpa"
                name="cgpa"
                type="number"
                step="0.01"
                min="0"
                max="10"
                defaultValue={user.cgpa ?? ""}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="rollNumber">Roll number</Label>
            <Input id="rollNumber" name="rollNumber" defaultValue={user.rollNumber} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="skills">Skills (comma separated)</Label>
            <Input
              id="skills"
              name="skills"
              defaultValue={user.skills.join(", ")}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="resumeUrl">Resume URL</Label>
            <Input id="resumeUrl" name="resumeUrl" defaultValue={user.resumeUrl} />
          </div>
        </>
      ) : null}
      {user.role === "recruiter" ? (
        <>
          <div className="space-y-2">
            <Label htmlFor="companyName">Company</Label>
            <Input
              id="companyName"
              name="companyName"
              defaultValue={user.companyName}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="designation">Designation</Label>
            <Input
              id="designation"
              name="designation"
              defaultValue={user.designation}
            />
          </div>
        </>
      ) : null}
      {state?.error ? <p className="text-sm text-rose-700">{state.error}</p> : null}
      {state?.ok ? (
        <p className="text-sm text-emerald-700">Profile saved.</p>
      ) : null}
      <Button type="submit" disabled={pending}>
        {pending ? "Saving…" : "Save profile"}
      </Button>
    </form>
  );
}
