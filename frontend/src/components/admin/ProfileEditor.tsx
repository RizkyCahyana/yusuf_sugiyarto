"use client";
import Image from "next/image";
import { FormEvent, useEffect, useState } from "react";
import { Save } from "lucide-react";
import { adminApi } from "@/lib/admin-api";
import type { Profile } from "./types";
import { ErrorMessage, ListEditor, Loading, PageHeader } from "./ui";
import s from "./admin.module.css";
const fallbackProfile: Profile = {
  fullName: "Yusuf Sugiyarto",
  headline: "Ketua Bidang Penelitian & Kebijakan Strategis PB HMI 2024–2026",
  tagline: "HMI: Creative Minority",
  about:
    "Yusuf Sugiyarto percaya bahwa perjalanan hidup bukan sekadar tentang mencapai tujuan, melainkan proses menempa diri melalui ilmu, organisasi, dan pengabdian.",
  vision:
    "Membangun HMI sebagai creative minority: kekuatan intelektual, moral, dan sosial yang modern tanpa kehilangan identitas keislaman dan keindonesiaannya.",
  missions: [
    "Transformasi Digital",
    "Kolaborasi Nasional & Global",
    "Kaderisasi Adaptif",
    "Meritokrasi Kepemimpinan",
    "Profesionalisme Organisasi",
  ],
  photoUrl: "/images/yusuf-sugiyarto.jpg",
  achievements: ["Ketua Umum HMI Cabang Bandung (2022–2023)"],
  softSkills: ["Kepemimpinan organisasi"],
  hardSkills: [
    "Kebijakan publik",
    "Teknologi digital",
    "Ketenagakerjaan",
    "Pembangunan sumber daya manusia",
  ],
};
export function ProfileEditor() {
  const [data, setData] = useState<Profile>(),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [success, setSuccess] = useState("");
  useEffect(() => {
    adminApi<Profile | null>("/api/admin/profile")
      .then((v) => setData(v ?? fallbackProfile))
      .catch((e) => setError(e.message));
  }, []);
  const set = <K extends keyof Profile>(k: K, v: Profile[K]) =>
    setData((p) => (p ? { ...p, [k]: v } : p));
  async function save(e: FormEvent) {
    e.preventDefault();
    if (!data) return;
    setBusy(true);
    setError("");
    setSuccess("");
    const body = {
      fullName: data.fullName,
      headline: data.headline,
      tagline: data.tagline,
      about: data.about,
      vision: data.vision,
      photoUrl: data.photoUrl || null,
      missions: data.missions.filter(Boolean),
      achievements: data.achievements.filter(Boolean),
      softSkills: data.softSkills.filter(Boolean),
      hardSkills: data.hardSkills.filter(Boolean),
    };
    try {
      await adminApi("/api/admin/profile", {
        method: "PUT",
        body: JSON.stringify(body),
      });
      setSuccess("Profil berhasil diperbarui.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Gagal menyimpan profil.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <>
      <PageHeader
        title="Profil kandidat"
        description="Perbarui identitas, narasi, arah perjuangan, dan minat kandidat."
      />
      {error && <ErrorMessage value={error} />}{" "}
      {!data ? (
        <Loading />
      ) : (
        <form className={s.form} onSubmit={save}>
          <section className={s.card}>
            <div className={s.formGrid}>
              <div className={s.field}>
                <label htmlFor="name">Nama lengkap</label>
                <input
                  id="name"
                  required
                  minLength={2}
                  value={data.fullName}
                  onChange={(e) => set("fullName", e.target.value)}
                />
              </div>
              <div className={s.field}>
                <label htmlFor="headline">Headline</label>
                <input
                  id="headline"
                  required
                  value={data.headline}
                  onChange={(e) => set("headline", e.target.value)}
                />
              </div>
              <div className={s.field}>
                <label htmlFor="tagline">Tagline</label>
                <input
                  id="tagline"
                  required
                  value={data.tagline}
                  onChange={(e) => set("tagline", e.target.value)}
                />
              </div>
              <div className={s.field}>
                <label htmlFor="photo">URL foto</label>
                <input
                  id="photo"
                  value={data.photoUrl ?? ""}
                  onChange={(e) => set("photoUrl", e.target.value || null)}
                />
                <small>
                  Kosongkan untuk tanpa foto; placeholder dipakai saat data
                  belum tersedia.
                </small>
              </div>
              <div className={`${s.field} ${s.full}`}>
                <label>Pratinjau foto</label>
                <Image
                  src={data.photoUrl || "/images/yusuf-sugiyarto.jpg"}
                  alt={`Foto ${data.fullName}`}
                  width={120}
                  height={150}
                  style={{
                    objectFit: "cover",
                    borderRadius: 12,
                    background: "#e8eeea",
                  }}
                  unoptimized
                />
              </div>
              <div className={`${s.field} ${s.full}`}>
                <label htmlFor="about">Tentang kandidat</label>
                <textarea
                  id="about"
                  required
                  minLength={20}
                  value={data.about}
                  onChange={(e) => set("about", e.target.value)}
                />
              </div>
              <div className={`${s.field} ${s.full}`}>
                <label htmlFor="vision">Visi</label>
                <textarea
                  id="vision"
                  required
                  minLength={20}
                  value={data.vision}
                  onChange={(e) => set("vision", e.target.value)}
                />
              </div>
              <ListEditor
                label="Pilar modernisasi"
                required
                values={data.missions}
                onChange={(v) => set("missions", v)}
              />
              <ListEditor
                label="Capaian"
                values={data.achievements}
                onChange={(v) => set("achievements", v)}
              />
              <ListEditor
                label="Soft skills"
                values={data.softSkills}
                onChange={(v) => set("softSkills", v)}
              />
              <ListEditor
                label="Ketertarikan dan minat"
                values={data.hardSkills}
                onChange={(v) => set("hardSkills", v)}
              />
            </div>
          </section>
          {success && (
            <div className={s.success} role="status">
              {success}
            </div>
          )}
          <div className={s.actions}>
            <button className={s.button} disabled={busy}>
              <Save size={18} />
              {busy ? "Menyimpan…" : "Simpan profil"}
            </button>
          </div>
        </form>
      )}
    </>
  );
}
