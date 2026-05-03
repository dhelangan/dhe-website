import Link from "next/link";
import PageHeader from "../_components/PageHeader";

export const metadata = {
  title: "Shop",
};

export default function ShopPage() {
  return (
    <div className="bg-zinc-50 dark:bg-black">
      <div className="mx-auto w-full max-w-6xl px-5 py-12 sm:py-16">
        <div className="grid gap-10">
          <PageHeader
            title="Shop"
            description="Coming soon: print-and-play packs, merch, and digital downloads."
          />

          <div className="rounded-3xl border border-black/10 bg-white p-8 shadow-sm dark:border-white/10 dark:bg-zinc-950">
            <h2 className="text-lg font-semibold tracking-tight">In the meantime</h2>
            <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
              If you’d like a prototype kit or a custom component pack, reach out
              and we’ll point you in the right direction.
            </p>
            <div className="mt-6">
              <Link
                href="/contact"
                className="inline-flex h-11 items-center justify-center rounded-full bg-foreground px-6 text-sm font-medium text-background transition-colors hover:bg-zinc-800 dark:hover:bg-zinc-200 dark:hover:text-black"
              >
                Contact
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
