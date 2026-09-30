import type { DashboardUserProfile, LearningResourceAccessRule, ManagedLearningResource, SiteTextRecord } from "../types";

export const learningResourcesStorageKey = "tablecraft_learning_resources";
export const learningAccessRulesStorageKey = "tablecraft_learning_access_rules";
export const siteTextStorageKey = "tablecraft_site_text_records";

const now = "2026-09-30T00:00:00.000Z";

export const defaultManagedLearningResources: ManagedLearningResource[] = [
  {
    id: "service-standards-playbook",
    title: "Service Standards Playbook",
    format: "PDF guide",
    summary: "Greeting, table touchpoints, upselling language, guest recovery, and closing routines for staff-training follow-up.",
    fileName: "service-standards-playbook.txt",
    downloadUrl:
      "data:text/plain;charset=utf-8,TableCraft%20Service%20Standards%20Playbook%0A%0AGreeting%2C%20table%20touchpoints%2C%20upselling%2C%20guest%20recovery%2C%20and%20closing%20routines.",
    audience: "Staff training users",
    uploadedAt: now
  },
  {
    id: "shift-briefing-templates",
    title: "Shift Briefing Templates",
    format: "Manager toolkit",
    summary: "Briefing and debriefing prompts that help supervisors align teams before service and review performance after close.",
    fileName: "shift-briefing-templates.txt",
    downloadUrl:
      "data:text/plain;charset=utf-8,TableCraft%20Shift%20Briefing%20Templates%0A%0APre-service%20alignment%2C%20station%20readiness%2C%20targets%2C%20and%20close-of-shift%20review%20prompts.",
    audience: "Managers and supervisors",
    uploadedAt: now
  },
  {
    id: "menu-knowledge-cards",
    title: "Menu Knowledge Cards",
    format: "Training cards",
    summary: "Prompts that help servers explain dishes, allergens, pairings, and profitable recommendations with confidence.",
    fileName: "menu-knowledge-cards.txt",
    downloadUrl:
      "data:text/plain;charset=utf-8,TableCraft%20Menu%20Knowledge%20Cards%0A%0ADish%20language%2C%20allergen%20awareness%2C%20pairings%2C%20and%20profitable%20recommendation%20prompts.",
    audience: "Front-of-house teams",
    uploadedAt: now
  }
];

export const defaultLearningResourceAccessRules: LearningResourceAccessRule[] = [
  {
    id: "default-all-staff-training",
    resourceId: "all",
    scope: "all",
    value: "All logged-in staff-training users",
    enabled: true
  }
];

export const defaultSiteTextRecords: SiteTextRecord[] = [
  {
    id: "home-hero-copy",
    page: "Home",
    label: "Homepage hero copy",
    key: "home.hero.copy",
    value:
      "We help restaurants launch smarter, train confident teams, tighten operations, and turn hospitality ambition into standards, systems, and measurable service excellence."
  },
  {
    id: "services-hero-copy",
    page: "Services",
    label: "Services page intro",
    key: "services.hero.copy",
    value: "Choose a focused project or combine tracks into a deeper operational transformation."
  },
  {
    id: "about-leadership-copy",
    page: "About",
    label: "Founder and CEO profile",
    key: "about.leadership.copy",
    value:
      "Farhan Dahir is the Founder and CEO of TableCraft Solutions, bringing vast hospitality industry experience and a hands-on understanding of restaurant standards, systems, staff development, and operational excellence."
  },
  {
    id: "staff-training-intro",
    page: "Staff Training",
    label: "Staff training delivery intro",
    key: "staffTraining.delivery.copy",
    value:
      "Staff training can be delivered on site for hands-on operational practice or virtually for guided learning, manager alignment, and follow-up coaching."
  }
];

function normalise(value: string) {
  return value.trim().toLowerCase();
}

function userEmailDomain(profile: DashboardUserProfile) {
  const email = normalise(profile.email);
  return email.includes("@") ? email.split("@").pop() ?? "" : "";
}

function targetsResource(rule: LearningResourceAccessRule, resource: ManagedLearningResource) {
  return rule.resourceId === "all" || rule.resourceId === resource.id;
}

export function canUserDownloadResource(
  profile: DashboardUserProfile,
  resource: ManagedLearningResource,
  rules: LearningResourceAccessRule[] = defaultLearningResourceAccessRules
) {
  const email = normalise(profile.email);
  if (!email) return false;

  return rules.some((rule) => {
    if (!rule.enabled || !targetsResource(rule, resource)) return false;
    if (rule.scope === "all") return true;
    if (rule.scope === "email") return normalise(rule.value) === email;
    return normalise(rule.value).replace(/^@/, "") === userEmailDomain(profile);
  });
}

export function resolveSiteText(key: string, records: SiteTextRecord[] = defaultSiteTextRecords) {
  if (typeof window !== "undefined") {
    const stored = window.localStorage.getItem(siteTextStorageKey);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as SiteTextRecord[];
        return parsed.find((record) => record.key === key)?.value ?? records.find((record) => record.key === key)?.value ?? "";
      } catch {
        return records.find((record) => record.key === key)?.value ?? "";
      }
    }
  }

  return records.find((record) => record.key === key)?.value ?? "";
}
