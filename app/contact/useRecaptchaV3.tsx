"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

declare global {
  interface Window {
    grecaptcha?: {
      ready?: (cb: () => void) => void;
      execute?: (siteKey: string, options: { action: string }) => Promise<string>;
      enterprise?: {
        ready?: (cb: () => void) => void;
        execute?: (siteKey: string, options: { action: string }) => Promise<string>;
      };
    };
  }
}

const SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

function loadRecaptchaV3(siteKey: string) {
  return new Promise<void>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>('script[data-recaptcha-v3="true"]');
    if (existing) {
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener("error", () => reject(new Error("Failed to load reCAPTCHA")), { once: true });
      return;
    }
    const script = document.createElement("script");
    script.src = `https://www.google.com/recaptcha/api.js?render=${encodeURIComponent(siteKey)}`;
    script.async = true;
    script.defer = true;
    script.dataset.recaptchaV3 = "true";
    script.addEventListener("load", () => resolve(), { once: true });
    script.addEventListener("error", () => reject(new Error("Failed to load reCAPTCHA")), { once: true });
    document.head.appendChild(script);
  });
}

export function useRecaptchaV3(action: string) {
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const api = useMemo(() => {
    const g = typeof window !== "undefined" ? window.grecaptcha : undefined;
    const readyFn = g?.ready ?? g?.enterprise?.ready;
    const executeFn = g?.execute ?? g?.enterprise?.execute;
    return {
      readyFn: typeof readyFn === "function" ? readyFn : undefined,
      executeFn: typeof executeFn === "function" ? executeFn : undefined,
    };
  }, [ready]);

  useEffect(() => {
    let canceled = false;
    if (!SITE_KEY) {
      setError("reCAPTCHA site key is missing");
      return;
    }

    (async () => {
      try {
        await loadRecaptchaV3(SITE_KEY);
        if (canceled) return;
        setReady(true);
      } catch (e) {
        if (canceled) return;
        setError(e instanceof Error ? e.message : "Failed to load reCAPTCHA");
      }
    })();

    return () => {
      canceled = true;
    };
  }, []);

  const getToken = useCallback(async () => {
    if (!SITE_KEY) throw new Error("reCAPTCHA not configured");
    const readyFn = api.readyFn;
    const executeFn = api.executeFn;
    if (!ready || !readyFn || !executeFn) throw new Error("reCAPTCHA not ready");

    return await new Promise<string>((resolve, reject) => {
      readyFn(() => {
        executeFn(SITE_KEY, { action }).then(resolve).catch(reject);
      });
    });
  }, [action, api.executeFn, api.readyFn, ready]);

  return { ready, error, getToken, siteKeyConfigured: Boolean(SITE_KEY) };
}

