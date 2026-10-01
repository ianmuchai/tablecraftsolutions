import { describe, expect, test, vi } from "vitest";

type MockRequest = {
  method: string;
  url: string;
  query: Record<string, string | string[]>;
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

describe("contact route fallback", () => {
  test("accepts valid inquiries even when email forwarding throws unexpectedly", async () => {
    vi.resetModules();
    vi.doMock("../backend/lib/email", () => ({
      sendContactNotification: vi.fn().mockRejectedValue(new Error("email provider crashed"))
    }));

    const { default: handler } = await import("../api/[...path]");
    const { response, result } = createResponse();

    await handler(
      {
        method: "POST",
        url: "/api/contact",
        query: { path: "contact" },
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
      email: { forwarded: false }
    });
  });
});
