export type GalleryItem = {
  id: number;
  image: string;
  published: boolean;
};

function getBaseUrlFromHeaders(): Promise<string | null> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { headers } = require("next/headers") as typeof import("next/headers");
    return Promise.resolve(headers()).then((h) => {
      const host = h.get("x-forwarded-host") ?? h.get("host");
      if (!host) return null;
      const proto = h.get("x-forwarded-proto") ?? "http";
      return `${proto}://${host}`;
    });
  } catch {
    return Promise.resolve(null);
  }
}

async function fetchGalleryFromApi(): Promise<GalleryItem[]> {
  const baseUrl = await getBaseUrlFromHeaders();
  if (!baseUrl) return [];

  const res = await fetch(`${baseUrl}/api/gallery`, {
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
        id: typeof v.id === "number" ? v.id : Number(v.id),
        image: typeof v.image === "string" ? v.image : String(v.image ?? ""),
        published: Boolean(v.published),
      } satisfies GalleryItem;
    })
    .filter((v): v is GalleryItem => Boolean(v) && Number.isFinite(v?.id) && Boolean(v?.image));
}

export async function getAllGallery() {
  const items = await fetchGalleryFromApi();
  return items
    .filter((g) => g.published)
    .sort((a, b) => a.id - b.id);
}

