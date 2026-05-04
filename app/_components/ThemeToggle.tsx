"use client";

import { useEffect, useMemo, useState } from "react";

type Theme = "light" | "dark";

function getSystemTheme(): Theme {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === "undefined") return "light";
    const stored = window.localStorage.getItem("theme");
    if (stored === "light" || stored === "dark") return stored;
    return getSystemTheme();
  });

  // Apply class
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  // Listen system changes (only if no manual override)
  useEffect(() => {
    const stored = window.localStorage.getItem("theme");
    if (stored === "light" || stored === "dark") return;

    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => setTheme(mql.matches ? "dark" : "light");

    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  const label = useMemo(
    () => (theme === "dark" ? "Switch to light mode" : "Switch to dark mode"),
    [theme]
  );

  return (
    <button
      type="button"
      onClick={() => {
        const next: Theme = theme === "dark" ? "light" : "dark";
        setTheme(next);
        window.localStorage.setItem("theme", next);
      }}
      className="inline-flex h-9 items-center justify-center gap-2 rounded-full border border-black/10 bg-background px-3 text-sm font-semibold text-zinc-800 transition-colors hover:bg-black/[.04] dark:border-white/10 dark:bg-zinc-950 dark:text-zinc-200 dark:hover:bg-white/[.06]"
      aria-label={label}
      title={label}
    >
      {theme === "dark" ? <SunIcon className="size-4" /> : <MoonIcon className="size-4" />}
      <span className="hidden sm:inline">
        {theme === "dark" ? "Light" : "Dark"}
      </span>
    </button>
  );
}

function SunIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2" />
      <path d="M12 20v2" />
      <path d="M4.93 4.93l1.41 1.41" />
      <path d="M17.66 17.66l1.41 1.41" />
      <path d="M2 12h2" />
      <path d="M20 12h2" />
      <path d="M4.93 19.07l1.41-1.41" />
      <path d="M17.66 6.34l1.41-1.41" />
    </svg>
  );
}

function MoonIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
    </svg>
  );
}
