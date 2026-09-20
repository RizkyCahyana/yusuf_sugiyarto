import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { AspirationCta } from "@/components/aspiration-cta";
import { ProgramCard } from "@/components/program-card";
import { getProfile, getPrograms } from "@/lib/api";
import { localizePrograms } from "@/lib/i18n";
import { getLocale } from "@/lib/locale-server";

export const revalidate = 60;

export default async function Home() {
  const locale = await getLocale();
  const [profile, rawPrograms] = await Promise.all([
    getProfile(),
    getPrograms(),
  ]);
  const programs = localizePrograms(rawPrograms, locale);
  return (
    <>
      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-copy">
            <span className="eyebrow">
              {locale === "id"
                ? "Calon Ketua Umum PB HMI"
                : "Candidate for PB HMI Chairperson"}
            </span>
            <h1>{profile.fullName}</h1>
            <p className="hero-tagline">{profile.tagline}</p>
            <p className="hero-lead">
              {locale === "id"
                ? "Modernitas tanpa kehilangan identitas. Menghadirkan gagasan, integritas, dan kepemimpinan yang berdampak bagi umat dan bangsa."
                : "Modernity without losing identity. Advancing ideas, integrity, and leadership that create meaningful impact for society and the nation."}
            </p>
            <div className="button-row">
              <Link href="/program" className="button">
                {locale === "id" ? "Lihat Program" : "Explore Programs"}{" "}
                <ArrowRight aria-hidden="true" size={19} />
              </Link>
              <Link href="/aspirasi" className="button button-secondary">
                {locale === "id" ? "Sampaikan Aspirasi" : "Share Your Voice"}
              </Link>
            </div>
            {/* <div className="hero-note">
              <span>01</span>
              <p>Terus belajar, meneliti, dan bertumbuh bersama organisasi.</p>
            </div> */}
          </div>
          <div className="hero-visual">
            <div className="photo-frame">
              <Image
                src={profile.photoUrl || "/images/yusuf-sugiyarto.jpg"}
                alt={`Potret ${profile.fullName}`}
                width={800}
                height={1000}
                priority
                sizes="(max-width: 800px) 90vw, 42vw"
              />
            </div>
            <div className="quote-card">
              <strong>Yusuf Sugiyarto</strong>
              <span>
                {locale === "id"
                  ? "Calon Ketua Umum PB HMI"
                  : "Candidate for PB HMI Chairperson"}
              </span>
            </div>
          </div>
        </div>
      </section>
      <section
        className="home-photo-section"
        aria-labelledby="home-photo-title"
      >
        <div className="container">
          <div className="home-photo-heading">
            <div>
              <span className="eyebrow">
                {locale === "id"
                  ? "Hadir dan bekerja bersama"
                  : "Present and working together"}
              </span>
              <h2 id="home-photo-title">
                {locale === "id"
                  ? "Gagasan tumbuh dari ruang nyata."
                  : "Ideas grow through real engagement."}
              </h2>
            </div>
            <p>
              {locale === "id"
                ? "Potret perjalanan organisasi, ruang dialog, dan pengabdian yang membentuk arah perjuangan."
                : "Moments of organizational work, dialogue, and public service that shape a shared direction."}
            </p>
          </div>
          <div className="home-photo-grid">
            {[
              ["/images/home-gallery/yusuf-aksi.jpg", "Merawat gerakan"],
              ["/images/home-gallery/yusuf-pemateri.webp", "Berbagi gagasan"],
              ["/images/home-gallery/yusuf-pelantikan.webp", "Menjaga amanah"],
              [
                "/images/home-gallery/yusuf-aksi-4.jpg",
                "Hadir untuk masyarakat",
              ],
            ].map(([src, caption], index) => (
              <figure
                className={`home-photo-card home-photo-card-${index + 1}`}
                key={src}
              >
                <Image
                  src={src}
                  alt={caption}
                  fill
                  sizes="(max-width: 650px) 100vw, (max-width: 900px) 50vw, 33vw"
                />
                <figcaption>{caption}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>
      <section className="section home-profile-section">
        <div className="container home-profile-layout">
          <div className="home-profile-intro">
            <span className="eyebrow">
              {locale === "id"
                ? "Profil dan perjalanan organisasi"
                : "Profile and organizational journey"}
            </span>
            <h2>
              {locale === "id"
                ? "Ditempa oleh ilmu, organisasi, dan pengabdian."
                : "Shaped by learning, organization, and service."}
            </h2>
            <p>{profile.about}</p>
            <Link className="text-link" href="/profile">
              {locale === "id"
                ? "Lihat perjalanan lengkap"
                : "View the full journey"}
              <ArrowRight aria-hidden="true" size={18} />
            </Link>
          </div>
          <div className="home-journey">
            <div className="home-journey-heading">
              <div>
                <span className="eyebrow">
                  {locale === "id" ? "Jejak pengalaman" : "Experience"}
                </span>
                <h3>
                  {locale === "id"
                    ? "Perjalanan yang membentuk gagasan."
                    : "A journey that shaped the vision."}
                </h3>
              </div>
            </div>
            <div className="home-achievement-list">
              {profile.achievements.map((item, index) => (
                <article className="home-achievement-item" key={item}>
                  <span className="home-achievement-number" aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <p>{item}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>
      <section className="section home-vision-section">
        <div className="container">
          <div className="home-vision-panel">
            <div className="home-vision-copy">
              <span className="home-vision-mark" aria-hidden="true">
                “
              </span>
              <span className="eyebrow">
                {locale === "id" ? "Arah perjuangan" : "Strategic direction"}
              </span>
              <h2>{profile.vision}</h2>
              <p>
                {locale === "id"
                  ? "Lima pilar modernisasi menerjemahkan gagasan besar menjadi perubahan organisasi yang nyata dan dapat dikerjakan bersama."
                  : "Five modernization pillars translate a shared vision into tangible organizational change."}
              </p>
            </div>
            <ol className="home-mission-grid">
              {profile.missions.map((mission, index) => (
                <li key={`${mission}-${index}`}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <p>{mission}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>
      <section className="section home-program-section">
        <div className="container home-program-layout">
          <div className="home-program-intro">
            <span className="eyebrow">
              {locale === "id"
                ? "Lima pilar modernisasi HMI"
                : "Five pillars of HMI modernization"}
            </span>
            <h2>
              {locale === "id"
                ? "Modern, adaptif, dan tetap berakar pada identitas."
                : "Modern, adaptive, and firmly rooted in identity."}
            </h2>
            <p>
              {locale === "id"
                ? "Agenda transformasi untuk menjawab disrupsi teknologi, perubahan ekonomi, krisis kepemimpinan, dan kebutuhan kader hari ini."
                : "A transformation agenda addressing technological disruption, economic change, leadership challenges, and today’s member needs."}
            </p>
            <Link className="text-link" href="/program">
              {locale === "id"
                ? "Jelajahi seluruh program"
                : "Explore all programs"}
              <ArrowRight aria-hidden="true" size={18} />
            </Link>
          </div>
          <div className="program-grid home-program-grid">
            {programs.map((program, index) => (
              <ProgramCard
                key={program.slug}
                program={program}
                index={index}
                locale={locale}
              />
            ))}
          </div>
        </div>
      </section>
      <AspirationCta locale={locale} />
    </>
  );
}
