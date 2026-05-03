import Link from "next/link";
import PageHeader from "../_components/PageHeader";

export const metadata = {
  title: "Services",
};

const services = [
  {
    title: "Board Game Design",
    body: "Core loop, balance passes, component design, and playtest facilitation.",
  },
  {
    title: "Digital Prototyping",
    body: "Rapid prototypes and vertical slices focused on feel and readability.",
  },
  {
    title: "Rules + UX Clarity",
    body: "Rulebooks, onboarding flows, and UI/UX audits for learnability.",
  },
  {
    title: "Co-Development",
    body: "Hands-on support from ideation to launch: design, engineering, and art.",
  },
];

export default function ServicesPage() {
  return (
    <div className="bg-zinc-50 dark:bg-black">
      <div className="mx-auto w-full max-w-6xl px-5 py-12 sm:py-16">
        <div className="grid gap-10">
          <PageHeader
            title="Services"
            description="From early prototypes to production-ready builds, we help teams ship playful experiences."
          />

          <div className="grid gap-4 sm:grid-cols-2">
            {services.map((service) => (
              <div
                key={service.title}
                className="rounded-3xl border border-black/10 bg-white p-7 shadow-sm dark:border-white/10 dark:bg-zinc-950"
              >
                <h2 className="text-lg font-semibold tracking-tight">{service.title}</h2>
                <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                  {service.body}
                </p>
              </div>
            ))}
          </div>

          <div className="rounded-3xl border border-black/10 bg-white p-8 shadow-sm dark:border-white/10 dark:bg-zinc-950">
            <h2 className="text-lg font-semibold tracking-tight">How we start</h2>
            <ol className="mt-4 grid gap-3 text-sm text-zinc-700 dark:text-zinc-300 sm:grid-cols-3">
              <li className="rounded-2xl border border-black/10 bg-background p-4 dark:border-white/10">
                1) Discovery call
              </li>
              <li className="rounded-2xl border border-black/10 bg-background p-4 dark:border-white/10">
                2) Prototype plan
              </li>
              <li className="rounded-2xl border border-black/10 bg-background p-4 dark:border-white/10">
                3) First playable
              </li>
            </ol>
            <div className="mt-6">
              <Link
                href="/contact"
                className="inline-flex h-11 items-center justify-center rounded-full bg-foreground px-6 text-sm font-medium text-background transition-colors hover:bg-zinc-800 dark:hover:bg-zinc-200 dark:hover:text-black"
              >
                Request a quote
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
