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

  const handleAddToCart = (productId: string) =>
    addItem({ productId, qty: 1 });

  return (
    <div className="min-h-screen bg-zinc-50">
      <Navbar />

      <div className="bg-neutral-900 px-4 py-3 text-center text-sm font-semibold tracking-tight text-white">
        Favorites sync to your account. Sign in to keep them across devices.
      </div>

      <main className="mx-auto w-full max-w-7xl px-4 pb-16 pt-10 lg:pt-12">
        <div className="flex flex-col gap-6 lg:flex-row">
          <section className="flex-1 space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div className="space-y-1">
                <p className="text-sm font-semibold uppercase tracking-[0.14em] text-primary">
                  Favorites
                </p>
                <h1 className="text-3xl font-semibold text-neutral-900">
                  Saved for later
                </h1>
                <p className="text-sm text-neutral-600">
                  Live data from the backend. Move items to your bag anytime.
                </p>
              </div>
              <span className="hidden rounded-full border border-neutral-200 px-4 py-2 text-sm font-semibold text-neutral-700 lg:inline-flex">
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
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((item) => {
                  const thumbnail = item.product.images?.[0];
                  return (
                    <article
                      key={item.id}
                      className="group flex flex-col gap-3 rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                    >
                      <div className="relative flex h-44 w-full items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-neutral-100 via-neutral-50 to-neutral-200">
                        {thumbnail?.url ? (
                          <Image
                            src={thumbnail.url}
                            alt={thumbnail.alt || item.product.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-xs font-semibold uppercase tracking-wide text-neutral-500">
                            No image
                          </div>
                        )}
                      </div>
                      <div className="flex-1 space-y-2">
                        <div className="flex items-start justify-between gap-3">
                          <div className="space-y-1">
                            <p className="text-sm font-semibold text-neutral-900">
                              {item.product.name}
                            </p>
                            <p className="text-xs text-neutral-500">
                              SKU: {item.product.sku}
                            </p>
                          </div>
                          <button
                            type="button"
                            className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary transition hover:bg-primary/15 disabled:opacity-50"
                            disabled={pending}
                            onClick={() => toggleFavorite(item.productId)}
                          >
                            Remove
                          </button>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-semibold text-neutral-900">
                            {formatCurrency(item.product.priceLKR)}
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                            <p className="text-xs font-semibold uppercase tracking-wide text-neutral-600">
                              In stock
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:gap-4">
                        <button
                          className="inline-flex items-center justify-center rounded-xl border border-neutral-200 px-3 py-2 text-sm font-semibold text-neutral-800 transition hover:border-neutral-900 hover:bg-neutral-50 disabled:opacity-50"
                          aria-label="Add to cart"
                          disabled={cartPending || pending}
                          onClick={() => handleAddToCart(item.productId)}
                        >
                          Add to cart
                        </button>
                        <Link
                          href={`/product/${item.product.slug}`}
                          className="inline-flex justify-center rounded-xl border border-primary bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:shadow-lg"
                        >
                          View product
                        </Link>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </section>

          <aside className="lg:w-80">
            <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-neutral-900">
                Keep shopping
              </h2>
              <p className="mt-1 text-sm text-neutral-600">
                Favorites stay saved while you browse.
              </p>
              <div className="mt-4 space-y-3">
                <Link
                  href="/"
                  className="flex w-full items-center justify-center rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-2 text-sm font-semibold text-neutral-800 transition hover:border-neutral-900 hover:bg-white"
                >
                  Back to home
                </Link>
                <Link
                  href="/cart"
                  className="flex w-full items-center justify-center rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-2 text-sm font-semibold text-neutral-800 transition hover:border-neutral-900 hover:bg-white"
                >
                  View cart
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </main>

      <Footer />
      <MobileBottomNav />
    </div>
  );
}
