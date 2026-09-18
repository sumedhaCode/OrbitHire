"use client";

import { useTransition } from "react";
import {
  releaseOfferAction,
  scheduleInterviewAction,
  updateApplicationStatusAction,
} from "@/app/actions/applications";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { PublicApplication } from "@/lib/data";
import type { ApplicationStatus } from "@/lib/models";

export function PipelineActions({
  application,
}: {
  application: PublicApplication;
}) {
  const [pending, start] = useTransition();
  const s = application.status;

  function move(status: ApplicationStatus) {
    start(async () => {
      await updateApplicationStatusAction(application.id, status);
    });
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {s === "applied" ? (
          <>
            <Button size="sm" disabled={pending} onClick={() => move("shortlisted")}>
              Shortlist
            </Button>
            <Button
              size="sm"
              variant="destructive"
              disabled={pending}
              onClick={() => move("rejected")}
            >
              Reject
            </Button>
          </>
        ) : null}
        {s === "shortlisted" ? (
          <Button
            size="sm"
            variant="destructive"
            disabled={pending}
            onClick={() => move("rejected")}
          >
            Reject
          </Button>
        ) : null}
        {s === "interview" ? (
          <Button
            size="sm"
            variant="destructive"
            disabled={pending}
            onClick={() => move("rejected")}
          >
            Reject after loop
          </Button>
        ) : null}
        {s === "offer" ? (
          <Button size="sm" disabled={pending} onClick={() => move("placed")}>
            Mark placed
          </Button>
        ) : null}
      </div>

      {s === "shortlisted" ? (
        <form
          className="space-y-3 rounded-lg border border-zinc-200 bg-white p-3"
          action={scheduleInterviewAction.bind(null, application.id)}
        >
          <p className="text-sm font-medium">Schedule interview</p>
          <div className="space-y-2">
            <Label htmlFor="interviewAt">When</Label>
            <Input
              id="interviewAt"
              name="interviewAt"
              type="datetime-local"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="interviewMode">Mode</Label>
            <select
              id="interviewMode"
              name="interviewMode"
              defaultValue="online"
              className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm"
            >
              <option value="online">Online</option>
              <option value="onsite">On campus</option>
            </select>
          </div>
          <Button type="submit" size="sm">
            Move to interview
          </Button>
        </form>
      ) : null}

      {s === "interview" ? (
        <form
          className="space-y-3 rounded-lg border border-zinc-200 bg-white p-3"
          action={releaseOfferAction.bind(null, application.id)}
        >
          <p className="text-sm font-medium">Release offer</p>
          <div className="space-y-2">
            <Label htmlFor="offerCtcLpa">CTC (LPA)</Label>
            <Input
              id="offerCtcLpa"
              name="offerCtcLpa"
              type="number"
              step="0.1"
              min="0"
              required
            />
          </div>
          <Button type="submit" size="sm">
            Send offer
          </Button>
        </form>
      ) : null}
    </div>
  );
}
