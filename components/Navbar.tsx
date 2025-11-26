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

        <div className="flex items-center gap-4 text-sm font-medium">
          <Link
            href="/#journal"
            className="hidden border border-white/60 px-4 py-2 text-white transition sm:inline-flex hover:border-white hover:text-white group-hover:border-text/50 group-hover:text-text"
          >
            Journal
          </Link>
          <div className="flex items-center gap-3 text-white group-hover:text-text">
            <Link href="/#search" aria-label="Search" className="transition hover:opacity-80">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.8"
                stroke="currentColor"
                className="h-5 w-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m21 21-4.35-4.35M11 19a8 8 0 1 1 0-16 8 8 0 0 1 0 16Z"
                />
              </svg>
            </Link>
            <Link href="/#account" aria-label="Profile" className="transition hover:opacity-80">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.8"
                stroke="currentColor"
                className="h-5 w-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0Zm-4 7c-3.866 0-7 2.239-7 5v.5a.5.5 0 0 0 .5.5h13a.5.5 0 0 0 .5-.5V19c0-2.761-3.134-5-7-5Z"
                />
              </svg>
            </Link>
            <Link href="/#cart" aria-label="Cart" className="transition hover:opacity-80">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.8"
                stroke="currentColor"
                className="h-5 w-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 4h1.17a1 1 0 0 1 .98.804L6.7 12.2a1 1 0 0 0 .98.8h8.64a1 1 0 0 0 .98-.8l.64-3.2H7.4m12.6-3H6.6m10.4 13a1 1 0 1 1-2 0 1 1 0 0 1 2 0Zm-8 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z"
                />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
