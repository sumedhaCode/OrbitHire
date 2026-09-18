"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Briefcase,
  ClipboardList,
  Gauge,
  Kanban,
  LogOut,
  PlusCircle,
  UserRound,
} from "lucide-react";
import { logoutAction } from "@/app/actions/auth";
import { BrandMark } from "@/components/brand-mark";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { SessionUser } from "@/lib/auth";

const NAV = [
  { href: "/dashboard", label: "Dashboard", icon: Gauge, roles: ["student", "recruiter", "tpo"] },
  { href: "/jobs", label: "Roles", icon: Briefcase, roles: ["student", "recruiter", "tpo"] },
  { href: "/jobs/new", label: "Post a role", icon: PlusCircle, roles: ["recruiter"] },
  { href: "/applications", label: "Applications", icon: ClipboardList, roles: ["student", "recruiter", "tpo"] },
  { href: "/pipeline", label: "Pipeline", icon: Kanban, roles: ["recruiter", "tpo"] },
  { href: "/analytics", label: "Analytics", icon: Gauge, roles: ["tpo"] },
  { href: "/profile", label: "Profile", icon: UserRound, roles: ["student", "recruiter", "tpo"] },
];

export function AppShell({
  user,
  children,
}: {
  user: SessionUser;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const items = NAV.filter((item) => item.roles.includes(user.role));
  const roleLabel =
    user.role === "tpo"
      ? "Placement cell"
      : user.role === "recruiter"
        ? user.companyName || "Recruiter"
        : "Student";

  return (
    <div className="min-h-full bg-[#e8ecf4]">
      <div className="flex min-h-full">
        <aside className="hidden w-60 shrink-0 border-r border-slate-200/80 bg-white md:flex md:flex-col">
          <Link href="/dashboard" className="px-5 py-6">
            <BrandMark />
            <p className="mt-2 pl-10 text-xs text-slate-400">Campus placement OS</p>
          </Link>
          <nav className="flex flex-1 flex-col gap-0.5 px-3">
            {items.map((item) => {
              const active =
                pathname === item.href ||
                (item.href !== "/dashboard" &&
                  pathname.startsWith(item.href) &&
                  item.href !== "/jobs/new" &&
                  !(item.href === "/jobs" && pathname.startsWith("/jobs/new")));
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 rounded-full px-3 py-2 text-sm",
                    active
                      ? "bg-sky-50 font-medium text-[#2563eb]"
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-900",
                  )}
                >
                  <Icon className="size-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="border-t border-slate-100 p-4">
            <p className="truncate text-sm font-medium text-slate-900">{user.name}</p>
            <p className="truncate text-xs text-slate-400">{roleLabel}</p>
            <form action={logoutAction} className="mt-3">
              <Button variant="outline" size="sm" className="w-full justify-start">
                <LogOut className="size-3.5" />
                Sign out
              </Button>
            </form>
          </div>
        </aside>
        <div className="flex min-w-0 flex-1 flex-col">
          <header className="flex items-center justify-between border-b border-slate-200/80 bg-white px-4 py-3 md:hidden">
            <Link href="/dashboard">
              <BrandMark />
            </Link>
            <form action={logoutAction}>
              <Button variant="ghost" size="sm">
                Sign out
              </Button>
            </form>
          </header>
          <nav className="flex gap-1 overflow-x-auto border-b border-slate-200/80 bg-white px-2 py-2 md:hidden">
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "whitespace-nowrap rounded-full px-3 py-1 text-xs",
                  pathname === item.href
                    ? "bg-sky-50 text-[#2563eb]"
                    : "text-slate-500",
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <main className="flex-1 px-4 py-6 md:px-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
