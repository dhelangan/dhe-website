import Link from "next/link";
import PageHeader from "../_components/PageHeader";

export const metadata = {
  title: "Shop",
};

export default function ShopPage() {
  return (
    <div className="bg-background">
      <div className="mx-auto w-full max-w-6xl px-4 p-0">
        <div className="grid gap-10">
          <PageHeader
            title="Shop"
            description="Coming soon: print-and-play packs, merch, and digital downloads."
          />

          <div className="rounded-3xl border border-black/10 bg-surface p-8 shadow-sm dark:border-white/10 ">
            <h2 className="text-lg font-semibold tracking-tight">In the meantime</h2>
            <p className="mt-2 text-sm leading-6 text-zinc-800 dark:text-zinc-200">
              If you’d like a prototype kit or a custom component pack, reach out
              and we’ll point you in the right direction.
            </p>
            <div className="mt-6">
              <Link
                href="/contact"
                className="inline-flex h-11 items-center justify-center rounded-full bg-accent-orange px-6 text-sm font-semibold text-black transition-colors hover:bg-[#ff6f10]"
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


