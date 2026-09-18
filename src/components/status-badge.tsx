import { Badge } from "@/components/ui/badge";
import type { ApplicationStatus } from "@/lib/models";
import { STATUS_LABEL } from "@/lib/format";
import { cn } from "@/lib/utils";

const styles: Record<ApplicationStatus, string> = {
  applied: "bg-sky-50 text-sky-800 border-sky-200",
  shortlisted: "bg-violet-50 text-violet-800 border-violet-200",
  interview: "bg-amber-50 text-amber-900 border-amber-200",
  offer: "bg-teal-50 text-teal-800 border-teal-200",
  placed: "bg-emerald-50 text-emerald-800 border-emerald-200",
  rejected: "bg-rose-50 text-rose-800 border-rose-200",
};

export function StatusBadge({ status }: { status: ApplicationStatus }) {
  return (
    <Badge
      variant="outline"
      className={cn("font-medium capitalize", styles[status])}
    >
      {STATUS_LABEL[status]}
    </Badge>
  );
}
