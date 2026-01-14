import { API_BASE_URL } from "./api";
import type {
  CatalogCategory,
  ProductDetail,
  ProductListResponse,
  ProductSummary,
} from "@/types/catalog";

type FetchProductsParams = {
  q?: string;
  category?: string;
  categories?: string[];
  sort?: string;
  page?: number;
  limit?: number;
  inStock?: boolean;
  minPrice?: number;
  maxPrice?: number;
};

type FetchOptions = {
  cache?: RequestCache;
  revalidate?: number;
};

const buildFetchOptions = (options?: FetchOptions): RequestInit & { next?: { revalidate: number } } => {
  const fetchOptions: RequestInit & { next?: { revalidate: number } } = {
    method: "GET",
    cache: options?.cache ?? "force-cache",
  };

  if (typeof options?.revalidate === "number") {
    fetchOptions.next = { revalidate: options.revalidate };
  }

  return fetchOptions;
};

const buildQuery = (params: Record<string, string | number | boolean | string[] | undefined>) => {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null) return;
    if (Array.isArray(value)) {
      value.forEach((item) => {
        if (item !== undefined && item !== null && String(item).trim()) {
          search.append(key, String(item).trim());
        }
      });
      return;
    }
    search.append(key, String(value));
  });
  const query = search.toString();
  return query ? `?${query}` : "";
};

const emptyListResponse = (limit = 12): ProductListResponse => ({
  data: [],
  meta: { total: 0, page: 1, limit, pages: 1, priceRange: { min: 0, max: 0 } },
});

export async function fetchProductBySlug(
  slug: string,
  options?: FetchOptions,
): Promise<ProductDetail | null> {
  const response = await fetch(
    `${API_BASE_URL}/products/${slug}`,
    buildFetchOptions({ ...options }),
  );

  if (!response.ok) {
    return null;
  }

  const payload = (await response.json()) as { product?: ProductDetail };
  return payload.product ?? null;
}

export async function fetchProducts(
  params: FetchProductsParams = {},
  options?: FetchOptions,
): Promise<ProductListResponse> {
  const defaultLimit = params.limit ?? 24;
  const response = await fetch(`${API_BASE_URL}/products${buildQuery({
    q: params.q,
    category: params.category,
    categories: params.categories,
    sort: params.sort,
    page: params.page,
    limit: params.limit,
    inStock: params.inStock,
    minPrice: params.minPrice,
    maxPrice: params.maxPrice,
  })}`, buildFetchOptions(options));

  if (!response.ok) {
    return emptyListResponse(defaultLimit);
  }

  const payload = (await response.json()) as ProductListResponse | { data?: ProductSummary[] };

  if (!("data" in payload)) {
    return emptyListResponse(defaultLimit);
  }

  const meta =
    "meta" in payload && payload.meta
      ? payload.meta
      : { total: payload.data?.length ?? 0, page: 1, limit: defaultLimit, pages: 1 };

  return {
    data: payload.data ?? [],
    meta: { priceRange: { min: 0, max: 0 }, ...meta },
  };
}

export async function fetchCatalogCategories(
  options?: FetchOptions,
): Promise<CatalogCategory[]> {
  const response = await fetch(
    `${API_BASE_URL}/categories`,
    buildFetchOptions(options),
  );

  if (!response.ok) {
    return [];
  }

  const payload = (await response.json()) as { categories?: CatalogCategory[] };
  return payload.categories ?? [];
}
