"use client";

import Image from "next/image";
import Link from "next/link";

import { Footer } from "@/components/footer";
import { MobileBottomNav } from "@/components/mobile-bottom-nav";
import { Navbar } from "@/components/navbar";
import { useAuth } from "@/context/auth-context";
import { useCart } from "@/context/cart-context";
import { useFavorites } from "@/context/favorites-context";

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency: "LKR",
  }).format(value);

export default function FavoritesPage() {
  const { user, openAuth } = useAuth();
  const { items, loading, pending, toggleFavorite } = useFavorites();
  const { addItem, pending: cartPending } = useCart();

  const handleAddToCart = (productId: string) => addItem({ productId, qty: 1 });

  return (
    <div className="min-h-screen bg-white text-neutral-900">
      <Navbar />

      <div className="bg-neutral-900 px-4 py-2.5 text-center text-xs font-semibold uppercase tracking-[0.12em] text-white">
        Favorites travel with you. Move to cart when you&apos;re ready.
      </div>

      <main className="mx-auto w-full max-w-5xl px-4 pb-24 pt-6 lg:max-w-6xl lg:pb-16">
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">
                Favorites
              </p>
              <h1 className="text-2xl font-semibold leading-tight">
                Saved for later
              </h1>
              <p className="text-xs text-neutral-500">
                Tap to bag. Ultra-compact like Nike & Amazon mobile favorites.
              </p>
            </div>
            <span className="hidden rounded-full border border-neutral-200 px-3 py-1 text-xs font-semibold text-neutral-700 lg:inline-flex">
              {items.length} item{items.length > 1 ? "s" : ""}
            </span>
          </div>

          {!user ? (
            <div className="flex flex-col items-center gap-4 rounded-2xl border border-neutral-200 bg-white p-8 text-center shadow-sm">
              <p className="text-lg font-semibold text-neutral-900">
                Sign in to view favorites
              </p>
              <p className="text-sm text-neutral-600">
                We’ll sync your saved items across devices after you log in.
              </p>
              <button
                className="rounded-full border border-neutral-200 bg-neutral-900 px-5 py-2 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:shadow-lg"
                onClick={() => openAuth("login")}
              >
                Sign in
              </button>
            </div>
          ) : loading ? (
            <div className="flex h-40 items-center justify-center rounded-2xl border border-dashed border-neutral-200 bg-white text-sm font-semibold text-neutral-600">
              Loading favorites…
            </div>
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center gap-4 rounded-2xl border border-neutral-200 bg-white p-8 text-center shadow-sm">
              <p className="text-lg font-semibold text-neutral-900">
                No favorites yet
              </p>
              <p className="text-sm text-neutral-600">
                Save items you like to compare and purchase later.
              </p>
              <Link
                href="/shop"
                className="rounded-full border border-neutral-200 bg-neutral-900 px-5 py-2 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:shadow-lg"
              >
                Explore products
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((item) => {
                const thumbnail = item.product.images?.[0];
                return (
                  <article
                    key={item.id}
                    className="group relative flex gap-3 rounded-2xl border border-neutral-200/80 bg-white p-3 shadow-[0_10px_28px_rgba(15,23,42,0.06)] transition hover:border-neutral-300 hover:shadow-[0_18px_40px_rgba(15,23,42,0.08)]"
                  >
                    <button
                      type="button"
                      aria-label="Remove"
                      className="absolute right-2 top-2 inline-flex h-8 w-8 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-400 transition hover:text-neutral-700 disabled:opacity-50"
                      disabled={pending}
                      onClick={() => toggleFavorite(item.productId)}
                    >
                      ×
                    </button>

                    <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-neutral-200 bg-gradient-to-br from-neutral-50 via-white to-neutral-100 shadow-inner">
                      {thumbnail?.url ? (
                        <Image
                          src={thumbnail.url}
                          alt={thumbnail.alt || item.product.name}
                          width={80}
                          height={80}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-neutral-200/70 text-xs font-semibold uppercase text-neutral-500">
                          Img
                        </div>
                      )}
                    </div>

                    <div className="min-w-0 flex-1 space-y-1">
                      <p className="truncate text-[15px] font-semibold leading-tight text-neutral-900">
                        {item.product.name}
                      </p>
                      <p className="text-sm font-semibold text-neutral-900">
                        {formatCurrency(item.product.priceLKR)}
                      </p>
                      <div className="inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-emerald-700">
                        <span className="h-2 w-2 rounded-full bg-emerald-500" />
                        In stock
                      </div>
                      <button
                        className="mt-1 inline-flex h-10 w-full items-center justify-center rounded-xl bg-neutral-900 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-50"
                        onClick={() => handleAddToCart(item.productId)}
                        disabled={cartPending || pending}
                      >
                        Add to Cart
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </main>

      <Footer />
      <MobileBottomNav />
    </div>
  );
}
