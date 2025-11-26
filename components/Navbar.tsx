import Link from "next/link";

const navLinks = [
  { label: "New Arrivals", href: "/#new" },
  { label: "Women", href: "/#women" },
  { label: "Men", href: "/#men" },
  { label: "Home", href: "/#home" },
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-30 border-b border-beige-dark/30 bg-beige/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-lg font-semibold tracking-tight text-text">
          BeigeAura
        </Link>

        <nav className="hidden gap-6 text-sm font-medium text-text/80 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="transition-colors hover:text-text"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3 text-sm font-medium">
          <Link
            href="/#journal"
            className="hidden rounded-full border border-beige-dark/40 px-4 py-2 text-text/80 transition hover:border-text/50 hover:text-text sm:inline-flex"
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
