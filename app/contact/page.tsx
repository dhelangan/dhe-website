import PageHeader from "../_components/PageHeader";

export const metadata = {
  title: "Contact",
};

export default function ContactPage() {
  return (
    <div className="bg-zinc-50 dark:bg-black">
      <div className="mx-auto w-full max-w-6xl px-5 py-12 sm:py-16">
        <div className="grid gap-10">
          <PageHeader
            title="Contact"
            description="Tell us about your project. We’ll reply with next steps and a quick timeline."
          />

          <div className="grid gap-6 lg:grid-cols-2">
            <section className="rounded-3xl border border-black/10 bg-white p-8 shadow-sm dark:border-white/10 dark:bg-zinc-950">
              <h2 className="text-lg font-semibold tracking-tight">Send a message</h2>
              <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
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
                  className="inline-flex h-11 items-center justify-center rounded-full bg-foreground px-6 text-sm font-medium text-background transition-colors hover:bg-zinc-800 dark:hover:bg-zinc-200 dark:hover:text-black"
                >
                  Send (placeholder)
                </button>
              </form>
            </section>

            <section className="rounded-3xl border border-black/10 bg-white p-8 shadow-sm dark:border-white/10 dark:bg-zinc-950">
              <h2 className="text-lg font-semibold tracking-tight">Quick links</h2>
              <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
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
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
