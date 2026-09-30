import type { DashboardUserProfile } from "../types";

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
