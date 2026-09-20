/* eslint-disable @typescript-eslint/no-explicit-any */
import { hashSync } from "bcryptjs";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

type Entity = Record<string, any>;

/**
 * These tests deliberately use an in-memory Prisma-shaped double.  That keeps
 * the integration contract (Fastify routing, hooks, cookies and validation)
 * under test without requiring a database or touching a developer's data.
 */
const state = vi.hoisted(() => ({
  profile: {
    id: "profile-public",
    fullName: "Profil Publik",
    headline: "Penggerak perubahan",
  } as Entity,
  programs: [
    {
      id: "program-published",
      slug: "program-publik",
      title: "Program Publik",
      isPublished: true,
    },
    {
      id: "program-draft",
      slug: "program-draft",
      title: "Program Draft",
      isPublished: false,
    },
  ] as Entity[],
  contacts: [
    {
      id: "contact-public",
      type: "EMAIL",
      label: "Email",
      value: "public@example.test",
      isPublic: true,
    },
    {
      id: "contact-private",
      type: "PHONE",
      label: "Internal",
      value: "+628111111111",
      isPublic: false,
    },
  ] as Entity[],
  aspirations: [] as Entity[],
  users: [] as Entity[],
  sessions: [] as Entity[],
  trafficTotal: 0n,
  nextId: 1,
}));

const makeId = (prefix: string) => `${prefix}-test-${state.nextId++}`;

const dbMock = vi.hoisted(() => ({
  profile: {
    findFirst: vi.fn(async () => state.profile),
  },
  program: {
    findMany: vi.fn(async ({ where }: Entity = {}) =>
      where?.isPublished === true
        ? state.programs.filter((program) => program.isPublished)
        : state.programs,
    ),
    findFirst: vi.fn(
      async ({ where }: Entity) =>
        state.programs.find(
          (program) =>
            program.slug === where.slug &&
            (!where.isPublished || program.isPublished),
        ) ?? null,
    ),
  },
  contact: {
    findMany: vi.fn(async ({ where }: Entity = {}) =>
      where?.isPublic === true
        ? state.contacts.filter((contact) => contact.isPublic)
        : state.contacts,
    ),
  },
  siteTraffic: {
    findUnique: vi.fn(async () =>
      state.trafficTotal > 0n ? { total: state.trafficTotal } : null,
    ),
    upsert: vi.fn(async () => {
      state.trafficTotal += 1n;
      return { total: state.trafficTotal };
    }),
  },
  aspiration: {
    create: vi.fn(async ({ data }: Entity) => {
      const result = {
        id: makeId("aspiration"),
        referenceNumber: data.referenceNumber,
        status: "BARU",
        ...data,
        createdAt: new Date("2026-08-29T00:00:00.000Z"),
      };
      state.aspirations.push(result);
      return {
        referenceNumber: result.referenceNumber,
        createdAt: result.createdAt,
      };
    }),
  },
  user: {
    findUnique: vi.fn(
      async ({ where }: Entity) =>
        state.users.find((user) => user.email === where.email) ?? null,
    ),
  },
  session: {
    findUnique: vi.fn(async ({ where }: Entity) => {
      const session = state.sessions.find(
        (candidate) => candidate.tokenHash === where.tokenHash,
      );
      if (!session) return null;
      return {
        ...session,
        user: state.users.find((user) => user.id === session.userId),
      };
    }),
    create: vi.fn(async ({ data }: Entity) => {
      const result = { id: makeId("session"), ...data };
      state.sessions.push(result);
      return result;
    }),
  },
}));

vi.mock("./db.js", () => ({ db: dbMock }));

import { buildApp } from "./app.js";

const admin = {
  id: "admin-public-test",
  name: "Admin Test",
  email: "admin-public@example.test",
  passwordHash: hashSync("password-test-2026", 4),
  role: "ADMIN",
};

let app: Awaited<ReturnType<typeof buildApp>> | undefined;

beforeEach(() => {
  state.aspirations = [];
  state.sessions = [];
  state.trafficTotal = 0n;
  state.users = [{ ...admin }];
  state.nextId = 1;
  vi.clearAllMocks();
});

afterEach(async () => {
  if (app) await app.close();
  app = undefined;
});

async function getApp() {
  app = await buildApp();
  return app;
}

async function login() {
  const response = await (
    await getApp()
  ).inject({
    method: "POST",
    url: "/api/auth/login",
    payload: {
      email: admin.email,
      password: "password-test-2026",
    },
  });
  expect(response.statusCode).toBe(200);
  const cookie = response.headers["set-cookie"];
  expect(cookie).toBeTypeOf("string");
  return (cookie as string).split(";", 1)[0];
}

describe("public API melalui Fastify inject", () => {
  it("menyajikan health, profile, program published, dan kontak publik", async () => {
    const instance = await getApp();

    expect(
      (await instance.inject({ method: "GET", url: "/health" })).json(),
    ).toEqual({
      status: "ok",
    });

    const profile = await instance.inject({
      method: "GET",
      url: "/api/profile",
    });
    expect(profile.statusCode).toBe(200);
    expect(profile.json()).toMatchObject({ id: "profile-public" });

    const programs = await instance.inject({
      method: "GET",
      url: "/api/programs",
    });
    expect(programs.statusCode).toBe(200);
    expect(programs.json()).toEqual([
      expect.objectContaining({ slug: "program-publik" }),
    ]);

    const contacts = await instance.inject({
      method: "GET",
      url: "/api/contacts",
    });
    expect(contacts.statusCode).toBe(200);
    expect(contacts.json()).toEqual([
      expect.objectContaining({ id: "contact-public" }),
    ]);
  });

  it("hanya menemukan program yang published berdasarkan slug", async () => {
    const instance = await getApp();

    const published = await instance.inject({
      method: "GET",
      url: "/api/programs/program-publik",
    });
    expect(published.statusCode).toBe(200);
    expect(published.json()).toMatchObject({ slug: "program-publik" });

    const draft = await instance.inject({
      method: "GET",
      url: "/api/programs/program-draft",
    });
    expect(draft.statusCode).toBe(404);
    expect(draft.json()).toEqual({ error: "Program tidak ditemukan." });
  });

  it("menyimpan dan menyajikan total kunjungan secara kumulatif", async () => {
    const instance = await getApp();

    const initial = await instance.inject({
      method: "GET",
      url: "/api/traffic",
    });
    expect(initial.statusCode).toBe(200);
    expect(initial.json()).toEqual({ total: "0" });

    const firstVisit = await instance.inject({
      method: "POST",
      url: "/api/traffic",
    });
    const secondVisit = await instance.inject({
      method: "POST",
      url: "/api/traffic",
    });

    expect(firstVisit.json()).toEqual({ total: "1" });
    expect(secondVisit.json()).toEqual({ total: "2" });
    expect(state.trafficTotal).toBe(2n);
  });

  it("menerima aspirasi publik dan tidak menyimpan data di luar field yang diizinkan", async () => {
    const instance = await getApp();
    const response = await instance.inject({
      method: "POST",
      url: "/api/aspirations",
      payload: {
        name: "Pengirim Integrasi",
        email: "PENGIRIM@EXAMPLE.TEST",
        phone: "081234567890",
        region: "Jawa Barat",
        branch: "Cabang Uji",
        category: "Kritik & Saran",
        subject: "Masukan pengujian integrasi",
        message:
          "Isi aspirasi ini cukup panjang untuk melewati validasi minimum.",
        consent: true,
        website: "",
        startedAt: Date.now() - 3_000,
      },
    });

    expect(response.statusCode).toBe(201);
    expect(response.json()).toMatchObject({
      referenceNumber: expect.any(String),
      createdAt: expect.any(String),
    });
    expect(state.aspirations).toHaveLength(1);
    expect(state.aspirations[0]).toMatchObject({
      name: "Pengirim Integrasi",
      email: "pengirim@example.test",
      status: "BARU",
    });
    expect(state.aspirations[0]).not.toHaveProperty("website");
  });

  it("menolak aspirasi tidak valid sebelum memanggil database", async () => {
    const instance = await getApp();
    const response = await instance.inject({
      method: "POST",
      url: "/api/aspirations",
      payload: {
        name: "X",
        branch: "",
        category: "Kritik & Saran",
        subject: "pendek",
        message: "pendek",
        consent: false,
        startedAt: Date.now(),
      },
    });

    expect(response.statusCode).toBe(400);
    expect(response.json().error).toBe("Data tidak valid.");
    expect(dbMock.aspiration.create).not.toHaveBeenCalled();
  });
});

describe("auth dan endpoint admin melalui Fastify inject", () => {
  it("menolak sesi dan login yang tidak valid", async () => {
    const instance = await getApp();
    const session = await instance.inject({
      method: "GET",
      url: "/api/auth/session",
    });
    expect(session.statusCode).toBe(401);

    const adminEndpoint = await instance.inject({
      method: "GET",
      url: "/api/admin/programs",
    });
    expect(adminEndpoint.statusCode).toBe(401);

    const loginResponse = await instance.inject({
      method: "POST",
      url: "/api/auth/login",
      payload: { email: admin.email, password: "wrong-password" },
    });
    expect(loginResponse.statusCode).toBe(401);
    expect(state.sessions).toHaveLength(0);
  });

  it("mengizinkan sesi valid mengakses endpoint admin", async () => {
    const cookie = await login();
    const instance = app!;

    const session = await instance.inject({
      method: "GET",
      url: "/api/auth/session",
      headers: { cookie },
    });
    expect(session.statusCode).toBe(200);
    expect(session.json().user).toMatchObject({
      email: admin.email,
      role: "ADMIN",
    });

    const programs = await instance.inject({
      method: "GET",
      url: "/api/admin/programs",
      headers: { cookie },
    });
    expect(programs.statusCode).toBe(200);
    expect(programs.json()).toHaveLength(2);
  });
});
