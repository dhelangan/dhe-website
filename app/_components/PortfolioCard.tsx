import Link from "next/link";

import LazyImage from "./LazyImage";

import {
  formatPortfolioPlatform,
  formatPortfolioStatus,
  formatPortfolioType,
  slugifyPortfolioTitle,
  type PortfolioItem,
} from "@/lib/portfolio";

export default function PortfolioCard({ item }: { item: PortfolioItem }) {
  return (
    <Link
          href={`/portfolio/read/${slugifyPortfolioTitle(item.title)}`}
          className="group grid gap-4 rounded-2xl border border-black/10 bg-surface p-4 shadow-sm transition-colors hover:bg-black/[.03] dark:border-white/10"
        >
          <div className="min-w-0 grid-cols-1 border-b border-black/10 pb-2 dark:border-white/10">
            <div className="flex flex-wrap items-center justify-between gap-1">
              <h3 className="truncate capitalize text-2xl font-semibold tracking-tight">{item.title}</h3>
              {item.status ? (
                <span className="rounded-full border capitalize border-black/10 bg-accent-orange px-2 py-0.5 text-xs font-semibold text-surface dark:border-white/10">
                  {formatPortfolioStatus(item.status)}
                </span>
              ) : null}
            </div>
          </div>
          
          <div className="group grid grid-cols-1 sm:grid-cols-2 w-full gap-4">
            <div className="grid-cols-1 sm:grid-cols-2 relative aspect-[4/2] max-h-[250px] w-full overflow-hidden rounded-xl bg-black/[.06] dark:bg-white/[.06]">
              <LazyImage
                src={item.thumbnailSrc}
                alt=""
                fill
                className="object-cover"
                sizes="300px"
                loading="lazy"
              />
            </div>

            <div className="min-w-0 grid-cols-1 sm:grid-cols-2 w-full ">
              <div className="flex flex-wrap items-center gap-2 ">
                <span className="rounded-full border border-black/10 bg-background px-2 py-0.5 text-xs font-semibold text-foreground dark:border-white/10">
                  {formatPortfolioType(item.type)}
                </span>

                {item.platforms.map((p) => (
                  <span
                    key={p}
                    className="rounded-full border border-black/10 bg-background px-2 py-0.5 text-xs font-semibold text-foreground dark:border-white/10"
                  >
                    {formatPortfolioPlatform(p)}
                  </span>
                ))}

                {item.genres.map((g) => (
                      <span
                        key={g}
                        className="rounded-full border border-black/10 bg-background px-2 py-0.5 text-xs font-semibold text-foreground dark:border-white/10"
                      >
                        {g.toString()}
                      </span>
                    ))}
              </div>
              
              <p className="mt-2 line-clamp-6 text-sm text-zinc-700 dark:text-zinc-300">
                {item.summary}
              </p>
              <div className="mt-3 text-sm font-semibold text-accent-orange transition-colors group-hover:text-accent-red">
                Read more 
                <svg className="ml-2 w-3 h-3 inline" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 8 14">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 13 5.7-5.326a.909.909 0 0 0 0-1.348L1 1"/>
            </svg>
              </div>
            </div>
          </div>
        </Link>
   
  );
}
