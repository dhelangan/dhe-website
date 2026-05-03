import Image from "next/image";
import Link from "next/link";

type ContentCardProps = {
  href: string;
  title: string;
  subtitle: string;
  imageSrc: string;
  badge?: string;
};

export default function ContentCard({
  href,
  title,
  subtitle,
  imageSrc,
  badge,
}: ContentCardProps) {
  return (
    <Link
      href={href}
      className="group flex gap-4 rounded-2xl border border-black/10 bg-white p-4 shadow-sm transition-colors hover:bg-zinc-50 dark:border-white/10 dark:bg-zinc-950 dark:hover:bg-zinc-900/30"
    >
      <div className="relative aspect-[4/3] w-28 overflow-hidden rounded-xl bg-zinc-100 dark:bg-zinc-900">
        <Image src={imageSrc} alt="" fill className="object-cover" sizes="112px" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="truncate font-semibold tracking-tight">{title}</h3>
          {badge ? (
            <span className="rounded-full border border-black/10 bg-zinc-50 px-2 py-0.5 text-xs font-medium text-zinc-700 dark:border-white/10 dark:bg-zinc-900 dark:text-zinc-200">
              {badge}
            </span>
          ) : null}
        </div>
        <p className="mt-1 line-clamp-2 text-sm text-zinc-600 dark:text-zinc-400">
          {subtitle}
        </p>
        <div className="mt-3 text-sm font-medium text-zinc-700 transition-colors group-hover:text-foreground dark:text-zinc-300">
          Read more →
        </div>
      </div>
    </Link>
  );
}
