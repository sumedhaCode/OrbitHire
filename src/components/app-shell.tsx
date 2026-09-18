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
    <div className="min-h-full bg-zinc-50">
      <div className="flex min-h-full">
        <aside className="hidden w-60 shrink-0 border-r border-zinc-200 bg-white md:flex md:flex-col">
          <Link href="/dashboard" className="px-5 py-5">
            <p className="text-xs font-semibold tracking-[0.2em] text-indigo-700">
              ORBITHIRE
            </p>
            <p className="mt-1 text-sm text-zinc-500">Campus placement OS</p>
          </Link>
          <nav className="flex flex-1 flex-col gap-0.5 px-3">
            {items.map((item) => {
              const active =
                pathname === item.href ||
                (item.href !== "/dashboard" && pathname.startsWith(item.href) && item.href !== "/jobs/new" && !(item.href === "/jobs" && pathname.startsWith("/jobs/new")));
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 rounded-lg px-3 py-2 text-sm",
                    active
                      ? "bg-indigo-50 font-medium text-indigo-900"
                      : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900",
                  )}
                >
                  <Icon className="size-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="border-t border-zinc-200 p-4">
            <p className="truncate text-sm font-medium">{user.name}</p>
            <p className="truncate text-xs text-zinc-500">{roleLabel}</p>
            <form action={logoutAction} className="mt-3">
              <Button variant="outline" size="sm" className="w-full justify-start">
                <LogOut className="size-3.5" />
                Sign out
              </Button>
            </form>
          </div>
        </aside>
        <div className="flex min-w-0 flex-1 flex-col">
          <header className="flex items-center justify-between border-b border-zinc-200 bg-white px-4 py-3 md:hidden">
            <Link href="/dashboard" className="text-xs font-semibold tracking-[0.2em] text-indigo-700">
              ORBITHIRE
            </Link>
            <form action={logoutAction}>
              <Button variant="ghost" size="sm">
                Sign out
              </Button>
            </form>
          </header>
          <nav className="flex gap-1 overflow-x-auto border-b border-zinc-200 bg-white px-2 py-2 md:hidden">
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "whitespace-nowrap rounded-full px-3 py-1 text-xs",
                  pathname === item.href
                    ? "bg-indigo-50 text-indigo-900"
                    : "text-zinc-600",
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
