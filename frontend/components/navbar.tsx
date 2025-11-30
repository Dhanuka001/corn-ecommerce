"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, type SVGAttributes } from "react";

import { useAuth } from "@/context/auth-context";
import { useCart } from "@/context/cart-context";
import { useFavorites } from "@/context/favorites-context";

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

const baseNavLinks = [
  { label: "Popular", href: "/#best-selling" },
  { label: "Shop All", href: "/shop" },
  { label: "Contact", href: "/#contact" },
  { label: "Blogs", href: "/#blog" },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, loading: authLoading, openAuth } = useAuth();
  const { cart } = useCart();
  const { items: favoriteItems } = useFavorites();
  const isAdmin = user?.role === "ADMIN" || user?.role === "STAFF";
  const navLinks = isAdmin
    ? [...baseNavLinks, { label: "Admin", href: "/admin" }]
    : baseNavLinks;

  const displayName = user
    ? user.firstName
      ? `${user.firstName} ${user.lastName ?? ""}`.trim()
      : user.email
    : "";

  const favoriteCount = favoriteItems.length;
  const cartCount = cart?.summary?.totalQuantity ?? 0;

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
              <Link
                href="/"
                className="flex items-center"
                aria-label="PhoneBazzar.lk home"
              >
                <Image
                  src="/pb.png"
                  alt="PhoneBazzar.lk"
                  width={48}
                  height={48}
                  className="h-12 w-auto"
                  priority
                />
              </Link>
            </div>

            <div className="hidden flex-1 justify-center lg:flex">
              <form
                action="/shop"
                method="get"
                className="relative flex w-full max-w-[420px] items-center"
              >
                <input
                  type="text"
                  name="q"
                  placeholder="I am shopping for..."
                  className="w-full rounded-full border border-slate-200 px-5 py-2 pr-14 text-[15px] text-slate-700 outline-none placeholder:text-slate-400"
                />
                <button
                  type="submit"
                  aria-label="Search"
                  className="absolute right-2 flex h-9 w-9 items-center justify-center rounded-full bg-transparent text-slate-600 transition"
                >
                  <SearchIcon className="text-slate-600" size={16} />
                </button>
              </form>
            </div>
          </div>

          <div className="ml-auto flex items-center gap-2 lg:gap-5">
            <div className="hidden lg:block">
              {user ? (
                <Link
                  href="/account"
                  className="flex items-center gap-3 rounded-full border border-slate-200 px-4 py-2 text-left text-sm font-medium text-slate-700 transition hover:border-primary/20 hover:bg-primary/5"
                >
                  <span className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-primary/10">
                    {user.avatarUrl ? (
                      <img
                        src={user.avatarUrl}
                        alt="Profile"
                        className="h-full w-full object-cover"
                        loading="lazy"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <UserIcon className="text-primary" />
                    )}
                  </span>
                  <div>
                    <p className="leading-none text-xs uppercase text-slate-400">
                      Account
                    </p>
                    <p>{displayName}</p>
                  </div>
                </Link>
              ) : (
                <button
                  className="flex items-center gap-3 rounded-full border border-slate-200 px-4 py-2 text-left text-sm font-medium text-slate-700 transition hover:border-primary/20 hover:bg-primary/5"
                  onClick={() => openAuth("login")}
                  disabled={authLoading}
                >
                  <UserIcon className="text-primary" />
                  <div>
                    <p className="leading-none text-xs uppercase text-slate-400">
                      Sign in
                    </p>
                    <p>Sign In / Register</p>
                  </div>
                </button>
              )}
            </div>
            <Link
              href="/favorites"
              className="relative flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 text-slate-600 transition hover:border-transparent hover:bg-slate-100"
              aria-label="View favorites"
            >
              <HeartIcon />
              <span className="absolute -top-1 -right-1 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-primary px-1 text-xs font-semibold text-white">
                {favoriteCount}
              </span>
            </Link>
            <Link
              href="/cart"
              className="relative flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 text-slate-600 transition hover:border-transparent hover:bg-slate-100"
              aria-label="View cart"
            >
              <BagIcon />
              <span className="absolute -top-1 -right-1 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-primary px-1 text-xs font-semibold text-white">
                {cartCount}
              </span>
            </Link>
          </div>
        </div>

        <div className="hidden items-center justify-between border-t border-slate-100 pt-4 lg:flex">
          <nav className="flex items-center gap-6 text-sm font-semibold text-slate-600">
            {navLinks.map((link) => {
              const label = link.label;
              return (
                <Link
                  key={label}
                  href={link.href}
                  className="transition hover:text-slate-900"
                >
                  {label}
                </Link>
              );
            })}
          </nav>
          <Link
            href="/#best-selling"
            className="inline-flex items-center gap-2 rounded-full  px-4 py-2 text-sm font-semibold text-slate-800 transition hover:border-transparent hover:bg-slate-100"
          >
            <span>Best Selling</span>
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-primary">
              Sale
            </span>
          </Link>
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
              <Link
                key={link.label}
                href={link.href}
                className="rounded-2xl border border-slate-100 px-4 py-3"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
