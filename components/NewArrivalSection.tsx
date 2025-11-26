import Image from "next/image";
import Link from "next/link";

type NewArrivalSectionProps = {
  badge?: string;
  title?: string;
  subtitle?: string;
  ctaLabel?: string;
  ctaHref?: string;
  imageSrc?: string;
  imageAlt?: string;
};

export function NewArrivalSection({
  badge = "01",
  title = "New arrival",
  subtitle = "Discover the latest capsule in warm, grounded neutrals.",
  ctaLabel = "Shop now",
  ctaHref = "#featured",
  imageSrc = "/images/new-arrival-real.jpg",
  imageAlt = "New arrival look",
}: NewArrivalSectionProps) {
  return (
    <section className="overflow-hidden rounded-3xl border border-beige-dark/40 bg-white shadow-[0_30px_80px_-65px_rgba(26,26,26,0.45)]">
      <div className="grid gap-10 px-6 py-10 md:grid-cols-[1.1fr_1fr] md:px-10 md:py-12">
        <div className="flex flex-col justify-center gap-5">
          <span className="text-5xl font-semibold tracking-tight text-text">{badge}</span>
          <div className="space-y-3">
            <h2 className="text-3xl font-semibold tracking-tight text-text sm:text-4xl">
              {title}
            </h2>
            <p className="text-base leading-relaxed text-text/75 sm:text-lg">{subtitle}</p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href={ctaHref}
              className="inline-flex items-center justify-center rounded-full bg-text px-5 py-3 text-sm font-semibold text-beige-light transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-text/10"
            >
              {ctaLabel}
            </Link>
            <Link
              href="#lookbook"
              className="inline-flex items-center justify-center text-sm font-semibold text-text/70 underline decoration-text/30 underline-offset-4 transition hover:text-text hover:decoration-text/60"
            >
              Lookbook
            </Link>
          </div>
        </div>

        <div className="relative">
          <div className="absolute inset-6 rounded-3xl bg-beige-light" />
          <div className="relative flex items-center justify-center overflow-hidden rounded-2xl border border-text/10 bg-white">
            <div className="absolute h-64 w-64 rounded-full bg-text/5" />
            <Image
              src={imageSrc}
              alt={imageAlt}
              width={1200}
              height={1400}
              className="relative h-full w-full max-h-[540px] object-contain"
              priority
            />
            <div className="absolute right-4 top-4 text-xs font-semibold uppercase tracking-[0.16em] text-text/60">
              01 / 03
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
