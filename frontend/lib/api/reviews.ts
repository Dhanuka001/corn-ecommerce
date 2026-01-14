import { API_BASE_URL } from "../api";
import { apiRequest } from "../api";
import type { Review } from "@/types/review";
import type { AdminReview } from "@/types/admin";

export type ProductReviewListResponse = {
  reviews: Review[];
  total: number;
  averageRating: number;
};

type FetchOptions = {
  cache?: RequestCache;
  revalidate?: number;
};

const buildFetchOptions = (options?: FetchOptions): RequestInit & { next?: { revalidate: number } } => {
  const fetchOptions: RequestInit & { next?: { revalidate: number } } = {
    cache: options?.cache ?? "no-store",
  };

  if (typeof options?.revalidate === "number") {
    fetchOptions.next = { revalidate: options.revalidate };
  }

  return fetchOptions;
};

export async function fetchProductReviews(
  slug: string,
  options: { page?: number; limit?: number } = {},
): Promise<ProductReviewListResponse> {
  const params = new URLSearchParams();
  if (options.page && options.page > 0) {
    params.set("page", String(options.page));
  }
  if (options.limit && options.limit > 0) {
    params.set("limit", String(options.limit));
  }

  const response = await fetch(
    `${API_BASE_URL}/products/${slug}/reviews${params.toString() ? `?${params}` : ""}`,
    buildFetchOptions({ cache: "no-store" }),
  );

  if (!response.ok) {
    return { reviews: [], total: 0, averageRating: 0 };
  }

  const payload = (await response.json()) as ProductReviewListResponse;
  return payload;
}

export async function submitProductReview(
  slug: string,
  payload: {
    rating: number;
    title: string;
    body: string;
    images?: string[];
  },
) {
  return apiRequest<{ review: Review }>(`/products/${slug}/reviews`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function fetchLatestReviews(
  limit = 4,
  options?: FetchOptions,
): Promise<Review[]> {
  const response = await fetch(
    `${API_BASE_URL}/reviews/latest?limit=${limit}`,
    buildFetchOptions(options),
  );
  if (!response.ok) {
    return [];
  }
  const payload = (await response.json()) as { reviews?: Review[] };
  return payload.reviews ?? [];
}

export async function fetchAdminReviews({
  page = 1,
  limit = 20,
  productId,
}: {
  page?: number;
  limit?: number;
  productId?: string;
}) {
  const params = new URLSearchParams();
  params.set("page", String(page));
  params.set("limit", String(limit));
  if (productId) {
    params.set("productId", productId);
  }

  return apiRequest<{
    reviews: AdminReview[];
    total: number;
    page: number;
    limit: number;
    pages: number;
  }>(`/admin/reviews?${params.toString()}`);
}

export async function deleteAdminReview(reviewId: string) {
  return apiRequest<{ ok: true }>(`/admin/reviews/${reviewId}`, {
    method: "DELETE",
  });
}
