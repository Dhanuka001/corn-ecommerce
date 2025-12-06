"use client";

import type { Review } from "@/types/review";

type StarRowProps = {
  rating: number;
};

export const StarRow = ({ rating }: StarRowProps) => (
  <div className="flex items-center gap-1 text-sm tracking-wide text-amber-500">
    {Array.from({ length: 5 }).map((_, index) => (
      <span
        key={index}
        className={index < rating ? "text-amber-500" : "text-amber-200"}
        aria-hidden
      >
        ★
      </span>
    ))}
  </div>
);

const getInitials = (review: Review) => {
  const names = [review.user.firstName, review.user.lastName].filter(Boolean);
  if (names.length) {
    return names
      .map((name) => name?.[0]?.toUpperCase())
      .join("")
      .slice(0, 2);
  }
  return review.user.email.slice(0, 2).toUpperCase();
};

type ReviewCardProps = {
  review: Review;
  showProduct?: boolean;
};

export function ReviewCard({ review, showProduct = false }: ReviewCardProps) {
  return (
    <article className="flex flex-col gap-4 rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full border border-slate-100 bg-slate-50 text-sm font-semibold uppercase text-slate-600">
            {getInitials(review)}
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900">
              {review.user.firstName || review.user.lastName
                ? `${review.user.firstName ?? ""} ${review.user.lastName ?? ""}`.trim()
                : review.user.email}
            </p>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
              {new Date(review.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
        <StarRow rating={review.rating} />
      </div>

      {showProduct && review.product ? (
        <div className="text-sm text-slate-500">
          <span className="font-semibold text-slate-900">{review.product.name}</span> · Product review
        </div>
      ) : null}

      <div>
        <h3 className="text-base font-semibold text-slate-900">{review.title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-slate-700">{review.body}</p>
      </div>

      {review.images?.length ? (
        <div className="grid gap-2 sm:grid-cols-3">
          {review.images.map((image, index) => (
            <img
              key={`${review.id}-img-${index}`}
              src={image}
              alt={`${review.title} photo ${index + 1}`}
              loading="lazy"
              className="h-20 w-full rounded-2xl object-cover shadow-sm"
            />
          ))}
        </div>
      ) : null}
    </article>
  );
}
