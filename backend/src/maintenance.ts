import { db } from "./db.js";

// Jalankan terjadwal setelah kebijakan retensi disetujui. Default 24 bulan.
const retentionMonths = Number(process.env.ASPIRATION_RETENTION_MONTHS ?? 24);
const cutoff = new Date();
cutoff.setMonth(cutoff.getMonth() - retentionMonths);

const result = await db.aspiration.updateMany({
  where: { createdAt: { lt: cutoff }, status: { in: ["SELESAI", "ARSIP"] } },
  data: {
    name: "Data dianonimkan",
    email: null,
    phone: null,
    region: null,
    branch: "Dianonimkan",
    ipHash: null,
    adminNote: null,
  },
});

const expiredSessions = await db.session.deleteMany({
  where: { expiresAt: { lt: new Date() } },
});

const expiredRateLimitBuckets = await db.rateLimitBucket.deleteMany({
  where: { resetAt: { lt: new Date() } },
});

console.log(`${result.count} aspirasi lama dianonimkan.`);
console.log(
  `${expiredSessions.count} sesi dan ${expiredRateLimitBuckets.count} bucket rate limit kedaluwarsa dihapus.`,
);
await db.$disconnect();
