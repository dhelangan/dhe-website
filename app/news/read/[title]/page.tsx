import Link from "next/link";
import { notFound } from "next/navigation";
import ZoomableImage from "../../../_components/ZoomableImage";
import Reveal from "../../../_components/Reveal";

import { formatNewsDate, getNewsBySlug } from "@/lib/news";

export default async function NewsReadPage({
  params,
}: {
  params: Promise<{ title: string }>;
}) {
  const { title } = await params;
  const newsItem = await getNewsBySlug(title);
  if (!newsItem) notFound();

  return (
    <div className="bg-background">
      <div className="mx-auto w-full max-w-6xl pt-8 pb-4 px-4">
        <div className="grid gap-6">
          <Reveal>
          <div className="flex items-center justify-between gap-3">
            <Link
              href="/news"
              className="inlinetext-sm font-semibold text-zinc-700 transition-colors hover:text-foreground dark:text-zinc-300"
            >
              <svg className="inline w-4 h-4 mr-2 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 8 14">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 1 1.3 6.326a.91.91 0 0 0 0 1.348L7 13"/>
            </svg> Back to news
            </Link>
            <div className="rounded-full border border-black/10 bg-surface px-2 py-0.5 text-xs font-semibold dark:border-white/10">
              {formatNewsDate(newsItem.date)}
            </div>
          </div>
          </Reveal>

          <Reveal as="header" className="grid gap-2" delayMs={40}>
            <h1 className="text-3xl font-semibold tracking-tight">{newsItem.title}</h1>
            <p className="text-base leading-7 text-zinc-700 dark:text-zinc-300">
              {newsItem.excerpt}
            </p>
          </Reveal>

            <Reveal
              as="section"
              className="block space-y-8 rounded-3xl border border-black/10 bg-surface p-4 shadow-sm dark:border-white/10"
              delayMs={60}
            >

            <Reveal delayMs={70}>
              <ZoomableImage
                src={newsItem.imageSrc}
                alt={newsItem.title}
                sizes="(min-width: 768px) 720px, 100vw"
                containerClassName="relative aspect-[16/9] w-full overflow-hidden rounded-3xl border border-black/10 bg-black/[.06] dark:border-white/10 dark:bg-white/[.06]"
                priority
              />
            </Reveal>

            <Reveal as="article" className="grid gap-4 text-sm leading-7 text-zinc-800 dark:text-zinc-200" delayMs={100}>
              {newsItem.content.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </Reveal>

          </Reveal>
        </div>
      </div>
    </div>
  );
}
