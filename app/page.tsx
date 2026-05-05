import Image from "next/image";
import Link from "next/link";
import Carousel from "./_components/Carousel";
import TeamCarousel from "./_components/TeamCarousel";
import ContentCard from "./_components/ContentCard";
import NewsCard from "./_components/NewsCard";

import { getLatestNews } from "@/lib/news";
import { getTeamMembers } from "@/lib/team";

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
    href: "/portfolio?type=board",
    badge: "Board",
  },
 {
    title: "Lorem Ipsum 2",
    subtitle: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    imageSrc: "/thumbnails/board-balancing.svg",
    href: "/portfolio?type=board",
    badge: "Board",
  },{
    title: "Lorem Ipsum 3",
    subtitle: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    imageSrc: "/thumbnails/board-balancing.svg",
    href: "/portfolio?type=board",
    badge: "Board",
  },{
    title: "Lorem Ipsum 4",
    subtitle: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    imageSrc: "/thumbnails/board-balancing.svg",
    href: "/portfolio?type=board",
    badge: "Board",
  }
];

const digitalPosts: Post[] = [
  {
    title: "Lorem Ipsum 5",
    subtitle: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    imageSrc: "/thumbnails/digital-controller.svg",
    href: "/portfolio?type=digital",
    badge: "Digital",
  },
  {
    title: "Lorem Ipsum 6",
    subtitle: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    imageSrc: "/thumbnails/digital-controller.svg",
    href: "/portfolio?type=digital",
    badge: "Digital",
  },{
    title: "Lorem Ipsum 7",
    subtitle: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    imageSrc: "/thumbnails/digital-controller.svg",
    href: "/portfolio?type=digital",
    badge: "Digital",
  },{
    title: "Lorem Ipsum 8",
    subtitle: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    imageSrc: "/thumbnails/digital-controller.svg",
    href: "/portfolio?type=digital",
    badge: "Digital",
  }
];

export default async function Home() {
  const latestNews = getLatestNews(3);
  const team = await getTeamMembers();

  return (
    <div className="bg-background pt-4 lg:px-18 sm:px-0 md:px-4">
      <div className="block mx-auto w-full px-4">
        <div className="space-y-8">

          <section className="intro rounded-lg p-4 block space-y-8">
            <div className="flex flex-col gap-2">
              <p className="text-sm font-bold text-black">
                Board Game + Video Game Studio
              </p>
              <h1 className="text-4xl font-extrabold tracking-tight text-black my-6 sm:text-4xl">
                We build playful worlds<br/>on the board and on the screen.
              </h1>
              <p className="max-w-2xl text-base leading-7 text-black">
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
                <h1 className="text-2xl font-semibold tracking-tight">Featured <span className="text-accent-orange">Game</span></h1>
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
              <h1 className="text-2xl font-semibold tracking-tight">Our <span className="text-accent-orange">Works</span></h1>
              <p className="mt-1 text-sm text-zinc-800 dark:text-zinc-200">
                Board games alongside digital products.
              </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <div className="grid gap-3">
                <div className="flex items-baseline justify-between">
                  <h3 className="text-base font-semibold tracking-tight">Board Games</h3>
                  <Link
                    href="/portfolio?type=board"
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
                    href="/portfolio?type=digital"
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

          <section className="block">
            <div className="mb-4">
              <h1 className="text-2xl font-semibold tracking-tight">
                Latest <span className="text-accent-orange">News</span>
              </h1>
              <p className="mt-1 text-sm text-zinc-800 dark:text-zinc-200">
                Updates and announcements from the studio.
              </p>
            </div>

            <div className="grid gap-4 lg:grid-cols-3">
              {latestNews.map((item) => (
                <NewsCard key={item.title} title={item.title} date={item.date} imageSrc={item.imageSrc} />
              ))}
            </div>

            <div className="mt-5 flex justify-center">
              <Link
                href="/news"
                className="inline-flex h-11 items-center justify-center rounded-full bg-accent-orange px-6 text-sm font-semibold text-black transition-colors hover:bg-[#ff6f10]"
              >
                More news
              </Link>
            </div>
          </section>

          <section className="block rounded-3xl border border-black/10 bg-surface p-4 shadow-sm dark:border-white/10">
            <div className="group lg:flex lg:space-x-4 md:space-y-4 sm:space-y-4 md:block sm:block">
              <div className="min-w-0 lg:flex-1 md:w-full sm:w-full">
                <div className="block space-y-4">
                  <h2 className="text-xl font-semibold tracking-tight">About Us</h2>
                  <p className="max-w-3xl text-sm leading-6 text-zinc-800 dark:text-zinc-200">
                   We’re DHELANGAN STUDIO – “ Dhelangan is a game development studio based in Yogyakarta, Indonesia. We thrive to deliver well-designed games and the best service for gamification we provide. “
                  </p>
                  <h2 className="text-xl font-semibold tracking-tight">Address</h2>
                  <p className="max-w-3xl text-sm leading-6 text-zinc-800 dark:text-zinc-200">
                   Jl. XX I No.67, Desa XX, Kab XX, Kec XX, Daerah Istimewa Yogyakarta XXXXX
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3 mt-4 mb-4">
                  <Link
                    href="/about-us"
                    className="inline-flex h-10 items-center justify-center rounded-full border border-black/10 bg-background px-4 text-sm font-medium transition-colors hover:bg-black/[.04] dark:border-white/10 dark:hover:bg-white/[.06]"
                  >
                    Learn more
                  </Link>
                </div>
              </div>

               <div className="lg:flex-1 md:w-full sm:w-full relative aspect-[2/1] overflow-hidden rounded-xl bg-black/[.06] dark:bg-white/[.06]">
                    <Image
                      src="/thumbnails/team-creative.svg"
                      alt=""
                      fill
                      className="object-cover"
                      sizes="(min-width: 640px) 40vw, 100vw"
                      priority
                    />
                  </div>
            </div>
           
          </section>

          <section className="block">
            <div className="mb-4">
              <h1 className="text-2xl font-semibold tracking-tight">Meet the <span className="text-accent-orange">Team</span></h1>
              <p className="mt-1 text-sm text-zinc-800 dark:text-zinc-200">
                A cross-discipline crew of makers.
              </p>
            </div>

            <TeamCarousel members={team} />
            {/* <Carousel
              label="Team members"
              slides={team.map((member) => (
                <div key={member.name} className="block">
                </div>
              ))}
            /> */}
          </section>

          <section className="block space-y-8 rounded-3xl border border-black/10 bg-surface p-8 text-center shadow-sm dark:border-white/10">
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
