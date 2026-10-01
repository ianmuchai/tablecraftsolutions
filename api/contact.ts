type ContactPayload = {
  name: string;
  email: string;
  phone: string;
  company: string;
  service: string;
  message: string;
};

type ValidationResult =
  | { valid: true; value: ContactPayload }
  | { valid: false; errors: string[] };

type ContactEmailResult =
  | { sent: true; id?: string }
  | { sent: false; reason: "not-configured" | "provider-error"; error?: string };

type VercelRequest = {
  method?: string;
  body?: unknown;
};

type VercelResponse = {
  status(code: number): VercelResponse;
  json(payload: unknown): VercelResponse;
  setHeader?(name: string, value: string): VercelResponse;
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const defaultRecipient = "tablecraftsolutions@gmail.com";
const defaultSender = "TableCraft Solutions <onboarding@resend.dev>";

const clean = (value: unknown) => (typeof value === "string" ? value.trim() : "");

function validateContactPayload(payload: unknown): ValidationResult {
  const record = payload && typeof payload === "object" ? (payload as Record<string, unknown>) : {};
  const value: ContactPayload = {
    name: clean(record.name),
    email: clean(record.email),
    phone: clean(record.phone),
    company: clean(record.company),
    service: clean(record.service),
    message: clean(record.message)
  };
  const errors: string[] = [];

  if (!value.name) errors.push("Name is required.");
  if (!emailPattern.test(value.email)) errors.push("A valid email is required.");
  if (!value.service) errors.push("Service interest is required.");
  if (!value.message) errors.push("Message is required.");

  return errors.length ? { valid: false, errors } : { valid: true, value };
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function formatInquiryHtml(payload: ContactPayload) {
  const rows = [
    ["Name", payload.name],
    ["Email", payload.email],
    ["Phone", payload.phone || "Not provided"],
    ["Restaurant / Company", payload.company || "Not provided"],
    ["Service interest", payload.service],
    ["Message", payload.message]
  ];

  return `
    <div style="font-family: Arial, sans-serif; color: #162427; line-height: 1.55;">
      <h2 style="color: #003d46;">New TableCraft consultation inquiry</h2>
      <p>A visitor submitted the TableCraft Solutions consultation form.</p>
      <table cellpadding="8" cellspacing="0" style="border-collapse: collapse; width: 100%; max-width: 680px;">
        ${rows
          .map(
            ([label, value]) =>
              `<tr><th align="left" style="border: 1px solid #dce5e4; background: #f4f8f7; width: 190px;">${escapeHtml(label)}</th><td style="border: 1px solid #dce5e4;">${escapeHtml(value)}</td></tr>`
          )
          .join("")}
      </table>
    </div>
  `;
}

async function sendContactNotification(payload: ContactPayload): Promise<ContactEmailResult> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return { sent: false, reason: "not-configured" };
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: process.env.CONTACT_FROM_EMAIL || defaultSender,
        to: [process.env.CONTACT_TO_EMAIL || defaultRecipient],
        reply_to: payload.email,
        subject: `TableCraft consultation inquiry from ${payload.name}`,
        html: formatInquiryHtml(payload)
      })
    });

    const data = (await response.json().catch(() => ({}))) as { id?: string; message?: string; error?: string };
    if (!response.ok) {
      return { sent: false, reason: "provider-error", error: data.message || data.error || `Resend returned ${response.status}` };
    }

    return { sent: true, id: data.id };
  } catch (error) {
    return { sent: false, reason: "provider-error", error: error instanceof Error ? error.message : "Unknown email provider error" };
  }
}

const methodNotAllowed = (response: VercelResponse) => response.status(405).json({ error: "Method not allowed." });

export default async function handler(request: VercelRequest, response: VercelResponse) {
  response.setHeader?.("Access-Control-Allow-Origin", "*");
  response.setHeader?.("Access-Control-Allow-Methods", "POST,OPTIONS");
  response.setHeader?.("Access-Control-Allow-Headers", "Content-Type");

  if (request.method === "OPTIONS") {
    return response.status(204).json({});
  }

  if (request.method !== "POST") {
    return methodNotAllowed(response);
  }

  const result = validateContactPayload(request.body);
  if (!result.valid) {
    return response.status(400).json({ errors: result.errors });
  }

  const emailResult = await sendContactNotification(result.value).catch((error) => {
    console.warn("Contact email notification failed unexpectedly", error);
    return { sent: false as const, reason: "provider-error" as const };
  });

  if (!emailResult.sent && emailResult.reason !== "not-configured") {
    console.warn("Contact email notification was not sent", emailResult);
  }

  return response.status(201).json({
    message: "Inquiry received.",
    submission: {
      id: `contact-${Date.now()}`,
      createdAt: new Date().toISOString()
    },
    email: { forwarded: emailResult.sent }
  });
}