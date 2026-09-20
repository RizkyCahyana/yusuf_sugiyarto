import { cookies } from "next/headers";
import type { Locale } from "./i18n";

export async function getLocale(): Promise<Locale> {
  const value = (await cookies()).get("yusuf-site-language")?.value;
  return value === "en" ? "en" : "id";
}
