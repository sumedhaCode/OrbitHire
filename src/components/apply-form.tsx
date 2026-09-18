"use client";

import { useActionState } from "react";
import { applyToJobAction } from "@/app/actions/applications";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type State = { error?: string; ok?: boolean } | null;

export function ApplyForm({ jobId }: { jobId: string }) {
  const [state, action, pending] = useActionState(
    async (_prev: State, formData: FormData) => applyToJobAction(jobId, formData),
    null,
  );

  if (state?.ok) {
    return (
      <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-900">
        Application recorded. Track it under Applications.
      </p>
    );
  }

  return (
    <form action={action} className="space-y-3">
      <div className="space-y-2">
        <Label htmlFor="coverNote">Why you for this role</Label>
        <Textarea
          id="coverNote"
          name="coverNote"
          rows={5}
          placeholder="One concrete project, one constraint you handled, one reason this team."
        />
      </div>
      {state?.error ? (
        <p className="text-sm text-rose-700">{state.error}</p>
      ) : null}
      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "Submitting…" : "Submit application"}
      </Button>
    </form>
  );
}
