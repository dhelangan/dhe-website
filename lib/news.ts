export type NewsItem = {
  id: string;
  published: boolean;
  title: string;
  date: string; // ISO-8601
  imageSrc: string;
  excerpt: string;
  content: string[];
};

export function slugifyNewsTitle(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function formatNewsDate(isoDate: string) {
  // Keep this deterministic across runtimes (avoid locale/timezone differences).
  // Ex: 2026-05-04 or 2025-09-26T08:02:02+00:00 -> May 4, 2026
  const datePart = isoDate.split("T")[0] ?? isoDate;
  const [year, month, day] = datePart.split("-").map(Number);
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const safeMonth = Number.isFinite(month) ? month : 1;
  const safeDay = Number.isFinite(day) ? day : 1;
  const safeYear = Number.isFinite(year) ? year : 1970;
  return `${months[Math.min(12, Math.max(1, safeMonth)) - 1]} ${safeDay}, ${safeYear}`;
}

async function getBaseUrlFromHeaders(): Promise<string | null> {
  try {
    // Keep this request-scoped so it works only when called from a Server Component / Route Handler.
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { headers } = require("next/headers") as typeof import("next/headers");
    const h = await headers();
    const host = h.get("x-forwarded-host") ?? h.get("host");
    if (!host) return null;
    const proto = h.get("x-forwarded-proto") ?? "http";
    return `${proto}://${host}`;
  } catch {
    return null;
  }
}

async function fetchNewsFromApi(): Promise<NewsItem[]> {
  const baseUrl = await getBaseUrlFromHeaders();
  if (!baseUrl) return [];

  const res = await fetch(`${baseUrl}/api/news`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) return [];

  const data = (await res.json()) as unknown;
  if (!Array.isArray(data)) return [];

  return data
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      const v = item as Record<string, unknown>;
      return {
        id: typeof v.id === "string" ? v.id : String(v.id ?? ""),
        published: Boolean(v.published),
        title: typeof v.title === "string" ? v.title : String(v.title ?? ""),
        date: typeof v.date === "string" ? v.date : String(v.date ?? ""),
        imageSrc: typeof v.imageSrc === "string" ? v.imageSrc : String(v.imageSrc ?? ""),
        excerpt: typeof v.excerpt === "string" ? v.excerpt : String(v.excerpt ?? ""),
        content: Array.isArray(v.content) ? v.content.map(String) : [],
      } satisfies NewsItem;
    })
    .filter(Boolean) as NewsItem[];
}

export async function getAllNews() {
  const items = await fetchNewsFromApi();
  return items
    .filter((n) => n.published)
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
}

export async function getNewsBySlug(slug: string) {
  const all = await getAllNews();
  return all.find((item) => slugifyNewsTitle(item.title) === slug) ?? null;
}

export async function getLatestNews(limit: number) {
  const all = await getAllNews();
  return all.slice(0, Math.max(0, limit));
}

export async function getNewsPagination(page: number, pageSize: number) {
  const allNews = await getAllNews();
  const totalItems = allNews.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const currentPage = Math.min(Math.max(1, page), totalPages);
  const startIndex = (currentPage - 1) * pageSize;
  const items = allNews.slice(startIndex, startIndex + pageSize);

  return {
    items,
    totalItems,
    totalPages,
    currentPage,
  };
}
