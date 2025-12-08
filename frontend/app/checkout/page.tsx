"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { Footer } from "@/components/footer";
import { MobileBottomNav } from "@/components/mobile-bottom-nav";
import { Navbar } from "@/components/navbar";
import { CheckoutAddressSelector } from "@/components/checkout/checkout-address-selector";
import { CheckoutSummary } from "@/components/checkout/checkout-summary";
import { useAuth } from "@/context/auth-context";
import { useCart } from "@/context/cart-context";
import { useNotifications } from "@/context/notification-context";
import { getAddresses, type Address } from "@/lib/api/addresses";
import { fetchCheckoutSummary } from "@/lib/api/checkout";
import { createPayherePayment } from "@/lib/api/payhere";

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency: "LKR",
  }).format(value);

export default function CheckoutPage() {
  const { user } = useAuth();
  const { cart, loading: cartLoading, refresh } = useCart();
  const { notifyError } = useNotifications();

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [addressLoading, setAddressLoading] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    null,
  );
  const [summary, setSummary] = useState<{
    subTotalLKR: number;
    shippingLKR: number;
    discountLKR: number;
    totalLKR: number;
    shippingRateLabel?: string;
  } | null>(null);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showAddressPrompt, setShowAddressPrompt] = useState(false);
  const [addressPromptSeen, setAddressPromptSeen] = useState(false);

  const items = cart?.items ?? [];
  const subtotal = useMemo(
    () => items.reduce((total, item) => total + item.unitLKR * item.qty, 0),
    [items],
  );

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

  useEffect(() => {
    if (!addressLoading && !addresses.length && !addressPromptSeen) {
      setShowAddressPrompt(true);
    }
  }, [addressLoading, addresses.length, addressPromptSeen]);

  useEffect(() => {
    if (addresses.length) {
      setAddressPromptSeen(false);
    }
  }, [addresses.length]);

  const updateSummary = async (addressId: string) => {
    if (!cart?.id || !addressId || items.length === 0) return;
    setSummaryLoading(true);
    try {
      const data = await fetchCheckoutSummary({
        cartId: cart.id,
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
      notifyError("Shipping update failed", message);
    } finally {
      setSummaryLoading(false);
    }
  };

  useEffect(() => {
    if (selectedAddressId && items.length > 0) {
      void updateSummary(selectedAddressId);
    }
  }, [selectedAddressId, cart?.id, items.length]);

  const handlePayWithPayHere = async () => {
    if (!selectedAddressId) {
      setShowAddressPrompt(true);
      setAddressPromptSeen(true);
      return;
    }
    if (!items.length) {
      notifyError("Cart empty", "Add items to your cart before paying.");
      return;
    }

    setSubmitting(true);
    try {
      const payment = await createPayherePayment({
        shippingAddressId: selectedAddressId,
        billingAddressId: selectedAddressId,
      });

      const form = document.createElement("form");
      form.method = "POST";
      form.action = payment.redirectUrl;
      form.style.display = "none";

      Object.entries(payment.payload).forEach(([key, value]) => {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = key;
        input.value = String(value ?? "");
        form.appendChild(input);
      });

      document.body.appendChild(form);
      form.submit();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to start payment.";
      notifyError("Payment failed", message);
      void refresh();
    } finally {
      setSubmitting(false);
    }
  };

  const closeAddressPrompt = () => {
    setShowAddressPrompt(false);
    setAddressPromptSeen(true);
  };

  const totalQuantity = items.reduce((total, item) => total + item.qty, 0);
  const hasAddresses = addresses.length > 0;
  const addressActionLabel = hasAddresses
    ? "Manage addresses"
    : "Add shipping address";
  const addressActionHint = hasAddresses
    ? "Update or remove saved addresses anytime."
    : "Add your shipping address to unlock delivery and shipping details.";

  return (
    <div className="min-h-screen bg-white text-neutral-900">
      <Navbar />

      <div className="bg-neutral-900 px-4 py-3 text-center text-sm font-semibold tracking-tight text-white">
        Secure checkout powered by PayHere. Orders are created only after payment is confirmed.
      </div>

      <main className="mx-auto w-full max-w-6xl px-4 pb-16 pt-10 lg:pt-12">
        <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">
              Checkout
            </p>
            <h1 className="text-3xl font-semibold text-neutral-900 sm:text-4xl">
              Complete your order
            </h1>
            <p className="text-sm text-neutral-600">
              We redirect you to PayHere to pay securely. Your order is created only after PayHere confirms the payment.
            </p>
          </div>
          <Link
            href="/cart"
            className="inline-flex items-center gap-2 rounded-full border border-neutral-200 px-4 py-2 text-sm font-semibold text-neutral-800 transition hover:border-neutral-900"
          >
            ← Back to cart
          </Link>
        </div>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.6fr)_minmax(360px,0.95fr)]">
          <section className="space-y-6">
            <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.14em] text-primary">
                    Shipping address
                  </p>
                  <p className="text-lg font-semibold text-neutral-900">
                    Where should we deliver?
                  </p>
                  <p className="mt-1 text-xs text-neutral-500">{addressActionHint}</p>
                </div>
                <Link
                  href="/account/addresses"
                  className="text-sm font-semibold text-primary transition hover:text-red-500"
                  onClick={() => setShowAddressPrompt(false)}
                >
                  {addressActionLabel}
                </Link>
              </div>

              <div className="mt-4">
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
            </div>

            <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-neutral-900">
                  Your items ({totalQuantity})
                </h2>
                <Link
                  href="/shop"
                  className="text-sm font-semibold text-primary transition hover:text-red-500"
                >
                  Continue shopping
                </Link>
              </div>
              {cartLoading ? (
                <div className="mt-4 h-24 rounded-xl border border-neutral-200 bg-neutral-50" />
              ) : items.length === 0 ? (
                <div className="mt-4 rounded-xl border border-neutral-200 bg-neutral-50 p-6 text-sm text-neutral-600">
                  Your cart is empty. Add products to proceed.
                </div>
              ) : (
                <div className="mt-4 divide-y divide-neutral-200">
                  {items.map((item) => {
                    const thumbnail = item.product.images?.[0];
                    const variantLabel = item.variant?.name;
                    return (
                      <div key={item.id} className="flex gap-4 py-4">
                        <div className="relative h-20 w-20 overflow-hidden rounded-xl bg-neutral-100">
                          {thumbnail?.url ? (
                            <Image
                              src={thumbnail.url}
                              alt={thumbnail.alt || item.product.name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <span className="absolute inset-0 flex items-center justify-center text-[11px] font-semibold uppercase tracking-wide text-neutral-500">
                              No image
                            </span>
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="text-base font-semibold text-neutral-900">
                            {item.product.name}
                          </p>
                          <p className="text-sm text-neutral-500">SKU: {item.product.sku}</p>
                          {variantLabel ? (
                            <p className="text-sm text-neutral-600">Variant: {variantLabel}</p>
                          ) : null}
                          <p className="mt-1 text-sm font-semibold text-neutral-900">
                            {item.qty} × {formatCurrency(item.unitLKR)}
                          </p>
                        </div>
                        <div className="text-right text-base font-semibold text-neutral-900">
                          {formatCurrency(item.unitLKR * item.qty)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </section>

          <aside className="space-y-4 lg:sticky lg:top-16">
            <CheckoutSummary
              subTotalLKR={summary?.subTotalLKR ?? subtotal}
              shippingLKR={summary?.shippingLKR ?? 0}
              discountLKR={summary?.discountLKR ?? 0}
              totalLKR={summary?.totalLKR ?? subtotal}
              shippingRateLabel={summary?.shippingRateLabel}
              loading={summaryLoading}
            />
            <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
              <p className="text-sm font-semibold text-neutral-900">
                Pay with PayHere
              </p>
              <p className="mt-1 text-sm text-neutral-600">
                You will be redirected to PayHere. We only create your order after their server-side confirmation (notify_url).
              </p>
              <button
                className="mt-4 w-full rounded-full border border-primary bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-60"
                disabled={submitting || cartLoading || items.length === 0}
                onClick={handlePayWithPayHere}
              >
                {submitting ? "Redirecting to PayHere…" : "Pay with PayHere"}
              </button>
              <p className="mt-2 text-xs text-neutral-500">
                No order is created until PayHere sends a successful notification.
              </p>
            </div>
          </aside>
        </div>
      </main>

      <Footer />
      <MobileBottomNav />
      {showAddressPrompt && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 px-4 py-6">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-lg font-semibold text-neutral-900">
                  Add a shipping address
                </p>
                <p className="mt-1 text-sm text-neutral-600">
                  We need your address to calculate delivery and start the order.
                </p>
              </div>
              <button
                type="button"
                onClick={closeAddressPrompt}
                className="text-sm font-semibold text-neutral-500 transition hover:text-neutral-900"
              >
                Close
              </button>
            </div>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                href="/account/addresses"
                className="inline-flex flex-1 items-center justify-center rounded-full border border-primary bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:shadow-lg"
                onClick={closeAddressPrompt}
              >
                Add shipping address
              </Link>
              <button
                type="button"
                onClick={closeAddressPrompt}
                className="flex-1 rounded-full border border-neutral-200 px-4 py-2 text-sm font-semibold text-neutral-700 transition hover:border-neutral-300 hover:text-neutral-900"
              >
                Maybe later
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
