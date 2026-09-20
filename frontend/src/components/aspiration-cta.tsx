import Link from "next/link";
import { Send } from "lucide-react";
import type { Locale } from "@/lib/i18n";

export function AspirationCta({ locale = "id" }: { locale?: Locale }) {
  return (
    <section className="container">
      <div className="cta-panel">
        <div>
          <span className="eyebrow light-text">
            {locale === "id" ? "Sampaikan aspirasi" : "Share your voice"}
          </span>
          <h2>
            {locale === "id"
              ? "Setiap aspirasi adalah bahan bakar perubahan."
              : "Every voice can help drive change."}
          </h2>
          <p>
            {locale === "id"
              ? "Sampaikan gagasan, kritik, atau kebutuhan cabang Anda. Data pribadi tidak akan ditampilkan kepada publik."
              : "Share your ideas, constructive criticism, or branch needs. Personal data will never be displayed publicly."}
          </p>
        </div>
        <Link href="/aspirasi" className="button button-light">
          <Send aria-hidden="true" size={19} />{" "}
          {locale === "id" ? "Sampaikan Aspirasi" : "Share Your Voice"}
        </Link>
      </div>
    </section>
  );
}
