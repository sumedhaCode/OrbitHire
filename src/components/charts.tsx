"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export function BranchChart({
  data,
}: {
  data: { branch: string; students: number }[];
}) {
  if (data.length === 0) {
    return (
      <p className="text-sm text-zinc-500">No student records to chart yet.</p>
    );
  }
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" />
          <XAxis dataKey="branch" tick={{ fontSize: 12 }} />
          <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
          <Tooltip />
          <Bar dataKey="students" fill="#4338ca" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function FunnelList({
  byStatus,
}: {
  byStatus: Record<string, number>;
}) {
  const order = [
    ["applied", "Applied"],
    ["shortlisted", "Shortlisted"],
    ["interview", "Interview"],
    ["offer", "Offer"],
    ["placed", "Placed"],
    ["rejected", "Rejected"],
  ] as const;
  const max = Math.max(1, ...order.map(([k]) => byStatus[k] ?? 0));
  return (
    <ul className="space-y-3">
      {order.map(([key, label]) => {
        const n = byStatus[key] ?? 0;
        return (
          <li key={key}>
            <div className="mb-1 flex justify-between text-sm">
              <span>{label}</span>
              <span className="tabular-nums text-zinc-500">{n}</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-zinc-100">
              <div
                className="h-full rounded-full bg-indigo-600"
                style={{ width: `${(n / max) * 100}%` }}
              />
            </div>
          </li>
        );
      })}
    </ul>
  );
}
