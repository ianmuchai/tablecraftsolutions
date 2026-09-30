import { describe, expect, test } from "vitest";
import { companyProfile, services } from "../backend/data/content";
import { validateContactPayload } from "../backend/lib/validation";

describe("backend content data", () => {
  test("publishes multiple restaurant consultancy services with stable slugs", () => {
    expect(services.length).toBeGreaterThanOrEqual(6);
    expect(services.map((service) => service.slug)).toContain("restaurant-launch");
    expect(services.every((service) => service.summary.length > 20)).toBe(true);
  });

  test("staff training includes in-person and virtual options plus learning resources", () => {
    const staffTraining = services.find((service) => service.slug === "staff-training");

    expect(staffTraining?.trainingOptions?.map((option) => option.mode)).toEqual(["In-person", "Virtual"]);
    expect(staffTraining?.learningResources?.length).toBeGreaterThanOrEqual(3);
    expect(staffTraining?.learningHub?.title).toContain("Learning Hub");
    expect(staffTraining?.excellenceFocusAreas?.map((area) => area.title)).toEqual([
      "Service Delivery Excellence",
      "Mentorship & Leadership Development",
      "Growth & Popularity Strategies",
      "Boosting Productivity & Profitability"
    ]);
  });

  test("company profile exposes about-page incorporation and leadership fields", () => {
    expect(companyProfile.incorporation.status).toContain("2018");
    expect(companyProfile.leadership.founder).toBe("Farhan Dahir");
    expect(companyProfile.leadership.ceo).toBe("Farhan Dahir");
    expect(companyProfile.leadership.note).toContain("vast hospitality industry experience");
  });
});

describe("validateContactPayload", () => {
  test("accepts a valid inquiry and trims text input", () => {
    const result = validateContactPayload({
      name: "  Amina Patel  ",
      email: "amina@example.com",
      service: "menu-engineering",
      message: "We need help redesigning our menu for profitability.",
      phone: "0712345678",
      company: "Nairobi Bistro"
    });

    expect(result.valid).toBe(true);
    if (result.valid) {
      expect(result.value.name).toBe("Amina Patel");
      expect(result.value.company).toBe("Nairobi Bistro");
    }
  });

  test("rejects missing required fields and malformed email", () => {
    const result = validateContactPayload({
      name: "",
      email: "not-an-email",
      service: "",
      message: ""
    });

    expect(result.valid).toBe(false);
    if (!result.valid) {
      expect(result.errors).toContain("Name is required.");
      expect(result.errors).toContain("A valid email is required.");
      expect(result.errors).toContain("Service interest is required.");
      expect(result.errors).toContain("Message is required.");
    }
  });
});



