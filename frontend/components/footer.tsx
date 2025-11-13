"use client";

export function Footer() {
  const linkLists = [
    {
      title: "Become Partner",
      items: ["Corporate Gifting", "Become a Partner"],
    },
    {
      title: "About Us",
      items: [
        "About",
        "Careers",
        "Blog",
        "Warranty Policy",
        "CSR Policy",
        "Privacy Policy",
        "Terms & Conditions",
        "E-Waste Program",
      ],
    },
    {
      title: "Help Desk",
      items: ["Support", "Track Your Order", "Warranty Registration"],
    },
  ];

  const social = ["facebook", "x", "linkedin", "youtube", "instagram"];

  return (
    <footer className="mt-16 bg-[#0f0f0f] text-white">
      <div className="mx-auto w-full max-w-7xl px-4 py-12 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,2fr)_repeat(3,minmax(0,1fr))_minmax(0,1.25fr)]">
          <div className="space-y-6">
            <div>
              <div className="text-sm uppercase tracking-[0.3em] text-primary">
                Corn Electronics
              </div>
              <p className="mt-2 text-3xl font-semibold">Join the club</p>
            </div>
            <p className="text-sm text-white/60">
              Subscribe to hear about new drops, limited collaborations, and
              Corn-only experiences directly in your inbox.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <input
                type="email"
                placeholder="Your email"
                className="h-12 flex-1 rounded-full border border-white/20 bg-transparent px-4 text-sm text-white placeholder:text-white/50 focus:border-primary focus:outline-none"
              />
              <button
                type="button"
                className="inline-flex h-12 items-center rounded-full bg-primary px-6 text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-red-500"
              >
                Join
              </button>
            </div>
          </div>

          {linkLists.map((section) => (
            <div key={section.title}>
              <p className="text-base font-semibold">{section.title}</p>
              <ul className="mt-4 space-y-2 text-sm text-white/70">
                {section.items.map((item) => (
                  <li key={item} className="transition hover:text-white">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="space-y-6">
            <div>
              <p className="text-base font-semibold text-primary">Follow Us</p>
              <div className="mt-3 flex gap-3">
                {social.map((label) => (
                  <span
                    key={label}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 text-sm uppercase tracking-wide text-white"
                  >
                    {label.slice(0, 1)}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <p className="text-base font-semibold text-primary">Contact Us</p>
              <p className="mt-3 text-sm text-white/70">hello@corn.lk</p>
              <p className="text-sm text-white/70">+94 77 660 1146</p>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-6 text-center text-xs text-white/60">
          <p>© {new Date().getFullYear()} Corn Electronics. All rights reserved.</p>
          <p className="mt-1">
            Corn HQ · Kasbawa, Sri Lanka
          </p>
        </div>
      </div>
    </footer>
  );
}
