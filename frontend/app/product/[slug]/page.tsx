import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { fetchProductBySlug } from "@/lib/catalog-api";
import type { ProductDetail } from "@/types/catalog";

import { ProductActions } from "./product-actions";

type ProductPageProps = {
  params: { slug: string };
};

const currencyFormatter = new Intl.NumberFormat("en-LK", {
  style: "currency",
  currency: "LKR",
  maximumFractionDigits: 0,
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://corn.example";

async function loadProduct(slug: string): Promise<ProductDetail | null> {
  return fetchProductBySlug(slug);
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const product = await loadProduct(params.slug);

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
    description: product.description ?? "Corn Electronics product.",
    openGraph: {
      type: "website",
      url: `${siteUrl}/product/${product.slug}`,
      siteName: "Corn Ecommerce",
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

const renderPrice = (product: ProductDetail) => {
  const price = currencyFormatter.format(product.priceLKR);
  const compare = product.compareAtLKR
    ? currencyFormatter.format(product.compareAtLKR)
    : null;

  return (
    <div className="flex flex-wrap items-end gap-4">
      <div>
        <p className="text-sm uppercase tracking-wide text-slate-500">
          Corn launch price
        </p>
        <p className="text-4xl font-semibold text-primary">{price}</p>
      </div>
      {compare ? (
        <p className="text-sm text-slate-400 line-through">{compare}</p>
      ) : null}
      <span className="rounded-full bg-white/70 px-3 py-1 text-xs font-semibold text-slate-700">
        Tax inclusive
      </span>
    </div>
  );
};

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await loadProduct(params.slug);

  if (!product) {
    notFound();
  }

  const heroImage = product.images[0];
  const secondaryImages = product.images.slice(1, 4);

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
          <Link href="/shop" className="transition hover:text-primary">
            Shop
          </Link>
          <span aria-hidden>/</span>
          <span className="text-slate-900">{product.name}</span>
        </nav>

        <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,520px)_minmax(0,1fr)]">
          <section className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row">
              <div className="hidden w-20 flex-col gap-3 sm:flex">
                {secondaryImages.map((image) => (
                  <div
                    key={image.id}
                    className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
                  >
                    <Image
                      src={image.url}
                      alt={image.alt || `${product.name} detail`}
                      width={160}
                      height={160}
                      className="h-24 w-full object-cover"
                    />
                  </div>
                ))}
              </div>
              <div className="relative flex-1 overflow-hidden rounded-[36px] bg-white p-6 shadow-xl ring-1 ring-slate-100">
                {heroImage ? (
                  <Image
                    src={heroImage.url}
                    alt={heroImage.alt || product.name}
                    width={900}
                    height={900}
                    className="h-[420px] w-full rounded-3xl object-cover lg:h-[520px]"
                    priority
                  />
                ) : (
                  <div className="flex h-[420px] items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-slate-50 text-sm font-semibold text-slate-500 lg:h-[520px]">
                    Image coming soon
                  </div>
                )}
                <div className="absolute left-6 top-6 inline-flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-slate-900 shadow">
                  Corn Drop
                  <span className="rounded-full bg-primary/10 px-2 py-0.5 text-primary">
                    {product.stock > 0 ? "In stock" : "Out of stock"}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <InfoCard
                title="Fast dispatch"
                description="Ships within 24 hours from the Corn hub."
                icon="truck"
              />
              <InfoCard
                title="Warranty & care"
                description="3-year Corn warranty with local service."
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
                  {product.description || "Premium Corn hardware for daily use."}
                </p>
              </div>
            </div>

            {renderPrice(product)}

            <div className="rounded-3xl bg-white/80 p-4 text-sm text-slate-700">
              <p className="font-semibold text-slate-900">Categories</p>
              <p>
                {product.categories.map((cat) => cat.name).join(" · ") ||
                  "Corn catalog"}
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

        <section className="mt-10 grid gap-6 rounded-3xl border border-slate-100 bg-white p-6 shadow-sm lg:grid-cols-2">
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-slate-900">
              Why Corn customers love this
            </h2>
            <ul className="space-y-2 text-sm text-slate-700">
              <li className="flex items-start gap-2">
                <span className="mt-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-primary">
                  ✓
                </span>
                Built with locally supported warranty and parts.
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-primary">
                  ✓
                </span>
                Stock-aware pricing pulled directly from the backend.
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-primary">
                  ✓
                </span>
                Favorites and cart sync after you sign in.
              </li>
            </ul>
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-slate-900">
              Specs snapshot
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
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
          </div>
        </section>
      </div>
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
  icon: "truck" | "shield";
}) => (
  <div className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
      {icon === "truck" ? "🚚" : "🛡️"}
    </div>
    <div>
      <p className="text-sm font-semibold text-slate-900">{title}</p>
      <p className="text-sm text-slate-600">{description}</p>
    </div>
  </div>
);
