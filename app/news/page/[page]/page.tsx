import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import PageHeader from "@/app/_components/PageHeader";
import NewsCard from "@/app/_components/NewsCard";
import { getAllNews, getNewsPagination } from "@/lib/news";

const PAGE_SIZE = 3;

export const metadata = {
  title: "News",
};

export async function generateStaticParams() {
  const totalItems = getAllNews().length;
  const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));
  return Array.from({ length: totalPages }, (_, index) => ({
    page: String(index + 1),
  }));
}

function Pagination({
  currentPage,
  totalPages,
}: {
  currentPage: number;
  totalPages: number;
}) {
  if (totalPages <= 1) return null;

  const prevPage = currentPage > 1 ? currentPage - 1 : null;
  const nextPage = currentPage < totalPages ? currentPage + 1 : null;

  return (
    <nav className="mt-8 flex flex-wrap items-center justify-center gap-2" aria-label="News pagination">
      <Link
        href={prevPage ? `/news/page/${prevPage}` : `/news/page/${currentPage}`}
        aria-disabled={!prevPage}
        className={[
          "inline-flex h-10 items-center justify-center rounded-full border px-4 text-sm font-semibold transition-colors",
          prevPage
            ? "border-black/10 bg-surface hover:bg-black/[.04] dark:border-white/10 dark:hover:bg-white/[.06]"
            : "pointer-events-none border-black/10 bg-black/[.02] text-zinc-500 dark:border-white/10 dark:bg-white/[.03] dark:text-zinc-400",
        ].join(" ")}
      >
        Prev
      </Link>

      {Array.from({ length: totalPages }, (_, index) => {
        const page = index + 1;
        const active = page === currentPage;
        return (
          <Link
            key={page}
            href={`/news/page/${page}`}
            aria-current={active ? "page" : undefined}
            className={[
              "inline-flex size-10 items-center justify-center rounded-full border text-sm font-semibold transition-colors",
              active
                ? "border-black/20 bg-accent-orange text-black dark:border-white/10"
                : "border-black/10 bg-surface hover:bg-black/[.04] dark:border-white/10 dark:hover:bg-white/[.06]",
            ].join(" ")}
          >
            {page}
          </Link>
        );
      })}

      <Link
        href={nextPage ? `/news/page/${nextPage}` : `/news/page/${currentPage}`}
        aria-disabled={!nextPage}
        className={[
          "inline-flex h-10 items-center justify-center rounded-full border px-4 text-sm font-semibold transition-colors",
          nextPage
            ? "border-black/10 bg-surface hover:bg-black/[.04] dark:border-white/10 dark:hover:bg-white/[.06]"
            : "pointer-events-none border-black/10 bg-black/[.02] text-zinc-500 dark:border-white/10 dark:bg-white/[.03] dark:text-zinc-400",
        ].join(" ")}
      >
        Next
      </Link>
    </nav>
  );
}

export default async function NewsPage({
  params,
}: {
  params: Promise<{ page: string }>;
}) {
  const { page } = await params;
  const pageNumber = Number(page);
  if (!Number.isFinite(pageNumber) || !Number.isInteger(pageNumber)) notFound();
  if (pageNumber <= 0) redirect("/news/page/1");

  const { items, totalPages, currentPage } = getNewsPagination(pageNumber, PAGE_SIZE);
  if (pageNumber > totalPages) redirect(`/news/page/${totalPages}`);

  return (
    <div className="bg-background">
      <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:py-16">
        <div className="grid gap-10">
          <PageHeader
            title="News"
            description="Updates and announcements from Dhelangan Studio."
          />

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <NewsCard
                key={item.title}
                title={item.title}
                date={item.date}
                imageSrc={item.imageSrc}
              />
            ))}
          </div>

          <Pagination currentPage={currentPage} totalPages={totalPages} />
        </div>
      </div>
    </div>
  );
}

