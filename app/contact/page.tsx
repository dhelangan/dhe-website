import PageHeader from "../_components/PageHeader";
import Reveal from "../_components/Reveal";

export const metadata = {
  title: "Contact",
};

export default function ContactPage() {
  return (
    <div className="bg-background">
      <div className="mx-auto w-full max-w-6xl px-4 p-0">
        <div className="grid gap-10">
          <Reveal>
            <PageHeader
              title="Contact"
              description="Tell us about your project. We’ll reply with next steps and a quick timeline."
            />
          </Reveal>

          <div className="grid gap-6 lg:grid-cols-2">
            <Reveal
              as="section"
              className="rounded-3xl border border-black/10 bg-surface p-8 shadow-sm dark:border-white/10 "
              delayMs={60}
            >
              <h2 className="text-lg font-semibold tracking-tight">Send a message</h2>
              <p className="mt-2 text-sm leading-6 text-zinc-800 dark:text-zinc-200">
                This is a static form placeholder. Hook it up to your preferred
                provider (email, API route, or CRM).
              </p>

              <form className="mt-6 grid gap-4">
                <label className="grid gap-2 text-sm font-medium">
                  Name
                  <input
                    className="h-11 rounded-2xl border border-black/10 bg-background px-4 text-sm outline-none ring-0 focus:border-black/20 dark:border-white/10 dark:focus:border-white/20"
                    placeholder="Your name"
                  />
                </label>
                <label className="grid gap-2 text-sm font-medium">
                  Email
                  <input
                    type="email"
                    className="h-11 rounded-2xl border border-black/10 bg-background px-4 text-sm outline-none ring-0 focus:border-black/20 dark:border-white/10 dark:focus:border-white/20"
                    placeholder="you@example.com"
                  />
                </label>
                <label className="grid gap-2 text-sm font-medium">
                  Message
                  <textarea
                    className="min-h-32 rounded-2xl border border-black/10 bg-background px-4 py-3 text-sm outline-none ring-0 focus:border-black/20 dark:border-white/10 dark:focus:border-white/20"
                    placeholder="What are you building? What help do you need?"
                  />
                </label>
                <button
                  type="button"
                  className="inline-flex h-11 items-center justify-center rounded-full bg-accent-orange px-6 text-sm font-semibold text-black transition-colors hover:bg-[#ff6f10]"
                >
                  Send (placeholder)
                </button>
              </form>
            </Reveal>

            <Reveal
              as="section"
              className="rounded-3xl border border-black/10 bg-surface p-8 shadow-sm dark:border-white/10 "
              delayMs={90}
            >
              <h2 className="text-lg font-semibold tracking-tight">Quick links</h2>
              <p className="mt-2 text-sm leading-6 text-zinc-800 dark:text-zinc-200">
                Prefer email? Reach us at{' '}
                <a
                  href="mailto:hello@dhelangan.studio"
                  className="font-medium text-foreground underline underline-offset-4"
                >
                  hello@dhelangan.studio
                </a>
                .
              </p>

              <div className="mt-6 grid gap-3 text-sm">
                <div className="rounded-2xl border border-black/10 bg-background p-4 dark:border-white/10">
                  Typical response time: 1–2 business days
                </div>
                <div className="rounded-2xl border border-black/10 bg-background p-4 dark:border-white/10">
                  Available: prototypes, co-dev, consulting
                </div>
                <div className="rounded-2xl border border-black/10 bg-background p-4 dark:border-white/10">
                  Location: Indonesia (remote-friendly)
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </div>
  );
}

