"use client";

import Link from "next/link";
import Image from "next/image";

import { useEffect, useId, useState } from "react";

const navItems = [
  { href: "/about-us", label: "About Us" },
  { href: "/services", label: "Services" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/news", label: "News" },
] as const;

export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  const menuId = useId();

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <header className="fixed w-full top-0 z-50 border-b border-black/10 bg-surface/80 backdrop-blur dark:border-white/10 drop-shadow-lg">
      <div className="mx-auto flex w-full max-w-6xl min-w-0 items-center justify-between gap-2 px-3 py-3 sm:gap-3 sm:px-5 sm:py-4">
        <Link
          href="/"
          className="group inline-flex items-center gap-2 font-semibold tracking-tight"
          onClick={() => setOpen(false)}
        >
          <Image src="/logo.png" alt="Dhelangan Studio Logo" width={48} height={48} />
          <Image src="/logo/dhelangan.png" alt="Dhelangan Studio Logo" width={125} height={48}  loading="lazy" className=" hidden sm:inline mix-blend-difference"/>
        </Link>

        <nav className="hidden items-center gap-5 text-md font-bold uppercase text-zinc-700 dark:text-zinc-300 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="transition-colors hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/shop"
            className="inline-flex h-9 items-center justify-center gap-2 rounded-full border border-black/10 bg-surface px-3 text-sm sm:px-4 font-medium text-foreground transition-colors hover:bg-black/[.04] dark:border-white/10 dark:bg-zinc-950 dark:hover:bg-white/[.06]"
            aria-label="Shop"
          >
            <ShopIcon className="size-4" />
            <span className="hidden sm:inline">Shop</span>
          </Link>

          <Link
            href="/contact"
            className="inline-flex h-9 items-center justify-center gap-2 rounded-full bg-accent-orange px-3 text-sm sm:px-4 font-semibold text-black transition-colors hover:bg-[#ff6f10]"
            aria-label="Contact"
          >
            <MailIcon className="size-4" />
            <span className="hidden sm:inline">Contact</span>
          </Link>

          <button
            type="button"
            className="inline-flex h-9 items-center justify-center rounded-full border border-black/10 bg-surface px-3 text-sm font-medium transition-colors hover:bg-black/[.04] dark:border-white/10 dark:bg-zinc-950 dark:hover:bg-white/[.06] md:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-controls={menuId}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <HamburgerIcon className="size-5" />
          </button>
        </div>
      </div>

      <div
        id={menuId}
        className={[
          "border-t border-black/10 dark:border-white/10 md:hidden",
          open ? "block" : "hidden",
        ].join(" ")}
      >
        <div className="mx-auto w-full max-w-6xl px-4 py-4 sm:px-5">
          <div className="grid gap-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-2xl border border-black/10 bg-surface px-4 py-3 text-sm font-medium transition-colors hover:bg-black/[.04] dark:border-white/10 dark:bg-zinc-950 dark:hover:bg-white/[.06]"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}

type IconProps = {
  className?: string;
};

function HamburgerIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M4 6h16" />
      <path d="M4 12h16" />
      <path d="M4 18h16" />
    </svg>
  );
}

function ShopIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M6 7l1-3h10l1 3" />
      <path d="M4 7h16l-1 14H5L4 7z" />
      <path d="M9 11v2a3 3 0 006 0v-2" />
    </svg>
  );
}

function MailIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M4 6h16v12H4z" />
      <path d="M4 7l8 6 8-6" />
    </svg>
  );
}

