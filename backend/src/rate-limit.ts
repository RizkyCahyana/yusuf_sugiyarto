import type { FastifyReply } from "fastify";
import { db } from "./db.js";

type BucketRow = { count: number; resetAt: Date };

export async function enforceDistributedRateLimit(
  key: string,
  limit: number,
  windowSeconds: number,
  reply: FastifyReply,
) {
  // Test doubles and local tooling may not expose the raw-query API. The
  // Fastify in-process limiter remains active in that case.
  if (typeof (db as { $queryRaw?: unknown }).$queryRaw !== "function") return;
  const rows = await db.$queryRaw<BucketRow[]>`
    INSERT INTO "RateLimitBucket" ("key", "count", "resetAt", "updatedAt")
    VALUES (${key}, 1, NOW() + (${windowSeconds} * INTERVAL '1 second'), NOW())
    ON CONFLICT ("key") DO UPDATE SET
      "count" = CASE
        WHEN "RateLimitBucket"."resetAt" <= NOW() THEN 1
        ELSE "RateLimitBucket"."count" + 1
      END,
      "resetAt" = CASE
        WHEN "RateLimitBucket"."resetAt" <= NOW()
          THEN NOW() + (${windowSeconds} * INTERVAL '1 second')
        ELSE "RateLimitBucket"."resetAt"
      END,
      "updatedAt" = NOW()
    RETURNING "count", "resetAt"
  `;
  const bucket = rows[0];
  if (!bucket || bucket.count <= limit) return;
  const retryAfter = Math.max(
    1,
    Math.ceil((bucket.resetAt.getTime() - Date.now()) / 1000),
  );
  reply.header("Retry-After", retryAfter);
  return reply.code(429).send({
    error: "Terlalu banyak permintaan. Silakan coba lagi nanti.",
  });
}
