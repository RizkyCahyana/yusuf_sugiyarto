"use client";
import { Plus, Trash2, X } from "lucide-react";
import s from "./admin.module.css";

export function PageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <header className={s.top}>
      <div>
        <h1 className={s.title}>{title}</h1>
        <p className={s.subtitle}>{description}</p>
      </div>
      {action}
    </header>
  );
}
export function StatusBadge({ value }: { value: string }) {
  return (
    <span className={s.badge} data-status={value}>
      {value.replace("DIPROSES", "DIPROSES")}
    </span>
  );
}
export function Modal({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div
      className={s.modalBackdrop}
      role="presentation"
      onMouseDown={(e) => {
        if (e.currentTarget === e.target) onClose();
      }}
    >
      <section
        className={s.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className={s.modalHead}>
          <h2 id="modal-title">{title}</h2>
          <button
            className={s.iconButton}
            onClick={onClose}
            aria-label="Tutup dialog"
          >
            <X aria-hidden="true" />
          </button>
        </div>
        {children}
      </section>
    </div>
  );
}
export function ListEditor({
  label,
  values,
  onChange,
  required = false,
}: {
  label: string;
  values: string[];
  onChange: (v: string[]) => void;
  required?: boolean;
}) {
  return (
    <fieldset className={`${s.field} ${s.full}`}>
      <label>{label}</label>
      <div className={s.listEditor}>
        {values.map((value, index) => (
          <div className={s.listRow} key={index}>
            <input
              aria-label={`${label} ${index + 1}`}
              value={value}
              required={required}
              onChange={(e) =>
                onChange(
                  values.map((v, i) => (i === index ? e.target.value : v)),
                )
              }
            />
            <button
              type="button"
              className={s.iconButton}
              aria-label={`Hapus ${label} ${index + 1}`}
              onClick={() => onChange(values.filter((_, i) => i !== index))}
            >
              <Trash2 size={17} aria-hidden="true" />
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        className={s.buttonSecondary}
        onClick={() => onChange([...values, ""])}
      >
        <Plus size={17} aria-hidden="true" />
        Tambah item
      </button>
    </fieldset>
  );
}
export function Loading() {
  return (
    <div className={s.notice} role="status">
      Memuat data…
    </div>
  );
}
export function ErrorMessage({ value }: { value: string }) {
  return (
    <div className={s.error} role="alert">
      {value}
    </div>
  );
}
