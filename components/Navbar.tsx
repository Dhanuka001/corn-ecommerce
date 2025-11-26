import Link from "next/link";

const navLinks = [
  { label: "New Arrivals", href: "/new-arrivals" },
  { label: "Women", href: "/#women" },
  { label: "Men", href: "/#men" },
  { label: "Home", href: "/#home" },
];

export function Navbar() {
  return (
    <header className="fixed inset-x-0 top-0 z-30 border-b border-transparent bg-transparent text-white transition-colors duration-300 hover:border-beige-dark/40 hover:bg-white hover:text-text hover:backdrop-blur group">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link
          href="/"
          className="text-lg font-semibold tracking-tight transition-colors group-hover:text-text"
        >
          BeigeAura
        </Link>

        <nav className="hidden gap-6 text-sm font-medium transition-colors md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="transition-colors text-white/90 group-hover:text-text"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3 text-sm font-medium">
          <Link
            href="/#journal"
            className="hidden border border-white/60 px-4 py-2 text-white transition sm:inline-flex hover:border-white hover:text-white group-hover:border-text/50 group-hover:text-text"
          >
            Journal
          </Link>
          <Link
            href="/#cart"
            className="rounded-full bg-text px-4 py-2 text-beige-light transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-text/10"
          >
            Bag
          </Link>
        </div>
      </div>
    </header>
  );
}
