import { describe, expect, test } from "vitest";
import { createUserSession, defaultUserProfile, getUserFirstName } from "../src/content/dashboardUsers";

describe("dashboard user sessions", () => {
  test("creates a logged-in session from a saved user profile", () => {
    const session = createUserSession({
      ...defaultUserProfile,
      name: "Amina Hassan",
      email: "amina@example.com"
    });

    expect(session).toEqual({
      authenticated: true,
      name: "Amina Hassan",
      firstName: "Amina",
      email: "amina@example.com"
    });
  });

  test("uses a professional fallback first name when a profile has only an email", () => {
    const session = createUserSession({
      ...defaultUserProfile,
      name: "",
      email: "manager@example.com"
    });

    expect(getUserFirstName(session)).toBe("Manager");
  });
});
