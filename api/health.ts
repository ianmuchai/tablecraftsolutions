type VercelResponse = {
  json(payload: unknown): VercelResponse;
  setHeader?(name: string, value: string): VercelResponse;
};

export default function handler(_request: unknown, response: VercelResponse) {
  response.setHeader?.("Access-Control-Allow-Origin", "*");
  return response.json({ ok: true, service: "tablecraft-api" });
}
