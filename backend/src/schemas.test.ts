import { describe, expect, it } from "vitest";
import {
  aspirationFilterSchema,
  aspirationSchema,
  programSchema,
} from "./schemas.js";
import { csvCell, newReferenceNumber } from "./security.js";

describe("aspirationSchema", () => {
  it("menerima payload valid dan menormalkan spasi", () => {
    const data = aspirationSchema.parse({
      name: "  Budi   Amin ",
      email: "budi@example.com",
      phone: "081234567890",
      region: "Badko Jawa Barat",
      branch: "Bandung",
      category: "Kaderisasi",
      subject: "Pemerataan kualitas training",
      message: "Mohon ada standardisasi materi training untuk seluruh cabang.",
      consent: true,
      website: "",
      startedAt: Date.now() - 5000,
    });
    expect(data.name).toBe("Budi Amin");
  });
  it("mewajibkan email, WhatsApp lokal, Badko, dan seluruh field", () =>
    expect(() =>
      aspirationSchema.parse({
        name: "Budi",
        email: "",
        phone: "",
        region: "",
        branch: "Bandung",
        category: "SDM",
        subject: "Judul aspirasi",
        message: "Pesan aspirasi yang cukup panjang untuk diuji.",
        consent: true,
        startedAt: Date.now() - 5000,
      }),
    ).toThrow());
  it("menolak nomor WhatsApp yang tidak diawali 08", () =>
    expect(() =>
      aspirationSchema.parse({
        name: "Budi",
        email: "budi@example.com",
        phone: "+6281234567890",
        region: "Badko Jawa Barat",
        branch: "Bandung",
        category: "SDM",
        subject: "Judul aspirasi",
        message: "Pesan aspirasi yang cukup panjang untuk diuji.",
        consent: true,
        startedAt: Date.now() - 5000,
      }),
    ).toThrow());
});

describe("security helpers", () => {
  it("membuat nomor referensi unik berformat aman", () => {
    const refs = new Set(
      Array.from({ length: 100 }, () => newReferenceNumber()),
    );
    expect(refs.size).toBe(100);
    expect([...refs][0]).toMatch(/^ASP-\d{4}-[A-F0-9]{10}$/);
  });
});

describe("programSchema", () => {
  it("menolak slug tidak aman", () =>
    expect(() => programSchema.parse({ slug: "Tidak Valid!" })).toThrow());
});

describe("aspirationFilterSchema", () => {
  it("memvalidasi tanggal kalender dan rentang filter", () => {
    const result = aspirationFilterSchema.parse({
      dateFrom: "2026-08-01",
      dateTo: "2026-08-31",
    });
    expect(result.dateFrom).toEqual(new Date("2026-08-01T00:00:00.000Z"));
    expect(() =>
      aspirationFilterSchema.parse({
        dateFrom: "2026-08-31",
        dateTo: "2026-08-01",
      }),
    ).toThrow();
    expect(() =>
      aspirationFilterSchema.parse({ dateFrom: "2026-02-30" }),
    ).toThrow();
  });
});

describe("CSV security", () => {
  it.each(["=SUM(A1:A2)", "+cmd", "-cmd", "@cmd", "\t=cmd"])(
    "mencegah formula spreadsheet %j",
    (value) => expect(csvCell(value)).toBe(`"'${value.replace(/\t/, "\t")}"`),
  );
});
