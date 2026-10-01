import type { ContactPayload } from "./validation";

export type ContactEmailResult =
  | { sent: true; id?: string }
  | { sent: false; reason: "not-configured" | "provider-error"; error?: string };

const defaultRecipient = "tablecraftsolutions@gmail.com";
const defaultSender = "TableCraft Solutions <onboarding@resend.dev>";

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

export async function sendContactNotification(payload: ContactPayload): Promise<ContactEmailResult> {
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
