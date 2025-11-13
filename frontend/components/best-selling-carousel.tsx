"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { products } from "@/data/products";

const carouselProducts = [...products, ...products];

export function BestSellingCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    if (!scrollRef.current) {
      return;
    }

    let animationFrame: number;
    let lastTime = performance.now();

    const step = (time: number) => {
      if (!scrollRef.current || isHovering) {
        animationFrame = requestAnimationFrame(step);
        lastTime = time;
        return;
      }

      const delta = time - lastTime;
      lastTime = time;
      scrollRef.current.scrollLeft += (delta / 16) * 1.2;

      if (
        scrollRef.current.scrollLeft >=
        scrollRef.current.scrollWidth / 2
      ) {
        scrollRef.current.scrollLeft = 0;
      }

      animationFrame = requestAnimationFrame(step);
    };

    animationFrame = requestAnimationFrame(step);

    return () => cancelAnimationFrame(animationFrame);
  }, [isHovering]);

  return (
    <section className="px-4 lg:px-0" aria-label="Best selling">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
            Trending Now
          </p>
          <h2 className="text-2xl font-semibold text-slate-900">
            Best Selling
          </h2>
        </div>
        <div className="flex gap-2 text-xs uppercase tracking-wide text-slate-500">
          <span>Scroll</span>
          <div className="flex items-center gap-1 text-primary">
            <span>→</span>
            <span>→</span>
          </div>
        </div>
      </div>

      <div
        className="mt-6 overflow-hidden rounded-[32px] border border-slate-100 bg-white shadow-[0_15px_50px_rgba(15,23,42,0.08)]"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto scroll-smooth px-6 py-8"
          style={{ scrollBehavior: "smooth" }}
        >
          {carouselProducts.map((product, index) => (
            <article
              key={`${product.sku}-${index}`}
              className="min-w-[220px] flex-1 rounded-3xl border border-slate-100 bg-gradient-to-b from-white to-slate-50/70 p-5 shadow-sm"
            >
              <Link
                href={`/product/${product.slug}`}
                className="block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                <div className="flex items-center justify-between text-xs uppercase tracking-wide text-primary">
                  <span>#{(index % products.length) + 1}</span>
                  <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[11px] text-primary">
                    {product.stockStatus.replace("-", " ")}
                  </span>
                </div>
                <div className="relative mt-4 mb-5 flex h-32 items-center justify-center">
                  <Image
                    src="/logo.png"
                    alt={product.name}
                    width={100}
                    height={100}
                    className="h-20 w-20 object-contain opacity-80"
                  />
                </div>
                <div className="space-y-1 text-sm">
                  <p className="font-semibold text-slate-900">
                    {product.name}
                  </p>
                  <p className="text-slate-500">
                    Rs {product.price.toLocaleString()}
                  </p>
                </div>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
