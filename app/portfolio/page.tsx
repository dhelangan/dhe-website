import PageHeader from "../_components/PageHeader";
import PortfolioCard from "../_components/PortfolioCard";

import PortfolioFilters from "./_components/PortfolioFilters";

import {
  filterPortfolio,
  getAllPortfolio,
  sortPortfolio,
  type PortfolioPlatform,
  type PortfolioSort,
  type PortfolioStatus,
  type PortfolioType,
} from "@/lib/portfolio";

export const metadata = {
  title: "Portfolio",
};

function normalizeMulti(value: string | string[] | undefined) {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

function isPortfolioType(value: string): value is PortfolioType {
  return value === "board" || value === "digital";
}

function isPortfolioStatus(value: string): value is PortfolioStatus {
  return value === "in-development" || value === "released";
}

function isPortfolioPlatform(value: string): value is PortfolioPlatform {
  return value === "tabletop" || value === "pc" || value === "mobile" || value === "vr-ar" || value === "web3";
}

function isPortfolioSort(value: string): value is PortfolioSort {
  return value === "newest" || value === "oldest" || value === "title-asc" || value === "title-desc";
}

export default async function PortfolioPage({
  searchParams,
}: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedSearchParams = (await searchParams) ?? {};

  const rawType = resolvedSearchParams.type;
  const rawStatus = resolvedSearchParams.status;
  const rawSort = resolvedSearchParams.sort;
  const rawPlatforms = normalizeMulti(resolvedSearchParams.platform);
  const rawGenres = normalizeMulti(resolvedSearchParams.genre);

  const type = typeof rawType === "string" && isPortfolioType(rawType) ? rawType : undefined;
  const status = typeof rawStatus === "string" && isPortfolioStatus(rawStatus) ? rawStatus : undefined;
  const sort: PortfolioSort = typeof rawSort === "string" && isPortfolioSort(rawSort) ? rawSort : "newest";
  const platforms: PortfolioPlatform[] = rawPlatforms.filter(isPortfolioPlatform);
  const genres = rawGenres.filter((g) => typeof g === "string" && g.trim().length > 0);

  const all = getAllPortfolio();
  const genreOptions = Array.from(new Set(all.flatMap((p) => p.genres)));

  const filtered = filterPortfolio(all, { type, status, platforms, genres });
  const sorted = sortPortfolio(filtered, sort);

  return (
    <div className="bg-background">
      <div className="mx-auto w-full max-w-6xl px-4 p-0">
        <div className="grid gap-8">
          <PageHeader
            title="Portfolio"
            description="A selection of tabletop and digital work—prototypes, slices, and in-progress projects."
          />

          <PortfolioFilters
            initialType={type}
            initialStatus={status}
            initialPlatforms={platforms}
            initialGenres={genres}
            initialSort={sort}
            genreOptions={genreOptions}
          />

          <div className="grid gap-4">
            {sorted.map((item) => (
              <PortfolioCard key={item.title} item={item} />
            ))}
          </div>

          {sorted.length === 0 ? (
            <div className="rounded-3xl border border-black/10 bg-surface p-8 text-sm text-zinc-700 dark:border-white/10 dark:text-zinc-300">
              No projects match those filters.
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

