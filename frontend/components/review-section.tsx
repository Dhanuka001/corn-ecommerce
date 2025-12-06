"use client";

import { useEffect, useMemo, useState } from "react";
import { fetchProductReviews } from "@/lib/api/reviews";
import type { Review } from "@/types/review";
import { ReviewCard } from "./review-card";
import { ReviewForm } from "./review-form";
import { StarRow } from "./review-card";
import { useNotifications } from "@/context/notification-context";

type ReviewSectionProps = {
  slug: string;
  initialReviews: Review[];
  totalReviews: number;
  averageRating: number;
};

export function ReviewSection({
  slug,
  initialReviews,
  totalReviews,
  averageRating,
}: ReviewSectionProps) {
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [total, setTotal] = useState(totalReviews);
  const [avg, setAvg] = useState(averageRating);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const { notifyError } = useNotifications();

  const loadReviews = async (targetPage = 1) => {
    setRefreshing(true);
    try {
      const data = await fetchProductReviews(slug, { page: targetPage, limit: 6 });
      setReviews(data.reviews);
      setTotal(data.total);
      setAvg(data.averageRating);
      setPage(targetPage);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to load reviews";
      notifyError("Reviews unavailable", message);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (initialReviews.length === 0) {
      void loadReviews(1);
    }
  }, []);

  const canShowLoadMore = useMemo(
    () => total > reviews.length && !refreshing,
    [total, reviews.length, refreshing],
  );

  const handleFormSuccess = async () => {
    await loadReviews(1);
  };

  return (
    <section className="space-y-6">
      <header className="flex flex-col gap-2 rounded-3xl border border-slate-100 bg-white/80 px-6 py-5 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
          Customer reviews
        </p>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">You bought this? Leave a review</h2>
            <p className="text-sm text-slate-500">
              {total ? `Based on ${total} review${total === 1 ? "" : "s"}` : "Be the first to leave feedback!"}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <StarRow rating={Math.round(avg)} />
            <span className="text-xs text-slate-500">{avg.toFixed(1)} avg</span>
          </div>
        </div>
      </header>

      <div className="grid gap-6">
        {reviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
        {canShowLoadMore && (
          <button
            type="button"
            onClick={() => void loadReviews(page + 1)}
            className="rounded-2xl border border-dashed border-primary px-6 py-3 text-sm font-semibold text-primary transition hover:bg-primary/5"
          >
            {refreshing ? "Loading…" : "Load more reviews"}
          </button>
        )}
      </div>

      <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
        <p className="text-sm font-semibold text-slate-900">You brought this product?</p>
        <p className="text-sm text-slate-500">
          Let others know what to expect—your review submits for quick approval.
        </p>
        <div className="mt-4">
          <ReviewForm slug={slug} onSuccess={handleFormSuccess} />
        </div>
      </div>
    </section>
  );
}
