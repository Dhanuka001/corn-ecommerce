 "use client";

import Image from "next/image";
import Link from "next/link";

export function Hero() {
  const hero = {
    title: "Power your day with PhoneBazzar gadgets",
    subtitle: "Built for everyday life",
    features: ["Phones & tablets", "Speakers & wearables", "Chargers & accessories"],
    image: "/hero/new-hro.png",
    accent: "#8c5bff",
  };

  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-r from-[#0a0c14] via-[#0a0f1f] to-[#0b1028] text-white">
      <div className="relative h-auto w-full sm:h-[520px] lg:h-[620px]">
        <div
          className="absolute inset-0 opacity-70"
          style={{
            background:
              "radial-gradient(circle at 20% 30%, rgba(124,92,255,0.24), transparent 40%), radial-gradient(circle at 80% 50%, rgba(47,128,237,0.18), transparent 45%)",
          }}
        />
        <div
          className="absolute right-10 top-1/2 h-72 w-72 -translate-y-1/2 blur-3xl opacity-60"
          style={{
            background: `radial-gradient(circle at center, ${hero.accent}55, transparent 60%)`,
          }}
        />

        <div className="relative flex h-full flex-col lg:flex-row lg:items-center lg:justify-center">
          <div className="w-full px-6 py-8 sm:px-10 lg:px-14">
            <div className="max-w-xl space-y-4 text-left">
              <p className="text-xs font-semibold uppercase tracking-[0.4em] text-primary">
                {hero.subtitle}
              </p>
              <h1 className="text-3xl font-bold uppercase leading-tight sm:text-4xl lg:text-5xl">
                {hero.title}
              </h1>
              <div className="flex flex-wrap gap-3 text-sm text-slate-200 sm:text-base">
                {hero.features.map((feature) => (
                  <span
                    key={feature}
                    className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide backdrop-blur-sm sm:text-sm"
                  >
                    {feature}
                  </span>
                ))}
              </div>
              <Link
                href="/shop"
                className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-primary/90"
              >
                Shop now
              </Link>
            </div>
          </div>

          <div className="mt-8 flex justify-center lg:mt-0 lg:absolute lg:top-1/2 lg:right-4 lg:-translate-y-1/2">
            <Image
              src={hero.image}
              alt={hero.title}
              width={920}
              height={560}
              priority
              className="h-[320px] w-[520px] object-contain sm:h-[380px] sm:w-[640px] lg:h-[500px] lg:w-[820px]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
