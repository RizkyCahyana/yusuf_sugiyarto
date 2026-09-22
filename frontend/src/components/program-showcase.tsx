"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, ChevronRight } from "lucide-react";
import { ProgramIcon } from "./program-icon";
import type { Program } from "@/lib/types";
import type { Locale } from "@/lib/i18n";

export function ProgramShowcase({
  programs,
  locale = "id",
}: {
  programs: Program[];
  locale?: Locale;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const activeIndexRef = useRef(0);
  const trackWidthRef = useRef(0);
  const [activeIndex, setActiveIndex] = useState(0);

  const updateControls = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const cards = Array.from(
      track.querySelectorAll<HTMLElement>(".program-showcase-card"),
    );
    const trackCenter = track.scrollLeft + track.clientWidth / 2;
    const nextIndex = cards.reduce((closest, card, index) => {
      const cardCenter = card.offsetLeft + card.offsetWidth / 2;
      const closestCard = cards[closest];
      const closestCenter = closestCard
        ? closestCard.offsetLeft + closestCard.offsetWidth / 2
        : Number.POSITIVE_INFINITY;
      return Math.abs(cardCenter - trackCenter) <
        Math.abs(closestCenter - trackCenter)
        ? index
        : closest;
    }, 0);
    activeIndexRef.current = nextIndex;
    setActiveIndex(nextIndex);
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    updateControls();
    trackWidthRef.current = track.clientWidth;
    track.addEventListener("scroll", updateControls, { passive: true });
    const resizeObserver = new ResizeObserver(([entry]) => {
      const nextWidth = entry.contentRect.width;
      if (Math.abs(nextWidth - trackWidthRef.current) < 1) return;
      trackWidthRef.current = nextWidth;
      track.style.scrollBehavior = "auto";
      const activeCard = track.querySelectorAll<HTMLElement>(
        ".program-showcase-card",
      )[activeIndexRef.current];
      if (activeCard)
        track.scrollLeft =
          activeCard.offsetLeft -
          (track.clientWidth - activeCard.offsetWidth) / 2;
      track.style.removeProperty("scroll-behavior");
      updateControls();
    });
    resizeObserver.observe(track);
    return () => {
      track.removeEventListener("scroll", updateControls);
      resizeObserver.disconnect();
    };
  }, [updateControls]);

  function scrollToProgram(index: number, behavior?: ScrollBehavior) {
    const track = trackRef.current;
    if (!track) return;
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const safeIndex = Math.min(programs.length - 1, Math.max(0, index));
    const target = track.querySelectorAll<HTMLElement>(
      ".program-showcase-card",
    )[safeIndex];
    if (!target) return;
    const nextLeft =
      target.offsetLeft - (track.clientWidth - target.offsetWidth) / 2;
    if (behavior === "auto" || reducedMotion) {
      track.style.scrollBehavior = "auto";
      track.scrollLeft = nextLeft;
      track.style.removeProperty("scroll-behavior");
      return;
    }
    track.scrollTo({
      left: nextLeft,
      behavior: "smooth",
    });
  }

  function move(direction: -1 | 1, behavior?: ScrollBehavior) {
    const track = trackRef.current;
    if (!track) return;
    scrollToProgram(activeIndexRef.current + direction, behavior);
  }

  if (!programs.length) {
    return (
      <div className="program-showcase-empty">
        <h3>
          {locale === "id"
            ? "Program sedang disiapkan."
            : "Programs are being prepared."}
        </h3>
        <p>
          {locale === "id"
            ? "Program yang dipublikasikan melalui halaman admin akan tampil di sini."
            : "Programs published through the administration page will appear here."}
        </p>
      </div>
    );
  }

  return (
    <div
      className="program-showcase"
      role="region"
      aria-roledescription="carousel"
      aria-label={
        locale === "id" ? "Program Yusuf Sugiyarto" : "Yusuf Sugiyarto programs"
      }
    >
      <div className="program-showcase-stage">
        {programs.length > 1 && (
          <button
            type="button"
            className="program-swipe-button program-swipe-button-previous"
            onClick={() => move(-1)}
            disabled={activeIndex === 0}
            aria-label={
              locale === "id"
                ? "Lihat program sebelumnya"
                : "View previous program"
            }
          >
            <ArrowLeft aria-hidden="true" size={24} />
          </button>
        )}

        <div
          ref={trackRef}
          className="program-showcase-track"
          aria-label={
            locale === "id"
              ? "Daftar program, geser ke kiri atau kanan untuk melihat program lainnya"
              : "Program list; swipe left or right to explore"
          }
          tabIndex={0}
          onKeyDown={(event) => {
            if (event.key === "ArrowLeft") {
              event.preventDefault();
              move(-1, "auto");
            }
            if (event.key === "ArrowRight") {
              event.preventDefault();
              move(1, "auto");
            }
          }}
        >
          {programs.map((program, index) => {
            return (
              <article
                className="program-showcase-card"
                key={program.slug}
                role="group"
                aria-roledescription="slide"
                aria-label={`${index + 1} dari ${programs.length}: ${program.title}`}
              >
                <div className="program-slide-content">
                  <div className="program-slide-visual" aria-hidden="true">
                    <span className="program-visual-label">
                      {locale === "id"
                        ? "Pilar modernisasi HMI"
                        : "HMI modernization pillar"}
                    </span>
                    <span className="program-showcase-number">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div className="program-showcase-icon">
                      <ProgramIcon slug={program.slug} />
                    </div>
                    <span className="program-visual-line" />
                  </div>
                  <div className="program-slide-copy">
                    <span className="eyebrow">
                      {locale === "id" ? "Program" : "Pillar"}{" "}
                      {String(index + 1).padStart(2, "0")} /{" "}
                      {String(programs.length).padStart(2, "0")}
                    </span>
                    <h3>{program.title}</h3>
                    <p>{program.objective}</p>
                    <Link
                      href={`/program/${program.slug}`}
                      className="text-link"
                    >
                      {locale === "id" ? "Selengkapnya" : "Learn more"}{" "}
                      <ChevronRight aria-hidden="true" size={18} />
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {programs.length > 1 && (
          <button
            type="button"
            className="program-swipe-button program-swipe-button-next"
            onClick={() => move(1)}
            disabled={activeIndex === programs.length - 1}
            aria-label={
              locale === "id" ? "Lihat program berikutnya" : "View next program"
            }
          >
            <ArrowRight aria-hidden="true" size={24} />
          </button>
        )}
      </div>

      {programs.length > 1 && (
        <div
          className="program-showcase-navigation"
          aria-label={
            locale === "id"
              ? "Kontrol geser program"
              : "Program carousel controls"
          }
        >
          <div
            className="program-swipe-pagination"
            aria-label={locale === "id" ? "Pilih program" : "Choose a program"}
          >
            {programs.map((program, index) => (
              <button
                type="button"
                className="program-pagination-dot"
                key={program.slug}
                onClick={() => scrollToProgram(index)}
                aria-label={`${locale === "id" ? "Tampilkan program" : "Show program"} ${index + 1}: ${program.title}`}
                aria-current={activeIndex === index ? "true" : undefined}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
