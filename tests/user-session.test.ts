import { describe, expect, test } from "vitest";
import { createUserSession, defaultUserProfile, getUserFirstName, loginUserAccount, registerUserAccount } from "../src/content/dashboardUsers";

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
describe("dashboard user accounts", () => {
  test("creates an account without logging in automatically", () => {
    const account = registerUserAccount([], {
      ...defaultUserProfile,
      name: "Amina Hassan",
      email: "amina@example.com",
      password: "strong-password"
    });

    expect(account.accounts).toHaveLength(1);
    expect(account.session).toBeNull();
    expect(account.message).toBe("Account created. Please log in with your email and password.");
  });

  test("logs in with the saved password and returns a user session", () => {
    const registered = registerUserAccount([], {
      ...defaultUserProfile,
      name: "Amina Hassan",
      email: "amina@example.com",
      password: "strong-password"
    });

    const login = loginUserAccount(registered.accounts, "amina@example.com", "strong-password");

    expect(login.session?.firstName).toBe("Amina");
    expect(login.error).toBeUndefined();
  });

  test("rejects wrong user passwords", () => {
    const registered = registerUserAccount([], {
      ...defaultUserProfile,
      name: "Amina Hassan",
      email: "amina@example.com",
      password: "strong-password"
    });

    const login = loginUserAccount(registered.accounts, "amina@example.com", "wrong-password");

    expect(login.session).toBeNull();
    expect(login.error).toBe("Invalid email or password.");
  });
});
