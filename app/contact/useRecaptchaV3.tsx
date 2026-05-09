"use client";

import { useCallback, useEffect, useState } from "react";

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

function getGrecaptcha() {
  if (typeof window === "undefined") return undefined;
  return window.grecaptcha ?? window.grecaptcha?.enterprise;
}

function loadRecaptchaV3(siteKey: string) {
  return new Promise<void>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>('script[data-recaptcha-v3="true"]');
    if (existing) {
      const g = getGrecaptcha();
      if (existing.dataset.loaded === "true" || typeof g?.execute === "function") {
        resolve();
        return;
      }
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener("error", () => reject(new Error("Failed to load reCAPTCHA")), { once: true });
      return;
    }
    const script = document.createElement("script");
    script.src = `https://www.google.com/recaptcha/api.js?render=${encodeURIComponent(siteKey)}`;
    script.async = true;
    script.defer = true;
    script.dataset.recaptchaV3 = "true";
    script.addEventListener(
      "load",
      () => {
        script.dataset.loaded = "true";
        resolve();
      },
      { once: true },
    );
    script.addEventListener("error", () => reject(new Error("Failed to load reCAPTCHA")), { once: true });
    document.head.appendChild(script);
  });
}

export function useRecaptchaV3(action: string) {
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(() =>
    SITE_KEY ? null : "reCAPTCHA site key is missing",
  );

  useEffect(() => {
    let canceled = false;
    if (!SITE_KEY) return;

    (async () => {
      try {
        await loadRecaptchaV3(SITE_KEY);
        if (canceled) return;
        const g = getGrecaptcha();
        const readyFn = g?.ready;
        if (typeof readyFn !== "function") {
          throw new Error("reCAPTCHA failed to initialize");
        }

        await new Promise<void>((resolve) => readyFn(resolve));
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
    if (!ready) throw new Error("reCAPTCHA not ready");

    const g = getGrecaptcha();
    const readyFn = g?.ready;
    const executeFn = g?.execute;
    if (typeof readyFn !== "function" || typeof executeFn !== "function") {
      throw new Error("reCAPTCHA not ready");
    }

    return await new Promise<string>((resolve, reject) => {
      readyFn(() => {
        executeFn(SITE_KEY, { action }).then(resolve).catch(reject);
      });
    });
  }, [action, ready]);

  return { ready, error, getToken, siteKeyConfigured: Boolean(SITE_KEY) };
}
