"use client";

import { useMemo, useState } from "react";
import type { ShopProduct } from "@/lib/shop";

function isShopeeUrl(value: string) {
  try {
    return new URL(value).hostname.toLowerCase().includes("shopee");
  } catch {
    return false;
  }
}

function isTokopediaUrl(value: string) {
  try {
    return new URL(value).hostname.toLowerCase().includes("tokopedia");
  } catch {
    return false;
  }
}

function chunk<T>(items: T[], size: number) {
  const out: T[][] = [];
  for (let i = 0; i < items.length; i += size) out.push(items.slice(i, i + size));
  return out;
}

export default function ProductCard({ product }: { product: ShopProduct }) {
  const images = useMemo(() => (Array.isArray(product.images) ? product.images.filter(Boolean) : []), [product.images]);
  const [active, setActive] = useState(0);
  const safeActive = Math.max(0, Math.min(images.length - 1, active));
  const activeSrc = images[safeActive] ?? "";
  const pages = useMemo(() => chunk(images, 4), [images]);
  const pageIndex = images.length > 0 ? Math.floor(safeActive / 4) : 0;
  const thumbnails = pages[pageIndex] ?? [];

  const prev = () => setActive((v) => (images.length === 0 ? 0 : (v - 1 + images.length) % images.length));
  const next = () => setActive((v) => (images.length === 0 ? 0 : (v + 1) % images.length));

  const ctaLabel = isTokopediaUrl(product.url) ? "Tokopedia" : isShopeeUrl(product.url) ? "Shopee" : "Open";

  return (
    <div className="w-full rounded-3xl border border-black/10 bg-surface p-6 shadow-sm dark:border-white/10">
      <div className="grid gap-6 md:grid-cols-[280px_1fr]">
        <div className="grid gap-3">
          <div className="overflow-hidden rounded-2xl border border-black/10 bg-background dark:border-white/10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            {activeSrc ? (
              <img src={activeSrc} alt="" className="h-64 w-full object-cover" loading="lazy" />
            ) : (
              <div className="grid h-64 place-items-center text-sm text-zinc-600 dark:text-zinc-300">No image</div>
            )}
          </div>

          {images.length > 1 && (
            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={prev}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-black/10 bg-background text-2xl font-semibold text-zinc-900 shadow-sm transition-colors hover:bg-zinc-50 dark:border-white/10 dark:bg-black/20 dark:text-zinc-50 dark:hover:bg-black/30"
                  aria-label="Previous image"
                >
                  <svg className="w-4 h-4 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 8 14">
    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 1 1.3 6.326a.91.91 0 0 0 0 1.348L7 13"/>
</svg>
                </button>
                <div className="text-xs text-zinc-600 dark:text-zinc-300">
                  {safeActive + 1} / {images.length}
                </div>
                <button
                  type="button"
                  onClick={next}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-black/10 bg-background text-2xl font-semibold text-zinc-900 shadow-sm transition-colors hover:bg-zinc-50 dark:border-white/10 dark:bg-black/20 dark:text-zinc-50 dark:hover:bg-black/30"
                  aria-label="Next image"
                >
                  <svg className="w-4 h-4 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 8 14">
    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 13 5.7-5.326a.909.909 0 0 0 0-1.348L1 1"/>
</svg>
                </button>
              </div>

              <div className="grid grid-cols-4 gap-2">
                {thumbnails.map((src) => {
                  const idx = images.indexOf(src);
                  const selected = idx === safeActive;
                  return (
                    <button
                      key={src}
                      type="button"
                      onClick={() => setActive(idx)}
                      className={`overflow-hidden rounded-xl border ${
                        selected
                          ? "border-black/30 dark:border-white/30"
                          : "border-black/10 dark:border-white/10"
                      } bg-background`}
                      aria-label="Select image"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={src} alt="" className="h-16 w-full object-cover" loading="lazy" />
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <div className="grid content-start gap-3 min-w-0">
          <div className="grid gap-1">
            <h2 className="text-lg font-semibold tracking-tight">{product.title}</h2>
            {(product.price || product.currency) && (
              <div className="text-base font-semibold tracking-tight">
                {product.currency ? `${product.currency} ` : ""}
                {product.price ?? ""}
              </div>
            )}
          </div>

          {product.description && (
            <p className="text-sm leading-6 text-zinc-800 dark:text-zinc-200 whitespace-pre-line">
              {product.description}
            </p>
          )}

          <div className="mt-2 flex items-end justify-end">
            {product.url ? (
              <a
                href={product.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded-full bg-accent-orange px-5 py-2.5 text-sm font-semibold text-black transition-colors hover:bg-[#ff6f10]"
              >
                {ctaLabel}
              </a>
            ) : (
              <span className="text-xs text-zinc-600 dark:text-zinc-300">No product link</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

