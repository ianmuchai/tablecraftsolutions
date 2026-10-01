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

const textRecord = (page: string, section: string, label: string, key: string, value: string, description: string): SiteTextRecord => ({
  id: key.replace(/\./g, "-"),
  page,
  section,
  label,
  key,
  value,
  description
});

export const defaultSiteTextRecords: SiteTextRecord[] = [
  textRecord("Home", "Hero", "Eyebrow", "home.hero.eyebrow", "Restaurant consultancy", "Small label above the homepage headline."),
  textRecord("Home", "Hero", "Headline", "home.hero.title", "TableCraft Solutions", "Main homepage headline."),
  textRecord("Home", "Hero", "Intro paragraph", "home.hero.copy", "We help restaurants launch smarter, train confident teams, tighten operations, and turn hospitality ambition into standards, systems, and measurable service excellence.", "Main paragraph shown inside the homepage hero."),
  textRecord("Home", "Hero", "Primary button", "home.hero.primaryButton", "Book a consultation", "Homepage primary call-to-action button."),
  textRecord("Home", "Hero", "Secondary button", "home.hero.secondaryButton", "Explore services", "Homepage secondary call-to-action button."),
  textRecord("Home", "Metrics", "Incorporation metric", "home.metric.incorporation", "incorporated for hospitality excellence", "Caption beside the 2018 homepage metric."),
  textRecord("Home", "Metrics", "Experience metric", "home.metric.experience", "founder-led hospitality experience", "Caption beside the founder experience metric."),
  textRecord("Home", "Services", "Section label", "home.services.eyebrow", "What we craft", "Label above the featured services section."),
  textRecord("Home", "Services", "Section headline", "home.services.title", "Consulting built around the restaurant's real operating layers.", "Headline above featured services."),
  textRecord("Home", "Process", "Section label", "home.process.eyebrow", "How we work", "Label above the process section."),
  textRecord("Home", "Process", "Section headline", "home.process.title", "Strategy that reaches the pass, the floor, and the numbers.", "Headline for the process section."),
  textRecord("Home", "Process", "Section paragraph", "home.process.copy", "TableCraft connects brand, menu, service, staffing, purchasing, and reporting so every layer supports the same commercial goal.", "Paragraph explaining how TableCraft works."),

  textRecord("About", "Hero", "Eyebrow", "about.hero.eyebrow", "About TableCraft Solutions", "Small label above the About page headline."),
  textRecord("About", "Hero", "Headline", "about.hero.title", "Standards, systems, and excellence for stronger restaurant operations.", "Main About page headline."),
  textRecord("About", "Hero", "Intro paragraph", "about.hero.copy", "We build excellence in hospitality by helping restaurant teams sharpen service, leadership, visibility, productivity, and profitability.", "About page hero paragraph."),
  textRecord("About", "Point of view", "Section label", "about.point.eyebrow", "Our point of view", "Label above the About operating philosophy."),
  textRecord("About", "Point of view", "Section headline", "about.point.title", "Restaurants succeed when every layer is intentionally connected.", "Headline for the About operating philosophy."),
  textRecord("About", "Point of view", "Section paragraph", "about.point.copy", "TableCraft Solutions works with hospitality operators who need practical standards, repeatable systems, and disciplined execution. The work connects service culture, menu performance, leadership habits, operating rhythm, and commercial results so the restaurant can grow without losing consistency.", "Paragraph describing the company operating philosophy."),
  textRecord("About", "Company story", "Section label", "about.story.eyebrow", "Company story", "Label above company history."),
  textRecord("About", "Company story", "Section headline", "about.story.title", "Built around practical hospitality leadership.", "Company story headline."),
  textRecord("About", "Company story", "Section paragraph", "about.story.copy", "TableCraft Solutions is positioned as a restaurant consultancy for teams that want measurable improvement in guest experience, staff performance, and management discipline. The company story connects official incorporation and leadership details to a clear operating philosophy.", "Paragraph beside incorporation and leadership details."),
  textRecord("About", "Founder", "Founder and CEO profile", "about.leadership.copy", "Farhan Dahir is the Founder and CEO of TableCraft Solutions, bringing vast hospitality industry experience and a hands-on understanding of restaurant standards, systems, staff development, and operational excellence.", "Founder and CEO profile shown on the About page."),
  textRecord("About", "Consulting style", "Section label", "about.style.eyebrow", "Consulting style", "Label above the consulting style band."),
  textRecord("About", "Consulting style", "Section headline", "about.style.title", "Clear diagnosis, sharper decisions, hands-on tools.", "Headline in the consulting style band."),
  textRecord("About", "Consulting style", "Section paragraph", "about.style.copy", "We do not leave operators with theory alone. Each project creates working documents, standards, checklists, and rhythms the team can keep using after the engagement ends.", "Paragraph in the consulting style band."),

  textRecord("Services", "Hero", "Eyebrow", "services.hero.eyebrow", "Services", "Small label above the Services page headline."),
  textRecord("Services", "Hero", "Headline", "services.hero.title", "Consultancy tracks for every layer of restaurant performance.", "Main Services page headline."),
  textRecord("Services", "Hero", "Intro paragraph", "services.hero.copy", "Choose a focused project or combine tracks into a deeper operational transformation.", "Services page hero paragraph."),
  textRecord("Services", "Cards", "Card action label", "services.card.action", "Explore service", "Action text shown on service cards."),

  textRecord("Services", "Restaurant Launch", "Card label", "services.restaurant-launch.eyebrow", "Concept to opening night", "Label shown above the Restaurant Launch service."),
  textRecord("Services", "Restaurant Launch", "Service name", "services.restaurant-launch.title", "Restaurant Launch", "Service name shown on cards and detail pages."),
  textRecord("Services", "Restaurant Launch", "Card summary", "services.restaurant-launch.summary", "Launch new restaurants with a clear concept, practical numbers, trained teams, and opening systems.", "Short Restaurant Launch summary shown on service cards."),
  textRecord("Services", "Restaurant Launch", "Detail intro", "services.restaurant-launch.description", "We shape the concept, guest journey, operating model, launch calendar, and pre-opening controls so your restaurant opens with confidence instead of guesswork.", "Restaurant Launch intro paragraph on the detail page."),
  textRecord("Services", "Menu Engineering", "Card label", "services.menu-engineering.eyebrow", "Profit by design", "Label shown above the Menu Engineering service."),
  textRecord("Services", "Menu Engineering", "Service name", "services.menu-engineering.title", "Menu Engineering", "Service name shown on cards and detail pages."),
  textRecord("Services", "Menu Engineering", "Card summary", "services.menu-engineering.summary", "Turn your menu into a profitable sales tool through pricing, layout, costing, and item performance analysis.", "Short Menu Engineering summary shown on service cards."),
  textRecord("Services", "Menu Engineering", "Detail intro", "services.menu-engineering.description", "We evaluate contribution margins, guest behavior, category balance, language, and visual hierarchy to make the menu easier to sell and easier to operate.", "Menu Engineering intro paragraph on the detail page."),
  textRecord("Services", "Operations Audits", "Card label", "services.operations-audits.eyebrow", "Find the leaks", "Label shown above the Operations Audits service."),
  textRecord("Services", "Operations Audits", "Service name", "services.operations-audits.title", "Operations Audits", "Service name shown on cards and detail pages."),
  textRecord("Services", "Operations Audits", "Card summary", "services.operations-audits.summary", "Diagnose service, kitchen, purchasing, inventory, and management routines that quietly reduce performance.", "Short Operations Audits summary shown on service cards."),
  textRecord("Services", "Operations Audits", "Detail intro", "services.operations-audits.description", "Our audit follows the service from prep to close, revealing the daily patterns that affect speed, quality, cost control, and guest satisfaction.", "Operations Audits intro paragraph on the detail page."),
  textRecord("Services", "Staff Training", "Card label", "services.staff-training.eyebrow", "Teams that deliver", "Label shown above the Staff Training service."),
  textRecord("Services", "Staff Training", "Service name", "services.staff-training.title", "Staff Training", "Service name shown on cards and detail pages."),
  textRecord("Services", "Staff Training", "Card summary", "services.staff-training.summary", "Equip front-of-house and back-of-house teams with service standards, selling habits, and operating discipline.", "Short Staff Training summary shown on service cards."),
  textRecord("Services", "Staff Training", "Detail intro", "services.staff-training.description", "We create practical training that matches your restaurant format, from service language and upselling to station readiness and shift leadership.", "Staff Training intro paragraph on the detail page."),
  textRecord("Services", "Brand & Guest Experience", "Card label", "services.brand-guest-experience.eyebrow", "Memorable hospitality", "Label shown above the Brand and Guest Experience service."),
  textRecord("Services", "Brand & Guest Experience", "Service name", "services.brand-guest-experience.title", "Brand & Guest Experience", "Service name shown on cards and detail pages."),
  textRecord("Services", "Brand & Guest Experience", "Card summary", "services.brand-guest-experience.summary", "Align your brand promise, space, menu, staff language, and guest touchpoints into one memorable experience.", "Short Brand and Guest Experience summary shown on service cards."),
  textRecord("Services", "Brand & Guest Experience", "Detail intro", "services.brand-guest-experience.description", "We connect identity to execution, ensuring the feeling guests receive is intentional from discovery to payment and return visits.", "Brand and Guest Experience intro paragraph on the detail page."),
  textRecord("Services", "Cost Control", "Card label", "services.cost-control.eyebrow", "Protect the margin", "Label shown above the Cost Control service."),
  textRecord("Services", "Cost Control", "Service name", "services.cost-control.title", "Cost Control", "Service name shown on cards and detail pages."),
  textRecord("Services", "Cost Control", "Card summary", "services.cost-control.summary", "Build purchasing, inventory, recipe costing, and reporting habits that protect margins without reducing quality.", "Short Cost Control summary shown on service cards."),
  textRecord("Services", "Cost Control", "Detail intro", "services.cost-control.description", "We help restaurants understand where money disappears and install practical controls that teams can actually maintain.", "Cost Control intro paragraph on the detail page."),
  textRecord("Service Detail", "Navigation", "Back link", "serviceDetail.back", "Services", "Back-link label on each service detail page."),
  textRecord("Service Detail", "Outcome block", "Section label", "serviceDetail.outcomes.eyebrow", "Outcomes", "Label above service outcomes."),
  textRecord("Service Detail", "Outcome block", "Headline", "serviceDetail.outcomes.title", "What improves", "Headline above service outcomes."),
  textRecord("Service Detail", "Deliverable block", "Section label", "serviceDetail.deliverables.eyebrow", "Deliverables", "Label above service deliverables."),
  textRecord("Service Detail", "Deliverable block", "Headline", "serviceDetail.deliverables.title", "What you receive", "Headline above service deliverables."),
  textRecord("Staff Training", "Delivery", "Section label", "staffTraining.delivery.eyebrow", "Training delivery", "Label above staff training options."),
  textRecord("Staff Training", "Delivery", "Headline", "staffTraining.delivery.title", "Choose in-person or virtual staff training.", "Headline above staff training delivery options."),
  textRecord("Staff Training", "Delivery", "Intro paragraph", "staffTraining.delivery.copy", "Staff training can be delivered on site for hands-on operational practice or virtually for guided learning, manager alignment, and follow-up coaching.", "Intro paragraph above staff training delivery options."),
  textRecord("Staff Training", "Learning Hub", "Section label", "staffTraining.resources.eyebrow", "Learning resources", "Label above staff training resources."),
  textRecord("Staff Training", "Learning Hub", "Headline", "staffTraining.resources.title", "Resources teams can keep using.", "Headline above staff training resources."),

  textRecord("Case Studies", "Hero", "Eyebrow", "caseStudies.hero.eyebrow", "Case studies", "Small label above the Case Studies headline."),
  textRecord("Case Studies", "Hero", "Headline", "caseStudies.hero.title", "Result-focused examples from restaurant operating challenges.", "Main Case Studies page headline."),
  textRecord("Case Studies", "Hero", "Intro paragraph", "caseStudies.hero.copy", "Representative projects showing how better systems improve clarity, consistency, and margin.", "Case Studies hero paragraph."),
  textRecord("Case Studies", "Empty state", "Loading message", "caseStudies.empty", "Case studies are loading.", "Message shown when case studies are not yet available."),

  textRecord("Insights", "Hero", "Eyebrow", "insights.hero.eyebrow", "Insights", "Small label above the Insights headline."),
  textRecord("Insights", "Hero", "Headline", "insights.hero.title", "Practical thinking for sharper restaurant decisions.", "Main Insights page headline."),
  textRecord("Insights", "Hero", "Intro paragraph", "insights.hero.copy", "Short reads on menu strategy, launch planning, operations, and profitability habits.", "Insights hero paragraph."),
  textRecord("Insights", "Navigation", "Back link", "insightDetail.back", "Insights", "Back-link label on insight detail pages."),

  textRecord("Contact", "Hero", "Eyebrow", "contact.hero.eyebrow", "Contact", "Small label above the Contact headline."),
  textRecord("Contact", "Hero", "Headline", "contact.hero.title", "Tell us what your restaurant needs next.", "Main Contact page headline."),
  textRecord("Contact", "Hero", "Intro paragraph", "contact.hero.copy", "Share your goal, challenge, or launch timeline. We will respond with the best starting point.", "Contact hero paragraph."),
  textRecord("Contact", "Form intro", "Section label", "contact.panel.eyebrow", "Start here", "Label above the inquiry panel."),
  textRecord("Contact", "Form intro", "Section headline", "contact.panel.title", "Consultancy inquiry", "Headline above the inquiry panel."),
  textRecord("Contact", "Form intro", "Section paragraph", "contact.panel.copy", "Use the form for launch planning, menu engineering, operations audits, training, brand experience, or cost control support.", "Paragraph beside the contact form."),
  textRecord("Contact", "Form intro", "Best message label", "contact.note.label", "Best first message:", "Label for the contact note."),
  textRecord("Contact", "Form intro", "Best message guidance", "contact.note.copy", "Tell us your restaurant type, location, current challenge, and ideal timeline.", "Guidance shown below the direct contact details."),
  textRecord("Contact", "Form", "Submit button", "contact.form.submit", "Send inquiry", "Contact form submit button label."),
  textRecord("Contact", "Form", "Submitting button", "contact.form.submitting", "Sending...", "Contact form button label while sending."),
  textRecord("Contact", "Form", "Success message", "contact.form.success", "Thank you. Your inquiry has been received and TableCraft Solutions will follow up.", "Message shown after a contact submission succeeds."),

  textRecord("Dashboard", "Hero", "Eyebrow", "dashboard.hero.eyebrow", "Dashboard", "Small label above the dashboard headline."),
  textRecord("Dashboard", "Hero", "Headline", "dashboard.hero.title", "TableCraft account workspace", "Dashboard hero headline."),
  textRecord("Dashboard", "Hero", "Intro paragraph", "dashboard.hero.copy", "Admins manage learning resources, access, and site text. Users can save a profile and download approved staff-training materials.", "Dashboard hero paragraph."),
  textRecord("Dashboard", "Content manager", "Panel label", "dashboard.content.eyebrow", "Site content", "Label above the admin content manager."),
  textRecord("Dashboard", "Content manager", "Panel headline", "dashboard.content.title", "Site Content Manager", "Admin content manager headline."),
  textRecord("Dashboard", "Content manager", "Panel guidance", "dashboard.content.copy", "Edit the wording visitors see across the public pages. Use the page tabs, search, and reset controls to work quickly without touching code.", "Guidance shown inside the admin content manager."),

  textRecord("Footer", "CTA", "Section label", "shared.cta.eyebrow", "Ready for a sharper operation?", "Label above the shared call-to-action band."),
  textRecord("Footer", "CTA", "Section headline", "shared.cta.title", "Let us build the restaurant system behind your next stage.", "Headline in the shared call-to-action band."),
  textRecord("Footer", "CTA", "Button label", "shared.cta.button", "Start a conversation", "Button label in the shared call-to-action band.")
];

export function mergeSiteTextRecords(storedRecords: SiteTextRecord[] | null | undefined) {
  if (!storedRecords?.length) return defaultSiteTextRecords;
  return defaultSiteTextRecords.map((defaultRecord) => {
    const stored = storedRecords.find((record) => record.key === defaultRecord.key || record.id === defaultRecord.id);
    return stored ? { ...defaultRecord, value: stored.value } : defaultRecord;
  });
}

export function editableText(key: string, fallback: string) {
  const value = resolveSiteText(key);
  return value || fallback;
}
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
