export type Education = {
  id?: string;
  institution: string;
  major: string;
  startYear: number;
  endYear?: number | null;
  description?: string | null;
};
export type WorkExperience = {
  id?: string;
  company: string;
  position: string;
  location?: string | null;
  startDate: string;
  endDate?: string | null;
  description: string;
};
export type OrganizationExperience = {
  id?: string;
  organization: string;
  position: string;
  startDate: string;
  endDate?: string | null;
  description: string;
};
export type Profile = {
  fullName: string;
  headline: string;
  tagline: string;
  about: string;
  vision: string;
  missions: string[];
  photoUrl?: string | null;
  achievements: string[];
  softSkills: string[];
  hardSkills: string[];
  education: Education[];
  workHistory: WorkExperience[];
  organizations: OrganizationExperience[];
};
export type Program = {
  id?: string;
  slug: string;
  title: string;
  eyebrow: string;
  problem: string;
  objective: string;
  description: string;
  actionPlan: string[];
  indicators: string[];
};
export type Contact = {
  id?: string;
  type:
    | "EMAIL"
    | "PHONE"
    | "ADDRESS"
    | "INSTAGRAM"
    | "TIKTOK"
    | "FACEBOOK"
    | "X"
    | "LINKEDIN";
  label: string;
  value: string;
  url?: string | null;
};
