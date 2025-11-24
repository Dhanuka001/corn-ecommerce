import { API_BASE_URL } from "./api";
import type { ProductDetail } from "@/types/catalog";
import type { ProductSummary } from "@/types/catalog";

export async function fetchProductBySlug(
  slug: string,
): Promise<ProductDetail | null> {
  const response = await fetch(`${API_BASE_URL}/products/${slug}`, {
    method: "GET",
    // Products are public, no credentials needed.
    cache: "no-store",
  });

  if (!response.ok) {
    return null;
  }

  const payload = (await response.json()) as { product?: ProductDetail };
  return payload.product ?? null;
}

export async function fetchProducts(): Promise<ProductSummary[]> {
  const response = await fetch(`${API_BASE_URL}/products`, {
    method: "GET",
    cache: "no-store",
  });

  if (!response.ok) {
    return [];
  }

  const payload = (await response.json()) as {
    data?: ProductSummary[];
  };

  return payload.data ?? [];
}
