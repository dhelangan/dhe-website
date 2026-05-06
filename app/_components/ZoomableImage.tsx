"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";

import LazyImage from "./LazyImage";
import Portal from "./Portal";

type ZoomableImageProps = {
  src: string;
  alt: string;
  sizes: string;
  containerClassName: string;
  imageClassName?: string;
  priority?: boolean;
};

export default function ZoomableImage({
  src,
  alt,
  sizes,
  containerClassName,
  imageClassName,
  priority,
}: ZoomableImageProps) {
  const [open, setOpen] = useState(false);
  const [scale, setScale] = useState(1);
  const dialogId = useId();
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);

  const close = () => {
    setOpen(false);
    setScale(1);
  };

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    requestAnimationFrame(() => closeButtonRef.current?.focus());
  }, [open]);

  const scaleLabel = useMemo(() => `${Math.round(scale * 100)}%`, [scale]);

  return (
    <>
      <button
        type="button"
        className={[containerClassName, "group relative block"].join(" ")}
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={open ? dialogId : undefined}
      >
        <LazyImage
          src={src}
          alt={alt}
          fill
          className={["object-cover", imageClassName ?? ""].join(" ")}
          sizes={sizes}
          loading={priority ? "eager" : "lazy"}
          priority={priority}
        />
        <span className="pointer-events-none absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100 bg-black/10 dark:bg-white/10" />
      </button>

      {open ? (
        <Portal>
        <div
          id={dialogId}
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[80] bg-black/70 p-4 sm:p-8"
          onClick={close}
        >
          <div className="relative mx-auto flex h-full w-full max-w-6xl items-center justify-center">
            <div
              className="relative h-full w-full overflow-hidden rounded-2xl bg-black"
              onClick={(e) => e.stopPropagation()}
              onWheel={(e) => {
                e.preventDefault();
                const delta = e.deltaY;
                const next = delta > 0 ? scale / 1.12 : scale * 1.12;
                setScale(clamp(next, 1, 4));
              }}
            >
              <div className="absolute right-3 top-3 z-10 flex items-center gap-2">
                <span className="rounded-full bg-black/60 px-3 py-1 text-xs font-semibold text-white">
                  {scaleLabel}
                </span>
                <button
                  type="button"
                  className="inline-flex h-9 items-center justify-center rounded-full bg-white/10 px-4 text-sm font-semibold text-white transition-colors hover:bg-white/20"
                  onClick={() => setScale((v) => clamp(v / 1.25, 1, 4))}
                >
                  −
                </button>
                <button
                  type="button"
                  className="inline-flex h-9 items-center justify-center rounded-full bg-white/10 px-4 text-sm font-semibold text-white transition-colors hover:bg-white/20"
                  onClick={() => setScale((v) => clamp(v * 1.25, 1, 4))}
                >
                  +
                </button>
                <button
                  type="button"
                  ref={closeButtonRef}
                  className="inline-flex h-9 items-center justify-center rounded-full bg-white/10 px-4 text-sm font-semibold text-white transition-colors hover:bg-white/20"
                  onClick={close}
                >
                  Close
                </button>
              </div>

              <div className="relative h-full w-full">
                <div
                  className="absolute inset-0 flex items-center justify-center"
                  onClick={close}
                  style={{ transform: `scale(${scale})` }}
                >
                  <div className="relative h-full w-full">
                    <LazyImage
                      src={src}
                      alt={alt}
                      fill
                      className="object-contain"
                      sizes="100vw"
                      loading="eager"
                      priority
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        </Portal>
      ) : null}
    </>
  );
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}
