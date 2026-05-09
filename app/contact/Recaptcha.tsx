"use client";

import { useEffect, useMemo, useRef, useState } from "react";

declare global {
  interface Window {
    grecaptcha?: {
      render?: (container: HTMLElement, params: Record<string, unknown>) => number;
      reset?: (widgetId: number) => void;
      ready?: (cb: () => void) => void;
      execute?: (siteKey: string, params?: Record<string, unknown>) => Promise<string>;
      enterprise?: {
        render?: (container: HTMLElement, params: Record<string, unknown>) => number;
        reset?: (widgetId: number) => void;
        ready?: (cb: () => void) => void;
        execute?: (siteKey: string, params?: Record<string, unknown>) => Promise<string>;
      };
    };
    codexRecaptchaOnload?: () => void;
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
    // v2 checkbox uses explicit rendering. Some setups load reCAPTCHA already (v3/enterprise),
    // so we also support `grecaptcha.enterprise.render`.
    script.src = "https://www.google.com/recaptcha/api.js?onload=codexRecaptchaOnload&render=explicit";
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
  resetSignal = 0,
}: {
  onToken: (token: string) => void;
  onExpired: () => void;
  resetSignal?: number;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const widgetIdRef = useRef<number | null>(null);
  const [ready, setReady] = useState(false);

  const api = useMemo(() => {
    const g = typeof window !== "undefined" ? window.grecaptcha : undefined;
    const renderCandidate = g?.render ?? g?.enterprise?.render;
    const resetCandidate = g?.reset ?? g?.enterprise?.reset;
    const readyCandidate = g?.ready ?? g?.enterprise?.ready;
    const executeCandidate = g?.execute ?? g?.enterprise?.execute;
    return {
      render: typeof renderCandidate === "function" ? renderCandidate : undefined,
      reset: typeof resetCandidate === "function" ? resetCandidate : undefined,
      readyFn: typeof readyCandidate === "function" ? readyCandidate : undefined,
      executeFn: typeof executeCandidate === "function" ? executeCandidate : undefined,
    };
  }, [ready]);

  useEffect(() => {
    let canceled = false;
    if (!SITE_KEY) return;

    (async () => {
      try {
        window.codexRecaptchaOnload = () => setReady(true);
        await loadScript();
        if (canceled) return;
        // If onload didn't fire (script cached), still mark ready.
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
    if (widgetIdRef.current != null) return;
    if (!api.render) return;

    widgetIdRef.current = api.render(el, {
      sitekey: SITE_KEY,
      callback: (token: unknown) => {
        if (typeof token === "string") onToken(token);
      },
      "expired-callback": () => onExpired(),
      "error-callback": () => onExpired(),
    });
  }, [ready, api.render, onToken, onExpired]);

  // Fallback for setups where `grecaptcha.render` is unavailable (e.g. reCAPTCHA v3 already loaded).
  useEffect(() => {
    if (!SITE_KEY) return;
    if (!ready) return;
    if (widgetIdRef.current != null) return;
    if (api.render) return;
    const readyFn = api.readyFn;
    const executeFn = api.executeFn;
    if (!readyFn || !executeFn) return;

    let canceled = false;
    readyFn(() => {
      if (canceled) return;
      executeFn(SITE_KEY, { action: "contact" })
        .then((token) => {
          if (canceled) return;
          if (typeof token === "string" && token) onToken(token);
        })
        .catch(() => onExpired());
    });

    return () => {
      canceled = true;
    };
  }, [ready, api.render, api.readyFn, api.executeFn, onToken, onExpired]);

  useEffect(() => {
    const id = widgetIdRef.current;
    if (!id) return;
    if (!api.reset) return;
    api.reset(id);
    onExpired();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetSignal, api.reset]);

  if (!SITE_KEY) {
    return (
      <div className="rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4 text-sm text-amber-800 dark:text-amber-200">
        reCAPTCHA not configured. Set <code className="font-mono">NEXT_PUBLIC_RECAPTCHA_SITE_KEY</code>.
      </div>
    );
  }

  return <div ref={containerRef} />;
}
