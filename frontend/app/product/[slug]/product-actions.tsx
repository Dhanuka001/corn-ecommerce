"use client";

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
  const [qty, setQty] = useState(1);

  const currentPrice = useMemo(() => {
    if (!selectedVariantId) return priceLKR;
    const match = variants.find((variant) => variant.id === selectedVariantId);
    return match?.priceLKR ?? priceLKR;
  }, [priceLKR, selectedVariantId, variants]);

  const addBusinessDays = (daysToAdd: number) => {
    const result = new Date();
    let added = 0;
    while (added < daysToAdd) {
      result.setDate(result.getDate() + 1);
      const day = result.getDay();
      if (day !== 0 && day !== 6) added += 1;
    }
    return result;
  };

  const deliveryWindow = useMemo(() => {
    const options: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" };
    const start = addBusinessDays(4);
    const end = addBusinessDays(7);
    const formatter = new Intl.DateTimeFormat("en", options);
    return `${formatter.format(start)} to ${formatter.format(end)}`;
  }, []);

  const handleAddToCart = async () => {
    await addItem({
      productId,
      variantId: selectedVariantId ?? undefined,
      qty,
    });
  };

  const saved = isFavorite(productId);

  return (
    <div className="space-y-4 rounded-3xl bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
       
        <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-700">
          In stock
        </span>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-semibold text-slate-800">Quantity</p>
        <div className="inline-flex items-center gap-3 rounded-full border border-slate-200 px-3 py-1.5">
          <button
            className="h-7 w-7 rounded-full border border-slate-200 text-base font-semibold text-slate-700 transition hover:border-primary/40 hover:text-primary disabled:opacity-60"
            onClick={() => setQty((prev) => Math.max(1, prev - 1))}
            disabled={qty <= 1}
            aria-label="Decrease quantity"
          >
            –
          </button>
          <span className="w-6 text-center text-sm font-semibold text-slate-900">
            {qty}
          </span>
          <button
            className="h-7 w-7 rounded-full border border-slate-200 text-base font-semibold text-slate-700 transition hover:border-primary/40 hover:text-primary"
            onClick={() => setQty((prev) => prev + 1)}
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>
      </div>

      {variants.length > 0 ? (
        <div className="space-y-2">
          <p className="text-sm font-semibold text-slate-800">Choose a variant</p>
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
      </div>

      <div className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-800">
        <span className="text-xl">🚚</span>
        <span>Estimated delivery {deliveryWindow}</span>
      </div>
      <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800">
        <p className="font-semibold text-slate-900">Payment methods</p>
        <p className="mt-1 text-xs text-slate-600">
          PayHere (Visa, Mastercard, Amex) · eZCash · Genie
        </p>
        <div className="mt-3 flex flex-wrap items-center justify-center gap-3">
          {[
            { label: "Visa", src: "/payments/visa.png" },
            { label: "Mastercard", src: "/payments/logo.png" },
            { label: "Amex", src: "/payments/amex.png" },
            { label: "PayHere", src: "/payments/payhere.png" },
            { label: "eZCash", src: "/payments/ezcash.png" },
            { label: "Genie", src: "/payments/genie.png" },
          ].map((method) => (
            <img
              key={method.label}
              src={method.src}
              alt={`${method.label} logo`}
              className="h-8 w-auto object-contain"
            />
          ))}
        </div>
      </div>

      <p className="text-xs text-slate-500">
        SKU reference: <span className="font-semibold">{slug}</span>
      </p>
    </div>
  );
}
