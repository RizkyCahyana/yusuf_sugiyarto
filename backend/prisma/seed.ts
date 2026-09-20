import { PrismaClient, Role, ContactType } from "../generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";
import { hash } from "bcryptjs";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) throw new Error("DATABASE_URL wajib diisi");
const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: databaseUrl }),
});

const programs = [
  [
    "transformasi-digital",
    "Transformasi Digital",
    "Pilar Modernisasi",
    "Disrupsi teknologi mengubah pola belajar, berorganisasi, dan melayani umat. HMI perlu bergerak dari penggunaan teknologi yang terpisah menuju ekosistem digital yang terintegrasi.",
    "Membangun organisasi berbasis data dan teknologi agar layanan kader lebih cepat, terbuka, dan menjangkau seluruh cabang.",
    [
      "Integrasi data dan layanan kader",
      "Digitalisasi pengetahuan serta arsip organisasi",
      "Penguatan literasi dan keamanan digital",
      "Pemanfaatan teknologi untuk kolaborasi dan pengambilan keputusan",
    ],
    [
      "Layanan digital organisasi digunakan lintas cabang",
      "Pengetahuan organisasi terdokumentasi dan mudah diakses",
      "Keputusan strategis didukung data yang dapat ditinjau",
    ],
  ],
  [
    "kolaborasi-nasional-global",
    "Kolaborasi Nasional & Global",
    "Pilar Modernisasi",
    "Tantangan zaman melampaui batas cabang, disiplin, dan negara. Jaringan HMI perlu diaktifkan sebagai ruang pertukaran gagasan dan kerja bersama.",
    "Memperluas jejaring nasional dan global untuk memperkuat kontribusi kader pada isu umat, bangsa, dan perkembangan dunia.",
    [
      "Forum kolaborasi lintas cabang dan alumni",
      "Kemitraan dengan kampus, profesi, dan lembaga strategis",
      "Pertukaran pengetahuan berskala nasional dan global",
      "Kolaborasi kajian atas isu kontemporer",
    ],
    [
      "Jejaring mitra aktif dan berkelanjutan",
      "Program lintas wilayah terlaksana",
      "Gagasan kader hadir dalam forum nasional dan global",
    ],
  ],
  [
    "kaderisasi-adaptif",
    "Kaderisasi Adaptif",
    "Pilar Modernisasi",
    "Perubahan sosial, ekonomi, dan teknologi menuntut sistem perkaderan yang tetap berakar pada nilai sekaligus peka terhadap kebutuhan generasi.",
    "Menghadirkan kaderisasi yang relevan, inklusif, dan mampu menyiapkan kader menghadapi persoalan nyata zamannya.",
    [
      "Pemetaan kebutuhan dan kompetensi kader",
      "Pembaruan metode belajar yang kontekstual",
      "Mentoring lintas generasi dan profesi",
      "Penguatan tradisi intelektual serta ruang diskusi sehat",
    ],
    [
      "Kurikulum responsif terhadap tantangan kontemporer",
      "Partisipasi kader meningkat lintas jenjang",
      "Lahir kader dengan kompetensi dan orientasi pengabdian",
    ],
  ],
  [
    "meritokrasi-kepemimpinan",
    "Meritokrasi Kepemimpinan",
    "Pilar Modernisasi",
    "Kepemimpinan organisasi harus tumbuh dari integritas, kapasitas, rekam pengabdian, dan kemampuan menjawab tantangan—bukan sekadar kedekatan atau jabatan.",
    "Membangun regenerasi kepemimpinan yang adil, terbuka, dan menempatkan kader terbaik pada ruang pengabdian yang tepat.",
    [
      "Standar kompetensi dan rekam jejak yang jelas",
      "Proses seleksi kepemimpinan yang transparan",
      "Ruang evaluasi dan umpan balik yang sehat",
      "Distribusi peran sesuai kapasitas serta pengabdian",
    ],
    [
      "Proses kepemimpinan dapat dipertanggungjawabkan",
      "Kader berprestasi memperoleh ruang tumbuh",
      "Budaya evaluasi berjalan konsisten",
    ],
  ],
  [
    "profesionalisme-organisasi",
    "Profesionalisme Organisasi",
    "Pilar Modernisasi",
    "Warisan nilai yang besar membutuhkan tata kelola yang tertib agar organisasi dapat bekerja konsisten, terukur, dan dipercaya.",
    "Memperkuat tata kelola HMI yang efektif, transparan, dan berorientasi pada manfaat nyata bagi kader serta masyarakat.",
    [
      "Standarisasi tata kelola dan layanan organisasi",
      "Perencanaan program berbasis kebutuhan",
      "Pelaporan kinerja yang transparan",
      "Evaluasi dampak dan perbaikan berkelanjutan",
    ],
    [
      "Program memiliki target dan penanggung jawab yang jelas",
      "Kinerja organisasi terdokumentasi",
      "Kepercayaan kader dan mitra meningkat",
    ],
  ],
] as const;

const education = [
  ["SDN 1 Purworejo", "Pendidikan Dasar", 2003, 2009, "Wonogiri, Jawa Tengah."],
  [
    "SMPN 6 Wonogiri",
    "Sekolah Menengah Pertama",
    2009,
    2012,
    "Wonogiri, Jawa Tengah.",
  ],
  [
    "SMAN 1 Wonogiri",
    "Ilmu Pengetahuan Alam (IPA)",
    2012,
    2015,
    "Wonogiri, Jawa Tengah.",
  ],
  [
    "Telkom University",
    "S1 Teknik Telekomunikasi",
    0,
    null,
    "Pendidikan sarjana di bidang teknik telekomunikasi.",
  ],
  [
    "Universitas Pancasila",
    "S2 Manajemen",
    0,
    null,
    "Pendidikan magister di bidang manajemen.",
  ],
  [
    "Universitas Padjadjaran",
    "S2 Ilmu Hukum",
    0,
    null,
    "Pendidikan magister di bidang ilmu hukum.",
  ],
] as const;

const organizations = [
  [
    "IKEMAS (Ikatan Keluarga Mahasiswa Sukoharjo–Wonogiri)",
    "Ketua Organisasi Daerah (Orda)",
    2017,
    2017,
    "Memimpin organisasi daerah mahasiswa Sukoharjo–Wonogiri.",
  ],
  [
    "BEM KEMA Telkom University",
    "Staf Administrasi Fasilitas",
    2017,
    2017,
    "Mengelola administrasi dan dukungan fasilitas organisasi mahasiswa.",
  ],
  [
    "House of Electra",
    "Kepala Divisi Humas dan Sponsorship",
    2018,
    2018,
    "Memimpin komunikasi publik dan kemitraan sponsorship.",
  ],
  [
    "HMI Komisariat IT Telkom",
    "Wakil Sekretaris Umum Litbang",
    2018,
    2018,
    "Mendukung agenda penelitian dan pengembangan komisariat.",
  ],
  [
    "BEM KEMA Telkom University",
    "Menteri Pemuda dan Olahraga (MENPORA)",
    2018,
    2018,
    "Mengelola agenda kepemudaan dan olahraga mahasiswa.",
  ],
  [
    "BEM KEMA Telkom University",
    "Presiden Mahasiswa",
    2019,
    2019,
    "Memimpin BEM KEMA Telkom University pada periode 2019.",
  ],
  [
    "BEM Seluruh Indonesia",
    "Koordinator Isu Teknologi",
    2019,
    2019,
    "Mengoordinasikan isu teknologi dalam jejaring BEM Seluruh Indonesia.",
  ],
  [
    "HMI Cabang Bandung",
    "Ketua Bidang PTKP",
    2021,
    2022,
    "Menggerakkan agenda perguruan tinggi, kemahasiswaan, dan kepemudaan.",
  ],
  [
    "HMI Cabang Bandung",
    "Ketua Umum",
    2022,
    2023,
    "Memimpin HMI Cabang Bandung pada periode 2022–2023.",
  ],
  [
    "Pengurus Besar HMI",
    "Ketua Bidang Penelitian & Kebijakan Strategis",
    2024,
    2026,
    "Memimpin agenda penelitian dan perumusan kebijakan strategis PB HMI.",
  ],
] as const;

const profileFields = {
  fullName: "Yusuf Sugiyarto",
  headline: "Ketua Bidang Penelitian & Kebijakan Strategis PB HMI 2024–2026",
  tagline: "HMI: Creative Minority",
  about:
    "Yusuf Sugiyarto percaya bahwa perjalanan hidup bukan sekadar tentang mencapai tujuan, melainkan proses menempa diri melalui ilmu, organisasi, dan pengabdian. Berangkat dari Wonogiri hingga menempuh pendidikan di Telkom University, setiap pengalaman menjadi ruang untuk belajar memimpin, melayani, dan bertumbuh. Beragam amanah di tingkat lokal maupun nasional membentuk pandangannya bahwa kepemimpinan adalah tentang menghadirkan manfaat bagi banyak orang.",
  vision:
    "Membangun HMI sebagai creative minority: kekuatan intelektual, moral, dan sosial yang modern tanpa kehilangan identitas keislaman dan keindonesiaannya.",
  missions: [
    "Transformasi Digital",
    "Kolaborasi Nasional & Global",
    "Kaderisasi Adaptif",
    "Meritokrasi Kepemimpinan",
    "Profesionalisme Organisasi",
  ],
  achievements: [
    "Presiden Mahasiswa BEM KEMA Telkom University (2019–2020)",
    "Ketua Umum HMI Cabang Bandung (2022–2023)",
    "Ketua Bidang Penelitian & Kebijakan Strategis PB HMI (2024–2026)",
  ],
  softSkills: [
    "Kepemimpinan organisasi",
    "Kolaborasi nasional dan global",
    "Kaderisasi adaptif",
    "Pengabdian masyarakat",
  ],
  hardSkills: [
    "Kebijakan publik",
    "Teknologi digital",
    "Ketenagakerjaan",
    "Pembangunan sumber daya manusia",
  ],
  photoUrl: "/images/yusuf-sugiyarto.jpg",
};

const educationRecords = () =>
  education.map(
    ([institution, major, startYear, endYear, description], sortOrder) => ({
      institution,
      major,
      startYear,
      endYear,
      description,
      sortOrder,
    }),
  );

const organizationRecords = () =>
  organizations.map(
    ([organization, position, startYear, endYear, description], sortOrder) => ({
      organization,
      position,
      startDate: new Date(`${startYear}-01-01T00:00:00.000Z`),
      endDate: new Date(`${endYear}-12-31T00:00:00.000Z`),
      description,
      sortOrder,
      isPublished: true,
    }),
  );

async function main() {
  const profile = await prisma.profile.upsert({
    where: { id: "primary-profile" },
    update: {
      ...profileFields,
      education: { deleteMany: {}, create: educationRecords() },
      workHistory: { deleteMany: {} },
      organizations: { deleteMany: {}, create: organizationRecords() },
    },
    create: {
      id: "primary-profile",
      ...profileFields,
      education: { create: educationRecords() },
      organizations: { create: organizationRecords() },
    },
  });
  await prisma.program.deleteMany();
  for (const [sortOrder, p] of programs.entries()) {
    await prisma.program.upsert({
      where: { slug: p[0] },
      update: {
        title: p[1],
        eyebrow: p[2],
        problem: p[3],
        objective: p[4],
        description: p[4],
        actionPlan: [...p[5]],
        indicators: [...p[6]],
        sortOrder,
        isPublished: true,
      },
      create: {
        slug: p[0],
        title: p[1],
        eyebrow: p[2],
        problem: p[3],
        objective: p[4],
        description: p[4],
        actionPlan: [...p[5]],
        indicators: [...p[6]],
        sortOrder,
      },
    });
  }
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  if (email && password) {
    if (password.length < 12 && process.env.NODE_ENV === "production")
      throw new Error("ADMIN_PASSWORD minimal 12 karakter");
    await prisma.user.upsert({
      where: { email },
      update: { passwordHash: await hash(password, 12) },
      create: {
        name: "Administrator",
        email,
        passwordHash: await hash(password, 12),
        role: Role.ADMIN,
      },
    });
  }
  await prisma.contact.deleteMany();
  const contacts = [
    [
      ContactType.PHONE,
      "WhatsApp",
      "+62 813-2915-3300",
      "https://wa.me/6281329153300",
    ],
    [
      ContactType.EMAIL,
      "Email",
      "yusufsugiyarto@gmail.com",
      "mailto:yusufsugiyarto@gmail.com",
    ],
    [
      ContactType.ADDRESS,
      "Alamat",
      "Jl. Tebet Timur 3A RT 04/RW 05, Tebet Timur, Kecamatan Tebet, Kota Jakarta Selatan",
      "https://www.google.com/maps/search/?api=1&query=Jl%20Tebet%20Timur%203A%20RT%2004%2FRW%2005%2C%20Tebet%20Timur%2C%20Kecamatan%20Tebet%2C%20Kota%20Jakarta%20Selatan",
    ],
  ] as const;
  for (const [sortOrder, item] of contacts.entries()) {
    await prisma.contact.upsert({
      where: { type_value: { type: item[0], value: item[2] } },
      update: { sortOrder },
      create: {
        type: item[0],
        label: item[1],
        value: item[2],
        url: item[3],
        sortOrder,
      },
    });
  }
  console.log(`Seed selesai untuk ${profile.fullName}`);
}

main().finally(() => prisma.$disconnect());
