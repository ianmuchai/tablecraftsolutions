import { clearSessionCookie } from "./_shared.js";

export default function handler(request, response) {
  if (request.method !== "POST") return response.status(405).json({ error: "Method not allowed." });
  clearSessionCookie(response);
  return response.json({ authenticated: false });
}