"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { formatPortfolioStatus, type PortfolioStatus } from "@/lib/portfolio";

type Props = {
  currentStatus?: PortfolioStatus;
};

const tabs: Array<{ key: "" | PortfolioStatus; label: string }> = [
  { key: "", label: "All" },
  { key: "in-development", label: formatPortfolioStatus("in-development") },
  { key: "released", label: formatPortfolioStatus("released") },
];

export default function PortfolioStatusTabs({ currentStatus }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function selectStatus(status: "" | PortfolioStatus) {
    const params = new URLSearchParams(searchParams?.toString() ?? "");

    if (status) {
      params.set("status", status);
    } else {
      params.delete("status");
    }

    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname);
  }

  return (
    <div className="rounded-3xl border border-black/10 bg-surface px-3 py-3 shadow-sm dark:border-white/10">
      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => {
          const active = (tab.key === "" && !currentStatus) || tab.key === currentStatus;
          return (
            <button
              key={tab.key || "all"}
              type="button"
              onClick={() => selectStatus(tab.key)}
              className={[
                "inline-flex h-10 items-center justify-center rounded-full px-4 text-sm font-semibold transition-colors",
                active
                  ? "border border-black/20 bg-accent-orange text-black dark:border-white/10"
                  : "border border-black/10 bg-background text-zinc-700 hover:bg-black/4 dark:border-white/10 dark:bg-zinc-950 dark:text-zinc-300 dark:hover:bg-white/6",
              ].join(" ")}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
