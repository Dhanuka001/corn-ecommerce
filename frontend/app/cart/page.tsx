"use client";

import Link from "next/link";
import { useState } from "react";

import { Footer } from "@/components/footer";
import { MobileBottomNav } from "@/components/mobile-bottom-nav";
import { Navbar } from "@/components/navbar";

type CartItem = {
  id: number;
  name: string;
  sku: string;
  color: string;
  variant: string;
  shippingMethod: string;
  price: number;
  quantity: number;
};

const initialItems: CartItem[] = [
  {
    id: 1,
    name: "CornBeam Noise-Canceling Headphones",
    sku: "CE-HDP-9932",
    color: "Onyx Black",
    variant: "Over-Ear",
    shippingMethod: "Ship to address",
    price: 259.99,
    quantity: 1,
  },
  {
    id: 2,
    name: "CornCharge GaN Fast Charger 120W",
    sku: "CE-CHG-4412",
    color: "Matte Graphite",
    variant: "3-Port USB-C / USB-A",
    shippingMethod: "Ship to address",
    price: 119.99,
    quantity: 1,
  },
];

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency: "LKR",
  }).format(value);

const MobileCheckoutBar = ({ total }: { total: string }) => (
  <div className="fixed inset-x-0 bottom-[86px] z-40 px-4 pb-[calc(env(safe-area-inset-bottom)+0.4rem)] lg:hidden">
    <div className="mx-auto flex max-w-3xl items-center gap-3 rounded-2xl border border-neutral-200 bg-white/95 px-4 py-3 shadow-[0_14px_40px_rgba(15,23,42,0.14)] backdrop-blur">
      <div className="flex-1">
        <p className="text-[11px] uppercase tracking-[0.14em] text-neutral-400">
          Total
        </p>
        <p className="text-lg font-semibold leading-tight text-neutral-900">
          {total}
        </p>
        <p className="text-[11px] text-neutral-500">Shipping & tax at checkout</p>
      </div>
      <Link
        href="/checkout"
        className="inline-flex h-12 min-w-[130px] items-center justify-center rounded-xl bg-primary px-4 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(79,70,229,0.28)] transition hover:-translate-y-0.5"
      >
        Checkout
      </Link>
    </div>
  </div>
);

export default function CartPage() {
  const [lineItems, setLineItems] = useState<CartItem[]>(initialItems);

  const updateQuantity = (id: number, delta: number) => {
    setLineItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item,
      ),
    );
  };

  const removeItem = (id: number) => {
    setLineItems((prev) => prev.filter((item) => item.id !== id));
  };

  const subtotal = lineItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );
  const estimatedShipping = 14.99;
  const estimatedTax = 0;
  const estimatedTotal = subtotal + estimatedShipping + estimatedTax;
  const hasItems = lineItems.length > 0;

  return (
    <div className="min-h-screen bg-white text-neutral-900">
      <Navbar />

      <div className="bg-neutral-900 px-4 py-2.5 text-center text-xs font-semibold uppercase tracking-[0.12em] text-white">
        Free U.S. shipping over $99 + free returns. Corn Club unlocks early drops.
      </div>

      <main className="mx-auto w-full max-w-5xl px-4 pb-40 pt-6 lg:max-w-6xl lg:pb-16">
        <div className="lg:grid lg:grid-cols-[minmax(0,1.65fr)_minmax(320px,0.85fr)] lg:gap-8">
          <section className="space-y-4">
              <div className="flex items-baseline justify-between">
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-semibold tracking-tight">Your Bag</h1>
                  <span className="text-sm font-medium text-neutral-500">
                  ({lineItems.length} {lineItems.length === 1 ? "item" : "items"})
                  </span>
                </div>
                <span className="hidden text-sm font-semibold text-neutral-900 lg:inline">
                  {formatCurrency(subtotal)}
                </span>
              </div>

            {hasItems ? (
              <div className="overflow-hidden rounded-2xl border border-neutral-200 shadow-[0_12px_32px_rgba(15,23,42,0.08)]">
                {lineItems.map((item, index) => (
                  <article
                    key={item.id}
                    className={`flex gap-3 px-4 py-3 ${index !== lineItems.length - 1 ? "border-b border-neutral-100" : ""}`}
                  >
                    <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border border-neutral-200 bg-gradient-to-br from-neutral-50 via-white to-neutral-100 shadow-inner">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-neutral-200/70">
                        <ProductIcon />
                      </div>
                    </div>

                    <div className="min-w-0 flex-1 space-y-1.5">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 space-y-0.5">
                          <p className="truncate text-[15px] font-semibold leading-snug text-neutral-900">
                            {item.name}
                          </p>
                          <p className="text-[11px] uppercase tracking-[0.16em] text-neutral-400">
                            SKU {item.sku}
                          </p>
                        </div>
                        <p className="text-base font-semibold leading-none text-neutral-900">
                          {formatCurrency(item.price)}
                        </p>
                      </div>

                      <p className="text-xs text-neutral-500">
                        {item.color} · {item.variant}
                      </p>
                      <p className="text-[11px] text-neutral-500">{item.shippingMethod}</p>

                      <div className="flex items-center gap-3 text-xs font-medium text-neutral-700">
                        <div className="inline-flex items-center rounded-full border border-neutral-200 bg-white/90 px-1.5 py-0.5 shadow-sm ring-1 ring-neutral-100">
                          <span className="sr-only">Quantity</span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, -1)}
                            className="flex h-9 w-9 items-center justify-center rounded-full text-lg font-semibold text-neutral-600 transition hover:bg-neutral-100 hover:text-neutral-900"
                            aria-label={`Decrease quantity for ${item.name}`}
                          >
                            &minus;
                          </button>
                          <span className="mx-1.5 w-9 text-center text-sm font-semibold text-neutral-900">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, 1)}
                            className="flex h-9 w-9 items-center justify-center rounded-full text-lg font-semibold text-neutral-600 transition hover:bg-neutral-100 hover:text-neutral-900"
                            aria-label={`Increase quantity for ${item.name}`}
                          >
                            +
                          </button>
                        </div>
                        <span className="h-4 w-px bg-neutral-200" />
                        <button
                          type="button"
                          className="flex h-9 w-9 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-500 transition hover:bg-neutral-100 hover:text-neutral-900"
                          aria-label={`Save ${item.name} for later`}
                          onClick={() => removeItem(item.id)}
                        >
                          <BookmarkIcon />
                        </button>
                        <button
                          type="button"
                          className="flex h-9 w-9 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-500 transition hover:bg-neutral-100 hover:text-rose-500"
                          aria-label={`Remove ${item.name}`}
                          onClick={() => removeItem(item.id)}
                        >
                          <TrashIcon />
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center gap-4 rounded-2xl border border-neutral-200 bg-white px-5 py-10 text-center shadow-[0_12px_32px_rgba(15,23,42,0.06)] sm:flex-row sm:items-center sm:justify-between sm:text-left">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full border border-neutral-200 bg-neutral-50 shadow-inner">
                    <ProductIcon />
                  </div>
                  <div className="space-y-1">
                    <p className="text-lg font-semibold text-neutral-900">
                      Your cart is empty
                    </p>
                    <p className="text-sm text-neutral-500">
                      Start shopping to add Corn essentials.
                    </p>
                  </div>
                </div>
                <Link
                  href="/"
                  className="inline-flex h-11 items-center justify-center rounded-xl bg-neutral-900 px-5 text-sm font-semibold text-white transition hover:-translate-y-[2px] hover:shadow-lg"
                >
                  Start shopping
                </Link>
              </div>
            )}
          </section>

          {hasItems ? (
            <aside className="hidden lg:sticky lg:top-10 lg:block">
              <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-[0_20px_50px_rgba(15,23,42,0.08)]">
                <div className="border-b border-neutral-100 px-5 py-4">
                  <h2 className="text-lg font-semibold tracking-tight text-neutral-900">
                    Order Summary
                  </h2>
                </div>

                <div className="space-y-4 px-5 py-4">
                  <div className="space-y-2 text-sm text-neutral-700">
                    <div className="flex items-center justify-between">
                      <span>Subtotal ({lineItems.length})</span>
                      <span className="font-semibold text-neutral-900">
                        {formatCurrency(subtotal)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Estimated tax</span>
                      <span className="font-semibold text-neutral-900">
                        {formatCurrency(estimatedTax)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Estimated shipping</span>
                      <span className="font-semibold text-neutral-900">
                        {formatCurrency(estimatedShipping)}
                      </span>
                    </div>
                  </div>

                  <div className="h-px bg-gradient-to-r from-transparent via-neutral-300 to-transparent" />

                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-semibold text-neutral-900">
                        Estimated total
                      </p>
                      <p className="text-xs text-neutral-500">
                        Pay in 3 with Koko available
                      </p>
                    </div>
                    <p className="text-2xl font-semibold text-neutral-900">
                      {formatCurrency(estimatedTotal)}
                    </p>
                  </div>

                  <div className="space-y-3">
                    <label className="text-xs font-semibold uppercase tracking-[0.08em] text-neutral-500">
                      Apply promo code
                    </label>
                    <div className="flex flex-col gap-2 sm:flex-row">
                      <input
                        type="text"
                        placeholder="Enter code"
                        className="h-11 flex-1 rounded-xl border border-neutral-200 bg-neutral-50 px-3 text-sm outline-none ring-0 transition focus:border-neutral-900 focus:bg-white"
                      />
                      <button className="h-11 rounded-xl border border-neutral-900 px-5 text-sm font-semibold text-neutral-900 transition hover:-translate-y-0.5 hover:shadow-lg">
                        Apply
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3 pt-1">
                    <Link
                      href="/checkout"
                      className="flex h-12 w-full items-center justify-center rounded-xl bg-primary text-sm font-semibold text-white transition hover:-translate-y-[2px] hover:shadow-xl"
                    >
                      Checkout
                    </Link>
                    <button className="h-12 w-full rounded-xl border border-neutral-300 bg-white text-sm font-semibold text-neutral-900 transition hover:border-neutral-900 hover:-translate-y-[2px] hover:shadow-lg">
                      PayPal
                    </button>
                  </div>
                </div>
              </div>
            </aside>
          ) : null}
        </div>
      </main>

      {hasItems ? <MobileCheckoutBar total={formatCurrency(estimatedTotal)} /> : null}

      <Footer />
      <MobileBottomNav />
    </div>
  );
}

const ProductIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-7 w-7 text-neutral-700"
  >
    <rect x="3" y="4" width="18" height="14" rx="2" ry="2" />
    <path d="M3 10h18" />
    <path d="M10 14h4" />
  </svg>
);

const BookmarkIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.8}
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-[18px] w-[18px]"
    aria-hidden
  >
    <path d="M6 4h12a2 2 0 0 1 2 2v14l-8-4-8 4V6a2 2 0 0 1 2-2Z" />
  </svg>
);

const TrashIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.8}
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-[18px] w-[18px]"
    aria-hidden
  >
    <path d="M3 6h18" />
    <path d="M8 6V4.5A1.5 1.5 0 0 1 9.5 3h5A1.5 1.5 0 0 1 16 4.5V6" />
    <path d="M6 6v13a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V6" />
    <path d="M10 11v6" />
    <path d="M14 11v6" />
  </svg>
);
