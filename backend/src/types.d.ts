import "fastify";
import type { Role } from "../generated/prisma/client.js";

declare module "fastify" {
  interface FastifyRequest {
    admin: { id: string; name: string; email: string; role: Role } | null;
  }
}
