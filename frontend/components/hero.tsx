"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const ArrowIcon = ({ size = 16 }: { size?: number }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    width={size}
    height={size}
    aria-hidden
  >
    <path d="M5 12h14" />
    <path d="m13 6 6 6-6 6" />
  </svg>
);

const sliderItems = [
  {
    title: "Apple Watch Ultra",
    cta: "Shop Now",
    image: "/s1.png",
  },
  {
    title: "Galaxy S24 Ultra 5G",
    cta: "Shop Now",
    image: "/s2.png",
  },
  {
    title: "Home Security Hub",
    cta: "Shop Now",
    image: "/s3.png",
  },
];

const promoCards = [
  {
    title: "Smart Security Home Camera",
    image: "/c1.png",
  },
  {
    title: "Galaxy S24 Ultra 5G",
    image: "/c2.png",
  },
];

export function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliderItems.length);
    }, 5000);

    return () => clearInterval(id);
  }, []);

  return (
    <section className="grid auto-rows-[240px] grid-cols-1 gap-4 px-4 lg:auto-rows-[260px] lg:grid-cols-4 lg:gap-6 lg:px-0">
      <div className="relative h-full overflow-hidden rounded-2xl shadow-lg lg:col-span-3 lg:row-span-2 lg:min-h-[520px] lg:rounded-[32px] lg:shadow-none">
        {sliderItems.map((item, index) => {
          const isActive = index === currentSlide;

          return (
            <article
              key={item.title}
              className={`absolute inset-0 flex h-full items-end transition-all duration-700 ${
                isActive
                  ? "translate-y-0 opacity-100"
                  : "translate-y-6 opacity-0"
              }`}
              aria-hidden={!isActive}
            >
              <Image
                src={item.image}
                alt={item.title}
                fill
                priority={index === 0}
                sizes="(min-width: 1024px) 75vw, 100vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />
              <div className="relative w-full px-6 pb-6 lg:px-10 lg:pb-10">
                <button className="rounded-full bg-primary px-7  mb-6 py-3 text-sm font-semibold uppercase tracking-wide text-white transition-colors hover:bg-red-600">
                  {item.cta}
                </button>
              </div>
            </article>
          );
        })}

        <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 items-center gap-2 lg:bottom-8 lg:left-10 lg:translate-x-0">
          {sliderItems.map((_, index) => {
            const isActive = index === currentSlide;

            return (
              <span
                key={index}
                className={`h-2 w-7 rounded-full transition-colors ${
                  isActive ? "bg-white" : "bg-white/30"
                }`}
              />
            );
          })}
        </div>
      </div>

      {promoCards.map((card) => (
        <article
          key={card.title}
          className="relative h-full overflow-hidden rounded-2xl shadow-md lg:col-span-1 lg:row-span-1 lg:rounded-3xl lg:shadow-xl lg:ring-1 lg:ring-white/20 lg:backdrop-blur"
        >
          <Image
            src={card.image}
            alt={card.title}
            fill
            sizes="(min-width: 1024px) 25vw, 50vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
          <button className="absolute bottom-4 left-4 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-white transition hover:text-primary lg:bottom-6 lg:left-6">
            Shop later
            <ArrowIcon />
          </button>
        </article>
      ))}
    </section>
  );
}
