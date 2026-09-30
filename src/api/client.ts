import type {
  CaseStudy,
  CompanyProfile,
  ContactPayload,
  ContactResponse,
  ContactSubmission,
  DashboardSummary,
  Insight,
  Service,
  Testimonial
} from "../types";

type ApiErrorPayload = {
  error?: string;
  errors?: string[];
};

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(path, options);
  const data = (await response.json().catch(() => ({}))) as T & ApiErrorPayload;

  if (!response.ok) {
    const message = data.errors?.join(" ") || data.error || `Request failed with status ${response.status}.`;
    throw new Error(message);
  }

  return data;
}

export async function getServices(): Promise<Service[]> {
  const data = await request<{ services: Service[] }>("/api/services");
  return data.services;
}

export async function getService(slug: string): Promise<Service> {
  const data = await request<{ service: Service }>(`/api/services/${slug}`);
  return data.service;
}

export async function getCaseStudies(): Promise<CaseStudy[]> {
  const data = await request<{ caseStudies: CaseStudy[] }>("/api/case-studies");
  return data.caseStudies;
}

export async function getInsights(): Promise<Insight[]> {
  const data = await request<{ insights: Insight[] }>("/api/insights");
  return data.insights;
}

export async function getInsight(slug: string): Promise<Insight> {
  const data = await request<{ insight: Insight }>(`/api/insights/${slug}`);
  return data.insight;
}

export async function getTestimonials(): Promise<Testimonial[]> {
  const data = await request<{ testimonials: Testimonial[] }>("/api/testimonials");
  return data.testimonials;
}

export async function getCompanyProfile(): Promise<CompanyProfile> {
  const data = await request<{ companyProfile: CompanyProfile }>("/api/company-profile");
  return data.companyProfile;
}

export async function getSubmissions(): Promise<ContactSubmission[]> {
  const data = await request<{ submissions: ContactSubmission[] }>("/api/submissions");
  return data.submissions;
}

export async function getDashboardSummary(): Promise<DashboardSummary> {
  return request<DashboardSummary>("/api/dashboard");
}

export async function submitContact(payload: ContactPayload): Promise<ContactResponse> {
  return request<ContactResponse>("/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
}
