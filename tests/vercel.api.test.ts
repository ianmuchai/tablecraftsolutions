import { describe, expect, test, vi } from "vitest";
import handler from "../api/[...path]";

type MockRequest = {
  method: string;
  url: string;
  query: Record<string, string | string[]>;
  body?: unknown;
  headers?: Record<string, string>;
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

  test("forwards valid consultation inquiries to the TableCraft email inbox", async () => {
    const originalApiKey = process.env.RESEND_API_KEY;
    const originalToEmail = process.env.CONTACT_TO_EMAIL;
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ id: "email-1" }) });
    process.env.RESEND_API_KEY = "test-resend-key";
    process.env.CONTACT_TO_EMAIL = "tablecraftsolutions@gmail.com";
    vi.stubGlobal("fetch", fetchMock);

    const result = await callApi({
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
    });

    expect(result.statusCode).toBe(201);
    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.resend.com/emails",
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({ Authorization: "Bearer test-resend-key" })
      })
    );
    const body = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(body.to).toEqual(["tablecraftsolutions@gmail.com"]);
    expect(body.reply_to).toBe("farah@example.com");
    expect(body.subject).toContain("TableCraft consultation inquiry");

    if (originalApiKey === undefined) delete process.env.RESEND_API_KEY;
    else process.env.RESEND_API_KEY = originalApiKey;
    if (originalToEmail === undefined) delete process.env.CONTACT_TO_EMAIL;
    else process.env.CONTACT_TO_EMAIL = originalToEmail;
    vi.unstubAllGlobals();
  });

  test("still accepts consultation inquiries when email forwarding is not configured", async () => {
    const originalApiKey = process.env.RESEND_API_KEY;
    delete process.env.RESEND_API_KEY;

    const result = await callApi({
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
    });

    expect(result.statusCode).toBe(201);
    expect(result.payload).toMatchObject({ message: "Inquiry received." });

    if (originalApiKey === undefined) delete process.env.RESEND_API_KEY;
    else process.env.RESEND_API_KEY = originalApiKey;
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
describe("Vercel API auth", () => {
  test("rejects admin login when password is not configured", async () => {
    const originalPassword = process.env.ADMIN_PASSWORD;
    delete process.env.ADMIN_PASSWORD;

    const result = await callApi({
      method: "POST",
      url: "/api/auth/login",
      query: { path: ["auth", "login"] },
      body: { username: "Farhan", password: "anything" }
    });

    if (originalPassword === undefined) {
      delete process.env.ADMIN_PASSWORD;
    } else {
      process.env.ADMIN_PASSWORD = originalPassword;
    }
    expect(result.statusCode).toBe(503);
    expect(result.payload).toEqual({ error: "Admin login is not configured." });
  });

  test("creates and clears an admin session cookie", async () => {
    const originalPassword = process.env.ADMIN_PASSWORD;
    const originalSecret = process.env.AUTH_SECRET;
    process.env.ADMIN_PASSWORD = "test-password";
    process.env.AUTH_SECRET = "test-auth-secret";

    const login = await callApi({
      method: "POST",
      url: "/api/auth/login",
      query: { path: ["auth", "login"] },
      body: { username: "Farhan", password: "test-password" }
    });

    expect(login.statusCode).toBe(200);
    expect(login.payload).toEqual({ authenticated: true, role: "admin", name: "Farhan" });
    const sessionCookie = login.headers.get("Set-Cookie") ?? "";
    expect(sessionCookie).toContain("tablecraft_session=");
    expect(sessionCookie).toContain("HttpOnly");

    const session = await callApi({
      method: "GET",
      url: "/api/auth/session",
      query: { path: ["auth", "session"] },
      headers: { cookie: sessionCookie }
    });
    expect(session.payload).toEqual({ authenticated: true, role: "admin", name: "Farhan" });

    const logout = await callApi({
      method: "POST",
      url: "/api/auth/logout",
      query: { path: ["auth", "logout"] }
    });
    expect(logout.statusCode).toBe(200);
    expect(logout.headers.get("Set-Cookie")).toContain("Max-Age=0");

    if (originalPassword === undefined) {
      delete process.env.ADMIN_PASSWORD;
    } else {
      process.env.ADMIN_PASSWORD = originalPassword;
    }
    if (originalSecret === undefined) {
      delete process.env.AUTH_SECRET;
    } else {
      process.env.AUTH_SECRET = originalSecret;
    }
  });
});
