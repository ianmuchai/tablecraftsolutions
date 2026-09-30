export type TrainingOption = {
  mode: "In-person" | "Virtual";
  title: string;
  summary: string;
  bestFor: string[];
};

export type LearningResource = {
  title: string;
  format: string;
  summary: string;
};

export type LearningHub = {
  title: string;
  summary: string;
  features: string[];
};

export type ExcellenceFocusArea = {
  title: string;
  summary: string;
};

export type Service = {
  slug: string;
  title: string;
  eyebrow: string;
  summary: string;
  description: string;
  outcomes: string[];
  deliverables: string[];
  trainingOptions?: TrainingOption[];
  learningResources?: LearningResource[];
  learningHub?: LearningHub;
  excellenceFocusAreas?: ExcellenceFocusArea[];
};

export type CaseStudy = {
  slug: string;
  title: string;
  category: string;
  summary: string;
  metrics: string[];
};

export type Insight = {
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  readTime: string;
  body: string[];
};

export type Testimonial = {
  quote: string;
  name: string;
  role: string;
};

export type CompanyProfile = {
  incorporation: {
    status: string;
    note: string;
  };
  leadership: {
    founder: string;
    ceo: string;
    note: string;
  };
};

export const companyProfile: CompanyProfile = {
  incorporation: {
    status: "Incorporated in 2018",
    note:
      "TableCraft Solutions was incorporated in 2018 to help hospitality operators build stronger standards, practical systems, and consistent service excellence."
  },
  leadership: {
    founder: "Farhan Dahir",
    ceo: "Farhan Dahir",
    note:
      "Farhan Dahir is the Founder and CEO of TableCraft Solutions, bringing vast hospitality industry experience and a hands-on understanding of restaurant standards, systems, staff development, and operational excellence."
  }
};

export const services: Service[] = [
  {
    slug: "restaurant-launch",
    title: "Restaurant Launch",
    eyebrow: "Concept to opening night",
    summary: "Launch new restaurants with a clear concept, practical numbers, trained teams, and opening systems.",
    description:
      "We shape the concept, guest journey, operating model, launch calendar, and pre-opening controls so your restaurant opens with confidence instead of guesswork.",
    outcomes: ["Sharper market positioning", "Launch budget clarity", "Opening team readiness"],
    deliverables: ["Concept blueprint", "Opening checklist", "Pre-opening training plan", "Supplier and workflow guidance"]
  },
  {
    slug: "menu-engineering",
    title: "Menu Engineering",
    eyebrow: "Profit by design",
    summary: "Turn your menu into a profitable sales tool through pricing, layout, costing, and item performance analysis.",
    description:
      "We evaluate contribution margins, guest behavior, category balance, language, and visual hierarchy to make the menu easier to sell and easier to operate.",
    outcomes: ["Improved gross margin", "Clearer menu navigation", "Better item mix"],
    deliverables: ["Menu profitability matrix", "Pricing recommendations", "Menu architecture", "Item action plan"]
  },
  {
    slug: "operations-audits",
    title: "Operations Audits",
    eyebrow: "Find the leaks",
    summary: "Diagnose service, kitchen, purchasing, inventory, and management routines that quietly reduce performance.",
    description:
      "Our audit follows the service from prep to close, revealing the daily patterns that affect speed, quality, cost control, and guest satisfaction.",
    outcomes: ["Lower operational waste", "Cleaner handoffs", "More consistent service"],
    deliverables: ["Operational scorecard", "Priority action map", "Workflow recommendations", "Management cadence"]
  },
  {
    slug: "staff-training",
    title: "Staff Training",
    eyebrow: "Teams that deliver",
    summary: "Equip front-of-house and back-of-house teams with service standards, selling habits, and operating discipline.",
    description:
      "We create practical training that matches your restaurant format, from service language and upselling to station readiness and shift leadership.",
    outcomes: ["More confident teams", "Consistent guest experience", "Stronger shift accountability"],
    deliverables: ["Training modules", "Service standards", "Role checklists", "Manager coaching tools"],
    trainingOptions: [
      {
        mode: "In-person",
        title: "On-site practical training",
        summary:
          "Hands-on sessions delivered inside the restaurant so teams can rehearse service standards, station flow, guest recovery, and shift routines in the actual operating environment.",
        bestFor: ["New openings", "Service culture resets", "Kitchen and floor workflow coaching"]
      },
      {
        mode: "Virtual",
        title: "Remote guided training",
        summary:
          "Live online sessions and guided assignments for managers and distributed teams that need structured learning without pausing daily operations.",
        bestFor: ["Manager refreshers", "Multi-branch alignment", "Follow-up coaching after audits"]
      }
    ],
    excellenceFocusAreas: [
      {
        title: "Service Delivery Excellence",
        summary:
          "Tailored training to ensure top-tier guest experiences and operational consistency across every shift."
      },
      {
        title: "Mentorship & Leadership Development",
        summary:
          "Guidance that grows staff into dependable supervisors, confident shift leaders, and future restaurant managers."
      },
      {
        title: "Growth & Popularity Strategies",
        summary:
          "Innovative ideas and practical tools to increase restaurant visibility, strengthen reputation, and grow the customer base."
      },
      {
        title: "Boosting Productivity & Profitability",
        summary:
          "Performance routines and streamlined systems that increase output, reduce waste, and maximize returns."
      }
    ],
    learningResources: [
      {
        title: "Service Standards Playbook",
        format: "Downloadable guide",
        summary: "A practical reference for greeting, table touchpoints, upselling language, guest recovery, and closing routines."
      },
      {
        title: "Shift Briefing Templates",
        format: "Manager toolkit",
        summary: "Structured briefing sheets that help supervisors align teams before service and review performance after close."
      },
      {
        title: "Menu Knowledge Cards",
        format: "Training cards",
        summary: "Simple prompts that help servers explain dishes, allergens, pairings, and profitable recommendations with confidence."
      }
    ],
    learningHub: {
      title: "TableCraft Learning Hub",
      summary:
        "A staff-training resource area for standards, systems, and excellence materials that can support onboarding, refresher training, and manager-led learning.",
      features: ["Training pathways by role", "Resource library for managers", "Progress checklists and coaching prompts"]
    }
  },
  {
    slug: "brand-guest-experience",
    title: "Brand & Guest Experience",
    eyebrow: "Memorable hospitality",
    summary: "Align your brand promise, space, menu, staff language, and guest touchpoints into one memorable experience.",
    description:
      "We connect identity to execution, ensuring the feeling guests receive is intentional from discovery to payment and return visits.",
    outcomes: ["Stronger guest recall", "Consistent brand delivery", "Better repeat behavior"],
    deliverables: ["Experience map", "Brand touchpoint review", "Guest journey standards", "Service language guide"]
  },
  {
    slug: "cost-control",
    title: "Cost Control",
    eyebrow: "Protect the margin",
    summary: "Build purchasing, inventory, recipe costing, and reporting habits that protect margins without reducing quality.",
    description:
      "We help restaurants understand where money disappears and install practical controls that teams can actually maintain.",
    outcomes: ["Reduced food cost variance", "Better stock visibility", "Cleaner reporting"],
    deliverables: ["Cost control dashboard", "Recipe costing templates", "Inventory rhythm", "Variance action plan"]
  }
];

export const caseStudies: CaseStudy[] = [
  {
    slug: "bistro-menu-reset",
    title: "Neighborhood Bistro Menu Reset",
    category: "Menu Engineering",
    summary: "A crowded menu was rebuilt around contribution margin, prep capacity, and stronger guest navigation.",
    metrics: ["18% increase in average gross margin", "22 low-performing items retired", "4-week rollout"]
  },
  {
    slug: "quick-service-launch",
    title: "Quick-Service Launch System",
    category: "Restaurant Launch",
    summary: "A first-time operator moved from concept to opening with supplier controls, staffing plans, and day-one service routines.",
    metrics: ["Opened on planned date", "32 team members trained", "96% opening checklist completion"]
  },
  {
    slug: "hotel-restaurant-audit",
    title: "Hotel Restaurant Operations Audit",
    category: "Operations Audits",
    summary: "A full-service outlet improved shift readiness, purchasing discipline, and guest recovery workflows.",
    metrics: ["14% waste reduction", "11 recurring workflow gaps resolved", "2-point guest rating lift"]
  }
];

export const insights: Insight[] = [
  {
    slug: "menu-is-a-management-tool",
    title: "Your Menu Is a Management Tool, Not Just a List",
    category: "Menu Strategy",
    excerpt: "The best menus guide guest choice, protect kitchen flow, and make margin visible to the operator.",
    readTime: "4 min read",
    body: [
      "A profitable menu is built from decisions about capacity, pricing, contribution margin, and guest behavior. It should help the team sell confidently and help the kitchen execute consistently.",
      "When restaurants treat the menu as a management tool, item performance becomes easier to review. Leaders can see what deserves promotion, what needs re-costing, and what should leave the offer.",
      "The goal is not a smaller menu for its own sake. The goal is a menu where every item earns its place."
    ]
  },
  {
    slug: "opening-with-systems",
    title: "Opening Strong Starts Before Opening Week",
    category: "Launch Planning",
    excerpt: "A good launch is less about last-minute energy and more about rehearsed systems, ownership, and controls.",
    readTime: "5 min read",
    body: [
      "The strongest openings have a simple truth in common: the restaurant rehearsed before guests arrived. That means tested stations, trained service language, clear procurement, and visible accountability.",
      "Opening week exposes every weak handoff. A launch plan gives teams the rhythm to spot issues early and fix them before they become the guest's problem.",
      "A restaurant can still feel warm and human while being operationally disciplined. In fact, discipline is what creates the room for hospitality."
    ]
  },
  {
    slug: "cost-control-habits",
    title: "Cost Control Is a Weekly Habit",
    category: "Profitability",
    excerpt: "Margins improve when ordering, receiving, waste tracking, and recipe costing become part of the weekly rhythm.",
    readTime: "3 min read",
    body: [
      "Cost control is not a spreadsheet someone opens at the end of the month. It is a rhythm of small decisions: what to buy, what to prep, what to portion, and what to investigate.",
      "The restaurants that protect margin best make variance visible quickly. They do not wait for a financial statement to discover a preventable leak.",
      "Controls only work when teams understand them. Simple tools used every week beat complex tools ignored under pressure."
    ]
  }
];

export const testimonials: Testimonial[] = [
  {
    quote: "TableCraft helped us see the restaurant like operators, not just owners. The menu changes paid for themselves quickly.",
    name: "Amina Patel",
    role: "Founder, Nairobi Bistro"
  },
  {
    quote: "The launch plan gave our managers confidence. Everyone knew what mattered before the doors opened.",
    name: "Daniel Otieno",
    role: "Managing Partner, Hearth & Grain"
  },
  {
    quote: "Their audit was practical. No theory for theory's sake, just clear priorities we could act on immediately.",
    name: "Mercy Wanjala",
    role: "Operations Lead, Urban Plate"
  }
];



