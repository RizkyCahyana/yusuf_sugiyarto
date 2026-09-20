"use server";

import { cookies } from "next/headers";
import type { Locale } from "@/lib/i18n";

export async function setLanguage(locale: Locale) {
  if (locale !== "id" && locale !== "en") return;
  (await cookies()).set("yusuf-site-language", locale, {
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 365,
    path: "/",
  });
}
