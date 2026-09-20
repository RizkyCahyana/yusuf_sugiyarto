"use client";
import { FormEvent, useCallback, useEffect, useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { adminApi } from "@/lib/admin-api";
import type { Contact } from "./types";
import { ErrorMessage, Loading, Modal, PageHeader } from "./ui";
import s from "./admin.module.css";
const blank: Omit<Contact, "id"> = {
  type: "EMAIL",
  label: "",
  value: "",
  url: null,
  isPublic: true,
  sortOrder: 0,
};
const types = [
  "EMAIL",
  "PHONE",
  "ADDRESS",
  "INSTAGRAM",
  "TIKTOK",
  "FACEBOOK",
  "X",
  "LINKEDIN",
] as const;
export function ContactManager() {
  const [items, setItems] = useState<Contact[]>([]),
    [editing, setEditing] = useState<Contact | Omit<Contact, "id">>(),
    [loading, setLoading] = useState(true),
    [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  const load = useCallback(() => {
    adminApi<Contact[]>("/api/admin/contacts")
      .then(setItems)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);
  useEffect(load, [load]);
  const set = <K extends keyof Omit<Contact, "id">>(
    k: K,
    v: Omit<Contact, "id">[K],
  ) => setEditing((p) => (p ? { ...p, [k]: v } : p));
  async function save(e: FormEvent) {
    e.preventDefault();
    if (!editing) return;
    setBusy(true);
    const id = (editing as Contact).id;
    const body = {
      type: editing.type,
      label: editing.label,
      value: editing.value,
      url: editing.url || null,
      isPublic: editing.isPublic,
      sortOrder: editing.sortOrder,
    };
    try {
      await adminApi(id ? `/api/admin/contacts/${id}` : "/api/admin/contacts", {
        method: id ? "PUT" : "POST",
        body: JSON.stringify(body),
      });
      setEditing(undefined);
      load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Gagal menyimpan.");
    } finally {
      setBusy(false);
    }
  }
  async function remove(i: Contact) {
    if (!confirm(`Hapus kontak ${i.label}?`)) return;
    try {
      await adminApi(`/api/admin/contacts/${i.id}`, { method: "DELETE" });
      load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Gagal menghapus.");
    }
  }
  return (
    <>
      <PageHeader
        title="Kontak"
        description="Atur kanal komunikasi dan tautan media sosial publik."
        action={
          <button className={s.button} onClick={() => setEditing({ ...blank })}>
            <Plus size={18} />
            Tambah kontak
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
                <th>Jenis</th>
                <th>Label</th>
                <th>Nilai</th>
                <th>Visibilitas</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {items.map((i) => (
                <tr key={i.id}>
                  <td>{i.sortOrder}</td>
                  <td>
                    <span className={s.badge}>{i.type}</span>
                  </td>
                  <td>
                    <strong>{i.label}</strong>
                  </td>
                  <td>{i.value}</td>
                  <td>{i.isPublic ? "Publik" : "Privat"}</td>
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
                        aria-label={`Hapus ${i.label}`}
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
          {!items.length && <div className={s.empty}>Belum ada kontak.</div>}
        </div>
      )}
      {editing && (
        <Modal
          title={(editing as Contact).id ? "Edit kontak" : "Tambah kontak"}
          onClose={() => setEditing(undefined)}
        >
          <form className={s.form} onSubmit={save}>
            <div className={s.formGrid}>
              <div className={s.field}>
                <label>Jenis</label>
                <select
                  value={editing.type}
                  onChange={(e) =>
                    set("type", e.target.value as Contact["type"])
                  }
                >
                  {types.map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div className={s.field}>
                <label>Label</label>
                <input
                  required
                  minLength={2}
                  maxLength={60}
                  value={editing.label}
                  onChange={(e) => set("label", e.target.value)}
                />
              </div>
              <div className={s.field}>
                <label>Nilai</label>
                <input
                  required
                  minLength={2}
                  maxLength={200}
                  value={editing.value}
                  onChange={(e) => set("value", e.target.value)}
                />
              </div>
              <div className={s.field}>
                <label>
                  URL <small>(opsional)</small>
                </label>
                <input
                  type="url"
                  placeholder="https://…"
                  value={editing.url ?? ""}
                  onChange={(e) => set("url", e.target.value || null)}
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
                  checked={editing.isPublic}
                  onChange={(e) => set("isPublic", e.target.checked)}
                />
                Tampilkan ke publik
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
