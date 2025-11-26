import Link from "next/link";

const aboutLinks = [
  { label: "About Us", href: "/#about" },
  { label: "Careers", href: "/#careers" },
  { label: "Impact", href: "/#impact" },
  { label: "Investor Relations", href: "/#investors" },
  { label: "Store Locator", href: "/#stores" },
  { label: "Fabric Care", href: "/#fabric-care" },
  { label: "Accessibility", href: "/#accessibility" },
  { label: "Find a List", href: "/#list" },
  { label: "Our Services", href: "/#services" },
];

const helpLinks = [
  { label: "Contact Us", href: "/#contact" },
  { label: "Size Guide", href: "/#size-guide" },
  { label: "Shipping", href: "/#shipping" },
  { label: "Returns & Exchanges", href: "/#returns" },
  { label: "Payment & Security", href: "/#payment" },
  { label: "Order Tracking", href: "/#tracking" },
  { label: "Promotion Details", href: "/#promotions" },
  { label: "Feedback", href: "/#feedback" },
];

const socials = [
  {
    label: "TikTok",
    href: "#tiktok",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
        <path d="M16.5 6.5c1 .9 2.2 1.5 3.5 1.6v2.3c-1.3 0-2.5-.4-3.5-1v5.3a5.9 5.9 0 0 1-6.4 5.9A5.6 5.6 0 0 1 5 15.9c0-3 2.5-5.5 5.6-5.5.3 0 .6 0 .9.1v2.4a3.3 3.3 0 0 0-.9-.1c-1.7 0-3.1 1.3-3.1 3 0 1.7 1.4 3.1 3.1 3.1 1.6 0 3-.9 3.1-2.7V4h2.8v2.5Z" />
      </svg>
    ),
  },
  {
    label: "Instagram",
    href: "#instagram",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6">
        <rect x="4" y="4" width="16" height="16" rx="4" />
        <circle cx="12" cy="12" r="3.5" />
        <circle cx="17" cy="7" r="1" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    label: "Pinterest",
    href: "#pinterest",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
        <path d="M12.1 4C8.5 4 6 6.5 6 9.8c0 2.3 1.2 4 3.1 4.7.3.1.5 0 .6-.3l.3-1c.1-.2 0-.3-.1-.5-.7-.8-.7-2.4-.1-3.3.6-1 1.7-1.6 2.8-1.6 1.8 0 3.2 1.3 3.2 3.4 0 2-1 3.4-2.3 3.4-.7 0-1.3-.6-1.1-1.4l.4-1.6c.1-.5.1-1.1-.1-1.4-.2-.5-.7-.4-1 0-.5.6-.8 1.4-.8 2.2 0 .8.3 1.3.3 1.3l-1.1 4.5c-.1.5-.2 1 0 1.6h.2c.3-.4.8-1.1 1-1.6l.8-2.7c.4.5 1 .8 1.8.8 2.4 0 4.2-2.1 4.2-5.1C17 6.7 14.9 4 12.1 4Z" />
      </svg>
    ),
  },
  {
    label: "YouTube",
    href: "#youtube",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
        <path d="M21.5 8s-.2-1.4-.8-2c-.8-.8-1.7-.8-2.1-.9C15.4 5 12 5 12 5h-.1s-3.4 0-6.6.2c-.4 0-1.3.1-2.1.9-.6.6-.8 2-.8 2S2 9.6 2 11.3v1.3C2 14.4 2.2 16 2.2 16s.2 1.4.8 2c.8.8 1.8.8 2.3.9 1.7.2 6.7.2 6.7.2s3.4 0 6.6-.2c.4 0 1.3-.1 2.1-.9.6-.6.8-2 .8-2s.2-1.6.2-3.3v-1.3c0-1.7-.2-3.3-.2-3.3ZM10 14.5v-5l4.7 2.5L10 14.5Z" />
      </svg>
    ),
  },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-16 bg-black text-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-12 px-6 py-12">
        <div className="grid gap-12 md:grid-cols-3">
          <div className="space-y-4">
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70">
              Join BeigeAura&apos;s mailing list
            </div>
            <p className="text-sm text-white/70">
              Insider info on sales, new arrivals, and more good stuff.
            </p>
            <div className="flex overflow-hidden rounded border border-white/20 bg-white/5">
              <input
                type="email"
                placeholder="Email address"
                className="w-full bg-transparent px-3 py-3 text-sm text-white placeholder:text-white/50 focus:outline-none"
              />
              <button
                type="button"
                className="flex items-center justify-center bg-white/10 px-4 text-white transition hover:bg-white/20"
                aria-label="Submit email"
              >
                →
              </button>
            </div>
            <p className="text-xs leading-6 text-white/60">
              Don&apos;t worry, you can unsubscribe at any time.
            </p>

            <div className="space-y-2">
              <div className="text-sm font-medium text-white">BeigeAura Community</div>
              <p className="text-sm text-white/70">
                Join to provide feedback and receive early access to new drops.
              </p>
              <Link
                href="/#community"
                className="text-sm font-medium underline decoration-white/50 underline-offset-4 transition hover:text-white"
              >
                Participate in research
              </Link>
            </div>

            <div className="flex items-center gap-4 pt-2 text-white/80">
              {socials.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  aria-label={item.label}
                  className="transition hover:text-white"
                >
                  {item.icon}
                </Link>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70">
              BeigeAura
            </div>
            <div className="flex flex-col gap-2 text-sm text-white/85">
              {aboutLinks.map((link) => (
                <Link key={link.label} href={link.href} className="transition hover:text-white">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70">
              Get help
            </div>
            <div className="flex flex-col gap-2 text-sm text-white/85">
              {helpLinks.map((link) => (
                <Link key={link.label} href={link.href} className="transition hover:text-white">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-white/60 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded border border-white/30 px-3 py-1 text-white/80">
              Sri Lanka (LKR)
            </span>
            <span>© {year} BeigeAura</span>
            <Link href="/#privacy" className="hover:text-white">
              Privacy Policy
            </Link>
            <Link href="/#cookies" className="hover:text-white">
              Cookies
            </Link>
            <Link href="/#terms" className="hover:text-white">
              Terms of Use
            </Link>
            <Link href="/#sitemap" className="hover:text-white">
              Site Map
            </Link>
          </div>
          <div className="text-white/70">Crafted for calm, modern wardrobes.</div>
        </div>
      </div>
    </footer>
  );
}
