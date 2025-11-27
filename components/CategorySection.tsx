import Link from "next/link";

type Category = {
  name: string;
  copy: string;
  href: string;
};

type CategorySectionProps = {
  title?: string;
  categories?: Category[];
};

const defaultCategories: Category[] = [
  {
    name: "Women",
    copy: "Soft tailoring, airy knits, and draped layers designed to mix and move.",
    href: "/#women",
  },
  {
    name: "Men",
    copy: "Relaxed essentials with structured lines in warm, grounded tones.",
    href: "/#men",
  },
  {
    name: "Home",
    copy: "Textural throws, ceramics, and candles to set a gentle atmosphere.",
    href: "/#home",
  },
];

export function CategorySection({
  title = "Shop by mood",
  categories = defaultCategories,
}: CategorySectionProps) {
  return (
    <section className="space-y-6 rounded-3xl bg-beige-light/80 px-4 py-6 md:px-6">
      <div className="flex items-center justify-between px-2">
        <h2 className="text-xl font-semibold tracking-tight text-text">{title}</h2>
        <Link
          href="/#all"
          className="text-sm font-semibold uppercase tracking-[0.16em] text-text underline decoration-text/40 underline-offset-4 transition hover:text-text"
        >
          Explore all
        </Link>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3">
        {categories.map((category) => (
          <Link
            key={category.name}
            href={category.href}
            className="group flex h-full items-center justify-center border-2 border-text bg-white px-4 py-6 text-base font-semibold tracking-tight text-text transition hover:-translate-y-1 hover:bg-text hover:text-beige-light"
          >
            <span className="text-center text-lg font-semibold leading-tight">
              {category.name}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
