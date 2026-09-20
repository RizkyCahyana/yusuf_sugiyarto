"use client";
import { FormEvent, useCallback, useEffect, useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { adminApi } from "@/lib/admin-api";
import type { Program } from "./types";
import { ErrorMessage, ListEditor, Loading, Modal, PageHeader } from "./ui";
import s from "./admin.module.css";
const blank: Omit<Program, "id"> = {
  slug: "",
  title: "",
  eyebrow: "",
  problem: "",
  objective: "",
  description: "",
  actionPlan: [""],
  indicators: [""],
  sortOrder: 0,
  isPublished: true,
};
export function ProgramManager() {
  const [items, setItems] = useState<Program[]>([]),
    [editing, setEditing] = useState<Program | Omit<Program, "id">>(),
    [loading, setLoading] = useState(true),
    [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  const load = useCallback(() => {
    adminApi<Program[]>("/api/admin/programs")
      .then(setItems)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);
  useEffect(load, [load]);
  async function save(e: FormEvent) {
    e.preventDefault();
    if (!editing) return;
    setBusy(true);
    setError("");
    const id = (editing as Program).id;
    const body = {
      slug: editing.slug,
      title: editing.title,
      eyebrow: editing.eyebrow,
      problem: editing.problem,
      objective: editing.objective,
      description: editing.description,
      actionPlan: editing.actionPlan.filter(Boolean),
      indicators: editing.indicators.filter(Boolean),
      sortOrder: editing.sortOrder,
      isPublished: editing.isPublished,
    };
    try {
      await adminApi(id ? `/api/admin/programs/${id}` : "/api/admin/programs", {
        method: id ? "PUT" : "POST",
        body: JSON.stringify(body),
      });
      setEditing(undefined);
      load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Gagal menyimpan program.");
    } finally {
      setBusy(false);
    }
  }
  async function remove(item: Program) {
    if (!confirm(`Hapus program “${item.title}”?`)) return;
    try {
      await adminApi(`/api/admin/programs/${item.id}`, { method: "DELETE" });
      load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Gagal menghapus.");
    }
  }
  const set = <K extends keyof Omit<Program, "id">>(
    k: K,
    v: Omit<Program, "id">[K],
  ) => setEditing((p) => (p ? { ...p, [k]: v } : p));
  return (
    <>
      <PageHeader
        title="Program"
        description="Kelola agenda, target, dan status publikasi program."
        action={
          <button className={s.button} onClick={() => setEditing({ ...blank })}>
            <Plus size={18} />
            Program baru
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
                <th>Program</th>
                <th>Slug</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {items.map((i) => (
                <tr key={i.id}>
                  <td>{i.sortOrder}</td>
                  <td>
                    <strong>{i.title}</strong>
                    <br />
                    <small>{i.eyebrow}</small>
                  </td>
                  <td>{i.slug}</td>
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
                        aria-label={`Edit ${i.title}`}
                      >
                        <Pencil size={16} />
                        Edit
                      </button>
                      <button
                        className={s.buttonDanger}
                        onClick={() => remove(i)}
                        aria-label={`Hapus ${i.title}`}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!items.length && <div className={s.empty}>Belum ada program.</div>}
        </div>
      )}
      {editing && (
        <Modal
          title={(editing as Program).id ? "Edit program" : "Tambah program"}
          onClose={() => setEditing(undefined)}
        >
          <form className={s.form} onSubmit={save}>
            <div className={s.formGrid}>
              <div className={s.field}>
                <label>Judul</label>
                <input
                  value={editing.title}
                  minLength={2}
                  maxLength={120}
                  required
                  onChange={(e) => set("title", e.target.value)}
                />
              </div>
              <div className={s.field}>
                <label>Label singkat</label>
                <input
                  value={editing.eyebrow}
                  required
                  onChange={(e) => set("eyebrow", e.target.value)}
                />
              </div>
              <div className={s.field}>
                <label>Slug</label>
                <input
                  value={editing.slug}
                  pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
                  required
                  onChange={(e) => set("slug", e.target.value)}
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
              <div className={`${s.field} ${s.full}`}>
                <label>Masalah</label>
                <textarea
                  required
                  minLength={10}
                  value={editing.problem}
                  onChange={(e) => set("problem", e.target.value)}
                />
              </div>
              <div className={`${s.field} ${s.full}`}>
                <label>Tujuan</label>
                <textarea
                  required
                  minLength={10}
                  value={editing.objective}
                  onChange={(e) => set("objective", e.target.value)}
                />
              </div>
              <div className={`${s.field} ${s.full}`}>
                <label>Deskripsi</label>
                <textarea
                  required
                  minLength={10}
                  value={editing.description}
                  onChange={(e) => set("description", e.target.value)}
                />
              </div>
              <ListEditor
                label="Rencana aksi"
                values={editing.actionPlan}
                required
                onChange={(v) => set("actionPlan", v)}
              />
              <ListEditor
                label="Indikator"
                values={editing.indicators}
                required
                onChange={(v) => set("indicators", v)}
              />
              <label className={`${s.check} ${s.full}`}>
                <input
                  type="checkbox"
                  checked={editing.isPublished}
                  onChange={(e) => set("isPublished", e.target.checked)}
                />
                Tampilkan di website publik
              </label>
            </div>
            <div className={s.actions}>
              <button className={s.button} disabled={busy}>
                {busy ? "Menyimpan…" : "Simpan program"}
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
