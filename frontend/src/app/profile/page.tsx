import type { Metadata } from "next";
import Image from "next/image";
import {
  CalendarDays,
  Focus,
  GraduationCap,
  MapPin,
  UsersRound,
} from "lucide-react";
import { AspirationCta } from "@/components/aspiration-cta";
import { ProfileGallery } from "@/components/profile-gallery";
import { SectionHeading } from "@/components/section-heading";
import { getProfile } from "@/lib/api";
import { getLocale } from "@/lib/locale-server";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Profil",
  description:
    "Perjalanan pendidikan dan pengalaman organisasi Yusuf Sugiyarto.",
};
const year = (value: string | null | undefined) =>
  value ? new Date(value).getFullYear() : "Sekarang";
const educationPeriod = (
  startYear: number,
  endYear: number | null | undefined,
  major: string,
) => {
  if (major.startsWith("S2") && !startYear && !endYear) return null;
  if (!startYear && endYear) return `Lulus ${endYear}`;
  if (!startYear) return null;
  return `${startYear}—${endYear || "Sekarang"}`;
};

export default async function ProfilePage() {
  const locale = await getLocale();
  const profile = await getProfile();
  return (
    <>
      <section className="page-hero compact">
        <div className="container profile-hero-layout">
          <div className="profile-hero-copy">
            <span className="eyebrow">
              {locale === "id"
                ? "Profil Yusuf Sugiyarto"
                : "Yusuf Sugiyarto’s Profile"}
            </span>
            <h1>
              {locale === "id"
                ? "Belajar memimpin, melayani, dan bertumbuh."
                : "Learning to lead, serve, and grow."}
            </h1>
            <p>
              {locale === "id"
                ? profile.about
                : "Yusuf Sugiyarto believes that life is not merely about reaching a destination, but about developing oneself through knowledge, organization, and service. From Wonogiri to Telkom University, every experience has become an opportunity to learn how to lead, serve, and grow."}
            </p>
            <div className="profile-fact-row" aria-label="Informasi pribadi">
              <span>
                <MapPin aria-hidden="true" size={18} /> Wonogiri, Jawa Tengah
              </span>
              <span>
                <CalendarDays aria-hidden="true" size={18} /> 27 Januari 1997
              </span>
            </div>
          </div>
          <div className="profile-hero-photo">
            <Image
              src="/images/profile/yusuf-formal.webp"
              alt="Potret formal Yusuf Sugiyarto mengenakan jas"
              fill
              priority
              sizes="(max-width: 900px) 100vw, 42vw"
            />
          </div>
        </div>
      </section>
      <section className="section profile-philosophy-section">
        <div className="container">
          <div className="profile-philosophy-panel">
            <div>
              <span className="eyebrow">
                {locale === "id" ? "Falsafah perjalanan" : "Guiding philosophy"}
              </span>
              <h2>Jer Basuki Mawa Bea</h2>
            </div>
            <p>
              {locale === "id"
                ? "Setiap keberhasilan menuntut usaha, ketulusan, dan keberanian untuk terus melangkah. Setiap langkah kecil yang dijalani dengan sungguh-sungguh akan menjadi bagian dari pertumbuhan yang lebih besar."
                : "Every achievement requires effort, sincerity, and the courage to keep moving forward. Each purposeful step becomes part of a larger journey of growth."}
            </p>
            <span className="profile-philosophy-mark" aria-hidden="true">
              YS
            </span>
          </div>
        </div>
      </section>
      <section className="section primary-role-section">
        <div className="container profile-role-interest-grid">
          <div className="primary-role-card">
            <SectionHeading
              eyebrow={
                locale === "id" ? "Amanah saat ini" : "Current responsibility"
              }
              title={profile.headline}
              description={
                locale === "id"
                  ? "Mengawal penelitian, membaca perkembangan zaman, dan menerjemahkan temuan menjadi arah kebijakan strategis bagi organisasi."
                  : "Leading research, interpreting contemporary developments, and translating evidence into strategic policy direction for the organization."
              }
            />
          </div>
          <div className="profile-interest-card">
            <div className="profile-interest-icon" aria-hidden="true">
              <Focus size={22} />
            </div>
            <span className="eyebrow">
              {locale === "id"
                ? "Ketertarikan dan minat"
                : "Interests and focus"}
            </span>
            <h2>
              {locale === "id"
                ? "Isu yang menjadi ruang kontribusi."
                : "Areas for meaningful contribution."}
            </h2>
            <div className="tags">
              {profile.hardSkills.map((interest) => (
                <span key={interest}>{interest}</span>
              ))}
            </div>
          </div>
        </div>
      </section>
      <section className="section muted-section">
        <div className="container two-column profile-overview-grid">
          <div className="profile-overview-column profile-history-panel profile-history-education">
            <div className="profile-history-icon" aria-hidden="true">
              <GraduationCap />
            </div>
            <SectionHeading
              eyebrow={locale === "id" ? "Pendidikan" : "Education"}
              title={
                locale === "id"
                  ? "Fondasi berpikir sistematis."
                  : "A foundation for systematic thinking."
              }
            />
            <div className="profile-history-list profile-education-list">
              {[...profile.education].reverse().map((item, index) => (
                <article
                  className="info-card"
                  key={`${item.institution}-${item.startYear}`}
                >
                  <span className="profile-history-index" aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  {educationPeriod(item.startYear, item.endYear, item.major) ? (
                    <span className="profile-history-date">
                      {educationPeriod(
                        item.startYear,
                        item.endYear,
                        item.major,
                      )}
                    </span>
                  ) : null}
                  <h3>{item.major}</h3>
                  <strong>{item.institution}</strong>
                  <p>{item.description}</p>
                </article>
              ))}
            </div>
          </div>
          <div className="profile-overview-column profile-history-panel profile-history-organization">
            <div className="profile-history-icon" aria-hidden="true">
              <UsersRound />
            </div>
            <SectionHeading
              eyebrow={
                locale === "id"
                  ? "Pengalaman organisasi"
                  : "Organizational experience"
              }
              title={
                locale === "id"
                  ? "Memimpin, belajar, dan bertumbuh bersama organisasi."
                  : "Leading, learning, and growing through organization."
              }
            />
            <div className="timeline profile-timeline">
              {profile.organizations.map((item) => (
                <article key={`${item.organization}-${item.startDate}`}>
                  <span className="timeline-date">
                    {year(item.startDate)} — {year(item.endDate)}
                  </span>
                  <div>
                    <h3>{item.position}</h3>
                    <strong>{item.organization}</strong>
                    <p>{item.description}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>
      <section className="section profile-gallery-section">
        <div className="container profile-gallery-heading">
          <div>
            <span className="eyebrow">
              {locale === "id"
                ? "Dokumentasi perjalanan"
                : "Journey in pictures"}
            </span>
            <h2>
              {locale === "id"
                ? "Hadir, mendengar, dan bergerak bersama."
                : "Being present, listening, and moving forward together."}
            </h2>
          </div>
          <p>
            {locale === "id"
              ? "Perjalanan yang mempertemukan ilmu, persaudaraan, dan pengabdian dalam berbagai ruang kehidupan."
              : "A journey connecting knowledge, solidarity, and service across different walks of life."}
          </p>
        </div>
        <div className="container">
          <ProfileGallery locale={locale} />
        </div>
      </section>
      <AspirationCta locale={locale} />
    </>
  );
}
