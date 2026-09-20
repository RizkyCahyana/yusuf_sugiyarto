"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Languages } from "lucide-react";
import { localeLabels, type Locale } from "@/lib/i18n";
import { setLanguage } from "@/app/actions/set-language";

export function LanguageToggle({ locale }: { locale: Locale }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function select(nextLocale: Locale) {
    if (nextLocale === locale) return;
    startTransition(async () => {
      await setLanguage(nextLocale);
      router.refresh();
    });
  }

  return (
    <div
      className="language-toggle"
      data-locale={locale}
      role="group"
      aria-label={locale === "id" ? "Pilih bahasa" : "Choose language"}
    >
      <Languages size={16} aria-hidden="true" />
      {(Object.keys(localeLabels) as Locale[]).map((item) => (
        <button
          key={item}
          type="button"
          onClick={() => select(item)}
          aria-pressed={locale === item}
          aria-label={localeLabels[item].name}
          disabled={isPending}
        >
          {localeLabels[item].short}
        </button>
      ))}
    </div>
  );
}
