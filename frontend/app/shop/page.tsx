export const revalidate = 60;

import { CatalogProductCard } from "@/components/catalog-product-card";
import { Footer } from "@/components/footer";
import { MobileBottomNav } from "@/components/mobile-bottom-nav";
import { Navbar } from "@/components/navbar";
import { ShopShell } from "./shop-shell";
import { fetchCatalogCategories, fetchProducts } from "@/lib/catalog-api";
import type { CatalogCategory, ProductListMeta } from "@/types/catalog";

type ShopPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

const parseString = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value[0] : value || undefined;
const parseNumber = (value: string | string[] | undefined) => {
  const raw = parseString(value);
  if (!raw) return undefined;
  const num = Number(raw);
  return Number.isFinite(num) ? num : undefined;
};
const parseBool = (value: string | string[] | undefined) => {
  const raw = parseString(value);
  if (raw === "true" || raw === "1") return true;
  if (raw === "false" || raw === "0") return false;
  return undefined;
};
const parseCategoryArray = (value: string | string[] | undefined) => {
  if (!value) return [] as string[];
  const list = Array.isArray(value) ? value : String(value).split(",");
  return list
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean)
    .slice(0, 8);
};

const flattenCategories = (categories: CatalogCategory[]) =>
  categories.flatMap((category) => [
    { id: category.id, name: category.name, slug: category.slug, position: category.position },
    ...(category.children?.length
      ? category.children.map((child) => ({
          id: child.id,
          name: child.name,
          slug: child.slug,
          position: child.position,
        }))
      : []),
  ]);

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const params = await searchParams;
  const filters = {
    q: parseString(params.q),
    categories: Array.from(
      new Set([
        ...parseCategoryArray(params.category),
        ...parseCategoryArray(params.categories),
      ]),
    ),
    inStock: parseBool(params.inStock) ?? false,
    minPrice: parseNumber(params.minPrice),
    maxPrice: parseNumber(params.maxPrice),
    sort: parseString(params.sort) || "newest",
    page: parseNumber(params.page) ?? 1,
    limit: 24,
  };

  const [{ data: products, meta }, categories] = await Promise.all([
    fetchProducts(filters, { revalidate: 60 }),
    fetchCatalogCategories({ revalidate: 300 }),
  ]);

  const priceRange: NonNullable<ProductListMeta["priceRange"]> = {
    min: meta.priceRange?.min ?? 0,
    max: meta.priceRange?.max ?? 0,
  };
  const flatCategories = flattenCategories(categories);

  return (
    <div className="min-h-screen bg-zinc-50">
      <Navbar />

      <main className="mx-auto w-full max-w-7xl px-4 py-8 lg:py-12">
        <header className="mb-6 flex flex-col gap-3 border-b border-slate-100 pb-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-primary">
              Shop all
            </p>
            <h1 className="text-3xl font-semibold leading-tight text-slate-900 sm:text-4xl">
              All products
            </h1>
            <p className="text-sm text-slate-600">
              Filter by category, availability, and price to see only the items you want.
            </p>
          </div>
        
        </header>

        <ShopShell
          categories={flatCategories}
          filters={filters}
          priceRange={priceRange}
          total={meta.total}
        >
          {products.length ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((product) => (
                <CatalogProductCard key={`shop-${product.id}`} product={product} />
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-slate-100 bg-white p-10 text-center shadow-sm">
              <p className="text-lg font-semibold text-slate-900">No products found</p>
              <p className="mt-2 text-sm text-slate-600">
                Try clearing filters or selecting a different category.
              </p>
            </div>
          )}
        </ShopShell>
      </main>

      <Footer />
      <MobileBottomNav />
    </div>
  );
}
