import Image from "next/image";
import Link from "next/link";
import PageHeader from "../_components/PageHeader";

export const metadata = {
  title: "Portfolio",
};

const projects = [
  {
    title: "Ember Guild",
    type: "Board Game",
    summary: "Co-op tactics with cozy progression and modular scenarios.",
    imageSrc: "/thumbnails/pinned-ember-guild.svg",
  },
  {
    title: "Neon Drift",
    type: "Digital Game",
    summary: "Arcade racing built for tight handling and quick restarts.",
    imageSrc: "/thumbnails/pinned-neon-drift.svg",
  },
  {
    title: "Skybound Stories",
    type: "Interactive Narrative",
    summary: "Choice-driven adventures with strong replayability.",
    imageSrc: "/thumbnails/pinned-skybound-stories.svg",
  },
];

export default function PortfolioPage() {
  return (
    <div className="bg-background">
      <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:py-16">
        <div className="grid gap-10">
          <PageHeader
            title="Portfolio"
            description="A selection of tabletop and digital work—prototypes, slices, and in-progress projects."
          />

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <div
                key={project.title}
                className="overflow-hidden rounded-3xl border border-black/10 bg-surface shadow-sm dark:border-white/10 "
              >
                <div className="relative aspect-[4/3] bg-zinc-100 dark:bg-zinc-900">
                  <Image
                    src={project.imageSrc}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"
                  />
                </div>
                <div className="grid gap-2 p-6">
                  <div className="text-xs font-medium text-zinc-800 dark:text-zinc-200">
                    {project.type}
                  </div>
                  <h2 className="text-lg font-semibold tracking-tight">{project.title}</h2>
                  <p className="text-sm leading-6 text-zinc-800 dark:text-zinc-200">
                    {project.summary}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col items-start justify-between gap-4 rounded-3xl border border-black/10 bg-surface p-8 shadow-sm dark:border-white/10  sm:flex-row sm:items-center">
            <div>
              <h2 className="text-lg font-semibold tracking-tight">Need a playable prototype?</h2>
              <p className="mt-1 text-sm text-zinc-800 dark:text-zinc-200">
                We can help you validate an idea quickly.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/services"
                className="inline-flex h-11 items-center justify-center rounded-full border border-black/10 bg-background px-6 text-sm font-medium transition-colors hover:bg-black/[.04] dark:border-white/10 dark:hover:bg-surface/[.06]"
              >
                View services
              </Link>
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


