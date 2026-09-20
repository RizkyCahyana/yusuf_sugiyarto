import Link from "next/link";
export default function NotFound() {
  return (
    <section className="empty-page container">
      <span className="eyebrow">404</span>
      <h1>Halaman tidak ditemukan.</h1>
      <p>Alamat mungkin berubah atau konten belum tersedia.</p>
      <Link className="button" href="/">
        Kembali ke beranda
      </Link>
    </section>
  );
}
