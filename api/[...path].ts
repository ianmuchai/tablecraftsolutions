import { caseStudies, companyProfile, insights, services, testimonials } from "../backend/data/content";
import { validateContactPayload } from "../backend/lib/validation";

type VercelRequest = {
  method?: string;
  url?: string;
  query?: Record<string, string | string[] | undefined>;
  body?: unknown;
};

type VercelResponse = {
  status(code: number): VercelResponse;
  json(payload: unknown): VercelResponse;
  setHeader?(name: string, value: string): VercelResponse;
};

const normalizePath = (request: VercelRequest) => {
  const pathQuery = request.query?.path;
  if (Array.isArray(pathQuery)) return pathQuery.filter(Boolean);
  if (typeof pathQuery === "string" && pathQuery) return pathQuery.split("/").filter(Boolean);

  const pathname = new URL(request.url ?? "/api/health", "https://tablecraft.local").pathname;
  return pathname.replace(/^\/api\/?/, "").split("/").filter(Boolean);
};

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
  const [resource, slug] = path;

  try {
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
          id: crypto.randomUUID(),
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
