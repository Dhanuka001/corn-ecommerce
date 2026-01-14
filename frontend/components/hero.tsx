import Link from "next/link";

export function Hero() {
  const hero = {
    title: "Power your day with PhoneBazzar gadgets",
    subtitle: "Built for everyday life",
    features: ["Phones & tablets", "Speakers & wearables", "Chargers & accessories"],
    backgroundImage: "/corn-hero-image.webp",
  };

  return (
    <section className="relative w-full overflow-hidden text-white">
      <div className="relative h-auto w-full sm:h-[520px] lg:h-[620px]">
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 bg-center bg-cover"
            style={{ backgroundImage: `url(${hero.backgroundImage})` }}
          />
        </div>

        <div className="relative flex h-full">
          <div className="mx-auto flex w-full max-w-7xl flex-col justify-center px-4 py-8 sm:px-6 lg:px-2">
            <div className="max-w-xl space-y-4 text-left">
              <p className="text-xs font-semibold tracking-[0.4em] text-primary">
                {hero.subtitle}
              </p>
              <h1 className="text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
                {hero.title}
              </h1>
              <div className="flex flex-wrap gap-3 text-sm text-slate-200 sm:text-base">
                {hero.features.map((feature) => (
                  <span
                    key={feature}
                    className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold tracking-wide backdrop-blur-sm sm:text-sm"
                  >
                    {feature}
                  </span>
                ))}
              </div>
              <Link
                href="/shop"
                className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold tracking-wide text-white transition hover:bg-primary/90"
              >
                Shop now
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
