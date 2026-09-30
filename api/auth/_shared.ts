import { createHmac, timingSafeEqual } from "node:crypto";

export type VercelRequest = {
  method?: string;
  body?: unknown;
  headers?: Record<string, string | string[] | undefined>;
};

export type VercelResponse = {
  status(code: number): VercelResponse;
  json(payload: unknown): VercelResponse;
  setHeader?(name: string, value: string): VercelResponse;
};

export type AdminSession = {
  role: "admin";
  name: string;
  issuedAt: number;
};

export const sessionCookieName = "tablecraft_session";
export const sessionMaxAge = 60 * 60 * 8;

export const getAdminUsername = () => process.env.ADMIN_USERNAME || "Farhan";
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

export function createSessionToken(session: AdminSession) {
  const payload = encode(JSON.stringify(session));
  return `${payload}.${sign(payload)}`;
}

export function readCookie(request: VercelRequest, name: string) {
  const rawHeader = request.headers?.cookie;
  const cookieHeader = Array.isArray(rawHeader) ? rawHeader.join("; ") : rawHeader ?? "";
  return cookieHeader
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${name}=`))
    ?.slice(name.length + 1);
}

export function readSession(request: VercelRequest): AdminSession | null {
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

export function setSessionCookie(response: VercelResponse, session: AdminSession) {
  response.setHeader?.(
    "Set-Cookie",
    `${sessionCookieName}=${createSessionToken(session)}; Path=/; HttpOnly; SameSite=Lax; Secure; Max-Age=${sessionMaxAge}`
  );
}

export function clearSessionCookie(response: VercelResponse) {
  response.setHeader?.("Set-Cookie", `${sessionCookieName}=; Path=/; HttpOnly; SameSite=Lax; Secure; Max-Age=0`);
}