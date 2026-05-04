import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { formatNewsDate, getAllNews, getNewsBySlug, slugifyNewsTitle } from "@/lib/news";

export async function generateStaticParams() {
  return getAllNews().map((item) => ({
    title: slugifyNewsTitle(item.title),
  }));
}

export default async function NewsReadPage({
  params,
}: {
  params: Promise<{ title: string }>;
}) {
  const { title } = await params;
  const newsItem = getNewsBySlug(title);
  if (!newsItem) notFound();

  return (
    <div className="bg-background">
      <div className="mx-auto w-full max-w-3xl px-4 p-0">
        <div className="grid gap-6">
          <div className="flex items-center justify-between gap-3">
            <Link
              href="/news"
              className="text-sm font-semibold text-zinc-700 transition-colors hover:text-foreground dark:text-zinc-300"
            >
              ← Back to news
            </Link>
            <div className="text-sm font-semibold text-zinc-600 dark:text-zinc-300">
              {formatNewsDate(newsItem.date)}
            </div>
          </div>

          <header className="grid gap-2">
            <h1 className="text-3xl font-semibold tracking-tight">{newsItem.title}</h1>
            <p className="text-base leading-7 text-zinc-700 dark:text-zinc-300">
              {newsItem.excerpt}
            </p>
          </header>

          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-3xl border border-black/10 bg-black/[.06] dark:border-white/10 dark:bg-white/[.06]">
            <Image
              src={newsItem.imageSrc}
              alt=""
              fill
              className="object-cover"
              sizes="(min-width: 768px) 720px, 100vw"
              priority
            />
          </div>

          <article className="grid gap-4 text-sm leading-7 text-zinc-800 dark:text-zinc-200">
            {newsItem.content.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </article>
        </div>
      </div>
    </div>
  );
}

