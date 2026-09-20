import type { Contact, Profile, Program } from "./types";

export const fallbackProfile: Profile = {
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
  photoUrl: "/images/yusuf-sugiyarto.jpg",
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
  education: [
    {
      institution: "SDN 1 Purworejo",
      major: "Pendidikan Dasar",
      startYear: 2003,
      endYear: 2009,
      description: "Wonogiri, Jawa Tengah.",
    },
    {
      institution: "SMPN 6 Wonogiri",
      major: "Sekolah Menengah Pertama",
      startYear: 2009,
      endYear: 2012,
      description: "Wonogiri, Jawa Tengah.",
    },
    {
      institution: "SMAN 1 Wonogiri",
      major: "Ilmu Pengetahuan Alam (IPA)",
      startYear: 2012,
      endYear: 2015,
      description: "Wonogiri, Jawa Tengah.",
    },
    {
      institution: "Telkom University",
      major: "S1 Teknik Telekomunikasi",
      startYear: 0,
      description: "Pendidikan sarjana di bidang teknik telekomunikasi.",
    },
    {
      institution: "Universitas Pancasila",
      major: "S2 Manajemen",
      startYear: 0,
      description: "Pendidikan magister di bidang manajemen.",
    },
    {
      institution: "Universitas Padjadjaran",
      major: "S2 Ilmu Hukum",
      startYear: 0,
      description: "Pendidikan magister di bidang ilmu hukum.",
    },
  ],
  workHistory: [],
  organizations: [
    {
      organization: "IKEMAS (Ikatan Keluarga Mahasiswa Sukoharjo–Wonogiri)",
      position: "Ketua Organisasi Daerah (Orda)",
      startDate: "2017-01-01",
      endDate: "2017-12-31",
      description: "Memimpin organisasi daerah mahasiswa Sukoharjo–Wonogiri.",
    },
    {
      organization: "BEM KEMA Telkom University",
      position: "Staf Administrasi Fasilitas",
      startDate: "2017-01-01",
      endDate: "2017-12-31",
      description:
        "Mengelola administrasi dan dukungan fasilitas organisasi mahasiswa.",
    },
    {
      organization: "House of Electra",
      position: "Kepala Divisi Humas dan Sponsorship",
      startDate: "2018-01-01",
      endDate: "2018-12-31",
      description: "Memimpin komunikasi publik dan kemitraan sponsorship.",
    },
    {
      organization: "HMI Komisariat IT Telkom",
      position: "Wakil Sekretaris Umum Litbang",
      startDate: "2018-01-01",
      endDate: "2018-12-31",
      description: "Mendukung agenda penelitian dan pengembangan komisariat.",
    },
    {
      organization: "BEM KEMA Telkom University",
      position: "Menteri Pemuda dan Olahraga (MENPORA)",
      startDate: "2018-01-01",
      endDate: "2018-12-31",
      description: "Mengelola agenda kepemudaan dan olahraga mahasiswa.",
    },
    {
      organization: "BEM KEMA Telkom University",
      position: "Presiden Mahasiswa",
      startDate: "2019-01-01",
      endDate: "2019-12-31",
      description: "Memimpin BEM KEMA Telkom University pada periode 2019.",
    },
    {
      organization: "BEM Seluruh Indonesia",
      position: "Koordinator Isu Teknologi",
      startDate: "2019-01-01",
      endDate: "2019-12-31",
      description:
        "Mengoordinasikan isu teknologi dalam jejaring BEM Seluruh Indonesia.",
    },
    {
      organization: "HMI Cabang Bandung",
      position: "Ketua Bidang PTKP",
      startDate: "2021-01-01",
      endDate: "2022-12-31",
      description:
        "Menggerakkan agenda perguruan tinggi, kemahasiswaan, dan kepemudaan.",
    },
    {
      organization: "HMI Cabang Bandung",
      position: "Ketua Umum",
      startDate: "2022-01-01",
      endDate: "2023-12-31",
      description: "Memimpin HMI Cabang Bandung pada periode 2022–2023.",
    },
    {
      organization: "Pengurus Besar HMI",
      position: "Ketua Bidang Penelitian & Kebijakan Strategis",
      startDate: "2024-01-01",
      endDate: "2026-12-31",
      description:
        "Memimpin agenda penelitian dan perumusan kebijakan strategis PB HMI.",
    },
  ],
};

const programRows: [
  string,
  string,
  string,
  string,
  string,
  string[],
  string[],
][] = [
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
];

export const fallbackPrograms: Program[] = programRows.map(
  ([slug, title, eyebrow, problem, objective, actionPlan, indicators]) => ({
    slug,
    title,
    eyebrow,
    problem,
    objective,
    description: objective,
    actionPlan,
    indicators,
  }),
);

export const fallbackContacts: Contact[] = [
  {
    type: "PHONE",
    label: "WhatsApp",
    value: "+62 813-2915-3300",
    url: "https://wa.me/6281329153300",
  },
  {
    type: "EMAIL",
    label: "Email",
    value: "yusufsugiyarto@gmail.com",
    url: "mailto:yusufsugiyarto@gmail.com",
  },
  {
    type: "ADDRESS",
    label: "Alamat",
    value:
      "Jl. Tebet Timur 3A RT 04/RW 05, Tebet Timur, Kecamatan Tebet, Kota Jakarta Selatan",
    url: "https://www.google.com/maps/search/?api=1&query=Jl%20Tebet%20Timur%203A%20RT%2004%2FRW%2005%2C%20Tebet%20Timur%2C%20Kecamatan%20Tebet%2C%20Kota%20Jakarta%20Selatan",
  },
];
