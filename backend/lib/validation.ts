export type ContactPayload = {
  name: string;
  email: string;
  phone: string;
  company: string;
  service: string;
  message: string;
};

export type ValidationResult =
  | { valid: true; value: ContactPayload }
  | { valid: false; errors: string[] };

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const clean = (value: unknown) => (typeof value === "string" ? value.trim() : "");

export function validateContactPayload(payload: unknown): ValidationResult {
  const record = payload && typeof payload === "object" ? (payload as Record<string, unknown>) : {};
  const value: ContactPayload = {
    name: clean(record.name),
    email: clean(record.email),
    phone: clean(record.phone),
    company: clean(record.company),
    service: clean(record.service),
    message: clean(record.message)
  };
  const errors: string[] = [];

  if (!value.name) errors.push("Name is required.");
  if (!emailPattern.test(value.email)) errors.push("A valid email is required.");
  if (!value.service) errors.push("Service interest is required.");
  if (!value.message) errors.push("Message is required.");

  return errors.length ? { valid: false, errors } : { valid: true, value };
}
