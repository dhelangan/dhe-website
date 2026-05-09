import nodemailer from "nodemailer";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type ContactPayload = {
  name: string;
  email: string;
  messageText: string;
  messageHtml: string;
  captchaToken: string;
};

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function safeText(value: string, maxLen: number) {
  return value.trim().slice(0, maxLen);
}

function stripHtmlToText(html: string) {
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<\/(p|div|li|br|h[1-6])>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function sanitizeHtml(input: string) {
  let html = input;
  html = html.replace(/<script[\s\S]*?<\/script>/gi, "");
  html = html.replace(/<style[\s\S]*?<\/style>/gi, "");
  // Remove event handler attributes (onload, onclick, etc.)
  html = html.replace(/\son[a-z]+\s*=\s*(".*?"|'.*?'|[^\s>]+)/gi, "");
  // Drop iframes and other risky tags
  html = html.replace(/<\/?(iframe|object|embed|form|input|button|textarea|select|option)[^>]*>/gi, "");
  // Keep only a small set of tags; strip the rest.
  html = html.replace(/<(\/?)([a-z0-9-]+)([^>]*)>/gi, (m, slash: string, tag: string, attrs: string) => {
    const t = String(tag).toLowerCase();
    const allowed = new Set(["b", "strong", "i", "em", "u", "p", "br", "ul", "ol", "li", "a"]);
    if (!allowed.has(t)) return "";
    if (t !== "a") return `<${slash}${t}>`;
    // For <a>, preserve safe href only.
    const hrefMatch = attrs.match(/\shref\s*=\s*("([^"]*)"|'([^']*)'|([^\s>]+))/i);
    const hrefRaw = hrefMatch?.[2] ?? hrefMatch?.[3] ?? hrefMatch?.[4] ?? "";
    const href = typeof hrefRaw === "string" ? hrefRaw.trim() : "";
    const safeHref = /^https?:\/\//i.test(href) ? href : "";
    return safeHref ? `<${slash}${t} href="${safeHref}">` : `<${slash}${t}>`;
  });
  return html.trim();
}

function getEnv(name: string) {
  const v = process.env[name];
  return typeof v === "string" && v.trim() ? v.trim() : null;
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = (await request.json()) as unknown;
  } catch {
    return Response.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  if (!body || typeof body !== "object") {
    return Response.json({ ok: false, error: "Invalid payload" }, { status: 400 });
  }

  const v = body as Record<string, unknown>;
  const name = isNonEmptyString(v.name) ? safeText(v.name, 120) : "";
  const email = isNonEmptyString(v.email) ? safeText(v.email, 200) : "";
  const messageHtmlRaw = isNonEmptyString(v.messageHtml) ? safeText(v.messageHtml, 20_000) : "";
  const messageHtml = sanitizeHtml(messageHtmlRaw);
  const messageText = safeText(stripHtmlToText(messageHtml), 5000);
  const captchaToken = isNonEmptyString(v.captchaToken) ? safeText(v.captchaToken, 5000) : "";

  if (!name || !email || !messageText) {
    return Response.json({ ok: false, error: "Name, email, and message are required." }, { status: 400 });
  }
  if (!isValidEmail(email)) {
    return Response.json({ ok: false, error: "Please enter a valid email address." }, { status: 400 });
  }
  if (!captchaToken) {
    return Response.json({ ok: false, error: "Please complete the captcha." }, { status: 400 });
  }

  const recaptchaSecret = getEnv("RECAPTCHA_SECRET_KEY");
  if (!recaptchaSecret) {
    return Response.json(
      { ok: false, error: "Captcha is not configured on the server. Set RECAPTCHA_SECRET_KEY." },
      { status: 500 }
    );
  }

  try {
    const verify = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        secret: recaptchaSecret,
        response: captchaToken,
      }).toString(),
      cache: "no-store",
    });

    const verifyJson = (await verify.json().catch(() => null)) as { success?: boolean } | null;
    if (!verify.ok || !verifyJson?.success) {
      return Response.json({ ok: false, error: "Captcha verification failed. Please try again." }, { status: 400 });
    }
  } catch {
    return Response.json({ ok: false, error: "Captcha verification failed. Please try again." }, { status: 400 });
  }

  const smtpHost = getEnv("SMTP_HOST");
  const smtpPortRaw = getEnv("SMTP_PORT");
  const smtpUser = getEnv("SMTP_USER");
  const smtpPass = getEnv("SMTP_PASS");
  const smtpSecureRaw = getEnv("SMTP_SECURE");
  const fromEmail = getEnv("SMTP_FROM") ?? smtpUser;

  if (!smtpHost || !smtpPortRaw || !smtpUser || !smtpPass || !fromEmail) {
    return Response.json(
      {
        ok: false,
        error:
          "Email is not configured on the server. Set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, and SMTP_FROM.",
      },
      { status: 500 }
    );
  }

  const smtpPort = Number(smtpPortRaw);
  const smtpSecure = smtpSecureRaw ? smtpSecureRaw.toLowerCase() === "true" : smtpPort === 465;

  const payload: ContactPayload = { name, email, messageText, messageHtml, captchaToken };

  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: Number.isFinite(smtpPort) ? smtpPort : 587,
    secure: smtpSecure,
    auth: { user: smtpUser, pass: smtpPass },
  });

  const to = "dhelangan@gmail.com";
  const subject = `New contact message from ${payload.name}`;

  const text = [
    `Name: ${payload.name}`,
    `Email: ${payload.email}`,
    "",
    payload.messageText,
    "",
    `Sent at: ${new Date().toISOString()}`,
  ].join("\n");

  try {
    await transporter.sendMail({
      to,
      from: fromEmail,
      replyTo: payload.email,
      subject,
      text,
      html: `<p><strong>Name:</strong> ${payload.name}</p><p><strong>Email:</strong> ${payload.email}</p><hr />${payload.messageHtml}`,
    });
  } catch {
    return Response.json({ ok: false, error: "Failed to send email. Check SMTP settings." }, { status: 502 });
  }

  return Response.json({ ok: true });
}
