import { describe, expect, test, vi } from "vitest";
import { getDashboardSummary, submitContact } from "../src/api/client";

describe("submitContact", () => {
  test("posts contact payloads to the backend and returns created submission metadata", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        message: "Inquiry received.",
        submission: { id: "abc-123", createdAt: "2026-09-27T12:00:00.000Z" }
      })
    });
    vi.stubGlobal("fetch", fetchMock);

    const response = await submitContact({
      name: "Amina Patel",
      email: "amina@example.com",
      service: "menu-engineering",
      message: "We need help.",
      phone: "",
      company: ""
    });

    expect(fetchMock).toHaveBeenCalledWith(
      "/api/contact",
      expect.objectContaining({
        method: "POST",
        headers: { "Content-Type": "application/json" }
      })
    );
    expect(response.submission.id).toBe("abc-123");
  });

  test("throws backend validation messages when the API rejects a contact payload", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 400,
        json: async () => ({ errors: ["A valid email is required."] })
      })
    );

    await expect(
      submitContact({
        name: "",
        email: "bad",
        service: "",
        message: "",
        phone: "",
        company: ""
      })
    ).rejects.toThrow("A valid email is required.");
  });
});

describe("getDashboardSummary", () => {
  test("loads live backend dashboard totals and recent submissions", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          generatedAt: "2026-09-28T08:00:00.000Z",
          totals: { services: 6, caseStudies: 3, insights: 3, testimonials: 3, submissions: 1 },
          recentSubmissions: [
            {
              id: "lead-1",
              createdAt: "2026-09-28T07:55:00.000Z",
              name: "Amina Patel",
              email: "amina@example.com",
              phone: "",
              company: "Nairobi Bistro",
              service: "menu-engineering",
              message: "We need menu help."
            }
          ],
          serviceDemand: [{ slug: "menu-engineering", title: "Menu Engineering", inquiries: 1 }]
        })
      })
    );

    const summary = await getDashboardSummary();

    expect(summary.totals.submissions).toBe(1);
    expect(summary.recentSubmissions[0].name).toBe("Amina Patel");
    expect(summary.serviceDemand[0].inquiries).toBe(1);
  });
});
