import Image from "next/image";
import Link from "next/link";
import Carousel from "./_components/Carousel";
import ContentCard from "./_components/ContentCard";

type PinnedGame = {
  title: string;
  tagline: string;
  coverSrc: string;
  tags: string[];
};

type Post = {
  title: string;
  subtitle: string;
  imageSrc: string;
  href: string;
  badge?: string;
};

type TeamMember = {
  name: string;
  role: string;
  imageSrc: string;
  links?: { label: string; href: string }[];
};

const pinnedGames: PinnedGame[] = [
  {
    title: "Lorem Ipsum Ichi",
    tagline: "A cozy tactics board game with big-hearted heroes.",
    coverSrc: "/thumbnails/pinned-ember-guild.svg",
    tags: ["Board", "Tactics", "Co-op"],
  },
  {
    title: "Lorem Ipsum Ni",
    tagline: "A fast-paced arcade racer for short, satisfying sessions.",
    coverSrc: "/thumbnails/pinned-neon-drift.svg",
    tags: ["Digital", "Racing", "Arcade"],
  },
  {
    title: "Lorem Ipsum San",
    tagline: "Narrative adventures you can replay with new choices.",
    coverSrc: "/thumbnails/pinned-skybound-stories.svg",
    tags: ["Digital", "Story", "Choice"],
  }
];

const boardPosts: Post[] = [
  {
    title: "Lorem Ipsum 1",
    subtitle: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    imageSrc: "/thumbnails/board-balancing.svg",
    href: "/blog",
    badge: "Board",
  },
 {
    title: "Lorem Ipsum 2",
    subtitle: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    imageSrc: "/thumbnails/board-balancing.svg",
    href: "/blog",
    badge: "Board",
  },{
    title: "Lorem Ipsum 3",
    subtitle: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    imageSrc: "/thumbnails/board-balancing.svg",
    href: "/blog",
    badge: "Board",
  },{
    title: "Lorem Ipsum 4",
    subtitle: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    imageSrc: "/thumbnails/board-balancing.svg",
    href: "/blog",
    badge: "Board",
  }
];

const digitalPosts: Post[] = [
  {
    title: "Lorem Ipsum 5",
    subtitle: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    imageSrc: "/thumbnails/digital-controller.svg",
    href: "/blog",
    badge: "Digital",
  },
  {
    title: "Lorem Ipsum 6",
    subtitle: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    imageSrc: "/thumbnails/digital-controller.svg",
    href: "/blog",
    badge: "Digital",
  },{
    title: "Lorem Ipsum 7",
    subtitle: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    imageSrc: "/thumbnails/digital-controller.svg",
    href: "/blog",
    badge: "Digital",
  },{
    title: "Lorem Ipsum 8",
    subtitle: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    imageSrc: "/thumbnails/digital-controller.svg",
    href: "/blog",
    badge: "Digital",
  }
];

const team: TeamMember[] = [
  {
    name: "Dhela Ngan",
    role: "Creative Director",
    imageSrc: "/thumbnails/team-creative.svg",
    links: [{ label: "Portfolio", href: "/portfolio" }],
  },
  {
    name: "Raka Pramana",
    role: "Game Designer",
    imageSrc: "/thumbnails/team-designer.svg",
    links: [{ label: "Blog", href: "/blog" }],
  },
  {
    name: "Sinta Ayu",
    role: "Engineer",
    imageSrc: "/thumbnails/team-engineer.svg",
    links: [{ label: "Services", href: "/services" }],
  },
  {
    name: "Bagus Hartono",
    role: "Artist",
    imageSrc: "/thumbnails/team-artist.svg",
    links: [{ label: "Shop", href: "/shop" }],
  },
];

export default function Home() {
  return (
    <div className="bg-background lg:px-18 sm:px-0 md:px-4">
      <div className="block mx-auto w-full px-4">
        <div className="space-y-8">

          <section className="intro rounded p-4 block space-y-8">
            <div className="flex flex-col gap-2">
              <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
                Board Game + Video Game Studio
              </p>
              <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                We build playful worlds<br/>on the board and on the screen.
              </h1>
              <p className="max-w-2xl text-base leading-7 text-zinc-800 dark:text-zinc-200">
                Dhelangan Studio crafts board games, interactive experiences, and
                production-ready prototypes. Explore our pinned project, browse
                recent posts, and meet the team.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/portfolio"
                className="inline-flex h-10 items-center justify-center rounded-full bg-accent-orange px-4 text-sm font-semibold text-black transition-colors hover:bg-[#ff6f10]"
              >
                View Portfolio
              </Link>
              <Link
                href="/services"
                className="inline-flex h-10 items-center justify-center rounded-full border border-black/10 bg-background px-4 text-sm font-medium transition-colors hover:bg-black/[.04] dark:border-white/10 dark:hover:bg-white/[.06]"
              >
                Our Services
              </Link>
            </div>
          </section>

          <section className="block">
            <div className="flex items-end justify-between gap-4">
              <div className="mb-4">
                <h2 className="text-xl font-semibold tracking-tight">Pinned Game</h2>
                <p className="mt-1 text-sm text-zinc-800 dark:text-zinc-200">
                  A spotlight on what we’re building right now.
                </p>
              </div>
            </div>

            <Carousel
              label="Pinned games"
              autoplayMs={7000}
              slides={pinnedGames.map((game) => (
                <div key={game.title} className="grid gap-6 p-6 sm:grid-cols-[1.2fr_0.8fr] sm:items-center sm:gap-10 sm:p-8">
                  <div className="grid gap-4">
                    <div className="flex flex-wrap gap-2">
                      {game.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full border border-black/10 bg-zinc-50 px-3 py-1 text-xs font-medium text-zinc-700 dark:border-white/10 dark:bg-zinc-900 dark:text-zinc-200"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div>
                      <h3 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                        {game.title}
                      </h3>
                      <p className="mt-2 max-w-xl text-sm leading-6 text-zinc-800 dark:text-zinc-200">
                        {game.tagline}
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                      <Link
                        href="/portfolio"
                        className="inline-flex h-10 items-center justify-center rounded-full bg-accent-orange px-4 text-sm font-semibold text-black transition-colors hover:bg-[#ff6f10]"
                      >
                        See Details
                      </Link>
                      <Link
                        href="/contact"
                        className="inline-flex h-10 items-center justify-center rounded-full border border-black/10 bg-background px-4 text-sm font-medium transition-colors hover:bg-black/[.04] dark:border-white/10 dark:hover:bg-white/[.06]"
                      >
                        Partner With Us
                      </Link>
                    </div>
                  </div>

                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-black/10 bg-zinc-100 dark:border-white/10 dark:bg-zinc-900">
                    <Image
                      src={game.coverSrc}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="(min-width: 640px) 40vw, 100vw"
                      priority
                    />
                  </div>
                </div>
              ))}
            />
          </section>

          <section className="block">
            <div className="mb-4">
              <h2 className="text-xl font-semibold tracking-tight">Latest Posts</h2>
              <p className="mt-1 text-sm text-zinc-800 dark:text-zinc-200">
                Board game notes alongside digital production updates.
              </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <div className="grid gap-3">
                <div className="flex items-baseline justify-between">
                  <h3 className="text-base font-semibold tracking-tight">Board Games</h3>
                  <Link
                    href="/blog"
                    className="text-sm font-medium text-zinc-700 transition-colors hover:text-foreground dark:text-zinc-300"
                  >
                    View all
                  </Link>
                </div>
                <div className="grid gap-3">
                  {boardPosts.map((post) => (
                    <ContentCard key={post.title} {...post} />
                  ))}
                </div>
              </div>

              <div className="grid gap-3">
                <div className="flex items-baseline justify-between">
                  <h3 className="text-base font-semibold tracking-tight">Digital Games</h3>
                  <Link
                    href="/blog"
                    className="text-sm font-medium text-zinc-700 transition-colors hover:text-foreground dark:text-zinc-300"
                  >
                    View all
                  </Link>
                </div>
                <div className="grid gap-3">
                  {digitalPosts.map((post) => (
                    <ContentCard key={post.title} {...post} />
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="block rounded-3xl border border-black/10 bg-surface p-8 shadow-sm dark:border-white/10">
            <div className="grid gap-2">
              <h2 className="text-xl font-semibold tracking-tight">About Us</h2>
              <p className="max-w-3xl text-sm leading-6 text-zinc-800 dark:text-zinc-200">
                We’re a small studio focused on strong game feel, readable systems,
                and charming presentation. From tabletop prototyping to digital
                vertical slices, we help ideas become playable.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/about-us"
                className="inline-flex h-10 items-center justify-center rounded-full border border-black/10 bg-background px-4 text-sm font-medium transition-colors hover:bg-black/[.04] dark:border-white/10 dark:hover:bg-white/[.06]"
              >
                Learn more
              </Link>
              <Link
                href="/services"
                className="inline-flex h-10 items-center justify-center rounded-full bg-accent-orange px-4 text-sm font-semibold text-black transition-colors hover:bg-[#ff6f10]"
              >
                See services
              </Link>
            </div>
          </section>

          <section className="block">
            <div className="mb-4">
              <h2 className="text-xl font-semibold tracking-tight">Meet the Team</h2>
              <p className="mt-1 text-sm text-zinc-800 dark:text-zinc-200">
                A cross-discipline crew of makers.
              </p>
            </div>

            <Carousel
              label="Team members"
              slides={team.map((member) => (
                <div key={member.name} className="grid gap-6 p-6 sm:grid-cols-[0.35fr_0.65fr] sm:items-center sm:gap-10 sm:p-8">
                  <div className="relative aspect-square w-full overflow-hidden rounded-2xl border border-black/10 bg-zinc-100 dark:border-white/10 dark:bg-zinc-900">
                    <Image
                      src={member.imageSrc}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="(min-width: 640px) 24vw, 100vw"
                    />
                  </div>
                  <div className="grid gap-4">
                    <div>
                      <h3 className="text-2xl font-semibold tracking-tight">
                        {member.name}
                      </h3>
                      <p className="mt-1 text-sm text-zinc-800 dark:text-zinc-200">
                        {member.role}
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                      {member.links?.map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          className="inline-flex h-10 items-center justify-center rounded-full border border-black/10 bg-background px-4 text-sm font-medium transition-colors hover:bg-black/[.04] dark:border-white/10 dark:hover:bg-white/[.06]"
                        >
                          {link.label}
                        </Link>
                      ))}
                      <Link
                        href="/contact"
                        className="inline-flex h-10 items-center justify-center rounded-full bg-accent-orange px-4 text-sm font-semibold text-black transition-colors hover:bg-[#ff6f10]"
                      >
                        Work with us
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            />
          </section>

          <section className="block rounded-3xl border border-black/10 bg-surface p-8 text-center shadow-sm dark:border-white/10">
            <h2 className="text-xl font-semibold tracking-tight">
              Have a project in mind?
            </h2>
            <p className="mx-auto max-w-2xl text-sm leading-6 text-zinc-800 dark:text-zinc-200">
              Let’s talk about prototypes, co-development, or publishing support.
              We’ll reply with next steps and a quick discovery call.
            </p>
            <div className="flex justify-center">
              <Link
                href="/contact"
                className="inline-flex h-11 items-center justify-center rounded-full bg-accent-orange px-6 text-sm font-semibold text-black transition-colors hover:bg-[#ff6f10]"
              >
                Contact Us
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}



