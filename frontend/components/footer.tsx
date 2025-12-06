"use client";

import Link from "next/link";
import { useState, FormEvent } from "react";

const linkSections = [
  {
    title: "Company",
    links: [
      { label: "About PhoneBazzar", href: "/about" },
      { label: "Careers", href: "/careers" },
      { label: "Contact", href: "/contact" },
      { label: "Shop All", href: "/shop" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Support Center", href: "/support" },
      { label: "Returns & Warranty", href: "/returns" },
    ],
  },
  {
    title: "Legal & Policies",
    links: [
      { label: "Warranty Policy", href: "/warranty" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms & Conditions", href: "/terms" },
    ],
  },
];

export function Footer() {
  const [email, setEmail] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setEmail("");
  };

  return (
    <footer className="mt-16 bg-slate-950 text-white">
      <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:py-14">
        <div className="grid gap-10 md:grid-cols-5">
          <div className="space-y-3 text-sm text-white/80">
            <p className="text-base font-semibold text-white/80">PhoneBazzar.lk</p>
            <p className="text-xs text-white/60">
              Curated devices, transparent service, and friendly Sri Lankan support across every order.
            </p>
            <div className="space-y-1 text-xs text-white/70">
              <p>hello@phonebazzar.lk</p>
              <p>+94 77 660 1146</p>
            </div>
          </div>

          {linkSections.map((section) => (
            <div key={section.title} className="space-y-2 text-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/70">
                {section.title}
              </p>
              <div className="space-y-1">
                {section.links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="block text-white/70 transition hover:text-white"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}

          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/70">
              Join the list
            </p>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="email"
                required
                placeholder="Email address"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full rounded-full border border-white/15 bg-transparent px-3 py-2 text-xs text-white placeholder:text-white/60 focus:border-primary focus:outline-none focus:ring-2 focus:ring-white/30"
              />
              <button
                type="submit"
                className="w-full rounded-full bg-[#ED1C24] px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-[#db1a1d]"
              >
                Join
              </button>
            </form>
            <p className="text-xs text-white/50">
              Get updates on new releases and service offers.
            </p>
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-6 text-center text-xs text-white/60">
          <p>© {new Date().getFullYear()} PhoneBazzar.lk. All rights reserved.</p>
          <p className="mt-1">PhoneBazzar HQ · Kasbawa, Sri Lanka</p>
        </div>
      </div>
    </footer>
  );
}
