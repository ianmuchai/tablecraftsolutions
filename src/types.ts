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

export type ManagedLearningResource = LearningResource & {
  id: string;
  fileName: string;
  downloadUrl: string;
  audience: string;
  uploadedAt: string;
};

export type LearningResourceAccessRule = {
  id: string;
  resourceId: string;
  scope: "all" | "email" | "domain";
  value: string;
  enabled: boolean;
};

export type SiteTextRecord = {
  id: string;
  page: string;
  label: string;
  key: string;
  value: string;
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

export type ContactPayload = {
  name: string;
  email: string;
  phone: string;
  company: string;
  service: string;
  message: string;
};

export type ContactSubmission = ContactPayload & {
  id: string;
  createdAt: string;
};

export type ContactResponse = {
  message: string;
  submission: {
    id: string;
    createdAt: string;
  };
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

export type DashboardSummary = {
  generatedAt: string;
  totals: {
    services: number;
    caseStudies: number;
    insights: number;
    testimonials: number;
    submissions: number;
  };
  recentSubmissions: ContactSubmission[];
  serviceDemand: Array<{
    slug: string;
    title: string;
    inquiries: number;
  }>;
};

export type AdminSession =
  | { authenticated: false }
  | { authenticated: true; role: "admin"; name: string };

export type AdminLoginPayload = {
  username: string;
  password: string;
};

export type DashboardUserAccount = DashboardUserProfile & {
  id: string;
  createdAt: string;
};
export type DashboardUserSession = {
  authenticated: true;
  name: string;
  firstName: string;
  email: string;
};
export type DashboardUserProfile = {
  role: "user";
  name: string;
  email: string;
  password?: string;
  company: string;
  serviceInterest: string;
  notes: string;
};
