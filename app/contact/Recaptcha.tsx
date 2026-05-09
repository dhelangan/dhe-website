"use client";

import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    grecaptcha?: {
      render: (container: HTMLElement, params: Record<string, unknown>) => number;
      reset: (widgetId: number) => void;
    };
  }
}

const SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

function loadScript() {
  return new Promise<void>((resolve, reject) => {
    if (typeof document === "undefined") return resolve();
    const existing = document.querySelector<HTMLScriptElement>('script[data-recaptcha="true"]');
    if (existing) {
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener("error", () => reject(new Error("Failed to load reCAPTCHA script")), { once: true });
      // If it already loaded, resolve immediately.
      if ((existing as unknown as { readyState?: string }).readyState === "complete") resolve();
      return;
    }

    const script = document.createElement("script");
    script.src = "https://www.google.com/recaptcha/api.js?render=explicit";
    script.async = true;
    script.defer = true;
    script.dataset.recaptcha = "true";
    script.addEventListener("load", () => resolve(), { once: true });
    script.addEventListener("error", () => reject(new Error("Failed to load reCAPTCHA script")), { once: true });
    document.head.appendChild(script);
  });
}

export default function Recaptcha({
  onToken,
  onExpired,
}: {
  onToken: (token: string) => void;
  onExpired: () => void;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const widgetIdRef = useRef<number | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let canceled = false;
    if (!SITE_KEY) return;

    (async () => {
      try {
        await loadScript();
        if (canceled) return;
        setReady(true);
      } catch {
        // Ignore; parent can treat as disabled.
      }
    })();

    return () => {
      canceled = true;
    };
  }, []);

  useEffect(() => {
    if (!SITE_KEY) return;
    const el = containerRef.current;
    if (!el) return;
    if (!ready) return;
    if (!window.grecaptcha) return;
    if (widgetIdRef.current != null) return;

    widgetIdRef.current = window.grecaptcha.render(el, {
      sitekey: SITE_KEY,
      callback: (token: unknown) => {
        if (typeof token === "string") onToken(token);
      },
      "expired-callback": () => onExpired(),
      "error-callback": () => onExpired(),
    });
  }, [ready, onToken, onExpired]);

  if (!SITE_KEY) {
    return (
      <div className="rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4 text-sm text-amber-800 dark:text-amber-200">
        reCAPTCHA not configured. Set <code className="font-mono">NEXT_PUBLIC_RECAPTCHA_SITE_KEY</code>.
      </div>
    );
  }

  return <div ref={containerRef} />;
}

