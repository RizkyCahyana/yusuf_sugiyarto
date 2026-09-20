import type { Metadata } from "next";
import { ShieldCheck } from "lucide-react";
import { AspirationForm } from "@/components/aspiration-form";
import { getLocale } from "@/lib/locale-server";

export const metadata: Metadata = {
  title: "Sampaikan Aspirasi",
  description:
    "Kanal aman untuk menyampaikan gagasan, kritik, dan kebutuhan kader HMI.",
};
export default async function AspirationPage() {
  const locale = await getLocale();
  return (
    <section className="page-hero form-page">
      <div className="container form-layout">
        <div className="form-intro">
          <span className="eyebrow">
            {locale === "id" ? "Kanal aspirasi" : "Public voice channel"}
          </span>
          <h1>
            {locale === "id"
              ? "Suara Anda, bagian dari gerak kita."
              : "Your voice is part of our movement."}
          </h1>
          <p>
            {locale === "id"
              ? "Sampaikan kebutuhan, gagasan, maupun kritik yang dapat memperkuat agenda perubahan HMI."
              : "Share needs, ideas, or constructive criticism that can strengthen HMI’s agenda for change."}
          </p>
          <div className="privacy-note">
            <ShieldCheck aria-hidden="true" />
            <div>
              <strong>
                {locale === "id"
                  ? "Privasi Anda dijaga"
                  : "Your privacy is protected"}
              </strong>
              <p>
                {locale === "id"
                  ? "Data dipakai hanya untuk pemetaan dan tindak lanjut aspirasi. Isi aspirasi serta data pribadi tidak dipublikasikan."
                  : "Data is used only for analysis and follow-up. Your message and personal information will not be made public."}
              </p>
            </div>
          </div>
        </div>
        <div className="form-card">
          <AspirationForm locale={locale} />
        </div>
      </div>
    </section>
  );
}
