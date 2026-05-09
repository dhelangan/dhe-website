import Reveal from "../_components/Reveal";
import PageHeader from "../_components/PageHeader";
import { fetchShopProducts } from "@/lib/shop";
import ProductCard from "./ProductCard";

export const metadata = {
  title: "Shop",
};

export const dynamic = "force-dynamic";

export default async function ShopPage() {
  const products = await fetchShopProducts();

  return (
    <div className="bg-background">
      <div className="mx-auto w-full max-w-6xl px-4 p-0">
        <div className="grid gap-10">
          <Reveal>
            <PageHeader title="Shop" description="Browse available products." />
          </Reveal>

          {products.length === 0 ? (
            <Reveal
              className="rounded-3xl border border-black/10 bg-surface p-8 shadow-sm dark:border-white/10"
              delayMs={60}
            >
              <div className="text-sm text-zinc-700 dark:text-zinc-300">No products available yet.</div>
            </Reveal>
          ) : (
            <div className="grid gap-6">
              {products.map((product, i) => (
                <Reveal key={product.id} delayMs={60 + i * 40}>
                  <ProductCard product={product} />
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

