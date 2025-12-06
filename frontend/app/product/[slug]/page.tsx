import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { fetchProductBySlug } from "@/lib/catalog-api";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import type { ProductDetail } from "@/types/catalog";

import { ProductActions } from "./product-actions";
import { ProductGallery } from "./product-gallery";
import { ReviewSection } from "@/components/review-section";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

const faqItems = [
  {
    q: "What is the warranty?",
    a: "All PhoneBazzar.lk products include a 3-year local warranty with service handled through our Sri Lanka partners.",
  },
  {
    q: "How fast do you deliver?",
    a: "Orders placed before 1pm typically ship same day from our Colombo hub. Delivery is 1-3 business days island-wide.",
  },
  {
    q: "Can I return if it’s not for me?",
    a: "Yes. Unopened items can be returned within 7 days. If there’s a defect, we’ll replace or repair under warranty.",
  },
];

const currencyFormatter = new Intl.NumberFormat("en-LK", {
  style: "currency",
  currency: "LKR",
  maximumFractionDigits: 0,
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://phonebazzar.lk";

async function loadProduct(slug: string): Promise<ProductDetail | null> {
  return fetchProductBySlug(slug);
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await loadProduct(slug);

  if (!product) {
    return {
      title: "Product not found • PhoneBazzar.lk",
      description:
        "Browse the newest drops and exclusives from PhoneBazzar.lk.",
    };
  }

  const title = `${product.name} • PhoneBazzar.lk`;

  return {
    title,
    description: product.description ?? "PhoneBazzar.lk product.",
    openGraph: {
      type: "website",
      url: `${siteUrl}/product/${product.slug}`,
      siteName: "PhoneBazzar.lk",
      title,
      description: product.description ?? undefined,
      images: product.images.map((image) => ({
        url: image.url,
        alt: image.alt ?? undefined,
      })),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: product.description ?? undefined,
      images: [product.images[0]?.url].filter(Boolean) as string[],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await loadProduct(slug);

  if (!product) {
    notFound();
  }

  const galleryImages = product.images.slice(0, 5);

  return (
    <div className="bg-gradient-to-b from-white via-white to-slate-50">
      <Navbar />
      <div className="mx-auto w-full max-w-6xl px-3 py-8 lg:px-3 lg:py-10">
        <nav
          aria-label="Breadcrumb"
          className="flex flex-wrap items-center gap-2 text-sm text-slate-500"
        >
          <Link href="/" className="transition hover:text-primary">
            Home
          </Link>
          <span aria-hidden>/</span>
          <Link href="/shop" className="transition hover:text-primary">
            Shop
          </Link>
          <span aria-hidden>/</span>
          <span className="text-slate-900">{product.name}</span>
        </nav>

        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
          <section className="space-y-4">
            <ProductGallery name={product.name} images={galleryImages} />
            <div className="grid gap-3 sm:grid-cols-2">
              <InfoCard
                title="Fast dispatch"
                description="Ships within 24 hours from the PhoneBazzar hub."
                icon="truck"
              />
              <InfoCard
                title="Warranty & care"
                description="3-year PhoneBazzar warranty with local service."
                icon="shield"
              />
              <InfoCard
                title="Easy returns"
                description="7-day change-of-mind returns if unopened."
                icon="refresh"
              />
              <InfoCard
                title="Secure payments"
                description="COD or PayHere with bank-grade encryption."
                icon="lock"
              />
            </div>
          </section>

          <section className="flex flex-col gap-5 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-3xl font-semibold text-slate-900 lg:text-4xl">
                  {product.name}
                </h1>
                <div className="mt-2 flex items-end gap-3 mt-2">
                  <p className="text-3xl font-md text-slate-900">
                    {currencyFormatter.format(product.priceLKR)}
                  </p>
                  {product.compareAtLKR ? (
                    <p className="text-sm text-slate-400 line-through">
                      {currencyFormatter.format(product.compareAtLKR)}
                    </p>
                  ) : null}
                </div>
              </div>
            </div>

            <div className="rounded-3xl bg-white/80 p-4 text-sm text-slate-700">
              <p className="font-semibold text-slate-900">Categories</p>
              <p>
                  {product.categories.map((cat) => cat.name).join(" · ") ||
                    "PhoneBazzar catalog"}
              </p>
            </div>

            <ProductActions
              productId={product.id}
              variants={product.variants}
              priceLKR={product.priceLKR}
              slug={product.slug}
            />
          </section>
        </div>

        <section className="mt-6 rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Description</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-700">
            {product.description || "Premium PhoneBazzar hardware for daily use with local warranty and fast delivery."}
          </p>
        </section>

        <section className="mt-5 rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">
            Specs snapshot
          </h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <SpecBadge label="SKU" value={product.sku} />
            <SpecBadge
              label="Price"
              value={currencyFormatter.format(product.priceLKR)}
            />
            <SpecBadge
              label="Variants"
              value={product.variants.length ? "Multiple" : "Single"}
            />
            <SpecBadge
              label="Availability"
              value={product.stock > 0 ? "In stock" : "Out of stock"}
            />
          </div>
        </section>

        <section className="mt-10 grid gap-8 lg:grid-cols-[1.2fr,0.8fr]">
          <div>
            <ReviewSection
              slug={product.slug}
              initialReviews={product.reviews ?? []}
              totalReviews={product.reviewSummary?.total ?? 0}
              averageRating={product.reviewSummary?.averageRating ?? 0}
            />
          </div>
          <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">Frequently asked</h2>
            <p className="text-sm text-slate-600">
              Quick answers about shipping, warranty, and returns.
            </p>
            <div className="mt-4 divide-y divide-slate-100 rounded-2xl border border-slate-100">
              {faqItems.map((item) => (
                <details key={item.q} className="group p-4 open:bg-slate-50">
                  <summary className="flex cursor-pointer items-center justify-between gap-3 text-sm font-semibold text-slate-900">
                    {item.q}
                    <span className="text-primary transition group-open:rotate-45">+</span>
                  </summary>
                  <p className="mt-2 text-sm text-slate-600">{item.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
}

const SpecBadge = ({ label, value }: { label: string; value: string }) => (
  <div className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm text-slate-700">
    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
      {label}
    </p>
    <p className="mt-1 font-semibold text-slate-900">{value}</p>
  </div>
);

const InfoCard = ({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon: "truck" | "shield" | "refresh" | "lock";
}) => (
  <div className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4">
    <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-primary">
      {icon === "truck" ? (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.8}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-5 w-5"
          aria-hidden
        >
          <circle cx="8.5" cy="19" r="1.5" />
          <circle cx="18.5" cy="19" r="1.5" />
          <path d="M3 5h13v10H3zM16 8h3l2 3v4h-5" />
        </svg>
      ) : icon === "shield" ? (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.8}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-5 w-5"
          aria-hidden
        >
          <path d="M12 3 5 6v6c0 5 7 9 7 9s7-4 7-9V6z" />
          <path d="M9 12l2 2 4-4" />
        </svg>
      ) : icon === "refresh" ? (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.8}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-5 w-5"
          aria-hidden
        >
          <path d="M21 2v6h-6" />
          <path d="M3 22v-6h6" />
          <path d="M3 16a9 9 0 0 1 14.31-7" />
          <path d="M21 8a9 9 0 0 1-14.31 7" />
        </svg>
      ) : (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.8}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-5 w-5"
          aria-hidden
        >
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
      )}
    </div>
    <div>
      <p className="text-sm font-semibold text-slate-900">{title}</p>
      <p className="text-sm text-slate-600">{description}</p>
    </div>
  </div>
);
