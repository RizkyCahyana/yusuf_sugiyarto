"use client";
import Link from "next/link";
import { FormEvent, useCallback, useEffect, useState } from "react";
import { Download, Search } from "lucide-react";
import { adminApi, formatDate } from "@/lib/admin-api";
import type { Aspiration } from "./types";
import { ErrorMessage, Loading, PageHeader, StatusBadge } from "./ui";
import s from "./admin.module.css";
type Result = {
  items: Aspiration[];
  pagination: { page: number; pageSize: number; total: number; pages: number };
};
const statuses = [
  "",
  "BARU",
  "DIBACA",
  "DIPROSES",
  "SELESAI",
  "ARSIP",
] as const;
const categories = [
  "",
  "Kaderisasi",
  "SDM",
  "Organisasi & Transparansi",
  "Jaringan",
  "Sosial",
  "Kritik & Saran",
  "Lainnya",
];
export function AspirationList() {
  const [result, setResult] = useState<Result>(),
    [filters, setFilters] = useState({
      q: "",
      status: "",
      category: "",
      branch: "",
      dateFrom: "",
      dateTo: "",
    }),
    [query, setQuery] = useState(filters),
    [page, setPage] = useState(1),
    [error, setError] = useState("");
  const load = useCallback(() => {
    const params = new URLSearchParams({ page: String(page) });
    Object.entries(query).forEach(([k, v]) => v && params.set(k, v));
    adminApi<Result>(`/api/admin/aspirations?${params}`)
      .then(setResult)
      .catch((e) => setError(e.message));
  }, [page, query]);
  useEffect(load, [load]);
  function search(e: FormEvent) {
    e.preventDefault();
    setError("");
    setPage(1);
    setQuery(filters);
  }
  async function exportCsv() {
    setError("");
    const params = new URLSearchParams();
    Object.entries(query).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    try {
      const response = await fetch(`/api/admin/aspirations/export?${params}`, {
        credentials: "include",
      });
      if (!response.ok) {
        const payload = (await response.json().catch(() => ({}))) as {
          error?: string;
        };
        throw new Error(payload.error ?? "Export aspirasi gagal.");
      }
      const url = URL.createObjectURL(await response.blob());
      const link = document.createElement("a");
      link.href = url;
      link.download = `aspirasi-${new Date().toISOString().slice(0, 10)}.csv`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : "Export aspirasi gagal.",
      );
    }
  }
  return (
    <>
      <PageHeader
        title="Aspirasi"
        description="Cari, saring, dan tindak lanjuti suara kader."
      />
      <form
        className={s.filters}
        onSubmit={search}
        aria-label="Filter aspirasi"
      >
        <label className={s.filterField}>
          <span>Pencarian</span>
          <input
            placeholder="Subjek, nama, atau referensi"
            value={filters.q}
            onChange={(e) => setFilters({ ...filters, q: e.target.value })}
          />
        </label>
        <label className={s.filterField}>
          <span>Status</span>
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          >
            {statuses.map((x) => (
              <option key={x} value={x}>
                {x || "Semua status"}
              </option>
            ))}
          </select>
        </label>
        <label className={s.filterField}>
          <span>Kategori</span>
          <select
            value={filters.category}
            onChange={(e) =>
              setFilters({ ...filters, category: e.target.value })
            }
          >
            {categories.map((x) => (
              <option key={x} value={x}>
                {x || "Semua kategori"}
              </option>
            ))}
          </select>
        </label>
        <label className={s.filterField}>
          <span>Cabang</span>
          <input
            placeholder="Nama cabang"
            value={filters.branch}
            onChange={(e) => setFilters({ ...filters, branch: e.target.value })}
          />
        </label>
        <label className={s.filterField}>
          <span>Dari tanggal</span>
          <input
            type="date"
            value={filters.dateFrom}
            max={filters.dateTo || undefined}
            onChange={(e) =>
              setFilters({ ...filters, dateFrom: e.target.value })
            }
          />
        </label>
        <label className={s.filterField}>
          <span>Sampai tanggal</span>
          <input
            type="date"
            value={filters.dateTo}
            min={filters.dateFrom || undefined}
            onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
          />
        </label>
        <div className={s.filterActions}>
          <button className={s.button} type="submit">
            <Search size={17} aria-hidden="true" />
            Terapkan
          </button>
          <button
            className={s.buttonSecondary}
            type="button"
            onClick={exportCsv}
          >
            <Download size={17} aria-hidden="true" />
            Export CSV
          </button>
        </div>
      </form>
      {error && <ErrorMessage value={error} />}{" "}
      {!result && !error ? (
        <Loading />
      ) : (
        result && (
          <>
            <div className={s.tableWrap}>
              <table className={s.table}>
                <thead>
                  <tr>
                    <th>Referensi</th>
                    <th>Aspirasi</th>
                    <th>Pengirim</th>
                    <th>Status</th>
                    <th>Tanggal</th>
                  </tr>
                </thead>
                <tbody>
                  {result.items.map((i) => (
                    <tr key={i.id}>
                      <td>
                        <Link
                          className={s.link}
                          href={`/admin/aspirasi/${i.id}`}
                        >
                          {i.referenceNumber}
                        </Link>
                      </td>
                      <td>
                        <strong>{i.subject}</strong>
                        <br />
                        <small>{i.category}</small>
                      </td>
                      <td>
                        {i.name}
                        <br />
                        <small>{i.branch}</small>
                      </td>
                      <td>
                        <StatusBadge value={i.status} />
                      </td>
                      <td>{formatDate(i.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {!result.items.length && (
                <div className={s.empty}>Tidak ada aspirasi sesuai filter.</div>
              )}
            </div>
            <div className={s.pagination}>
              <span>
                Halaman {result.pagination.page} dari{" "}
                {Math.max(1, result.pagination.pages)} ·{" "}
                {result.pagination.total} data
              </span>
              <div className={s.actions}>
                <button
                  className={s.buttonSecondary}
                  disabled={page <= 1}
                  onClick={() => setPage((p) => p - 1)}
                >
                  Sebelumnya
                </button>
                <button
                  className={s.buttonSecondary}
                  disabled={page >= result.pagination.pages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Berikutnya
                </button>
              </div>
            </div>
          </>
        )
      )}
    </>
  );
}
