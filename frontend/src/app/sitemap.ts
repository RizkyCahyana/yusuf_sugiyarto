import type { MetadataRoute } from "next";
import { getPrograms } from "@/lib/api";
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base =
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://yusuf-sugiyarto.example";
  const routes = ["", "/profile", "/program", "/kontak", "/aspirasi"];
  return [
    ...routes.map((route) => ({
      url: `${base}${route}`,
      lastModified: new Date(),
      changeFrequency:
        route === "" ? ("weekly" as const) : ("monthly" as const),
      priority: route === "" ? 1 : 0.8,
    })),
    ...(await getPrograms()).map((item) => ({
      url: `${base}/program/${item.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
