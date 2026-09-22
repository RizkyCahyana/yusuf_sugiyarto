import { buildApp, cleanupExpiredSessions } from "./app.js";
import { env } from "./env.js";

const app = await buildApp();
try {
  await cleanupExpiredSessions();
} catch (error) {
  app.log.warn(
    { err: error },
    "Initial session cleanup skipped; the scheduled cleanup will retry.",
  );
}
await app.listen({ port: env.PORT, host: env.HOST });

const sessionCleanupTimer = setInterval(
  () => {
    cleanupExpiredSessions().catch(() => {
      // Cleanup is best effort; requests must remain available if the database
      // is briefly unavailable. The next scheduled run retries it.
    });
  },
  60 * 60 * 1000,
);
sessionCleanupTimer.unref();
