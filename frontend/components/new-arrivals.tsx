"use client";

import Link from "next/link";

import { products } from "@/data/products";

import { ProductCard } from "./product-card";

export function NewArrivals() {
  return (
    <section
      className="mt-10 space-y-6 px-4 sm:mt-12 lg:mt-16 lg:px-0"
      aria-label="New arrivals"
    >
      <header className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-slate-900 sm:text-2xl">
          New Arrivals
        </h2>
        <Link
          href="/#shop"
          className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-100 px-4 py-2 text-sm font-normal text-slate-600 transition hover:border-slate-300 hover:bg-slate-200"
        >
          View All
        </Link>
      </header>

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.sku} product={product} />
        ))}
      </div>
    </section>
  );
}
