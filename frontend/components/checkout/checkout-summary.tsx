"use client";

type CheckoutSummaryProps = {
  subTotalLKR: number;
  shippingLKR: number;
  discountLKR: number;
  totalLKR: number;
  shippingRateLabel?: string;
  loading?: boolean;
  children?: React.ReactNode;
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency: "LKR",
  }).format(value);

export function CheckoutSummary({
  subTotalLKR,
  shippingLKR,
  discountLKR,
  totalLKR,
  shippingRateLabel,
  loading,
  children,
}: CheckoutSummaryProps) {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white shadow-md">
      <div className="border-b border-neutral-100 px-6 py-5">
        <h2 className="text-xl font-semibold text-neutral-900">Order Summary</h2>
      </div>

      <div className="space-y-4 px-6 py-5">
        <div className="space-y-2 text-sm text-neutral-700">
          <SummaryRow label="Subtotal" value={formatCurrency(subTotalLKR)} loading={loading} />
          <SummaryRow label="Shipping" value={formatCurrency(shippingLKR)} loading={loading} />
          <SummaryRow label="Discount" value={formatCurrency(discountLKR)} loading={loading} />
        </div>
        <div className="flex items-center justify-between border-t border-neutral-100 pt-4 text-base font-semibold text-neutral-900">
          <span>Total</span>
          <span>{formatCurrency(totalLKR)}</span>
        </div>
        <div className="rounded-xl bg-neutral-50 px-4 py-3 text-sm text-neutral-700">
          <p className="font-semibold text-neutral-900">Delivery</p>
          <p className="text-neutral-600">
            {loading
              ? "Updating shipping..."
              : shippingRateLabel || "Select an address to see delivery options."}
          </p>
        </div>
        {children ? <div className="pt-2">{children}</div> : null}
      </div>
    </div>
  );
}

const SummaryRow = ({
  label,
  value,
  loading,
}: {
  label: string;
  value: string;
  loading?: boolean;
}) => (
  <div className="flex items-center justify-between">
    <span>{label}</span>
    {loading ? (
      <span className="h-4 w-16 animate-pulse rounded-full bg-neutral-200" aria-hidden />
    ) : (
      <span className="font-semibold text-neutral-900">{value}</span>
    )}
  </div>
);
