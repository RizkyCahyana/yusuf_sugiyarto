/* eslint-disable @typescript-eslint/no-explicit-any */
import { hashSync } from "bcryptjs";
import { beforeEach, describe, expect, it, vi } from "vitest";

type Entity = Record<string, any>;

const state = vi.hoisted(() => ({
  programs: [] as Entity[],
  contacts: [] as Entity[],
  organizations: [] as Entity[],
  aspirations: [] as Entity[],
  sessions: [] as Entity[],
  auditLogs: [] as Entity[],
  users: [] as Entity[],
  profile: { id: "profile-e2e", fullName: "E2E Profile" } as Entity,
  nextId: 1,
}));

const makeId = (prefix: string) => `${prefix}-e2e-${state.nextId++}`;

const dbMock = vi.hoisted(() => ({
  session: {
    findUnique: vi.fn(async ({ where }: Entity) => {
      const session = state.sessions.find(
        (item) => item.tokenHash === where.tokenHash,
      );
      if (!session) return null;
      return {
        ...session,
        user: state.users.find((item) => item.id === session.userId),
      };
    }),
    create: vi.fn(async ({ data }: Entity) => {
      const result = { id: makeId("session"), ...data };
      state.sessions.push(result);
      return result;
    }),
    deleteMany: vi.fn(async ({ where }: Entity) => {
      const before = state.sessions.length;
      state.sessions = state.sessions.filter(
        (item) => item.tokenHash !== where.tokenHash,
      );
      return { count: before - state.sessions.length };
    }),
  },
  user: {
    findUnique: vi.fn(async ({ where }: Entity) =>
      state.users.find((item) => item.email === where.email),
    ),
  },
  auditLog: {
    create: vi.fn(async ({ data }: Entity) => {
      const result = { id: makeId("audit"), ...data };
      state.auditLogs.push(result);
      return result;
    }),
  },
  profile: {
    findFirst: vi.fn(async () => state.profile),
    findFirstOrThrow: vi.fn(async () => state.profile),
  },
  program: {
    findMany: vi.fn(async () => state.programs),
    create: vi.fn(async ({ data }: Entity) => {
      const result = { id: makeId("program"), ...data };
      state.programs.push(result);
      return result;
    }),
    update: vi.fn(async ({ where, data }: Entity) => {
      const item = state.programs.find((entry) => entry.id === where.id);
      if (!item) throw new Error("Program not found");
      Object.assign(item, data);
      return item;
    }),
    delete: vi.fn(async ({ where }: Entity) => {
      const index = state.programs.findIndex((entry) => entry.id === where.id);
      if (index < 0) throw new Error("Program not found");
      return state.programs.splice(index, 1)[0];
    }),
  },
  contact: {
    findMany: vi.fn(async () => state.contacts),
    create: vi.fn(async ({ data }: Entity) => {
      const result = { id: makeId("contact"), ...data };
      state.contacts.push(result);
      return result;
    }),
    update: vi.fn(async ({ where, data }: Entity) => {
      const item = state.contacts.find((entry) => entry.id === where.id);
      if (!item) throw new Error("Contact not found");
      Object.assign(item, data);
      return item;
    }),
    delete: vi.fn(async ({ where }: Entity) => {
      const index = state.contacts.findIndex((entry) => entry.id === where.id);
      if (index < 0) throw new Error("Contact not found");
      return state.contacts.splice(index, 1)[0];
    }),
  },
  organizationExperience: {
    findMany: vi.fn(async () => state.organizations),
    create: vi.fn(async ({ data }: Entity) => {
      const result = { id: makeId("organization"), ...data };
      state.organizations.push(result);
      return result;
    }),
    update: vi.fn(async ({ where, data }: Entity) => {
      const item = state.organizations.find((entry) => entry.id === where.id);
      if (!item) throw new Error("Organization not found");
      Object.assign(item, data);
      return item;
    }),
    delete: vi.fn(async ({ where }: Entity) => {
      const index = state.organizations.findIndex(
        (entry) => entry.id === where.id,
      );
      if (index < 0) throw new Error("Organization not found");
      return state.organizations.splice(index, 1)[0];
    }),
  },
  aspiration: {
    findMany: vi.fn(async () => state.aspirations),
    findUnique: vi.fn(async ({ where }: Entity) =>
      state.aspirations.find((item) => item.id === where.id),
    ),
    count: vi.fn(async () => state.aspirations.length),
    groupBy: vi.fn(async () => []),
    update: vi.fn(async ({ where, data }: Entity) => {
      const item = state.aspirations.find((entry) => entry.id === where.id);
      if (!item) throw new Error("Aspiration not found");
      Object.assign(item, data, { updatedAt: new Date() });
      return item;
    }),
  },
}));

vi.mock("./db.js", () => ({ db: dbMock }));

import { buildApp } from "./app.js";

const admin = {
  id: "admin-e2e",
  name: "E2E Admin",
  email: "e2e-admin@example.test",
  passwordHash: hashSync("E2E-Password-2026!", 4),
  role: "ADMIN",
};

const programPayload = {
  slug: "e2e-program",
  title: "E2E Program",
  eyebrow: "E2E Eyebrow",
  problem: "Masalah integrasi yang sedang diuji.",
  objective: "Tujuan integrasi yang sedang diuji.",
  description: "Deskripsi program untuk pengujian integrasi.",
  actionPlan: ["Jalankan pengujian"],
  indicators: ["Pengujian berhasil"],
  sortOrder: 901,
  isPublished: false,
};

async function login(app: Awaited<ReturnType<typeof buildApp>>) {
  const response = await app.inject({
    method: "POST",
    url: "/api/auth/login",
    payload: {
      email: admin.email,
      password: "E2E-Password-2026!",
    },
  });
  expect(response.statusCode).toBe(200);
  const cookie = response.headers["set-cookie"];
  expect(cookie).toBeTypeOf("string");
  return (cookie as string).split(";", 1)[0];
}

beforeEach(() => {
  state.programs = [];
  state.contacts = [];
  state.organizations = [];
  state.sessions = [];
  state.auditLogs = [];
  state.users = [{ ...admin }];
  state.nextId = 1;
  state.aspirations = [
    {
      id: "aspiration-e2e",
      referenceNumber: "ASP-E2E-0001",
      name: "E2E Pengirim",
      email: "pengirim-e2e@example.test",
      phone: null,
      region: "E2E Region",
      branch: "E2E Branch",
      category: "Kaderisasi",
      subject: "E2E Aspirasi",
      message: "Isi aspirasi khusus pengujian integrasi.",
      status: "BARU",
      adminNote: null,
      consent: true,
      ipHash: "e2e-hash",
      createdAt: new Date("2026-08-29T00:00:00.000Z"),
      updatedAt: new Date("2026-08-29T00:00:00.000Z"),
    },
  ];
  vi.clearAllMocks();
});

describe("admin integration melalui Fastify inject", () => {
  it("menolak endpoint admin tanpa sesi", async () => {
    const app = await buildApp();
    const response = await app.inject({
      method: "GET",
      url: "/api/admin/programs",
    });
    expect(response.statusCode).toBe(401);
    expect(response.json()).toEqual({ error: "Autentikasi diperlukan." });
    await app.close();
  });

  it("login membuat sesi yang dapat dipakai dan logout mencabutnya", async () => {
    const app = await buildApp();
    const cookie = await login(app);

    const session = await app.inject({
      method: "GET",
      url: "/api/auth/session",
      headers: { cookie },
    });
    expect(session.statusCode).toBe(200);
    expect(session.json().user).toMatchObject({
      email: admin.email,
      role: "ADMIN",
    });

    const logout = await app.inject({
      method: "POST",
      url: "/api/auth/logout",
      headers: { cookie },
    });
    expect(logout.statusCode).toBe(204);
    expect(state.sessions).toHaveLength(0);
    await app.close();
  });

  it("menjalankan CRUD program dan mencatat audit", async () => {
    const app = await buildApp();
    const cookie = await login(app);
    const created = await app.inject({
      method: "POST",
      url: "/api/admin/programs",
      headers: { cookie },
      payload: programPayload,
    });
    expect(created.statusCode).toBe(201);
    const id = created.json().id as string;

    const listed = await app.inject({
      method: "GET",
      url: "/api/admin/programs",
      headers: { cookie },
    });
    expect(listed.json()).toHaveLength(1);

    const updated = await app.inject({
      method: "PUT",
      url: `/api/admin/programs/${id}`,
      headers: { cookie },
      payload: { ...programPayload, title: "E2E Program Updated" },
    });
    expect(updated.statusCode).toBe(200);
    expect(updated.json().title).toBe("E2E Program Updated");

    const deleted = await app.inject({
      method: "DELETE",
      url: `/api/admin/programs/${id}`,
      headers: { cookie },
    });
    expect(deleted.statusCode).toBe(204);
    expect(state.programs).toHaveLength(0);
    expect(state.auditLogs.map((item) => item.action)).toEqual([
      "CREATE",
      "UPDATE",
      "DELETE",
    ]);
    await app.close();
  });

  it("menjalankan CRUD kontak", async () => {
    const app = await buildApp();
    const cookie = await login(app);
    const payload = {
      type: "EMAIL",
      label: "E2E Email",
      value: "e2e-contact@example.test",
      url: "mailto:e2e-contact@example.test",
      isPublic: false,
      sortOrder: 902,
    };
    const created = await app.inject({
      method: "POST",
      url: "/api/admin/contacts",
      headers: { cookie },
      payload,
    });
    expect(created.statusCode).toBe(201);
    const id = created.json().id as string;

    const updated = await app.inject({
      method: "PUT",
      url: `/api/admin/contacts/${id}`,
      headers: { cookie },
      payload: { ...payload, label: "E2E Email Updated" },
    });
    expect(updated.json().label).toBe("E2E Email Updated");

    const listed = await app.inject({
      method: "GET",
      url: "/api/admin/contacts",
      headers: { cookie },
    });
    expect(listed.json()).toHaveLength(1);

    const deleted = await app.inject({
      method: "DELETE",
      url: `/api/admin/contacts/${id}`,
      headers: { cookie },
    });
    expect(deleted.statusCode).toBe(204);
    expect(state.contacts).toHaveLength(0);
    await app.close();
  });

  it("menjalankan CRUD pengalaman organisasi", async () => {
    const app = await buildApp();
    const cookie = await login(app);
    const payload = {
      organization: "E2E Organization",
      position: "E2E Position",
      startDate: "2025-01-01T00:00:00.000Z",
      endDate: null,
      description: "Deskripsi pengalaman organisasi E2E.",
      sortOrder: 903,
      isPublished: false,
    };
    const created = await app.inject({
      method: "POST",
      url: "/api/admin/organizations",
      headers: { cookie },
      payload,
    });
    expect(created.statusCode).toBe(201);
    expect(created.json().profileId).toBe("profile-e2e");
    const id = created.json().id as string;

    const updated = await app.inject({
      method: "PUT",
      url: `/api/admin/organizations/${id}`,
      headers: { cookie },
      payload: { ...payload, position: "E2E Position Updated" },
    });
    expect(updated.json().position).toBe("E2E Position Updated");

    const listed = await app.inject({
      method: "GET",
      url: "/api/admin/organizations",
      headers: { cookie },
    });
    expect(listed.json()).toHaveLength(1);

    const deleted = await app.inject({
      method: "DELETE",
      url: `/api/admin/organizations/${id}`,
      headers: { cookie },
    });
    expect(deleted.statusCode).toBe(204);
    expect(state.organizations).toHaveLength(0);
    await app.close();
  });

  it("memperbarui status dan catatan aspirasi", async () => {
    const app = await buildApp();
    const cookie = await login(app);
    const status = await app.inject({
      method: "PATCH",
      url: "/api/admin/aspirations/aspiration-e2e/status",
      headers: { cookie },
      payload: { status: "DIPROSES" },
    });
    expect(status.statusCode).toBe(200);
    expect(status.json().status).toBe("DIPROSES");

    const note = await app.inject({
      method: "PATCH",
      url: "/api/admin/aspirations/aspiration-e2e/note",
      headers: { cookie },
      payload: { adminNote: "Catatan E2E sudah ditindaklanjuti." },
    });
    expect(note.statusCode).toBe(200);
    expect(note.json().adminNote).toBe("Catatan E2E sudah ditindaklanjuti.");
    expect(state.auditLogs.map((item) => item.action)).toEqual([
      "STATUS",
      "NOTE",
    ]);
    await app.close();
  });

  it("mengekspor aspirasi sebagai CSV untuk ADMIN", async () => {
    const app = await buildApp();
    const cookie = await login(app);
    const response = await app.inject({
      method: "GET",
      url: "/api/admin/aspirations/export?q=E2E",
      headers: { cookie },
    });
    expect(response.statusCode).toBe(200);
    expect(response.headers["content-type"]).toContain("text/csv");
    expect(response.body).toContain("ASP-E2E-0001");
    expect(response.body).toContain("E2E Aspirasi");
    await app.close();
  });
});
