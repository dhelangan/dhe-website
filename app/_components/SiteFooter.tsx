import Link from "next/link";

const establishedYear = 2026;

export default function SiteFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-black/10 bg-background dark:border-white/10">
      <div className="mx-auto w-full max-w-6xl px-5 py-10">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="inline-flex size-10 items-center justify-center rounded-xl bg-foreground text-sm font-semibold text-background">
              DS
            </div>
            <div className="leading-tight">
              <div className="font-semibold tracking-tight">Dhelangan Studio</div>
              <div className="text-sm text-zinc-600 dark:text-zinc-400">
                Est. {establishedYear}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
            <Link
              href="/privacy-policy"
              className="text-zinc-700 transition-colors hover:text-foreground dark:text-zinc-300"
            >
              Privacy Policy
            </Link>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="text-zinc-700 transition-colors hover:text-foreground dark:text-zinc-300"
            >
              Instagram
            </a>
            <a
              href="https://x.com"
              target="_blank"
              rel="noreferrer"
              className="text-zinc-700 transition-colors hover:text-foreground dark:text-zinc-300"
            >
              X
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noreferrer"
              className="text-zinc-700 transition-colors hover:text-foreground dark:text-zinc-300"
            >
              YouTube
            </a>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-2 border-t border-black/10 pt-6 text-sm text-zinc-600 dark:border-white/10 dark:text-zinc-400 sm:flex-row sm:items-center sm:justify-between">
          <span>© {currentYear} Dhelangan Studio. All rights reserved.</span>
          <span>Crafted for tabletop and digital play.</span>
        </div>
      </div>
    </footer>
  );
}
