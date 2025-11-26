import Image from "next/image";
import Link from "next/link";

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
};

export function HeroSection({
  eyebrow = "BeigeAura Collection 01",
  title = "Le Stylist",
  subtitle = "Old-money silhouettes, soft neutrals, and editorial polish.",
  ctaLabel = "Shop collection",
  ctaHref = "/#featured",
  secondaryLabel = "View lookbook",
  secondaryHref = "/#journal",
  imageSrc = "/images/hero-female.jpg",
  imageAlt = "Editorial black dress look",
}: HeroSectionProps) {
  return (
    <section className="relative w-full overflow-hidden bg-white min-h-screen">
      {/* Split backgrounds */}
      <div className="absolute inset-0 grid md:grid-cols-2">
        <div className="relative bg-[#f3d6d8]">
          <div
            className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-semibold uppercase tracking-[0.2em] text-text/70"
            style={{ writingMode: "vertical-rl" }}
          >
            BeigeAura — time to get dressed
          </div>
        </div>
        <div className="relative">
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-l from-black/35 via-black/15 to-transparent" />
          <div
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold uppercase tracking-[0.2em] text-white/80"
            style={{ writingMode: "vertical-rl" }}
          >
            Since 2024
          </div>
        </div>
      </div>

      {/* Center overlay content */}
      <div className="relative flex min-h-screen flex-col items-center justify-center gap-6 px-6 py-16 text-center text-white sm:px-10">
        <span className="text-xs uppercase tracking-[0.3em] text-white/80">
          {eyebrow}
        </span>
        <h1 className="text-4xl font-black leading-none tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
          {title}
        </h1>
        <div className="flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.2em] text-white/85">
          <span className="h-px w-10 bg-white/70" />
          {subtitle}
          <span className="h-px w-10 bg-white/70" />
        </div>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            href={ctaHref}
            className="inline-flex items-center justify-center bg-text px-6 py-3 text-sm font-semibold text-beige-light transition duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-text/10"
          >
            {ctaLabel}
          </Link>
          <Link
            href={secondaryHref}
            className="inline-flex items-center justify-center border border-white/60 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition duration-200 hover:-translate-y-0.5 hover:border-white/80"
          >
            {secondaryLabel}
          </Link>
        </div>
        <div className="mt-6 flex flex-col items-center gap-2 text-white/70">
          <div className="h-10 w-px bg-white/60" />
          <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/70 bg-white/15">
            <span className="text-lg">⌄</span>
          </div>
        </div>
      </div>
    </section>
  );
}
