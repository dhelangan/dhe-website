import nodemailer from "nodemailer";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type ContactPayload = {
  name: string;
  email: string;
  message: string;
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
  const message = isNonEmptyString(v.message) ? safeText(v.message, 5000) : "";
  const captchaToken = isNonEmptyString(v.captchaToken) ? safeText(v.captchaToken, 5000) : "";

  if (!name || !email || !message) {
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

  const payload: ContactPayload = { name, email, message, captchaToken };

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
    payload.message,
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
    });
  } catch {
    return Response.json({ ok: false, error: "Failed to send email. Check SMTP settings." }, { status: 502 });
  }

  return Response.json({ ok: true });
}
