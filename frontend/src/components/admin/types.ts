export type Status = "BARU" | "DIBACA" | "DIPROSES" | "SELESAI" | "ARSIP";
export type DashboardData = {
  counts: { total: number; baru: number; diproses: number; selesai: number };
  byCategory: Array<{
    category: string;
    _count: number | { _all?: number; category?: number };
  }>;
  recent: Array<{
    id: string;
    referenceNumber: string;
    subject: string;
    category: string;
    status: Status;
    createdAt: string;
  }>;
};
export type Program = {
  id: string;
  slug: string;
  title: string;
  eyebrow: string;
  problem: string;
  objective: string;
  description: string;
  actionPlan: string[];
  indicators: string[];
  sortOrder: number;
  isPublished: boolean;
};
export type Organization = {
  id: string;
  organization: string;
  position: string;
  startDate: string;
  endDate: string | null;
  description: string;
  sortOrder: number;
  isPublished: boolean;
};
export type Contact = {
  id: string;
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
  url: string | null;
  isPublic: boolean;
  sortOrder: number;
};
export type Profile = {
  fullName: string;
  headline: string;
  tagline: string;
  about: string;
  vision: string;
  missions: string[];
  photoUrl: string | null;
  achievements: string[];
  softSkills: string[];
  hardSkills: string[];
};
export type Aspiration = {
  id: string;
  referenceNumber: string;
  name: string;
  email: string | null;
  phone: string | null;
  region: string | null;
  branch: string;
  category: string;
  subject: string;
  message: string;
  status: Status;
  adminNote: string | null;
  createdAt: string;
  updatedAt: string;
};
