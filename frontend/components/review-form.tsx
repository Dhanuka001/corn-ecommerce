"use client";

import { useState } from "react";
import { useNotifications } from "@/context/notification-context";
import { useAuth } from "@/context/auth-context";
import { submitProductReview } from "@/lib/api/reviews";

const MAX_IMAGES = 3;

type ReviewFormProps = {
  slug: string;
  onSuccess?: () => Promise<void> | void;
};

export function ReviewForm({ slug, onSuccess }: ReviewFormProps) {
  const { user, openAuth } = useAuth();
  const { notifyError, notifySuccess } = useNotifications();
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [images, setImages] = useState<string[]>([""]);
  const [submitting, setSubmitting] = useState(false);

  const handleImageChange = (index: number, value: string) => {
    setImages((prev) => prev.map((item, idx) => (idx === index ? value : item)));
  };

  const handleAddImage = () => {
    if (images.length >= MAX_IMAGES) return;
    setImages((prev) => [...prev, ""]);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!user) {
      openAuth("login");
      return;
    }
    setSubmitting(true);
    try {
      await submitProductReview(slug, {
        rating,
        title,
        body,
        images: images.filter(Boolean),
      });
      notifySuccess("Review submitted", "Thanks for sharing your experience!");
      setRating(5);
      setTitle("");
      setBody("");
      setImages([""]);
      if (onSuccess) {
        await onSuccess();
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to submit review";
      notifyError("Review failed", message);
    } finally {
      setSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="rounded-3xl border border-dashed border-primary/40 bg-white px-6 py-6 text-center text-sm text-slate-600">
        <p className="font-semibold text-slate-900">Share your experience</p>
        <p className="mt-1 text-xs uppercase tracking-[0.3em] text-primary">
          You bought this product?
        </p>
        <p className="mt-2">
          <button
            type="button"
            onClick={() => openAuth("login")}
            className="text-primary underline underline-offset-4 transition hover:text-red-500"
          >
            Sign in to leave a review
          </button>
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex flex-col gap-2">
        <label className="flex items-center gap-3 text-sm font-semibold text-slate-700">
          <span className="text-xs uppercase tracking-[0.3em] text-primary">Rating</span>
          <span className="text-base text-slate-900">{rating} / 5</span>
        </label>
        <div className="flex items-center gap-1 text-xl text-amber-400">
          {Array.from({ length: 5 }).map((_, index) => (
            <button
              key={index}
              type="button"
              className={index < rating ? "text-amber-400" : "text-amber-200"}
              onClick={() => setRating(index + 1)}
            >
              ★
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Review title"
          className="rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none focus:border-primary"
          required
        />
        <input
          value={body}
          onChange={(event) => setBody(event.target.value)}
          placeholder="Describe your experience"
          className="rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none focus:border-primary"
          required
        />
      </div>

      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
          Optional photos
        </p>
        {images.map((value, index) => (
          <input
            key={`photo-${index}`}
            value={value}
            onChange={(event) => handleImageChange(index, event.target.value)}
            placeholder="https://example.com/photo.jpg"
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none focus:border-primary"
          />
        ))}
        {images.length < MAX_IMAGES ? (
          <button
            type="button"
            onClick={handleAddImage}
            className="text-xs font-semibold uppercase tracking-[0.3em] text-primary underline underline-offset-4"
          >
            + Add another photo
          </button>
        ) : null}
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-primary/90 disabled:opacity-60"
      >
        {submitting ? "Submitting…" : "Post review"}
      </button>
    </form>
  );
}
