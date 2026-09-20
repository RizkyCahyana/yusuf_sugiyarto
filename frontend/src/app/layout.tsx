import type { Metadata, Viewport } from "next";
import { PublicChrome } from "@/components/public-chrome";
import { getLocale } from "@/lib/locale-server";
import "./globals.css";
import "./public-refresh.css";
import "./public-final.css";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://yusuf-sugiyarto.example",
  ),
  title: {
    default: "Yusuf Sugiyarto | HMI: Creative Minority",
    template: "%s | Yusuf Sugiyarto",
  },
  description: "Profil Yusuf Sugiyarto dan gagasan Lima Pilar Modernisasi HMI.",
  applicationName: "Yusuf Sugiyarto",
  openGraph: {
    title: "Yusuf Sugiyarto",
    description:
      "HMI: Creative Minority — modernitas tanpa kehilangan identitas.",
    type: "website",
    locale: "id_ID",
    images: ["/images/yusuf-sugiyarto.jpg"],
  },
  twitter: { card: "summary_large_image" },
};
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0b1510",
};

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://yusuf-sugiyarto.example";
const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Yusuf Sugiyarto",
  birthDate: "1997-01-27",
  birthPlace: "Wonogiri",
  description:
    "Ketua Bidang Penelitian & Kebijakan Strategis PB HMI 2024–2026.",
  image: new URL("/images/yusuf-sugiyarto.jpg", siteUrl).toString(),
  url: siteUrl,
  knowsAbout: [
    "Kaderisasi",
    "Kepemimpinan",
    "Tata kelola organisasi",
    "Kebijakan publik",
    "Teknologi digital",
    "Ketenagakerjaan",
    "Pembangunan sumber daya manusia",
  ],
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const locale = await getLocale();
  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem("yusuf-site-theme");if(t==="dark"||t==="light")document.documentElement.dataset.theme=t}catch(e){}`,
          }}
        />
      </head>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
        <PublicChrome locale={locale}>{children}</PublicChrome>
      </body>
    </html>
  );
}
