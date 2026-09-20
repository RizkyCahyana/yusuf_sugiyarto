"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Clock3, Inbox, Sparkles } from "lucide-react";
import { adminApi, ApiError, formatDate } from "@/lib/admin-api";
import type { DashboardData } from "@/components/admin/types";
import {
  ErrorMessage,
  Loading,
  PageHeader,
  StatusBadge,
} from "@/components/admin/ui";
import s from "@/components/admin/admin.module.css";

export default function Dashboard() {
  const [data, setData] = useState<DashboardData>();
  const [error, setError] = useState("");
  const router = useRouter();
  useEffect(() => {
    adminApi<DashboardData>("/api/admin/dashboard")
      .then(setData)
      .catch((e) => {
        if (e instanceof ApiError && e.status === 401)
          router.replace("/admin/login");
        else setError(e.message);
      });
  }, [router]);
  const metrics = data
    ? [
        { label: "Total aspirasi", value: data.counts.total, Icon: Inbox },
        { label: "Aspirasi baru", value: data.counts.baru, Icon: Sparkles },
        { label: "Sedang diproses", value: data.counts.diproses, Icon: Clock3 },
        { label: "Selesai", value: data.counts.selesai, Icon: CheckCircle2 },
      ]
    : [];
  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Ringkasan aspirasi dan aktivitas terbaru."
      />
      {error && <ErrorMessage value={error} />} {!data && !error && <Loading />}
      {data && (
        <>
          <section className={s.grid4} aria-label="Ringkasan aspirasi">
            {metrics.map(({ label, value, Icon }) => (
              <article className={`${s.card} ${s.metric}`} key={label}>
                <div>
                  <span>{label}</span>
                  <strong>{value}</strong>
                </div>
                <div className={s.iconBox}>
                  <Icon aria-hidden="true" />
                </div>
              </article>
            ))}
          </section>
          <section className={`${s.grid2} ${s.section}`}>
            <article className={s.card}>
              <div className={s.sectionHead}>
                <h2>Per kategori</h2>
              </div>
              {data.byCategory.length ? (
                data.byCategory.map((item) => {
                  const count =
                    typeof item._count === "number"
                      ? item._count
                      : (item._count._all ?? item._count.category ?? 0);
                  return (
                    <div className={s.metric} key={item.category}>
                      <span>{item.category}</span>
                      <strong style={{ fontSize: 18 }}>{count}</strong>
                    </div>
                  );
                })
              ) : (
                <p className={s.subtitle}>Belum ada aspirasi.</p>
              )}
            </article>
            <article className={s.card}>
              <div className={s.sectionHead}>
                <h2>Aspirasi terbaru</h2>
                <Link className={s.link} href="/admin/aspirasi">
                  Lihat semua
                </Link>
              </div>
              {data.recent.length ? (
                data.recent.map((item) => (
                  <div className={s.recentItem} key={item.id}>
                    <Link
                      className={s.link}
                      href={`/admin/aspirasi/${item.id}`}
                    >
                      {item.subject}
                    </Link>
                    <div className={s.recentMeta}>
                      <StatusBadge value={item.status} />
                      <small className={s.subtitle}>
                        {formatDate(item.createdAt)}
                      </small>
                    </div>
                  </div>
                ))
              ) : (
                <p className={s.subtitle}>Belum ada aspirasi.</p>
              )}
            </article>
          </section>
        </>
      )}
    </>
  );
}
