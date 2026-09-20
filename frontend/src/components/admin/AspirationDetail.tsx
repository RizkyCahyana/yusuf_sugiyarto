"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft, Save } from "lucide-react";
import { adminApi, formatDate } from "@/lib/admin-api";
import type { Aspiration, Status } from "./types";
import { ErrorMessage, Loading, PageHeader, StatusBadge } from "./ui";
import s from "./admin.module.css";
const statuses: Status[] = ["BARU", "DIBACA", "DIPROSES", "SELESAI", "ARSIP"];
export function AspirationDetail({ id }: { id: string }) {
  const [item, setItem] = useState<Aspiration>(),
    [status, setStatus] = useState<Status>("BARU"),
    [note, setNote] = useState(""),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [success, setSuccess] = useState("");
  useEffect(() => {
    adminApi<Aspiration>(`/api/admin/aspirations/${id}`)
      .then((v) => {
        setItem(v);
        setStatus(v.status);
        setNote(v.adminNote ?? "");
      })
      .catch((e) => setError(e.message));
  }, [id]);
  async function save() {
    if (!item) return;
    setBusy(true);
    setError("");
    setSuccess("");
    try {
      if (status !== item.status)
        await adminApi(`/api/admin/aspirations/${id}/status`, {
          method: "PATCH",
          body: JSON.stringify({ status }),
        });
      if (note !== (item.adminNote ?? ""))
        await adminApi(`/api/admin/aspirations/${id}/note`, {
          method: "PATCH",
          body: JSON.stringify({ adminNote: note || null }),
        });
      setItem({ ...item, status, adminNote: note || null });
      setSuccess("Tindak lanjut berhasil disimpan.");
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Gagal menyimpan tindak lanjut.",
      );
    } finally {
      setBusy(false);
    }
  }
  return (
    <>
      <PageHeader
        title="Detail aspirasi"
        description={item ? item.referenceNumber : "Memuat data…"}
        action={
          <Link className={s.buttonSecondary} href="/admin/aspirasi">
            <ArrowLeft size={17} />
            Kembali
          </Link>
        }
      />
      {error && <ErrorMessage value={error} />}{" "}
      {!item && !error ? (
        <Loading />
      ) : (
        item && (
          <div className={s.grid2}>
            <section className={s.card}>
              <div className={s.sectionHead}>
                <h2>{item.subject}</h2>
                <StatusBadge value={item.status} />
              </div>
              <dl className={s.detailMeta}>
                <div>
                  <dt>Nama</dt>
                  <dd>{item.name}</dd>
                </div>
                <div>
                  <dt>Cabang</dt>
                  <dd>{item.branch}</dd>
                </div>
                <div>
                  <dt>Wilayah / Badko</dt>
                  <dd>{item.region || "Tidak diisi"}</dd>
                </div>
                <div>
                  <dt>Kategori</dt>
                  <dd>{item.category}</dd>
                </div>
                <div>
                  <dt>Email</dt>
                  <dd>{item.email || "Tidak diisi"}</dd>
                </div>
                <div>
                  <dt>Telepon</dt>
                  <dd>{item.phone || "Tidak diisi"}</dd>
                </div>
                <div>
                  <dt>Dikirim</dt>
                  <dd>{formatDate(item.createdAt)}</dd>
                </div>
                <div>
                  <dt>Diperbarui</dt>
                  <dd>{formatDate(item.updatedAt)}</dd>
                </div>
              </dl>
              <div className={s.section}>
                <h3>Isi aspirasi</h3>
                <p className={s.prose}>{item.message}</p>
              </div>
            </section>
            <aside className={s.card}>
              <div className={s.sectionHead}>
                <h2>Tindak lanjut</h2>
              </div>
              <div className={s.form}>
                <div className={s.field}>
                  <label htmlFor="status">Status</label>
                  <select
                    id="status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value as Status)}
                  >
                    {statuses.map((v) => (
                      <option key={v}>{v}</option>
                    ))}
                  </select>
                </div>
                <div className={s.field}>
                  <label htmlFor="note">Catatan internal admin</label>
                  <textarea
                    id="note"
                    maxLength={3000}
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Catatan ini tidak ditampilkan ke publik."
                  />
                  <small>{note.length}/3000 karakter</small>
                </div>
                {success && (
                  <div className={s.success} role="status">
                    {success}
                  </div>
                )}
                <button className={s.button} disabled={busy} onClick={save}>
                  <Save size={17} />
                  {busy ? "Menyimpan…" : "Simpan tindak lanjut"}
                </button>
              </div>
            </aside>
          </div>
        )
      )}
    </>
  );
}
