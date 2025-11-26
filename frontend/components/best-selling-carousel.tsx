"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { CatalogProductCard } from "./catalog-product-card";
import { fetchProducts } from "@/lib/catalog-api";
import type { ProductSummary } from "@/types/catalog";

export function BestSellingCarousel() {
  const [items, setItems] = useState<ProductSummary[]>([]);

  useEffect(() => {
    const load = async () => {
      const { data } = await fetchProducts({ sort: "newest", limit: 12 });
      setItems(data.slice(0, 4));
    };
    void load();
  }, []);

  return (
    <section
      id="best-selling"
      className="px-4 lg:px-0"
      aria-label="Best selling"
    >
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
            Trending Now
          </p>
          <h2 className="text-2xl font-semibold text-slate-900">
            Best Selling
          </h2>
        </div>
        <Link
          href="/shop"
          className="rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-slate-600"
        >
          View All
        </Link>
      </div>

      <div className="mt-6 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {items.map((product) => (
          <CatalogProductCard key={`best-${product.id}`} product={product} />
        ))}
      </div>
    </section>
  );
}
