import Reveal from "../_components/Reveal";
import PageHeader from "../_components/PageHeader";
import Link from "next/link";

export const metadata = {
  title: "Shop",
};

const PRODUCT_URLS: string[] = [
  "https://tk.tokopedia.com/ZS9Gu8S9f/",
  "https://tk.tokopedia.com/ZS9Gnm9R7/",
  "https://shopee.co.id/Kali-Mancing-Board-Game-Permainan-Kartu-Permainan-Anak-i.1640846344.45700278849",
  "https://shopee.co.id/Tumpengan-Board-Game-Permainan-Kartu-Permainan-Anak-i.1640846344.53500253897"
];

function isShopeeUrl(value: string) {
  try {
    return new URL(value).hostname.toLowerCase().includes("shopee");
  } catch {
    return false;
  }
}

export default async function ShopPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = (await searchParams) ?? {};
  const requestedUrl = typeof sp.url === "string" ? sp.url : Array.isArray(sp.url) ? sp.url[0] : "";
  const urls = requestedUrl ? [requestedUrl, ...PRODUCT_URLS] : PRODUCT_URLS;
  return (
    <div className="bg-background">
      <div className="mx-auto w-full max-w-6xl px-4 p-0">
        <div className="grid gap-10">
          <Reveal>
            <PageHeader
              title="Shop"
              description="From early prototypes to production-ready builds, we help teams ship playful experiences."
            />
          </Reveal>
          <div className="grid gap-6">
            {requestedUrl && (
              <div className="flex items-center justify-end">
                <Link
                  href="/shop"
                  className="inline-flex items-center justify-center rounded-full border border-black/10 bg-background px-4 py-2 text-sm font-semibold text-zinc-900 shadow-sm transition-colors hover:bg-zinc-50 dark:border-white/10 dark:bg-black/20 dark:text-zinc-50 dark:hover:bg-black/30"
                >
                  Clear custom URL
                </Link>
              </div>
            )}

            {urls.map((productUrl, i) => {
              const iframeSrc = `/shop/embed?url=${encodeURIComponent(productUrl)}`;
              const shopee = isShopeeUrl(productUrl);
              return (
                <Reveal
                  key={`${productUrl}-${i}`}
                  className="rounded-3xl border border-black/10 bg-surface p-6 shadow-sm dark:border-white/10"
                  delayMs={60 + i * 40}
                >
                  <div className="text-xs text-zinc-600 dark:text-zinc-300">
                    <span className="font-mono break-all">{productUrl}</span>
                  </div>

                  {shopee ? (
                    <div className="mt-3 flex items-center justify-end">
                      <a
                        href={productUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center justify-center rounded-full border border-black/10 bg-background px-4 py-2 text-sm font-semibold text-zinc-900 shadow-sm transition-colors hover:bg-zinc-50 dark:border-white/10 dark:bg-black/20 dark:text-zinc-50 dark:hover:bg-black/30"
                      >
                        Open in Shopee
                      </a>
                    </div>
                  ) : (
                    <div className="mt-3 overflow-hidden rounded-2xl border border-black/10 bg-background dark:border-white/10">
                      <iframe
                        title={`Product embed ${i + 1}`}
                        src={iframeSrc}
                        className="h-[210px] w-full p-2 overflow-hidden border-none"
                        loading="lazy"
                        referrerPolicy="strict-origin-when-cross-origin"
                      />
                    </div>
                  )}
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
