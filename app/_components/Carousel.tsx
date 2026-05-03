"use client";

import { useCallback, useEffect, useId, useMemo, useState } from "react";

type CarouselProps = {
  label: string;
  slides: React.ReactNode[];
  initialIndex?: number;
  autoplayMs?: number;
};

export default function Carousel({
  label,
  slides,
  initialIndex = 0,
  autoplayMs,
}: CarouselProps) {
  const safeSlides = useMemo(() => slides.filter(Boolean), [slides]);
  const count = safeSlides.length;
  const [index, setIndex] = useState(() =>
    count === 0 ? 0 : clamp(initialIndex, 0, count - 1),
  );
  const baseId = useId();

  const goTo = useCallback(
    (nextIndex: number) => {
      if (count === 0) return;
      setIndex(clamp(nextIndex, 0, count - 1));
    },
    [count],
  );

  const prev = useCallback(() => goTo(index - 1), [goTo, index]);
  const next = useCallback(() => goTo(index + 1), [goTo, index]);

  useEffect(() => {
    if (!autoplayMs || count <= 1) return;
    const handle = setInterval(() => {
      setIndex((current) => (current + 1) % count);
    }, autoplayMs);
    return () => clearInterval(handle);
  }, [autoplayMs, count]);

  if (count === 0) return null;

  return (
    <section aria-label={label} className="w-full">
      <div className="relative overflow-hidden rounded-2xl border border-black/10 bg-white shadow-sm dark:border-white/10 dark:bg-zinc-950">
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {safeSlides.map((slide, slideIndex) => (
            <div
              key={`${baseId}-${slideIndex}`}
              className="min-w-full"
              aria-roledescription="slide"
              aria-label={`${label} ${slideIndex + 1} of ${count}`}
            >
              {slide}
            </div>
          ))}
        </div>

        {count > 1 ? (
          <>
            <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background/80 to-transparent dark:from-black/60" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background/80 to-transparent dark:from-black/60" />

            <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-4 p-4">
              <div className="flex items-center gap-2">
                {Array.from({ length: count }).map((_, dotIndex) => (
                  <button
                    key={`${baseId}-dot-${dotIndex}`}
                    type="button"
                    onClick={() => goTo(dotIndex)}
                    className={[
                      "h-2.5 w-2.5 rounded-full ring-1 ring-black/10 transition-colors dark:ring-white/10",
                      dotIndex === index
                        ? "bg-foreground"
                        : "bg-zinc-300 dark:bg-zinc-700",
                    ].join(" ")}
                    aria-label={`Go to slide ${dotIndex + 1}`}
                    aria-current={dotIndex === index ? "true" : undefined}
                  />
                ))}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={prev}
                  className="inline-flex h-9 items-center justify-center rounded-full border border-black/10 bg-background px-3 text-sm font-medium transition-colors hover:bg-black/[.04] dark:border-white/10 dark:hover:bg-white/[.06]"
                  aria-label="Previous slide"
                >
                  Prev
                </button>
                <button
                  type="button"
                  onClick={next}
                  className="inline-flex h-9 items-center justify-center rounded-full border border-black/10 bg-background px-3 text-sm font-medium transition-colors hover:bg-black/[.04] dark:border-white/10 dark:hover:bg-white/[.06]"
                  aria-label="Next slide"
                >
                  Next
                </button>
              </div>
            </div>
          </>
        ) : null}
      </div>
    </section>
  );
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}
