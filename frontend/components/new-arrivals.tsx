"use client";

import Image from "next/image";
import Link from "next/link";

import { products } from "@/data/products";

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

const hoverActions = [
  { label: "Add to bag", Icon: CartIcon },
  { label: "Save", Icon: HeartIcon },
  { label: "Quick view", Icon: EyeIcon },
];

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency: "LKR",
    maximumFractionDigits: 0,
  }).format(value);

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
        <Link
          href="/#shop"
          className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-100 px-4 py-2 text-sm font-normal text-slate-600 transition hover:border-slate-300 hover:bg-slate-200"
        >
          View All
        </Link>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {products.map((product) => (
          <article
            key={product.sku}
            className="group relative overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
          >
            <Link
              href={`/product/${product.slug}`}
              className="absolute inset-0 z-10 rounded-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              <span className="sr-only">View {product.name}</span>
            </Link>

            <div className="relative z-0 flex h-56 items-center justify-center bg-zinc-50">
              <Image
                src="/logo.png"
                alt={product.name}
                width={160}
                height={160}
                className="h-28 w-28 object-contain"
              />
              <div className="pointer-events-none absolute inset-x-4 bottom-4 flex translate-y-4 items-center justify-center gap-2 rounded-full bg-primary px-3 py-2 text-white opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                {hoverActions.map(({ label, Icon }) => (
                  <span
                    key={label}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/40 bg-white/10 text-white"
                    aria-hidden
                  >
                    <Icon size={16} />
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-2 px-5 pb-5 pt-4">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-primary">
                {product.badge ?? "Fresh Drop"}
                <span
                  className={`rounded-full px-2 py-0.5 text-[11px] ${
                    product.stockStatus === "in-stock"
                      ? "bg-emerald-50 text-emerald-600"
                      : product.stockStatus === "limited"
                        ? "bg-amber-50 text-amber-600"
                        : "bg-blue-50 text-blue-600"
                  }`}
                >
                  {product.stockStatus.replace("-", " ")}
                </span>
              </div>

              <p className="text-sm font-semibold text-slate-900">
                {product.name}
              </p>
              <div className="flex items-center gap-2 text-sm">
                <span className="font-semibold text-primary">
                  {formatCurrency(product.price)}
                </span>
                {product.oldPrice ? (
                  <span className="text-slate-400 line-through">
                    {formatCurrency(product.oldPrice)}
                  </span>
                ) : null}
              </div>
              <div className="flex items-center gap-1 text-xs text-amber-500">
                {"★★★★★".slice(0, Math.round(product.rating))}
                <span className="text-slate-400">
                  ({product.reviews.toLocaleString()} reviews)
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
