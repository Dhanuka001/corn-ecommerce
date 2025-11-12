import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import {
  type Product,
  getProductBySlug,
  products,
} from "@/data/products";

type ProductPageProps = {
  params: { slug: string };
};

const currencyFormatter = new Intl.NumberFormat("en-LK", {
  style: "currency",
  currency: "LKR",
  maximumFractionDigits: 0,
});

const availabilityMap: Record<Product["stockStatus"], string> = {
  ["in-stock"]: "https://schema.org/InStock",
  preorder: "https://schema.org/PreOrder",
  limited: "https://schema.org/LimitedAvailability",
};

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://corn.example";

export function generateStaticParams() {
  return products.map(({ slug }) => ({ slug }));
}

export function generateMetadata({
  params,
}: ProductPageProps): Metadata {
  const product = getProductBySlug(params.slug);

  if (!product) {
    return {
      title: "Product not found • Corn Ecommerce",
      description:
        "Browse the newest drops and exclusives from Corn Ecommerce.",
    };
  }

  const title = `${product.name} • Corn Ecommerce`;

  return {
    title,
    description: product.description,
    openGraph: {
      type: "product",
      title,
      description: product.description,
      images: product.gallery.map((src) => ({
        url: src,
      })),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: product.description,
      images: [product.gallery[0]],
    },
  };
}

export default function ProductPage({ params }: ProductPageProps) {
  const product = getProductBySlug(params.slug);

  if (!product) {
    notFound();
  }

  const formattedPrice = currencyFormatter.format(product.price);
  const formattedOldPrice = product.oldPrice
    ? currencyFormatter.format(product.oldPrice)
    : null;
  const instalmentPrice = currencyFormatter.format(
    Math.round(product.price / 3),
  );

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    sku: product.sku,
    brand: {
      "@type": "Brand",
      name: "Corn Electronics",
    },
    image: product.gallery,
    releaseDate: product.release,
    offers: {
      "@type": "Offer",
      priceCurrency: "LKR",
      price: product.price,
      availability: availabilityMap[product.stockStatus],
      url: `${siteUrl}/product/${product.slug}`,
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: product.rating.toFixed(1),
      reviewCount: product.reviews,
    },
  };

  return (
    <div className="bg-gradient-to-b from-white via-white to-slate-50">
      <div className="mx-auto w-full max-w-6xl px-4 py-10 lg:px-0 lg:py-14">
        <nav
          aria-label="Breadcrumb"
          className="flex flex-wrap items-center gap-2 text-sm text-slate-500"
        >
          <Link href="/" className="transition hover:text-primary">
            Home
          </Link>
          <span aria-hidden>/</span>
          <Link href="/#shop" className="transition hover:text-primary">
            Shop
          </Link>
          <span aria-hidden>/</span>
          <span className="text-slate-900">{product.name}</span>
        </nav>

        <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,520px)_minmax(0,1fr)]">
          <section className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row">
              <div className="hidden w-20 flex-col gap-3 sm:flex">
                {product.gallery.map((image, index) => (
                  <div
                    key={image}
                    className={`overflow-hidden rounded-2xl border bg-white shadow-sm ${
                      index === 0 ? "border-primary" : "border-slate-200"
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`${product.name} gallery ${index + 1}`}
                      width={160}
                      height={160}
                      className="h-24 w-full object-cover"
                    />
                  </div>
                ))}
              </div>
              <div className="relative flex-1 overflow-hidden rounded-[36px] bg-white p-6 shadow-xl ring-1 ring-slate-100">
                <Image
                  src={product.heroImage}
                  alt={product.name}
                  width={900}
                  height={900}
                  className="h-[420px] w-full rounded-3xl object-cover lg:h-[520px]"
                  priority
                />
                <div className="absolute left-6 top-6 inline-flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-slate-900 shadow">
                  {product.badge ?? "Corn Drop"}
                  <span className="rounded-full bg-primary/10 px-2 py-0.5 text-primary">
                    {product.stockStatus.replace("-", " ")}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <InfoCard
                title="Fast dispatch"
                description={product.shippingEstimate}
                icon="truck"
              />
              <InfoCard
                title="Warranty & care"
                description={product.warranty}
                icon="shield"
              />
            </div>
          </section>

          <section className="flex flex-col gap-6 rounded-[40px] border border-slate-100 bg-[#e9f0ff] p-8 shadow-[0_20px_60px_rgba(15,23,42,0.1)]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">
                  Corn Electronics
                </p>
                <h1 className="text-3xl font-semibold text-slate-900 lg:text-4xl">
                  {product.name}
                </h1>
                <p className="mt-2 text-sm text-slate-600">
                  {product.description}
                </p>
              </div>
              <div className="flex items-center gap-3 text-slate-500">
                <button
                  type="button"
                  className="rounded-full border border-slate-300 p-2 text-xs uppercase tracking-wider"
                  aria-label="Previous product"
                >
                  ←
                </button>
                <button
                  type="button"
                  className="rounded-full border border-slate-300 p-2 text-xs uppercase tracking-wider"
                  aria-label="Next product"
                >
                  →
                </button>
              </div>
            </div>

            <div className="flex flex-wrap items-end gap-4">
              <div>
                <p className="text-sm uppercase tracking-wide text-slate-500">
                  Corn launch price
                </p>
                <p className="text-4xl font-semibold text-primary">
                  {formattedPrice}
                </p>
              </div>
              {formattedOldPrice ? (
                <p className="text-sm text-slate-400 line-through">
                  {formattedOldPrice}
                </p>
              ) : null}
              <span className="rounded-full bg-white/70 px-3 py-1 text-xs font-semibold text-slate-700">
                Tax inclusive
              </span>
            </div>
            <p className="text-sm text-slate-600">
              or 3 × {instalmentPrice} with{" "}
              <span className="font-semibold text-primary">
                Corn Pay
              </span>
            </p>

            <ul className="space-y-2 text-sm text-slate-700">
              {product.highlights.map((highlight) => (
                <li key={highlight} className="flex items-start gap-2">
                  <span className="mt-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-white text-primary">
                    ✓
                  </span>
                  {highlight}
                </li>
              ))}
            </ul>

            <div className="rounded-3xl bg-white/80 p-4 text-sm text-slate-700">
              <p className="font-semibold text-slate-900">
                For more information
              </p>
              <p>Stephan: +94 77 660 1146</p>
              <p>care@corn.lk</p>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-sm">
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-emerald-700">
                <span className="text-lg">✔</span>
                {product.stockStatus === "preorder"
                  ? "Pre-order window open"
                  : product.stockStatus === "limited"
                    ? "Limited stock"
                    : "In stock"}
              </span>
              <span className="text-slate-500">
                {product.reviews.toLocaleString()} verified reviews
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <div className="inline-flex items-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700">
                <button
                  type="button"
                  className="px-2 text-xl text-slate-400"
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <span className="px-4 text-base text-slate-900">1</span>
                <button
                  type="button"
                  className="px-2 text-xl text-slate-400"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
              <button
                type="button"
                className="flex-1 rounded-full bg-primary px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-red-600"
              >
                Add to cart
              </button>
            </div>

            <button
              type="button"
              className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 transition hover:text-primary"
            >
              ♡ Add to wishlist
            </button>

            <div className="space-y-2 text-sm text-slate-600">
              <div className="flex justify-between">
                <span className="font-semibold text-slate-900">SKU</span>
                <span>{product.sku}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-slate-900">
                  Release
                </span>
                <span>{product.release}</span>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-semibold text-slate-900">
                  Share
                </span>
                {["f", "x", "in", "↗"].map((item) => (
                  <button
                    key={item}
                    type="button"
                    className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-300 text-xs uppercase text-slate-600 transition hover:border-primary/40 hover:text-primary"
                    aria-label={`Share on ${item}`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          </section>
        </div>

        <section className="mt-16 rounded-[36px] bg-white p-8 shadow-[0_15px_50px_rgba(15,23,42,0.08)]">
          <div className="flex items-center gap-6">
            <div className="h-px flex-1 bg-slate-200" />
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
              Description
            </p>
            <div className="h-px flex-1 bg-slate-200" />
          </div>
          <div className="mt-8 grid gap-10 lg:grid-cols-2">
            <div className="space-y-4 text-sm text-slate-700">
              <p>
                {product.description} Built at the Corn design lab,
                this drop is tuned for makers who need gear that
                feels premium yet ultra reliable in Colombo humidity.
              </p>
              {product.highlights.slice(0, 3).map((highlight) => (
                <p key={highlight}>
                  <span className="font-semibold text-slate-900">
                    {highlight.split(" ")[0]}{" "}
                  </span>
                  {highlight}
                </p>
              ))}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900">
                Spec capsule
              </h3>
              <dl className="mt-5 grid gap-4 sm:grid-cols-2">
                {product.specs.map((spec) => (
                  <div
                    key={spec.label}
                    className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4"
                  >
                    <dt className="text-xs uppercase tracking-wide text-slate-400">
                      {spec.label}
                    </dt>
                    <dd className="text-sm font-medium text-slate-900">
                      {spec.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </section>

        <section className="mt-12 grid gap-6 lg:grid-cols-3">
          <PromiseCard
            title="Corn Certified"
            description="Authentic gear with serialised verification, direct from our Corn Colombo warehouse."
          />
          <PromiseCard
            title="Planet Positive"
            description="1% of every Corn drop funds coastal cleanups and smart farming partners."
          />
          <PromiseCard
            title="Need a demo?"
            description="Book a private Corn Studio session or get a live walkthrough via Corn Video."
          />
        </section>

        <div className="mt-10 flex flex-wrap items-center gap-3 text-sm text-slate-600">
          <Link
            href="/#shop"
            className="inline-flex items-center gap-2 text-primary transition hover:text-red-600"
          >
            ← Back to all collections
          </Link>
          <span>or</span>
          <a
            href="mailto:hello@corn.example"
            className="font-semibold text-slate-900 transition hover:text-primary"
          >
            Talk to a Corn expert
          </a>
        </div>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
    </div>
  );
}

type InfoCardProps = {
  title: string;
  description: string;
  icon: "truck" | "shield";
};

function InfoCard({ title, description, icon }: InfoCardProps) {
  return (
    <article className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
      <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        {icon === "truck" ? "🚚" : "🛡️"}
      </div>
      <p className="text-sm font-semibold text-slate-900">
        {title}
      </p>
      <p className="text-sm text-slate-600">{description}</p>
    </article>
  );
}

type PromiseCardProps = {
  title: string;
  description: string;
};

function PromiseCard({ title, description }: PromiseCardProps) {
  return (
    <article className="rounded-3xl border border-slate-100 bg-white/90 p-5 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
        Corn promise
      </p>
      <h3 className="mt-3 text-lg font-semibold text-slate-900">
        {title}
      </h3>
      <p className="text-sm text-slate-600">{description}</p>
    </article>
  );
}
