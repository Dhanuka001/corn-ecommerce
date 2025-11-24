"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { Footer } from "@/components/footer";
import { MobileBottomNav } from "@/components/mobile-bottom-nav";
import { Navbar } from "@/components/navbar";
import { useCart } from "@/context/cart-context";
import { useNotifications } from "@/context/notification-context";
import { useAuth } from "@/context/auth-context";
import { getAddresses, type Address } from "@/lib/api/addresses";
import { CheckoutAddressSelector } from "@/components/checkout/checkout-address-selector";
import { CheckoutSummary } from "@/components/checkout/checkout-summary";
import { fetchCheckoutSummary, placeOrder } from "@/lib/api/checkout";

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency: "LKR",
  }).format(value);

export default function CartPage() {
  const { user, openAuth } = useAuth();
  const { cart, loading, pending, updateQuantity, removeItem, refresh } = useCart();
  const { notifyError, notifySuccess } = useNotifications();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [addressLoading, setAddressLoading] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [summary, setSummary] = useState<{
    subTotalLKR: number;
    shippingLKR: number;
    discountLKR: number;
    totalLKR: number;
    shippingRateLabel?: string;
  } | null>(null);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [placingOrder, setPlacingOrder] = useState(false);

  const items = cart?.items ?? [];
  const subtotal = cart?.summary?.subTotalLKR ?? 0;
  const totalQuantity = cart?.summary?.totalQuantity ?? items.length;

  const cartId = cart?.id ?? null;

  const loadAddresses = async () => {
    if (!user) return;
    setAddressLoading(true);
    try {
      const data = await getAddresses();
      setAddresses(data.items);
      if (!selectedAddressId && data.items.length) {
        setSelectedAddressId(data.items[0].id);
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to load addresses.";
      notifyError("Addresses unavailable", message);
    } finally {
      setAddressLoading(false);
    }
  };

  useEffect(() => {
    if (!user) return;
    void loadAddresses();
  }, [user]);

  const fetchSummary = async (addressId: string) => {
    if (!cartId || !addressId || items.length === 0) {
      return;
    }
    setSummaryLoading(true);
    try {
      const data = await fetchCheckoutSummary({
        cartId,
        shippingAddressId: addressId,
      });
      setSummary({
        subTotalLKR: data.subTotalLKR,
        shippingLKR: data.shippingLKR,
        discountLKR: data.discountLKR,
        totalLKR: data.totalLKR,
        shippingRateLabel: data.shippingRate.label,
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to update shipping.";
      if (message.toLowerCase().includes("cart is empty")) {
        window.location.href = "/cart";
      } else {
        notifyError("Shipping update failed", message);
      }
    } finally {
      setSummaryLoading(false);
    }
  };

  useEffect(() => {
    if (selectedAddressId && items.length > 0) {
      void fetchSummary(selectedAddressId);
    }
  }, [selectedAddressId, cartId, items.length]);

  const handleQtyChange = (itemId: string, qty: number) => {
    if (qty < 1) {
      void removeItem(itemId);
    } else {
      void updateQuantity(itemId, qty);
    }
  };

  const canCheckout = !!selectedAddressId && !!summary;

  const handlePlaceOrder = async () => {
    if (!selectedAddressId || !summary) {
      notifyError("Address required", "Select a shipping address first.");
      return;
    }
    setPlacingOrder(true);
    try {
      const idempotencyKey =
        typeof crypto !== "undefined" && crypto.randomUUID
          ? crypto.randomUUID()
          : Math.random().toString(36).slice(2);
      const result = await placeOrder({
        shippingAddressId: selectedAddressId,
        billingAddressId: selectedAddressId,
        paymentMethod: "COD",
        idempotencyKey,
      });
      await refresh();
      notifySuccess(
        "Order placed",
        `Order ${result.orderNo} confirmed. Total ${formatCurrency(result.totalLKR)}.`,
      );
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to place order.";
      notifyError("Checkout failed", message);
    } finally {
      setPlacingOrder(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50">
      <Navbar />

      <div className="bg-neutral-900 px-4 py-3 text-center text-sm font-semibold tracking-tight text-white">
        Free shipping over LKR 25,000. Cart syncs after you sign in.
      </div>

      <main className="mx-auto w-full max-w-7xl px-4 pb-16 pt-10 lg:pt-12">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.7fr)_minmax(360px,0.9fr)]">
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-semibold text-neutral-900">
                Your Bag
              </h1>
              <span className="text-sm font-medium text-neutral-500">
                ({totalQuantity} {totalQuantity === 1 ? "item" : "items"})
              </span>
            </div>
            <p className="text-sm text-neutral-600">
              Live cart powered by the backend. Adjust quantities or remove items to update totals instantly.
            </p>

            {loading ? (
              <div className="flex h-40 items-center justify-center rounded-2xl border border-dashed border-neutral-200 bg-white text-sm font-semibold text-neutral-600">
                Loading your cart…
              </div>
            ) : items.length === 0 ? (
              <div className="flex flex-col items-center gap-4 rounded-2xl border border-neutral-200 bg-white p-8 text-center shadow-sm">
                <p className="text-lg font-semibold text-neutral-900">
                  Your cart is empty
                </p>
                <p className="text-sm text-neutral-600">
                  Browse products and add them to your bag to checkout.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link
                    href="/shop"
                    className="rounded-full border border-neutral-200 bg-neutral-900 px-5 py-2 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:shadow-lg"
                  >
                    Start shopping
                  </Link>
                  <Link
                    href="/favorites"
                    className="rounded-full border border-neutral-200 bg-white px-5 py-2 text-sm font-semibold text-neutral-800 transition hover:border-neutral-900 hover:shadow-sm"
                  >
                    View favorites
                  </Link>
                </div>
              </div>
            ) : (
              <div className="divide-y divide-neutral-200 overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
                {items.map((item) => {
                  const thumbnail = item.product.images?.[0];
                  const variantLabel = item.variant?.name;
                  return (
                    <article key={item.id} className="p-5 sm:p-6">
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-6">
                        <div className="relative flex h-32 w-full items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-neutral-100 via-neutral-50 to-neutral-200 sm:w-32">
                          {thumbnail?.url ? (
                            <Image
                              src={thumbnail.url}
                              alt={thumbnail.alt || item.product.name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <span className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
                              No image
                            </span>
                          )}
                        </div>

                        <div className="flex-1 space-y-2">
                          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                            <div className="space-y-1">
                              <p className="text-lg font-semibold text-neutral-900">
                                {item.product.name}
                              </p>
                              <p className="text-sm text-neutral-500">
                                SKU: {item.product.sku}
                              </p>
                              {variantLabel ? (
                                <p className="text-sm text-neutral-600">
                                  Variant: {variantLabel}
                                </p>
                              ) : null}
                            </div>
                            <p className="text-lg font-semibold text-neutral-900">
                              {formatCurrency(item.unitLKR)}
                            </p>
                          </div>

                          <div className="mt-4 grid gap-3 sm:grid-cols-[auto,1fr] sm:items-center">
                            <div className="flex items-center gap-3">
                              <label className="text-sm font-semibold text-neutral-800">
                                Qty
                              </label>
                              <div className="flex h-10 items-center gap-2 rounded-lg border border-neutral-200 px-3 text-sm font-medium text-neutral-900 shadow-inner">
                                <button
                                  className="text-neutral-500 transition hover:text-neutral-900 disabled:opacity-40"
                                  disabled={pending || item.qty <= 1}
                                  onClick={() =>
                                    handleQtyChange(item.id, item.qty - 1)
                                  }
                                >
                                  –
                                </button>
                                <span>{item.qty}</span>
                                <button
                                  className="text-neutral-500 transition hover:text-neutral-900 disabled:opacity-40"
                                  disabled={pending}
                                  onClick={() =>
                                    handleQtyChange(item.id, item.qty + 1)
                                  }
                                >
                                  +
                                </button>
                              </div>
                            </div>
                            <div className="flex flex-wrap items-center gap-4 text-sm">
                              <button
                                className="text-neutral-500 transition hover:text-neutral-900 disabled:opacity-40"
                                disabled={pending}
                                onClick={() => handleQtyChange(item.id, 0)}
                              >
                                Remove
                              </button>
                              <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-600">
                                In stock
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}

            <div className="space-y-4 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.14em] text-primary">
                    Shipping address
                  </p>
                  <p className="text-lg font-semibold text-neutral-900">
                    Deliver to
                  </p>
                </div>
                <Link
                  href="/account/addresses"
                  className="text-sm font-semibold text-primary transition hover:text-red-500"
                >
                  Manage addresses
                </Link>
              </div>
              {addressLoading ? (
                <div className="grid gap-3 sm:grid-cols-2">
                  {Array.from({ length: 2 }).map((_, index) => (
                    <div
                      key={index}
                      className="h-24 rounded-2xl border border-neutral-200 bg-neutral-50"
                    />
                  ))}
                </div>
              ) : (
                <CheckoutAddressSelector
                  addresses={addresses}
                  selectedAddressId={selectedAddressId}
                  onChange={(id) => setSelectedAddressId(id)}
                />
              )}
            </div>
          </section>

          <aside className="lg:sticky lg:top-12">
            <CheckoutSummary
              subTotalLKR={summary?.subTotalLKR ?? subtotal}
              shippingLKR={summary?.shippingLKR ?? 0}
              discountLKR={summary?.discountLKR ?? 0}
              totalLKR={summary?.totalLKR ?? subtotal}
              shippingRateLabel={summary?.shippingRateLabel}
              loading={summaryLoading}
            />
            <div className="mt-4 space-y-3">
              <button
                className="w-full rounded-full border border-primary bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-60"
                disabled={!canCheckout || pending || placingOrder}
                onClick={handlePlaceOrder}
              >
                {placingOrder ? "Placing order..." : "Place order"}
              </button>
              <Link
                href="/shop"
                className="flex w-full items-center justify-center gap-2 rounded-full border border-neutral-200 bg-white px-5 py-3 text-sm font-semibold text-neutral-800 transition hover:border-neutral-900"
              >
                Continue shopping
              </Link>
            </div>
          </aside>
        </div>
      </main>

      <Footer />
      <MobileBottomNav />
    </div>
  );
}
