"use client";

import { useMemo, useState } from "react";
import Recaptcha from "./Recaptcha";

type Status = "idle" | "sending" | "sent" | "error";

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [messageHtml, setMessageHtml] = useState("");
  const [captchaToken, setCaptchaToken] = useState<string>("");
  const [captchaReset, setCaptchaReset] = useState(0);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  const canSubmit = useMemo(() => {
    if (!name.trim()) return false;
    if (!email.trim() || !isValidEmail(email)) return false;
    if (!messageHtml.replace(/<[^>]+>/g, "").trim()) return false;
    if (!captchaToken.trim()) return false;
    return true;
  }, [name, email, messageHtml, captchaToken]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit || status === "sending") return;

    setStatus("sending");
    setError(null);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          messageHtml,
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
      setCaptchaToken("");
      setCaptchaReset((v) => v + 1);
    } catch {
      setStatus("error");
      setError("Network error. Please try again.");
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
        <textarea
          value={messageHtml}
          onChange={(e) => setMessageHtml(e.target.value)}
          className="min-h-32 rounded-2xl border border-black/10 bg-background px-4 py-3 text-sm outline-none ring-0 focus:border-black/20 dark:border-white/10 dark:focus:border-white/20"
          placeholder="What are you building? What help do you need?"
          required
        />
      </label>

      <Recaptcha
        onToken={setCaptchaToken}
        onExpired={() => setCaptchaToken("")}
        resetSignal={captchaReset}
      />

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
