"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Eye, Facebook, Instagram, Music2 } from "lucide-react";
import { fallbackContacts } from "@/lib/fallback-data";
import type { Contact } from "@/lib/types";
import { AskaraLogo } from "./askara-logo";
import type { Locale } from "@/lib/i18n";

const TRAFFIC_SESSION_KEY = "yusuf-site-visit-counted";
let trafficRequest: Promise<{ total: string }> | null = null;

function loadTraffic() {
  if (trafficRequest) return trafficRequest;

  const alreadyCounted = sessionStorage.getItem(TRAFFIC_SESSION_KEY) === "1";
  if (!alreadyCounted) sessionStorage.setItem(TRAFFIC_SESSION_KEY, "1");

  trafficRequest = fetch("/api/traffic", {
    method: alreadyCounted ? "GET" : "POST",
    cache: "no-store",
  })
    .then((response) => {
      if (!response.ok) throw new Error("Traffic counter unavailable");
      return response.json() as Promise<{ total: string }>;
    })
    .catch((error) => {
      trafficRequest = null;
      if (!alreadyCounted) sessionStorage.removeItem(TRAFFIC_SESSION_KEY);
      throw error;
    });

  return trafficRequest;
}

function XBrandIcon() {
  return (
    <svg viewBox="0 0 24 24" width="17" height="17" aria-hidden="true">
      <path
        fill="currentColor"
        d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817-5.966 6.817H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.451-6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z"
      />
    </svg>
  );
}

export function Footer({ locale }: { locale: Locale }) {
  const [contacts, setContacts] = useState<Contact[]>(fallbackContacts);
  const [traffic, setTraffic] = useState("0");

  useEffect(() => {
    fetch("/api/contacts")
      .then((response) => (response.ok ? response.json() : null))
      .then((data: Contact[] | null) => data && setContacts(data))
      .catch(() => undefined);
  }, []);

  useEffect(() => {
    queueMicrotask(() => {
      const cached = localStorage.getItem("yusuf-site-traffic-total");
      if (cached && /^\d+$/.test(cached)) setTraffic(cached);
    });
    loadTraffic()
      .then(({ total }) => {
        setTraffic(total);
        localStorage.setItem("yusuf-site-traffic-total", total);
      })
      .catch(() => undefined);
  }, []);

  const number = new Intl.NumberFormat(
    locale === "id" ? "id-ID" : "en-US",
  ).format(BigInt(traffic));

  return (
    <>
      <footer className="footer">
        <div className="container footer-shell">
          <div className="footer-grid">
            <div>
              <AskaraLogo className="footer-logo" />
              <h2>HMI: Creative Minority.</h2>
              <p>
                {locale === "id"
                  ? "Modernitas tanpa kehilangan identitas—menghubungkan nilai, gagasan, dan pengabdian untuk umat serta bangsa."
                  : "Modernity without losing identity—connecting values, ideas, and service for society and the nation."}
              </p>
              <div
                className="footer-traffic"
                role="status"
                aria-atomic="true"
                aria-label={`${number} ${locale === "id" ? "total kunjungan" : "total visits"}`}
              >
                <Eye size={16} aria-hidden="true" />
                <span>
                  {locale === "id" ? "Total kunjungan" : "Total visits"}
                </span>
                <strong>{number}</strong>
              </div>
            </div>
            <div>
              <h3>{locale === "id" ? "Navigasi" : "Navigation"}</h3>
              <Link href="/profile">
                {locale === "id" ? "Profil" : "Profile"}
              </Link>
              <Link href="/program">
                {locale === "id" ? "Program" : "Programs"}
              </Link>
              <Link href="/kontak">
                {locale === "id" ? "Kontak" : "Contact"}
              </Link>
              <Link href="/aspirasi">
                {locale === "id" ? "Aspirasi" : "Your Voice"}
              </Link>
              <button
                type="button"
                className="footer-welcome-link"
                onClick={() => window.dispatchEvent(new Event("open-welcome"))}
              >
                {locale === "id" ? "Baca sambutan" : "Read welcome note"}
              </button>
            </div>
            <div>
              <h3>
                {locale === "id" ? "Ruang Kolaborasi" : "Collaboration Space"}
              </h3>
              <p>
                {locale === "id"
                  ? "Terbuka untuk dialog, pertukaran gagasan, dan kerja bersama yang bertolak dari kebutuhan kader serta masyarakat."
                  : "Open to dialogue, exchange of ideas, and collaboration grounded in the needs of members and communities."}
              </p>
              <div className="footer-contact-list">
                {contacts
                  .filter((contact) =>
                    ["PHONE", "EMAIL", "ADDRESS"].includes(contact.type),
                  )
                  .map((contact) => (
                    <a
                      key={`${contact.type}-${contact.value}`}
                      className="footer-contact"
                      href={contact.url || "#"}
                      target={
                        contact.url?.startsWith("http") ? "_blank" : undefined
                      }
                      rel="noreferrer"
                    >
                      <span>{contact.label}</span>
                      <strong>{contact.value}</strong>
                    </a>
                  ))}
              </div>
              <div
                className="footer-socials"
                aria-label={locale === "id" ? "Media sosial" : "Social media"}
              >
                <a
                  href="https://www.facebook.com/YusufSugiyarto"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Facebook"
                >
                  <Facebook size={17} aria-hidden="true" />
                </a>
                <a
                  href="https://www.instagram.com/yusufsgy/"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Instagram"
                >
                  <Instagram size={17} aria-hidden="true" />
                </a>
                <a href="#" aria-label="X">
                  <XBrandIcon />
                </a>
                <a href="#" aria-label="TikTok">
                  <Music2 size={17} aria-hidden="true" />
                </a>
              </div>
            </div>
          </div>
          <div className="footer-bottom" aria-hidden="true" />
        </div>
      </footer>
      <div className="footer-dock" aria-label="Informasi situs">
        <AskaraLogo className="footer-dock-logo" markOnly />
        <div>
          <strong>Yusuf Sugiyarto</strong>
          <span>Creative Minority</span>
        </div>
        <span className="footer-dock-year">© {new Date().getFullYear()}</span>
      </div>
    </>
  );
}
