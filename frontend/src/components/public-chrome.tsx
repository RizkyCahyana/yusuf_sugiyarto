"use client";

import { usePathname } from "next/navigation";
import { Footer } from "./footer";
import { Header } from "./header";
import { ThemeToggle } from "./theme-toggle";
import { WelcomePopup } from "./welcome-popup";
import type { Locale } from "@/lib/i18n";

export function PublicChrome({
  children,
  locale,
}: {
  children: React.ReactNode;
  locale: Locale;
}) {
  const pathname = usePathname();

  if (pathname.startsWith("/admin")) return children;

  return (
    <>
      <a className="skip-link" href="#main-content">
        {locale === "id" ? "Lewati ke konten" : "Skip to content"}
      </a>
      <Header locale={locale} />
      <main id="main-content">{children}</main>
      <Footer locale={locale} />
      <ThemeToggle />
      <WelcomePopup />
    </>
  );
}
