"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

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
  const [itemsPerView, setItemsPerView] = useState(2);
  const [startIndex, setStartIndex] = useState(0);

  useEffect(() => {
    const updateItems = () => {
      const width = window.innerWidth;
      if (width >= 1024) {
        setItemsPerView(5);
      } else if (width >= 640) {
        setItemsPerView(3);
      } else {
        setItemsPerView(2);
      }
    };

    updateItems();
    window.addEventListener("resize", updateItems);
    return () => window.removeEventListener("resize", updateItems);
  }, []);

  const maxIndex = useMemo(
    () => Math.max(categories.length - itemsPerView, 0),
    [itemsPerView],
  );

  useEffect(() => {
    setStartIndex((prev) => Math.min(prev, maxIndex));
  }, [maxIndex]);

  const handlePrev = () => {
    setStartIndex((prev) => Math.max(prev - 1, 0));
  };

  const handleNext = () => {
    setStartIndex((prev) => Math.min(prev + 1, maxIndex));
  };

  const itemWidth = useMemo(
    () => `${100 / itemsPerView}%`,
    [itemsPerView],
  );

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
            onClick={handlePrev}
            disabled={startIndex === 0}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:border-primary/40 hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ArrowIcon direction="left" />
          </button>
          <button
            type="button"
            aria-label="Next categories"
            onClick={handleNext}
            disabled={startIndex === maxIndex}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:border-primary/40 hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ArrowIcon direction="right" />
          </button>
        </div>
      </div>

      <div className="relative mt-8 overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{
            transform: `translateX(-${(startIndex * 100) / itemsPerView}%)`,
          }}
        >
          {categories.map((category) => (
            <article
              key={category}
              className="flex flex-col items-center gap-4 px-4 text-center"
              style={{ flex: `0 0 ${itemWidth}` }}
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
    </section>
  );
}
