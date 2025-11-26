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
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold tracking-tight text-text">{title}</h2>
        <Link
          href="/#all"
          className="text-sm font-medium text-text/70 underline decoration-text/30 underline-offset-4 transition hover:text-text hover:decoration-text/60"
        >
          Explore all
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {categories.map((category) => (
          <Link
            key={category.name}
            href={category.href}
            className="group relative flex h-full flex-col justify-between rounded-2xl border border-beige-dark/40 bg-beige-light px-6 py-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg hover:shadow-text/5"
          >
            <div className="flex flex-col gap-2">
              <span className="text-sm font-semibold tracking-tight text-text">
                {category.name}
              </span>
              <p className="text-sm leading-relaxed text-text/75">{category.copy}</p>
            </div>
            <span className="mt-4 inline-flex items-center text-sm font-medium text-text/80 transition group-hover:text-text">
              Browse
              <span className="ml-2 transition-transform duration-150 group-hover:translate-x-1">
                →
              </span>
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
