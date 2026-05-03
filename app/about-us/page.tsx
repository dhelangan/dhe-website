import Link from "next/link";
import PageHeader from "../_components/PageHeader";

export const metadata = {
  title: "About Us",
};

export default function AboutUsPage() {
  return (
    <div className="bg-zinc-50 dark:bg-black">
      <div className="mx-auto w-full max-w-6xl px-5 py-12 sm:py-16">
        <div className="grid gap-10">
          <PageHeader
            title="About Dhelangan Studio"
            description="We’re a small game studio building tabletop and digital experiences with clear systems, strong feel, and welcoming worlds."
          />

          <section className="grid gap-4 rounded-3xl border border-black/10 bg-white p-8 shadow-sm dark:border-white/10 dark:bg-zinc-950">
            <h2 className="text-lg font-semibold tracking-tight">What we do</h2>
            <p className="text-sm leading-6 text-zinc-600 dark:text-zinc-400">
              We prototype, design, and produce games—from paper tests to playable
              digital slices. Our process is iterative, playtest-driven, and
              focused on readability.
            </p>
            <ul className="grid gap-2 text-sm text-zinc-700 dark:text-zinc-300 sm:grid-cols-2">
              <li className="rounded-2xl border border-black/10 bg-background p-4 dark:border-white/10">
                Tabletop prototyping & balance
              </li>
              <li className="rounded-2xl border border-black/10 bg-background p-4 dark:border-white/10">
                Digital gameplay & polish
              </li>
              <li className="rounded-2xl border border-black/10 bg-background p-4 dark:border-white/10">
                Art direction & UI readability
              </li>
              <li className="rounded-2xl border border-black/10 bg-background p-4 dark:border-white/10">
                Production planning & handoff
              </li>
            </ul>
          </section>

          <section className="grid gap-4">
            <h2 className="text-lg font-semibold tracking-tight">Our values</h2>
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                {
                  title: "Playability",
                  body: "Every decision is tested at the table or in build—no theory-only design.",
                },
                {
                  title: "Clarity",
                  body: "Readable rules, clear UI, and learnable systems that still have depth.",
                },
                {
                  title: "Charm",
                  body: "A warm tone, delightful moments, and worlds you want to return to.",
                },
              ].map((card) => (
                <div
                  key={card.title}
                  className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-zinc-950"
                >
                  <div className="font-semibold tracking-tight">{card.title}</div>
                  <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                    {card.body}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section className="flex flex-col items-start justify-between gap-4 rounded-3xl border border-black/10 bg-white p-8 shadow-sm dark:border-white/10 dark:bg-zinc-950 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-lg font-semibold tracking-tight">Want to collaborate?</h2>
              <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                We’re available for prototyping, co-dev, and production support.
              </p>
            </div>
            <Link
              href="/contact"
              className="inline-flex h-11 items-center justify-center rounded-full bg-foreground px-6 text-sm font-medium text-background transition-colors hover:bg-zinc-800 dark:hover:bg-zinc-200 dark:hover:text-black"
            >
              Contact
            </Link>
          </section>
        </div>
      </div>
    </div>
  );
}
