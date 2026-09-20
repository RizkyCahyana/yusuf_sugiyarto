import { z } from "zod";
import { normalizeText } from "./security.js";

const text = (min: number, max: number) =>
  z.string().transform(normalizeText).pipe(z.string().min(min).max(max));
export const aspirationSchema = z
  .object({
    name: text(2, 100),
    email: z.string().trim().toLowerCase().email().max(160).min(1),
    phone: z
      .string()
      .trim()
      .regex(
        /^08\d{8,13}$/,
        "Nomor WhatsApp harus diawali 08 dan berisi 10–15 angka.",
      ),
    region: text(2, 100),
    branch: text(2, 120),
    category: z.enum([
      "Kaderisasi",
      "SDM",
      "Organisasi & Transparansi",
      "Jaringan",
      "Sosial",
      "Kritik & Saran",
      "Lainnya",
    ]),
    subject: text(5, 150),
    message: text(20, 5000),
    consent: z.literal(true),
    website: z.string().max(0).optional(),
    startedAt: z.number().int().positive(),
  })
  .strict()
  .superRefine((data, ctx) => {
    if (Date.now() - data.startedAt < 2500)
      ctx.addIssue({
        code: "custom",
        path: ["startedAt"],
        message: "Form dikirim terlalu cepat.",
      });
  });

export const loginSchema = z
  .object({
    // The admin UI accepts the configured short username ("admin") as well
    // as a normal email address. Password strength is enforced by the seed
    // configuration for production accounts.
    email: z.string().trim().toLowerCase().min(1).max(160),
    password: z.string().min(1).max(200),
  })
  .strict();

export const programSchema = z
  .object({
    slug: z
      .string()
      .trim()
      .toLowerCase()
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
      .max(100),
    title: text(2, 120),
    eyebrow: text(2, 120),
    problem: text(10, 2000),
    objective: text(10, 2000),
    description: text(10, 4000),
    actionPlan: z.array(text(2, 300)).min(1).max(12),
    indicators: z.array(text(2, 300)).min(1).max(12),
    sortOrder: z.number().int().min(0).max(1000),
    isPublished: z.boolean(),
  })
  .strict();

export const contactSchema = z
  .object({
    type: z.enum([
      "EMAIL",
      "PHONE",
      "ADDRESS",
      "INSTAGRAM",
      "TIKTOK",
      "FACEBOOK",
      "X",
      "LINKEDIN",
    ]),
    label: text(2, 60),
    value: text(2, 200),
    url: z.string().trim().url().max(500).nullable().optional(),
    isPublic: z.boolean(),
    sortOrder: z.number().int().min(0).max(1000),
  })
  .strict();

export const organizationSchema = z
  .object({
    organization: text(2, 160),
    position: text(2, 120),
    startDate: z.coerce.date(),
    endDate: z.coerce.date().nullable().optional(),
    description: text(5, 2000),
    sortOrder: z.number().int().min(0).max(1000),
    isPublished: z.boolean(),
  })
  .strict()
  .refine((v) => !v.endDate || v.endDate >= v.startDate, {
    path: ["endDate"],
    message: "Tanggal selesai harus setelah tanggal mulai.",
  });

export const profileSchema = z
  .object({
    fullName: text(2, 100),
    headline: text(2, 160),
    tagline: text(2, 160),
    about: text(20, 5000),
    vision: text(20, 3000),
    missions: z.array(text(3, 500)).min(1).max(10),
    photoUrl: z.string().max(500).nullable().optional(),
    achievements: z.array(text(2, 300)).max(20),
    softSkills: z.array(text(2, 80)).max(30),
    hardSkills: z.array(text(2, 80)).max(30),
  })
  .strict();

export const statusSchema = z
  .object({
    status: z.enum(["BARU", "DIBACA", "DIPROSES", "SELESAI", "ARSIP"]),
  })
  .strict();
export const noteSchema = z
  .object({
    adminNote: z
      .string()
      .transform(normalizeText)
      .pipe(z.string().max(3000))
      .nullable(),
  })
  .strict();
const dateOnly = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Gunakan format tanggal YYYY-MM-DD.")
  .transform((value, ctx) => {
    const date = new Date(`${value}T00:00:00.000Z`);
    if (
      Number.isNaN(date.getTime()) ||
      date.toISOString().slice(0, 10) !== value
    ) {
      ctx.addIssue({ code: "custom", message: "Tanggal tidak valid." });
      return z.NEVER;
    }
    return date;
  });

export const aspirationFilterSchema = z
  .object({
    status: z
      .enum(["BARU", "DIBACA", "DIPROSES", "SELESAI", "ARSIP"])
      .optional(),
    category: z.string().trim().max(80).optional(),
    branch: z.string().trim().max(120).optional(),
    q: z.string().trim().max(150).optional(),
    dateFrom: dateOnly.optional(),
    dateTo: dateOnly.optional(),
  })
  .strict()
  .refine(
    ({ dateFrom, dateTo }) => !dateFrom || !dateTo || dateFrom <= dateTo,
    { path: ["dateTo"], message: "dateTo harus sama atau setelah dateFrom." },
  );

export const aspirationQuerySchema = aspirationFilterSchema.extend({
  page: z.coerce.number().int().min(1).max(100_000).default(1),
});
