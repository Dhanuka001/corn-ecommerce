"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

import { useAuth } from "@/context/auth-context";
import { useNotifications } from "@/context/notification-context";
import { fetchAdminOrder } from "@/lib/admin-api";
import type { AdminOrder } from "@/types/admin";

const currency = new Intl.NumberFormat("en-LK", {
  style: "currency",
  currency: "LKR",
  maximumFractionDigits: 0,
});

const formatDate = (value?: string | null) => {
  if (!value) return "N/A";
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
};

const Badge = ({ children, tone = "slate" }: { children: string; tone?: "slate" | "green" | "amber" | "red" }) => {
  const tones = {
    slate: "bg-slate-100 text-slate-700",
    green: "bg-emerald-100 text-emerald-700",
    amber: "bg-amber-100 text-amber-700",
    red: "bg-red-100 text-red-700",
  };
  return (
    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${tones[tone]}`}>{children}</span>
  );
};

const Spinner = () => (
  <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent align-middle" />
);

export default function AdminOrderDetailPage() {
  const params = useParams<{ id: string }>();
  const orderId = Array.isArray(params?.id) ? params?.id[0] : params?.id;
  const { user, openAuth, loading: authLoading } = useAuth();
  const { notifyError } = useNotifications();
  const [order, setOrder] = useState<AdminOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isAdmin = useMemo(() => user?.role === "ADMIN" || user?.role === "STAFF", [user]);

  const loadOrder = useCallback(async () => {
    if (!orderId) return;
    setLoading(true);
    setError(null);
    try {
      const payload = await fetchAdminOrder(orderId);
      setOrder(payload.order);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Unable to load order. It may not exist.";
      setError(message);
      notifyError("Order", message);
    } finally {
      setLoading(false);
    }
  }, [notifyError, orderId]);

  useEffect(() => {
    if (authLoading) return;
    if (!isAdmin) {
      openAuth();
      return;
    }
    void loadOrder();
  }, [authLoading, isAdmin, loadOrder, openAuth]);

  if (!authLoading && !isAdmin) {
    return (
      <div className="mx-auto flex min-h-screen max-w-5xl items-center justify-center px-4">
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold text-slate-800">
            Please sign in as admin to view orders.
          </p>
          <button
            onClick={() => openAuth("login")}
            className="mt-3 rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
          >
            Open sign-in
          </button>
        </div>
      </div>
    );
  }

  const addressBlock = (title: string, addr?: AdminOrder["shippingAddr"]) => (
    <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">{title}</p>
      {addr ? (
        <div className="mt-2 text-sm text-slate-700">
          <p className="font-semibold text-slate-900">{addr.fullName}</p>
          <p>{addr.phone}</p>
          <p>{addr.addressLine1}</p>
          {addr.addressLine2 ? <p>{addr.addressLine2}</p> : null}
          <p>
            {addr.city}, {addr.district}
          </p>
          <p>
            {addr.postalCode ? `${addr.postalCode}, ` : ""}
            {addr.country}
          </p>
        </div>
      ) : (
        <p className="mt-2 text-sm text-slate-500">No address on file.</p>
      )}
    </div>
  );

  const statusTone = (status: string): "slate" | "green" | "amber" | "red" => {
    if (status === "PAID" || status === "FULFILLED") return "green";
    if (status === "PENDING") return "amber";
    if (status === "CANCELLED" || status === "REFUNDED") return "red";
    return "slate";
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-12">
      <div className="mx-auto w-full max-w-6xl px-4 pt-10 lg:px-0">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-primary">
              Order
            </p>
            <h1 className="text-3xl font-semibold text-slate-900">
              {order ? order.orderNo : "Loading order..."}
            </h1>
            <p className="text-sm text-slate-600">
              Created {order ? formatDate(order.createdAt) : "—"}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/admin"
              className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-primary/30 hover:text-primary"
            >
              Back to admin
            </Link>
            <button
              onClick={() => void loadOrder()}
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-primary/30 hover:text-primary disabled:cursor-not-allowed disabled:opacity-70"
              disabled={loading}
            >
              {loading ? <Spinner /> : null}
              Refresh
            </button>
          </div>
        </div>

        {loading ? (
          <div className="mt-10 rounded-2xl border border-slate-100 bg-white p-6 text-sm text-slate-600 shadow-sm">
            <div className="inline-flex items-center gap-2">
              <Spinner /> Loading order details...
            </div>
          </div>
        ) : error ? (
          <div className="mt-10 rounded-2xl border border-red-100 bg-red-50 p-6 text-sm text-red-700 shadow-sm">
            {error}
          </div>
        ) : order ? (
          <div className="mt-8 space-y-6">
            <div className="grid gap-4 lg:grid-cols-[1.4fr,1fr]">
              <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
                <div className="flex flex-wrap items-center gap-3">
                  <Badge tone={statusTone(order.status)}>{order.status}</Badge>
                  <Badge tone={statusTone(order.paymentStatus)}>
                    {`Payment ${order.paymentStatus}`}
                  </Badge>
                  <Badge tone="slate">{`Method ${order.paymentMethod}`}</Badge>
                  <Badge tone="slate">{`Items ${order.items.length}`}</Badge>
                </div>
                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-xl bg-slate-50 px-3 py-2">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                      Subtotal
                    </p>
                    <p className="text-lg font-semibold text-slate-900">
                      {currency.format(order.subTotalLKR)}
                    </p>
                  </div>
                  <div className="rounded-xl bg-slate-50 px-3 py-2">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                      Shipping
                    </p>
                    <p className="text-lg font-semibold text-slate-900">
                      {currency.format(order.shippingLKR)}
                    </p>
                  </div>
                  <div className="rounded-xl bg-slate-50 px-3 py-2">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                      Total
                    </p>
                    <p className="text-lg font-semibold text-slate-900">
                      {currency.format(order.totalLKR)}
                    </p>
                  </div>
                </div>
              </div>
              <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary">
                  Customer
                </p>
                {order.user ? (
                  <div className="mt-2 text-sm text-slate-700">
                    <p className="font-semibold text-slate-900">
                      {[order.user.firstName, order.user.lastName].filter(Boolean).join(" ") ||
                        order.user.email}
                    </p>
                    <p>{order.user.email}</p>
                    {order.user.phone ? <p>{order.user.phone}</p> : null}
                  </div>
                ) : (
                  <p className="mt-2 text-sm text-slate-500">Guest checkout</p>
                )}
                {order.payhereRef ? (
                  <p className="mt-3 rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-600">
                    PayHere ref: <span className="font-semibold">{order.payhereRef}</span>
                  </p>
                ) : null}
                {order.payment ? (
                  <div className="mt-3 rounded-lg border border-slate-100 bg-slate-50 px-3 py-2 text-xs text-slate-600">
                    <p className="font-semibold text-slate-800">Payment</p>
                    <p>Status: {order.payment.status}</p>
                    <p>Amount: {currency.format(order.payment.amountLKR)}</p>
                    {order.payment.providerRef ? <p>Ref: {order.payment.providerRef}</p> : null}
                  </div>
                ) : null}
              </div>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              {addressBlock("Shipping address", order.shippingAddr)}
              {addressBlock("Billing address", order.billingAddr)}
            </div>

            <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary">
                  Line items
                </p>
                <Badge tone="slate">{`${order.items.length} items`}</Badge>
              </div>
              <div className="mt-4 overflow-hidden rounded-xl border border-slate-100">
                <table className="min-w-full text-sm">
                  <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-[0.1em] text-slate-500">
                    <tr>
                      <th className="px-4 py-3">Product</th>
                      <th className="px-4 py-3">SKU</th>
                      <th className="px-4 py-3 text-right">Qty</th>
                      <th className="px-4 py-3 text-right">Unit</th>
                      <th className="px-4 py-3 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {order.items.map((item) => (
                      <tr key={item.id} className="text-slate-800">
                        <td className="px-4 py-3 font-semibold">{item.name}</td>
                        <td className="px-4 py-3 text-slate-600">{item.sku}</td>
                        <td className="px-4 py-3 text-right">{item.qty}</td>
                        <td className="px-4 py-3 text-right">{currency.format(item.unitLKR)}</td>
                        <td className="px-4 py-3 text-right">
                          {currency.format(item.lineTotalLKR)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary">
                  Timeline
                </p>
                <Badge tone="slate">{`${order.timeline.length} events`}</Badge>
              </div>
              <div className="mt-4 space-y-3">
                {order.timeline.length ? (
                  order.timeline.map((entry) => (
                    <div
                      key={entry.id}
                      className="flex items-start justify-between rounded-xl border border-slate-100 bg-slate-50 px-3 py-2"
                    >
                      <div>
                        <p className="text-sm font-semibold text-slate-800">{entry.type}</p>
                        {entry.note ? (
                          <p className="text-xs text-slate-600">{entry.note}</p>
                        ) : null}
                      </div>
                      <p className="text-[11px] text-slate-500">{formatDate(entry.createdAt)}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-slate-500">No timeline events yet.</p>
                )}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
