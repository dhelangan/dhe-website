import Link from "next/link";
import { notFound } from "next/navigation";
import ZoomableImage from "../../../_components/ZoomableImage";
import Reveal from "../../../_components/Reveal";

import {
  formatPortfolioPlatform,
  formatPortfolioStatus,
  formatPortfolioType,
  getPortfolioBySlug,
} from "@/lib/portfolio";

export const dynamic = "force-dynamic";

function YouTubeEmbed({ url }: { url: string }) {
  let embedUrl: string | null = null;
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace(/^www\./, "");
    if (host === "youtu.be") {
      const id = parsed.pathname.split("/").filter(Boolean)[0];
      if (id) embedUrl = `https://www.youtube.com/embed/${id}`;
    } else if (host === "youtube.com" || host === "m.youtube.com") {
      const id = parsed.searchParams.get("v");
      if (id) embedUrl = `https://www.youtube.com/embed/${id}`;
    }
  } catch {
    embedUrl = null;
  }

  if (!embedUrl) return null;

  return (
    <div className="overflow-hidden rounded-3xl border border-black/10 bg-black/[.06] dark:border-white/10 dark:bg-white/[.06]">
      <div className="relative aspect-video w-full">
        <iframe
          className="absolute inset-0 h-full w-full"
          src={embedUrl}
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
    </div>
  );
}

function StoreButton({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="inline-flex h-11 items-center justify-center rounded-full border border-black/10 bg-background px-6 text-sm font-semibold transition-colors hover:bg-black/[.04] dark:border-white/10 dark:bg-zinc-950 dark:hover:bg-white/[.06]"
    >
      {label}
    </a>
  );
}

export default async function PortfolioReadPage({
  params,
}: {
  params: Promise<{ title: string }>;
}) {
  const { title } = await params;
  const item = await getPortfolioBySlug(title);
  if (!item) notFound();

  return (
    <div className="bg-background">
      <div className="mx-auto w-full max-w-6xl pt-8 pb-4 px-4">
        <div className="grid gap-8">
          <Reveal>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Link
              href="/portfolio"
              className="inline text-sm font-semibold text-zinc-700 transition-colors hover:text-foreground dark:text-zinc-300"
            >
              <svg className="inline w-4 h-4 mr-2 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 8 14">
    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 1 1.3 6.326a.91.91 0 0 0 0 1.348L7 13"/>
</svg>  Back to portfolio
            </Link>

            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-black/10 bg-surface px-2 py-0.5 text-xs font-semibold dark:border-white/10">
                {formatPortfolioType(item.type)}
              </span>
              <span className="rounded-full border border-black/10 bg-surface px-2 py-0.5 text-xs font-semibold dark:border-white/10">
                {formatPortfolioStatus(item.status)}
              </span>
              {item.platforms.map((p) => (
                <span
                  key={p}
                  className="rounded-full border border-black/10 bg-surface px-2 py-0.5 text-xs font-semibold dark:border-white/10"
                >
                  {formatPortfolioPlatform(p)}
                </span>
              ))}
              {item.genres.map((g) => (
                <span
                  key={g}
                  className="rounded-full border border-black/10 bg-surface px-2 py-0.5 text-xs font-semibold dark:border-white/10"
                >
                  {g.toString()}
                </span>
              ))}
            </div>
          </div>
          </Reveal>

          <Reveal as="header" className="grid gap-2" delayMs={40}>
            <h1 className="text-3xl font-semibold tracking-tight">{item.title}</h1>
            <p className="max-w-3xl text-base leading-7 text-zinc-700 dark:text-zinc-300">
              {item.summary}
            </p>
          </Reveal>

          <Reveal
              as="section"
              className="block space-y-8 rounded-3xl border border-black/10 bg-surface p-4 shadow-sm dark:border-white/10"
              delayMs={60}
            >

          {item.youtubeUrl ? (
            <Reveal delayMs={70}>
              <YouTubeEmbed url={item.youtubeUrl} />
            </Reveal>
          ) : null}

          <Reveal as="section" className="grid gap-4" delayMs={100}>
            <h2 className="text-lg font-semibold tracking-tight">Gallery</h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {item.gallerySrcs.map((src) => (
                <ZoomableImage
                  key={src}
                  src={src}
                  alt={`${item.title} gallery image`}
                  sizes="(min-width: 1024px) 22vw, (min-width: 640px) 45vw, 100vw"
                  containerClassName="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-black/10 bg-black/[.06] dark:border-white/10 dark:bg-white/[.06]"
                />
              ))}
            </div>
          </Reveal>

          <Reveal as="article" className="grid gap-4 text-sm leading-7 text-zinc-800 dark:text-zinc-200" delayMs={130}>
            {item.content.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </Reveal>

          {item.availableOn ? (
            <Reveal as="section" className="rounded-3xl border border-black/10 bg-surface p-6 shadow-sm dark:border-white/10" delayMs={160}>
              <h2 className="text-lg font-semibold tracking-tight">Available on</h2>
              <div className="mt-4 flex flex-wrap gap-3">
                {item.availableOn.itch ? <StoreButton href={item.availableOn.itch} label="Itch.io" /> : null}
                {item.availableOn.steam ? <StoreButton href={item.availableOn.steam} label="Steam" /> : null}
                {item.availableOn.googlePlay ? (
                  <StoreButton href={item.availableOn.googlePlay} label="Google Play" />
                ) : null}
                {item.availableOn.other?.map((o) => (
                  <StoreButton key={o.href} href={o.href} label={o.label} />
                ))}
              </div>
            </Reveal>
          ) : null}

          </Reveal>
        </div>
      </div>
    </div>
  );
}
