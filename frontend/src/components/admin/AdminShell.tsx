"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  BarChart3,
  Building2,
  FileText,
  Inbox,
  LogOut,
  Mail,
  UserRound,
} from "lucide-react";
import { adminApi } from "@/lib/admin-api";
import { ThemeToggle } from "@/components/theme-toggle";
import s from "./admin.module.css";

const links = [
  ["/admin", "Dashboard", BarChart3],
  ["/admin/profile", "Profil", UserRound],
  ["/admin/program", "Program", FileText],
  ["/admin/organization", "Organisasi", Building2],
  ["/admin/kontak", "Kontak", Mail],
  ["/admin/aspirasi", "Aspirasi", Inbox],
] as const;

export function AdminShell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const router = useRouter();
  const [ready, setReady] = useState(path === "/admin/login");
  useEffect(() => {
    if (path === "/admin/login") return;
    adminApi("/api/auth/session")
      .then(() => setReady(true))
      .catch(() => router.replace("/admin/login"));
  }, [path, router]);
  if (path === "/admin/login")
    return (
      <div className={s.scope}>
        {children}
        <ThemeToggle />
      </div>
    );
  if (!ready)
    return (
      <div
        className={s.scope}
        style={{ display: "grid", placeItems: "center" }}
        role="status"
      >
        Memeriksa sesi admin…
      </div>
    );
  const active = (href: string) =>
    href === "/admin" ? path === href : path.startsWith(href);
  async function logout() {
    try {
      await adminApi("/api/auth/logout", { method: "POST" });
    } finally {
      router.replace("/admin/login");
    }
  }
  return (
    <div className={`${s.scope} ${s.shell}`}>
      <aside className={s.sidebar}>
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
            <span>Profil & Organisasi</span>
          </div>
        </div>
        <nav className={s.nav} aria-label="Navigasi admin">
          {links.map(([href, label, Icon]) => (
            <Link
              key={href}
              href={href}
              className={active(href) ? s.active : ""}
            >
              <Icon aria-hidden="true" />
              {label}
            </Link>
          ))}
        </nav>
        <nav className={s.mobileNav} aria-label="Navigasi admin seluler">
          {links.map(([href, label]) => (
            <Link
              key={href}
              href={href}
              className={active(href) ? s.active : ""}
            >
              {label}
            </Link>
          ))}
        </nav>
        <button className={s.logout} onClick={logout}>
          <LogOut aria-hidden="true" />
          Keluar
        </button>
      </aside>
      <main className={s.main}>{children}</main>
      <ThemeToggle />
    </div>
  );
}
