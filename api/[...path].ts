import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";
import { caseStudies, companyProfile, insights, services, testimonials } from "../backend/data/content";
import { validateContactPayload } from "../backend/lib/validation";

type VercelRequest = {
  method?: string;
  url?: string;
  query?: Record<string, string | string[] | undefined>;
  body?: unknown;
  headers?: Record<string, string | string[] | undefined>;
};

type VercelResponse = {
  status(code: number): VercelResponse;
  json(payload: unknown): VercelResponse;
  setHeader?(name: string, value: string): VercelResponse;
};

type AdminSession = {
  role: "admin";
  name: string;
  issuedAt: number;
};

const sessionCookieName = "tablecraft_session";
const sessionMaxAge = 60 * 60 * 8;

const normalizePath = (request: VercelRequest) => {
  const pathQuery = request.query?.path;
  if (Array.isArray(pathQuery)) return pathQuery.filter(Boolean);
  if (typeof pathQuery === "string" && pathQuery) return pathQuery.split("/").filter(Boolean);

  const pathname = new URL(request.url ?? "/api/health", "https://tablecraft.local").pathname;
  return pathname.replace(/^\/api\/?/, "").split("/").filter(Boolean);
};

const getAdminUsername = () => process.env.ADMIN_USERNAME || "Farhan";
const getAuthSecret = () => process.env.AUTH_SECRET || "tablecraft-development-auth-secret";
const encode = (value: string) => Buffer.from(value, "utf8").toString("base64url");
const decode = (value: string) => Buffer.from(value, "base64url").toString("utf8");

function sign(value: string) {
  return createHmac("sha256", getAuthSecret()).update(value).digest("base64url");
}

function secureCompare(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  return leftBuffer.length === rightBuffer.length && timingSafeEqual(leftBuffer, rightBuffer);
}

function createSessionToken(session: AdminSession) {
  const payload = encode(JSON.stringify(session));
  return `${payload}.${sign(payload)}`;
}

function readCookie(request: VercelRequest, name: string) {
  const rawHeader = request.headers?.cookie;
  const cookieHeader = Array.isArray(rawHeader) ? rawHeader.join("; ") : rawHeader ?? "";
  return cookieHeader
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${name}=`))
    ?.slice(name.length + 1);
}

function readSession(request: VercelRequest): AdminSession | null {
  const token = readCookie(request, sessionCookieName);
  if (!token) return null;

  const [payload, signature] = token.split(".");
  if (!payload || !signature || !secureCompare(signature, sign(payload))) return null;

  try {
    const session = JSON.parse(decode(payload)) as AdminSession;
    if (session.role !== "admin" || !session.name || Date.now() - session.issuedAt > sessionMaxAge * 1000) return null;
    return session;
  } catch {
    return null;
  }
}

function setSessionCookie(response: VercelResponse, session: AdminSession) {
  response.setHeader?.(
    "Set-Cookie",
    `${sessionCookieName}=${createSessionToken(session)}; Path=/; HttpOnly; SameSite=Lax; Secure; Max-Age=${sessionMaxAge}`
  );
}

function clearSessionCookie(response: VercelResponse) {
  response.setHeader?.("Set-Cookie", `${sessionCookieName}=; Path=/; HttpOnly; SameSite=Lax; Secure; Max-Age=0`);
}

const sendNotFound = (response: VercelResponse) => response.status(404).json({ error: "Route not found." });
const sendMethodNotAllowed = (response: VercelResponse) =>
  response.status(405).json({ error: "Method not allowed." });

export default async function handler(request: VercelRequest, response: VercelResponse) {
  response.setHeader?.("Access-Control-Allow-Origin", "*");
  response.setHeader?.("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  response.setHeader?.("Access-Control-Allow-Headers", "Content-Type");

  if (request.method === "OPTIONS") {
    return response.status(204).json({});
  }

  const method = request.method ?? "GET";
  const path = normalizePath(request);
  const [resource, slug, child] = path;

  try {
    if (resource === "auth") {
      if (slug === "session" && method === "GET") {
        const session = readSession(request);
        return response.json(
          session ? { authenticated: true, role: "admin", name: session.name } : { authenticated: false }
        );
      }

      if (slug === "logout" && method === "POST") {
        clearSessionCookie(response);
        return response.json({ authenticated: false });
      }

      if (slug === "login" && method === "POST") {
        if (!process.env.ADMIN_PASSWORD) {
          return response.status(503).json({ error: "Admin login is not configured." });
        }

        const credentials = request.body && typeof request.body === "object" ? (request.body as Record<string, unknown>) : {};
        const username = typeof credentials.username === "string" ? credentials.username.trim() : "";
        const password = typeof credentials.password === "string" ? credentials.password : "";

        if (username !== getAdminUsername() || password !== process.env.ADMIN_PASSWORD) {
          return response.status(401).json({ error: "Invalid username or password." });
        }

        const session = { role: "admin" as const, name: getAdminUsername(), issuedAt: Date.now() };
        setSessionCookie(response, session);
        return response.json({ authenticated: true, role: "admin", name: session.name });
      }

      return child ? sendNotFound(response) : sendMethodNotAllowed(response);
    }

    if (method === "GET" && resource === "health") {
      return response.json({ ok: true, service: "tablecraft-api" });
    }

    if (method === "GET" && resource === "services" && !slug) {
      return response.json({ services });
    }

    if (method === "GET" && resource === "services" && slug) {
      const service = services.find((item) => item.slug === slug);
      return service ? response.json({ service }) : response.status(404).json({ error: "Service not found." });
    }

    if (method === "GET" && resource === "case-studies") {
      return response.json({ caseStudies });
    }

    if (method === "GET" && resource === "insights" && !slug) {
      return response.json({ insights });
    }

    if (method === "GET" && resource === "insights" && slug) {
      const insight = insights.find((item) => item.slug === slug);
      return insight ? response.json({ insight }) : response.status(404).json({ error: "Insight not found." });
    }

    if (method === "GET" && resource === "testimonials") {
      return response.json({ testimonials });
    }

    if (method === "GET" && resource === "company-profile") {
      return response.json({ companyProfile });
    }

    if (method === "GET" && resource === "submissions") {
      return response.json({ submissions: [] });
    }

    if (method === "GET" && resource === "dashboard") {
      return response.json({
        generatedAt: new Date().toISOString(),
        totals: {
          services: services.length,
          caseStudies: caseStudies.length,
          insights: insights.length,
          testimonials: testimonials.length,
          submissions: 0
        },
        recentSubmissions: [],
        serviceDemand: services.map((service) => ({
          slug: service.slug,
          title: service.title,
          inquiries: 0
        }))
      });
    }

    if (resource === "contact") {
      if (method !== "POST") return sendMethodNotAllowed(response);

      const result = validateContactPayload(request.body);
      if (!result.valid) {
        return response.status(400).json({ errors: result.errors });
      }

      return response.status(201).json({
        message: "Inquiry received.",
        submission: {
          id: randomUUID(),
          createdAt: new Date().toISOString()
        }
      });
    }

    return sendNotFound(response);
  } catch (error) {
    console.error(error);
    return response.status(500).json({ error: "Something went wrong." });
  }
}
