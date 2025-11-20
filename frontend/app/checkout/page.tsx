"use client";

import Link from "next/link";
import { type FormEvent, useMemo, useState } from "react";

import { Footer } from "@/components/footer";
import { MobileBottomNav } from "@/components/mobile-bottom-nav";
import { Navbar } from "@/components/navbar";

type OrderItem = {
  id: number;
  name: string;
  variant: string;
  color: string;
  quantity: number;
  price: number;
};

type DeliveryOption = {
  id: string;
  label: string;
  description: string;
  price: number;
  badge?: string;
};

type PaymentMethod = {
  id: string;
  label: string;
  description: string;
};

const orderItems: OrderItem[] = [
  {
    id: 1,
    name: "CornBeam Noise-Canceling Headphones",
    variant: "Adaptive ANC / Spatial Audio",
    color: "Onyx Black",
    quantity: 1,
    price: 259.99,
  },
  {
    id: 2,
    name: "CornCharge GaN Fast Charger 120W",
    variant: "Tri-port USB-C / USB-A",
    color: "Matte Graphite",
    quantity: 1,
    price: 119.99,
  },
];

const deliveryOptions: DeliveryOption[] = [
  {
    id: "standard",
    label: "Standard Delivery",
    description: "Arrives in 3-5 business days",
    price: 9.99,
    badge: "Best value",
  },
  {
    id: "express",
    label: "Express Delivery",
    description: "Arrives in 1-2 business days",
    price: 19.99,
  },
];

const paymentMethods: PaymentMethod[] = [
  {
    id: "card",
    label: "Card Payment",
    description: "Visa, Mastercard, Amex, Discover",
  },
  {
    id: "cod",
    label: "Cash on Delivery",
    description: "Pay when your package arrives",
  },
  {
    id: "koko",
    label: "Koko Pay in 3",
    description: "Split into 3 interest-free installments",
  },
];

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency: "LKR",
  }).format(value);

export default function CheckoutPage() {
  const [selectedDelivery, setSelectedDelivery] = useState(deliveryOptions[0].id);
  const [selectedPayment, setSelectedPayment] = useState(paymentMethods[0].id);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const subtotal = useMemo(
    () =>
      orderItems.reduce(
        (total, item) => total + item.price * item.quantity,
        0,
      ),
    [],
  );

  const shippingCost =
    deliveryOptions.find((option) => option.id === selectedDelivery)?.price ??
    0;
  const total = subtotal + shippingCost;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    window.setTimeout(() => setIsSubmitting(false), 1400);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-50 via-white to-neutral-50 text-neutral-900">
      <Navbar />

      <div className="bg-neutral-900 px-4 py-3 text-center text-sm font-semibold tracking-tight text-white">
        Free U.S. shipping over $99 + free returns. Corn Club unlocks early
        drops.
      </div>

      <div className="border-b border-neutral-200 bg-white/90 py-3 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-center gap-2 px-4 text-xs font-semibold tracking-tight text-neutral-600 sm:text-sm">
          <Link
            href="/cart"
            className="rounded-full bg-neutral-100 px-4 py-1.5 text-neutral-900 transition hover:text-[#ED1C24]"
          >
            Cart
          </Link>
          <span aria-hidden className="text-neutral-300">
            →
          </span>
          <span className="rounded-full bg-neutral-900 px-4 py-1.5 text-white shadow-sm">
            Checkout
          </span>
          <span aria-hidden className="text-neutral-300">
            →
          </span>
          <span className="rounded-full bg-neutral-100 px-4 py-1.5 text-neutral-500">
            Payment
          </span>
        </div>
      </div>

      <main className="mx-auto w-full max-w-6xl px-4 pb-16 pt-10 lg:pt-12">
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">
              Corn Electronics
            </p>
            <h1 className="text-3xl font-semibold leading-tight text-neutral-900 sm:text-4xl">
              Checkout
            </h1>
            <p className="text-sm text-neutral-600">
              Clean, minimal, and secure checkout crafted for Corn Club
              customers.
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-4 py-2 text-xs font-medium text-neutral-600 shadow-sm">
            <ShieldIcon />
            <div className="flex items-center gap-2">
              <span>SSL secured checkout</span>
              <span className="inline-flex h-1 w-1 rounded-full bg-[#ED1C24]" />
              <span className="text-neutral-500">Support 24/7</span>
            </div>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.6fr)_minmax(360px,0.95fr)] xl:gap-10">
          <form
            id="checkout-form"
            onSubmit={handleSubmit}
            className="space-y-6 rounded-3xl"
            aria-label="Checkout form"
          >
            <section className="rounded-3xl border border-neutral-200 bg-white/80 p-6 shadow-[0_30px_80px_-60px_rgba(0,0,0,0.55)] sm:p-7">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-neutral-900">
                    Shipping information
                  </p>
                  <p className="text-sm text-neutral-500">
                    Enter the address for delivery and tracking.
                  </p>
                </div>
                <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-neutral-600">
                  Step 1
                </span>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label
                    htmlFor="fullName"
                    className="text-sm font-semibold text-neutral-800"
                  >
                    Full Name
                  </label>
                  <input
                    id="fullName"
                    name="fullName"
                    required
                    placeholder="Anika Perera"
                    className="w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3.5 text-sm font-medium text-neutral-900 shadow-sm outline-none transition focus:border-[#ED1C24] focus:ring-2 focus:ring-[#ED1C24]/20"
                  />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="email"
                    className="text-sm font-semibold text-neutral-800"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    placeholder="you@cornelectronics.com"
                    className="w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3.5 text-sm font-medium text-neutral-900 shadow-sm outline-none transition focus:border-[#ED1C24] focus:ring-2 focus:ring-[#ED1C24]/20"
                  />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="phone"
                    className="text-sm font-semibold text-neutral-800"
                  >
                    Phone
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    inputMode="tel"
                    placeholder="+94 77 123 4567"
                    className="w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3.5 text-sm font-medium text-neutral-900 shadow-sm outline-none transition focus:border-[#ED1C24] focus:ring-2 focus:ring-[#ED1C24]/20"
                  />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="address"
                    className="text-sm font-semibold text-neutral-800"
                  >
                    Address Line 1
                  </label>
                  <input
                    id="address"
                    name="address"
                    required
                    placeholder="32 Corn Crescent"
                    className="w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3.5 text-sm font-medium text-neutral-900 shadow-sm outline-none transition focus:border-[#ED1C24] focus:ring-2 focus:ring-[#ED1C24]/20"
                  />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="address2"
                    className="text-sm font-semibold text-neutral-800"
                  >
                    Address Line 2
                  </label>
                  <input
                    id="address2"
                    name="address2"
                    placeholder="Apartment, suite, etc. (optional)"
                    className="w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3.5 text-sm font-medium text-neutral-900 shadow-sm outline-none transition focus:border-[#ED1C24] focus:ring-2 focus:ring-[#ED1C24]/20"
                  />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="city"
                    className="text-sm font-semibold text-neutral-800"
                  >
                    City
                  </label>
                  <input
                    id="city"
                    name="city"
                    required
                    placeholder="Colombo"
                    className="w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3.5 text-sm font-medium text-neutral-900 shadow-sm outline-none transition focus:border-[#ED1C24] focus:ring-2 focus:ring-[#ED1C24]/20"
                  />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="postalCode"
                    className="text-sm font-semibold text-neutral-800"
                  >
                    Postal Code
                  </label>
                  <input
                    id="postalCode"
                    name="postalCode"
                    required
                    placeholder="00500"
                    className="w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3.5 text-sm font-medium text-neutral-900 shadow-sm outline-none transition focus:border-[#ED1C24] focus:ring-2 focus:ring-[#ED1C24]/20"
                  />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="country"
                    className="text-sm font-semibold text-neutral-800"
                  >
                    Country
                  </label>
                  <input
                    id="country"
                    name="country"
                    placeholder="Sri Lanka"
                    className="w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3.5 text-sm font-medium text-neutral-900 shadow-sm outline-none transition focus:border-[#ED1C24] focus:ring-2 focus:ring-[#ED1C24]/20"
                  />
                </div>
              </div>
            </section>

            <section className="rounded-3xl border border-neutral-200 bg-white/90 p-6 shadow-[0_30px_80px_-60px_rgba(0,0,0,0.55)] sm:p-7">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-neutral-900">
                    Delivery method
                  </p>
                  <p className="text-sm text-neutral-500">
                    Choose how you want your Corn order to arrive.
                  </p>
                </div>
                <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-neutral-600">
                  Step 2
                </span>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {deliveryOptions.map((option) => {
                  const isSelected = selectedDelivery === option.id;
                  return (
                    <label
                      key={option.id}
                      className={`group relative flex cursor-pointer flex-col gap-2 rounded-2xl border bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg ${
                        isSelected
                          ? "border-[#ED1C24] ring-1 ring-[#ED1C24]/30"
                          : "border-neutral-200"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-3">
                          <span
                            className={`flex h-5 w-5 items-center justify-center rounded-full border ${
                              isSelected
                                ? "border-[#ED1C24] bg-[#ED1C24]"
                                : "border-neutral-300 bg-white"
                            }`}
                          >
                            <span className="h-2 w-2 rounded-full bg-white" />
                          </span>
                          <div>
                            <p className="text-sm font-semibold text-neutral-900">
                              {option.label}
                            </p>
                            <p className="text-xs text-neutral-500">
                              {option.description}
                            </p>
                          </div>
                        </div>
                        <p className="text-sm font-semibold text-neutral-900">
                          {formatCurrency(option.price)}
                        </p>
                      </div>
                      {option.badge ? (
                        <span className="inline-flex w-fit items-center gap-2 rounded-full bg-neutral-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-neutral-700">
                          <span className="h-1.5 w-1.5 rounded-full bg-[#ED1C24]" />
                          {option.badge}
                        </span>
                      ) : null}
                      <input
                        type="radio"
                        name="delivery"
                        value={option.id}
                        checked={isSelected}
                        onChange={() => setSelectedDelivery(option.id)}
                        className="sr-only"
                      />
                    </label>
                  );
                })}
              </div>
            </section>

            <section className="rounded-3xl border border-neutral-200 bg-white/90 p-6 shadow-[0_30px_80px_-60px_rgba(0,0,0,0.55)] sm:p-7">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-neutral-900">
                    Payment method
                  </p>
                  <p className="text-sm text-neutral-500">
                    Pick a preferred way to complete your order.
                  </p>
                </div>
                <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-neutral-600">
                  Step 3
                </span>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                {paymentMethods.map((method) => {
                  const isSelected = selectedPayment === method.id;
                  return (
                    <label
                      key={method.id}
                      className={`group flex cursor-pointer flex-col gap-3 rounded-2xl border bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg ${
                        isSelected
                          ? "border-[#ED1C24] ring-1 ring-[#ED1C24]/30"
                          : "border-neutral-200"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-3">
                          <div>
                            <p className="text-sm font-semibold text-neutral-900">
                              {method.label}
                            </p>
                            <p className="text-xs text-neutral-500">
                              {method.description}
                            </p>
                          </div>
                        </div>
                      </div>
                      <input
                        type="radio"
                        name="payment"
                        value={method.id}
                        checked={isSelected}
                        onChange={() => setSelectedPayment(method.id)}
                        className="sr-only"
                      />
                    </label>
                  );
                })}
              </div>
            </section>

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="flex items-center gap-3 rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm font-semibold text-neutral-700 shadow-sm">
                <ShieldCheckIcon className="text-neutral-500" />
                SSL secure encryption
              </div>
              <div className="flex items-center gap-3 rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm font-semibold text-neutral-700 shadow-sm">
                <TruckIcon className="text-neutral-500" />
                Fast delivery options
              </div>
              <div className="flex items-center gap-3 rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm font-semibold text-neutral-700 shadow-sm">
                <RefreshIcon className="text-neutral-500" />
                14-day return policy
              </div>
            </div>
          </form>

          <aside className="lg:sticky lg:top-10">
            <div className="overflow-hidden rounded-3xl border border-neutral-200 bg-white/95 shadow-[0_30px_80px_-60px_rgba(0,0,0,0.55)]">
              <div className="flex items-center justify-between border-b border-neutral-100 px-6 py-5">
                <div>
                  <p className="text-lg font-semibold text-neutral-900">
                    Order summary
                  </p>
                  <p className="text-sm text-neutral-500">
                    Review items and totals before completing the order.
                  </p>
                </div>
                <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-neutral-600">
                  {orderItems.length} items
                </span>
              </div>

              <div className="divide-y divide-neutral-100 px-6">
                {orderItems.map((item) => (
                  <article key={item.id} className="flex gap-3 py-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-neutral-100 via-white to-neutral-200 shadow-inner">
                      <ProductIcon />
                    </div>
                    <div className="flex flex-1 items-start justify-between gap-3">
                      <div className="space-y-1">
                        <p className="text-sm font-semibold leading-tight text-neutral-900">
                          {item.name}
                        </p>
                        <p className="text-xs text-neutral-500">
                          {item.variant} · {item.color}
                        </p>
                        <p className="text-xs font-semibold text-neutral-700">
                          Qty {item.quantity}
                        </p>
                      </div>
                      <p className="text-sm font-semibold text-neutral-900">
                        {formatCurrency(item.price)}
                      </p>
                    </div>
                  </article>
                ))}
              </div>

              <div className="space-y-4 px-6 py-5">
                <div className="flex flex-col gap-3 rounded-2xl border border-neutral-100 bg-neutral-50/80 px-4 py-3">
                  <label className="text-xs font-semibold uppercase tracking-[0.08em] text-neutral-500">
                    Promo code
                  </label>
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <input
                      name="promo"
                      placeholder="CORNFALL"
                      className="h-11 flex-1 rounded-xl border border-neutral-200 bg-white px-3 text-sm font-medium text-neutral-900 outline-none transition focus:border-[#ED1C24] focus:ring-2 focus:ring-[#ED1C24]/20"
                    />
                    <button
                      type="button"
                      className="h-11 rounded-xl border border-neutral-900 bg-neutral-900 px-4 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0"
                    >
                      Apply
                    </button>
                  </div>
                  <p className="text-xs text-neutral-500">
                    You can add gift notes or delivery instructions at payment.
                  </p>
                </div>

                <div className="space-y-2 text-sm text-neutral-700">
                  <div className="flex items-center justify-between">
                    <span>Subtotal</span>
                    <span className="font-semibold text-neutral-900">
                      {formatCurrency(subtotal)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Shipping ({deliveryOptions.length} options)</span>
                    <span className="font-semibold text-neutral-900">
                      {formatCurrency(shippingCost)}
                    </span>
                  </div>
                </div>

                <div className="h-px bg-gradient-to-r from-transparent via-neutral-300 to-transparent" />

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-neutral-900">
                      Total
                    </p>
                    <p className="text-xs text-neutral-500">
                      Shipping calculated by delivery selection.
                    </p>
                  </div>
                  <p className="text-2xl font-semibold text-neutral-900">
                    {formatCurrency(total)}
                  </p>
                </div>

                <div className="space-y-3">
                  <button
                    type="submit"
                    form="checkout-form"
                    className="group relative flex h-12 w-full items-center justify-center gap-3 overflow-hidden rounded-xl bg-[#ED1C24] text-sm font-semibold uppercase tracking-wide text-white shadow-lg transition hover:-translate-y-[2px] hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-80"
                    disabled={isSubmitting}
                  >
                    <span className="absolute inset-0 scale-110 bg-gradient-to-r from-[#ED1C24] via-[#f04046] to-[#ED1C24] opacity-0 transition duration-500 group-hover:opacity-25" />
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                        Processing
                      </span>
                    ) : (
                      "Complete Order"
                    )}
                  </button>
                  <p className="text-center text-xs text-neutral-500">
                    By completing the order you agree to Corn Electronics{" "}
                    <Link
                      href="/policies/returns"
                      className="font-semibold text-neutral-800 underline decoration-neutral-300 underline-offset-4 hover:text-[#ED1C24]"
                    >
                      return policy
                    </Link>{" "}
                    and{" "}
                    <Link
                      href="/policies/shipping"
                      className="font-semibold text-neutral-800 underline decoration-neutral-300 underline-offset-4 hover:text-[#ED1C24]"
                    >
                      shipping terms
                    </Link>
                    .
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>

      <Footer />
      <MobileBottomNav />
    </div>
  );
}

function ShieldIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      className="h-5 w-5 text-[#ED1C24]"
      aria-hidden
    >
      <path d="M12 3 4 6v6c0 4.42 2.92 8.41 8 9 5.08-.59 8-4.58 8-9V6Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function ShieldCheckIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      className={className ?? "h-5 w-5"}
      aria-hidden
    >
      <path d="M12 3 4 7v6c0 4.99 3.63 9.59 8 10 4.37-.41 8-5.01 8-10V7Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function TruckIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      className={className ?? "h-5 w-5"}
      aria-hidden
    >
      <path d="M3 7h11v10H3Z" />
      <path d="M14 10h3l3 3v4h-6" />
      <circle cx="7.5" cy="17.5" r="1.5" />
      <circle cx="16.5" cy="17.5" r="1.5" />
    </svg>
  );
}

function RefreshIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      className={className ?? "h-5 w-5"}
      aria-hidden
    >
      <path d="M3 12a9 9 0 0 1 9-9c2.14 0 4.1.75 5.64 2M21 12a9 9 0 0 1-9 9c-2.14 0-4.1-.75-5.64-2" />
      <path d="M3 4v5h5" />
      <path d="m21 20-5-5" />
    </svg>
  );
}

function ProductIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5 text-neutral-700"
      aria-hidden
    >
      <rect x="3" y="4" width="18" height="14" rx="2" ry="2" />
      <path d="M3 10h18" />
      <path d="M10 14h4" />
    </svg>
  );
}
