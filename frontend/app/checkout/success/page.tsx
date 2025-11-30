import Link from "next/link";

import { Footer } from "@/components/footer";
import { MobileBottomNav } from "@/components/mobile-bottom-nav";
import { Navbar } from "@/components/navbar";

type CheckoutSuccessPageProps = {
  searchParams: Record<string, string | string[] | undefined>;
};

export default function CheckoutSuccessPage({ searchParams }: CheckoutSuccessPageProps) {
  const orderId =
    (typeof searchParams.order_id === "string" && searchParams.order_id) ||
    (typeof searchParams.orderId === "string" && searchParams.orderId) ||
    null;
  const paymentId =
    (typeof searchParams.payment_id === "string" && searchParams.payment_id) ||
    (typeof searchParams.paymentId === "string" && searchParams.paymentId) ||
    null;

  return (
    <div className="min-h-screen bg-white text-neutral-900">
      <Navbar />

      <main className="mx-auto flex w-full max-w-3xl flex-col items-center px-4 py-16 text-center">
        <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
          Payment success
        </span>
        <h1 className="mt-4 text-3xl font-semibold text-neutral-900 sm:text-4xl">
          We&apos;re confirming your payment
        </h1>
        <p className="mt-3 text-sm text-neutral-600">
          PayHere redirected you back to us. We only create your order after PayHere sends the server-side notification. You&apos;ll get an email as soon as it&apos;s recorded.
        </p>

        <div className="mt-6 w-full max-w-lg rounded-2xl border border-neutral-200 bg-white p-6 text-left shadow-sm">
          <p className="text-sm font-semibold text-neutral-900">What happens next?</p>
          <ul className="mt-3 space-y-2 text-sm text-neutral-600">
            <li>• PayHere notifies our backend via notify_url.</li>
            <li>• We create your order and mark it as paid.</li>
            <li>• You&apos;ll see the order under your account once it&apos;s created.</li>
          </ul>

          {orderId || paymentId ? (
            <div className="mt-4 rounded-xl bg-neutral-50 px-4 py-3 text-sm text-neutral-700">
              {orderId ? (
                <p className="font-semibold text-neutral-900">Reference: {orderId}</p>
              ) : null}
              {paymentId ? <p>PayHere Payment ID: {paymentId}</p> : null}
            </div>
          ) : null}
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/account/orders"
            className="rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5"
          >
            View my orders
          </Link>
          <Link
            href="/shop"
            className="rounded-full border border-neutral-200 bg-white px-5 py-3 text-sm font-semibold text-neutral-800 transition hover:border-neutral-900"
          >
            Keep shopping
          </Link>
        </div>
      </main>

      <Footer />
      <MobileBottomNav />
    </div>
  );
}
