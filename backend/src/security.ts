import { createHash, randomBytes } from "node:crypto";
import { env } from "./env.js";

export const hashToken = (value: string) =>
  createHash("sha256").update(`${env.AUTH_SECRET}:${value}`).digest("hex");
export const hashIdentifier = (value: string) =>
  createHash("sha256").update(`${env.RATE_LIMIT_SALT}:${value}`).digest("hex");
export const newSessionToken = () => randomBytes(32).toString("base64url");
export const newReferenceNumber = () =>
  `ASP-${new Date().getFullYear()}-${randomBytes(5).toString("hex").toUpperCase()}`;

export function normalizeText(value: string) {
  return value.normalize("NFKC").replace(/\s+/g, " ").trim();
}

export function escapeCsvFormula(value: unknown) {
  if (value === null || value === undefined) return "";
  const text = value instanceof Date ? value.toISOString() : String(value);
  // Spreadsheet juga dapat mengabaikan spasi/tab awal sebelum formula.
  return /^[\t\r\n ]*[=+\-@]/.test(text) ? `'${text}` : text;
}

export function csvCell(value: unknown) {
  return `"${escapeCsvFormula(value).replace(/"/g, '""')}"`;
}
