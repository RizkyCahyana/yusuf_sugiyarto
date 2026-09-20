"use client";
import { FormEvent, useCallback, useEffect, useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { adminApi } from "@/lib/admin-api";
import type { Organization } from "./types";
import { ErrorMessage, Loading, Modal, PageHeader } from "./ui";
import s from "./admin.module.css";
const dateInput = (v: string | null) =>
  v ? new Date(v).toISOString().slice(0, 10) : "";
const blank: Omit<Organization, "id"> = {
  organization: "",
  position: "",
  startDate: "",
  endDate: null,
  description: "",
  sortOrder: 0,
  isPublished: true,
};
export function OrganizationManager() {
  const [items, setItems] = useState<Organization[]>([]),
    [editing, setEditing] = useState<Organization | Omit<Organization, "id">>(),
    [loading, setLoading] = useState(true),
    [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  const load = useCallback(() => {
    adminApi<Organization[]>("/api/admin/organizations")
      .then(setItems)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);
  useEffect(load, [load]);
  const set = <K extends keyof Omit<Organization, "id">>(
    k: K,
    v: Omit<Organization, "id">[K],
  ) => setEditing((p) => (p ? { ...p, [k]: v } : p));
  async function save(e: FormEvent) {
    e.preventDefault();
    if (!editing) return;
    setBusy(true);
    const id = (editing as Organization).id;
    const body = {
      organization: editing.organization,
      position: editing.position,
      startDate: editing.startDate,
      endDate: editing.endDate || null,
      description: editing.description,
      sortOrder: editing.sortOrder,
      isPublished: editing.isPublished,
    };
    try {
      await adminApi(
        id ? `/api/admin/organizations/${id}` : "/api/admin/organizations",
        { method: id ? "PUT" : "POST", body: JSON.stringify(body) },
      );
      setEditing(undefined);
      load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Gagal menyimpan.");
    } finally {
      setBusy(false);
    }
  }
  async function remove(i: Organization) {
    if (!confirm(`Hapus pengalaman di ${i.organization}?`)) return;
    try {
      await adminApi(`/api/admin/organizations/${i.id}`, { method: "DELETE" });
      load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Gagal menghapus.");
    }
  }
  return (
    <>
      <PageHeader
        title="Pengalaman organisasi"
        description="Susun perjalanan organisasi yang ditampilkan pada profil."
        action={
          <button className={s.button} onClick={() => setEditing({ ...blank })}>
            <Plus size={18} />
            Tambah pengalaman
          </button>
        }
      />
      {error && <ErrorMessage value={error} />}{" "}
      {loading ? (
        <Loading />
      ) : (
        <div className={s.tableWrap}>
          <table className={s.table}>
            <thead>
              <tr>
                <th>Urutan</th>
                <th>Organisasi</th>
                <th>Jabatan</th>
                <th>Periode</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {items.map((i) => (
                <tr key={i.id}>
                  <td>{i.sortOrder}</td>
                  <td>
                    <strong>{i.organization}</strong>
                  </td>
                  <td>{i.position}</td>
                  <td>
                    {new Date(i.startDate).getFullYear()}–
                    {i.endDate ? new Date(i.endDate).getFullYear() : "Sekarang"}
                  </td>
                  <td>
                    <span className={s.badge}>
                      {i.isPublished ? "Publik" : "Draf"}
                    </span>
                  </td>
                  <td>
                    <div className={s.actions}>
                      <button
                        className={s.buttonSecondary}
                        onClick={() => setEditing(i)}
                      >
                        <Pencil size={16} />
                        Edit
                      </button>
                      <button
                        className={s.buttonDanger}
                        aria-label={`Hapus ${i.organization}`}
                        onClick={() => remove(i)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!items.length && (
            <div className={s.empty}>Belum ada pengalaman organisasi.</div>
          )}
        </div>
      )}
      {editing && (
        <Modal
          title={
            (editing as Organization).id
              ? "Edit pengalaman"
              : "Tambah pengalaman"
          }
          onClose={() => setEditing(undefined)}
        >
          <form className={s.form} onSubmit={save}>
            <div className={s.formGrid}>
              <div className={s.field}>
                <label>Organisasi</label>
                <input
                  required
                  minLength={2}
                  value={editing.organization}
                  onChange={(e) => set("organization", e.target.value)}
                />
              </div>
              <div className={s.field}>
                <label>Jabatan</label>
                <input
                  required
                  minLength={2}
                  value={editing.position}
                  onChange={(e) => set("position", e.target.value)}
                />
              </div>
              <div className={s.field}>
                <label>Tanggal mulai</label>
                <input
                  required
                  type="date"
                  value={dateInput(editing.startDate)}
                  onChange={(e) => set("startDate", e.target.value)}
                />
              </div>
              <div className={s.field}>
                <label>
                  Tanggal selesai <small>(kosongkan jika masih aktif)</small>
                </label>
                <input
                  type="date"
                  min={dateInput(editing.startDate)}
                  value={dateInput(editing.endDate)}
                  onChange={(e) => set("endDate", e.target.value || null)}
                />
              </div>
              <div className={`${s.field} ${s.full}`}>
                <label>Deskripsi</label>
                <textarea
                  required
                  minLength={5}
                  value={editing.description}
                  onChange={(e) => set("description", e.target.value)}
                />
              </div>
              <div className={s.field}>
                <label>Urutan</label>
                <input
                  type="number"
                  min="0"
                  max="1000"
                  value={editing.sortOrder}
                  onChange={(e) => set("sortOrder", Number(e.target.value))}
                />
              </div>
              <label className={s.check}>
                <input
                  type="checkbox"
                  checked={editing.isPublished}
                  onChange={(e) => set("isPublished", e.target.checked)}
                />
                Tampilkan di profil publik
              </label>
            </div>
            <div className={s.actions}>
              <button className={s.button} disabled={busy}>
                {busy ? "Menyimpan…" : "Simpan"}
              </button>
              <button
                type="button"
                className={s.buttonSecondary}
                onClick={() => setEditing(undefined)}
              >
                Batal
              </button>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
}
