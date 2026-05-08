export type ProductEmbedData = {
  inputUrl: string;
  resolvedUrl: string;
  site: "tokopedia" | "shopee" | "unknown";
  title: string | null;
  description: string | null;
  price: string | null;
  currency: string | null;
  images: string[];
};

const ALLOWED_HOST_SUFFIXES = ["tokopedia.com", "shopee.co.id", "shopee.com"] as const;
const ALLOWED_HOSTS_EXACT = ["tk.tokopedia.com"] as const;

function isAllowedHost(hostname: string) {
  const host = hostname.toLowerCase();
  if (ALLOWED_HOSTS_EXACT.includes(host as (typeof ALLOWED_HOSTS_EXACT)[number])) return true;
  return ALLOWED_HOST_SUFFIXES.some((suffix) => host === suffix || host.endsWith(`.${suffix}`));
}

export function normalizeAndValidateProductUrl(input: string): URL | null {
  try {
    const url = new URL(input);
    if (url.protocol !== "https:") return null;
    if (!isAllowedHost(url.hostname)) return null;
    url.hash = "";
    return url;
  } catch {
    return null;
  }
}

function detectSite(url: URL): ProductEmbedData["site"] {
  const host = url.hostname.toLowerCase();
  if (host.includes("tokopedia")) return "tokopedia";
  if (host.includes("shopee")) return "shopee";
  return "unknown";
}

function compactText(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function firstNonEmpty(...values: Array<string | null | undefined>) {
  for (const v of values) {
    if (typeof v === "string" && v.trim()) return v.trim();
  }
  return null;
}

function parseMetaTags(html: string) {
  const out = new Map<string, string>();
  const metaTagRegex = /<meta\b[^>]*>/gi;
  const attrRegex = /([a-zA-Z0-9:_-]+)\s*=\s*["']([^"']*)["']/g;

  const tags = html.match(metaTagRegex) ?? [];
  for (const tag of tags) {
    const attrs: Record<string, string> = {};
    let match: RegExpExecArray | null;
    while ((match = attrRegex.exec(tag)) !== null) {
      const key = match[1]?.toLowerCase();
      const value = match[2] ?? "";
      if (key) attrs[key] = value;
    }

    const content = attrs["content"];
    if (!content) continue;

    const key = (attrs["property"] ?? attrs["name"] ?? "").toLowerCase();
    if (!key) continue;

    // Keep the first occurrence; some pages repeat tags with less-useful values later.
    if (!out.has(key)) out.set(key, content);
  }

  return out;
}

function extractJsonLd(html: string): unknown[] {
  const results: unknown[] = [];
  const scriptRegex = /<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let match: RegExpExecArray | null;
  while ((match = scriptRegex.exec(html)) !== null) {
    const raw = (match[1] ?? "").trim();
    if (!raw) continue;
    try {
      results.push(JSON.parse(raw));
    } catch {
      // JSON-LD is often invalid; ignore.
    }
  }
  return results;
}

function pickProductFromJsonLd(nodes: unknown[]) {
  const queue: unknown[] = [...nodes];
  while (queue.length) {
    const node = queue.shift();
    if (!node) continue;

    if (Array.isArray(node)) {
      queue.push(...node);
      continue;
    }

    if (typeof node !== "object") continue;
    const obj = node as Record<string, unknown>;

    const type = obj["@type"];
    const isProduct =
      type === "Product" || (Array.isArray(type) && type.some((t) => typeof t === "string" && t === "Product"));
    if (isProduct) return obj;

    for (const v of Object.values(obj)) queue.push(v);
  }
  return null;
}

function normalizeImages(value: unknown): string[] {
  if (!value) return [];
  if (typeof value === "string") return [value].filter(Boolean);
  if (Array.isArray(value)) return value.filter((v) => typeof v === "string" && v.trim()) as string[];
  return [];
}

function extractPriceFromJsonLd(product: Record<string, unknown> | null) {
  if (!product) return { price: null as string | null, currency: null as string | null };
  const offers = product["offers"];
  const offersObj =
    (Array.isArray(offers) ? (offers.find((o) => o && typeof o === "object") as Record<string, unknown> | undefined) : undefined) ??
    (offers && typeof offers === "object" ? (offers as Record<string, unknown>) : undefined);
  if (!offersObj) return { price: null, currency: null };
  const price = offersObj["price"];
  const priceCurrency = offersObj["priceCurrency"];
  return {
    price: typeof price === "string" || typeof price === "number" ? String(price) : null,
    currency: typeof priceCurrency === "string" ? priceCurrency : null,
  };
}

export async function fetchProductEmbedData(inputUrl: string): Promise<ProductEmbedData> {
  const normalized = normalizeAndValidateProductUrl(inputUrl);
  if (!normalized) {
    return {
      inputUrl,
      resolvedUrl: inputUrl,
      site: "unknown",
      title: null,
      description: null,
      price: null,
      currency: null,
      images: [],
    };
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10_000);
  try {
    const res = await fetch(normalized.toString(), {
      redirect: "follow",
      cache: "no-store",
      headers: {
        // Some marketplaces block default Node user agents; pretend to be a normal browser.
        "user-agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
        accept: "text/html,application/xhtml+xml",
      },
      signal: controller.signal,
    });

    const resolvedUrl = res.url || normalized.toString();
    const resolved = (() => {
      try {
        return new URL(resolvedUrl);
      } catch {
        return normalized;
      }
    })();

    if (!res.ok) {
      return {
        inputUrl,
        resolvedUrl,
        site: detectSite(resolved),
        title: null,
        description: null,
        price: null,
        currency: null,
        images: [],
      };
    }

    const html = await res.text();
    const meta = parseMetaTags(html);
    const jsonLdNodes = extractJsonLd(html);
    const jsonLdProduct = pickProductFromJsonLd(jsonLdNodes);
    const jsonLdPrice = extractPriceFromJsonLd(jsonLdProduct);

    const title = firstNonEmpty(
      typeof jsonLdProduct?.name === "string" ? jsonLdProduct.name : null,
      meta.get("og:title"),
      meta.get("twitter:title")
    );

    const description = firstNonEmpty(
      typeof jsonLdProduct?.description === "string" ? compactText(jsonLdProduct.description) : null,
      meta.get("og:description"),
      meta.get("description"),
      meta.get("twitter:description")
    );

    const imagesFromJsonLd = normalizeImages(jsonLdProduct?.image);
    const imagesFromMeta = [
      meta.get("og:image"),
      meta.get("og:image:url"),
      meta.get("twitter:image"),
      meta.get("twitter:image:src"),
    ].filter((v): v is string => typeof v === "string" && v.trim().length > 0);

    const images = Array.from(new Set([...imagesFromJsonLd, ...imagesFromMeta])).slice(0, 8);

    const price = firstNonEmpty(
      jsonLdPrice.price,
      meta.get("product:price:amount"),
      meta.get("og:price:amount"),
      meta.get("og:price"),
      meta.get("twitter:data1")
    );

    const currency = firstNonEmpty(
      jsonLdPrice.currency,
      meta.get("product:price:currency"),
      meta.get("og:price:currency"),
      meta.get("price:currency")
    );

    return {
      inputUrl,
      resolvedUrl,
      site: detectSite(resolved),
      title,
      description,
      price,
      currency,
      images,
    };
  } finally {
    clearTimeout(timeout);
  }
}
