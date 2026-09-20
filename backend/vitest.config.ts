import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
    env: {
      DATABASE_URL: "postgresql://test:test@localhost:5432/test",
      AUTH_SECRET: "test-auth-secret-with-at-least-32-characters",
      RATE_LIMIT_SALT: "test-rate-limit-salt-value",
      FRONTEND_URL: "http://localhost:3000",
      NODE_ENV: "test",
    },
  },
});
