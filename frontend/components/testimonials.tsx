"use client";

import { useEffect, useState } from "react";

import { fetchLatestReviews } from "@/lib/api/reviews";
import { ReviewCard } from "@/components/review-card";
import type { Review } from "@/types/review";

export function Testimonials() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    void (async () => {
      try {
        const latest = await fetchLatestReviews(4);
        if (active) {
          setReviews(latest);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  return (
    <section className="px-4 py-14 sm:py-16" aria-label="Customer testimonials">
      <div className="mx-auto w-full max-w-7xl">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-primary">
              Straight from our fans
            </p>
            <h2 className="mt-2 text-3xl font-semibold text-slate-900">
              Loved by the PhoneBazzar community
            </h2>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {loading ? (
            Array.from({ length: 4 }).map((_, idx) => (
              <div
                key={`loading-${idx}`}
                className="h-48 rounded-[28px] border border-slate-200 bg-white/60 p-6 shadow-sm animate-pulse"
              />
            ))
          ) : reviews.length ? (
            reviews.map((review) => (
              <ReviewCard key={review.id} review={review} showProduct />
            ))
          ) : (
            <p className="text-sm text-slate-500">
              Be the first to review one of our PhoneBazzar favorites.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
