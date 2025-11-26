"use client";

import type { Order } from "@/lib/api/orders";

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency: "LKR",
  }).format(value);

const statusTone: Record<string, string> = {
  PENDING: "bg-amber-50 text-amber-700",
  PAID: "bg-emerald-50 text-emerald-700",
  CANCELLED: "bg-rose-50 text-rose-700",
  FULFILLED: "bg-sky-50 text-sky-700",
  REFUNDED: "bg-slate-100 text-slate-700",
};

type OrderCardProps = {
  order: Order;
};

export function OrderCard({ order }: OrderCardProps) {
  const tone = statusTone[order.status] || "bg-slate-100 text-slate-700";
  const created = new Date(order.createdAt).toLocaleString("en-LK", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  return (
    <article className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-neutral-500">Order</p>
          <p className="text-lg font-semibold text-neutral-900">{order.orderNo}</p>
          <p className="text-xs text-neutral-500">{created}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${tone}`}>
            {order.status}
          </span>
          <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-semibold text-neutral-700">
            {order.paymentMethod}
          </span>
        </div>
      </div>

      <div className="mt-4 rounded-xl bg-neutral-50 px-4 py-3 text-sm text-neutral-700">
        <div className="flex items-center justify-between">
          <span>Subtotal</span>
          <span className="font-semibold text-neutral-900">
            {formatCurrency(order.subTotalLKR)}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span>Shipping</span>
          <span className="font-semibold text-neutral-900">
            {formatCurrency(order.shippingLKR)}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span>Total</span>
          <span className="text-lg font-semibold text-neutral-900">
            {formatCurrency(order.totalLKR)}
          </span>
        </div>
      </div>

      <div className="mt-4 space-y-3">
        {order.items.map((item) => (
          <div
            key={item.id}
            className="flex items-start justify-between rounded-xl border border-neutral-100 bg-white px-3 py-2 shadow-sm"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-neutral-100 text-xs font-semibold uppercase text-neutral-500">
                Img
              </div>
              <div>
                <p className="font-semibold text-neutral-900">{item.name}</p>
                <p className="text-xs text-neutral-500">SKU: {item.sku}</p>
              </div>
            </div>
            <div className="text-right text-sm text-neutral-700">
              <p className="font-semibold text-neutral-900">Qty: {item.qty}</p>
              <p>{formatCurrency(item.lineTotalLKR)}</p>
            </div>
          </div>
        ))}
      </div>
    </article>
  );
}
