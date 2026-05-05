import Image from "next/image";
import Link from "next/link";

import {
  formatPortfolioStatus,
  formatPortfolioType,
  slugifyPortfolioTitle,
  type PortfolioItem,
} from "@/lib/portfolio";

export default function PortfolioCard({ item }: { item: PortfolioItem }) {
  return (
    <Link
      href={`/portfolio/read/${slugifyPortfolioTitle(item.title)}`}
      className="group flex w-full gap-4 overflow-hidden rounded-3xl border border-black/10 bg-surface p-4 shadow-sm transition-colors hover:bg-black/[.03] dark:border-white/10"
    >
      <div className="relative aspect-[4/3] w-30 shrink-0 overflow-hidden rounded-2xl bg-black/[.06] dark:bg-white/[.06] sm:w-80">
        <Image
          src={item.thumbnailSrc}
          alt=""
          fill
          className="object-cover"
          sizes="160px"
        />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full border border-black/10 bg-background px-2 py-0.5 text-xs font-semibold text-foreground dark:border-white/10">
            {formatPortfolioType(item.type)}
          </span>
          <span className="rounded-full border border-black/10 bg-background px-2 py-0.5 text-xs font-semibold text-foreground dark:border-white/10">
            {formatPortfolioStatus(item.status)}
          </span>
        </div>

        <h2 className="mt-2 truncate text-lg font-semibold tracking-tight">{item.title}</h2>
        <p className="mt-1 line-clamp-2 text-sm leading-6 text-zinc-700 dark:text-zinc-300">
          {item.summary}
        </p>

        <div className="mt-3 text-sm font-semibold text-accent-orange transition-colors group-hover:text-accent-red">
          View project →
        </div>
      </div>
    </Link>
  );
}

