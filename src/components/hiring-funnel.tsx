const AVATARS = [
  { initials: "SD", color: "bg-rose-300", left: "42%", top: "0%" },
  { initials: "IK", color: "bg-sky-400", left: "58%", top: "2%" },
  { initials: "MN", color: "bg-amber-300", left: "32%", top: "18%" },
  { initials: "KS", color: "bg-violet-400", left: "68%", top: "18%" },
  { initials: "DB", color: "bg-teal-400", left: "50%", top: "20%" },
  { initials: "RP", color: "bg-orange-300", left: "38%", top: "38%" },
  { initials: "AD", color: "bg-blue-500", left: "60%", top: "38%" },
];

const STEPS = [
  { label: "Job posting", className: "bg-emerald-500" },
  { label: "Resume parse", className: "bg-sky-500" },
  { label: "Scheduling", className: "bg-orange-500" },
  { label: "Screening", className: "bg-blue-600" },
  { label: "Assessment", className: "bg-fuchsia-500" },
  { label: "AI interview", className: "bg-teal-600" },
];

export function HiringFunnel() {
  return (
    <div className="relative overflow-hidden rounded-[28px] bg-[#f3f5fa] px-6 py-10 sm:px-10">
      <div className="relative mx-auto mb-2 h-40 w-56">
        {AVATARS.map((a) => (
          <span
            key={a.initials}
            className={`absolute flex size-11 -translate-x-1/2 items-center justify-center rounded-full text-xs font-semibold text-white shadow-md ring-[5px] ring-[#f3f5fa] ${a.color}`}
            style={{ left: a.left, top: a.top }}
          >
            {a.initials}
          </span>
        ))}
      </div>

      <div className="mx-auto flex max-w-[220px] flex-col items-center">
        <Connector />
        <Node>Job requisition</Node>
        <Connector />
        <Node dark>AI automation</Node>
        <div className="mt-3 grid w-full grid-cols-2 gap-2">
          {STEPS.map((s) => (
            <span
              key={s.label}
              className={`rounded-full px-2.5 py-1.5 text-center text-[11px] font-medium text-white ${s.className}`}
            >
              {s.label}
            </span>
          ))}
        </div>
        <Connector />
        <Node>Human interview</Node>
        <Connector />
        <Node>Onboarding</Node>
      </div>
    </div>
  );
}

function Node({
  children,
  dark = false,
}: {
  children: React.ReactNode;
  dark?: boolean;
}) {
  return (
    <div
      className={
        dark
          ? "rounded-full bg-slate-900 px-5 py-2 text-sm font-medium text-white shadow-sm"
          : "rounded-full bg-white px-5 py-2 text-sm font-medium text-slate-700 shadow-sm ring-1 ring-slate-200/80"
      }
    >
      {children}
    </div>
  );
}

function Connector() {
  return <div className="h-6 w-px bg-slate-300" />;
}
