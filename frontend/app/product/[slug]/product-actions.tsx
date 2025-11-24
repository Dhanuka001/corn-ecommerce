"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { useCart } from "@/context/cart-context";
import { useFavorites } from "@/context/favorites-context";
import type { Variant } from "@/types/catalog";

type ProductActionsProps = {
  productId: string;
  variants: Variant[];
  priceLKR: number;
  slug: string;
};

const currencyFormatter = new Intl.NumberFormat("en-LK", {
  style: "currency",
  currency: "LKR",
  maximumFractionDigits: 0,
});

export function ProductActions({
  productId,
  variants,
  priceLKR,
  slug,
}: ProductActionsProps) {
  const { addItem, pending: cartPending } = useCart();
  const { isFavorite, toggleFavorite, pending: favPending } = useFavorites();
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(
    variants[0]?.id ?? null,
  );

  const currentPrice = useMemo(() => {
    if (!selectedVariantId) {
      return priceLKR;
    }
    const match = variants.find((variant) => variant.id === selectedVariantId);
    return match?.priceLKR ?? priceLKR;
  }, [priceLKR, selectedVariantId, variants]);

  const handleAddToCart = async () => {
    await addItem({
      productId,
      variantId: selectedVariantId ?? undefined,
      qty: 1,
    });
  };

  const saved = isFavorite(productId);

  return (
    <div className="space-y-4 rounded-3xl bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Selected price
          </p>
          <p className="text-2xl font-semibold text-slate-900">
            {currencyFormatter.format(currentPrice)}
          </p>
        </div>
        <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-700">
          Ready to ship
        </span>
      </div>

      {variants.length > 0 ? (
        <div className="space-y-2">
          <p className="text-sm font-semibold text-slate-800">
            Choose a variant
          </p>
          <div className="flex flex-wrap gap-2">
            {variants.map((variant) => (
              <button
                key={variant.id}
                className={`rounded-full border px-3 py-2 text-sm font-semibold transition ${
                  selectedVariantId === variant.id
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                }`}
                onClick={() => setSelectedVariantId(variant.id)}
              >
                {variant.name}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <button
          className="flex-1 rounded-full border border-primary bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-60"
          onClick={handleAddToCart}
          disabled={cartPending}
        >
          Add to cart
        </button>
        <button
          className={`rounded-full border px-5 py-3 text-sm font-semibold transition ${
            saved
              ? "border-primary bg-primary/10 text-primary"
              : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
          }`}
          disabled={favPending}
          onClick={() => toggleFavorite(productId)}
        >
          {saved ? "Saved" : "Save"}
        </button>
        <Link
          href="/shop"
          className="rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-800 transition hover:border-slate-300"
        >
          Back to shop
        </Link>
      </div>
      <p className="text-xs text-slate-500">
        SKU reference: <span className="font-semibold">{slug}</span>
      </p>
    </div>
  );
}
