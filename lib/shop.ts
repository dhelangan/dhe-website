export type ShopProduct = {
  id: string;
  title: string;
  description: string;
  price: string;
  currency: string;
  url: string;
  images: string[];
};

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

function asString(value: unknown) {
  return typeof value === "string" ? value : value == null ? "" : String(value);
}

function asStringArray(value: unknown): string[] {
  if (Array.isArray(value)) return value.filter((v) => typeof v === "string" && v.trim()) as string[];
  if (typeof value === "string" && value.trim()) return [value];
  return [];
}

function pickFirstString(record: Record<string, unknown>, keys: string[]) {
  for (const k of keys) {
    const v = record[k];
    if (typeof v === "string" && v.trim()) return v.trim();
  }
  return "";
}

function collectImages(record: Record<string, unknown>): string[] {
  const candidates = [
    ...asStringArray(record.images),
    ...asStringArray(record.image_urls),
    ...asStringArray(record.gallery),
    ...asStringArray(record.thumbnails),
    ...asStringArray(record.thumbnail),
    ...asStringArray(record.image),
    ...asStringArray(record.imageSrc),
  ];
  return Array.from(new Set(candidates)).slice(0, 12);
}

export async function fetchShopProducts(): Promise<ShopProduct[]> {
  const baseUrl = await getBaseUrlFromHeaders();
  if (!baseUrl) return [];

  const res = await fetch(`${baseUrl}/api/shop`, { next: { revalidate: 60 } });
  if (!res.ok) return [];

  const data = (await res.json()) as unknown;
  if (!Array.isArray(data)) return [];

  const out: ShopProduct[] = [];
  for (const item of data) {
    if (!item || typeof item !== "object") continue;
    const v = item as Record<string, unknown>;

    const id = pickFirstString(v, ["id", "slug", "uuid"]) || asString(v.id);
    const title = pickFirstString(v, ["title", "name", "product_title"]) || "Product";
    const description = pickFirstString(v, ["description", "desc", "product_description"]);
    const price = pickFirstString(v, ["price", "price_text", "amount"]);
    const currency = pickFirstString(v, ["currency", "price_currency"]) || "IDR";
    const url = pickFirstString(v, ["url", "link", "product_url", "source_url"]);
    const images = collectImages(v);

    out.push({
      id: id || `${title}-${out.length}`,
      title,
      description,
      price,
      currency,
      url,
      images,
    });
  }

  return out;
}
