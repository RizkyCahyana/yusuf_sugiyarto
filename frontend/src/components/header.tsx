"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { AskaraLogo } from "./askara-logo";
import { LanguageToggle } from "./language-toggle";
import type { Locale } from "@/lib/i18n";

export function Header({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const links = [
    { href: "/", label: locale === "id" ? "Beranda" : "Home" },
    { href: "/profile", label: locale === "id" ? "Profil" : "Profile" },
    { href: "/program", label: locale === "id" ? "Program" : "Programs" },
    { href: "/kontak", label: locale === "id" ? "Kontak" : "Contact" },
  ];

  return (
    <header className="site-header">
      <div className="container nav-wrap">
        <Link
          href="/"
          className="brand"
          aria-label={`Yusuf Sugiyarto, ${locale === "id" ? "beranda" : "home"}`}
        >
          <AskaraLogo className="brand-logo" markOnly />
          <span>
            <strong>Yusuf Sugiyarto</strong>
            <small>
              {locale === "id"
                ? "Calon Ketua Umum PB HMI"
                : "Candidate for PB HMI Chairperson"}
            </small>
          </span>
        </Link>
        <button
          className="menu-button"
          type="button"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-controls="main-nav"
          aria-label={
            open
              ? locale === "id"
                ? "Tutup menu"
                : "Close menu"
              : locale === "id"
                ? "Buka menu"
                : "Open menu"
          }
        >
          {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>
        <nav
          id="main-nav"
          className={open ? "nav open" : "nav"}
          aria-label={locale === "id" ? "Navigasi utama" : "Main navigation"}
        >
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className={pathname === link.href ? "active" : ""}
              aria-current={pathname === link.href ? "page" : undefined}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/aspirasi"
            onClick={() => setOpen(false)}
            className="button button-sm"
          >
            {locale === "id" ? "Sampaikan Aspirasi" : "Share Your Voice"}
          </Link>
          <LanguageToggle locale={locale} />
        </nav>
      </div>
    </header>
  );
}
