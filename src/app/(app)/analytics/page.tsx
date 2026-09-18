import { redirect } from "next/navigation";
import { BranchChart, FunnelList } from "@/components/charts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { currentUser, dashboardStats } from "@/lib/data";
import { formatCtc } from "@/lib/format";

export default async function AnalyticsPage() {
  const session = await currentUser();
  if (!session) redirect("/login");
  if (session.role !== "tpo") redirect("/dashboard");
  const stats = await dashboardStats(session);
  const placementRate =
    stats.students > 0 ? Math.round((stats.placed / stats.students) * 100) : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Season analytics</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Numbers a TPO can put on a slide. Backed by MongoDB aggregations, not hardcoded copy.
        </p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-zinc-200 bg-white p-4">
          <p className="text-xs text-zinc-500">Students in batch</p>
          <p className="mt-1 text-2xl font-semibold">{stats.students}</p>
        </div>
        <div className="rounded-xl border border-zinc-200 bg-white p-4">
          <p className="text-xs text-zinc-500">Placed</p>
          <p className="mt-1 text-2xl font-semibold">{stats.placed}</p>
        </div>
        <div className="rounded-xl border border-zinc-200 bg-white p-4">
          <p className="text-xs text-zinc-500">Placement rate</p>
          <p className="mt-1 text-2xl font-semibold">{placementRate}%</p>
        </div>
        <div className="rounded-xl border border-zinc-200 bg-white p-4">
          <p className="text-xs text-zinc-500">Average offer</p>
          <p className="mt-1 text-2xl font-semibold">{formatCtc(stats.avgCtc)}</p>
        </div>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Funnel</CardTitle>
            <CardDescription>Every application counted once, in its current stage</CardDescription>
          </CardHeader>
          <CardContent>
            <FunnelList byStatus={stats.byStatus} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Students by branch</CardTitle>
            <CardDescription>Headcount in the seeded + registered batch</CardDescription>
          </CardHeader>
          <CardContent>
            <BranchChart data={stats.branchStats} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
