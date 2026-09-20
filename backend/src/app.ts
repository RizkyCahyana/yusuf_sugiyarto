import Fastify, {
  type FastifyInstance,
  type FastifyReply,
  type FastifyRequest,
} from "fastify";
import cookie from "@fastify/cookie";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import rateLimit from "@fastify/rate-limit";
import { compare } from "bcryptjs";
import { ZodError } from "zod";
import { db } from "./db.js";
import { env } from "./env.js";
import {
  aspirationQuerySchema,
  aspirationSchema,
  contactSchema,
  loginSchema,
  noteSchema,
  organizationSchema,
  profileSchema,
  programSchema,
  statusSchema,
} from "./schemas.js";
import {
  csvCell,
  hashIdentifier,
  hashToken,
  newReferenceNumber,
  newSessionToken,
} from "./security.js";
import { enforceDistributedRateLimit } from "./rate-limit.js";

const COOKIE = "yusuf_session";
const DUMMY_PASSWORD_HASH =
  "$2b$12$YQfM0xPkdbglQsM7bH6YE.K9jGdmD4e7QViP5vM2PV1qS9yMnbV4W";
const publicProfileInclude = {
  education: { orderBy: { sortOrder: "asc" as const } },
  workHistory: { orderBy: { sortOrder: "asc" as const } },
  organizations: {
    where: { isPublished: true },
    orderBy: { sortOrder: "asc" as const },
  },
};

async function getAdmin(request: FastifyRequest) {
  const token = request.cookies[COOKIE];
  if (!token) return null;
  const session = await db.session.findUnique({
    where: { tokenHash: hashToken(token) },
    include: { user: true },
  });
  if (!session) return null;
  if (session.expiresAt <= new Date()) {
    // Revoke an expired token eagerly; the maintenance job removes the rest.
    await db.session.deleteMany({ where: { tokenHash: hashToken(token) } });
    return null;
  }
  return {
    id: session.user.id,
    name: session.user.name,
    email: session.user.email,
    role: session.user.role,
  };
}

async function requireAdmin(request: FastifyRequest, reply: FastifyReply) {
  request.admin = await getAdmin(request);
  if (!request.admin)
    return reply.code(401).send({ error: "Autentikasi diperlukan." });
}

type AppRole = "ADMIN" | "EDITOR";

function requireRole(...roles: AppRole[]) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    if (!request.admin)
      return reply.code(401).send({ error: "Autentikasi diperlukan." });
    if (!roles.includes(request.admin.role as AppRole))
      return reply.code(403).send({ error: "Akses tidak diizinkan." });
  };
}

type AuditClient = Pick<typeof db, "auditLog">;

async function writeAudit(
  client: AuditClient,
  request: FastifyRequest,
  action: string,
  entityType: string,
  entityId?: string,
  metadata?: object,
) {
  if (!request.admin) return;
  await client.auditLog.create({
    data: { actorId: request.admin.id, action, entityType, entityId, metadata },
  });
}

async function mutateWithAudit<T>(
  request: FastifyRequest,
  action: string,
  entityType: string,
  entityId: string | undefined,
  mutation: (client: typeof db) => Promise<T>,
  metadata?: object,
) {
  if (!request.admin) return mutation(db);
  // Prisma transactions make the domain mutation and its audit trail commit or
  // roll back together. The fallback keeps lightweight unit-test doubles usable.
  if (typeof (db as { $transaction?: unknown }).$transaction !== "function") {
    const result = await mutation(db);
    const resolvedEntityId =
      entityId ??
      (typeof result === "object" && result !== null && "id" in result
        ? String(result.id)
        : undefined);
    await writeAudit(
      db,
      request,
      action,
      entityType,
      resolvedEntityId,
      metadata,
    );
    return result;
  }
  return db.$transaction(async (tx) => {
    const result = await mutation(tx as unknown as typeof db);
    const resolvedEntityId =
      entityId ??
      (typeof result === "object" && result !== null && "id" in result
        ? String(result.id)
        : undefined);
    await writeAudit(
      tx as unknown as AuditClient,
      request,
      action,
      entityType,
      resolvedEntityId,
      metadata,
    );
    return result;
  });
}

export async function cleanupExpiredSessions(now = new Date()) {
  return db.session.deleteMany({ where: { expiresAt: { lt: now } } });
}

function aspirationWhere(
  query: ReturnType<typeof aspirationQuerySchema.parse>,
) {
  const dateToExclusive = query.dateTo
    ? new Date(query.dateTo.getTime() + 24 * 60 * 60 * 1000)
    : undefined;
  return {
    ...(query.status ? { status: query.status } : {}),
    ...(query.category ? { category: query.category } : {}),
    ...(query.branch
      ? {
          branch: {
            contains: query.branch,
            mode: "insensitive" as const,
          },
        }
      : {}),
    ...(query.q
      ? {
          OR: [
            { subject: { contains: query.q, mode: "insensitive" as const } },
            {
              referenceNumber: {
                contains: query.q,
                mode: "insensitive" as const,
              },
            },
            { name: { contains: query.q, mode: "insensitive" as const } },
          ],
        }
      : {}),
    ...(query.dateFrom || dateToExclusive
      ? {
          createdAt: {
            ...(query.dateFrom ? { gte: query.dateFrom } : {}),
            ...(dateToExclusive ? { lt: dateToExclusive } : {}),
          },
        }
      : {}),
  };
}

export async function buildApp(): Promise<FastifyInstance> {
  const app = Fastify({
    logger: env.NODE_ENV !== "test",
    trustProxy: env.TRUST_PROXY as boolean | string | string[],
    bodyLimit: 32_000,
  });
  app.decorateRequest("admin", null);
  await app.register(cookie);
  await app.register(cors, {
    origin: env.FRONTEND_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  });
  await app.register(helmet, { contentSecurityPolicy: false });
  await app.register(rateLimit, {
    global: false,
    max: 100,
    timeWindow: "1 minute",
    keyGenerator: (r) => hashIdentifier(r.ip),
  });
  app.addHook("onRequest", async (request, reply) => {
    if (!["POST", "PUT", "PATCH", "DELETE"].includes(request.method)) return;
    const origin = request.headers.origin;
    if (origin && origin !== env.FRONTEND_URL)
      return reply.code(403).send({ error: "Origin tidak diizinkan." });
  });

  app.setErrorHandler((error, _request, reply) => {
    if (error instanceof ZodError)
      return reply.code(400).send({
        error: "Data tidak valid.",
        fields: error.flatten().fieldErrors,
      });
    if ((error as { code?: string }).code === "P2002")
      return reply.code(409).send({ error: "Data yang sama sudah tersedia." });
    if ((error as { code?: string }).code === "FST_ERR_CTP_EMPTY_JSON_BODY")
      return reply
        .code(400)
        .send({ error: "Body permintaan tidak boleh kosong." });
    const statusCode = (error as { statusCode?: number }).statusCode;
    if (statusCode && statusCode >= 400 && statusCode < 500)
      return reply.code(statusCode).send({
        error:
          statusCode === 429
            ? "Terlalu banyak percobaan. Silakan tunggu sebentar lalu coba lagi."
            : "Permintaan tidak dapat diproses.",
      });
    app.log.error(error);
    return reply.code(500).send({ error: "Terjadi kesalahan pada server." });
  });

  app.get("/health", async () => ({ status: "ok" }));
  app.get("/api/profile", async () =>
    db.profile.findFirst({ include: publicProfileInclude }),
  );
  app.get("/api/programs", async () =>
    db.program.findMany({
      where: { isPublished: true },
      orderBy: { sortOrder: "asc" },
    }),
  );
  app.get<{ Params: { slug: string } }>(
    "/api/programs/:slug",
    async (request, reply) => {
      const program = await db.program.findFirst({
        where: { slug: request.params.slug, isPublished: true },
      });
      return (
        program ?? reply.code(404).send({ error: "Program tidak ditemukan." })
      );
    },
  );
  app.get("/api/contacts", async () =>
    db.contact.findMany({
      where: { isPublic: true },
      orderBy: { sortOrder: "asc" },
    }),
  );

  app.get("/api/traffic", async (_request, reply) => {
    const traffic = await db.siteTraffic.findUnique({
      where: { id: "website" },
      select: { total: true },
    });
    reply.header("Cache-Control", "no-store");
    return { total: (traffic?.total ?? 0n).toString() };
  });

  app.post(
    "/api/traffic",
    { config: { rateLimit: { max: 30, timeWindow: "1 minute" } } },
    async (_request, reply) => {
      const traffic = await db.siteTraffic.upsert({
        where: { id: "website" },
        update: { total: { increment: 1 } },
        create: { id: "website", total: 1 },
        select: { total: true },
      });
      reply.header("Cache-Control", "no-store");
      return { total: traffic.total.toString() };
    },
  );

  app.post(
    "/api/aspirations",
    { config: { rateLimit: { max: 5, timeWindow: "15 minutes" } } },
    async (request, reply) => {
      const limited = await enforceDistributedRateLimit(
        `aspiration:${hashIdentifier(request.ip)}`,
        5,
        15 * 60,
        reply,
      );
      if (limited) return limited;
      const input = aspirationSchema.parse(request.body);
      let referenceNumber = newReferenceNumber();
      for (let attempt = 0; attempt < 3; attempt++) {
        try {
          const result = await db.aspiration.create({
            data: {
              referenceNumber,
              name: input.name,
              email: input.email || null,
              phone: input.phone || null,
              region: input.region || null,
              branch: input.branch,
              category: input.category,
              subject: input.subject,
              message: input.message,
              consent: input.consent,
              ipHash: hashIdentifier(request.ip),
            },
            select: { referenceNumber: true, createdAt: true },
          });
          return reply.code(201).send(result);
        } catch (error) {
          if ((error as { code?: string }).code !== "P2002") throw error;
          referenceNumber = newReferenceNumber();
        }
      }
      return reply.code(503).send({
        error: "Nomor referensi belum dapat dibuat. Silakan coba lagi.",
      });
    },
  );

  app.post(
    "/api/auth/login",
    { config: { rateLimit: { max: 5, timeWindow: "15 minutes" } } },
    async (request, reply) => {
      const limited = await enforceDistributedRateLimit(
        `login:${hashIdentifier(request.ip)}`,
        5,
        15 * 60,
        reply,
      );
      if (limited) return limited;
      const input = loginSchema.parse(request.body);
      const loginEmail =
        input.email === "admin"
          ? (process.env.ADMIN_EMAIL ?? "admin@demo.local")
          : input.email;
      const user = await db.user.findUnique({ where: { email: loginEmail } });
      const passwordValid = await compare(
        input.password,
        user?.passwordHash ?? DUMMY_PASSWORD_HASH,
      );
      if (!user || !passwordValid)
        return reply
          .code(401)
          .send({ error: "Username/email atau kata sandi tidak sesuai." });
      const token = newSessionToken();
      await db.session.create({
        data: {
          tokenHash: hashToken(token),
          userId: user.id,
          expiresAt: new Date(Date.now() + 8 * 60 * 60 * 1000),
        },
      });
      reply.setCookie(COOKIE, token, {
        httpOnly: true,
        secure: env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 8 * 60 * 60,
      });
      return { user: { name: user.name, email: user.email, role: user.role } };
    },
  );
  app.post(
    "/api/auth/logout",
    { preHandler: requireAdmin },
    async (request, reply) => {
      const token = request.cookies[COOKIE];
      if (token)
        await db.session.deleteMany({ where: { tokenHash: hashToken(token) } });
      reply.clearCookie(COOKIE, { path: "/" });
      return reply.code(204).send();
    },
  );
  app.get("/api/auth/session", async (request, reply) => {
    const admin = await getAdmin(request);
    return admin
      ? { user: admin }
      : reply.code(401).send({ error: "Tidak ada sesi aktif." });
  });

  app.register(
    async (admin) => {
      admin.addHook("preHandler", requireAdmin);
      // Every admin endpoint has an explicit role policy. Both roles can
      // operate the CMS; sensitive exports are restricted below to ADMIN.
      admin.addHook("preHandler", requireRole("ADMIN", "EDITOR"));
      admin.get("/dashboard", async () => {
        const [total, baru, diproses, selesai, byCategory, recent] =
          await Promise.all([
            db.aspiration.count(),
            db.aspiration.count({ where: { status: "BARU" } }),
            db.aspiration.count({ where: { status: "DIPROSES" } }),
            db.aspiration.count({ where: { status: "SELESAI" } }),
            db.aspiration.groupBy({
              by: ["category"],
              _count: true,
              orderBy: { _count: { category: "desc" } },
            }),
            db.aspiration.findMany({
              take: 5,
              orderBy: { createdAt: "desc" },
              select: {
                id: true,
                referenceNumber: true,
                subject: true,
                category: true,
                status: true,
                createdAt: true,
              },
            }),
          ]);
        return {
          counts: { total, baru, diproses, selesai },
          byCategory,
          recent,
        };
      });
      admin.get("/profile", async () =>
        db.profile.findFirst({
          include: {
            ...publicProfileInclude,
            organizations: { orderBy: { sortOrder: "asc" } },
          },
        }),
      );
      admin.put("/profile", async (request) => {
        const input = profileSchema.parse(request.body);
        const current = await db.profile.findFirst();
        return mutateWithAudit(
          request,
          "UPDATE",
          "Profile",
          current?.id,
          (client) =>
            current
              ? client.profile.update({
                  where: { id: current.id },
                  data: input,
                })
              : client.profile.create({ data: input }),
        );
      });

      admin.get("/programs", async () =>
        db.program.findMany({ orderBy: { sortOrder: "asc" } }),
      );
      admin.post("/programs", async (request, reply) => {
        const result = await mutateWithAudit(
          request,
          "CREATE",
          "Program",
          undefined,
          (client) =>
            client.program.create({ data: programSchema.parse(request.body) }),
        );
        return reply.code(201).send(result);
      });
      admin.put<{ Params: { id: string } }>("/programs/:id", async (request) =>
        mutateWithAudit(
          request,
          "UPDATE",
          "Program",
          request.params.id,
          (client) =>
            client.program.update({
              where: { id: request.params.id },
              data: programSchema.parse(request.body),
            }),
        ),
      );
      admin.delete<{ Params: { id: string } }>(
        "/programs/:id",
        async (request, reply) => {
          await mutateWithAudit(
            request,
            "DELETE",
            "Program",
            request.params.id,
            (client) =>
              client.program.delete({ where: { id: request.params.id } }),
          );
          return reply.code(204).send();
        },
      );

      admin.get("/contacts", async () =>
        db.contact.findMany({ orderBy: { sortOrder: "asc" } }),
      );
      admin.post("/contacts", async (request, reply) => {
        const result = await mutateWithAudit(
          request,
          "CREATE",
          "Contact",
          undefined,
          (client) =>
            client.contact.create({ data: contactSchema.parse(request.body) }),
        );
        return reply.code(201).send(result);
      });
      admin.put<{ Params: { id: string } }>("/contacts/:id", async (request) =>
        mutateWithAudit(
          request,
          "UPDATE",
          "Contact",
          request.params.id,
          (client) =>
            client.contact.update({
              where: { id: request.params.id },
              data: contactSchema.parse(request.body),
            }),
        ),
      );
      admin.delete<{ Params: { id: string } }>(
        "/contacts/:id",
        async (request, reply) => {
          await mutateWithAudit(
            request,
            "DELETE",
            "Contact",
            request.params.id,
            (client) =>
              client.contact.delete({ where: { id: request.params.id } }),
          );
          return reply.code(204).send();
        },
      );

      admin.get("/organizations", async () =>
        db.organizationExperience.findMany({ orderBy: { sortOrder: "asc" } }),
      );
      admin.post("/organizations", async (request, reply) => {
        const profile = await db.profile.findFirstOrThrow();
        const result = await mutateWithAudit(
          request,
          "CREATE",
          "OrganizationExperience",
          undefined,
          (client) =>
            client.organizationExperience.create({
              data: {
                ...organizationSchema.parse(request.body),
                profileId: profile.id,
              },
            }),
        );
        return reply.code(201).send(result);
      });
      admin.put<{ Params: { id: string } }>(
        "/organizations/:id",
        async (request) =>
          mutateWithAudit(
            request,
            "UPDATE",
            "OrganizationExperience",
            request.params.id,
            (client) =>
              client.organizationExperience.update({
                where: { id: request.params.id },
                data: organizationSchema.parse(request.body),
              }),
          ),
      );
      admin.delete<{ Params: { id: string } }>(
        "/organizations/:id",
        async (request, reply) => {
          await mutateWithAudit(
            request,
            "DELETE",
            "OrganizationExperience",
            request.params.id,
            (client) =>
              client.organizationExperience.delete({
                where: { id: request.params.id },
              }),
          );
          return reply.code(204).send();
        },
      );

      admin.get<{
        Querystring: {
          page?: string;
          status?: string;
          category?: string;
          branch?: string;
          q?: string;
          dateFrom?: string;
          dateTo?: string;
        };
      }>("/aspirations", async (request) => {
        const query = aspirationQuerySchema.parse(request.query);
        const page = query.page;
        const take = 20;
        const where = aspirationWhere(query);
        const [items, total] = await Promise.all([
          db.aspiration.findMany({
            where,
            orderBy: { createdAt: "desc" },
            skip: (page - 1) * take,
            take,
          }),
          db.aspiration.count({ where }),
        ]);
        return {
          items,
          pagination: {
            page,
            pageSize: take,
            total,
            pages: Math.ceil(total / take),
          },
        };
      });
      admin.get<{
        Querystring: {
          status?: string;
          category?: string;
          branch?: string;
          q?: string;
          dateFrom?: string;
          dateTo?: string;
        };
      }>(
        "/aspirations/export",
        { preHandler: requireRole("ADMIN") },
        async (request, reply) => {
          const query = aspirationQuerySchema.parse(request.query);
          const items = await db.aspiration.findMany({
            where: aspirationWhere(query),
            orderBy: { createdAt: "desc" },
          });
          const header = [
            "referenceNumber",
            "createdAt",
            "status",
            "category",
            "branch",
            "name",
            "email",
            "phone",
            "region",
            "subject",
            "message",
            "adminNote",
          ];
          const rows = items.map((item) =>
            [
              item.referenceNumber,
              item.createdAt,
              item.status,
              item.category,
              item.branch,
              item.name,
              item.email,
              item.phone,
              item.region,
              item.subject,
              item.message,
              item.adminNote,
            ]
              .map(csvCell)
              .join(","),
          );
          const csv = [header.map(csvCell).join(","), ...rows].join("\r\n");
          reply
            .header("content-type", "text/csv; charset=utf-8")
            .header(
              "content-disposition",
              'attachment; filename="aspirations.csv"',
            );
          return reply.send(`\uFEFF${csv}\r\n`);
        },
      );
      admin.get<{ Params: { id: string } }>(
        "/aspirations/:id",
        async (request, reply) =>
          (await db.aspiration.findUnique({
            where: { id: request.params.id },
          })) ?? reply.code(404).send({ error: "Aspirasi tidak ditemukan." }),
      );
      admin.patch<{ Params: { id: string } }>(
        "/aspirations/:id/status",
        async (request) => {
          const input = statusSchema.parse(request.body);
          return mutateWithAudit(
            request,
            "STATUS",
            "Aspiration",
            request.params.id,
            (client) =>
              client.aspiration.update({
                where: { id: request.params.id },
                data: input,
              }),
            { status: input.status },
          );
        },
      );
      admin.patch<{ Params: { id: string } }>(
        "/aspirations/:id/note",
        async (request) =>
          mutateWithAudit(
            request,
            "NOTE",
            "Aspiration",
            request.params.id,
            (client) =>
              client.aspiration.update({
                where: { id: request.params.id },
                data: noteSchema.parse(request.body),
              }),
          ),
      );
    },
    { prefix: "/api/admin" },
  );

  return app;
}
