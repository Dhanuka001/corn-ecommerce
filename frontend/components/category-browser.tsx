"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const categories = [
  "Chargers",
  "Cables",
  "Bluetooth Speakers",
  "Karaoke Speakers",
  "Smart Watches",
  "Mobile & Tablets",
  "Health & Sports",
  "Home Appliances",
  "Games & Videos",
  "Televisions",
];

const ArrowIcon = ({ direction }: { direction: "left" | "right" }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2.4}
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-4 w-4 text-slate-800"
    aria-hidden
  >
    {direction === "left" ? (
      <path d="M15 6 9 12l6 6" />
    ) : (
      <path d="m9 6 6 6-6 6" />
    )}
  </svg>
);

export function CategoryBrowser() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const updateScrollState = () => {
      setCanScrollLeft(container.scrollLeft > 0);
      setCanScrollRight(
        container.scrollLeft + container.clientWidth < container.scrollWidth - 1,
      );
    };

    updateScrollState();
    container.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", updateScrollState);

    return () => {
      container.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
    };
  }, []);

  const scrollByAmount = (direction: "left" | "right") => {
    const container = scrollRef.current;
    if (!container) return;
    const amount = container.clientWidth * 0.8;
    container.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  return (
    <section className="px-4 lg:px-0" aria-label="Browse by product category">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900 sm:text-2xl">
          Browse by Category
        </h2>
        <div className="flex gap-2">
          <button
            type="button"
            aria-label="Previous categories"
            onClick={() => scrollByAmount("left")}
            disabled={!canScrollLeft}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:border-primary/40 hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ArrowIcon direction="left" />
          </button>
          <button
            type="button"
            aria-label="Next categories"
            onClick={() => scrollByAmount("right")}
            disabled={!canScrollRight}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:border-primary/40 hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ArrowIcon direction="right" />
          </button>
        </div>
      </div>

      <div className="relative mt-8">
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto scroll-smooth pb-4 snap-x snap-mandatory [-ms-overflow-style:none] [scrollbar-width:none]"
        >
          {categories.map((category) => (
            <article
              key={category}
              className="flex w-1/2 flex-shrink-0 flex-col items-center gap-4 rounded-3xl px-4 py-2 text-center snap-start sm:w-1/3 lg:w-1/5"
            >
              <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-slate-100">
                <Image
                  src="/logo.png"
                  alt={`${category} icon`}
                  width={80}
                  height={80}
                  className="h-20 w-20 object-contain"
                  priority
                />
              </div>
              <p className="text-sm font-semibold text-slate-700">
                {category}
              </p>
            </article>
          ))}
        </div>
      </div>

      <hr className="mt-8 border-t border-slate-100" />
    </section>
  );
}
