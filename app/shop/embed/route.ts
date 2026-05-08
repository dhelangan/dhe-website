import { fetchProductEmbedData, normalizeAndValidateProductUrl } from "@/lib/productEmbed";

export const dynamic = "force-dynamic";

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function htmlResponse(html: string, status = 200) {
  return new Response(html, {
    status,
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "no-store",
    },
  });
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const rawUrl = url.searchParams.get("url") ?? "";

  if (!rawUrl) {
    return htmlResponse("<!doctype html><meta charset=utf-8><div>Missing url parameter.</div>", 400);
  }

  const normalized = normalizeAndValidateProductUrl(rawUrl);
  if (!normalized) {
    return htmlResponse(
      "<!doctype html><meta charset=utf-8><div>Unsupported link. Only Tokopedia/Shopee links are allowed.</div>",
      400
    );
  }

  const data = await fetchProductEmbedData(rawUrl);
  const hasContent = Boolean(data.title || data.description || data.images.length > 0 || data.price);
  if (!hasContent) {
    return htmlResponse(
      `<!doctype html>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<div style="font: 14px system-ui; padding: 16px;">
  Couldn’t load product details. <a href="${escapeHtml(normalized.toString())}" target="_blank" rel="noreferrer">Open source</a>
</div>`,
      200
    );
  }

  const title = escapeHtml(data.title ?? "Product");
  const price = escapeHtml(`${data.currency ? `${data.currency} ` : ""}${data.price ?? ""}`.trim());
  const description = data.description ? escapeHtml(data.description) : "";
  const thumb = data.images[0] ? escapeHtml(data.images[0]) : "";
  const ctaLabel = escapeHtml(data.site === "tokopedia" ? "Tokopedia" : data.site === "shopee" ? "Shopee" : "Open");
  const ctaHref = escapeHtml(data.resolvedUrl || normalized.toString());

  return htmlResponse(
    `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${title}</title>
    <style>
      :root { color-scheme: light dark; }
      body { margin: 0; font: 14px/1.5 system-ui, -apple-system, Segoe UI, Roboto, sans-serif; padding: 12px; }
      a { color: inherit; }

      .card {
        width: 100%;
        display: grid;
        grid-template-columns: 128px 1fr;
        gap: 12px;
        border-radius: 18px;
        border: 1px solid rgba(0,0,0,.10);
        background: rgba(255,255,255,.70);
        overflow: hidden;
      }
      @media (prefers-color-scheme: dark){
        .card{ border-color: rgba(255,255,255,.12); background: rgba(0,0,0,.20); }
      }

      .thumb { background: rgba(0,0,0,.03); }
      @media (prefers-color-scheme: dark){ .thumb{ background: rgba(255,255,255,.04); } }
      .thumb img { width: 100%; height: 100%; min-height: 128px; object-fit: cover; display: block; }
      .thumb .placeholder {
        height: 100%;
        min-height: 128px;
        display: grid;
        place-items: center;
        color: rgba(0,0,0,.55);
        font-weight: 600;
        letter-spacing: .02em;
      }
      @media (prefers-color-scheme: dark){ .thumb .placeholder{ color: rgba(255,255,255,.65);} }

      .content { padding: 12px 12px 12px 0; min-width: 0; display: grid; gap: 6px; }
      h1 { margin: 0; font-size: 15px; line-height: 1.25; }
      .price { font-weight: 800; margin: 0; }
      .desc { margin: 0; color: rgba(0,0,0,.75); display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
      @media (prefers-color-scheme: dark){ .desc{ color: rgba(255,255,255,.75);} }

      .footer { margin-top: 6px; display: flex; justify-content: flex-end; }
      .btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        padding: 8px 12px;
        border-radius: 999px;
        border: 1px solid rgba(0,0,0,.10);
        background: rgba(255,255,255,.75);
        font-weight: 700;
        font-size: 12px;
        text-decoration: none;
        transition: background .12s ease;
      }
      .btn:hover { background: rgba(255,255,255,.95); }
      @media (prefers-color-scheme: dark){
        .btn{ border-color: rgba(255,255,255,.14); background: rgba(0,0,0,.18); }
        .btn:hover{ background: rgba(0,0,0,.30); }
      }

      @media (max-width: 420px) {
        .card { grid-template-columns: 96px 1fr; }
        .thumb img, .thumb .placeholder { min-height: 96px; }
      }
    </style>
  </head>
  <body>
    <div class="card">
      <div class="thumb">
        ${
          thumb
            ? `<img src="${thumb}" alt="" loading="lazy" referrerpolicy="no-referrer" />`
            : `<div class="placeholder">No image</div>`
        }
      </div>
      <div class="content">
        <h1>${title}</h1>
        ${price ? `<div class="price">${price}</div>` : ""}
        ${description ? `<p class="desc">${description}</p>` : ""}
        <div class="footer">
          <a class="btn" href="${ctaHref}" target="_blank" rel="noreferrer">${ctaLabel}</a>
        </div>
      </div>
    </div>
  </body>
</html>`
  );
}
