import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import type { ContactPayload } from "./validation";

export type ContactSubmission = ContactPayload & {
  id: string;
  createdAt: string;
};

const storePath = resolve(process.cwd(), "data", "contact-submissions.json");

async function readSubmissions(): Promise<ContactSubmission[]> {
  try {
    const raw = await readFile(storePath, "utf8");
    return JSON.parse(raw) as ContactSubmission[];
  } catch (error) {
    const code = (error as NodeJS.ErrnoException).code;
    if (code === "ENOENT") return [];
    throw error;
  }
}

export async function listContactSubmissions(): Promise<ContactSubmission[]> {
  const submissions = await readSubmissions();
  return submissions.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function saveContactSubmission(payload: ContactPayload): Promise<ContactSubmission> {
  const submissions = await readSubmissions();
  const submission: ContactSubmission = {
    ...payload,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString()
  };

  submissions.push(submission);
  await mkdir(dirname(storePath), { recursive: true });
  await writeFile(storePath, `${JSON.stringify(submissions, null, 2)}\n`, "utf8");
  return submission;
}
