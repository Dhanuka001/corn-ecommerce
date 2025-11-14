"use client";

import { useEffect } from "react";
import type { CartPreviewItem } from "@/data/cart-preview";

type CartSliderProps = {
  open: boolean;
  onClose: () => void;
  items: CartPreviewItem[];
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency: "LKR",
    maximumFractionDigits: 0,
  }).format(value);

const ChevronRightIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-4 w-4"
    aria-hidden="true"
  >
    <path d="m9 18 6-6-6-6" />
  </svg>
);

const MinusIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    className="h-4 w-4"
    aria-hidden="true"
  >
    <path d="M5 12h14" />
  </svg>
);

const PlusIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    className="h-4 w-4"
    aria-hidden="true"
  >
    <path d="M12 5v14M5 12h14" />
  </svg>
);

const TrashIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-4 w-4"
    aria-hidden="true"
  >
    <path d="M3 6h18M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2m2 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6h14Z" />
  </svg>
);

export function CartSlider({ open, onClose, items }: CartSliderProps) {
  useEffect(() => {
    if (typeof document === "undefined") return undefined;
    if (open) {
      document.body.style.setProperty("overflow", "hidden");
    } else {
      document.body.style.removeProperty("overflow");
    }
    return () => {
      document.body.style.removeProperty("overflow");
    };
  }, [open]);

  const subTotal = items.reduce(
    (total, item) => total + item.priceLKR * item.qty,
    0,
  );
  return (
    <div
      className={`fixed inset-0 z-[1200] transition ${
        open ? "pointer-events-auto" : "pointer-events-none"
      }`}
      aria-hidden={!open}
    >
      <button
        type="button"
        className={`absolute inset-0 bg-slate-900/70 backdrop-blur-sm transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
        aria-label="Close cart"
      />
      <div
        className={`absolute right-0 top-0 flex h-full w-full max-w-[420px] flex-col rounded-t-3xl border-l border-slate-100 bg-white shadow-2xl transition-transform duration-300 ease-out sm:rounded-none ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
      >
        <div className="flex items-start justify-between px-5 py-5 sm:px-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
              Cart
            </p>
            <h2 className="text-2xl font-semibold text-slate-900">
              {items.length ? "Your picks" : "Your cart is empty"}
            </h2>
            {items.length ? (
              <p className="text-sm text-slate-500">
                {items.length} item{items.length > 1 ? "s" : ""} ·{" "}
                {formatCurrency(subTotal)}
              </p>
            ) : (
              <p className="text-sm text-slate-500">
                Explore today&apos;s drops and add them here.
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-slate-50 text-slate-500 transition hover:bg-slate-100"
            aria-label="Close cart"
          >
            <span aria-hidden="true">×</span>
          </button>
        </div>

        {items.length > 0 ? (
          <>
            <div className="mt-5 flex-1 overflow-y-auto px-5 pb-28 sm:px-6">
              <ul className="space-y-4">
                {items.map((item) => (
                  <li
                    key={item.id}
                    className="flex gap-3 rounded-3xl border border-slate-100 p-4 shadow-sm transition hover:shadow-md"
                  >
                    <div className="flex h-20 w-20 flex-none items-center justify-center rounded-2xl bg-slate-50 text-xs font-semibold uppercase text-slate-500">
                      {item.colorway?.split(" ")[0] ?? "Corn"}
                    </div>
                    <div className="flex flex-1 flex-col gap-2">
                      <div>
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-semibold text-slate-900 line-clamp-2">
                            {item.name}
                          </p>
                          <button
                            type="button"
                            className="rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                            aria-label={`Remove ${item.name}`}
                          >
                            <TrashIcon />
                          </button>
                        </div>
                        <p className="text-xs text-slate-500">
                          {item.variant || "Standard"}
                        </p>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-1 text-sm font-medium text-slate-700">
                          <button
                            type="button"
                            className="rounded-full p-1 text-slate-500 transition hover:bg-slate-100"
                            aria-label={`Decrease ${item.name} quantity`}
                          >
                            <MinusIcon />
                          </button>
                          <span className="w-6 text-center">{item.qty}</span>
                          <button
                            type="button"
                            className="rounded-full p-1 text-slate-500 transition hover:bg-slate-100"
                            aria-label={`Increase ${item.name} quantity`}
                          >
                            <PlusIcon />
                          </button>
                        </div>
                        <div className="text-right text-sm font-semibold text-slate-900">
                          {formatCurrency(item.qty * item.priceLKR)}
                          {item.compareAtLKR ? (
                            <p className="text-xs font-normal text-slate-400 line-through">
                              {formatCurrency(item.compareAtLKR)}
                            </p>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 px-5 text-center sm:px-6">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-slate-50 text-3xl">
              🛒
            </div>
            <p className="text-sm text-slate-500">
              Sign in to sync your bag across devices and pick up where you left
              off.
            </p>
            <button
              type="button"
              className="rounded-full border border-slate-200 px-5 py-2 text-sm font-semibold text-slate-700 transition hover:border-primary/20 hover:bg-primary/5"
            >
              Explore products
            </button>
          </div>
        )}

        <div className="pointer-events-auto border-t border-slate-100 bg-white/95 px-5 py-5 shadow-[0_-20px_45px_rgba(15,23,42,0.08)] sm:px-6">
          <div className="flex items-center justify-between text-base font-semibold text-slate-900">
            <span>Subtotal</span>
            <span>{formatCurrency(subTotal)}</span>
          </div>
          <p className="text-xs text-slate-500">
            Shipping and taxes calculated at checkout.
          </p>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300"
            >
              View full cart
            </button>
            <button
              type="button"
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-primary px-4 py-3 text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-red-600"
            >
              Checkout
              <ChevronRightIcon />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
