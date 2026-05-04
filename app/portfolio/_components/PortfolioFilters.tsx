"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import {
  formatPortfolioPlatform,
  formatPortfolioStatus,
  formatPortfolioType,
  portfolioPlatforms,
  portfolioStatuses,
  portfolioTypes,
  type PortfolioPlatform,
  type PortfolioSort,
  type PortfolioStatus,
  type PortfolioType,
} from "@/lib/portfolio";

type Props = {
  initialType?: PortfolioType;
  initialStatus?: PortfolioStatus;
  initialPlatforms: PortfolioPlatform[];
  initialGenres: string[];
  initialSort: PortfolioSort;
  genreOptions: string[];
};

export default function PortfolioFilters({
  initialType,
  initialStatus,
  initialPlatforms,
  initialGenres,
  initialSort,
  genreOptions,
}: Props) {
  const router = useRouter();

  const [type, setType] = useState<PortfolioType | "">((initialType ?? "") as PortfolioType | "");
  const [status, setStatus] = useState<PortfolioStatus | "">((initialStatus ?? "") as PortfolioStatus | "");
  const [sort, setSort] = useState<PortfolioSort>(initialSort);
  const [platforms, setPlatforms] = useState<PortfolioPlatform[]>(initialPlatforms);
  const [genres, setGenres] = useState<string[]>(initialGenres);

  const sortedGenreOptions = useMemo(() => [...genreOptions].sort((a, b) => a.localeCompare(b)), [genreOptions]);

  function togglePlatform(value: PortfolioPlatform) {
    setPlatforms((current) => (current.includes(value) ? current.filter((p) => p !== value) : [...current, value]));
  }

  function toggleGenre(value: string) {
    setGenres((current) => (current.includes(value) ? current.filter((g) => g !== value) : [...current, value]));
  }

  function apply() {
    const params = new URLSearchParams();
    if (type) params.set("type", type);
    if (status) params.set("status", status);
    if (sort && sort !== "newest") params.set("sort", sort);
    for (const platform of platforms) params.append("platform", platform);
    for (const genre of genres) params.append("genre", genre);

    const qs = params.toString();
    router.push(qs ? `/portfolio?${qs}` : "/portfolio");
  }

  return (
    <div className="rounded-3xl border border-black/10 bg-surface p-6 shadow-sm dark:border-white/10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="grid gap-4 sm:grid-cols-3">
          <label className="grid gap-1 text-sm font-semibold">
            <span className="text-zinc-700 dark:text-zinc-300">Type</span>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as PortfolioType | "")}
              className="h-10 rounded-2xl border border-black/10 bg-background px-3 text-sm font-medium dark:border-white/10 dark:bg-zinc-950"
            >
              <option value="">All</option>
              {portfolioTypes.map((t) => (
                <option key={t} value={t}>
                  {formatPortfolioType(t)}
                </option>
              ))}
            </select>
          </label>

          <label className="grid gap-1 text-sm font-semibold">
            <span className="text-zinc-700 dark:text-zinc-300">Status</span>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as PortfolioStatus | "")}
              className="h-10 rounded-2xl border border-black/10 bg-background px-3 text-sm font-medium dark:border-white/10 dark:bg-zinc-950"
            >
              <option value="">All</option>
              {portfolioStatuses.map((s) => (
                <option key={s} value={s}>
                  {formatPortfolioStatus(s)}
                </option>
              ))}
            </select>
          </label>

          <label className="grid gap-1 text-sm font-semibold">
            <span className="text-zinc-700 dark:text-zinc-300">Sort</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as PortfolioSort)}
              className="h-10 rounded-2xl border border-black/10 bg-background px-3 text-sm font-medium dark:border-white/10 dark:bg-zinc-950"
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="title-asc">Title A → Z</option>
              <option value="title-desc">Title Z → A</option>
            </select>
          </label>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => router.push("/portfolio")}
            className="inline-flex h-10 items-center justify-center rounded-full border border-black/10 bg-background px-4 text-sm font-semibold transition-colors hover:bg-black/[.04] dark:border-white/10 dark:bg-zinc-950 dark:hover:bg-white/[.06]"
          >
            Clear
          </button>
          <button
            type="button"
            onClick={apply}
            className="inline-flex h-10 items-center justify-center rounded-full bg-accent-orange px-4 text-sm font-semibold text-black transition-colors hover:bg-[#ff6f10]"
          >
            Apply filters
          </button>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div>
          <div className="text-sm font-semibold tracking-tight">Platforms</div>
          <div className="mt-3 flex flex-wrap gap-2">
            {portfolioPlatforms.map((p) => {
              const checked = platforms.includes(p);
              return (
                <button
                  key={p}
                  type="button"
                  onClick={() => togglePlatform(p)}
                  className={[
                    "inline-flex h-9 items-center justify-center rounded-full border px-3 text-sm font-semibold transition-colors",
                    checked
                      ? "border-black/20 bg-accent-orange text-black dark:border-white/10"
                      : "border-black/10 bg-background hover:bg-black/[.04] dark:border-white/10 dark:bg-zinc-950 dark:hover:bg-white/[.06]",
                  ].join(" ")}
                >
                  {formatPortfolioPlatform(p)}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <div className="text-sm font-semibold tracking-tight">Genres</div>
          <div className="mt-3 flex flex-wrap gap-2">
            {sortedGenreOptions.map((g) => {
              const checked = genres.includes(g);
              return (
                <button
                  key={g}
                  type="button"
                  onClick={() => toggleGenre(g)}
                  className={[
                    "inline-flex h-9 items-center justify-center rounded-full border px-3 text-sm font-semibold transition-colors",
                    checked
                      ? "border-black/20 bg-accent-orange text-black dark:border-white/10"
                      : "border-black/10 bg-background hover:bg-black/[.04] dark:border-white/10 dark:bg-zinc-950 dark:hover:bg-white/[.06]",
                  ].join(" ")}
                >
                  {g}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

