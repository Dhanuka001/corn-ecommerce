import Link from "next/link";

const primaryTabs = [
  { label: "Women", href: "/#women", active: true },
  { label: "Men", href: "/#men", active: false },
];

const categoryTabs = [
  { label: "Black Friday", href: "#sale", accent: true },
  { label: "New in", href: "#new-in" },
  { label: "Clothing", href: "#clothing" },
  { label: "Trending", href: "#new-in" },
  { label: "Shoes", href: "#shoes" },
  { label: "Dresses", href: "#dresses" },
  { label: "Accessories", href: "#accessories" },
  { label: "Face + Body", href: "#beauty" },
  { label: "Gifting", href: "#featured" },
  { label: "Brands", href: "#featured" },
  { label: "Activewear", href: "#featured" },
  { label: "Topshop", href: "#featured" },
  { label: "Vintage", href: "#featured" },
  { label: "Credit Card", href: "#featured" },
];

export function Navbar() {
  return (
    <header className="sticky inset-x-0 top-0 z-50 text-white">
      {/* Primary bar */}
      <div className="bg-[#2e2e2e]">
        <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3 md:px-6 lg:px-8">
          <Link
            href="/"
            className="flex items-center text-2xl font-black uppercase tracking-[0.08em] text-white"
          >
            BeigeAura
          </Link>

          <div className="flex items-center overflow-hidden rounded-sm border border-[#3a3a3a] bg-[#3a3a3a]">
            {primaryTabs.map((tab) => (
              <Link
                key={tab.label}
                href={tab.href}
                className={`px-4 py-2 text-sm font-semibold uppercase tracking-[0.18em] ${
                  tab.active ? "bg-[#444444] text-white" : "text-white/80 hover:bg-[#444444]"
                }`}
              >
                {tab.label}
              </Link>
            ))}
          </div>

          <div className="hidden flex-1 items-center gap-3 md:flex">
            <div className="relative flex-1">
              <input
                type="search"
                placeholder="Search for items and brands"
                className="w-full rounded-full border border-transparent bg-white px-5 py-3 text-sm font-semibold text-text placeholder:text-text/60 shadow-inner focus:outline-none"
              />
              <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-text">
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
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Link href="/#account" aria-label="Account" className="transition hover:opacity-80">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.8"
                  stroke="currentColor"
                  className="h-6 w-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0Zm-4 7c-3.866 0-7 2.239-7 5v.5a.5.5 0 0 0 .5.5h13a.5.5 0 0 0 .5-.5V19c0-2.761-3.134-5-7-5Z"
                  />
                </svg>
              </Link>
              <Link href="/#favorites" aria-label="Favorites" className="transition hover:opacity-80">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.8"
                  stroke="currentColor"
                  className="h-6 w-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 21s-6.5-3.6-9-8.1C1 9 2.5 5.5 6 5.5c2 0 3.2 1.4 4 2.7.8-1.3 2-2.7 4-2.7 3.5 0 5 3.5 3 7.4C18.5 17.4 12 21 12 21Z"
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
                  className="h-6 w-6"
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
      </div>

      {/* Secondary bar */}
      <div className="bg-[#4b4a4a]">
        <div className="mx-auto flex max-w-6xl items-center gap-3 overflow-x-auto px-4 py-3 text-sm font-semibold tracking-tight text-white md:px-6 lg:px-8">
          {categoryTabs.map((tab) =>
            tab.accent ? (
              <Link
                key={tab.label}
                href={tab.href}
                className="flex items-center bg-[#e50046] px-4 py-2 text-white shadow-sm transition hover:translate-y-[-2px]"
              >
                {tab.label}
              </Link>
            ) : (
              <Link
                key={tab.label}
                href={tab.href}
                className="px-2 py-1 text-white/80 transition hover:text-white"
              >
                {tab.label}
              </Link>
            ),
          )}
        </div>
      </div>
    </header>
  );
}
