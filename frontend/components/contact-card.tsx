import type { ReactNode } from "react";

type ContactCardProps = {
  title: string;
  value: string;
  icon: ReactNode;
  sub?: string;
};

export function ContactCard({ title, value, icon, sub }: ContactCardProps) {
  return (
    <div className="group relative isolate flex items-center gap-3 rounded-xl border border-neutral-200 bg-white/90 px-5 py-4 shadow-[0_10px_28px_rgba(15,23,42,0.08)] backdrop-blur-sm transition duration-150 hover:-translate-y-0.5 hover:shadow-[0_16px_36px_rgba(15,23,42,0.12)]">
      <div className="relative flex h-11 w-11 items-center justify-center rounded-lg border border-neutral-200 text-[#ED1C24]">
        {icon}
      </div>
      <div className="relative space-y-1">
        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-neutral-500">
          {title}
        </p>
        <p className="text-sm font-semibold text-[#0A0A0A] sm:text-base">{value}</p>
        {sub ? <p className="text-[12px] text-neutral-500">{sub}</p> : null}
      </div>
    </div>
  );
}
