import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { ProgramIcon } from "./program-icon";
import type { Program } from "@/lib/types";
import type { Locale } from "@/lib/i18n";

export function ProgramCard({
  program,
  index,
  locale = "id",
}: {
  program: Program;
  index: number;
  locale?: Locale;
}) {
  return (
    <article className="program-card">
      <div className="program-number" aria-hidden="true">
        0{index + 1}
      </div>
      <div className="icon-box">
        <ProgramIcon slug={program.slug} />
      </div>
      <span className="eyebrow">{program.eyebrow}</span>
      <h3>{program.title}</h3>
      <p>{program.objective}</p>
      <Link href={`/program/${program.slug}`} className="text-link">
        {locale === "id" ? "Selengkapnya" : "Learn more"}{" "}
        <ChevronRight aria-hidden="true" size={18} />
      </Link>
    </article>
  );
}
