import { readFileSync } from "node:fs";
import { describe, expect, test } from "vitest";
import {
  canUserDownloadResource,
  defaultLearningResourceAccessRules,
  defaultManagedLearningResources,
  defaultSiteTextRecords,
  resolveSiteText
} from "../src/content/learningResources";
import { defaultUserProfile } from "../src/content/dashboardUsers";

describe("mobile navigation CSS", () => {
  test("keeps the opened mobile menu visible outside the sticky header", () => {
    const css = readFileSync("src/styles.css", "utf8");

    expect(css).toContain(".site-header {");
    expect(css).toContain("contain: none;");
    expect(css).toContain("overflow: visible;");
    expect(css).toContain(".site-nav.open");
  });
});

describe("service detail hover descriptions", () => {
  test("adds specific tooltip descriptions to service outcomes and deliverables", () => {
    const source = readFileSync("src/pages/ServiceDetailPage.tsx", "utf8");

    expect(source).toContain("data-tooltip");
    expect(source).toContain("hover-explainer");
    expect(source).toContain("tabIndex={0}");
    expect(source).not.toContain("Included in this engagement");
    expect(source).toContain("Pre-opening deliverable");
    expect(source).toContain("Menu engineering tool");
    expect(source).toContain("Training asset");
  });
});

describe("learning resource access controls", () => {
  test("allows a logged-in user to download resources covered by enabled admin rules", () => {
    const profile = { ...defaultUserProfile, email: "manager@example.com" };
    const resource = defaultManagedLearningResources[0];
    const rules = [
      { id: "rule-1", resourceId: resource.id, scope: "email" as const, value: "manager@example.com", enabled: true }
    ];

    expect(canUserDownloadResource(profile, resource, rules)).toBe(true);
  });

  test("blocks resource downloads when no enabled rule matches the user", () => {
    const profile = { ...defaultUserProfile, email: "server@example.com" };
    const resource = defaultManagedLearningResources[0];
    const rules = [
      { id: "rule-1", resourceId: resource.id, scope: "email" as const, value: "manager@example.com", enabled: true }
    ];

    expect(canUserDownloadResource(profile, resource, rules)).toBe(false);
  });

  test("ships default learning resources, access rules, and editable site text records", () => {
    expect(defaultManagedLearningResources.length).toBeGreaterThanOrEqual(3);
    expect(defaultLearningResourceAccessRules.some((rule) => rule.scope === "all")).toBe(true);
    expect(defaultSiteTextRecords.length).toBeGreaterThanOrEqual(40);
    expect(defaultSiteTextRecords.map((record) => record.page)).toEqual(
      expect.arrayContaining(["Home", "About", "Services", "Service Detail", "Case Studies", "Insights", "Contact", "Dashboard", "Footer"])
    );
    expect(defaultSiteTextRecords.every((record) => record.description && record.section)).toBe(true);
    expect(resolveSiteText("home.hero.copy")).toContain("standards, systems");
  });


  test("gives the admin workspace more horizontal space than the sign-in card", () => {
    const css = readFileSync("src/styles.css", "utf8");

    expect(css).toContain("grid-template-columns: minmax(220px, 0.58fr) minmax(0, 1.42fr);");
  });

  test("supports friendly dashboard controls for managing site copy", () => {
    const source = readFileSync("src/pages/DashboardPage.tsx", "utf8");
    const css = readFileSync("src/styles.css", "utf8");

    expect(source).toContain("Site Content Manager");
    expect(source).toContain("contentSearch");
    expect(source).toContain("selectedContentPage");
    expect(source).toContain("resetTextRecord");
    expect(css).toContain(".content-manager-toolbar");
    expect(css).toContain(".content-page-tabs");
  });
});
