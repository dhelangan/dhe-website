"use client";

import React from "react";
import { useEffect, useMemo, useRef, useState } from "react";

type RevealProps<TTag extends keyof React.JSX.IntrinsicElements = "div"> = {
  as?: TTag;
  className?: string;
  children: React.ReactNode;
  delayMs?: number;
};

export default function Reveal<TTag extends keyof React.JSX.IntrinsicElements = "div">({
  as,
  className,
  children,
  delayMs,
}: RevealProps<TTag>) {
  const tag = (as ?? "div") as keyof React.JSX.IntrinsicElements;
  const ref = useRef<HTMLElement | null>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (shown) return;

    const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
    if (reduceMotion) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) setShown(true);
      },
      { threshold: 0.15, rootMargin: "0px 0px -10% 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [shown]);

  const style = useMemo(() => {
    if (!delayMs) return undefined;
    return { transitionDelay: `${delayMs}ms` } as const;
  }, [delayMs]);

  return React.createElement(
    tag,
    {
      ref,
      className: [
        className ?? "",
        "transition-all duration-700 ease-out will-change-transform motion-reduce:transition-none motion-reduce:translate-y-0 motion-reduce:opacity-100",
        shown ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0",
      ].join(" "),
      style,
    },
    children,
  );
}
