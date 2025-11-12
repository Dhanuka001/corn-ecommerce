"use client";

import Image from "next/image";

type Product = {
  id: string;
  name: string;
  price: number;
  oldPrice: number;
};

type IconProps = {
  size?: number;
};

const CartIcon = ({ size = 18 }: IconProps) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    width={size}
    height={size}
    aria-hidden
  >
    <circle cx="9" cy="21" r="1" />
    <circle cx="20" cy="21" r="1" />
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61H19a2 2 0 0 0 2-1.61L23 6H6" />
  </svg>
);

const HeartIcon = ({ size = 18 }: IconProps) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    width={size}
    height={size}
    aria-hidden
  >
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78Z" />
  </svg>
);

const EyeIcon = ({ size = 18 }: IconProps) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    width={size}
    height={size}
    aria-hidden
  >
    <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const products: Product[] = Array.from({ length: 8 }).map((_, index) => ({
  id: `placeholder-${index + 1}`,
  name: `Product ${index + 1}`,
  price: 49000 + index * 8000,
  oldPrice: 56000 + index * 9000,
}));

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency: "LKR",
    maximumFractionDigits: 0,
  }).format(value);

const actions = [
  { label: "Add to cart", icon: CartIcon },
  { label: "Add to wishlist", icon: HeartIcon },
  { label: "Quick view", icon: EyeIcon },
];

export function NewArrivals() {
  return (
    <section
      className="mt-10 space-y-6 px-4 sm:mt-12 lg:mt-16 lg:px-0"
      aria-label="New arrivals"
    >
      <header className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-slate-900 sm:text-2xl">
          New Arrivals
        </h2>
        <button className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-100 px-4 py-2 text-sm font-normal text-slate-600 transition hover:border-slate-300 hover:bg-slate-200">
          View All
        </button>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {products.map((product) => (
          <article
            key={product.id}
            className="group overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="relative flex h-56 items-center justify-center bg-zinc-50">
              <Image
                src="/logo.png"
                alt={product.name}
                width={120}
                height={120}
                className="h-28 w-28 object-contain opacity-70"
              />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 flex translate-y-full items-center justify-center gap-2 bg-primary/95 py-2 px-3 text-white transition duration-300 group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100 opacity-0">
                {actions.map(({ label, icon: Icon }) => (
                  <button
                    key={label}
                    className="inline-flex h-9 w-9 items-center justify-center bg-white/10 text-white transition hover:bg-white hover:text-primary"
                    aria-label={label}
                  >
                    <Icon size={16} />
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1 px-5 pb-5 pt-4">
              <p className="text-sm font-semibold text-slate-900">
                {product.name}
              </p>
              <div className="flex items-center gap-2 text-sm">
                <span className="font-semibold text-primary">
                  {formatCurrency(product.price)}
                </span>
                <span className="text-slate-400 line-through">
                  {formatCurrency(product.oldPrice)}
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
