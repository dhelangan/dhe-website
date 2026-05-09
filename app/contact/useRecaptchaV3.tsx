"use client";

import { useCallback, useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    grecaptcha?: RecaptchaClient;
  }
}

type RecaptchaClient = {
  ready?: (cb: () => void) => void;
  execute?: (siteKey: string, options: { action: string }) => Promise<string>;
  render?: (container: string | HTMLElement, params: RecaptchaRenderParameters) => number;
  reset?: (widgetId?: number) => void;
  getResponse?: (widgetId?: number) => string;
  enterprise?: RecaptchaClient;
};

type RecaptchaRenderParameters = {
  sitekey: string;
  callback: (token: string) => void;
  "expired-callback"?: () => void;
  theme?: "light" | "dark";
  size?: "compact" | "normal" | "invisible";
  badge?: "bottomright" | "bottomleft" | "inline";
};

const SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

function getGrecaptcha() {
  if (typeof window === "undefined") return undefined;
  return window.grecaptcha?.enterprise ?? window.grecaptcha;
}

function loadRecaptchaV2() {
  return new Promise<void>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>('script[data-recaptcha-v2="true"]');
    if (existing) {
      const g = getGrecaptcha();
      if (existing.dataset.loaded === "true" || typeof g?.render === "function") {
        resolve();
        return;
      }
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener("error", () => reject(new Error("Failed to load reCAPTCHA")), { once: true });
      return;
    }

    const script = document.createElement("script");
    script.src = "https://www.google.com/recaptcha/api.js?render=explicit";
    script.async = true;
    script.defer = true;
    script.dataset.recaptchaV2 = "true";
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

export function useRecaptchaV2() {
  const widgetIdRef = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [ready, setReady] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(() =>
    SITE_KEY ? null : "reCAPTCHA site key is missing",
  );

  useEffect(() => {
    let canceled = false;

    const siteKey = SITE_KEY;
    if (!siteKey) return;
    const renderKey = siteKey as string;

    async function initialize() {
      try {
        await loadRecaptchaV2();
        if (canceled) return;

        const grecaptcha = getGrecaptcha();
        if (!grecaptcha || typeof grecaptcha.render !== "function") {
          throw new Error("reCAPTCHA failed to initialize");
        }

        const renderFn = grecaptcha.render.bind(grecaptcha);
        const resetFn = typeof grecaptcha.reset === "function" ? grecaptcha.reset.bind(grecaptcha) : undefined;

        const renderWidget = () => {
          if (canceled || widgetIdRef.current !== null || !containerRef.current) return;

          widgetIdRef.current = renderFn(containerRef.current, {
            sitekey: renderKey,
            callback: (value: string) => {
              if (canceled) return;
              setToken(value);
              setError(null);
            },
            "expired-callback": () => {
              if (canceled) return;
              setToken(null);
              if (typeof resetFn === "function" && widgetIdRef.current !== null) {
                resetFn(widgetIdRef.current);
              }
            },
            theme: "light",
          });

          setReady(true);
        };

        if (typeof grecaptcha.ready === "function") {
          grecaptcha.ready(renderWidget);
        } else {
          renderWidget();
        }
      } catch (e) {
        if (canceled) return;
        setError(e instanceof Error ? e.message : "Failed to load reCAPTCHA");
      }
    }

    initialize();

    return () => {
      canceled = true;
    };
  }, []);

  const getToken = useCallback(() => {
    if (!SITE_KEY) throw new Error("reCAPTCHA not configured");
    if (!ready) throw new Error("reCAPTCHA not ready");
    if (!token) throw new Error("Please complete the captcha.");

    return token;
  }, [ready, token]);

  const reset = useCallback(() => {
    const grecaptcha = getGrecaptcha();
    if (typeof grecaptcha?.reset === "function") {
      grecaptcha.reset(widgetIdRef.current ?? undefined);
    }
    setToken(null);
  }, []);

  return {
    ready,
    error,
    token,
    getToken,
    reset,
    siteKeyConfigured: Boolean(SITE_KEY),
    containerRef,
  };
}
