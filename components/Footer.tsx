import Link from "next/link";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-beige-dark/30 bg-beige-light text-text">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-8 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-sm text-text/70">
          © {year} BeigeAura. Crafted for slow mornings and warm light.
        </div>
        <div className="flex gap-4 text-sm text-text/70">
          <Link href="/#shipping" className="transition-colors hover:text-text">
            Shipping
          </Link>
          <Link href="/#returns" className="transition-colors hover:text-text">
            Returns
          </Link>
          <Link href="/#contact" className="transition-colors hover:text-text">
            Contact
          </Link>
        </div>
      </div>
    </footer>
  );
}
