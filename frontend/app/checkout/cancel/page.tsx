"use client";

import Link from "next/link";

import { Footer } from "@/components/footer";
import { MobileBottomNav } from "@/components/mobile-bottom-nav";
import { Navbar } from "@/components/navbar";

export default function CheckoutCancelPage() {
  return (
    <div className="min-h-screen bg-white text-neutral-900">
      <Navbar />

      <main className="mx-auto flex w-full max-w-3xl flex-col items-center px-4 py-16 text-center">
        <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-orange-700">
          Payment cancelled
        </span>
        <h1 className="mt-4 text-3xl font-semibold text-neutral-900 sm:text-4xl">
          Payment wasn&apos;t completed
        </h1>
        <p className="mt-3 text-sm text-neutral-600">
          No order was created because the payment was cancelled. You can retry checkout or contact support if you ran into issues.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/checkout"
            className="rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5"
          >
            Try again
          </Link>
          <Link
            href="/cart"
            className="rounded-full border border-neutral-200 bg-white px-5 py-3 text-sm font-semibold text-neutral-800 transition hover:border-neutral-900"
          >
            Back to cart
          </Link>
        </div>
      </main>

      <Footer />
      <MobileBottomNav />
    </div>
  );
}
