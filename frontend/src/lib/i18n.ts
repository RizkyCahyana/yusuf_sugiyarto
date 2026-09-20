import type { Program } from "./types";

export type Locale = "id" | "en";

export const localeLabels = {
  id: { short: "ID", name: "Bahasa Indonesia" },
  en: { short: "EN", name: "English" },
} as const;

type ProgramTranslation = Pick<
  Program,
  | "title"
  | "eyebrow"
  | "problem"
  | "objective"
  | "description"
  | "actionPlan"
  | "indicators"
>;

const englishPrograms: Record<string, ProgramTranslation> = {
  "transformasi-digital": {
    title: "Digital Transformation",
    eyebrow: "Modernization Pillar",
    problem:
      "Technological disruption is reshaping how people learn, organize, and serve society. HMI must move beyond fragmented technology use toward an integrated digital ecosystem.",
    objective:
      "Build a data- and technology-driven organization so member services become faster, more transparent, and accessible to every branch.",
    description:
      "Build a data- and technology-driven organization so member services become faster, more transparent, and accessible to every branch.",
    actionPlan: [
      "Integrate member data and services",
      "Digitize organizational knowledge and archives",
      "Strengthen digital literacy and cybersecurity",
      "Use technology for collaboration and evidence-based decisions",
    ],
    indicators: [
      "Digital services are used across branches",
      "Organizational knowledge is documented and readily accessible",
      "Strategic decisions are supported by reviewable data",
    ],
  },
  "kolaborasi-nasional-global": {
    title: "National & Global Collaboration",
    eyebrow: "Modernization Pillar",
    problem:
      "Today’s challenges extend beyond branches, disciplines, and national borders. HMI’s network must become an active space for exchanging ideas and delivering joint initiatives.",
    objective:
      "Expand national and global networks to strengthen members’ contribution to the Muslim community, Indonesia, and global development.",
    description:
      "Expand national and global networks to strengthen members’ contribution to the Muslim community, Indonesia, and global development.",
    actionPlan: [
      "Create cross-branch and alumni collaboration forums",
      "Develop partnerships with universities, professional groups, and strategic institutions",
      "Facilitate national and global knowledge exchange",
      "Collaborate on studies of contemporary issues",
    ],
    indicators: [
      "Partner networks remain active and sustainable",
      "Cross-regional programs are delivered",
      "Members’ ideas are represented in national and global forums",
    ],
  },
  "kaderisasi-adaptif": {
    title: "Adaptive Member Development",
    eyebrow: "Modernization Pillar",
    problem:
      "Social, economic, and technological change requires a development system that remains rooted in values while responding to the needs of a new generation.",
    objective:
      "Deliver relevant and inclusive member development that prepares members to address the real challenges of their time.",
    description:
      "Deliver relevant and inclusive member development that prepares members to address the real challenges of their time.",
    actionPlan: [
      "Map members’ needs and competencies",
      "Renew learning methods with contextual approaches",
      "Develop cross-generational and cross-professional mentoring",
      "Strengthen intellectual traditions and constructive discussion spaces",
    ],
    indicators: [
      "The curriculum responds to contemporary challenges",
      "Participation increases across development levels",
      "Members emerge with strong capabilities and a service orientation",
    ],
  },
  "meritokrasi-kepemimpinan": {
    title: "Leadership Meritocracy",
    eyebrow: "Modernization Pillar",
    problem:
      "Organizational leadership must grow from integrity, capability, a record of service, and the ability to answer challenges—not merely proximity or position.",
    objective:
      "Build fair and transparent leadership succession that places the best members in roles where they can contribute most effectively.",
    description:
      "Build fair and transparent leadership succession that places the best members in roles where they can contribute most effectively.",
    actionPlan: [
      "Establish clear competency and track-record standards",
      "Run transparent leadership selection processes",
      "Create healthy evaluation and feedback mechanisms",
      "Assign responsibilities according to capability and service record",
    ],
    indicators: [
      "Leadership processes are accountable",
      "High-performing members receive meaningful opportunities to grow",
      "A consistent culture of evaluation is established",
    ],
  },
  "profesionalisme-organisasi": {
    title: "Organizational Professionalism",
    eyebrow: "Modernization Pillar",
    problem:
      "A strong legacy of values requires disciplined governance so the organization can work consistently, measurably, and credibly.",
    objective:
      "Strengthen HMI governance so it is effective, transparent, and focused on tangible benefits for members and society.",
    description:
      "Strengthen HMI governance so it is effective, transparent, and focused on tangible benefits for members and society.",
    actionPlan: [
      "Standardize organizational governance and services",
      "Plan programs based on demonstrated needs",
      "Publish transparent performance reporting",
      "Evaluate impact and pursue continuous improvement",
    ],
    indicators: [
      "Programs have clear targets and accountable owners",
      "Organizational performance is properly documented",
      "Trust among members and partners increases",
    ],
  },
};

export function localizeProgram(program: Program, locale: Locale): Program {
  if (locale === "id") return program;
  const translation = englishPrograms[program.slug];
  return translation ? { ...program, ...translation } : program;
}

export const localizePrograms = (programs: Program[], locale: Locale) =>
  programs.map((program) => localizeProgram(program, locale));
