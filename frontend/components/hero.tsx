"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

type Slide = {
  title: string;
  subtitle: string;
  features: string[];
  image: string;
  accent: string;
};

const slides: Slide[] = [
  {
    title: "Power your day with Corn gadgets",
    subtitle: "Built for everyday life",
    features: ["Phones & tablets", "Speakers & wearables", "Chargers & accessories"],
    image: "/hero/new-hro.png",
    accent: "#8c5bff",
  },
];

export function Hero() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 5500);
    return () => clearInterval(id);
  }, []);

  const active = useMemo(() => slides[index], [index]);

  const next = () => setIndex((prev) => (prev + 1) % slides.length);
  const prev = () => setIndex((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-r from-[#0a0c14] via-[#0a0f1f] to-[#0b1028] text-white shadow-2xl">
      <div className="relative h-[420px] w-full sm:h-[520px] lg:h-[620px]">
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 opacity-70"
            style={{
              background:
                "radial-gradient(circle at 20% 30%, rgba(124,92,255,0.24), transparent 40%), radial-gradient(circle at 80% 50%, rgba(47,128,237,0.18), transparent 45%)",
            }}
          />
          <div className="absolute right-10 top-1/2 -translate-y-1/2 h-72 w-72 blur-3xl opacity-60" style={{ background: `radial-gradient(circle at center, ${active.accent}55, transparent 60%)` }} />
        </div>

        <div className="relative flex h-full items-center">
          <div className="w-full px-6 py-8 sm:px-10 lg:px-14">
            <div className="max-w-xl space-y-4 transition duration-500" key={active.title}>
              <p className="text-xs font-semibold uppercase tracking-[0.4em] text-primary">
                {active.subtitle}
              </p>
              <h1 className="text-3xl font-bold uppercase leading-tight sm:text-4xl lg:text-5xl">
                {active.title}
              </h1>
              <div className="flex flex-wrap gap-3 text-sm text-slate-200 sm:text-base">
                {active.features.map((feature) => (
                  <span
                    key={feature}
                    className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide backdrop-blur-sm sm:text-sm"
                  >
                    {feature}
                  </span>
                ))}
              </div>
              <button className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-primary/90">
                Shop now
              </button>
            </div>
          </div>
        </div>

        <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 sm:right-10 lg:right-16">
          <div className="relative">
            <div
              className="absolute inset-[-12%] rounded-full opacity-60 blur-2xl"
              style={{
                background: `radial-gradient(circle at center, ${active.accent}55, transparent 65%)`,
                animation: "pulse-glow 4s ease-in-out infinite",
              }}
            />
            <Image
              key={active.image}
              src={active.image}
              alt={active.title}
              width={920}
              height={560}
              priority
              className="relative h-[320px] w-[520px] object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.45)] sm:h-[380px] sm:w-[640px] lg:h-[500px] lg:w-[820px]"
              style={{ animation: "float 6s ease-in-out infinite" }}
            />
          </div>
        </div>

        <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full bg-white/10 px-3 py-2 backdrop-blur">
          <button
            onClick={prev}
            className="h-8 w-8 rounded-full bg-white/10 text-white transition hover:bg-white/20"
            aria-label="Previous slide"
          >
            ‹
          </button>
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`h-2 w-6 rounded-full transition ${
                i === index ? "bg-white" : "bg-white/30"
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
          <button
            onClick={next}
            className="h-8 w-8 rounded-full bg-white/10 text-white transition hover:bg-white/20"
            aria-label="Next slide"
          >
            ›
          </button>
        </div>
      </div>
      <style jsx global>{`
        @keyframes float {
          0% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
          100% {
            transform: translateY(0);
          }
        }
        @keyframes pulse-glow {
          0% {
            opacity: 0.5;
            transform: scale(0.98);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.03);
          }
          100% {
            opacity: 0.5;
            transform: scale(0.98);
          }
        }
      `}</style>
    </section>
  );
}
