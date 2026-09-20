# Arsitektur Sistem

## 1. Tujuan dan ruang lingkup

Sistem ini adalah website personal Yusuf Sugiyarto sekaligus kanal aspirasi dan CMS profil. Arsitektur yang menjadi sumber kebenaran adalah **monorepo dengan dua aplikasi terpisah**:

- `frontend/`: Next.js App Router + TypeScript untuk halaman publik dan CMS.
- `backend/`: Fastify + TypeScript, REST API, Prisma ORM, dan PostgreSQL.

Frontend tidak mengakses database dan tidak memuat secret. Semua pembacaan serta mutasi data persisten dilakukan backend. Data profil, program, kontak, organisasi, akun admin, sesi, audit, dan aspirasi berada di PostgreSQL.

## 2. Diagram konteks

```text
Browser
  │ HTTPS
  ▼
Next.js frontend (public pages + admin UI)
  │ /api/* melalui same-origin reverse proxy (disarankan)
  │ atau CORS ber-allowlist untuk development
  ▼
Fastify REST API
  ├── validasi Zod
  ├── auth + authorization
  ├── rate limit + security headers
  └── Prisma
       ▼
    PostgreSQL
```

Pemisahan ini adalah batas keamanan dan deployment, bukan hanya pemisahan folder. Next.js bertanggung jawab atas rendering, interaksi, metadata, dan pengalaman pengguna. Fastify menjadi satu-satunya pemilik aturan bisnis, autentikasi, validasi server, serta akses database.

## 3. Struktur repository

```text
.
├── frontend/                 # Next.js; tidak memiliki akses Prisma
├── backend/
│   ├── src/                  # Fastify, schema, security, database client
│   └── prisma/               # schema dan seed
├── design-system/            # pedoman visual; bukan runtime aplikasi
├── package.json              # npm workspaces dan perintah lint/build/test
├── .env.example
├── README.md
└── TASK.md
```

Kontrak lintas aplikasi adalah HTTP/JSON. Type bersama dapat ditambahkan kelak sebagai workspace ketiga, tetapi backend tetap melakukan validasi runtime dan tidak boleh mempercayai tipe TypeScript dari client.

## 4. Tanggung jawab komponen

### Frontend Next.js

- Halaman publik: beranda, profil, program, kontak, dan aspirasi.
- Halaman admin: login, ringkasan, pengelolaan konten, dan aspirasi.
- Validasi client untuk umpan balik cepat; bukan kontrol keamanan.
- Memanggil REST API dengan cookie sesi (`credentials: include` bila lintas origin).
- Menampilkan loading, empty, success, dan error state.
- Menggunakan dummy/fallback lokal untuk foto atau informasi yang belum final. Dummy harus mudah dikenali dan tidak boleh dianggap data resmi.

### Sistem visual dan pengalaman publik

- Identitas visual publik menggunakan bentuk Askara yang diekstrak langsung dari
  PDF sebagai alpha mask pada header, footer utama, dan footer dock. Mask memakai
  `currentColor` sehingga bentuk referensi tetap utuh dan warnanya dapat menjadi
  hijau yang sesuai untuk mode terang maupun gelap. Logo HMI tetap dipakai hanya
  pada konteks yang memang mewakili HMI, bukan sebagai identitas utama chrome situs.
- Palet publik memakai hijau Askara, off-white, dan permukaan gelap bernuansa
  hijau. Tipografi publik memakai satu keluarga sans-serif sistem dengan skala
  responsif; body copy ditargetkan sekitar 16 px dengan line-height 1.5–1.75.
- Halaman publik memakai pola editorial modular/bento: hierarki judul yang
  konsisten, foto sebagai bagian dari storytelling, kartu beradius sedang, dan
  whitespace yang cukup. Footer navigation dan footer dock dipertahankan sebagai
  pola navigasi/identitas yang konsisten.
- Scroll halaman menggunakan perilaku native browser. Lenis, smooth scrolling
  global, scroll-timeline, sticky storytelling, serta listener yang mengubah
  header/dock saat scroll tidak menjadi bagian arsitektur publik karena menambah
  kerja main thread dan membuat pengalaman terasa berat. Smooth movement hanya
  boleh dipakai secara lokal untuk state UI yang bermakna dan wajib menghormati
  `prefers-reduced-motion`.
- Popup selamat datang adalah dialog native yang tampil satu kali per sesi
  browser, bukan pada setiap pergantian route. Dialog dapat ditutup lewat tombol,
  klik backdrop, atau Escape; focus trapping mengikuti perilaku native `<dialog>`.
  Copy pembuka dan transkripsi lengkap halaman 5–6
  `Profile_YusufSugiyarto.pdf` tersedia langsung di panel teks yang dapat di-scroll
  secara independen. Ukuran dialog dan panel foto tetap statis agar potret selalu
  terlihat utuh. Dialog memakai potret formal dan tanda tangan yang diekstrak dari
  dokumen tersebut.
- Simbol Lima Pilar diekstrak langsung dari bentuk pada halaman 4 PDF dan mengikuti
  urutan: Transformasi
  Digital, Kolaborasi Nasional & Global, Kaderisasi Adaptif, Meritokrasi
  Kepemimpinan, dan Profesionalisme Organisasi. Seluruh simbol memakai warna
  hijau tematik dan tidak memakai emoji.
- Aset foto yang tersedia dari PDF ditempatkan pada beranda, Profil, dan Program
  dengan `next/image`, ukuran/aspect ratio yang dipesan di CSS, alt text bermakna,
  dan lazy loading untuk gambar non-LCP. Bila aset masa depan belum tersedia,
  gunakan media placeholder dengan aspect ratio eksplisit dan label internal;
  placeholder tidak boleh dipresentasikan sebagai dokumentasi faktual.
- Halaman Kontak memuat formulir aspirasi secara langsung setelah daftar kanal;
  pengguna tidak harus melewati CTA atau navigasi tambahan. Route `/aspirasi`
  tetap tersedia sebagai deep link mandiri dan menggunakan komponen form yang sama.
- Lima Pilar pada halaman Program memakai carousel showcase horizontal tanpa
  auto-rotation. Slide aktif berada di pusat dan sebagian slide berikutnya tetap
  terlihat sebagai affordance; kontrol tombol, pagination, keyboard panah,
  scroll-snap, serta `prefers-reduced-motion` tetap tersedia. Tampilan light mode
  memakai surface putih/hijau muda, sedangkan komposisi gelap hanya aktif pada
  dark mode.
- Kelas Menengah Transformatif mempertahankan “Kelas Menengah” sebagai sumber
  utama data dan menampilkan delapan profesi sebagai node kartu dua kolom. Pola
  ini menggantikan orbit lingkaran absolut agar label panjang tidak bertabrakan,
  lebih stabil secara responsif, dan tetap menjaga relasi pusat-ke-profesi.
- Foto “Dari Gagasan Menuju Gerakan” memakai kembali komposisi full-bleed `cover`
  dengan caption overlay dan gradient pelindung kontras, sesuai desain awal bagian
  tersebut.
- Justify hanya diterapkan pada paragraf naratif panjang. Judul, label, tombol,
  metadata, dan teks UI ringkas mempertahankan alignment natural untuk menjaga
  keterbacaan dan mencegah jarak kata berlebihan.
- Bahasa publik memakai locale `id`/`en` yang disimpan pada cookie
  `yusuf-site-language` berumur satu tahun. Cookie tidak memuat identitas pengguna,
  diatur melalui Server Action, dibaca saat server render, lalu menentukan atribut
  `lang`, navigasi, halaman publik, form, CTA, serta terjemahan program. Bahasa
  Indonesia tetap menjadi default. Konten CMS yang tidak memiliki pasangan
  terjemahan eksplisit tetap memakai sumber aslinya agar sistem tidak membuat
  terjemahan otomatis yang belum disetujui.
- Tombol bahasa adalah segmented control di sebelah CTA header. Gerak indikator
  hanya menandai perubahan state, memakai transform singkat yang dapat diinterupsi,
  dan dinonaktifkan menjadi perpindahan statis saat `prefers-reduced-motion` aktif.
- Aset kontak memakai `img/yusuf_aksi.jpg` yang disalin ke public asset dengan
  ukuran responsif. Potret unggulan galeri memakai versi crop 4:5 non-destruktif
  `yusuf-portrait-focus.png`; foto sumber tetap dipertahankan.

### Backend Fastify

- Endpoint publik untuk profil, program, kontak, serta pembuatan aspirasi.
- Endpoint autentikasi dan endpoint `/api/admin/*` yang terlindungi.
- Validasi Zod, normalisasi input, pembatasan ukuran body, dan respons error tanpa stack trace.
- Pembuatan nomor referensi aspirasi, audit perubahan admin yang atomic melalui transaksi Prisma, dan akses database.
- Security headers, CORS allowlist, cookie, dan rate limit.

### PostgreSQL dan Prisma

- Menyimpan `User`, `Session`, `Profile`, `Education`, `WorkExperience`, `OrganizationExperience`, `Program`, `Contact`, `Aspiration`, dan `AuditLog`.
- Migration adalah satu-satunya cara perubahan schema production.
- Seed harus idempoten dan hanya membuat admin ketika kredensial seed diberikan lewat environment.

## 5. Kontrak REST

### Publik

```text
GET  /health
GET  /api/profile
GET  /api/programs
GET  /api/programs/:slug
GET  /api/contacts
POST /api/aspirations
```

### Autentikasi

```text
POST /api/auth/login
POST /api/auth/logout
GET  /api/auth/session
```

### Admin

```text
GET                 /api/admin/dashboard
GET|PUT             /api/admin/profile
GET|POST            /api/admin/programs
PUT|DELETE          /api/admin/programs/:id
GET|POST            /api/admin/contacts
PUT|DELETE          /api/admin/contacts/:id
GET|POST            /api/admin/organizations
PUT|DELETE          /api/admin/organizations/:id
GET                 /api/admin/aspirations
GET                 /api/admin/aspirations/export
GET                 /api/admin/aspirations/:id
PATCH               /api/admin/aspirations/:id/status
PATCH               /api/admin/aspirations/:id/note
```

Respons sukses pembuatan aspirasi adalah HTTP 201 dan nomor referensi. Payload tidak valid adalah HTTP 400, belum terautentikasi HTTP 401, data duplikat HTTP 409, dan error internal HTTP 500 tanpa detail sensitif.

## 6. Autentikasi dan sesi

Sistem menggunakan **opaque database session**, bukan JWT dan bukan Auth.js:

1. Admin mengirim email dan kata sandi melalui HTTPS.
2. Backend membandingkan password dengan hash bcrypt.
3. Backend membuat token acak berentropi tinggi.
4. Hanya hash token yang disimpan pada tabel `Session`; token mentah hanya berada di cookie browser.
5. Cookie `HttpOnly`, `Secure` pada production, `SameSite=Lax`, memiliki expiry, dan dikirim pada setiap request admin.
6. Logout menghapus sesi database dan cookie.

Keuntungan opaque session adalah pencabutan sesi dapat dilakukan langsung. Konsekuensinya, pengecekan sesi membutuhkan database. Sesi kedaluwarsa perlu dibersihkan berkala; perubahan password atau penonaktifan user seharusnya menghapus seluruh sesi user tersebut.

`ADMIN_PASSWORD` hanya untuk proses seed, minimal 12 karakter, dan tidak boleh menjadi password contoh di production. Untuk production gunakan password manager dan rotasi bila pernah terekspos.

## 7. Origin, cookie, CORS, dan CSRF

Topologi production yang disarankan adalah satu origin publik:

```text
https://example.org/*       -> Next.js
https://example.org/api/*   -> Fastify (reverse proxy)
```

Dengan pola ini browser melihat request sebagai same-origin, cookie lebih mudah dikonfigurasi, dan permukaan CORS mengecil. Pastikan proxy meneruskan scheme/IP tepercaya, batas ukuran request, dan tidak mengekspos port database.

Dalam development, frontend (`localhost:3000`) dapat mengakses backend (`localhost:4000`) melalui CORS dengan **satu origin eksplisit**, `credentials: true`, dan daftar method terbatas. Jangan memakai wildcard origin bersama credential.

`SameSite=Lax` membantu mengurangi CSRF tetapi bukan pengganti kontrol penuh jika production memakai origin/site berbeda atau menerima mutasi lintas-site. Jika deployment benar-benar cross-site, tetapkan cookie `SameSite=None; Secure`, allowlist origin secara ketat, dan tambahkan CSRF token/double-submit atau pemeriksaan `Origin` pada semua mutasi. Hindari menaruh token sesi di `localStorage`.

## 8. Alur aspirasi dan privasi

```text
Form -> validasi client -> POST /api/aspirations
     -> rate limit -> validasi/normalisasi server
     -> INSERT PostgreSQL -> HTTP 201 + reference number
```

- Aspirasi tidak dipublikasikan dan hanya dapat dibaca admin terautentikasi.
- Consent wajib dan privacy notice harus menjelaskan tujuan, field, masa simpan, serta kanal permintaan penghapusan.
- Seluruh field form aspirasi wajib. Email harus lolos format alamat email standar;
  WhatsApp harus berupa 10–15 digit dan dimulai dengan `08`. Aturan yang sama
  diterapkan pada validasi client dan Zod backend, sehingga semua entry point yang
  memakai komponen form bersama memiliki perilaku identik. Kegagalan validasi
  menampilkan ringkasan error yang dapat difokuskan dan tetap mempertahankan error
  inline pada setiap field.
- IP mentah tidak disimpan. Hash IP yang diberi salt hanya boleh digunakan untuk mitigasi abuse dan bukan dianggap anonim sempurna.
- Jangan masukkan isi aspirasi atau data kontak ke log aplikasi, analytics, error tracker, atau layanan AI tanpa dasar dan kontrol privasi yang jelas.

### Retensi yang direkomendasikan

- Sesi kedaluwarsa: hapus otomatis maksimal 7 hari setelah expiry.
- Hash IP/rate-limit identifier: hapus atau lepaskan dari aspirasi setelah 30 hari bila tidak ada insiden abuse.
- Aspirasi aktif: tinjau setelah 12 bulan; hapus atau anonimisasi maksimal 24 bulan setelah selesai/diarsipkan kecuali ada kewajiban sah yang terdokumentasi.
- Audit log: simpan 12 bulan, lalu hapus/anonymize metadata sensitif.
- Backup mengikuti masa simpan terbatas (contoh 30 hari) dan penghapusan akan efektif setelah backup berputar keluar.

Angka tersebut adalah baseline operasional, bukan nasihat hukum. Pemilik sistem perlu menetapkan kebijakan final sesuai kebutuhan organisasi dan regulasi yang berlaku.

## 9. Rate limiting dan anti-spam

Rate limit login dan aspirasi memakai tabel bucket PostgreSQL sehingga konsisten lintas proses/instance yang memakai database yang sama. Bucket memakai fixed window dan dibersihkan berkala. Untuk skala atau trafik jauh lebih tinggi, evaluasi Redis terkelola agar beban abuse tidak ikut menghabiskan pool koneksi database; dokumentasikan key prefix, TTL, dan perilaku ketika store gagal.

Karena IP dapat dipalsukan bila `trustProxy` salah, backend hanya boleh mempercayai jumlah/proxy hop dari load balancer yang dikenal. Tambahkan Turnstile/CAPTCHA bila spam nyata meningkat. Rate limit tidak menggantikan password policy, validasi, monitoring, dan alerting.

## 10. Keamanan dan operasional

- HTTPS wajib di production; aktifkan HSTS setelah domain/subdomain siap.
- Secret hanya dari secret manager/environment platform dan tidak memakai prefix public Next.js.
- CORS allowlist, cookie policy, dan URL API harus berbeda per environment.
- Prisma mengurangi SQL injection melalui query terparameterisasi, tetapi authorization dan validasi tetap wajib.
- Render teks pengguna sebagai teks, bukan HTML mentah. Jika rich text ditambahkan, sanitasi dengan allowlist di server dan client.
- Batasi ukuran payload dan panjang setiap field; jangan mengandalkan sanitasi untuk memperbaiki input tidak valid.
- Mutasi CMS dan audit log dijalankan dalam transaksi database agar tidak terpisah; perubahan lintas layanan di masa depan memerlukan outbox.
- Backup terenkripsi perlu diuji dengan restore drill; status “backup aktif” tidak cukup tanpa bukti pemulihan.
- Error monitoring harus menghapus cookie, password, token, isi aspirasi, email, dan telepon.

## 11. Caching dan konsistensi

Konten publik boleh di-cache dengan TTL/revalidation pendek. Mutasi CMS harus menginvalidasi cache terkait agar perubahan tidak tampak tertunda. Endpoint auth, admin, dan aspirasi harus `no-store`. CDN tidak boleh menyimpan respons yang mengandung cookie atau data admin.

### Penghitung kunjungan

`SiteTraffic` menyimpan total kumulatif di PostgreSQL melalui operasi atomic
`upsert`/increment pada `POST /api/traffic`; data tidak bergantung pada memory
instance dan tidak di-reset saat frontend atau backend restart. Browser menghitung
satu kunjungan per sesi melalui `sessionStorage`, menyimpan angka terakhir untuk
fallback presentasi di `localStorage`, lalu selalu menampilkan angka (minimal `0`)
alih-alih placeholder “—”. Persistensi production tetap mensyaratkan PostgreSQL
yang durable dan migration `20260907000000_add_site_traffic` dijalankan.

## 12. Deployment

Frontend dan backend dapat memakai platform berbeda, tetapi diperlakukan sebagai dua artefak:

1. Build dan test kedua workspace.
2. Provision PostgreSQL terkelola dengan TLS, backup, dan akses jaringan minimum.
3. Jalankan `prisma migrate deploy` sebagai release job tunggal sebelum mengaktifkan versi backend baru.
4. Deploy backend, cek `/health`, lalu deploy frontend dengan URL/proxy API yang benar.
5. Seed production hanya bila diperlukan; jangan otomatis mengulang password admin setiap deploy.
6. Konfigurasikan reverse proxy `/api`, domain, DNS, HTTPS, observability, dan rollback.
7. Lakukan smoke test login, logout, public reads, submit aspirasi, perubahan status, serta pantau log tanpa PII.

Jangan menjalankan `prisma migrate dev` di production. Untuk migration yang berisiko, gunakan pola expand/migrate/contract agar versi lama dan baru tetap kompatibel selama rollout.

### 12.1 Artefak container di repository

Dockerfile production multi-stage tersedia di `backend/Dockerfile` dan
`frontend/Dockerfile`. Target backend `migration` menjalankan
`prisma migrate deploy`, sedangkan target `runtime` hanya membawa dependency
production dan hasil build. Target frontend `runtime` membawa hasil build
Next.js. Kedua runtime berjalan sebagai user non-root dan mendeklarasikan
healthcheck.

`compose.production.yaml` adalah template single-host: migration harus berhasil,
backend harus sehat, lalu frontend dijalankan. Healthcheck yang tersedia adalah
liveness HTTP (`/health` dan `/`); ia tidak menggantikan monitoring koneksi
database atau smoke test bisnis. Backend hanya diekspos di network Compose dan
frontend diikat ke loopback host agar reverse proxy di host dapat mengakhiri TLS.
`.env.production.example` tidak berisi credential dan harus
disalin ke lokasi di luar repository sebelum diisi.

Artefak tersebut memvalidasi packaging dan urutan startup, tetapi bukan bukti
deployment. Provider hosting, domain/DNS, HTTPS/HSTS, PostgreSQL production,
secret manager, backup/restore, monitoring, dan scheduler maintenance tetap
merupakan pekerjaan operasional yang belum dilakukan.

## 13. Flaw arsitektur lama dan mitigasi

| Flaw/asumsi lama                                | Risiko                                              | Keputusan/mitigasi                                                       |
| ----------------------------------------------- | --------------------------------------------------- | ------------------------------------------------------------------------ |
| Dokumen menyebut monolit Next.js Route Handlers | Deployment dan ownership API ambigu                 | Tegaskan Next.js frontend terpisah dari Fastify REST backend             |
| Auth.js/JWT tersirat, berbeda dari kode         | Implementasi keamanan sulit diaudit                 | Dokumentasikan opaque token, hash token di DB, expiry, dan revocation    |
| CORS disebut sekilas                            | Cookie gagal atau origin berbahaya diterima         | Same-origin proxy sebagai default; allowlist eksplisit untuk development |
| `SameSite=Lax` dianggap cukup                   | Mutasi cross-site dapat terkena CSRF                | Origin check/CSRF token jika topologi lintas-site                        |
| Rate limit tanpa model scale-out                | Limit mudah dilewati pada banyak instance           | Bucket PostgreSQL terdistribusi; evaluasi Redis bila trafik bertambah    |
| `trustProxy: true` tanpa batas topologi         | Identitas IP dapat keliru/spoofed                   | Percayai hanya proxy/hop yang diketahui pada production                  |
| Tidak ada kebijakan retensi                     | PII tersimpan tanpa batas                           | Jadwal hapus/anonimisasi aspirasi, IP hash, session, audit, dan backup   |
| Backup hanya checklist                          | Restore mungkin tidak pernah berhasil               | Restore drill berkala dan bukti operasional                              |
| Cache public tidak punya invalidasi             | CMS dan halaman publik tidak konsisten              | Revalidation/invalidation setelah mutasi                                 |
| Dummy dapat tampak sebagai fakta                | Informasi kandidat keliru terpublikasi              | Label placeholder, content review, dan launch gate tanpa dummy           |
| Audit log terpisah dari mutasi                  | Mutasi berhasil tetapi audit gagal, atau sebaliknya | Transaksi Prisma; gunakan outbox bila kelak melibatkan layanan lain      |

## 14. Batas MVP dan keputusan tertunda

MVP mencakup lima halaman publik, form aspirasi tersimpan, login admin, dashboard, CRUD program/organisasi/kontak, pengelolaan status/catatan aspirasi, filter tanggal, dan export CSV. Manajemen akun multi-admin, analytics, notifikasi email, AI tagging, dan media center bukan syarat MVP.

Domain, data kandidat resmi, kontak/social link resmi, foto profesional, provider hosting, database production, monitoring, retensi final, dan konfigurasi backup memerlukan keputusan/verifikasi pemilik. Semua itu harus tetap berstatus belum selesai sampai diverifikasi di environment production.
