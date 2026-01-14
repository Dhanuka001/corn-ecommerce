"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { KeyboardEvent, MouseEvent } from "react";

import { useCart } from "@/context/cart-context";
import { useFavorites } from "@/context/favorites-context";
import type { ProductSummary } from "@/types/catalog";

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

type CatalogProductCardProps = {
  product: ProductSummary;
};

export function CatalogProductCard({ product }: CatalogProductCardProps) {
  const router = useRouter();
  const { addItem, pending: cartPending } = useCart();
  const { isFavorite, toggleFavorite, pending: favPending } = useFavorites();

  const saved = isFavorite(product.id);
  const thumbnail = product.images?.[0];

  const navigateToProduct = () => {
    router.push(`/product/${product.slug}`);
  };

  const handleCardKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      navigateToProduct();
    }
  };

  const handleAddToCart = async (event: MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    await addItem({ productId: product.id, qty: 1 });
  };

  const handleToggleFavorite = async (event: MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    await toggleFavorite(product.id);
  };

  return (
    <article
      className="group relative flex flex-col rounded-3xl border border-slate-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-slate-200 hover:shadow-xl"
      role="button"
      tabIndex={0}
      onClick={navigateToProduct}
      onKeyDown={handleCardKeyDown}
    >
      <div className="relative z-0 flex h-56 items-center justify-center overflow-hidden rounded-2xl bg-slate-50">
        {thumbnail?.url ? (
          <Image
            src={thumbnail.url}
            alt={thumbnail.alt || product.name}
            fill
            className="object-cover"
            sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          />
        ) : (
          <div className="text-sm font-semibold uppercase tracking-wide text-slate-400">
            Product preview
          </div>
        )}
        <div className="absolute inset-x-6 bottom-4 z-20 flex translate-y-3 items-center justify-center gap-2 rounded-full bg-primary/95 px-4 py-2 text-white opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <Link
            href={`/product/${product.slug}`}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/25 bg-white/10"
            aria-label={`View ${product.name}`}
            onClick={(event) => event.stopPropagation()}
          >
            <EyeIcon size={16} />
          </Link>
          <button
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white disabled:opacity-60"
            onClick={handleAddToCart}
            disabled={cartPending}
            aria-label="Add to cart"
            data-action-stop
          >
            <CartIcon size={16} />
          </button>
          <button
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white disabled:opacity-60"
            onClick={handleToggleFavorite}
            disabled={favPending}
            aria-pressed={saved}
            aria-label={saved ? "Remove from favorites" : "Save to favorites"}
            data-action-stop
          >
            <HeartIcon size={16} />
          </button>
        </div>
      </div>

      <div className="mt-4 space-y-2">
        <p className="text-base font-semibold text-slate-900 line-clamp-2">
          {product.name}
        </p>

        <div className="flex items-center gap-2 border-t border-slate-100 pt-3 text-sm">
          {product.compareAtLKR ? (
            <span className="text-slate-400 line-through">
              {formatCurrency(product.compareAtLKR)}
            </span>
          ) : null}
          <span className="font-semibold text-slate-900 transition group-hover:text-primary">
            {formatCurrency(product.priceLKR)}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-amber-500 text-xs">
            ★ 4.8
          </span>
          <div className="flex items-center gap-2 sm:hidden">
            <Link
              href={`/product/${product.slug}`}
              aria-label={`View ${product.name}`}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition hover:border-primary hover:text-primary"
              onClick={(event) => event.stopPropagation()}
            >
              <EyeIcon size={16} />
            </Link>
            <button
              aria-label="Add to cart"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition hover:border-primary hover:text-primary disabled:opacity-60"
              onClick={handleAddToCart}
              disabled={cartPending}
              data-action-stop
            >
              <CartIcon size={16} />
            </button>
            <button
              aria-label={saved ? "Remove from favorites" : "Save to favorites"}
              className={`inline-flex h-9 w-9 items-center justify-center rounded-full border bg-white text-slate-500 transition hover:border-primary hover:text-primary disabled:opacity-60 ${
                saved ? "border-primary/50 text-primary" : "border-slate-200"
              }`}
              onClick={handleToggleFavorite}
              disabled={favPending}
              data-action-stop
            >
              <HeartIcon size={16} />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
