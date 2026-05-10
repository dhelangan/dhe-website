import Link from "next/link";
import Carousel from "./_components/Carousel";
import TeamCarousel from "./_components/TeamCarousel";
import ContentCard from "./_components/ContentCard";
import NewsCard from "./_components/NewsCard";
import LazyImage from "./_components/LazyImage";
import ZoomableImage from "./_components/ZoomableImage";
import Reveal from "./_components/Reveal";

import { getLatestNews } from "@/lib/news";
import { getTeamMembers } from "@/lib/team";
import { getAllPortfolio, slugifyPortfolioTitle } from "@/lib/portfolio";
import { getAllGallery } from "@/lib/gallery";

type PinnedGame = {
  title: string;
  tagline: string;
  coverSrc: string;
  href: string;
  tags: string[];
};

type Post = {
  title: string;
  subtitle: string;
  imageSrc: string;
  href: string;
  badge?: string;
  type?: string;
  platforms?: string[];
  genres?: string[];
};

export default async function Home() {
  const latestNews = await getLatestNews(4);
  const team = await getTeamMembers();
  const portfolio = await getAllPortfolio();
  const gallery = await getAllGallery();

  const aboutImage =
    gallery.length > 0
      ? gallery[Math.floor(Math.random() * gallery.length)]!.image
      : "/thumbnails/team-creative.svg";

  const featuredItems = portfolio.filter((p) => p.featured);
  const pinnedGames: PinnedGame[] = (featuredItems.length ? featuredItems : portfolio)
    .slice(0, 6)
    .map((item) => ({
      title: item.title,
      tagline: item.summary,
      coverSrc: item.thumbnailSrc,
      href: `/portfolio/read/${slugifyPortfolioTitle(item.title)}`,
      tags: item.genres.slice(0, 3),
    }));

  const boardPosts: Post[] = portfolio
    .filter((p) => p.type === "board")
    .slice(0, 4)
    .map((item) => ({
      title: item.title,
      subtitle: item.summary,
      imageSrc: item.thumbnailSrc,
      href: `/portfolio/read/${slugifyPortfolioTitle(item.title)}`,
      badge: item.status,
      type: item.type,
      platforms: item.platforms,
      genres: item.genres,
    }));

  const digitalPosts: Post[] = portfolio
    .filter((p) => p.type === "digital")
    .slice(0, 4)
    .map((item) => ({
      title: item.title,
      subtitle: item.summary,
      imageSrc: item.thumbnailSrc,
      href: `/portfolio/read/${slugifyPortfolioTitle(item.title)}`,
      badge: item.status,
      type: item.type,
      platforms: item.platforms,
      genres: item.genres,
    }));

  return (
    <div className="bg-background pt-4 lg:px-18 sm:px-0 md:px-4">
      <div className="block mx-auto w-full px-4">
        <div className="space-y-8">

          <Reveal as="section" className="intro rounded-lg block space-y-4 bg-cover bg-bottom-right sm:space-y-8 sm:bg-contain sm:bg-top-right " delayMs={20}>
            <div className="flex flex-col gap-2 px-4 pt-4 pb-0 ">
              <p className="text-sm font-bold text-black">
                Board Game + Video Game Studio
              </p>
              <h1 className="text-2xl font-extrabold tracking-tight text-black my-2 sm:my-6 sm:text-4xl">
                We build playful worlds<br/>on the board and on the screen.
              </h1>
              <p className="hidden sm:block max-w-2xl text-base leading-7 text-black">
                Dhelangan Studio crafts board games, interactive experiences, and
                production-ready prototypes. Explore our pinned project, browse
                recent posts, and meet the team.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 px-4 pt-0 pb-4 ">
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
          </Reveal>

          <Reveal as="section" className="block" delayMs={50}>
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
              slides={pinnedGames.map((game, slideIndex) => (
                <div
                  key={game.title}
                  className="relative aspect-[16/9] h-[350px] w-full overflow-hidden rounded-2xl bg-black/[.06] dark:bg-white/[.06]"
                >
                  <LazyImage
                    src={game.coverSrc}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="100vw"
                    priority={slideIndex === 0}
                    loading={slideIndex === 0 ? "eager" : "lazy"}
                  />

                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-white/85 via-white/20 to-transparent dark:from-black/80 dark:via-black/30" />

                  <div className="absolute inset-x-0 bottom-0 z-10 p-2 sm:p-8">
                    <div className="flex flex-wrap gap-2">
                      {game.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full border border-black/10 bg-white/70 px-3 py-1 text-xs font-medium text-zinc-900 backdrop-blur dark:border-white/10 dark:bg-black/40 dark:text-zinc-100"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <span className="inline-block bg-surface/80 p-2 rounded-md mt-4 text-2xl font-extrabold tracking-tight text-zinc-950 dark:text-white sm:text-3xl">
                      {game.title}
                    </span>
                    <p className="bg-surface/80 p-2 rounded-md mt-2 max-w-2xl text-sm leading-6 text-zinc-800 dark:text-zinc-200 line-clamp-2 sm:line-clamp-5">
                      {game.tagline}
                    </p>

                    <div className="mt-5 flex flex-wrap items-center gap-3">
                      <Link
                        href={game.href}
                        className="inline-flex h-10 items-center justify-center rounded-full bg-accent-orange px-4 text-sm font-semibold text-black transition-colors hover:bg-[#ff6f10]"
                      >
                        See Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            />
          </Reveal>

          <Reveal as="section" className="grid gap-6" delayMs={80}>
            <div className="mb-4">
              <h1 className="text-2xl font-semibold tracking-tight">Our <span className="text-accent-orange">Games</span></h1>
              <p className="mt-1 text-sm text-zinc-800 dark:text-zinc-200">
                Board games alongside digital products.
              </p>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <div className="grid gap-3 items-start content-start">
                <div className="flex items-baseline justify-between h-8">
                  <h2 className="text-base font-semibold tracking-tight">Board Games</h2>
                  <Link
                    href="/portfolio?type=board"
                    className="text-sm capitalize font-bold text-accent-orange transition-colors hover:text-accent-red"
                  >
                    View all
                  </Link>
                </div>
                <div className="h-full">
                  <div className="grid gap-3 items-stretch">
                    {boardPosts.map((post) => (
                      <ContentCard key={post.title} {...post} />
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid gap-3 items-start content-start">
                <div className="flex items-baseline justify-between h-8">
                  <h2 className="text-base font-semibold tracking-tight">Digital Games</h2>
                  <Link
                    href="/portfolio?type=digital"
                    className="text-sm capitalize font-bold text-accent-orange transition-colors hover:text-accent-red"
                  >
                    View all
                  </Link>
                </div>
                <div className="grid gap-3 items-stretch">
                  {digitalPosts.map((post) => (
                    <ContentCard key={post.title} {...post} />
                  ))}
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal as="section" className="block" delayMs={110}>
            <div className="mb-4">
              <h1 className="text-2xl font-semibold tracking-tight">
                Latest <span className="text-accent-orange">News</span>
              </h1>
              <p className="mt-1 text-sm text-zinc-800 dark:text-zinc-200">
                Updates and announcements from the studio.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-4 grid-cols-2">
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
          </Reveal>

          <Reveal
            as="section"
            className="block rounded-3xl border border-black/10 bg-surface p-4 shadow-sm dark:border-white/10"
            delayMs={140}
          >
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
                   <p className="max-w-3xl text-sm leading-6 text-zinc-800 dark:text-zinc-200">
                   Email : dhelangan@gmail.com
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3 mt-4 mb-4">
                  <Link
                    href="/about-us"
                    className="inline-flex h-10 items-center justify-center rounded-full border border-black/10 text-surface bg-accent-orange px-4 text-sm font-medium transition-colors hover:bg-accent-red"
                  >
                    Learn more
                  </Link>
                </div>
              </div>

               <ZoomableImage
                 src={aboutImage}
                 alt="About Dhelangan Studio"
                 sizes="(min-width: 1024px) 40vw, 100vw"
                 containerClassName="lg:flex-1 w-full relative aspect-[2/1] overflow-hidden rounded-xl bg-black/[.06] dark:bg-white/[.06]"
               />
            </div>
           
          </Reveal>

          <Reveal as="section" className="block" delayMs={170}>
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
          </Reveal>

          <Reveal
            as="section"
            className="block space-y-8 rounded-3xl border border-black/10 bg-surface p-8 text-center shadow-sm dark:border-white/10"
            delayMs={200}
          >
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
          </Reveal>
        </div>
      </div>
    </div>
  );
}
