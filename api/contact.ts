import { randomUUID } from "node:crypto";
import { sendContactNotification } from "../backend/lib/email";
import { validateContactPayload } from "../backend/lib/validation";

type VercelRequest = {
  method?: string;
  body?: unknown;
};

type VercelResponse = {
  status(code: number): VercelResponse;
  json(payload: unknown): VercelResponse;
  setHeader?(name: string, value: string): VercelResponse;
};

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
      id: randomUUID(),
      createdAt: new Date().toISOString()
    },
    email: { forwarded: emailResult.sent }
  });
}
