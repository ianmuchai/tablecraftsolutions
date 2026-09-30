import { readSession, type VercelRequest, type VercelResponse } from "./_shared";

export default function handler(request: VercelRequest, response: VercelResponse) {
  if (request.method !== "GET") return response.status(405).json({ error: "Method not allowed." });
  const session = readSession(request);
  return response.json(session ? { authenticated: true, role: "admin", name: session.name } : { authenticated: false });
}