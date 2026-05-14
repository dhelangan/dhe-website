import Link from "next/link";
import { headers } from "next/headers";
import { notFound } from "next/navigation";

import Reveal from "../../../_components/Reveal";
import { type ServicesApiResponse, slugifyServiceTitle } from "@/lib/services";

export const dynamic = "force-dynamic";

function basicSanitizeHtml(html: string) {
  return (
    html
      // Drop script tags entirely.
      .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
      // Drop inline event handlers like onclick="...".
      .replace(/\son\w+\s*=\s*(['"]).*?\1/gi, "")
      // Prevent javascript: URLs in href/src.
      .replace(/javascript:/gi, "")
  );
}

async function getServicesData(): Promise<ServicesApiResponse> {
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
  const proto = h.get("x-forwarded-proto") ?? "http";
  const baseUrl = `${proto}://${host}`;
  const cookie = h.get("cookie") ?? undefined;

  const res = await fetch(`${baseUrl}/api/services`, {
    headers: cookie ? { cookie } : undefined,
    next: { revalidate: 60 },
  });

  if (!res.ok) return { services: [], projects: [], qna: [], reviews: [] };
  return (await res.json()) as ServicesApiResponse;
}

export default async function ServiceReadPage({
  params,
}: {
  params: Promise<{ title: string }>;
}) {
  const { title: slug } = await params;
  const data = await getServicesData();
  const services = data.services ?? [];

  const fallbackId = slug.startsWith("service-") ? Number(slug.slice("service-".length)) : NaN;
  const service =
    services.find((s) => (Number.isFinite(fallbackId) ? s.id === fallbackId : false)) ??
    services.find((s) => slugifyServiceTitle((s.title ?? "").trim()) === slug) ??
    null;

  if (!service) notFound();

  const rawHtml = (service.content ?? "").trim();
  const safeHtml = rawHtml ? basicSanitizeHtml(rawHtml) : "";

  return (
    <div className="bg-background">
      <div className="mx-auto w-full max-w-6xl pt-8 pb-4 px-4">
        <div className="grid gap-6">
          <Reveal>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <Link
                href="/services"
                className="inline text-sm font-semibold text-zinc-700 transition-colors hover:text-foreground dark:text-zinc-300"
              >
               <svg className="inline w-4 h-4 mr-2 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 8 14">
    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 1 1.3 6.326a.91.91 0 0 0 0 1.348L7 13"/>
</svg> Back to services
              </Link>
              <div className="rounded-full border border-black/10 bg-surface px-2 py-0.5 text-xs font-semibold dark:border-white/10">
                {service.category ?? ""}
              </div>
            </div>
          </Reveal>

          <Reveal as="header" className="grid gap-2" delayMs={40}>
            <h1 className="text-3xl font-semibold tracking-tight">{service.title ?? ""}</h1>
            {service.description ? (
              <p className="text-base leading-7 text-zinc-700 dark:text-zinc-300">{service.description}</p>
            ) : null}
          </Reveal>

          <Reveal
            as="section"
            className="block space-y-8 rounded-3xl border border-black/10 bg-surface p-4 shadow-sm dark:border-white/10"
            delayMs={60}
          >

            <Reveal as="article" className="grid gap-4" delayMs={80}>
              {safeHtml ? (
                <div
                  className="text-sm leading-7 text-zinc-800 dark:text-zinc-200
                    [&_h1]:text-2xl [&_h1]:font-semibold [&_h1]:tracking-tight
                    [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:tracking-tight
                    [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:tracking-tight
                    [&_p]:my-3
                    [&_ul]:my-3 [&_ul]:list-disc [&_ul]:pl-6
                    [&_ol]:my-3 [&_ol]:list-decimal [&_ol]:pl-6
                    [&_a]:font-semibold [&_a]:text-accent-orange [&_a]:underline
                    [&_blockquote]:border-l-2 [&_blockquote]:border-black/10 [&_blockquote]:pl-4 dark:[&_blockquote]:border-white/10
                    [&_code]:rounded [&_code]:bg-black/[.06] [&_code]:px-1 [&_code]:py-0.5 dark:[&_code]:bg-white/[.06]
                    [&_pre]:overflow-x-auto [&_pre]:rounded-2xl [&_pre]:bg-black/[.06] [&_pre]:p-4 dark:[&_pre]:bg-white/[.06]"
                  dangerouslySetInnerHTML={{ __html: safeHtml }}
                />
              ) : (
                <div className="rounded-3xl border border-black/10 p-6 text-sm text-zinc-700 dark:border-white/10 dark:text-zinc-300">
                  Content is coming soon for this service.
                </div>
              )}
            </Reveal>
          </Reveal>
        </div>
      </div>
    </div>
  );
}
