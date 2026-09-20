import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Check,
  CircleAlert,
  ListChecks,
} from "lucide-react";
import { AspirationCta } from "@/components/aspiration-cta";
import { getProgram, getPrograms } from "@/lib/api";
import { ProgramIcon } from "@/components/program-icon";
import { localizeProgram, localizePrograms } from "@/lib/i18n";
import { getLocale } from "@/lib/locale-server";

export const revalidate = 60;

type Props = { params: Promise<{ slug: string }> };
export async function generateStaticParams() {
  return (await getPrograms()).map(({ slug }) => ({ slug }));
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const item = await getProgram((await params).slug);
  return item
    ? { title: item.title, description: item.objective }
    : { title: "Program tidak ditemukan" };
}
export default async function ProgramDetail({ params }: Props) {
  const locale = await getLocale();
  const { slug } = await params;
  const [rawProgram, rawPrograms] = await Promise.all([
    getProgram(slug),
    getPrograms(),
  ]);
  if (!rawProgram) notFound();
  const program = localizeProgram(rawProgram, locale);
  const programs = localizePrograms(rawPrograms, locale);

  const currentIndex = programs.findIndex((item) => item.slug === program.slug);
  const previousProgram = currentIndex > 0 ? programs[currentIndex - 1] : null;
  const nextProgram =
    currentIndex >= 0 && currentIndex < programs.length - 1
      ? programs[currentIndex + 1]
      : null;
  const programNumber = currentIndex >= 0 ? currentIndex + 1 : 1;

  return (
    <>
      <section className="program-detail-hero">
        <div className="container">
          <nav className="program-breadcrumb" aria-label="Breadcrumb">
            <ol>
              <li>
                <Link href="/">{locale === "id" ? "Beranda" : "Home"}</Link>
              </li>
              <li>
                <Link href="/program">Program</Link>
              </li>
              <li aria-current="page">{program.title}</li>
            </ol>
          </nav>

          <div className="program-detail-hero-grid">
            <div className="program-detail-intro">
              <div className="program-detail-kicker">
                <span aria-hidden="true">
                  {String(programNumber).padStart(2, "0")}
                </span>
                <span className="eyebrow">{program.eyebrow}</span>
              </div>
              <h1>{program.title}</h1>
              <p>{program.description}</p>
              <div className="program-detail-actions">
                <a href="#rencana-aksi" className="button">
                  {locale === "id" ? "Lihat rencana aksi" : "View action plan"}{" "}
                  <ArrowDown aria-hidden="true" size={18} />
                </a>
                <Link href="/program" className="back-link">
                  <ArrowLeft aria-hidden="true" size={18} />{" "}
                  {locale === "id" ? "Semua program" : "All programs"}
                </Link>
              </div>
            </div>

            <aside
              className="program-objective-card"
              aria-labelledby="objective-title"
            >
              <div className="program-detail-icon" aria-hidden="true">
                <ProgramIcon slug={program.slug} />
              </div>
              <span className="eyebrow">
                {locale === "id" ? "Tujuan utama" : "Primary objective"}
              </span>
              <h2 id="objective-title">
                {locale === "id" ? "Arah perubahan" : "Direction for change"}
              </h2>
              <p>{program.objective}</p>
              <div className="program-objective-meta">
                <span>
                  {program.actionPlan.length}{" "}
                  {locale === "id" ? "langkah aksi" : "action steps"}
                </span>
                <span>
                  {program.indicators.length}{" "}
                  {locale === "id" ? "indikator" : "indicators"}
                </span>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section className="program-detail-body" aria-label="Rincian program">
        <div className="container program-detail-layout">
          <div className="program-detail-content">
            <article
              className="program-problem-panel"
              id="latar-belakang"
              aria-labelledby="problem-title"
            >
              <div className="program-section-icon" aria-hidden="true">
                <CircleAlert />
              </div>
              <div>
                <span className="eyebrow">
                  {locale === "id" ? "Latar belakang" : "Background"}
                </span>
                <h2 id="problem-title">
                  {locale === "id"
                    ? "Mengapa program ini penting?"
                    : "Why does this program matter?"}
                </h2>
                <p>{program.problem}</p>
              </div>
            </article>

            <section
              className="program-action-section"
              id="rencana-aksi"
              aria-labelledby="action-title"
            >
              <header className="program-section-heading">
                <div className="program-section-icon" aria-hidden="true">
                  <ListChecks />
                </div>
                <div>
                  <span className="eyebrow">
                    {locale === "id" ? "Rencana aksi" : "Action plan"}
                  </span>
                  <h2 id="action-title">
                    {locale === "id" ? "Langkah konkret" : "Concrete steps"}
                  </h2>
                  <p>
                    {locale === "id"
                      ? "Tahapan kerja yang mengubah tujuan program menjadi aksi yang jelas dan dapat ditindaklanjuti."
                      : "A practical sequence that turns the program’s objectives into clear and actionable work."}
                  </p>
                </div>
              </header>
              <ol className="program-action-list">
                {program.actionPlan.map((item, index) => (
                  <li key={item}>
                    <span className="program-action-number" aria-hidden="true">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <span>
                        {locale === "id" ? "Langkah" : "Step"} {index + 1}
                      </span>
                      <h3>{item}</h3>
                    </div>
                  </li>
                ))}
              </ol>
            </section>

            <section
              className="program-indicator-section"
              id="indikator"
              aria-labelledby="indicator-title"
            >
              <div className="program-indicator-copy">
                <span className="eyebrow">
                  {locale === "id" ? "Indikator" : "Indicators"}
                </span>
                <h2 id="indicator-title">
                  {locale === "id"
                    ? "Ukuran keberhasilan"
                    : "Measures of success"}
                </h2>
                <p>
                  {locale === "id"
                    ? "Dampak program dievaluasi melalui keluaran yang konkret, terukur, dan dapat ditinjau bersama."
                    : "Program impact is evaluated through concrete, measurable outcomes that can be reviewed collectively."}
                </p>
              </div>
              <ul className="program-indicator-list">
                {program.indicators.map((item) => (
                  <li key={item}>
                    <span aria-hidden="true">
                      <Check />
                    </span>
                    <p>{item}</p>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </div>
      </section>

      {(previousProgram || nextProgram) && (
        <nav
          className="container program-pagination"
          aria-label="Program lainnya"
        >
          {previousProgram ? (
            <Link href={`/program/${previousProgram.slug}`}>
              <ArrowLeft aria-hidden="true" />
              <span>
                <small>
                  {locale === "id" ? "Program sebelumnya" : "Previous program"}
                </small>
                <strong>{previousProgram.title}</strong>
              </span>
            </Link>
          ) : (
            <span aria-hidden="true" />
          )}
          {nextProgram ? (
            <Link href={`/program/${nextProgram.slug}`}>
              <span>
                <small>
                  {locale === "id" ? "Program berikutnya" : "Next program"}
                </small>
                <strong>{nextProgram.title}</strong>
              </span>
              <ArrowRight aria-hidden="true" />
            </Link>
          ) : (
            <span aria-hidden="true" />
          )}
        </nav>
      )}
      <AspirationCta locale={locale} />
    </>
  );
}
