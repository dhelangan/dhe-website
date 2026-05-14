import Link from "next/link";

import LazyImage from "./LazyImage";

import { formatNewsDate, slugifyNewsTitle } from "@/lib/news";

type NewsCardProps = {
  title: string;
  date: string;
  imageSrc: string;
  href?: string;
};

export default function NewsCard({ title, date, imageSrc, href }: NewsCardProps) {
  const resolvedHref = href ?? `/news/read/${slugifyNewsTitle(title)}`;

  return (
    <Link
      href={resolvedHref}
      className="group overflow-hidden rounded-2xl border border-black/10 bg-surface shadow-sm transition-colors hover:bg-black/[.03] dark:border-white/10"
    >
      <div className="relative aspect-[12/14] w-full overflow-hidden bg-black/[.06] dark:bg-white/[.06]">
        <LazyImage
          src={imageSrc}
          alt=""
          fill
          className="object-cover"
          sizes="(min-width: 1024px) 20vw, 100vw"
          loading="lazy"
        />
      </div>
      <div className="p-4">
        <div className="text-xs font-semibold text-zinc-600 dark:text-zinc-300">
          {formatNewsDate(date)}
        </div>
        <h3 className="mt-1 line-clamp-2 text-base font-semibold tracking-tight">
          {title}
        </h3>
        <div className="mt-3 text-sm font-semibold text-accent-orange transition-colors group-hover:text-accent-red">
          Read 
          <svg className="ml-2 w-3 h-3 inline" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 8 14">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 13 5.7-5.326a.909.909 0 0 0 0-1.348L1 1"/>
            </svg>
        </div>
      </div>
    </Link>
  );
}
