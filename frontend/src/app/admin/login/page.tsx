"use client";
import { FormEvent, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { LogIn, ShieldCheck } from "lucide-react";
import { adminApi, ApiError } from "@/lib/admin-api";
import s from "@/components/admin/admin.module.css";

export default function LoginPage() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const data = new FormData(e.currentTarget);
    try {
      await adminApi("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({
          email: data.get("email"),
          password: data.get("password"),
        }),
      });
      router.replace("/admin");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Login gagal. Silakan coba lagi.",
      );
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className={s.login}>
      <section className={s.loginPanel}>
        <div className={s.brand}>
          <div className={s.brandMark}>
            <Image
              src="/images/logo-hmi.svg"
              alt="Logo HMI"
              width={40}
              height={40}
              unoptimized
            />
          </div>
          <div>
            <strong>Yusuf CMS</strong>
            <span>Panel pengelolaan konten</span>
          </div>
        </div>
        <h2>Selamat datang kembali</h2>
        <p>Masuk dengan akun admin untuk melanjutkan.</p>
        <form className={s.form} onSubmit={submit}>
          {error && (
            <div className={s.error} role="alert">
              {error}
            </div>
          )}
          <div className={s.field}>
            <label htmlFor="email">Username / Email</label>
            <input
              id="email"
              name="email"
              type="text"
              autoComplete="username"
              required
              placeholder="admin"
            />
          </div>
          <div className={s.field}>
            <label htmlFor="password">Kata sandi</label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              minLength={1}
              required
            />
          </div>
          <button className={s.button} disabled={busy}>
            <LogIn size={18} aria-hidden="true" />
            {busy ? "Memverifikasi…" : "Masuk ke CMS"}
          </button>
        </form>
      </section>
      <aside className={s.loginAside}>
        <ShieldCheck size={48} aria-hidden="true" />
        <h1>Kelola gagasan, dengarkan aspirasi.</h1>
        <p>
          Satu ruang kerja untuk menjaga informasi kandidat tetap akurat dan
          menindaklanjuti suara kader secara tertib.
        </p>
      </aside>
    </div>
  );
}
