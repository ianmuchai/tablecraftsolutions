import { describe, expect, test } from "vitest";
import handler from "../api/[...path]";

type MockRequest = {
  method: string;
  url: string;
  query: Record<string, string | string[]>;
  body?: unknown;
};

function createResponse() {
  let statusCode = 200;
  let payload: unknown;
  const headers = new Map<string, string>();

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
      setHeader(name: string, value: string) {
        headers.set(name, value);
        return this;
      }
    },
    result() {
      return { statusCode, payload, headers };
    }
  };
}

async function callApi(request: MockRequest) {
  const { response, result } = createResponse();
  await handler(request, response);
  return result();
}

describe("Vercel API handler", () => {
  test("serves API health checks", async () => {
    const result = await callApi({ method: "GET", url: "/api/health", query: { path: "health" } });

    expect(result.statusCode).toBe(200);
    expect(result.payload).toEqual({ ok: true, service: "tablecraft-api" });
  });

  test("serves dynamic service detail routes", async () => {
    const result = await callApi({
      method: "GET",
      url: "/api/services/staff-training",
      query: { path: ["services", "staff-training"] }
    });

    expect(result.statusCode).toBe(200);
    expect(result.payload).toMatchObject({
      service: {
        slug: "staff-training",
        trainingOptions: expect.arrayContaining([
          expect.objectContaining({ mode: "In-person" }),
          expect.objectContaining({ mode: "Virtual" })
        ])
      }
    });
  });

  test("validates contact submissions", async () => {
    const result = await callApi({
      method: "POST",
      url: "/api/contact",
      query: { path: "contact" },
      body: { name: "", email: "wrong", service: "", message: "" }
    });

    expect(result.statusCode).toBe(400);
    expect(result.payload).toEqual({
      errors: ["Name is required.", "A valid email is required.", "Service interest is required.", "Message is required."]
    });
  });
});
