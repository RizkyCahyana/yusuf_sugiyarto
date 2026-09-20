"use client";

import { useEffect, useRef, useState } from "react";
import { CheckCircle2, LoaderCircle, Send } from "lucide-react";
import type { Locale } from "@/lib/i18n";

const categories = [
  "Kaderisasi",
  "SDM",
  "Organisasi & Transparansi",
  "Jaringan",
  "Sosial",
  "Kritik & Saran",
  "Lainnya",
];
type Errors = Record<string, string>;

export function AspirationForm({ locale = "id" }: { locale?: Locale }) {
  const startedAt = useRef(0);
  const errorSummaryRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [reference, setReference] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [serverError, setServerError] = useState("");
  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const payload = {
      name: String(data.get("name") || "").trim(),
      email: String(data.get("email") || "").trim(),
      phone: String(data.get("phone") || "").trim(),
      region: String(data.get("region") || "").trim(),
      branch: String(data.get("branch") || "").trim(),
      category: String(data.get("category") || ""),
      subject: String(data.get("subject") || "").trim(),
      message: String(data.get("message") || "").trim(),
      consent: data.get("consent") === "on",
      website: String(data.get("website") || ""),
      startedAt: startedAt.current,
    };
    const nextErrors: Errors = {};
    if (payload.name.length < 2)
      nextErrors.name =
        locale === "id"
          ? "Nama minimal 2 karakter."
          : "Name must contain at least 2 characters.";
    if (!payload.email)
      nextErrors.email =
        locale === "id" ? "Email wajib diisi." : "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(payload.email))
      nextErrors.email =
        locale === "id"
          ? "Masukkan alamat email yang valid, misalnya nama@gmail.com."
          : "Enter a valid email address, for example name@gmail.com.";
    if (!payload.phone)
      nextErrors.phone =
        locale === "id"
          ? "Nomor WhatsApp wajib diisi."
          : "WhatsApp number is required.";
    else if (!/^08\d{8,13}$/.test(payload.phone))
      nextErrors.phone =
        locale === "id"
          ? "Nomor WhatsApp harus diawali 08 dan hanya berisi 10–15 angka."
          : "WhatsApp number must start with 08 and contain 10–15 digits.";
    if (payload.region.length < 2)
      nextErrors.region =
        locale === "id"
          ? "Asal Badko wajib diisi."
          : "Regional coordinator is required.";
    if (payload.branch.length < 2)
      nextErrors.branch =
        locale === "id" ? "Asal cabang wajib diisi." : "Branch is required.";
    if (!categories.includes(payload.category))
      nextErrors.category =
        locale === "id" ? "Pilih kategori aspirasi." : "Select a category.";
    if (payload.subject.length < 5)
      nextErrors.subject =
        locale === "id"
          ? "Judul minimal 5 karakter."
          : "Subject must contain at least 5 characters.";
    if (payload.message.length < 20)
      nextErrors.message =
        locale === "id"
          ? "Isi aspirasi minimal 20 karakter."
          : "Your message must contain at least 20 characters.";
    if (!payload.consent)
      nextErrors.consent =
        locale === "id"
          ? "Persetujuan diperlukan untuk mengirim aspirasi."
          : "Consent is required before submitting.";
    setErrors(nextErrors);
    setServerError("");
    if (Object.keys(nextErrors).length) {
      requestAnimationFrame(() => errorSummaryRef.current?.focus());
      return;
    }
    setStatus("loading");
    try {
      const response = await fetch("/api/aspirations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok)
        throw new Error(
          result.error ||
            (locale === "id"
              ? "Aspirasi belum dapat dikirim."
              : "Your submission could not be sent."),
        );
      setReference(result.referenceNumber);
      setStatus("success");
      form.reset();
    } catch (error) {
      setServerError(
        error instanceof Error
          ? error.message
          : locale === "id"
            ? "Aspirasi belum dapat dikirim."
            : "Your submission could not be sent.",
      );
      setStatus("error");
    }
  }

  if (status === "success")
    return (
      <div className="form-success" role="status">
        <CheckCircle2 aria-hidden="true" />
        <span className="eyebrow">
          {locale === "id" ? "Aspirasi diterima" : "Submission received"}
        </span>
        <h2>
          {locale === "id"
            ? "Terima kasih sudah bersuara."
            : "Thank you for sharing your voice."}
        </h2>
        <p>
          {locale === "id"
            ? "Simpan nomor referensi ini untuk catatan Anda."
            : "Keep this reference number for your records."}
        </p>
        <strong>{reference}</strong>
        <button
          className="button button-secondary"
          onClick={() => {
            setStatus("idle");
            startedAt.current = Date.now();
          }}
        >
          {locale === "id" ? "Kirim aspirasi lain" : "Send another submission"}
        </button>
      </div>
    );
  const error = (name: string) =>
    errors[name] ? (
      <span className="field-error" id={`error-${name}`}>
        {errors[name]}
      </span>
    ) : null;
  return (
    <form className="aspiration-form" onSubmit={onSubmit} noValidate>
      {Object.keys(errors).length > 0 && (
        <div
          ref={errorSummaryRef}
          className="form-error-summary"
          role="alert"
          tabIndex={-1}
          aria-labelledby="form-error-title"
        >
          <strong id="form-error-title">
            {locale === "id"
              ? "Periksa kembali isian berikut:"
              : "Please review the following fields:"}
          </strong>
          <ul>
            {Object.entries(errors).map(([name, message]) => (
              <li key={name}>
                <a href={`#field-${name}`}>{message}</a>
              </li>
            ))}
          </ul>
        </div>
      )}
      {status === "error" && (
        <div className="error-banner" role="alert">
          <strong>
            {locale === "id" ? "Pengiriman gagal." : "Submission failed."}
          </strong>{" "}
          {serverError}
        </div>
      )}
      <div className="form-grid">
        <label>
          {locale === "id" ? "Nama lengkap" : "Full name"}
          <input
            id="field-name"
            name="name"
            autoComplete="name"
            required
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "error-name" : undefined}
          />
          {error("name")}
        </label>
        <label>
          {locale === "id" ? "Asal Badko" : "Regional coordinator"}
          <input
            id="field-region"
            name="region"
            autoComplete="address-level1"
            required
            aria-invalid={!!errors.region}
            aria-describedby={errors.region ? "error-region" : undefined}
          />
          {error("region")}
        </label>
      </div>
      <div className="form-grid">
        <label>
          Email{" "}
          <span>
            ({locale === "id" ? "Contoh" : "Example"}:
            yakinusahasampai@gmail.com)
          </span>
          <input
            id="field-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "error-email" : undefined}
          />
          {error("email")}
        </label>
        <label>
          WhatsApp{" "}
          <span>({locale === "id" ? "Contoh" : "Example"}: 0851578xxxxx)</span>
          <input
            id="field-phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            inputMode="numeric"
            pattern="08[0-9]{8,13}"
            required
            aria-invalid={!!errors.phone}
            aria-describedby={errors.phone ? "error-phone" : undefined}
          />
          {error("phone")}
        </label>
      </div>
      <div className="form-grid">
        <label>
          {locale === "id" ? "Asal Cabang" : "Branch"}
          <input
            id="field-branch"
            name="branch"
            autoComplete="organization"
            required
            aria-invalid={!!errors.branch}
            aria-describedby={errors.branch ? "error-branch" : undefined}
          />
          {error("branch")}
        </label>
        <label>
          {locale === "id" ? "Kategori" : "Category"}
          <select
            id="field-category"
            name="category"
            defaultValue=""
            required
            aria-invalid={!!errors.category}
            aria-describedby={errors.category ? "error-category" : undefined}
          >
            <option value="" disabled>
              {locale === "id" ? "Pilih kategori" : "Select a category"}
            </option>
            {categories.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
          {error("category")}
        </label>
      </div>
      <label>
        {locale === "id" ? "Judul Aspirasi" : "Subject"}
        <input
          id="field-subject"
          name="subject"
          maxLength={150}
          required
          aria-invalid={!!errors.subject}
          aria-describedby={errors.subject ? "error-subject" : undefined}
        />
        {error("subject")}
      </label>
      <label>
        {locale === "id" ? "Isi Aspirasi" : "Message"}
        <textarea
          id="field-message"
          name="message"
          rows={7}
          maxLength={5000}
          required
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? "error-message" : "message-hint"}
        />
        <span id="message-hint" className="field-hint">
          {locale === "id"
            ? "Ceritakan konteks dan usulan Anda dengan jelas. Maksimal 5.000 karakter."
            : "Describe the context and your proposal clearly. Maximum 5,000 characters."}
        </span>
        {error("message")}
      </label>
      <input
        className="honeypot"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
      />
      <label className="consent">
        <input
          id="field-consent"
          name="consent"
          type="checkbox"
          aria-invalid={!!errors.consent}
          aria-describedby={errors.consent ? "error-consent" : undefined}
        />
        <span>
          {locale === "id"
            ? "Saya menyetujui pemrosesan data ini untuk tindak lanjut aspirasi. Data tidak akan ditampilkan secara publik."
            : "I consent to the processing of this data for follow-up. My data will not be displayed publicly."}
        </span>
      </label>
      {error("consent")}
      <button className="button submit-button" disabled={status === "loading"}>
        {status === "loading" ? (
          <LoaderCircle className="spin" aria-hidden="true" />
        ) : (
          <Send aria-hidden="true" />
        )}{" "}
        {status === "loading"
          ? locale === "id"
            ? "Mengirim…"
            : "Sending…"
          : locale === "id"
            ? "Kirim Aspirasi"
            : "Submit"}
      </button>
    </form>
  );
}
