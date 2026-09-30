import { clearSessionCookie, type VercelRequest, type VercelResponse } from "./_shared";

export default function handler(request: VercelRequest, response: VercelResponse) {
  if (request.method !== "POST") return response.status(405).json({ error: "Method not allowed." });
  clearSessionCookie(response);
  return response.json({ authenticated: false });
}