import { redirect } from "next/navigation";
import { createJobAction } from "@/app/actions/jobs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { currentUser } from "@/lib/data";
import { BRANCHES } from "@/lib/format";

export default async function NewJobPage() {
  const session = await currentUser();
  if (!session) redirect("/login");
  if (session.role !== "recruiter") redirect("/jobs");

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Post a role</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Listed under {session.companyName || "your company"}. Students who miss
          CGPA or branch filters are blocked at apply time.
        </p>
      </div>
      <form action={createJobAction} className="space-y-4 rounded-xl border border-zinc-200 bg-white p-5">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input id="title" name="title" required placeholder="Software Engineer, Graduate" />
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input id="location" name="location" required placeholder="Bengaluru · Hybrid" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="type">Type</Label>
            <select
              id="type"
              name="type"
              className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm"
              defaultValue="full-time"
            >
              <option value="full-time">Full-time</option>
              <option value="internship">Internship</option>
            </select>
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="ctcLpa">CTC (LPA)</Label>
            <Input id="ctcLpa" name="ctcLpa" type="number" step="0.1" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="stipend">Stipend (internships)</Label>
            <Input id="stipend" name="stipend" placeholder="₹50,000 / month" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="minCgpa">Min CGPA</Label>
            <Input id="minCgpa" name="minCgpa" type="number" step="0.1" defaultValue="0" />
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="openings">Openings</Label>
            <Input id="openings" name="openings" type="number" defaultValue="1" min="1" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="deadline">Deadline</Label>
            <Input id="deadline" name="deadline" type="date" required />
          </div>
        </div>
        <fieldset className="space-y-2">
          <legend className="text-sm font-medium">Eligible branches</legend>
          <div className="flex flex-wrap gap-3">
            {BRANCHES.map((b) => (
              <label key={b} className="flex items-center gap-1.5 text-sm">
                <input type="checkbox" name="branches" value={b} defaultChecked={b === "CSE"} />
                {b}
              </label>
            ))}
          </div>
        </fieldset>
        <div className="space-y-2">
          <Label htmlFor="skills">Skills (comma separated)</Label>
          <Input id="skills" name="skills" placeholder="TypeScript, MongoDB, System Design" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" name="description" rows={8} required />
        </div>
        <Button type="submit">Publish role</Button>
      </form>
    </div>
  );
}
