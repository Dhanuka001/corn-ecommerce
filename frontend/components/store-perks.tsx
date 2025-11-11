"use client";

import type { SVGAttributes } from "react";

type IconProps = SVGAttributes<SVGSVGElement> & {
  size?: number;
};

const LightningIcon = ({ size = 24, ...props }: IconProps) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.8}
    strokeLinecap="round"
    strokeLinejoin="round"
    width={size}
    height={size}
    aria-hidden
    {...props}
  >
    <path d="M13 2 3 14h7l-1 8 10-12h-7l1-8Z" />
  </svg>
);

const RefreshIcon = ({ size = 24, ...props }: IconProps) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.8}
    strokeLinecap="round"
    strokeLinejoin="round"
    width={size}
    height={size}
    aria-hidden
    {...props}
  >
    <path d="M21 2v6h-6" />
    <path d="M3 12a9 9 0 0 1 16-5l2 2" />
    <path d="M3 22v-6h6" />
    <path d="M21 12a9 9 0 0 1-16 5l-2-2" />
  </svg>
);

const ShieldIcon = ({ size = 24, ...props }: IconProps) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.8}
    strokeLinecap="round"
    strokeLinejoin="round"
    width={size}
    height={size}
    aria-hidden
    {...props}
  >
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);

const ChatIcon = ({ size = 24, ...props }: IconProps) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.8}
    strokeLinecap="round"
    strokeLinejoin="round"
    width={size}
    height={size}
    aria-hidden
    {...props}
  >
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8Z" />
    <path d="M8 12h.01M12 12h.01M16 12h.01" />
  </svg>
);

const perks = [
  {
    title: "Express Dispatch",
    description: "Same-day processing for orders placed before 2 PM.",
    icon: LightningIcon,
  },
  {
    title: "Easy Exchanges",
    description: "Swap or return products within 30 days, no hassle.",
    icon: RefreshIcon,
  },
  {
    title: "Secure Payments",
    description: "256-bit encryption keeps every transaction protected.",
    icon: ShieldIcon,
  },
  {
    title: "24/7 Support",
    description: "Chat with dedicated product experts any time.",
    icon: ChatIcon,
  },
];

export function StorePerks() {
  return (
    <section
      className="px-4 lg:px-0"
      aria-label="Corn Electronics service highlights"
    >
      <div className="rounded-[28px]  bg-white/90 p-6 shadow-sm shadow-primary/5 backdrop-blur-sm sm:p-8">
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {perks.map((perk) => (
            <article
              key={perk.title}
              className="flex items-start gap-4 rounded-2xl border border-transparent px-2 py-1 transition hover:border-primary/30"
            >
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full  bg-primary/10 text-primary">
                <perk.icon size={24} />
              </div>
              <div>
                <h3 className="text-base font-semibold text-slate-900">
                  {perk.title}
                </h3>
                <p className="text-sm text-slate-600">{perk.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
