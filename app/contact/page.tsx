import PageHeader from "../_components/PageHeader";
import Reveal from "../_components/Reveal";
import ContactForm from "./ContactForm";
import Script from "next/script";

export const metadata = {
  title: "Contact",
};

export default function ContactPage() {
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

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

          <div className="grid gap-6 lg:grid-cols-10">
            <Reveal
              as="section"
              className="col-span-5 sm:col-span-6 rounded-3xl border border-black/10 bg-surface p-8 shadow-sm dark:border-white/10 "
              delayMs={60}
            >
              <h2 className="text-lg font-semibold tracking-tight">Send a message</h2>
              <p className="mt-2 text-sm leading-6 text-zinc-800 dark:text-zinc-200">
                Send a message and we will get back to you.
              </p>

              <ContactForm />
            </Reveal>

            <Reveal
              as="section"
              className="col-span-5 sm:col-span-4 rounded-3xl border border-black/10 bg-surface p-8 shadow-sm dark:border-white/10 "
              delayMs={90}
            >
              <h2 className="text-lg font-semibold tracking-tight">Quick links</h2>
              <p className="mt-2 text-sm leading-6 text-zinc-800 dark:text-zinc-200">
                Prefer email? Reach us at{' '}
                <a
                  href="mailto:dhelangan@gmail.com"
                  className="font-medium text-foreground underline underline-offset-4"
                >
                  dhelangan@gmail.com
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

              <div className="mt-6 overflow-hidden rounded-2xl border border-black/10 bg-background dark:border-white/10">
                <iframe
                  title="Google Maps location"
                  src="https://www.google.com/maps?q=Indonesia&output=embed"
                  className="h-64 w-full"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </Reveal>
          </div>
        </div>
      </div>
      {siteKey ? (
        <Script
          src={`https://www.google.com/recaptcha/api.js?render=${encodeURIComponent(siteKey)}`}
          strategy="beforeInteractive"
          data-recaptcha-v3="true"
        />
      ) : null}
    </div>
  );
}

