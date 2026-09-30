import type { DashboardUserProfile, DashboardUserSession } from "../types";

export const dashboardServiceInterests = [
  "Restaurant Launch",
  "Menu Engineering",
  "Operations Audits",
  "Staff Training",
  "Brand & Guest Experience",
  "Cost Control"
] as const;

export const defaultUserProfile: DashboardUserProfile = {
  role: "user",
  name: "",
  email: "",
  company: "",
  serviceInterest: "",
  notes: ""
};

export const userProfileStorageKey = "tablecraft_user_profile";
export const userSessionStorageKey = "tablecraft_user_session";
export const userSessionChangedEvent = "tablecraft-user-session";

function titleCase(value: string) {
  if (!value) return "User";
  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
}

export function getUserFirstName(input: Pick<DashboardUserProfile, "name" | "email"> | DashboardUserSession) {
  const name = "firstName" in input ? input.firstName : input.name.trim().split(/\s+/)[0];
  if (name) return titleCase(name);

  const emailName = input.email.trim().split("@")[0]?.replace(/[._-]+/g, " ").trim().split(/\s+/)[0] ?? "";
  return titleCase(emailName);
}

export function createUserSession(profile: DashboardUserProfile): DashboardUserSession {
  return {
    authenticated: true,
    name: profile.name.trim() || getUserFirstName(profile),
    firstName: getUserFirstName(profile),
    email: profile.email.trim()
  };
}

export function readStoredUserSession(): DashboardUserSession | null {
  if (typeof window === "undefined") return null;
  const stored = window.localStorage.getItem(userSessionStorageKey);
  if (!stored) return null;
  try {
    return JSON.parse(stored) as DashboardUserSession;
  } catch {
    return null;
  }
}

export function storeUserSession(session: DashboardUserSession | null) {
  if (typeof window === "undefined") return;
  if (session) {
    window.localStorage.setItem(userSessionStorageKey, JSON.stringify(session));
  } else {
    window.localStorage.removeItem(userSessionStorageKey);
  }
  window.dispatchEvent(new Event(userSessionChangedEvent));
}
