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
  className?: string;
};

export function NewArrivalSection({
  badge = "01",
  title = "New arrival",
  subtitle = "Discover the latest capsule in warm, grounded neutrals.",
  ctaLabel = "Shop now",
  ctaHref = "#featured",
  imageSrc = "https://i.pinimg.com/736x/56/f9/71/56f971f986719bacb99be935ab3a44dd.jpg",
  imageAlt = "New arrival look",
  className = "",
}: NewArrivalSectionProps) {
  return (
    <section
      className={`relative isolate min-h-[70vh] w-full overflow-hidden bg-gradient-to-r from-beige via-beige-light to-white ${className}`}
    >
      <div className="absolute left-[-120px] top-[-80px] h-80 w-80 rounded-full bg-text/5 blur-3xl" />
      <div className="absolute right-[-120px] bottom-[-80px] h-80 w-80 rounded-full bg-white/40 blur-3xl" />

      <div className="relative mx-auto max-w-6xl px-6 py-16 md:px-10 md:py-20">
        <div className="grid items-center gap-10 md:grid-cols-[1fr_0.95fr]">
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-4">
              <span className="rounded-full bg-text px-4 py-2 text-xs font-semibold uppercase tracking-[0.26em] text-beige-light">
                {badge}
              </span>
              <span className="text-sm uppercase tracking-[0.24em] text-text/60">
                Capsule drop
              </span>
            </div>

            <div className="space-y-4">
              <div className="h-px w-12 bg-text/30" />
              <h2 className="text-3xl font-semibold tracking-tight text-text sm:text-4xl">
                {title}
              </h2>
              <p className="text-base leading-relaxed text-text/80 sm:text-lg">{subtitle}</p>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <Link
                href={ctaHref}
                className="inline-flex items-center justify-center rounded-full bg-text px-6 py-3 text-sm font-semibold text-beige-light transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-text/10"
              >
                {ctaLabel}
              </Link>
              <Link
                href="#lookbook"
                className="inline-flex items-center justify-center text-sm font-semibold text-text/75 underline decoration-2 decoration-text/30 underline-offset-6 transition hover:text-text hover:decoration-text/60"
              >
                Lookbook
              </Link>
            </div>
          </div>

          <div className="relative h-full min-h-[420px] overflow-hidden bg-text/5 shadow-[inset_0_0_0_1px_rgba(26,26,26,0.05)] md:ml-auto md:max-w-xl">
            <Image
              src={imageSrc}
              alt={imageAlt}
              width={1200}
              height={1400}
              className="h-full w-full object-cover"
              priority
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-text/20 via-transparent to-transparent" />
            <div className="absolute right-5 top-5 text-xs font-semibold uppercase tracking-[0.16em] text-text/70">
              01 / 03
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
