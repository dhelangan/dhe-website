"use client";

import { useMemo, useState } from "react";

type ReviewItem = {
  id: number;
  review?: string | null;
  source?: string | null;
  client?: string | null;
  star?: number | null;
};

function Stars({ value }: { value: number }) {
  const clamped = Math.max(0, Math.min(5, Math.round(value)));
  return (
    <div className="flex items-center gap-1 text-2xl" aria-label={`${clamped} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span
          key={i}
          className={i < clamped ? "text-amber-500" : "text-zinc-300 dark:text-zinc-600"}
          aria-hidden="true"
        >
          ★
        </span>
      ))}
    </div>
  );
}

function chunk<T>(items: T[], size: number) {
  const out: T[][] = [];
  for (let i = 0; i < items.length; i += size) out.push(items.slice(i, i + size));
  return out;
}

export default function ReviewsCarousel({
  reviews,
  defaultAvatarSrc = "/thumbnails/team-creative.svg",
}: {
  reviews: ReviewItem[];
  defaultAvatarSrc?: string;
}) {
  const slides = useMemo(() => chunk(reviews, 2), [reviews]);
  const [index, setIndex] = useState(0);
  const hasSlides = slides.length > 0;

  const prev = () => setIndex((v) => (slides.length === 0 ? 0 : (v - 1 + slides.length) % slides.length));
  const next = () => setIndex((v) => (slides.length === 0 ? 0 : (v + 1) % slides.length));

  if (!hasSlides) {
    return (
      <div className="rounded-3xl border border-black/10 bg-surface p-8 shadow-sm dark:border-white/10">
        <div className="text-sm text-zinc-700 dark:text-zinc-300">No reviews yet.</div>
      </div>
    );
  }

  const current = slides[index] ?? [];

  return (
    <div className="p-1">
      <div className="flex items-center justify-between gap-4">
        <div className="text-sm font-semibold tracking-tight">
          Reviews <span className="text-zinc-600 dark:text-zinc-300">({reviews.length})</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={prev}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-black/10 bg-background text-2xl font-semibold text-zinc-900 shadow-sm transition-colors hover:bg-zinc-50 dark:border-white/10 dark:bg-black/20 dark:text-zinc-50 dark:hover:bg-black/30"
            aria-label="Previous reviews"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={next}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-black/10 bg-background text-2xl font-semibold text-zinc-900 shadow-sm transition-colors hover:bg-zinc-50 dark:border-white/10 dark:bg-black/20 dark:text-zinc-50 dark:hover:bg-black/30"
            aria-label="Next reviews"
          >
            ›
          </button>
        </div>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        {current.map((review) => (
          <div
            key={review.id}
            className="rounded-2xl h-72 border border-black/10 bg-background p-4 dark:border-white/10"
          >
            <span className="px-2 py-1 rounded-2xl  dark:text-white text-sm font-semibold text-center bg-accent-orange text-black">{review.source ?? ""}</span>

            <div className="flex items-stretch justify-between gap-4 mt-2">
              
              <div className="flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={defaultAvatarSrc}
                  alt=""
                  className="h-10 w-10 rounded-full border border-black/10 object-cover dark:border-white/10"
                />
                <div className="grid">
                  <div className="text-sm font-semibold tracking-tight">{review.client ?? ""}</div>
                </div>
              </div>

              <Stars value={review.star ?? 0} />
            </div>
            <p className="mt-3 text-sm leading-6 line-clamp-7 text-zinc-800 dark:text-zinc-200">{review.review ?? ""}</p>
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="text-xs text-zinc-600 dark:text-zinc-300">
          Slide {index + 1} / {slides.length}
        </div>
        <div className="flex items-center gap-1">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setIndex(i)}
              className={`h-2 w-2 rounded-full ${i === index ? "bg-zinc-900 dark:bg-zinc-50" : "bg-zinc-300 dark:bg-zinc-700"}`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

