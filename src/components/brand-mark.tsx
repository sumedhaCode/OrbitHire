import Link from "next/link";
import { cn } from "@/lib/utils";

export function BrandMark({
  className,
  compact = false,
}: {
  className?: string;
  compact?: boolean;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <span className="relative flex size-8 items-center justify-center">
        <span className="absolute size-8 rounded-full bg-[#3b82f6]/15" />
        <span className="absolute size-5 rounded-full bg-[#3b82f6]" />
        <span className="absolute left-1.5 top-1.5 size-3 rounded-full bg-white/90" />
      </span>
      {compact ? null : (
        <span className="text-[17px] font-semibold tracking-tight text-slate-900">
          OrbitHire
        </span>
      )}
    </span>
  );
}

export function PillLink({
  href,
  children,
  className,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex h-11 items-center justify-center rounded-full bg-[#3b82f6] px-6 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(59,130,246,0.28)] transition hover:bg-[#2563eb]",
        className,
      )}
    >
      {children}
    </Link>
  );
}
