export type PortfolioType = "board" | "digital";
export type PortfolioStatus = "in-development" | "released";
export type PortfolioPlatform = "tabletop" | "pc" | "mobile" | "vr-ar" | "web3";

export type PortfolioItem = {
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
  availableOn?: {
    itch?: string;
    steam?: string;
    googlePlay?: string;
    other?: { label: string; href: string }[];
  };
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

const portfolio: PortfolioItem[] = [
  {
    title: "Ember Guild",
    date: "2026-04-15",
    type: "board",
    status: "in-development",
    platforms: ["tabletop"],
    genres: ["card based", "roguelite", "co-op"],
    summary: "Co-op tactics with cozy progression and modular scenarios.",
    thumbnailSrc: "/thumbnails/pinned-ember-guild.svg",
    gallerySrcs: [
      "/thumbnails/pinned-ember-guild.svg",
      "/thumbnails/board-balancing.svg",
      "/thumbnails/pinned-skybound-stories.svg",
      "/thumbnails/pinned-neon-drift.svg",
    ],
    youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    content: [
      "Ember Guild is a tabletop co-op tactics experience with modular scenarios and a focus on readability.",
      "We’re iterating on encounter pacing, onboarding clarity, and session-to-session progression.",
    ],
    availableOn: {
      other: [{ label: "Press kit", href: "https://example.com" }],
    },
  },
  {
    title: "Neon Drift",
    date: "2026-03-09",
    type: "digital",
    status: "released",
    platforms: ["pc", "mobile"],
    genres: ["casual", "hypercasual", "racing"],
    summary: "Arcade racing built for tight handling and quick restarts.",
    thumbnailSrc: "/thumbnails/pinned-neon-drift.svg",
    gallerySrcs: [
      "/thumbnails/pinned-neon-drift.svg",
      "/thumbnails/digital-controller.svg",
      "/thumbnails/pinned-skybound-stories.svg",
      "/thumbnails/team-engineer.svg",
    ],
    content: [
      "Neon Drift is designed for short sessions with fast resets and clear feedback.",
      "We focused on controller feel, readability, and a progression loop that rewards mastery.",
    ],
    availableOn: {
      steam: "https://store.steampowered.com",
      itch: "https://itch.io",
      googlePlay: "https://play.google.com/store",
      other: [{ label: "Official site", href: "https://example.com" }],
    },
  },
  {
    title: "Skybound Stories",
    date: "2026-02-02",
    type: "digital",
    status: "in-development",
    platforms: ["pc"],
    genres: ["visual novel", "narrative"],
    summary: "Choice-driven adventures with strong replayability.",
    thumbnailSrc: "/thumbnails/pinned-skybound-stories.svg",
    gallerySrcs: [
      "/thumbnails/pinned-skybound-stories.svg",
      "/thumbnails/team-artist.svg",
      "/thumbnails/team-creative.svg",
      "/thumbnails/team-designer.svg",
    ],
    content: [
      "Skybound Stories is an interactive narrative built around meaningful choices and replayable routes.",
      "We’re currently testing pacing, clarity of consequence, and accessibility for long reading sessions.",
    ],
    availableOn: {
      itch: "https://itch.io",
    },
  },
];

export function getAllPortfolio() {
  return [...portfolio].sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
}

export function getPortfolioBySlug(slug: string) {
  return getAllPortfolio().find((item) => slugifyPortfolioTitle(item.title) === slug) ?? null;
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

export function filterPortfolio(items: PortfolioItem[], filters: {
  type?: PortfolioType;
  status?: PortfolioStatus;
  platforms?: PortfolioPlatform[];
  genres?: string[];
}) {
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

