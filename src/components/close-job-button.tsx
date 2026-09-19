"use client";

import { closeJobAction } from "@/app/actions/jobs";
import { Button } from "@/components/ui/button";
import { useTransition } from "react";

export function CloseJobButton({
  jobId,
  status,
}: {
  jobId: string;
  status: "open" | "closed";
}) {
  const [pending, start] = useTransition();
  return (
    <Button
      variant="outline"
      size="sm"
      disabled={pending}
      onClick={() =>
        start(() => {
          void closeJobAction(jobId);
        })
      }
    >
      {status === "open" ? "Close role" : "Reopen role"}
    </Button>
  );
}
