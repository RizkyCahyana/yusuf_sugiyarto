# Aset profil dan panduan foto

Semua aset pada folder ini berasal dari `Profile_YusufSugiyarto.pdf` milik proyek.
Mask transparan memakai bentuk asli PDF; CSS `currentColor` mengatur hijau terang/gelap.

| Aset                                  | Sumber    | Penempatan                              |
| ------------------------------------- | --------- | --------------------------------------- |
| askara-mask.png, askara-mark-mask.png | Halaman 2 | Header, footer, dock, popup             |
| pilar-*.png                           | Halaman 4 | Kartu program, carousel, detail program |
| signature-mask.png                    | Halaman 6 | Penutup sambutan                        |
| yusuf-formal.webp                     | Halaman 4 | Hero Profil                             |
| yusuf-portrait-mono.webp              | Halaman 2 | Galeri Profil                           |
| yusuf-gerakan.webp                    | Halaman 3 | Foto narasi Program                     |

Teks lengkap halaman 5–6 tersimpan di `frontend/src/lib/welcome-letter.ts`.
Popup menampilkan ringkasan; buka **Baca sambutan lengkap** untuk membaca seluruhnya.
Menu **Baca sambutan** di footer membuka popup kembali.

## Mengisi rectangle kosong di Kontak

1. Siapkan foto landscape **1600 × 1000 px (8:5)**, idealnya WebP/JPEG di bawah 400 KB.
2. Simpan sebagai `frontend/public/images/profile/kolaborasi.webp`.
3. Isi `collaboration: "/images/profile/kolaborasi.webp"` di `frontend/src/lib/media-content.ts`.

`MediaSlot` memesan ruang 8:5 dan menampilkan rectangle bila path belum diisi atau
gambar gagal dimuat. Tidak perlu mengubah CSS atau struktur halaman.
Untuk potret Profil gunakan rasio 4:5; foto narasi Program menggunakan bidang landscape.

## Ekstraksi ulang

Render halaman PDF pada 2160 × 2640 px dengan orientasi tegak, simpan sebagai
`profile-page-N-final.png`. Jalankan:

```sh
node frontend/scripts/extract-profile-assets.mjs /folder/hasil-render
```

Skrip mengambil bentuk, transparansi, crop, dan kompresi dari sumber; tidak
menghasilkan foto baru. Render mentah dan dokumen PDF penuh tidak disajikan ke
publik karena halaman lain memuat informasi di luar kebutuhan situs.
