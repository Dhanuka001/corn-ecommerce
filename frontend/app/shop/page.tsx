import Link from "next/link";

import { CatalogProductCard } from "@/components/catalog-product-card";
import { Footer } from "@/components/footer";
import { MobileBottomNav } from "@/components/mobile-bottom-nav";
import { Navbar } from "@/components/navbar";
import { fetchProducts } from "@/lib/catalog-api";

const quickFilters = [
  "All gear",
  "Newest drops",
  "Audio",
  "Mobile accessories",
  "Smart gadgets",
  "Travel essentials",
];

export default async function ShopPage() {
  const products = await fetchProducts();
  const totalProducts = products.length;
  const averageRating = "4.8";

  return (
    <div className="min-h-screen bg-zinc-50">
      <Navbar />

      <main className="mx-auto w-full max-w-7xl px-4 py-10 lg:py-14">
        <section className="overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-6 py-10 sm:px-10 lg:px-14">
          <div className="grid gap-6 lg:grid-cols-[1.2fr,1fr] lg:items-center">
            <div className="space-y-4 text-white">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary">
                Shop
              </p>
              <h1 className="text-3xl font-semibold leading-tight sm:text-4xl">
                Corn gear showroom
              </h1>
              <p className="max-w-2xl text-base text-white/80 sm:text-lg">
                Live catalog pulled from the backend. Add to cart and favorites with synced cookies.
              </p>
              <div className="flex flex-wrap gap-3 pt-2 text-sm font-semibold">
                <Link
                  href="/#best-selling"
                  className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-white transition hover:bg-white/20"
                >
                  Jump to best sellers
                </Link>
                <Link
                  href="/#blog"
                  className="inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-white transition hover:border-white/50"
                >
                  Read Corn stories
                </Link>
              </div>
            </div>
            <div className="grid gap-4 rounded-2xl bg-white/5 p-5 text-white shadow-lg backdrop-blur">
              <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-4">
                <div>
                  <p className="text-sm text-white/70">Ready to ship</p>
                  <p className="text-2xl font-semibold">
                    {totalProducts} product{totalProducts === 1 ? "" : "s"}
                  </p>
                </div>
                <span className="rounded-full bg-primary/20 px-3 py-1 text-xs font-bold uppercase tracking-wide text-primary">
                  Beta
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                  <p className="text-white/60">Warranty</p>
                  <p className="text-lg font-semibold">3 years</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                  <p className="text-white/60">Avg. rating</p>
                  <p className="text-lg font-semibold">{averageRating} / 5</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-10 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-500">
                Curated grid
              </p>
              <h2 className="text-2xl font-semibold text-slate-900">
                Explore Corn catalog
              </h2>
              <p className="text-sm text-slate-600">
                Backend products rendered in the grid below.
              </p>
            </div>
            <button className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300">
              Sort: Featured
            </button>
          </div>

          <div className="flex flex-wrap gap-3">
            {quickFilters.map((filter) => (
              <span
                key={filter}
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm"
              >
                {filter}
              </span>
            ))}
          </div>

          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <CatalogProductCard key={`shop-${product.id}`} product={product} />
            ))}
          </div>
        </section>
      </main>

      <Footer />
      <MobileBottomNav />
    </div>
  );
}
