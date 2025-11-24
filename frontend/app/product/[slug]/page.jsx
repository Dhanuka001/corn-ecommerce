"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

const mockProducts = {
  "cornbeam-pro": {
    slug: "cornbeam-pro",
    name: "CornBeam Pro ANC Headphones",
    price: 259990,
    oldPrice: 299990,
    shortDescription:
      "Flagship hybrid ANC with ultra-low latency and studio-grade drivers tuned for Corn Electronics.",
    rating: 4.8,
    reviews: 1824,
    stockStatus: "In Stock",
    badge: "Flagship",
    sku: "CE-HDP-9932",
    hero: "/images/hero-headphones.jpg",
    gallery: [
      "/images/hero-headphones.jpg",
      "/images/hero-headphones-2.jpg",
      "/images/hero-headphones-3.jpg",
    ],
    highlights: [
      "Hybrid ANC + Transparency",
      "40h endurance + WarpCharge",
      "LDAC / Spatial audio ready",
      "Featherweight magnesium build",
    ],
    specs: [
      ["Driver", "45mm bio-cellulose"],
      ["Codec", "LDAC / AAC / SBC"],
      ["Battery", "40h ANC on / 60h off"],
      ["Charge", "USB-C WarpCharge 10min → 8h"],
      ["Weight", "262g"],
      ["Warranty", "24 months CornCare"],
    ],
    related: [
      {
        slug: "corncharge-120w",
        name: "CornCharge GaN 120W",
        price: 11999,
        image: "/images/charger.jpg",
      },
      {
        slug: "corngrab-pack",
        name: "CornGuard Tech Backpack",
        price: 14999,
        image: "/images/backpack.jpg",
      },
      {
        slug: "cornbuds-max",
        name: "CornPulse TWS Max",
        price: 8999,
        image: "/images/earbuds.jpg",
      },
    ],
  },
};

const currency = new Intl.NumberFormat("en-LK", {
  style: "currency",
  currency: "LKR",
  maximumFractionDigits: 0,
});

export default function ProductPage({ params }) {
  const product = useMemo(
    () => mockProducts[params.slug] ?? mockProducts["cornbeam-pro"],
    [params.slug],
  );
  const [activeImage, setActiveImage] = useState(0);
  const [qty, setQty] = useState(1);

  const price = currency.format(product.price);
  const oldPrice = product.oldPrice ? currency.format(product.oldPrice) : null;

  const changeImage = (step) => {
    setActiveImage((prev) => (prev + step + product.gallery.length) % product.gallery.length);
  };

  return (
    <div className="min-h-screen bg-white text-neutral-900">
      <div className="mx-auto w-full max-w-6xl px-4 pb-32 pt-10 lg:pb-20">
        {/* Hero heading */}
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-semibold leading-tight sm:text-4xl">
              Buy {product.name}
            </h1>
            <p className="text-base text-neutral-600">
              From {price} or {currency.format(Math.round(product.price / 12))}/mo. for 12 mo.*
            </p>
            <div className="mt-2 inline-flex items-center gap-2 rounded-full bg-neutral-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-primary">
              Corn Electronics
            </div>
          </div>
          <div className="hidden items-center gap-3 lg:flex">
            <button className="rounded-full border border-neutral-200 px-4 py-2 text-sm font-semibold text-neutral-700 hover:border-neutral-900">
              Trade-in estimate
            </button>
            <button className="rounded-full border border-neutral-200 px-4 py-2 text-sm font-semibold text-neutral-700 hover:border-neutral-900">
              3% Corn Cash back
            </button>
          </div>
        </div>

        {/* Main layout */}
        <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
          {/* Gallery + details */}
          <div className="space-y-8">
            <div className="relative overflow-hidden rounded-[32px] bg-neutral-50">
              <div className="relative">
                <Image
                  src={product.gallery[activeImage]}
                  alt={product.name}
                  width={1200}
                  height={1200}
                  className="h-[360px] w-full object-cover sm:h-[480px] lg:h-[540px]"
                  priority
                />
                <div className="absolute inset-0 hidden items-center justify-between px-4 lg:flex">
                  <button
                    type="button"
                    onClick={() => changeImage(-1)}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-neutral-800 shadow transition hover:bg-white"
                    aria-label="Previous image"
                  >
                    ‹
                  </button>
                  <button
                    type="button"
                    onClick={() => changeImage(1)}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-neutral-800 shadow transition hover:bg-white"
                    aria-label="Next image"
                  >
                    ›
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-center gap-2 py-4">
                {product.gallery.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImage(idx)}
                    className={`h-2.5 w-2.5 rounded-full transition ${
                      activeImage === idx ? "bg-primary" : "bg-neutral-300"
                    }`}
                    aria-label={`View image ${idx + 1}`}
                  />
                ))}
              </div>
            </div>

            {/* Highlights */}
            <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-[0_24px_60px_rgba(15,23,42,0.08)]">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
                    Key features
                  </p>
                  <h2 className="text-xl font-semibold text-neutral-900">Why you’ll love it</h2>
                </div>
                <div className="flex items-center gap-2 rounded-full bg-neutral-100 px-3 py-1 text-xs font-semibold text-neutral-700">
                  ★ {product.rating.toFixed(1)}
                  <span className="text-neutral-400">·</span>
                  {product.reviews.toLocaleString()} reviews
                </div>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {product.highlights.map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-700"
                  >
                    <span className="h-2 w-2 rounded-full bg-primary" aria-hidden />
                    {item}
                  </div>
                ))}
              </div>
            </div>

            {/* Specs */}
            <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-[0_24px_60px_rgba(15,23,42,0.08)]">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-neutral-900">Specifications</h3>
                <span className="text-xs uppercase tracking-[0.14em] text-neutral-400">Tech</span>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {product.specs.map(([label, value]) => (
                  <div
                    key={label}
                    className="flex items-center justify-between rounded-2xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm"
                  >
                    <span className="text-neutral-500">{label}</span>
                    <span className="text-neutral-900">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Related */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-neutral-900">You may also like</h3>
                <span className="text-xs uppercase tracking-[0.14em] text-neutral-400">Corn picks</span>
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {product.related.map((item) => (
                  <Link
                    key={item.slug}
                    href={`/product/${item.slug}`}
                    className="group flex items-center gap-3 rounded-2xl border border-neutral-200 bg-white p-3 shadow-[0_16px_40px_rgba(15,23,42,0.08)] transition hover:border-primary/40 hover:shadow-[0_18px_44px_rgba(79,70,229,0.12)]"
                  >
                    <div className="h-16 w-16 overflow-hidden rounded-xl border border-neutral-200 bg-neutral-50">
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={120}
                        height={120}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-neutral-900">{item.name}</p>
                      <p className="text-xs text-neutral-500">{currency.format(item.price)}</p>
                    </div>
                    <span className="text-primary transition group-hover:translate-x-1">→</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Buy box */}
          <aside className="lg:sticky lg:top-16">
            <div className="rounded-[32px] border border-neutral-200 bg-white p-6 shadow-[0_30px_70px_rgba(15,23,42,0.12)]">
              <p className="text-sm font-semibold text-primary">Model</p>
              <h2 className="text-2xl font-semibold text-neutral-900">Choose your build</h2>

              <div className="mt-4 space-y-3">
                <button className="flex w-full items-center justify-between rounded-2xl border border-neutral-300 bg-white px-4 py-3 text-left text-sm font-semibold text-neutral-900 transition hover:border-neutral-900">
                  Standard build
                  <span className="text-neutral-500">{price}</span>
                </button>
                {oldPrice ? (
                  <button className="flex w-full items-center justify-between rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-left text-sm font-semibold text-neutral-800 transition hover:border-neutral-900">
                    Promo build
                    <span className="text-neutral-500 line-through">{oldPrice}</span>
                  </button>
                ) : null}
              </div>

              <div className="mt-5 flex items-center justify-between rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3">
                <div>
                  <p className="text-sm font-semibold text-neutral-900">{price}</p>
                  <p className="text-xs text-neutral-500">{product.stockStatus}</p>
                </div>
                <div className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-2 py-1 text-sm font-semibold text-neutral-900">
                  <button
                    type="button"
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-50 text-lg transition hover:bg-neutral-100"
                    onClick={() => setQty((prev) => Math.max(1, prev - 1))}
                  >
                    &minus;
                  </button>
                  <span className="w-8 text-center">{qty}</span>
                  <button
                    type="button"
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-50 text-lg transition hover:bg-neutral-100"
                    onClick={() => setQty((prev) => prev + 1)}
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="mt-4 space-y-3">
                <button className="flex h-12 w-full items-center justify-center rounded-xl bg-primary text-sm font-semibold text-white transition hover:-translate-y-[2px] hover:shadow-[0_18px_40px_rgba(79,70,229,0.18)]">
                  Add to Cart
                </button>
                <button className="flex h-12 w-full items-center justify-center rounded-xl border border-neutral-200 bg-white text-sm font-semibold text-neutral-900 transition hover:border-neutral-900">
                  Buy with PayNow
                </button>
                <p className="text-xs text-neutral-500">
                  Free shipping & returns. 24-month CornCare warranty.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Sticky mobile bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-neutral-200 bg-white/95 px-4 pb-[calc(env(safe-area-inset-bottom)+0.8rem)] pt-3 backdrop-blur lg:hidden shadow-[0_-12px_30px_rgba(15,23,42,0.08)]">
        <div className="mx-auto flex max-w-3xl items-center gap-3">
          <div className="flex-1">
            <p className="text-sm font-semibold text-neutral-900">{product.name}</p>
            <p className="text-xs text-primary">{price}</p>
          </div>
          <button className="inline-flex h-11 min-w-[140px] items-center justify-center rounded-xl bg-primary px-4 text-sm font-semibold text-white shadow-[0_20px_40px_rgba(79,70,229,0.18)]">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
