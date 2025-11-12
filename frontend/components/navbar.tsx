"use client";

import Image from "next/image";
import { useState, type SVGAttributes } from "react";

type IconProps = SVGAttributes<SVGSVGElement> & {
  size?: number;
};

const MenuIcon = ({ size = 20, ...props }: IconProps) => (
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
    <path d="M4 7h16M4 12h16M4 17h10" />
  </svg>
);

const SearchIcon = ({ size = 20, ...props }: IconProps) => (
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
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-4-4" />
  </svg>
);

const ChevronDownIcon = ({ size = 16, ...props }: IconProps) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.6}
    strokeLinecap="round"
    strokeLinejoin="round"
    width={size}
    height={size}
    aria-hidden
    {...props}
  >
    <path d="m6 9 6 6 6-6" />
  </svg>
);

const UserIcon = ({ size = 20, ...props }: IconProps) => (
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

const HeartIcon = ({ size = 20, ...props }: IconProps) => (
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
    <path d="M19 4a5 5 0 0 0-7 0l-.87.88L10.26 4a5 5 0 0 0-7 7l1 1 7 7 7-7 1-1a5 5 0 0 0 0-7Z" />
  </svg>
);

const BagIcon = ({ size = 20, ...props }: IconProps) => (
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
    <path d="M7 8V7a5 5 0 0 1 10 0v1" />
    <path d="M5 9h14l-1 11a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2Z" />
  </svg>
);

const navLinks = ["Popular", "Shop", "Contact", "Pages", "Blogs"];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 px-4 py-6 lg:gap-5 lg:px-2">
        <div className="flex flex-wrap items-center gap-3 lg:gap-6">
          <button
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 text-slate-700 transition hover:border-transparent hover:bg-slate-100 lg:hidden"
            aria-label="Toggle menu"
            onClick={() => setMobileOpen((prev) => !prev)}
          >
            <MenuIcon />
          </button>

          <div className="flex flex-1 flex-wrap items-center gap-3 lg:gap-5">
            <div className="flex items-center gap-3 lg:min-w-[210px]">
              <Image
                src="/logo.png"
                alt="Corn Electronics"
                width={48}
                height={48}
                className="h-12 w-auto"
                priority
              />
              <div>
  
              </div>
            </div>

            <div className="hidden flex-1 items-center gap-3 lg:flex">
              <button className="group inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-transparent hover:bg-slate-100">
                <MenuIcon className="text-primary" size={18} />
                All Categories
                <ChevronDownIcon className="text-slate-400 transition group-hover:text-slate-600" />
              </button>

              <div className="relative flex flex-1 items-center max-w-[300px]">
                <input
                  type="text"
                  placeholder="I am shopping for..."
                  className="w-full rounded-full border border-slate-200 px-5 py-2 pr-14 text-[15px] text-slate-700 outline-none placeholder:text-slate-400"
                />
                <button
                  aria-label="Search"
                  className="absolute right-2 flex h-9 w-9 items-center justify-center rounded-full bg-transparent text-slate-600 transition"
                >
                  <SearchIcon className="text-slate-600" size={16} />
                </button>
              </div>
            </div>
          </div>

          <div className="ml-auto flex items-center gap-2 lg:gap-5">
            <div className="hidden items-center gap-3 rounded-full border border-slate-200 px-4 py-2 text-left text-sm font-medium text-slate-700 lg:flex">
              <UserIcon className="text-primary" />
              <div>
                <p className="leading-none text-xs uppercase text-slate-400">
                  Account
                </p>
                <p>Sign In / Register</p>
              </div>
            </div>
            <button className="relative flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 text-slate-600 transition hover:border-transparent hover:bg-slate-100">
              <HeartIcon />
              <span className="absolute -top-1 -right-1 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-primary px-1 text-xs font-semibold text-white">
                0
              </span>
            </button>
            <button className="relative flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 text-slate-600 transition hover:border-transparent hover:bg-slate-100">
              <BagIcon />
              <span className="absolute -top-1 -right-1 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-primary px-1 text-xs font-semibold text-white">
                0
              </span>
            </button>
          </div>
        </div>

        <div className="hidden items-center justify-between border-t border-slate-100 pt-4 lg:flex">
          <nav className="flex items-center gap-6 text-sm font-semibold text-slate-600">
            {navLinks.map((link) => (
              <a
                key={link}
                href="#"
                className="transition hover:text-slate-900"
              >
                {link}
              </a>
            ))}
          </nav>
          <a
            href="#"
            className="inline-flex items-center gap-2 rounded-full  px-4 py-2 text-sm font-semibold text-slate-800 transition hover:border-transparent hover:bg-slate-100"
          >
            <span>Best Selling</span>
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-primary">
              Sale
            </span>
          </a>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-slate-200 bg-white px-3 py-4 lg:hidden">
          <div className="mb-4 flex flex-col gap-3">
            <button className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm">
              <MenuIcon className="text-primary" size={18} />
              All Categories
              <ChevronDownIcon className="text-slate-400" />
            </button>
            <div className="relative">
              <input
                type="text"
                placeholder="I am shopping for..."
                className="w-full rounded-full border border-slate-200 px-4 py-2 pr-14 text-sm text-slate-700 outline-none placeholder:text-slate-400"
              />
              <button
                aria-label="Search"
                className="absolute right-2 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-transparent text-slate-600"
              >
                <SearchIcon className="text-slate-600" size={16} />
              </button>
            </div>
          </div>
          <nav className="flex flex-col gap-3 text-sm font-semibold text-slate-700">
            {navLinks.map((link) => (
              <a
                key={link}
                href="#"
                className="rounded-2xl border border-slate-100 px-4 py-3"
              >
                {link}
              </a>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
