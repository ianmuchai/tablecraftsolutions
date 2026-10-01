import { caseStudies, companyProfile, insights, services, testimonials } from "../../backend/data/content";
import type {
  AdminLoginPayload,
  AdminSession,
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

function publicApiErrorMessage(message: string): string {
  if (message === "Admin login is not configured.") {
    return "Admin access is temporarily unavailable. Please try again later.";
  }

  return message;
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(path, options);
  const data = (await response.json().catch(() => ({}))) as T & ApiErrorPayload;

  if (!response.ok) {
    const message = data.errors?.join(" ") || data.error || `Request failed with status ${response.status}.`;
    throw new Error(publicApiErrorMessage(message));
  }

  return data;
}

function staticDashboardSummary(): DashboardSummary {
  return {
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
  };
}

export async function loginAdmin(payload: AdminLoginPayload): Promise<AdminSession> {
  return request<AdminSession>("/api/auth/login", {
    method: "POST",
    credentials: "same-origin",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
}

export async function getAdminSession(): Promise<AdminSession> {
  return request<AdminSession>("/api/auth/session", {
    credentials: "same-origin"
  });
}

export async function logoutAdmin(): Promise<AdminSession> {
  return request<AdminSession>("/api/auth/logout", {
    method: "POST",
    credentials: "same-origin"
  });
}
export async function getServices(): Promise<Service[]> {
  try {
    const data = await request<{ services: Service[] }>("/api/services");
    return data.services;
  } catch {
    return services;
  }
}

export async function getService(slug: string): Promise<Service> {
  try {
    const data = await request<{ service: Service }>(`/api/services/${slug}`);
    return data.service;
  } catch {
    const service = services.find((item) => item.slug === slug);
    if (!service) throw new Error("Service not found.");
    return service;
  }
}

export async function getCaseStudies(): Promise<CaseStudy[]> {
  try {
    const data = await request<{ caseStudies: CaseStudy[] }>("/api/case-studies");
    return data.caseStudies;
  } catch {
    return caseStudies;
  }
}

export async function getInsights(): Promise<Insight[]> {
  try {
    const data = await request<{ insights: Insight[] }>("/api/insights");
    return data.insights;
  } catch {
    return insights;
  }
}

export async function getInsight(slug: string): Promise<Insight> {
  try {
    const data = await request<{ insight: Insight }>(`/api/insights/${slug}`);
    return data.insight;
  } catch {
    const insight = insights.find((item) => item.slug === slug);
    if (!insight) throw new Error("Insight not found.");
    return insight;
  }
}

export async function getTestimonials(): Promise<Testimonial[]> {
  try {
    const data = await request<{ testimonials: Testimonial[] }>("/api/testimonials");
    return data.testimonials;
  } catch {
    return testimonials;
  }
}

export async function getCompanyProfile(): Promise<CompanyProfile> {
  try {
    const data = await request<{ companyProfile: CompanyProfile }>("/api/company-profile");
    return data.companyProfile;
  } catch {
    return companyProfile;
  }
}

export async function getSubmissions(): Promise<ContactSubmission[]> {
  try {
    const data = await request<{ submissions: ContactSubmission[] }>("/api/submissions");
    return data.submissions;
  } catch {
    return [];
  }
}

export async function getDashboardSummary(): Promise<DashboardSummary> {
  try {
    return await request<DashboardSummary>("/api/dashboard");
  } catch {
    return staticDashboardSummary();
  }
}

export async function submitContact(payload: ContactPayload): Promise<ContactResponse> {
  return request<ContactResponse>("/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
}
