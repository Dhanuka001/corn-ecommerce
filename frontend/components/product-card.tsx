"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { MouseEvent } from "react";

import type { Product } from "@/data/products";

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
    <path d="M1 1h4l2.68 13.39A2 2 0 0 0 9.34 16H19a2 2 0 0 0 2-1.61L23 6H6" />
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

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency: "LKR",
    maximumFractionDigits: 0,
  }).format(value);

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  const router = useRouter();

  const goToCart = (event: MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    router.push("/cart");
  };

  const goToFavorites = (event: MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    router.push("/favorites");
  };

  return (
    <article className="group relative flex flex-col rounded-3xl border border-slate-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-slate-200 hover:shadow-xl">
      <Link
        href={`/product/${product.slug}`}
        className="absolute inset-0 z-0 rounded-3xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      >
        <span className="sr-only">View {product.name}</span>
      </Link>

      <div className="relative z-0 flex h-56 items-center justify-center rounded-2xl bg-slate-50">
        <div className="text-sm font-semibold uppercase tracking-wide text-slate-400">
          Product preview
        </div>
        <div className="absolute inset-x-6 bottom-4 z-20 flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white/90 px-4 py-2 text-slate-700 shadow-[0_10px_28px_rgba(15,23,42,0.12)] transition duration-300 opacity-100 translate-y-0 lg:border-0 lg:bg-primary/95 lg:text-white lg:shadow-[0_18px_38px_-18px_rgba(79,70,229,0.55)] lg:opacity-0 lg:translate-y-3 lg:group-hover:translate-y-0 lg:group-hover:opacity-100">
          <Link
            href={`/product/${product.slug}`}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/25 bg-white/10 transition hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white lg:border-white/25 lg:bg-white/10 lg:hover:bg-white/20"
            aria-label={`View ${product.name}`}
          >
            <EyeIcon size={16} />
          </Link>
          <button
            type="button"
            onClick={goToCart}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary lg:border-white/25 lg:bg-white/10 lg:text-white lg:hover:bg-white/20"
            aria-label={`Go to cart from ${product.name}`}
          >
            <CartIcon size={16} />
          </button>
          <button
            type="button"
            onClick={goToFavorites}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary lg:border-white/25 lg:bg-white/10 lg:text-white lg:hover:bg-white/20"
            aria-label={`Go to favorites from ${product.name}`}
          >
            <HeartIcon size={16} />
          </button>
        </div>
      </div>

      <div className="mt-4 space-y-2">
        <p className="text-base font-semibold text-slate-900 line-clamp-2">
          {product.name}
        </p>

        <div className="flex flex-wrap items-center gap-2 border-t border-slate-100 pt-3 text-sm">
          {product.oldPrice ? (
            <span className="text-slate-400 line-through">
              {formatCurrency(product.oldPrice)}
            </span>
          ) : null}
          <span className="font-semibold text-slate-900 transition group-hover:text-primary">
            {formatCurrency(product.price)}
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-amber-500">
            ★ <span className="text-slate-500">{product.rating.toFixed(1)}</span>
          </span>
          <span className="text-slate-400">
            ({product.reviews.toLocaleString()} reviews)
          </span>
        </div>
      </div>
    </article>
  );
}
