"use client";

import { useEffect, useMemo, useRef, useState, useTransition, type ReactNode } from "react";
import { useRouter } from "next/navigation";

import type { CatalogCategory } from "@/types/catalog";

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency: "LKR",
    maximumFractionDigits: 0,
  }).format(value);

type Filters = {
  q?: string;
  categories: string[];
  inStock: boolean;
  minPrice?: number;
  maxPrice?: number;
  sort?: string;
  page?: number;
  limit?: number;
};

type ShopShellProps = {
  categories: Pick<CatalogCategory, "id" | "name" | "slug" | "position">[];
  filters: Filters;
  priceRange: { min: number; max: number };
  total: number;
  children: ReactNode;
};

export function ShopShell({ categories, filters, priceRange, total, children }: ShopShellProps) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState(filters.q ?? "");
  const [priceMin, setPriceMin] = useState(filters.minPrice ?? priceRange.min ?? 0);
  const [priceMax, setPriceMax] = useState(
    filters.maxPrice ?? priceRange.max ?? filters.minPrice ?? priceRange.min ?? 0,
  );
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);
  const firstSearchRender = useRef(true);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setSearchTerm(filters.q ?? "");
  }, [filters.q]);

  useEffect(() => {
    setPriceMin(filters.minPrice ?? priceRange.min ?? 0);
    setPriceMax(filters.maxPrice ?? priceRange.max ?? filters.minPrice ?? priceRange.min ?? 0);
  }, [filters.minPrice, filters.maxPrice, priceRange.min, priceRange.max]);

  const sortedCategories = useMemo(
    () => [...categories].sort((a, b) => (a.position ?? 0) - (b.position ?? 0)),
    [categories],
  );
  const hasActiveFilters =
    Boolean(filters.q) ||
    filters.inStock ||
    filters.categories.length > 0 ||
    filters.minPrice !== undefined ||
    filters.maxPrice !== undefined;

  const applyFilters = (patch: Partial<Filters>) => {
    const next = {
      ...filters,
      ...patch,
      page: 1, // reset pagination on every change for consistency
    };
    const params = new URLSearchParams();
    if (next.q) params.set("q", next.q);
    if (next.inStock) params.set("inStock", "true");
    if (next.minPrice !== undefined) params.set("minPrice", String(next.minPrice));
    if (next.maxPrice !== undefined) params.set("maxPrice", String(next.maxPrice));
    if (next.sort) params.set("sort", next.sort);
    if (next.categories?.length) {
      next.categories.forEach((slug) => params.append("categories", slug));
    }
    if (next.limit) params.set("limit", String(next.limit));

    const query = params.toString();
    startTransition(() => {
      router.replace(query ? `/shop?${query}` : "/shop", { scroll: false });
    });
  };

  const applyPriceFilter = (nextMin: number, nextMax: number) => {
    const minBound = Math.max(0, Math.floor(Number.isFinite(nextMin) ? nextMin : 0));
    const maxBoundSource = Number.isFinite(nextMax) ? nextMax : minBound;
    const maxBound = Math.max(minBound, Math.floor(maxBoundSource));
    applyFilters({ minPrice: minBound, maxPrice: maxBound });
  };

  const clearFilters = () => {
    setSearchTerm("");
    setPriceMin(priceRange.min ?? 0);
    setPriceMax(priceRange.max || priceRange.min || 0);
    applyFilters({
      q: undefined,
      categories: [],
      inStock: false,
      minPrice: undefined,
      maxPrice: undefined,
      sort: "newest",
    });
  };

  useEffect(() => {
    if (firstSearchRender.current) {
      firstSearchRender.current = false;
      return undefined;
    }

    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    const trimmed = searchTerm.trim();
    const timer = setTimeout(() => {
      applyFilters({ q: trimmed || undefined });
    }, 350);
    debounceTimer.current = timer;

    return () => {
      clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm]);

  const onSubmitSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = searchTerm.trim();
    applyFilters({ q: trimmed || undefined });
  };

  const priceMinBound = Math.max(priceRange.min ?? 0, 0);
  const priceMaxBound = Math.max(priceRange.max ?? priceMinBound + 1, priceMinBound + 1);

  return (
    <section className="grid gap-6 lg:grid-cols-4">
      <aside className="h-fit rounded-3xl border border-slate-100 bg-white p-5 shadow-sm lg:sticky lg:top-24 lg:self-start lg:col-span-1 lg:max-w-[300px]">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">Filters</h2>
          <button
            type="button"
            onClick={clearFilters}
            disabled={!hasActiveFilters || isPending}
            className="text-sm font-semibold text-primary disabled:cursor-not-allowed disabled:opacity-50"
          >
            Clear all
          </button>
        </div>

        <div className="mt-2 space-y-2 divide-y divide-slate-100">
          <div className="space-y-2 pb-4">
            <p className="text-sm font-semibold text-slate-900">Search</p>
            <form onSubmit={onSubmitSearch} className="flex items-center gap-2">
              <input
                type="text"
                name="q"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:border-primary"
              />
              <button
                type="submit"
                className="rounded-xl bg-slate-900 px-3 py-2 text-xs font-semibold text-white shadow-sm transition hover:-translate-y-[1px] hover:shadow-lg"
              >
                Go
              </button>
            </form>
          </div>

          <div className="space-y-2 pt-4 pb-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-900">Price</p>
              <span className="text-xs font-semibold text-slate-600">
                {formatCurrency(priceMin)} - {formatCurrency(priceMax || priceMaxBound)}
              </span>
            </div>
            <div className="space-y-3">
              <input
                type="range"
                min={priceMinBound}
                max={priceMaxBound}
                value={priceMin}
                onChange={(event) => setPriceMin(Number(event.target.value))}
                onMouseUp={() => applyPriceFilter(priceMin, priceMax)}
                onTouchEnd={() => applyPriceFilter(priceMin, priceMax)}
                className="w-full accent-primary"
              />
              <input
                type="range"
                min={priceMin}
                max={priceMaxBound}
                value={priceMax}
                onChange={(event) => setPriceMax(Number(event.target.value))}
                onMouseUp={() => applyPriceFilter(priceMin, priceMax)}
                onTouchEnd={() => applyPriceFilter(priceMin, priceMax)}
                className="w-full accent-primary"
              />
              <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
                <span>{formatCurrency(priceMinBound)}</span>
                <span>{formatCurrency(priceMaxBound)}</span>
              </div>
            </div>
          </div>

          <div className="space-y-2 pt-4 pb-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-900">Sort</p>
            </div>
            <select
              value={filters.sort ?? "newest"}
              onChange={(event) => applyFilters({ sort: event.target.value })}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 outline-none"
            >
              <option value="newest">Newest</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="name_asc">Name A → Z</option>
              <option value="name_desc">Name Z → A</option>
            </select>
          </div>

          <div className="space-y-2 pt-4 pb-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-900">Category</p>
              <button
                type="button"
                onClick={() => applyFilters({ categories: [] })}
                className="text-xs font-semibold text-primary"
              >
                Clear
              </button>
            </div>
            <select
              value={filters.categories[0] ?? ""}
              onChange={(event) => {
                const value = event.target.value;
                applyFilters({ categories: value ? [value] : [] });
              }}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 outline-none"
            >
              <option value="">All categories</option>
              {sortedCategories.map((category) => (
                <option key={category.id} value={category.slug}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2 pt-4 pb-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-900">Availability</p>
              <span className="text-xs text-slate-500">In stock</span>
            </div>
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={filters.inStock}
                onChange={(event) => applyFilters({ inStock: event.target.checked })}
                className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary"
              />
              <span className="text-sm text-slate-700">Only show items in stock</span>
            </label>
          </div>
        </div>
      </aside>

      <div className="space-y-4 lg:col-span-3">
        <div className="relative ">
          {isPending ? (
            <div className="absolute inset-0 z-10 flex items-center justify-center rounded-3xl bg-white/75">
              <span className="h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            </div>
          ) : null}
          {children}
        </div>
      </div>
    </section>
  );
}
