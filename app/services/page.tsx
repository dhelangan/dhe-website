import Link from "next/link";
import PageHeader from "../_components/PageHeader";
import Reveal from "../_components/Reveal";

export const metadata = {
  title: "Services",
};

const stats = [
  { label: "Years of experience", value: "10+" },
  { label: "Number of client", value: "30+" },
  { label: "Project delivered", value: "60+" },
  { label: "Rating", value: "5.0/5" },
];

const services = [
  {
    title: "Service 1",
    category: "Art",
    body: "Character, prop, and scene illustration with consistent style + delivery-ready files.",
  },
  {
    title: "Service 2",
    category: "Brand",
    body: "Visual identity systems that translate cleanly across social, web, and print.",
  },
  {
    title: "Service 3",
    category: "Product",
    body: "User flows, wireframes, and high-fidelity UI for web + mobile.",
  },
  {
    title: "Service 4",
    category: "Engineering",
    body: "Modern, responsive websites with performance and SEO baked in.",
  },

  {
    title: "Service 5",
    category: "Engineering",
    body: "Modern, responsive websites with performance and SEO baked in.",
  },
  
  {
    title: "Service 6",
    category: "Engineering",
    body: "Modern, responsive websites with performance and SEO baked in.",
  },
  
  {
    title: "Service 7",
    category: "Engineering",
    body: "Modern, responsive websites with performance and SEO baked in.",
  },
  
  {
    title: "Service 8",
    category: "Engineering",
    body: "Modern, responsive websites with performance and SEO baked in.",
  },
  
  {
    title: "Service 9",
    category: "Engineering",
    body: "Modern, responsive websites with performance and SEO baked in.",
  },
  
  {
    title: "Service 10",
    category: "Engineering",
    body: "Modern, responsive websites with performance and SEO baked in.",
  },
  
  {
    title: "Service 11",
    category: "Engineering",
    body: "Modern, responsive websites with performance and SEO baked in.",
  },
  
  {
    title: "Service 12",
    category: "Engineering",
    body: "Modern, responsive websites with performance and SEO baked in.",
  },
];

const deliveredProjects = [
  { title: "Project 1", category: "Game Development" },
  { title: "Project 2", category: "Game Design" },
  { title: "Project 3", category: "3D Model" },
  { title: "Project 4", category: "2D Art" },
  { title: "Project 5", category: "Music Composer" },
  { title: "Project 6", category: "Script Writing" }
];

const qna = [
  {
    q: "How long does a typical project take?",
    a: "Timelines vary by scope. After a short discovery call, we provide a clear schedule with milestones and review rounds.",
  },
  {
    q: "Do you offer revisions?",
    a: "Yes. Each service includes review rounds (defined up front) to keep feedback structured and delivery predictable.",
  },
  {
    q: "Can you work with an existing brand?",
    a: "Absolutely. We can match and extend existing brand guidelines, or refresh them while keeping what already works.",
  },
];

const reviews = [
  {
    text: "Fast turnaround and great communication. The final output exceeded expectations.",
    source: "Google Reviews",
    profile: "A. Client",
    stars: 5,
  },
  {
    text: "The process was clear from start to finish, and the design system is very easy to maintain.",
    source: "Upwork",
    profile: "B. Client",
    stars: 5,
  },
  
  {
    text: "The process was clear from start to finish, and the design system is very easy to maintain.",
    source: "Upwork",
    profile: "C. Client",
    stars: 5,
  },
  
  {
    text: "The process was clear from start to finish, and the design system is very easy to maintain.",
    source: "Upwork",
    profile: "D. Client",
    stars: 5,
  },
  
  {
    text: "The process was clear from start to finish, and the design system is very easy to maintain.",
    source: "Upwork",
    profile: "E. Client",
    stars: 5,
  },

];

function Stars({ value }: { value: number }) {
  const clamped = Math.max(0, Math.min(5, Math.round(value)));
  return (
    <div className="flex items-center gap-1" aria-label={`${clamped} out of 5 stars`}>
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

export default function ServicesPage() {
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
            <section className="rounded-3xl border border-black/10 bg-surface p-8 shadow-sm dark:border-white/10">
              <h2 className="text-lg font-semibold tracking-tight">Stats</h2>
              <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-2xl border border-black/10 bg-background p-5 dark:border-white/10"
                  >
                    <div className="text-2xl font-semibold tracking-tight">{stat.value}</div>
                    <div className="mt-1 text-sm text-zinc-700 dark:text-zinc-300">{stat.label}</div>
                  </div>
                ))}
              </div>
            </section>
          </Reveal>

          <Reveal delayMs={60}>
            <section className="grid gap-4">
              <div className="flex items-end justify-between gap-6">
                <div className="grid gap-1">
                  <h2 className="text-lg font-semibold tracking-tight">Services</h2>
                  <p className="text-sm text-zinc-700 dark:text-zinc-300">
                    Pick what you need, or combine services into a single package.
                  </p>
                </div>
                <Link
                  href="/contact"
                  className="hidden h-11 items-center justify-center rounded-full bg-accent-orange px-6 text-sm font-semibold text-black transition-colors hover:bg-[#ff6f10] sm:inline-flex"
                >
                  Request a quote
                </Link>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {services.map((service) => (
                  <div
                    key={service.title}
                    className="rounded-3xl border border-black/10 bg-surface p-4 shadow-sm dark:border-white/10"
                  >
                    <div className="grid gap-4">
                      <div className="aspect-[16/9] w-full rounded-2xl border border-black/10 bg-background dark:border-white/10">
                        <div className="flex h-full items-center justify-center text-sm text-zinc-600 dark:text-zinc-300">
                          Illustration
                        </div>
                      </div>

                      <div>
                        <div className="text-xs font-medium uppercase tracking-wide text-zinc-600 dark:text-zinc-300">
                          {service.category}
                        </div>
                        <h3 className="mt-1 text-lg font-semibold tracking-tight">{service.title}</h3>
                        <p className="mt-2 text-sm leading-6 text-zinc-800 dark:text-zinc-200">
                          {service.body}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="sm:hidden">
                <Link
                  href="/contact"
                  className="inline-flex h-11 w-full items-center justify-center rounded-full bg-accent-orange px-6 text-sm font-semibold text-black transition-colors hover:bg-[#ff6f10]"
                >
                  Request a quote
                </Link>
              </div>
            </section>
          </Reveal>

          <Reveal delayMs={80}>
            <section className="grid gap-4">
              <div className="grid gap-1">
                <h2 className="text-lg font-semibold tracking-tight">Project delivered</h2>
                <p className="text-sm text-zinc-700 dark:text-zinc-300">
                  A small selection of recent deliveries.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {deliveredProjects.map((project) => (
                  <div
                    key={project.title}
                    className="rounded-3xl border border-black/10 bg-surface p-6 shadow-sm dark:border-white/10"
                  >
                    <div className="aspect-[16/10] w-full rounded-2xl border border-black/10 bg-background dark:border-white/10">
                      <div className="flex h-full items-center justify-center text-sm text-zinc-600 dark:text-zinc-300">
                        Thumbnail
                      </div>
                    </div>
                    <div className="mt-5">
                      <div className="text-sm font-semibold tracking-tight">{project.title}</div>
                      <div className="mt-1 text-sm text-zinc-700 dark:text-zinc-300">{project.category}</div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </Reveal>

          <Reveal delayMs={100}>
            <section className="rounded-3xl border border-black/10 bg-surface p-8 shadow-sm dark:border-white/10">
              <h2 className="text-lg font-semibold tracking-tight">QnA</h2>
              <div className="mt-5 grid gap-3">
                {qna.map((item) => (
                  <details
                    key={item.q}
                    className="group rounded-2xl border border-black/10 bg-background p-5 dark:border-white/10"
                  >
                    <summary className="cursor-pointer list-none font-semibold tracking-tight">
                      <div className="flex items-start justify-between gap-4">
                        <span>{item.q}</span>
                        <span className="mt-0.5 text-zinc-600 transition-transform group-open:rotate-45 dark:text-zinc-300" aria-hidden="true">
                          +
                        </span>
                      </div>
                    </summary>
                    <p className="mt-3 text-sm leading-6 text-zinc-800 dark:text-zinc-200">{item.a}</p>
                  </details>
                ))}
              </div>
            </section>
          </Reveal>

          <Reveal delayMs={120}>
            <section className="grid gap-4">
              <div className="grid gap-1">
                <h2 className="text-lg font-semibold tracking-tight">Customer reviews</h2>
                <p className="text-sm text-zinc-700 dark:text-zinc-300">
                  Overall reviews and highlights from past customers.
                </p>
              </div>

              <div className="rounded-3xl border border-black/10 bg-surface p-8 shadow-sm dark:border-white/10">
                <div className="flex flex-wrap items-end justify-between gap-6">
                  <div>
                    <div className="text-3xl font-semibold tracking-tight">Overall reviews</div>
                    <div className="mt-2 flex items-center gap-3">
                      <Stars value={5} />
                      <div className="text-sm text-zinc-700 dark:text-zinc-300">Based on recent feedback</div>
                    </div>
                  </div>
                  <Link
                    href="/contact"
                    className="inline-flex h-11 items-center justify-center rounded-full bg-accent-orange px-6 text-sm font-semibold text-black transition-colors hover:bg-[#ff6f10]"
                  >
                    Start a project
                  </Link>
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  {reviews.map((review) => (
                    <div
                      key={`${review.profile}-${review.source}`}
                      className="rounded-2xl border border-black/10 bg-background p-6 dark:border-white/10"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="text-sm font-semibold tracking-tight">{review.profile}</div>
                        <Stars value={review.stars} />
                      </div>
                      <p className="mt-3 text-sm leading-6 text-zinc-800 dark:text-zinc-200">
                        {review.text}
                      </p>
                      <div className="mt-4 text-sm text-zinc-700 dark:text-zinc-300">{review.source}</div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </Reveal>
        </div>
      </div>
    </div>
  );
}
