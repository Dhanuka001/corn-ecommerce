import Image from "next/image";
import Link from "next/link";

type HeroStat = {
  label: string;
  value: string;
};

type HeroSectionProps = {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  ctaLabel?: string;
  ctaHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
  imageSrc?: string;
  imageAlt?: string;
  stats?: HeroStat[];
};

const defaultStats: HeroStat[] = [
  { label: "New drop", value: "08 looks" },
  { label: "Palette", value: "Warm neutrals" },
  { label: "Dispatch", value: "48h" },
];

export function HeroSection({
  eyebrow = "BeigeAura Studio",
  title = "Sculpted silhouettes in grounded neutrals.",
  subtitle = "ZARA-like edge with MUJI calm—clean lines, draped layers, and tactile fabrics built for luminous days.",
  ctaLabel = "Shop collection",
  ctaHref = "/#featured",
  secondaryLabel = "View lookbook",
  secondaryHref = "/#journal",
  imageSrc = "/images/hero-luxury.svg",
  imageAlt = "Luxury lifestyle in beige tones",
  stats = defaultStats,
}: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-beige-dark/40 bg-white shadow-[0_35px_90px_-70px_rgba(26,26,26,0.5)]">
      <div className="absolute inset-0 bg-gradient-to-br from-beige-light via-white to-beige" />
      <div className="relative grid gap-10 px-8 py-10 md:grid-cols-[1.05fr_1fr] md:px-12 md:py-12">
        <div className="flex flex-col gap-6">
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-text/15 bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-text/70 backdrop-blur">
            {eyebrow}
          </span>

          <div className="space-y-4">
            <h1 className="text-3xl font-semibold leading-tight tracking-tight text-text sm:text-4xl">
              {title}
            </h1>
            <p className="max-w-2xl text-base leading-relaxed text-text/75 sm:text-lg">
              {subtitle}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href={ctaHref}
              className="inline-flex items-center justify-center rounded-full bg-text px-5 py-3 text-sm font-semibold text-beige-light transition duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-text/10"
            >
              {ctaLabel}
            </Link>
            <Link
              href={secondaryHref}
              className="inline-flex items-center justify-center rounded-full border border-text/20 px-5 py-3 text-sm font-semibold text-text transition duration-200 hover:-translate-y-0.5 hover:border-text/40"
            >
              {secondaryLabel}
            </Link>
          </div>

          <div className="grid gap-4 rounded-2xl border border-text/10 bg-white/60 p-4 text-sm text-text/80 sm:grid-cols-3">
            {stats.map((stat) => (
              <div key={stat.label} className="space-y-1">
                <p className="text-xs uppercase tracking-[0.16em] text-text/60">
                  {stat.label}
                </p>
                <p className="text-base font-semibold text-text">{stat.value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full bg-text/5 blur-3xl" />
          <div className="absolute -left-10 bottom-6 h-32 w-32 rounded-full bg-beige-dark/15 blur-2xl" />
          <div className="relative overflow-hidden rounded-2xl border border-text/10 bg-beige/70 shadow-lg">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-beige/15 to-beige/25" />
            <Image
              src={imageSrc}
              alt={imageAlt}
              width={1200}
              height={1500}
              className="h-full w-full object-cover"
              priority
            />
            <div className="absolute left-4 top-4 rounded-full bg-white/80 px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-text">
              Collection 01
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
