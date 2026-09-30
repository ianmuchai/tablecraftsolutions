import { getAdminUsername, setSessionCookie, type VercelRequest, type VercelResponse } from "./_shared";

export default function handler(request: VercelRequest, response: VercelResponse) {
  if (request.method !== "POST") return response.status(405).json({ error: "Method not allowed." });
  if (!process.env.ADMIN_PASSWORD) return response.status(503).json({ error: "Admin login is not configured." });

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