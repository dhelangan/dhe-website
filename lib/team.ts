export type TeamLink = {
  label: string;
  href: string;
  detailTitle?: string;
  detailBody?: string;
};

export type TeamMember = {
  name: string;
  role: string;
  imageSrc: string;
  division?: string[];
  bio?: string;
  highlights?: string[];
  links?: TeamLink[];
};

export type TeamApiMember = {
  id?: string;
  active?: boolean;
  name: string;
  role: string;
  imageSrc: string | null;
  bio?: string;
  highlights?: string[];
  links?: string[];
  division?: string[];
};

function getBaseUrlFromHeaders(headers: Headers): string | null {
  const host = headers.get("x-forwarded-host") ?? headers.get("host");
  if (!host) return null;

  const proto = headers.get("x-forwarded-proto") ?? "http";
  return `${proto}://${host}`;
}

function toTeamLink(raw: string): TeamLink | null {
  const value = raw.trim();
  if (!value) return null;

  const colonIndex = value.indexOf(":");
  if (colonIndex <= 0) return null;

  const label = value.slice(0, colonIndex).trim();
  let href = value.slice(colonIndex + 1).trim();
  if (!label || !href) return null;

  if (label.toLowerCase() === "email" && !href.startsWith("mailto:")) {
    href = href.includes("@") ? `mailto:${href}` : href;
  }
  if (
    (label.toLowerCase() === "instagram" || label.toLowerCase() === "x" || label.toLowerCase() === "twitter") &&
    href.startsWith("@")
  ) {
    href =
      label.toLowerCase() === "instagram"
        ? `https://instagram.com/${href.slice(1)}`
        : `https://x.com/${href.slice(1)}`;
  }
  if (!href.startsWith("http") && !href.startsWith("mailto:") && href.startsWith("www.")) {
    href = `https://${href}`;
  }

  return { label, href };
}

function toTeamMember(apiMember: TeamApiMember): TeamMember {
  const imageSrc = apiMember.imageSrc ?? "/thumbnails/team-creative.svg";
  const links = (apiMember.links ?? []).map(toTeamLink).filter((l): l is TeamLink => Boolean(l));

  return {
    name: apiMember.name,
    role: apiMember.role,
    imageSrc,
    division: apiMember.division,
    bio: apiMember.bio,
    highlights: apiMember.highlights,
    links: links.length ? links : undefined,
  };
}

export async function getTeamMembers(): Promise<TeamMember[]> {
  let url: URL | string = "/api/team";

  // In Server Components, `fetch('/api/...')` may throw "Failed to parse URL..."
  // because it requires an absolute URL. Build it from request headers when possible.
  if (typeof window === "undefined") {
    try {
      const { headers } = await import("next/headers");
      const h = await headers();
      const baseUrl = getBaseUrlFromHeaders(h);
      if (baseUrl) url = new URL("/api/team", baseUrl);
    } catch {
      // Fallback to relative URL (works in browser or some runtimes).
    }
  }

  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to load portfolio: ${res.status} ${res.statusText}`);

  const data = (await res.json()) as TeamApiMember[];
  return (data ?? []).map(toTeamMember);
}
