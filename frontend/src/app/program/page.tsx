import type { Metadata } from "next";
import Image from "next/image";
import { ArrowDown, Lightbulb, Network, ShieldCheck } from "lucide-react";
import { AspirationCta } from "@/components/aspiration-cta";
import { ProgramShowcase } from "@/components/program-showcase";
import { getProfile, getPrograms } from "@/lib/api";
import {
  campaignManifesto,
  campaignStory,
  movementComparison,
  strategicProfessions,
} from "@/lib/campaign-content";
import { localizePrograms } from "@/lib/i18n";
import { getLocale } from "@/lib/locale-server";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "HMI: Creative Minority",
  description:
    "Gagasan Creative Minority dan Lima Pilar Modernisasi HMI Yusuf Sugiyarto.",
};
export default async function ProgramPage() {
  const locale = await getLocale();
  const [profile, rawPrograms] = await Promise.all([
    getProfile(),
    getPrograms(),
  ]);
  const programs = localizePrograms(rawPrograms, locale);
  const professions =
    locale === "id"
      ? strategicProfessions
      : [
          "Scientists",
          "Technocrats",
          "Public Officials",
          "Entrepreneurs",
          "Physicians",
          "Academics / Practitioners",
          "Journalists",
          "Judges",
        ];
  const comparison =
    locale === "id"
      ? movementComparison
      : [
          {
            label: "Orientation",
            statusQuo: "Positions that change from one term to the next",
            creativeMinority: "Ideas capable of enduring across generations",
          },
          {
            label: "Type of influence",
            statusQuo: "Structural influence based mainly on authority",
            creativeMinority:
              "Intellectual influence that informs public policy and development",
          },
          {
            label: "Organizational character",
            statusQuo: "Maintaining an established position",
            creativeMinority: "Creating new answers to contemporary challenges",
          },
        ];
  const manifesto =
    locale === "id"
      ? campaignManifesto
      : [
          "Modernity is not a threat to HMI, but a new space in which its values can find contemporary forms of service. Becoming modern does not mean abandoning identity.",
          "HMI’s success is not measured merely by how many members hold office, but by how deeply its ideas and values influence public policy and national development.",
          "The responsibility of today’s generation is not only to keep HMI alive, but to ensure it remains relevant as an intellectual, moral, and social force capable of answering contemporary challenges.",
        ];
  return (
    <>
      <section className="page-hero compact">
        <div className="container centered">
          <span className="eyebrow">HMI: Creative Minority</span>
          <h1>
            {locale === "id"
              ? "Modernitas tanpa kehilangan identitas."
              : "Modernity without losing identity."}
          </h1>
          <p>
            {locale === "id"
              ? "Menghubungkan idealisme dengan inovasi, nilai dengan solusi, serta ilmu dengan pengabdian bagi umat dan bangsa."
              : "Connecting idealism with innovation, values with solutions, and knowledge with service to society and the nation."}
          </p>
          <a className="button program-hero-button" href="#lima-pilar">
            {locale === "id"
              ? "Jelajahi lima pilar"
              : "Explore the five pillars"}{" "}
            <ArrowDown aria-hidden="true" size={18} />
          </a>
        </div>
      </section>

      <section className="section campaign-story-section">
        <div className="container campaign-story-heading">
          <span className="eyebrow">
            {locale === "id"
              ? "Dari warisan menuju jawaban zaman"
              : "From legacy to contemporary answers"}
          </span>
          <h2>
            {locale === "id"
              ? "Menjaga nilai, membaca tantangan, memproduksi arah."
              : "Preserving values, understanding challenges, shaping direction."}
          </h2>
          <p>
            {locale === "id"
              ? profile.vision
              : "Build HMI as a creative minority: a modern intellectual, moral, and social force that remains rooted in its Islamic and Indonesian identity."}
          </p>
        </div>
        <div className="container campaign-story-grid">
          {[
            [
              "01",
              locale === "id" ? "Warisan" : "Legacy",
              campaignStory.heritage,
            ],
            [
              "02",
              locale === "id" ? "Tantangan" : "Challenge",
              campaignStory.challenge,
            ],
            ["03", locale === "id" ? "Solusi" : "Answer", campaignStory.answer],
          ].map(([number, title, copy]) => (
            <article key={title}>
              <span>{number}</span>
              <h3>{title}</h3>
              <p>{copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section movement-shift-section">
        <div className="container movement-shift-layout">
          <div className="movement-shift-heading">
            <span className="eyebrow">
              {locale === "id"
                ? "Pergeseran orientasi"
                : "A shift in orientation"}
            </span>
            <h2>
              {locale === "id"
                ? "Dari organisasi status quo menjadi creative minority."
                : "From a status-quo organization to a creative minority."}
            </h2>
            <p>
              {locale === "id"
                ? "Perubahan dimulai ketika organisasi tidak berhenti pada posisi, tetapi konsisten menghasilkan gagasan dan pengaruh intelektual."
                : "Change begins when an organization looks beyond positions and consistently produces ideas and intellectual influence."}
            </p>
          </div>
          <div
            className="movement-comparison"
            role="table"
            aria-label={
              locale === "id"
                ? "Perbandingan orientasi organisasi"
                : "Comparison of organizational orientations"
            }
          >
            <div className="movement-comparison-head" role="row">
              <span role="columnheader">
                {locale === "id" ? "Dimensi" : "Dimension"}
              </span>
              <span role="columnheader">Status quo</span>
              <span role="columnheader">Creative minority</span>
            </div>
            {comparison.map((row) => (
              <div
                className="movement-comparison-row"
                role="row"
                key={row.label}
              >
                <strong role="rowheader">{row.label}</strong>
                <p role="cell">{row.statusQuo}</p>
                <p role="cell">{row.creativeMinority}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="campaign-image-break container">
        <div className="campaign-image-frame">
          <Image
            src="/images/profile/yusuf-gerakan-aksi4.webp"
            alt="Yusuf Sugiyarto berada di tengah ruang gerakan dan dialog"
            fill
            sizes="(max-width: 900px) 100vw, 1180px"
          />
          <div>
            <span className="eyebrow">Dari gagasan menuju gerakan</span>
            <p>
              Modernitas tidak menghapus identitas; ia memperluas cara nilai
              perjuangan hadir dan memberi manfaat.
            </p>
          </div>
        </div>
      </section>

      <section className="section middle-class-section">
        <div className="container middle-class-layout">
          <div className="middle-class-copy">
            <span className="middle-class-icon" aria-hidden="true">
              <Network size={28} />
            </span>
            <span className="eyebrow">
              {locale === "id"
                ? "Kelas menengah transformatif"
                : "Transformative middle class"}
            </span>
            <h2>
              {locale === "id"
                ? "Setiap profesi adalah ruang pengabdian."
                : "Every profession is a field of service."}
            </h2>
            <p>
              {locale === "id"
                ? "HMI perlu melahirkan kader yang tidak hanya berhasil secara individual, tetapi mengisi ruang strategis kehidupan dengan kompetensi, integritas, gagasan, dan orientasi pengabdian."
                : "HMI must develop members who not only succeed individually, but also bring competence, integrity, ideas, and a service orientation into strategic areas of public life."}
            </p>
          </div>
          <div className="profession-system">
            <div className="profession-center" aria-hidden="true">
              <span>{locale === "id" ? "Kelas" : "Middle"}</span>
              <strong>{locale === "id" ? "Menengah" : "Class"}</strong>
            </div>
            <ul
              className="profession-orbit"
              aria-label="Ruang profesi strategis yang membentuk kelas menengah transformatif"
            >
              {professions.map((profession) => (
                <li key={profession}>{profession}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section
        className="section program-showcase-section"
        aria-labelledby="program-title"
        id="lima-pilar"
      >
        <div className="container program-showcase-heading">
          <span className="eyebrow">
            {locale === "id"
              ? "Lima Pilar Modernisasi HMI"
              : "Five Pillars of HMI Modernization"}
          </span>
          <h2 id="program-title">
            {locale === "id"
              ? "Lima jalan perubahan yang saling menguatkan."
              : "Five mutually reinforcing paths to change."}
          </h2>
          <p>
            {locale === "id"
              ? "Modernisasi diwujudkan melalui teknologi, jejaring, kaderisasi, kepemimpinan, dan tata kelola yang tetap berakar pada nilai HMI."
              : "Modernization is advanced through technology, networks, member development, leadership, and governance rooted in HMI’s values."}
          </p>
        </div>
        <ProgramShowcase programs={programs} locale={locale} />
      </section>

      <section className="section campaign-manifesto-section">
        <div className="container campaign-manifesto-layout">
          <div className="campaign-manifesto-heading">
            <span className="eyebrow">Ikhtiar satu generasi</span>
            <h2>Relevan sebagai kekuatan intelektual, moral, dan sosial.</h2>
            <div className="campaign-manifesto-icons" aria-hidden="true">
              <Lightbulb />
              <ShieldCheck />
            </div>
          </div>
          <div className="campaign-manifesto-copy">
            {manifesto.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
      </section>
      <section className="campaign-verse-section campaign-verse-closing">
        <div className="container campaign-verse">
          <span className="campaign-verse-mark" aria-hidden="true">
            “
          </span>
          <blockquote>
            {locale === "id"
              ? campaignStory.scripture
              : "And those who strive for Us—We will surely guide them to Our ways."}
          </blockquote>
          <cite>{campaignStory.scriptureSource}</cite>
        </div>
      </section>
      <AspirationCta locale={locale} />
    </>
  );
}
