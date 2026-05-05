export type PortfolioType = "board" | "digital";
export type PortfolioStatus = "in-development" | "released";
export type PortfolioPlatform = "tabletop" | "pc" | "mobile" | "vr-ar" | "web3";

export type PortfolioItem = {
  id?: string;
  title: string;
  date: string; // ISO-8601
  type: PortfolioType;
  status: PortfolioStatus;
  platforms: PortfolioPlatform[];
  genres: string[];
  summary: string;
  thumbnailSrc: string;
  gallerySrcs: string[];
  youtubeUrl?: string;
  content: string[];
  featured?: boolean;
  availableOn?: {
    itch?: string;
    steam?: string;
    googlePlay?: string;
    other?: { label: string; href: string }[];
  };
};

export type PortfolioApiItem = {
  id?: string;
  published?: boolean;
  title: string;
  date: string;
  type?: string;
  status?: string;
  platforms?: string[];
  genres?: string[];
  summary?: string;
  thumbnailSrc?: string | null;
  gallerySrcs?: string[];
  youtubeUrl?: string | null;
  content?: string[];
  steam?: string | null;
  itch?: string | null;
  googlePlay?: string | null;
  other?: string[] | null;
  featured?: boolean;
};

export function slugifyPortfolioTitle(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function formatPortfolioType(type: PortfolioType) {
  return type === "board" ? "Board Game" : "Digital Game";
}

export function formatPortfolioStatus(status: PortfolioStatus) {
  return status === "released" ? "Released" : "In Development";
}

export function formatPortfolioPlatform(platform: PortfolioPlatform) {
  switch (platform) {
    case "tabletop":
      return "Tabletop";
    case "pc":
      return "PC Game";
    case "mobile":
      return "Mobile Game";
    case "vr-ar":
      return "VR/AR Game";
    case "web3":
      return "Web3 Game";
  }
}

export const portfolioPlatforms: PortfolioPlatform[] = ["tabletop", "pc", "mobile", "vr-ar", "web3"];
export const portfolioTypes: PortfolioType[] = ["board", "digital"];
export const portfolioStatuses: PortfolioStatus[] = ["in-development", "released"];

function getBaseUrlFromHeaders(headers: Headers): string | null {
  const host = headers.get("x-forwarded-host") ?? headers.get("host");
  if (!host) return null;
  const proto = headers.get("x-forwarded-proto") ?? "http";
  return `${proto}://${host}`;
}

function normalizeType(value: string | undefined): PortfolioType {
  const v = (value ?? "").trim().toLowerCase();
  if (v === "board" || v === "board game" || v === "tabletop") return "board";
  return "digital";
}

function normalizeStatus(value: string | undefined): PortfolioStatus {
  const v = (value ?? "").trim().toLowerCase().replace(/\s+/g, "-");
  if (v === "released" || v === "release") return "released";
  return "in-development";
}

function normalizePlatform(value: string): PortfolioPlatform | null {
  const v = value.trim().toLowerCase();
  if (!v) return null;
  if (v.includes("tabletop") || v.includes("board")) return "tabletop";
  if (v.includes("pc")) return "pc";
  if (v.includes("mobile") || v.includes("android") || v.includes("ios")) return "mobile";
  if (v.includes("vr") || v.includes("ar")) return "vr-ar";
  if (v.includes("web3")) return "web3";
  return null;
}

function parseOtherLinks(other: string[] | null | undefined): { label: string; href: string }[] | undefined {
  if (!other?.length) return undefined;
  const parsed = other
    .map((raw) => {
      const value = raw.trim();
      if (!value) return null;
      const idx = value.indexOf(":");
      if (idx <= 0) return null;
      const label = value.slice(0, idx).trim();
      const href = value.slice(idx + 1).trim();
      if (!label || !href) return null;
      return { label, href };
    })
    .filter((x): x is { label: string; href: string } => Boolean(x));
  return parsed.length ? parsed : undefined;
}

function toPortfolioItem(apiItem: PortfolioApiItem): PortfolioItem {
  const platforms = (apiItem.platforms ?? [])
    .map(normalizePlatform)
    .filter((p): p is PortfolioPlatform => Boolean(p));

  const availableOnOther = parseOtherLinks(apiItem.other ?? undefined);
  const availableOn =
    apiItem.steam || apiItem.itch || apiItem.googlePlay || availableOnOther
      ? {
          steam: apiItem.steam ?? undefined,
          itch: apiItem.itch ?? undefined,
          googlePlay: apiItem.googlePlay ?? undefined,
          other: availableOnOther,
        }
      : undefined;

  return {
    id: apiItem.id,
    title: apiItem.title,
    date: apiItem.date,
    type: normalizeType(apiItem.type),
    status: normalizeStatus(apiItem.status),
    platforms,
    genres: apiItem.genres ?? [],
    summary: apiItem.summary ?? "",
    thumbnailSrc: apiItem.thumbnailSrc ?? "/thumbnails/pinned-ember-guild.svg",
    gallerySrcs: apiItem.gallerySrcs ?? [],
    youtubeUrl: apiItem.youtubeUrl ?? undefined,
    content: apiItem.content ?? [],
    featured: apiItem.featured ?? undefined,
    availableOn,
  };
}

export async function getAllPortfolio(): Promise<PortfolioItem[]> {
  let url: URL | string = "/api/portfolio";

  if (typeof window === "undefined") {
    try {
      const { headers } = await import("next/headers");
      const h = await headers();
      const baseUrl = getBaseUrlFromHeaders(h);
      if (baseUrl) url = new URL("/api/portfolio", baseUrl);
    } catch {
      // ignore
    }
  }

  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to load portfolio: ${res.status} ${res.statusText}`);

  const data = (await res.json()) as PortfolioApiItem[];
  const items = (data ?? []).map(toPortfolioItem);
  return items.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
}

export async function getPortfolioBySlug(slug: string) {
  const all = await getAllPortfolio();
  return all.find((item) => slugifyPortfolioTitle(item.title) === slug) ?? null;
}

export type PortfolioSort = "newest" | "oldest" | "title-asc" | "title-desc";

export function sortPortfolio(items: PortfolioItem[], sort: PortfolioSort) {
  const sorted = [...items];
  switch (sort) {
    case "oldest":
      sorted.sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0));
      return sorted;
    case "title-asc":
      sorted.sort((a, b) => a.title.localeCompare(b.title));
      return sorted;
    case "title-desc":
      sorted.sort((a, b) => b.title.localeCompare(a.title));
      return sorted;
    case "newest":
    default:
      sorted.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
      return sorted;
  }
}

export function filterPortfolio(
  items: PortfolioItem[],
  filters: {
    type?: PortfolioType;
    status?: PortfolioStatus;
    platforms?: PortfolioPlatform[];
    genres?: string[];
  },
) {
  return items.filter((item) => {
    if (filters.type && item.type !== filters.type) return false;
    if (filters.status && item.status !== filters.status) return false;
    if (filters.platforms?.length) {
      const matchesPlatform = filters.platforms.some((p) => item.platforms.includes(p));
      if (!matchesPlatform) return false;
    }
    if (filters.genres?.length) {
      const itemGenresLower = item.genres.map((g) => g.toLowerCase());
      const matchesGenre = filters.genres.some((g) => itemGenresLower.includes(g.toLowerCase()));
      if (!matchesGenre) return false;
    }
    return true;
  });
}

