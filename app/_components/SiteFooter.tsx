import Link from "next/link";
import Image from "next/image";

import ThemeToggle from "./ThemeToggle";

const establishedYear = 2021;

export default function SiteFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-black/10 bg-surface dark:border-white/10">
      <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-5">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="inline-flex size-12 p-1 items-center justify-center rounded-xl bg-background text-sm font-semibold text-black">
              <Image src="/logo.png" alt="Dhelangan Studio Logo" width={48} height={48}  loading="lazy"/>
            </div>
            <div className="leading-tight">
              <div className="font-semibold tracking-tight">Dhelangan Studio</div>
              <div className="text-sm text-zinc-700 dark:text-zinc-300">Est. {establishedYear}</div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm">
            <Link
              href="/privacy-policy"
              className="text-zinc-800 transition-colors hover:text-accent-red dark:text-zinc-200"
            >
              Privacy Policy
            </Link>
            <a
              href="https://www.instagram.com/dhelangan"
              target="_blank"
              rel="noreferrer"
              className="text-zinc-800 transition-colors hover:text-accent-red dark:text-zinc-200"
            >
              Instagram
            </a>
            <a
              href="https://www.tiktok.com/@dhelangan"
              target="_blank"
              rel="noreferrer"
              className="text-zinc-800 transition-colors hover:text-accent-red dark:text-zinc-200"
            >
              Tiktok
            </a>
            <a
              href="https://x.com/dhelanganstudio"
              target="_blank"
              rel="noreferrer"
              className="text-zinc-800 transition-colors hover:text-accent-red dark:text-zinc-200"
            >
              X
            </a>
            <a
              href="https://www.youtube.com/channel/UCzS5Fvmio5yooTL9cjassFQ"
              target="_blank"
              rel="noreferrer"
              className="text-zinc-800 transition-colors hover:text-accent-red dark:text-zinc-200"
            >
              YouTube
            </a>
            <ThemeToggle />
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-2 border-t border-black/10 pt-6 text-sm text-zinc-700 dark:border-white/10 dark:text-zinc-300 sm:flex-row sm:items-center sm:justify-between">
          <span>© {currentYear} Dhelangan Studio. All rights reserved.</span>
          <span>Created By Cleosetric – Crafted for tabletop and digital play.</span>
        </div>
      </div>
    </footer>
  );
}

