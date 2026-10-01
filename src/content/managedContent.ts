import type { CaseStudy, Service } from "../types";

export const customServicesStorageKey = "tablecraft_custom_services";
export const customCaseStudiesStorageKey = "tablecraft_custom_case_studies";

function normaliseSlug(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/&/g, " ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function serviceSlugFromTitle(title: string) {
  return normaliseSlug(title) || `managed-item-${Date.now()}`;
}

function mergeBySlug<T extends { slug: string }>(defaults: T[], managed: T[] = []) {
  const map = new Map(defaults.map((item) => [item.slug, item]));
  const order = defaults.map((item) => item.slug);

  for (const item of managed) {
    const slug = normaliseSlug(item.slug);
    if (!slug) continue;
    const nextItem = { ...item, slug };
    if (!map.has(slug)) order.push(slug);
    map.set(slug, nextItem);
  }

  return order.map((slug) => map.get(slug)).filter(Boolean) as T[];
}

export function mergeManagedServices(defaultServices: Service[], managedServices: Service[] = []) {
  return mergeBySlug(defaultServices, managedServices);
}

export function mergeManagedCaseStudies(defaultCaseStudies: CaseStudy[], managedCaseStudies: CaseStudy[] = []) {
  return mergeBySlug(defaultCaseStudies, managedCaseStudies);
}

function readStoredList<T>(key: string): T[] {
  if (typeof window === "undefined") return [];
  const stored = window.localStorage.getItem(key);
  if (!stored) return [];

  try {
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? (parsed as T[]) : [];
  } catch {
    return [];
  }
}

export function readManagedServices(defaultServices: Service[]) {
  return mergeManagedServices(defaultServices, readStoredList<Service>(customServicesStorageKey));
}

export function readManagedCaseStudies(defaultCaseStudies: CaseStudy[]) {
  return mergeManagedCaseStudies(defaultCaseStudies, readStoredList<CaseStudy>(customCaseStudiesStorageKey));
}
