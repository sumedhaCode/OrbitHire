import type { ApplicationStatus } from "./models";

export function formatCtc(lpa?: number | null) {
  if (!lpa) return "—";
  return `₹${lpa.toFixed(lpa % 1 === 0 ? 0 : 1)} LPA`;
}

export function formatDate(value?: Date | string | null) {
  if (!value) return "—";
  const d = new Date(value);
  return d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatDateTime(value?: Date | string | null) {
  if (!value) return "—";
  const d = new Date(value);
  return d.toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export const STATUS_LABEL: Record<ApplicationStatus, string> = {
  applied: "Applied",
  shortlisted: "Shortlisted",
  interview: "Interview",
  offer: "Offer",
  rejected: "Rejected",
  placed: "Placed",
};

export const BRANCHES = [
  "CSE",
  "ECE",
  "EE",
  "ME",
  "CE",
  "IT",
  "AI & DS",
] as const;
