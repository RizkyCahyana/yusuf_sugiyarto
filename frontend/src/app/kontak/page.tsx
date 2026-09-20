import type { Metadata } from "next";
import { ArrowUpRight, ShieldCheck } from "lucide-react";
import { AspirationForm } from "@/components/aspiration-form";
import { ContactIcon } from "@/components/icons";
import { getContacts } from "@/lib/api";
import { MediaSlot } from "@/components/media-slot";
import { mediaContent } from "@/lib/media-content";
import { getLocale } from "@/lib/locale-server";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Kontak",
  description: "Terhubung dengan Yusuf Sugiyarto melalui kanal kontak resmi.",
};
export default async function ContactPage() {
  const locale = await getLocale();
  const contacts = await getContacts();
  return (
    <>
      <section className="page-hero compact">
        <div className="container centered">
          <span className="eyebrow">
            {locale === "id" ? "Mari terhubung" : "Let’s connect"}
          </span>
          <h1>
            {locale === "id"
              ? "Ruang dialog selalu terbuka."
              : "The door to dialogue is always open."}
          </h1>
          <p>
            {locale === "id"
              ? "Gunakan kanal resmi berikut untuk kolaborasi, undangan kegiatan, atau percakapan lebih lanjut."
              : "Use the official channels below for collaboration, event invitations, or further conversation."}
          </p>
        </div>
      </section>
      <section className="section">
        <div className="container contact-media-intro">
          <MediaSlot
            src={mediaContent.collaboration}
            alt={
              locale === "id"
                ? "Yusuf Sugiyarto berdialog dalam kegiatan organisasi"
                : "Yusuf Sugiyarto engaging in an organizational dialogue"
            }
          />
          <div>
            <span className="eyebrow">
              {locale === "id"
                ? "Percakapan yang berarti"
                : "Meaningful conversations"}
            </span>
            <h2>
              {locale === "id"
                ? "Mari mulai dari satu gagasan."
                : "Let’s begin with one idea."}
            </h2>
            <p>
              {locale === "id"
                ? "Undangan diskusi, kerja bersama, dan aspirasi Anda menjadi bagian dari perjalanan ini. Temukan kanal yang paling sesuai di bawah."
                : "Invitations to discuss, collaborate, and share your voice are all part of this journey. Choose the most suitable channel below."}
            </p>
          </div>
        </div>
        <div className="container contact-grid">
          {contacts.map((contact) => (
            <a
              className="contact-card"
              key={`${contact.type}-${contact.value}`}
              href={contact.url || "#"}
              target={contact.url?.startsWith("http") ? "_blank" : undefined}
              rel="noreferrer"
            >
              <span className="icon-box">
                <ContactIcon type={contact.type} />
              </span>
              <span>
                <small>{contact.label}</small>
                <strong>{contact.value}</strong>
              </span>
              <span className="contact-card-action">
                {locale === "id" ? "Buka kanal" : "Open channel"}
                <ArrowUpRight aria-hidden="true" />
              </span>
            </a>
          ))}
        </div>
        <p className="fallback-note">
          {locale === "id"
            ? "Kanal yang belum tersedia akan ditambahkan setelah data resmi dikonfirmasi."
            : "Additional channels will be added once their official details are confirmed."}
        </p>
      </section>
      <section
        className="section contact-aspiration-section"
        aria-labelledby="contact-aspiration-title"
      >
        <div className="container contact-aspiration-layout">
          <div className="contact-aspiration-intro">
            <span className="eyebrow">
              {locale === "id" ? "Sampaikan aspirasi" : "Share your voice"}
            </span>
            <h2 id="contact-aspiration-title">
              {locale === "id"
                ? "Suara Anda, bagian dari gerak kita."
                : "Your voice is part of our movement."}
            </h2>
            <p>
              {locale === "id"
                ? "Sampaikan kebutuhan, gagasan, maupun kritik secara langsung melalui formulir ini. Setiap masukan menjadi bahan untuk memperkuat agenda perubahan HMI."
                : "Share needs, ideas, or constructive criticism through this form. Every contribution helps strengthen HMI’s agenda for change."}
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
                    ? "Data digunakan hanya untuk pemetaan dan tindak lanjut. Isi aspirasi serta data pribadi tidak dipublikasikan."
                    : "Data is used only for analysis and follow-up. Your message and personal data are never made public."}
                </p>
              </div>
            </div>
          </div>
          <div className="form-card contact-aspiration-form">
            <AspirationForm locale={locale} />
          </div>
        </div>
      </section>
    </>
  );
}
