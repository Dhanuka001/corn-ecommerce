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
  title = "Neutral silhouettes.",
  subtitle = "Old-money silhouettes, soft neutrals, and editorial polish.",
  ctaLabel = "Shop collection",
  ctaHref = "/#featured",
  secondaryLabel = "View lookbook",
  secondaryHref = "/#journal",
  imageSrc = "/images/hero-female-pin.jpg",
  imageAlt = "Premium editorial female look",
}: HeroSectionProps) {
  return (
    <section className="relative w-full overflow-hidden bg-white pt-24">
      <div className="absolute left-[-140px] top-[-80px] h-80 w-80 rounded-full bg-text/5 blur-3xl" />
      <div className="absolute right-[-160px] bottom-[-160px] h-[26rem] w-[26rem] rounded-full bg-text/5 blur-3xl" />

      <div className="relative mx-auto grid min-h-[70vh] max-w-6xl items-stretch gap-0 px-6 pb-12 md:grid-cols-2 md:px-8 lg:px-0">
        <div className="flex flex-col justify-center gap-6 py-10 md:py-16 md:pr-10">
          <div className="inline-flex items-center gap-3 rounded-full bg-text px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.26em] text-beige-light">
            <span>{eyebrow}</span>
            <span className="rounded-full bg-beige-light/30 px-2 py-1 text-[10px] text-white">
              Updated daily
            </span>
          </div>

          <h1 className="text-4xl font-black leading-tight tracking-tight text-text sm:text-5xl md:text-6xl">
            {title}
          </h1>
          <p className="max-w-xl text-base leading-relaxed text-text/80 sm:text-lg">{subtitle}</p>

          <div className="flex flex-wrap items-center gap-4">
            <Link
              href={ctaHref}
              className="inline-flex items-center justify-center bg-text px-7 py-3 text-sm font-semibold text-beige-light transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-text/10"
            >
              {ctaLabel}
            </Link>
            <Link
              href={secondaryHref}
              className="inline-flex items-center justify-center border border-text/15 px-7 py-3 text-sm font-semibold text-text/80 transition hover:-translate-y-0.5 hover:border-text/40 hover:text-text"
            >
              {secondaryLabel}
            </Link>
          </div>

          <div className="flex flex-wrap gap-6 text-sm text-text/70">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-text" />
              <span>Free delivery over $75</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-text" />
              <span>Free returns for 30 days</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-text" />
              <span>Student 10% off</span>
            </div>
          </div>
        </div>

        <div className="relative min-h-[320px] overflow-hidden md:min-h-[520px]">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `linear-gradient(0deg, rgba(0,0,0,0.2), rgba(0,0,0,0.05)), url(${imageSrc})`,
              backgroundSize: "cover",
              backgroundPosition: "center center",
              backgroundRepeat: "no-repeat",
            }}
            role="img"
            aria-label={imageAlt}
          >
            <div className="absolute bottom-5 left-5 flex flex-col gap-2 bg-white/85 px-4 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-text shadow-lg">
              <span>Up to 30% off</span>
              <span className="text-text/60">Dresses, co-ords & tailoring</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
