import Image from "next/image";
import { headers } from "next/headers";
import PageHeader from "../_components/PageHeader";
import Reveal from "../_components/Reveal";
import ReviewsCarousel from "./ReviewsCarousel";
import ZoomableImage from "../_components/ZoomableImage";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const metadata = {
  title: "Services",
};

type ServiceItem = {
  id: number;
  illustration?: string | null;
  category?: string | null;
  title?: string | null;
  description?: string | null;
};

type ProjectItem = {
  id: number;
  thumbnail?: string | null;
  title?: string | null;
  description?: string | null;
  category?: string | null;
};

type QnaItem = {
  id: number;
  question?: string | null;
  answer?: string | null;
};

type ReviewItem = {
  id: number;
  review?: string | null;
  source?: string | null;
  client?: string | null;
  star?: number | null;
};

type ServicesApiResponse = {
  services: ServiceItem[];
  projects: ProjectItem[];
  qna: QnaItem[];
  reviews: ReviewItem[];
};

async function getServicesData(): Promise<ServicesApiResponse> {
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
  const proto = h.get("x-forwarded-proto") ?? "http";
  const baseUrl = `${proto}://${host}`;
  const cookie = h.get("cookie") ?? undefined;

  const res = await fetch(`${baseUrl}/api/services`, {
    headers: cookie ? { cookie } : undefined,
    next: { revalidate: 60 },
  });

  if (!res.ok) throw new Error(`Failed to load /api/services (${res.status})`);
  return (await res.json()) as ServicesApiResponse;
}

function Stars({ value }: { value: number }) {
  const clamped = Math.max(0, Math.min(5, Math.round(value)));
  return (
    <div className="flex items-center gap-1 text-2xl" aria-label={`${clamped} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span
          key={i}
          className={i < clamped ? "text-amber-500" : "text-zinc-300 dark:text-zinc-600"}
          aria-hidden="true"
        >
          ★
        </span>
      ))}
    </div>
  );
}

export default async function ServicesPage() {
  const data = await getServicesData();
  const services = data.services ?? [];
  const projects = data.projects ?? [];
  const qna = data.qna ?? [];
  const reviews = data.reviews ?? [];

  const projectCount = projects.length;
  const clientCount = reviews.length;
  const avgRating =
    reviews.length > 0 ? reviews.reduce((sum, r) => sum + (r.star ?? 0), 0) / reviews.length : 0;

  const stats = [
    { label: "Years of experience", value: "5+" },
    { label: "Number of Client", value: clientCount > 0 ? `${clientCount}+` : "—" },
    { label: "Number of Project Delivered", value: projectCount > 0 ? `${projectCount}+` : "—" },
    { label: "Rating", value: avgRating > 0 ? `${avgRating.toFixed(1)}/5` : "—" },
  ];

  const starCounts = [1, 2, 3, 4, 5].reduce<Record<number, number>>((acc, star) => {
    acc[star] = 0;
    return acc;
  }, {});

  for (const r of reviews) {
    const star = typeof r.star === "number" ? Math.round(r.star) : 0;
    if (star >= 1 && star <= 5) starCounts[star] = (starCounts[star] ?? 0) + 1;
  }

  return (
    <div className="bg-background">
      <div className="mx-auto w-full max-w-6xl px-4 p-0">
        <div className="grid gap-10">
          <Reveal>
            <PageHeader
              title="Services"
              description="From early prototypes to production-ready builds, we help teams ship playful experiences."
            />
          </Reveal>

          <Reveal delayMs={40}>
            <section className="rounded-3xl border border-black/10 bg-surface p-2 shadow-sm dark:border-white/10">
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-2xl border border-black/10 bg-background p-5 dark:border-white/10"
                  >
                    <div className="text-center text-4xl text-accent-orange font-extrabold tracking-tight">{stat.value}</div>
                    <div className="text-center mt-2 text-sm text-zinc-700 dark:text-zinc-300 font-bold">{stat.label}</div>
                  </div>
                ))}
              </div>
            </section>
          </Reveal>

          <Reveal delayMs={60}>
            <section className="grid gap-4">
              <div className="flex items-end justify-between gap-6">
                <div className="grid gap-1">
                  <h1 className="text-2xl font-semibold tracking-tight">Our <span className="text-accent-orange">Services</span></h1>
                  <p className="mt-1 text-sm leading-6 text-zinc-800 dark:text-zinc-200">
                      Pick what you need, or combine services into a single package.
                  </p>
                </div>
              </div>

              <div className="grid gap-4 grid-cols-2 sm:grid-cols-4">

                {services.map((service) => (
                  
                  <Tooltip key={service.id}>
                    <div
                      className="rounded-3xl border border-black/10 bg-surface p-2 shadow-sm dark:border-white/10"
                    >
                      <div className="grid gap-4">
                        <div className="aspect-[16/9] w-full overflow-hidden rounded-2xl border border-black/10 bg-background dark:border-white/10">
                          
                          <TooltipTrigger asChild>
                            <Image
                              src={service.illustration ?? ""}
                              alt={service.title ?? "Service illustration"}
                              width={360}
                              height={360}
                              className="h-full w-full object-cover"
                              loading="lazy"
                            />
                          </TooltipTrigger>
                        </div>

                        <div>
                          <div className="text-center text-xs font-medium uppercase tracking-wide text-zinc-600 dark:text-zinc-300">
                            {service.category ?? ""}
                          </div>
                          <h3 className="text-center mt-1 text-lg font-semibold tracking-tight">{service.title ?? ""}</h3>
                          
                        </div>
                      </div>

                    <TooltipContent className="bg-background border-1 border-black/10 dark:border-white/10">
                      <p className="text-sm font-semibold leading-6 text-zinc-800 dark:text-zinc-200">
                        {service.description ?? ""}
                      </p>
                  </TooltipContent>
                  </div>
                </Tooltip>
                ))}
              </div>

            </section>
          </Reveal>

          <Reveal delayMs={80}>
            <section className="grid gap-4">
              <div className="grid gap-1">
                  <h1 className="text-2xl font-semibold tracking-tight">Freelance <span className="text-accent-orange">Sites</span></h1>
                  <p className="mt-1 text-sm leading-6 text-zinc-800 dark:text-zinc-200">
                    Find me on these freelance platforms for more services and custom offers.
                  </p>
                </div>

              <div className="grid gap-3 sm:grid-cols-3 grid-cols-1">
                
                  <div
                    className="rounded-2xl border border-black/10 bg-surface p-4 max-h-70 dark:border-white/10"
                  >
                    <div className="max-h-45 rounded-2xl">
                       <Image
                            src="/logo/fiverr.png"
                            alt="Fiverr"
                            width={360}
                            height={360}
                            className="w-full object-cover h-45 rounded-2xl mix-blend-difference"
                            loading="lazy"
                          />
                    </div>
                    <div className="text-center mt-2 text-sm text-zinc-700 dark:text-zinc-300 font-bold">
                      <a
                        href="https://fiverr.com/achmadjodhy/"
                        target="_blank"
                        rel="noreferrer"
                        className="fiverr inline-flex h-11 w-full items-center justify-center rounded-full bg-accent-orange px-6 text-sm font-semibold text-black transition-colors hover:bg-[#ff6f10]"
                      >
                      Visit Fiverr
                    </a>
                  </div>
                  </div>
                  <div
                    className="rounded-2xl border border-black/10 bg-surface p-4 max-h-70 dark:border-white/10"
                  >
                    <div className="rounded-2xl max-h-45 text-center text-4xl text-accent-orange font-extrabold tracking-tight">
                       <Image
                            src="/logo/fastwork.png"
                            alt="Fastwork"
                            width={360}
                            height={360}
                            className="w-full object-cover h-45 rounded-2xl mix-blend-difference"
                            loading="lazy"
                          />
                    </div>
                    <div className="rounded-2xl h-65 text-center mt-2 text-sm text-zinc-700 dark:text-zinc-300 font-bold">
                      <a
                        href="https://fastwork.id/user/dhelangan"
                        target="_blank"
                        rel="noreferrer"
                        className="fastwork inline-flex h-11 w-full items-center justify-center rounded-full bg-accent-orange px-6 text-sm font-semibold text-black transition-colors hover:bg-[#ff6f10]"
                      >
                      Visit Fastwork
                    </a>
                  </div>
                  </div>
                  <div
                    className="rounded-2xl border border-black/10 bg-surface p-4 max-h-70 dark:border-white/10"
                  >
                    <div className="rounded-2xl max-h-45 text-center text-4xl text-accent-orange font-extrabold tracking-tight">
                       <Image
                            src="/logo/upwork.png"
                            alt="Upwork"
                            width={360}
                            height={360}
                            className="w-full object-cover h-45 rounded-2xl mix-blend-difference"
                            loading="lazy"
                          />
                    </div>
                    <div className="text-center mt-2 text-sm text-zinc-700 dark:text-zinc-300 font-bold">
                      <a
                        href="https://www.upwork.com/agencies/1569445868351041536/"
                        target="_blank"
                        rel="noreferrer"
                        className="upwork inline-flex h-11 w-full items-center justify-center rounded-full bg-accent-orange px-6 text-sm font-semibold text-black transition-colors hover:bg-[#ff6f10]"
                      >
                      Visit Upwork
                    </a>
                  </div>
                  </div>
                </div>
            </section>
          </Reveal>

          <Reveal delayMs={100}>
            <section className="grid gap-4">
              <div className="grid gap-1">
                <h1 className="text-2xl font-semibold tracking-tight">Project <span className="text-accent-orange">Delivered</span></h1>
                  <p className="mt-1 text-sm leading-6 text-zinc-800 dark:text-zinc-200">
                    A small selection of recent deliveries.
                  </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {projects.map((project) => (
                  <div
                    key={project.id}
                    className="rounded-3xl border border-black/10 bg-surface p-4 shadow-sm dark:border-white/10"
                  >
                    <div className="aspect-[16/10] w-full overflow-hidden rounded-2xl border border-black/10 bg-background dark:border-white/10">

                       <ZoomableImage
                          key={project.id}
                          src={project.thumbnail ?? ""}
                          alt={project.title ?? "Project thumbnail"}
                          sizes="(min-width: 1024px) 22vw, (min-width: 640px) 45vw, 100vw"
                          containerClassName="relative aspect-[4/3] w-full overflow-hidden rounded-3xl border border-black/10 bg-black/[.06] shadow-sm dark:border-white/10 dark:bg-white/[.06]"
                        />
                    </div>
                    <div className="mt-5">
                      <div className="text-sm font-semibold tracking-tight">{project.title ?? ""}</div>
                      <div className="mt-1 text-sm text-zinc-700 dark:text-zinc-300">{project.category ?? ""}</div>
                      {project.description ? (
                        <p className="mt-2 text-sm leading-6 text-zinc-800 dark:text-zinc-200">
                          {project.description}
                        </p>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </Reveal>

          <Reveal delayMs={120}>

            <section className="grid gap-4 ">
            <div className="flex items-end justify-between gap-6">
                <div className="grid gap-1">
                  <h1 className="text-2xl font-semibold tracking-tight">Question And <span className="text-accent-orange">Answer</span></h1>
                  <p className="mt-1 text-sm leading-6 text-zinc-800 dark:text-zinc-200">
                    Frequently asked questions about our services and process.
                  </p>
                </div>
              </div>

              <div className="grid gap-3 rounded-3xl border border-black/10 bg-surface p-4 shadow-sm dark:border-white/10 md:grid-cols-1">
                {qna.map((item) => (
                  <details
                    key={item.id}
                    className="group rounded-2xl border border-black/10 bg-background p-4 dark:border-white/10"
                  >
                    <summary className="cursor-pointer list-none font-semibold tracking-tight">
                      <div className="flex items-start justify-between gap-4">
                        <span>{item.question ?? ""}</span>
                        <span
                          key={item.id}
                          className="mt-0.5 text-zinc-600 transition-transform group-open:rotate-45 dark:text-zinc-300"
                          aria-hidden="true"
                        >
                          +
                        </span>
                      </div>
                    </summary>
                    <p className="mt-3 text-sm leading-6 text-zinc-800 dark:text-zinc-200">
                      {item.answer ?? ""}
                    </p>
                  </details>
                ))}
              </div>
            </section>
          </Reveal>

          <Reveal delayMs={140}>
            <section className="grid gap-4 ">
              <div className="grid gap-1">
                <h1 className="text-2xl font-semibold tracking-tight">Customer <span className="text-accent-orange">Reviews</span></h1>
                <p className="mt-1 text-sm leading-6 text-zinc-800 dark:text-zinc-200">
                  Overall reviews and highlights from past customers.
                </p>
              </div>

              <div className="grid gap-4 lg:grid-cols-3 rounded-3xl border border-black/10 bg-surface p-4 shadow-sm dark:border-white/10">
                <div className="p-1">
                  <div className="text-lg font-semibold tracking-tight">Overall reviews</div>
                  <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
                    <div>
                      <div className="text-4xl font-semibold tracking-tight">
                        {reviews.length > 0 ? avgRating.toFixed(1) : "—"}
                      </div>
                      <div className="mt-1 flex items-center gap-3">
                        <Stars value={avgRating || 0} />
                        <div className="text-sm text-zinc-700 dark:text-zinc-300">
                          {reviews.length > 0 ? `${reviews.length} reviews` : "No reviews yet"}
                        </div>
                      </div>
                    </div>
                    
                  </div>

                  <div className="mt-4 grid gap-1">
                    {[5, 4, 3, 2, 1].map((star) => {
                      const count = starCounts[star] ?? 0;
                      const pct = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
                      return (
                        <div key={star} className="grid gap-2">
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold">{star}</span>
                              <span className="text-zinc-600 dark:text-zinc-300">star</span>
                            </div>
                            <span className="text-zinc-600 dark:text-zinc-300">{count}</span>
                          </div>
                          <div className="h-2 w-full rounded-full bg-black/10 dark:bg-white/10">
                            <div
                              className="h-2 rounded-full bg-amber-500"
                              style={{ width: `${pct}%` }}
                              aria-hidden="true"
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="lg:col-span-2">
                  <ReviewsCarousel reviews={reviews} />
                </div>
              </div>
            </section>
          </Reveal>
        </div>
      </div>
    </div>
  );
}
