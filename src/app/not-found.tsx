import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-full flex-col items-center justify-center gap-3 px-4">
      <p className="text-sm text-zinc-500">That page is not in this workspace.</p>
      <Link href="/dashboard" className="text-sm text-[#3b82f6] hover:underline">
        Back to dashboard
      </Link>
    </div>
  );
}
