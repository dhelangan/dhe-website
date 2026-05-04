"use client";

import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";

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

  const pointerId = useRef<number | null>(null);
  const pointerStartX = useRef<number | null>(null);
  const pointerStartY = useRef<number | null>(null);
  const pointerDeltaX = useRef(0);

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

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (count <= 1) return;
    if (e.pointerType !== "touch" && e.pointerType !== "pen") return;

    const target = e.target as HTMLElement | null;
    if (target?.closest("button, a, input, textarea, select")) return;

    pointerId.current = e.pointerId;
    pointerStartX.current = e.clientX;
    pointerStartY.current = e.clientY;
    pointerDeltaX.current = 0;
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (count <= 1) return;
    if (pointerId.current !== e.pointerId) return;
    if (pointerStartX.current === null || pointerStartY.current === null) return;

    const dx = e.clientX - pointerStartX.current;
    const dy = e.clientY - pointerStartY.current;

    // Only treat as swipe when horizontal intent is clear.
    if (Math.abs(dx) > Math.abs(dy)) pointerDeltaX.current = dx;
  };

  const endSwipe = (e: React.PointerEvent<HTMLDivElement>) => {
    if (pointerId.current !== e.pointerId) return;

    pointerId.current = null;
    pointerStartX.current = null;
    pointerStartY.current = null;

    const dx = pointerDeltaX.current;
    pointerDeltaX.current = 0;

    const threshold = 55;
    if (dx > threshold) prev();
    else if (dx < -threshold) next();
  };

  const cancelSwipe = (e: React.PointerEvent<HTMLDivElement>) => {
    if (pointerId.current !== e.pointerId) return;
    pointerId.current = null;
    pointerStartX.current = null;
    pointerStartY.current = null;
    pointerDeltaX.current = 0;
  };

  if (count === 0) return null;

  return (
    <section aria-label={label} className="w-full">
      <div
        className="relative max-w-full overflow-hidden rounded-2xl border border-black/10 bg-surface shadow-sm touch-pan-y dark:border-white/10"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endSwipe}
        onPointerCancel={cancelSwipe}
      >
        <div
          className="flex transition-transform duration-500 ease-out will-change-transform"
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

            <div className="bg-background block inset-x-0 bottom-0 z-20 flex items-center justify-between gap-4 p-4 pointer-events-auto">
              <div className="flex items-center gap-2">
                {Array.from({ length: count }).map((_, dotIndex) => (
                  <button
                    key={`${baseId}-dot-${dotIndex}`}
                    type="button"
                    onClick={() => goTo(dotIndex)}
                    className={[
                      "touch-manipulation h-2.5 w-2.5 rounded-full ring-1 ring-black/10 transition-colors dark:ring-white/10",
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
                  className="touch-manipulation inline-flex h-9 items-center justify-center rounded-full border border-black/10 bg-background px-3 text-xs font-medium transition-colors hover:bg-black/[.04] dark:border-white/10 dark:hover:bg-white/[.06]"
                  aria-label="Previous slide"
                >
                  <svg className="w-4 h-4 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 8 14">
    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 1 1.3 6.326a.91.91 0 0 0 0 1.348L7 13"/>
</svg>
                </button>
                <button
                  type="button"
                  onClick={next}
                  className="touch-manipulation inline-flex h-9 items-center justify-center rounded-full border border-black/10 bg-background px-3 text-xs font-medium transition-colors hover:bg-black/[.04] dark:border-white/10 dark:hover:bg-white/[.06]"
                  aria-label="Next slide"
                >
                  <svg className="w-4 h-4 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 8 14">
    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 13 5.7-5.326a.909.909 0 0 0 0-1.348L1 1"/>
</svg>
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



