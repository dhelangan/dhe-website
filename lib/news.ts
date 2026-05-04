export type NewsItem = {
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
  // Ex: 2026-05-04 -> May 4, 2026
  const [year, month, day] = isoDate.split("-").map(Number);
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

const news: NewsItem[] = [
  {
    title: "Dhelangan Studio Opens New Playtest Schedule",
    date: "2026-05-04",
    imageSrc: "/thumbnails/board-balancing.svg",
    excerpt: "Weekly playtest slots are now available for partners and the community.",
    content: [
      "We’re opening a new weekly playtest schedule to help us iterate faster and share progress more often.",
      "If you’re interested in joining a session, keep an eye on our social channels or contact us directly.",
    ],
  },
  {
    title: "Prototype Milestone: Combat Loop v0.3",
    date: "2026-04-21",
    imageSrc: "/thumbnails/digital-controller.svg",
    excerpt: "The core loop is snappier, clearer, and ready for broader feedback.",
    content: [
      "Combat Loop v0.3 focuses on readability and pacing: faster turns, stronger telegraphing, and cleaner feedback.",
      "Next up: more enemy variety and a balance pass on early-game difficulty.",
    ],
  },
  {
    title: "New Art Direction Pass for Skybound Stories",
    date: "2026-04-05",
    imageSrc: "/thumbnails/pinned-skybound-stories.svg",
    excerpt: "A refreshed palette and silhouettes to improve clarity across scenes.",
    content: [
      "We refreshed the palette and pushed silhouettes to make characters easier to read at a glance.",
      "This pass also improves accessibility by increasing contrast in critical UI and gameplay moments.",
    ],
  },
  {
    title: "Community Q&A Recap: What We’re Building Next",
    date: "2026-03-17",
    imageSrc: "/thumbnails/pinned-neon-drift.svg",
    excerpt: "Answers to the most common questions from our latest live session.",
    content: [
      "Thanks to everyone who joined the Q&A. We covered current prototypes, the studio roadmap, and how we approach collaborations.",
      "We’ll run another session soon with a short demo segment and more time for questions.",
    ],
  },
  {
    title: "Behind the Scenes: Packaging Our First Demo",
    date: "2026-02-28",
    imageSrc: "/thumbnails/pinned-ember-guild.svg",
    excerpt: "How we prepare builds, capture feedback, and plan quick iterations.",
    content: [
      "Preparing a demo is more than a build: we create feedback prompts, set expectations, and define what success looks like.",
      "This helps us turn playtime into actionable insights instead of scattered notes.",
    ],
  },
  {
    title: "Service Update: Faster Prototype Turnarounds",
    date: "2026-01-30",
    imageSrc: "/thumbnails/team-engineer.svg",
    excerpt: "New workflow improvements mean quicker slices and tighter iteration loops.",
    content: [
      "We’ve refined our workflow to reduce handoff friction and shorten prototype iteration cycles.",
      "If you need a rapid slice for pitching or testing, reach out and we’ll map a timeline together.",
    ],
  },
];

export function getAllNews() {
  return [...news].sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
}

export function getNewsBySlug(slug: string) {
  return getAllNews().find((item) => slugifyNewsTitle(item.title) === slug) ?? null;
}

export function getLatestNews(limit: number) {
  return getAllNews().slice(0, Math.max(0, limit));
}

export function getNewsPagination(page: number, pageSize: number) {
  const allNews = getAllNews();
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

