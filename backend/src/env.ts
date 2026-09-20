import { z } from "zod";

const trustProxySchema = z
  .string()
  .default("false")
  .transform((value, ctx): boolean | number | string[] => {
    const normalized = value.trim().toLowerCase();
    if (normalized === "false" || normalized === "0") return false;
    if (/^[1-9]$|^10$/.test(normalized)) return Number(normalized);
    if (normalized === "true") {
      ctx.addIssue({
        code: "custom",
        message:
          "TRUST_PROXY harus berupa jumlah hop 1-10 atau CIDR tepercaya.",
      });
      return z.NEVER;
    }
    const proxies = value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
    if (proxies.length === 0) {
      ctx.addIssue({ code: "custom", message: "TRUST_PROXY tidak valid." });
      return z.NEVER;
    }
    return proxies;
  });

const schema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  PORT: z.coerce.number().int().min(1).max(65535).default(4000),
  HOST: z.string().default("0.0.0.0"),
  DATABASE_URL: z.string().min(1),
  AUTH_SECRET: z.string().min(32),
  RATE_LIMIT_SALT: z.string().min(16),
  FRONTEND_URL: z.string().url().default("http://localhost:3000"),
  TRUST_PROXY: trustProxySchema,
});

export const env = schema.parse(process.env);
