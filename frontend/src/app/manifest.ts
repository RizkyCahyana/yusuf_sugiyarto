import type { MetadataRoute } from "next";
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Yusuf Sugiyarto",
    short_name: "YS",
    description:
      "HMI: Creative Minority — modernitas tanpa kehilangan identitas.",
    start_url: "/",
    display: "standalone",
    background_color: "#fafaf9",
    theme_color: "#08783f",
    icons: [
      { src: "/icon.png", sizes: "512x512", type: "image/png" },
      {
        src: "/apple-icon.png",
        sizes: "180x180",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
