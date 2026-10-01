import cors from "cors";
import express from "express";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { caseStudies, companyProfile, insights, services, testimonials } from "./data/content";
import { listContactSubmissions, saveContactSubmission } from "./lib/contactStore";
import { sendContactNotification } from "./lib/email";
import { validateContactPayload } from "./lib/validation";

const app = express();
const port = Number(process.env.PORT ?? 4000);
const distPath = resolve(process.cwd(), "dist");
const indexPath = resolve(distPath, "index.html");

app.use(cors());
app.use(express.json({ limit: "1mb" }));

app.get("/api/health", (_request, response) => {
  response.json({ ok: true, service: "tablecraft-api" });
});

app.get("/api/services", (_request, response) => {
  response.json({ services });
});

app.get("/api/services/:slug", (request, response) => {
  const service = services.find((item) => item.slug === request.params.slug);
  if (!service) {
    response.status(404).json({ error: "Service not found." });
    return;
  }
  response.json({ service });
});

app.get("/api/case-studies", (_request, response) => {
  response.json({ caseStudies });
});

app.get("/api/insights", (_request, response) => {
  response.json({ insights });
});

app.get("/api/insights/:slug", (request, response) => {
  const insight = insights.find((item) => item.slug === request.params.slug);
  if (!insight) {
    response.status(404).json({ error: "Insight not found." });
    return;
  }
  response.json({ insight });
});

app.get("/api/testimonials", (_request, response) => {
  response.json({ testimonials });
});

app.get("/api/company-profile", (_request, response) => {
  response.json({ companyProfile });
});

app.get("/api/submissions", async (_request, response, next) => {
  try {
    const submissions = await listContactSubmissions();
    response.json({ submissions });
  } catch (error) {
    next(error);
  }
});

app.get("/api/dashboard", async (_request, response, next) => {
  try {
    const submissions = await listContactSubmissions();
    response.json({
      generatedAt: new Date().toISOString(),
      totals: {
        services: services.length,
        caseStudies: caseStudies.length,
        insights: insights.length,
        testimonials: testimonials.length,
        submissions: submissions.length
      },
      recentSubmissions: submissions.slice(0, 5),
      serviceDemand: services.map((service) => ({
        slug: service.slug,
        title: service.title,
        inquiries: submissions.filter((submission) => submission.service === service.slug).length
      }))
    });
  } catch (error) {
    next(error);
  }
});

app.post("/api/contact", async (request, response, next) => {
  try {
    const result = validateContactPayload(request.body);
    if (!result.valid) {
      response.status(400).json({ errors: result.errors });
      return;
    }

    const submission = await saveContactSubmission(result.value);
    const emailResult = await sendContactNotification(result.value);
    if (!emailResult.sent && emailResult.reason !== "not-configured") {
      console.warn("Contact email notification was not sent", emailResult);
    }

    response.status(201).json({
      message: "Inquiry received.",
      submission: { id: submission.id, createdAt: submission.createdAt },
      email: { forwarded: emailResult.sent }
    });
  } catch (error) {
    next(error);
  }
});
if (existsSync(indexPath)) {
  app.use(express.static(distPath));
  app.get(/^(?!\/api).*/, (_request, response) => {
    response.sendFile(indexPath);
  });
}

app.use((error: unknown, _request: express.Request, response: express.Response, _next: express.NextFunction) => {
  console.error(error);
  response.status(500).json({ error: "Something went wrong." });
});

app.listen(port, () => {
  console.log(`TableCraft Solutions API running on http://localhost:${port}`);
});
