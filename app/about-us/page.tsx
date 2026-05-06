import Link from "next/link";

import PageHeader from "../_components/PageHeader";
import TeamGrid from "../_components/TeamGrid";
import ZoomableImage from "../_components/ZoomableImage";
import Reveal from "../_components/Reveal";

import { getTeamMembers } from "@/lib/team";
import { getAllGallery } from "@/lib/gallery";

export const metadata = {
  title: "About Us",
};

export default async function AboutUsPage() {
  const team = await getTeamMembers();
  const gallery = await getAllGallery();
  return (
    <div className="bg-background">
      <div className="mx-auto w-full max-w-6xl px-4 py-0">
        <div className="grid gap-10">
          <Reveal>
          <PageHeader
            title="About Us"
            description="We’re a small game studio building tabletop and digital experiences with clear systems, strong feel, and welcoming worlds."
          />
          </Reveal>

          <Reveal as="section" className="grid gap-4 rounded-3xl border border-black/10 bg-surface p-8 shadow-sm dark:border-white/10 " delayMs={60}>
            <h2 className="text-lg font-semibold tracking-tight">What we do?</h2>
            <p className="text-sm leading-6 text-zinc-800 dark:text-zinc-200">
              We prototype, design, and produce games—from paper tests to playable
              digital slices. Our process is iterative, playtest-driven, and
              focused on readability.
            </p>
            <ul className="grid gap-2 text-sm text-zinc-800 dark:text-zinc-200 sm:grid-cols-2">
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
          </Reveal>

          <Reveal as="section" className="grid gap-4" delayMs={90}>
            <div>
               <h1 className="text-2xl font-semibold tracking-tight">Our <span className="text-accent-orange">Team</span></h1>
              <p className="mt-1 text-sm leading-6 text-zinc-800 dark:text-zinc-200">
                The people behind the playtests, prototypes, and polish.
              </p>
            </div>

            <TeamGrid members={team} />
          </Reveal>

          <Reveal as="section" className="grid gap-4" delayMs={120}>
            <div>
               <h1 className="text-2xl font-semibold tracking-tight">Our <span className="text-accent-orange">Gallery</span></h1>
              <p className="mt-1 text-sm leading-6 text-zinc-800 dark:text-zinc-200">
                Snapshots from our projects and process.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {gallery.map((item) => (
                <ZoomableImage
                  key={item.id}
                  src={item.image}
                  alt="Gallery image"
                  sizes="(min-width: 1024px) 22vw, (min-width: 640px) 45vw, 100vw"
                  containerClassName="relative aspect-[4/3] w-full overflow-hidden rounded-3xl border border-black/10 bg-black/[.06] shadow-sm dark:border-white/10 dark:bg-white/[.06]"
                />
              ))}
            </div>
          </Reveal>

          <Reveal as="section" className="grid gap-4" delayMs={150}>
             <div>
             <h1 className="text-2xl font-semibold tracking-tight">Our <span className="text-accent-orange">Value</span></h1>
            <p className="mt-1 text-sm leading-6 text-zinc-800 dark:text-zinc-200">
                The core values of us.
              </p>
               </div>
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
                  className="rounded-3xl border border-black/10 bg-surface p-6 shadow-sm dark:border-white/10 "
                >
                  <div className="font-semibold tracking-tight">{card.title}</div>
                  <p className="mt-2 text-sm leading-6 text-zinc-800 dark:text-zinc-200">
                    {card.body}
                  </p>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal as="section" className="flex flex-col items-start justify-between gap-4 rounded-3xl border border-black/10 bg-surface p-8 shadow-sm dark:border-white/10  sm:flex-row sm:items-center" delayMs={180}>
            <div>
              <h2 className="text-lg font-semibold tracking-tight">Want to collaborate?</h2>
              <p className="mt-1 text-sm text-zinc-800 dark:text-zinc-200">
                We’re available for prototyping, co-dev, and production support.
              </p>
            </div>
            <Link
              href="/contact"
              className="inline-flex h-11 items-center justify-center rounded-full bg-accent-orange px-6 text-sm font-semibold text-black transition-colors hover:bg-[#ff6f10]"
            >
              Contact
            </Link>
          </Reveal>
        </div>
      </div>
    </div>
  );
}

