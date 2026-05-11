import Link from "next/link";

import LazyImage from "./LazyImage";

type ContentCardProps = {
  href: string;
  title: string;
  subtitle: string;
  imageSrc: string;
  badge?: string;
  type?: string;
  platforms?: string[];
  genres?: string[];
};

export default function ContentCard({
  href,
  title,
  subtitle,
  imageSrc,
  badge,
  type,
  platforms,
  genres,
}: ContentCardProps) {
  return (
    <Link
      href={href}
      className="group grid gap-4 rounded-2xl border border-black/10 bg-surface p-4 shadow-sm transition-colors hover:bg-black/[.03] dark:border-white/10"
    >
      <div className="min-w-0 grid-cols-1">
        <div className="flex flex-wrap items-center justify-between gap-1 border-b border-black/10 pb-2 dark:border-white/10">
          <h3 className="truncate capitalize text-2xl font-semibold tracking-tight">{title}</h3>
          {badge ? (
            <span className="rounded-full border capitalize border-black/10 bg-accent-orange px-2 py-0.5 text-xs font-semibold text-surface dark:border-white/10">
              {badge}
            </span>
          ) : null}
        </div>
      </div>
      
      <div className="group grid grid-cols-1 sm:grid-cols-2 w-full gap-4">
        <div className="grid-cols-1 sm:grid-cols-2 relative aspect-[5/3] w-full overflow-hidden rounded-xl bg-black/[.06] dark:bg-white/[.06]">
          <LazyImage
            src={imageSrc}
            alt={`${title} cover image`}
            fill
            className="object-cover"
            sizes="112px"
            loading="lazy"
          />
        </div>
        <div className="min-w-0 grid-cols-1 sm:grid-cols-2 w-full">
          
          <div className="flex flex-wrap items-center gap-2 capitalize">
            <span className="rounded-full border border-black/10 bg-background px-2 py-0.5 text-xs font-semibold text-foreground dark:border-white/10">
              {type}
            </span>

            {platforms?.map((p) => (
              <span
                key={p}
                className="rounded-full border border-black/10 bg-background px-2 py-0.5 text-xs font-semibold text-foreground dark:border-white/10"
              >
                {p.toString()}
              </span>
            ))}

            {genres?.map((g) => (
                  <span
                    key={g}
                    className="rounded-full border border-black/10 bg-background px-2 py-0.5 text-xs font-semibold text-foreground dark:border-white/10"
                  >
                    {g.toString()}
                  </span>
                ))}
          </div>

          <p className="mt-2 line-clamp-4 text-sm text-zinc-700 dark:text-zinc-300">
            {subtitle}
          </p>
          <div className="mt-3 text-sm font-semibold text-accent-orange transition-colors group-hover:text-accent-red">
            Read more 
          </div>
        </div>
      </div>
    </Link>
  );
}
