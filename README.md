# Website Yusuf Sugiyarto

Monorepo website personal Yusuf Sugiyarto, kanal aspirasi, dan CMS profil. Frontend dan backend dipisahkan sebagai dua aplikasi yang berkomunikasi melalui REST API. Data profil, pendidikan, organisasi, serta gagasan program diselaraskan dengan `Profile_YusufSugiyarto.pdf`.

## Stack

- `frontend/`: Next.js App Router, React, TypeScript, Tailwind CSS.
- `backend/`: Fastify, TypeScript, Zod, Prisma.
- Database: PostgreSQL.
- Auth: opaque session token di cookie; hash token disimpan di PostgreSQL.
- Workspace: npm workspaces dari root.

Arsitektur, keputusan keamanan, dan flaw yang telah diaudit dijelaskan di [SYSTEM_ARCHITECTURE.md](./SYSTEM_ARCHITECTURE.md). Status implementasi yang dapat diverifikasi ada di [TASK.md](./TASK.md).

## Prasyarat

- Node.js 20 atau lebih baru.
- npm 10 atau lebih baru.
- PostgreSQL yang dapat diakses dari mesin pengembangan. Supabase PostgreSQL telah dipakai untuk verifikasi integrasi proyek ini.

## Setup lokal

1. Instal dependency dari root:

   ```bash
   npm install
   ```

2. Salin konfigurasi contoh dan ganti semua placeholder:

   ```bash
   cp backend/.env.example backend/.env
   cp frontend/.env.example frontend/.env.local
   ```

   Variable utama:

   | Variable          | Digunakan oleh  | Keterangan                                                            |
   | ----------------- | --------------- | --------------------------------------------------------------------- |
   | `DATABASE_URL`    | backend/Prisma  | PostgreSQL connection string                                          |
   | `AUTH_SECRET`     | backend         | minimal 32 karakter; untuk hash token sesi                            |
   | `RATE_LIMIT_SALT` | backend         | secret terpisah untuk pseudonimisasi identifier                       |
   | `FRONTEND_URL`    | backend         | exact origin frontend untuk CORS development                          |
   | `BACKEND_URL`     | frontend server | target internal same-origin rewrite `/api`; tidak diekspos ke browser |
   | `ADMIN_EMAIL`     | seed            | opsional, hanya untuk membuat admin                                   |
   | `ADMIN_PASSWORD`  | seed            | opsional, minimal 12 karakter                                         |

   Next.js hanya mengekspos variable berawalan `NEXT_PUBLIC_`; jangan pernah menaruh database URL atau secret pada prefix tersebut. `frontend/.env.local` mengatur target internal rewrite melalui `BACKEND_URL`. Script backend membaca `backend/.env` melalui `tsx --env-file=.env`, baik untuk development maupun seed. File `.env` dan `.env.local` sudah diabaikan Git.

   Untuk Supabase, salin connection string dari dashboard ke `backend/.env` tanpa menuliskannya ke dokumentasi, command history, atau repository. Gunakan TLS. Koneksi direct Supabase dapat membutuhkan jaringan IPv6; bila host development/deployment hanya mendukung IPv4, gunakan Supavisor **session pooler** yang disediakan project. Untuk migration, prioritaskan direct connection atau endpoint yang secara resmi direkomendasikan Supabase. Environment demo ini memakai mode TLS `require` karena rantai sertifikat lokal tidak dapat divalidasi; production harus memasang CA yang benar dan memakai verifikasi penuh. URL-encode karakter khusus pada password.

3. Generate Prisma client, terapkan migration yang sudah tersimpan, lalu seed:

   ```bash
   npm run db:generate
   npm run db:deploy
   npm run db:seed
   ```

   Migration awal `20260828182742_init` sudah tersedia. Gunakan `npm run db:migrate -- --name <nama>` hanya ketika mengembangkan perubahan schema baru; jangan gunakan perintah tersebut di production. Perintah migration membutuhkan PostgreSQL aktif. Seed profil dan program bersifat idempoten dan telah diverifikasi dua kali; admin hanya dibuat bila `ADMIN_EMAIL` dan `ADMIN_PASSWORD` terisi.

4. Jalankan kedua aplikasi:

   ```bash
   npm run dev
   ```

   Secara default frontend tersedia di `http://localhost:3000` dan backend di `http://localhost:4000`. Health check backend: `http://localhost:4000/health`.

Untuk log yang terpisah, jalankan di dua terminal. Perintah backend di bawah menjalankan `tsx watch --env-file=.env src/server.ts` dari folder workspace backend:

```bash
npm run dev --workspace backend
npm run dev --workspace frontend
```

## Perintah quality check

```bash
npm run lint
npm run typecheck
npm test
npm run build
npm run format:check
E2E_ADMIN_EMAIL=admin@demo.local E2E_ADMIN_PASSWORD='<password-demo>' \
  npm run test:e2e --workspace frontend
```

Hasil quality gate harus dibaca dari run CI/checkout terbaru; dokumentasi ini tidak
menganggap hasil run lama sebagai bukti kondisi working tree saat ini. Live API
integration terhadap Supabase yang pernah lulus juga bukan bukti
deployment/domain production atau kompatibilitas semua perangkat. Jalankan seluruh
perintah di atas setelah perubahan dan gunakan [TASK.md](./TASK.md) sebagai daftar
verifikasi yang masih terbuka.

## Artefak container (siap dirilis, belum dideploy)

Repository ini menyediakan Dockerfile multi-stage production untuk masing-masing
workspace: `backend/Dockerfile` menghasilkan target `runtime` dan `migration`,
sedangkan `frontend/Dockerfile` menghasilkan target `runtime`. Keduanya menjalankan
sebagai user non-root dan memiliki Docker `HEALTHCHECK`.

Template Compose production menjalankan migration satu kali sebelum backend,
menunggu backend sehat sebelum frontend, dan hanya mengikat port frontend ke
loopback host. Untuk mencoba di host yang sudah memiliki Docker Compose:

```bash
cp .env.production.example /tmp/yusuf-sugiyarto.production.env
# Edit /tmp/yusuf-sugiyarto.production.env; gunakan secret manager pada host sebenarnya.
docker compose --env-file /tmp/yusuf-sugiyarto.production.env \
  -f compose.production.yaml up -d --build
docker compose --env-file /tmp/yusuf-sugiyarto.production.env \
  -f compose.production.yaml ps
```

`.env.production.example` hanyalah template tanpa credential dan file berisi
secret harus disimpan di luar repository. Compose ini tidak menyediakan hosting,
reverse proxy HTTPS/TLS, domain/DNS, PostgreSQL terkelola, backup, restore drill,
monitoring, atau scheduler maintenance; seluruh item tersebut tetap menunggu
provider dan keputusan operasional yang nyata.

## Sumber data profil

Identitas, pendidikan, pengalaman organisasi, narasi Creative Minority, dan Lima Pilar Modernisasi HMI diselaraskan dengan `Profile_YusufSugiyarto.pdf`. Detail program pada website mengembangkan kelima pilar di PDF menjadi tujuan, langkah aksi, dan indikator yang lebih mudah dibaca. Kanal kontak yang telah dikonfirmasi tetap dikelola terpisah melalui CMS.

## Contoh deployment

Deployment production terdiri dari frontend, backend, dan PostgreSQL sebagai komponen terpisah. Pola yang disarankan menggunakan satu origin:

```text
https://domain.tld/*       -> deployment Next.js
https://domain.tld/api/*   -> deployment Fastify
```

Urutan release:

1. Jalankan lint, typecheck, test, dan build di CI.
2. Provision PostgreSQL production dengan TLS, backup, dan network policy.
3. Isi secret production melalui secret manager platform.
4. Jalankan migration satu kali dari release job:

   ```bash
   npm run db:deploy
   ```

5. Deploy backend dan verifikasi `/health`.
6. Deploy frontend dan arahkan `/api/*` melalui reverse proxy ke backend.
7. Verifikasi cookie `Secure`/`HttpOnly`, login/logout, submit aspirasi, CMS, domain, HTTPS, dan restore backup.

Jika frontend dan backend memakai origin berbeda, set `FRONTEND_URL` ke exact origin, kirim request dengan credentials, dan evaluasi `SameSite`, CORS, serta proteksi CSRF sebagaimana dijelaskan di dokumen arsitektur. Rate limit login/aspirasi memakai PostgreSQL bersama; evaluasi Redis terkelola bila trafik tinggi agar koneksi database tidak menjadi bottleneck.

Jangan menjalankan `prisma migrate dev` di production dan jangan menyimpan credential production dalam repository.
