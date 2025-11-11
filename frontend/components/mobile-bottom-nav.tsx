"use client";

import Link from "next/link";
import type { SVGAttributes } from "react";

type IconProps = SVGAttributes<SVGSVGElement> & {
  size?: number;
};

const HomeIcon = ({ size = 22, ...props }: IconProps) => (
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
    <path d="m3 9 9-7 9 7" />
    <path d="M9 22V12h6v10" />
    <path d="M2 22h20" />
  </svg>
);

const ShopIcon = ({ size = 22, ...props }: IconProps) => (
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
    <path d="M3 9h18l-2 11a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2Z" />
    <path d="m3 9 2-5h14l2 5" />
    <path d="M9 13h6" />
  </svg>
);

const HeartIcon = ({ size = 22, ...props }: IconProps) => (
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
    <path d="M19 5a5 5 0 0 0-7 0l-.9.9-.9-.9a5 5 0 0 0-7 7l1 1 7 7 7-7 1-1a5 5 0 0 0 0-7Z" />
  </svg>
);

const UserIcon = ({ size = 22, ...props }: IconProps) => (
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
    <circle cx="12" cy="8" r="4" />
    <path d="M6 20a6 6 0 0 1 12 0" />
  </svg>
);

const navItems = [
  { label: "Home", href: "/", Icon: HomeIcon, active: true },
  { label: "Shop", href: "/#shop", Icon: ShopIcon },
  { label: "Wishlist", href: "/#wishlist", Icon: HeartIcon },
  { label: "My Account", href: "/#account", Icon: UserIcon },
] as const;

export function MobileBottomNav() {
  return (
    <nav
      aria-label="Primary mobile navigation"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200/70 bg-white/95 pb-[calc(env(safe-area-inset-bottom)+0.35rem)] pt-2 shadow-[0_-10px_30px_rgba(15,23,42,0.08)] backdrop-blur lg:hidden"
    >
      <div className="mx-auto flex max-w-3xl items-center justify-between px-4">
        {navItems.map(({ label, href, Icon, active }) => {
          const isActive = Boolean(active);

          return (
            <Link
              key={label}
              href={href}
              className={`flex flex-1 flex-col items-center gap-1 text-xs font-semibold transition ${
                isActive ? "text-primary" : "text-slate-500"
              }`}
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-50">
                <Icon className={isActive ? "text-primary" : "text-slate-500"} />
              </div>
              <span>{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
