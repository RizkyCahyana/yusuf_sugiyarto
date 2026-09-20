import {
  fallbackContacts,
  fallbackProfile,
  fallbackPrograms,
} from "./fallback-data";
import type { Contact, Profile, Program } from "./types";

const API_URL =
  process.env.API_URL ?? process.env.BACKEND_URL ?? "http://localhost:4000";

async function fetchPublic<T>(path: string, fallback: T): Promise<T> {
  // Keep CI/build independent from backend availability; ISR refreshes from API at runtime.
  if (process.env.NEXT_PHASE === "phase-production-build") return fallback;
  try {
    const response = await fetch(`${API_URL}/api${path}`, {
      cache: "no-store",
    });
    if (!response.ok) return fallback;
    const data = (await response.json()) as T | null;
    return data ?? fallback;
  } catch {
    return fallback;
  }
}

export const getProfile = () =>
  fetchPublic<Profile>("/profile", fallbackProfile);
export const getPrograms = () =>
  fetchPublic<Program[]>("/programs", fallbackPrograms);
export const getContacts = () =>
  fetchPublic<Contact[]>("/contacts", fallbackContacts);
export async function getProgram(slug: string) {
  const fallback =
    fallbackPrograms.find((program) => program.slug === slug) ?? null;
  return fetchPublic<Program | null>(
    `/programs/${encodeURIComponent(slug)}`,
    fallback,
  );
}
