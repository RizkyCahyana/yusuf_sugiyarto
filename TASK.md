# Status Implementasi dan Task

## Project

Website personal Yusuf Sugiyarto dan kanal aspirasi, dengan frontend Next.js dan backend Fastify REST + PostgreSQL/Prisma yang berada pada folder terpisah. Identitas, pendidikan, pengalaman organisasi, narasi Creative Minority, dan Lima Pilar Modernisasi HMI bersumber dari `Profile_YusufSugiyarto.pdf`.

## Cara membaca status

- `[x]` tersedia di source dan telah diperiksa secara lokal pada audit terakhir.
- `[~]` tersedia sebagian atau belum lulus seluruh acceptance criteria.
- `[ ]` belum ada, memerlukan data/keputusan pemilik, atau membutuhkan verifikasi environment/manual.

Status source tidak sama dengan status production. Domain, HTTPS, deployment, backup, dan pengujian perangkat tidak boleh dianggap selesai hanya karena konfigurasinya sudah ada. Migration yang disebut selesai di bawah telah diterapkan ke database Supabase yang digunakan untuk verifikasi, tetapi tidak membuktikan bahwa deployment aplikasi production sudah dilakukan.

## P0 — MVP

### 1. Repository dan fondasi

- [x] Struktur npm workspaces dengan `frontend/` dan `backend/` terpisah.
- [x] Frontend Next.js App Router + TypeScript.
- [x] Backend Fastify REST + TypeScript.
- [x] Tailwind/PostCSS, ESLint, Prettier, dan TypeScript strict dikonfigurasi.
- [x] `.env.example`, `.gitignore`, README setup, dan dokumentasi arsitektur tersedia.
- [x] Workspace telah diinisialisasi sebagai Git repository dan secret/environment file diabaikan.
- [x] Dependency development yang sebelumnya memakai `latest` telah dikunci ke versi eksplisit; lockfile tersedia.

### 2. Database dan Prisma

- [x] Schema Prisma untuk User, Session, Profile, Education, WorkExperience, OrganizationExperience, Program, Contact, Aspiration, dan AuditLog.
- [x] Enum role, status aspirasi, dan tipe kontak.
- [x] Index/unique constraint utama dan relasi cascade/restrict.
- [x] Seed idempoten untuk profil Yusuf, enam pendidikan, sepuluh pengalaman organisasi, lima ruang kontribusi, WhatsApp, dan admin opsional.
- [x] PostgreSQL Supabase berhasil diakses dan diuji melalui API integration.
- [x] Migration awal `20260828182742_init` tersimpan dan berhasil diterapkan ke Supabase.
- [x] Prisma Studio berhasil dimulai dengan schema proyek dan merespons HTTP 200 terhadap Supabase demo.
- [x] Seed dijalankan dua kali tanpa error/duplikasi pada database Supabase.

### 3. Design system dan layout

- [x] Pedoman design system terpisah tersedia dan tidak ditimpa oleh implementasi.
- [x] Typography, warna, spacing, button, card, form, navigation, footer, dan CTA reusable tersedia di source frontend.
- [x] Loading dan not-found/error presentation dasar tersedia.
- [~] Empty state dan state CMS tersedia pada bagian yang diimplementasikan; audit visual seluruh variasi belum dilakukan.
- [x] Playwright memverifikasi tidak ada horizontal overflow pada desktop, tablet, dan mobile emulation.
- [x] Skala tipografi publik disatukan dengan keluarga sans-serif sistem, body copy sekitar 16 px, dan hierarki judul responsif yang konsisten antarmenu.
- [x] Arah visual editorial-modern/bento diterapkan dengan palet hijau Askara, whitespace yang lebih teratur, dan surface/card yang konsisten.
- [x] Lenis, smooth scroll global, sticky storytelling, dan listener perubahan header/footer dock saat scroll dihapus; halaman kembali memakai native scroll.
- [x] Footer navigation dan footer dock dipertahankan tanpa efek gerak berbasis scroll.
- [x] Popup selamat datang berbasis dialog native tampil satu kali per sesi, dapat ditutup dengan tombol/backdrop/Escape, responsif, dan mendukung dark mode.
- [x] Popup memakai potret formal, ringkasan profesional, transkripsi lengkap halaman 5–6 PDF, serta tanda tangan Yusuf yang diekstrak dari PDF.
- [x] Popup dan potret dibuat statis; seluruh sambutan langsung tersedia dan hanya panel teks yang dapat di-scroll pada desktop, mobile, dan landscape.
- [x] Logo publik header, footer, dan footer dock memakai bentuk Askara hasil ekstraksi PDF sebagai mask hijau dengan warna khusus dark mode.
- [x] Kelima simbol program diekstrak langsung dari halaman 4 PDF dan ditampilkan dalam warna hijau.
- [x] Foto PDF ditempatkan sebagai storytelling pada Beranda, Profil, dan Program; galeri Profil mendukung tampilan perbesar.
- [x] Media container memakai aspect ratio/min-height eksplisit agar aset baru dapat diganti tanpa mengubah struktur layout.
- [~] Inspeksi Chrome headless pada 1440 px, mobile 390 px, dan dark mode lulus tanpa horizontal overflow; Safari dan perangkat fisik tetap perlu diverifikasi.

### 4. Public website

- [x] Beranda: hero, foto Yusuf dari CV, tagline, CTA, ringkasan profil/prinsip, ruang kontribusi, highlight, kontak, dan footer.
- [x] Profil: biodata, enam pendidikan, sepuluh pengalaman organisasi, peran utama, dan bidang keahlian berdasarkan CV.
- [x] Program: lima pilar, masalah, tujuan, action plan, indikator, dan route slug.
- [x] Kontak: nomor telepon/WhatsApp dari CV dan formulir aspirasi ditampilkan langsung tanpa CTA perantara; email/media sosial tidak ditampilkan karena tidak tercantum.
- [x] Program: slider Lima Pilar didesain ulang sebagai showcase terpusat dengan preview slide tetangga, navigasi kanan/kiri, pagination, keyboard, scroll-snap, dan reduced-motion.
- [x] Program: Kelas Menengah Transformatif mempertahankan pusat data “Kelas Menengah” dan delapan profesi dalam node kartu responsif yang menggantikan orbit absolut.
- [x] Program: foto “Dari Gagasan Menuju Gerakan” dikembalikan ke desain awal full-bleed dengan caption overlay dan gradient.
- [x] Paragraf naratif panjang pada halaman publik memakai justify secara selektif; judul, label, dan UI ringkas tidak dipaksa justify.
- [x] Aspirasi: seluruh field wajib; email tervalidasi, WhatsApp wajib diawali `08`, ringkasan error fokus + error inline, loading/success/error, dan nomor referensi tersedia konsisten pada route Aspirasi dan Kontak.
- [~] Identitas dan riwayat sudah bersumber dari CV; lima ruang kontribusi adalah gagasan turunan yang perlu persetujuan pemilik sebelum dianggap program resmi.
- [x] Semua route public utama merespons HTTP 200 pada smoke test lokal.
- [~] Route utama, navigasi, form login, dan tampilan CMS telah diuji browser; review visual manual seluruh variasi konten tetap diperlukan.
- [x] Playwright memverifikasi responsive desktop/tablet/mobile dan keyboard skip/navigation.

### 5. REST API dan validasi

- [x] `GET /api/profile`, `/api/programs`, `/api/programs/:slug`, dan `/api/contacts`.
- [x] `POST /api/aspirations` dengan HTTP 201, reference number acak, status default database `BARU`, dan retry collision.
- [x] Zod validation, normalization, strict payload, field length, body size, serta production-safe error response.
- [x] Honeypot dan minimum form-fill time sebagai spam protection dasar.
- [x] Rate limit endpoint login dan aspirasi.
- [x] IP disimpan sebagai salted hash, bukan raw IP.
- [x] Query list aspirasi memakai schema runtime untuk pagination/filter/search.
- [x] Live API integration membuktikan public read HTTP 200, payload invalid HTTP 400, dan aspirasi tersimpan dengan HTTP 201 pada Supabase.
- [x] Rate limit login/aspirasi memakai bucket PostgreSQL terdistribusi dan migration telah diterapkan ke Supabase demo.
- [ ] CAPTCHA/Turnstile hanya bila pola spam menuntutnya.

### 6. Authentication dan authorization

- [x] Credentials login dengan bcrypt password verification.
- [x] Opaque random session token; hanya hash token disimpan di database.
- [x] Cookie HttpOnly, Secure pada production, SameSite Lax, expiry 8 jam.
- [x] Proteksi `/api/admin/*`, session check, dan logout/revocation.
- [x] Login rate limiting dan respons login invalid generik.
- [x] Proteksi `/admin` dan API terverifikasi melalui integration test serta E2E login/dashboard.
- [x] Cleanup sesi kedaluwarsa dijalankan saat startup, interval berkala, dan maintenance command.
- [ ] Cabut semua sesi ketika password/akun admin berubah.
- [ ] Origin/CSRF enforcement tambahan bila production tidak memakai same-origin proxy.

### 7. CMS

- [x] Dashboard count dan aspirasi terbaru.
- [x] Login/logout dan shell navigation admin.
- [x] Program list/create/edit/delete, publish toggle, dan sort order.
- [x] Organisasi list/create/edit/delete, publish toggle, dan sort order.
- [x] Kontak list/create/edit/delete, public toggle, dan sort order.
- [x] Aspirasi list, search, filter status/category/branch, pagination, detail, perubahan status, dan catatan internal.
- [x] Profile API read/update dan halaman editor profile CMS tersedia di source.
- [x] Mutasi CMS dan audit log dibungkus transaksi Prisma.
- [x] Filter rentang tanggal aspirasi tersedia dan divalidasi backend.
- [x] Export CSV ADMIN-only tersedia dengan proteksi formula injection.
- [x] Tabel aspirasi dan page overflow diuji lewat browser pada viewport mobile/tablet setelah login.

### 8. SEO dan metadata

- [x] Metadata title/description, Open Graph, Twitter card, viewport, manifest, sitemap, dan robots tersedia.
- [x] Robots melarang `/admin` dan `/api`.
- [x] Metadata detail program dan semantic heading/alt dasar tersedia di source.
- [~] Canonical/metadata base memakai fallback domain dummy; domain resmi belum diputuskan.
- [x] Favicon dan monogram YS tersedia; persetujuan aset brand final tetap diperlukan.
- [x] Schema.org Person tersedia pada root layout.
- [ ] Preview link membuktikan title/image benar pada deployment.

### 9. Security dan privacy

- [x] Helmet/security headers dasar, CORS exact origin, credential cookie, Zod server validation, dan Prisma query API.
- [x] Tidak ada stack trace mentah pada respons server yang diketahui.
- [x] Consent checkbox dan penjelasan singkat bahwa aspirasi tidak dipublikasikan.
- [~] Privacy/retention baseline dan maintenance command tersedia; penjadwalan, kebijakan resmi, serta bukti eksekusi berkala belum ada.
- [~] Parser `TRUST_PROXY` hanya menerima false, hop 1–10, atau CIDR eksplisit; nilai production menunggu topologi provider final.
- [ ] HTTPS production dan HSTS diverifikasi.
- [x] Pemeriksaan bundle frontend tidak menemukan nama secret, database URL, atau host Supabase.
- [ ] Database backup policy + bukti restore drill.
- [~] Maintenance script retensi tersedia; scheduler production dan cakupan retensi session/IP hash/audit/backup belum terverifikasi.
- [ ] Security review untuk konfigurasi cookie/CORS/CSRF berdasarkan domain production final.

### 10. Testing dan quality gate

- [x] Unit dan integration test backend tersedia; 25/25 test lulus setelah aturan wajib email/WhatsApp/Badko diperketat.
- [x] `npm run lint`, `npm run typecheck`, `npm test`, dan build production frontend+backend lulus pada verifikasi terakhir.
- [x] Live integration test: create aspiration berhasil HTTP 201 dan nomor referensi dibuat oleh backend.
- [x] Live integration test: anonymous admin HTTP 401, login HTTP 200, dashboard HTTP 200, dan logout HTTP 204.
- [x] Integration test CRUD program, contact, organization, status/catatan aspirasi, audit, dan export CSV lulus.
- [x] Smoke test HTTP dan Playwright untuk route publik, responsive, keyboard, dan automated accessibility lulus.
- [~] E2E admin login/dashboard dan tabel aspirasi lulus; update konten lalu refleksi ke halaman publik belum diautomasi.
- [ ] Manual Chrome desktop.
- [ ] Manual Chrome Android.
- [ ] Manual Safari iPhone.
- [ ] Manual Safari macOS.
- [x] Automated responsive tablet melalui Playwright; verifikasi perangkat fisik tetap terbuka pada item perangkat di atas.
- [ ] Manual keyboard-only dan screen reader smoke test.

### 11. Performance

- [x] `next/image`/image component dan font optimization tersedia di frontend.
- [x] Public API fetch memiliki revalidation/fallback dasar.
- [x] List aspirasi dibatasi dengan pagination backend.
- [~] Cache invalidation setelah mutasi CMS belum terverifikasi; konten public dapat stale sampai revalidation.
- [x] Portrait Yusuf diekstrak dari foto pada CV, dirapikan menjadi rasio 4:5, dan dikompres menjadi JPEG sekitar 248 KB.
- [ ] Bundle analysis.
- [ ] Query plan/index review dengan volume data realistis.
- [ ] Lighthouse >= 90 untuk Performance, Accessibility, Best Practices, dan SEO pada deployment representatif.

### 12. Deployment — belum terverifikasi

Artefak source-level berikut tersedia; keberadaannya tidak mengubah status
deployment nyata menjadi selesai:

- [x] Dockerfile multi-stage production untuk frontend dan backend (runtime + migration).
- [x] `.dockerignore` mengeluarkan dependency, build output, dan environment secret.
- [x] `compose.production.yaml` dengan dependency migration/backend/frontend dan healthcheck.
- [x] `.env.production.example` tanpa credential untuk input secret di luar repository.
- [x] GitHub Actions CI untuk format/lint/typecheck/test/build, validasi migration PostgreSQL, dan container build.

- [ ] Provider frontend dipilih dan Next.js production dideploy.
- [ ] Provider backend dipilih dan Fastify production dideploy.
- [ ] PostgreSQL production diprovision.
- [ ] Production environment variables/secret manager dikonfigurasi.
- [ ] `prisma migrate deploy` berhasil sebagai release job.
- [ ] Same-origin `/api/*` reverse proxy atau topologi CORS final dikonfigurasi.
- [ ] Domain, DNS, HTTPS, dan HSTS aktif.
- [ ] Production auth/login/logout diuji.
- [ ] Production aspirasi tersimpan dan tampil di CMS.
- [ ] Backup aktif dan restore diuji.
- [ ] Error monitoring privacy-safe dan alerting dikonfigurasi.
- [ ] Analytics privacy-conscious dikonfigurasi bila digunakan.

### 13. Content finalization — diselaraskan dengan CV

- [~] Nama, tagline, dan prinsip mengikuti CV; lima program telah dikembalikan ke versi awal sambil menunggu rekap final pemilik.
- [x] Biodata, enam pendidikan, dan sepuluh pengalaman organisasi telah dipindahkan dari CV; pengalaman kerja tidak diisi karena tidak dicantumkan.
- [x] Nomor telepon/WhatsApp dan email ditampilkan; Facebook terhubung ke kanal resmi yang diberikan pemilik, Instagram dipertahankan, dan ikon Twitter diganti menjadi identitas X.
- [x] Foto profil/OG dari CV tersedia; mask Askara hijau hasil ekstraksi PDF dipakai pada header/footer publik, sementara aset HMI tetap tersedia untuk konteks HMI/CMS yang relevan.
- [ ] Privacy statement dan periode retensi disetujui.
- [ ] Terminologi organisasi dan copy CTA diperiksa.
- [~] Identitas lama dan placeholder profil telah dihapus; domain fallback masih perlu diganti sebelum launch.

### 14. Penyempurnaan identitas dan program

- [x] Logo `img/LogoHMI.png` direkonstruksi sebagai SVG transparan dan dipasang konsisten.
- [x] Label gambar utama diubah menjadi “Calon Ketua Umum PB HMI”.
- [x] Seluruh label publik dan CMS menggunakan istilah “Program”.
- [~] Lima program lama dipertahankan dan dikembalikan ke isi awal; rekap final akan disiapkan pemilik.
- [x] Catatan footer diganti menjadi ajakan kolaborasi.
- [x] Semua tombol mendapat umpan balik hover/pressed sederhana dengan dukungan `prefers-reduced-motion`.
- [x] Tampilan tahun untuk dua pendidikan S2 dikosongkan.
- [x] Logo Askara dari referensi PDF diekstrak sebagai alpha mask tematik dan menggantikan logo publik pada header/footer.
- [x] Ikon program memakai bentuk asli hasil ekstraksi halaman 4: digital, jejaring, kaderisasi, kepemimpinan, dan profesionalisme.
- [x] Popup menampilkan sambutan dan transkripsi lengkap halaman 5–6 secara langsung dalam panel teks dengan scroll independen.

### 15. Paket koreksi publik September 2026

- [x] Label kartu Lima Pilar di Beranda dan slider Program diubah dari “Pelajari program” menjadi “Selengkapnya”.
- [x] Navigasi footer “Program dan Visi Misi” disederhanakan menjadi “Program”.
- [x] Footer memakai link Facebook `https://www.facebook.com/YusufSugiyarto` dan ikon brand X.
- [x] Panel Pendidikan dan Pengalaman Organisasi disejajarkan, dibuat full-height, diberi hierarki ikon/nomor, dan tetap responsif tanpa ruang kosong panel yang janggal.
- [x] Foto unggulan Dokumentasi Perjalanan memakai crop 4:5 baru dengan headroom dan fokus wajah yang aman; aset sumber tidak ditimpa.
- [x] Kelas Menengah Transformatif dan slider Lima Pilar didesain ulang; light/dark surface memiliki pasangan tema terpisah.
- [x] Kutipan QS. Al-‘Ankabut: 69 dipindah tepat sebelum CTA Sampaikan Aspirasi.
- [x] Toggle Bahasa Indonesia/English ditambahkan di sebelah CTA header dengan Server Action, cookie locale, HTML `lang`, terjemahan halaman publik, dan reduced-motion.
- [x] Halaman Kontak memakai aset `img/yusuf_aksi.jpg` melalui `next/image` dengan container responsif.
- [x] Penghitung total kunjungan selalu menampilkan angka terakhir/0 dan tetap memakai total kumulatif PostgreSQL yang tidak reset saat restart/deploy.
- [x] Validasi form aspirasi disatukan pada komponen reusable dan backend: semua field wajib, email valid, WhatsApp dimulai `08`, serta ringkasan error aksesibel.
- [x] Smoke visual Chrome headless desktop/mobile tidak menemukan horizontal overflow pada halaman Profil, Program, dan Kontak.
- [ ] Verifikasi akhir pada Safari macOS/iPhone dan perangkat Android fisik.

## P1 — Setelah MVP stabil

- [x] Export CSV dengan formula-injection protection.
- [x] Role ADMIN/EDITOR dan pembatasan aksi sensitif telah eksplisit; UI/manajemen akun multi-admin belum tersedia.
- [~] Atomicity audit tersedia melalui transaksi; viewer dan retensi audit operasional belum tersedia.
- [ ] Analytics tren/persebaran aspirasi tanpa mengekspos PII.
- [ ] Email notification privacy-safe.
- [~] Shared PostgreSQL rate-limit store tersedia; CAPTCHA/Turnstile ditunda sampai pola spam menuntutnya.
- [ ] Content preview dan cache invalidation eksplisit.

## P2 — Pengembangan lanjutan

- [ ] Artikel/gagasan, agenda, media center, dan dokumentasi kegiatan.
- [ ] Public progress tracker program.
- [ ] Regional aspiration analytics.
- [ ] AI-assisted tagging/summarization hanya setelah privacy impact assessment dan redaction PII.

## Flaw/gap yang perlu diprioritaskan

1. **Deployment belum terbukti.** Migration dan live integration terhadap Supabase sudah berhasil, tetapi frontend/backend belum dibuktikan berjalan pada environment production dengan domain dan HTTPS final.
2. **Trusted proxy bergantung deployment.** Parser sudah membatasi format, tetapi hop/CIDR final harus mengikuti proxy provider.
3. **Retensi belum operasional penuh.** Cleanup session otomatis tersedia, tetapi scheduler retensi aspirasi/IP/audit dan backup belum terverifikasi.
4. **Cache CMS/public.** Mutasi belum dibuktikan menginvalidasi cache public secara segera.
5. **Isi program belum final.** Lima program telah dikembalikan ke versi awal dan menunggu rekap final dari pemilik sebelum peluncuran.

## Definition of Done

Sebuah item baru boleh diubah menjadi `[x]` jika implementasi tersedia, lint/typecheck relevan lulus, test otomatis sesuai risiko lulus, error/loading/empty state ditangani, responsive dan accessibility diperiksa bila menyentuh UI, dampak keamanan diperiksa, dan dokumentasi diperbarui. Item production/manual hanya selesai setelah ada bukti pada environment/perangkat yang disebutkan.

## Final launch gate

- [x] Semua quality gate source lokal lulus; deployment/container tetap harus dibuktikan oleh CI/provider.
- [ ] Domain, DNS, HTTPS, database production, migration, dan restore backup terverifikasi.
- [ ] Admin login/logout dan seluruh endpoint mutasi production terverifikasi.
- [ ] Aspirasi production masuk database dan tampil di CMS.
- [x] Mobile/tablet/desktop emulation serta keyboard navigation diuji otomatis; perangkat fisik tetap perlu sebelum launch.
- [ ] Metadata/OG/sitemap/robots diverifikasi dari URL production.
- [~] Identitas/foto placeholder dan logo telah diganti serta credential tidak masuk repository/client bundle; domain resmi masih perlu ditetapkan.
