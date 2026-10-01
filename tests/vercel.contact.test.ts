import { describe, expect, test, vi } from "vitest";
import { readFileSync } from "node:fs";
import handler from "../api/contact";

type MockRequest = {
  method?: string;
  body?: unknown;
};

function createResponse() {
  let statusCode = 200;
  let payload: unknown;

  return {
    response: {
      status(code: number) {
        statusCode = code;
        return this;
      },
      json(data: unknown) {
        payload = data;
        return this;
      },
      setHeader() {
        return this;
      }
    },
    result() {
      return { statusCode, payload };
    }
  };
}

describe("dedicated Vercel contact endpoint", () => {
  test("stays self-contained to avoid deployment-time import failures", () => {
    const source = readFileSync("api/contact.ts", "utf8");

    expect(source).not.toContain("../backend/");
    expect(source).not.toContain("node:");
  });

  test("forwards a valid contact inquiry through Resend", async () => {
    const originalApiKey = process.env.RESEND_API_KEY;
    const originalToEmail = process.env.CONTACT_TO_EMAIL;
    process.env.RESEND_API_KEY = "test-resend-key";
    process.env.CONTACT_TO_EMAIL = "tablecraftsolutions@gmail.com";

    const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ id: "email-123" }) });
    vi.stubGlobal("fetch", fetchMock);

    const { response, result } = createResponse();
    await handler(
      {
        method: "POST",
        body: {
          name: "Farah Ali",
          email: "farah@example.com",
          phone: "0794000000",
          company: "Kilimani Cafe",
          service: "staff-training",
          message: "We want to book a consultation for staff training."
        }
      } satisfies MockRequest,
      response
    );

    expect(result().statusCode).toBe(201);
    expect(result().payload).toMatchObject({
      message: "Inquiry received.",
      email: { forwarded: true }
    });
    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.resend.com/emails",
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({ Authorization: "Bearer test-resend-key" })
      })
    );

    if (originalApiKey === undefined) delete process.env.RESEND_API_KEY;
    else process.env.RESEND_API_KEY = originalApiKey;
    if (originalToEmail === undefined) delete process.env.CONTACT_TO_EMAIL;
    else process.env.CONTACT_TO_EMAIL = originalToEmail;
    vi.unstubAllGlobals();
  });
});
