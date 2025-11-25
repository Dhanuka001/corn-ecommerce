import type { ReactNode } from "react";

type ContactCardProps = {
  title: string;
  value: string;
  icon: ReactNode;
  sub?: string;
};

export function ContactCard({ title, value, icon, sub }: ContactCardProps) {
  return (
    <div className="group flex items-start gap-3 rounded-xl border border-neutral-200 bg-white p-4 shadow-[0_10px_30px_rgba(15,23,42,0.08)] transition hover:-translate-y-1 hover:shadow-[0_20px_45px_rgba(255,77,77,0.22)]">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#FF4D4D]/18 via-[#FF4D4D]/12 to-white text-[#FF4D4D] shadow-inner shadow-[#FF4D4D]/10">
        {icon}
      </div>
      <div className="space-y-1">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-neutral-500">
          {title}
        </p>
        <p className="text-base font-semibold text-[#0A0A0A]">{value}</p>
        {sub ? <p className="text-sm text-neutral-500">{sub}</p> : null}
      </div>
    </div>
  );
}
