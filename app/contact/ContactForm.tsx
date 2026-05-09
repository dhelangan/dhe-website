"use client";

import { useMemo, useState } from "react";
import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor";
import { useRecaptchaV3 } from "./useRecaptchaV3";

type Status = "idle" | "sending" | "sent" | "error";

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [messageHtml, setMessageHtml] = useState("");
  const [messageText, setMessageText] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  const recaptcha = useRecaptchaV3("contact");

  const canSubmit = useMemo(() => {
    if (!name.trim()) return false;
    if (!email.trim() || !isValidEmail(email)) return false;
    if (!messageText.trim()) return false;
    if (!recaptcha.siteKeyConfigured) return false;
    return true;
  }, [name, email, messageText, recaptcha.siteKeyConfigured]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit || status === "sending") return;

    setStatus("sending");
    setError(null);

    try {
      const captchaToken = await recaptcha.getToken();
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          messageHtml,
          action: "contact",
          captchaToken: captchaToken.trim(),
        }),
      });

      const data = (await res.json().catch(() => null)) as { ok?: boolean; error?: string } | null;
      if (!res.ok || !data?.ok) {
        setStatus("error");
        setError(data?.error ?? "Something went wrong. Please try again.");
        return;
      }

      setStatus("sent");
      setName("");
      setEmail("");
      setMessageHtml("");
      setMessageText("");
    } catch (e) {
      setStatus("error");
      const msg = e instanceof Error ? e.message : "";
      setError(recaptcha.error ?? (msg || "Network error. Please try again."));
    }
  }

  return (
    <form onSubmit={onSubmit} className="mt-6 grid gap-4">
      <label className="grid gap-2 text-sm font-medium">
        Name
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="h-11 rounded-2xl border border-black/10 bg-background px-4 text-sm outline-none ring-0 focus:border-black/20 dark:border-white/10 dark:focus:border-white/20"
          placeholder="Your name"
          autoComplete="name"
          required
        />
      </label>
      <label className="grid gap-2 text-sm font-medium">
        Email
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          className="h-11 rounded-2xl border border-black/10 bg-background px-4 text-sm outline-none ring-0 focus:border-black/20 dark:border-white/10 dark:focus:border-white/20"
          placeholder="you@example.com"
          autoComplete="email"
          required
        />
      </label>
      <label className="grid gap-2 text-sm font-medium">
        Message
        <div className="w-full max-w-full overflow-hidden rounded-2xl border border-black/10 bg-background px-0 outline-none ring-0 focus:border-black/20 dark:border-white/10 dark:focus:border-white/20"
        >
          <SimpleEditor
            content=""
            onChange={({ html, text }) => {
              setMessageHtml(html);
              setMessageText(text);
            }}
          />
        </div>
      </label>
        
      <div className="text-xs text-zinc-600 dark:text-zinc-300">
        Protected by reCAPTCHA {recaptcha.ready ? "" : "(Loading)"}
      </div>

      {status === "sent" && (
        <div className="rounded-2xl border border-black/10 bg-background p-4 text-sm text-zinc-800 dark:border-white/10 dark:text-zinc-200">
          Message sent. We’ll reply soon.
        </div>
      )}
      {status === "error" && error && (
        <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-700 dark:text-red-200">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={!canSubmit || status === "sending"}
        className="inline-flex h-11 items-center justify-center rounded-full bg-accent-orange px-6 text-sm font-semibold text-black transition-colors hover:bg-[#ff6f10] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === "sending" ? "Sending..." : "Send message"}
      </button>
    </form>
  );
}
