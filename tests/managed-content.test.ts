import { readFileSync } from "node:fs";
import { describe, expect, test } from "vitest";
import { caseStudies, services } from "../backend/data/content";
import {
  customCaseStudiesStorageKey,
  customServicesStorageKey,
  mergeManagedCaseStudies,
  mergeManagedServices,
  serviceSlugFromTitle
} from "../src/content/managedContent";

describe("admin-managed public content", () => {
  test("merges admin-created services after the existing default services", () => {
    const nextServices = mergeManagedServices(services, [
      {
        slug: "banquet-systems",
        title: "Banquet Systems",
        eyebrow: "Events without friction",
        summary: "Build practical systems for private dining, banquets, and group bookings.",
        description: "A focused engagement for event menus, staffing plans, prep routines, and guest handoffs.",
        outcomes: ["Cleaner event handovers"],
        deliverables: ["Banquet operations checklist"]
      }
    ]);

    expect(nextServices).toHaveLength(services.length + 1);
    expect(nextServices.at(-1)?.slug).toBe("banquet-systems");
    expect(nextServices.find((service) => service.slug === "restaurant-launch")?.title).toBe("Restaurant Launch");
  });

  test("lets an admin-created service replace a default service with the same slug", () => {
    const nextServices = mergeManagedServices(services, [
      {
        ...services[0],
        title: "Restaurant Launch Advisory",
        summary: "Updated by the admin dashboard."
      }
    ]);

    expect(nextServices).toHaveLength(services.length);
    expect(nextServices[0].title).toBe("Restaurant Launch Advisory");
    expect(nextServices[0].summary).toBe("Updated by the admin dashboard.");
  });

  test("merges admin-created case studies without removing the default examples", () => {
    const nextCaseStudies = mergeManagedCaseStudies(caseStudies, [
      {
        slug: "training-reset",
        title: "Staff Training Reset",
        category: "Staff Training",
        summary: "A restaurant team rebuilt service language and supervisor routines.",
        metrics: ["28 team members coached", "3 manager checklists adopted"]
      }
    ]);

    expect(nextCaseStudies).toHaveLength(caseStudies.length + 1);
    expect(nextCaseStudies.at(-1)?.title).toBe("Staff Training Reset");
    expect(nextCaseStudies[0].title).toBe(caseStudies[0].title);
  });

  test("creates stable slugs for new dashboard entries", () => {
    expect(serviceSlugFromTitle("  Growth & Popularity Strategies!  ")).toBe("growth-popularity-strategies");
    expect(serviceSlugFromTitle("")).toMatch(/^managed-item-/);
  });

  test("wires the dashboard and public pages to managed services and case studies", () => {
    const dashboardSource = readFileSync("src/pages/DashboardPage.tsx", "utf8");
    const servicesPageSource = readFileSync("src/pages/ServicesPage.tsx", "utf8");
    const serviceDetailSource = readFileSync("src/pages/ServiceDetailPage.tsx", "utf8");
    const caseStudiesPageSource = readFileSync("src/pages/CaseStudiesPage.tsx", "utf8");

    expect(dashboardSource).toContain("customServicesStorageKey");
    expect(dashboardSource).toContain("customCaseStudiesStorageKey");
    expect(dashboardSource).toContain("Add service");
    expect(dashboardSource).toContain("Add case study");
    expect(servicesPageSource).toContain("mergeManagedServices");
    expect(serviceDetailSource).toContain("mergeManagedServices");
    expect(caseStudiesPageSource).toContain("mergeManagedCaseStudies");
    expect(customServicesStorageKey).toBe("tablecraft_custom_services");
    expect(customCaseStudiesStorageKey).toBe("tablecraft_custom_case_studies");
  });
});
