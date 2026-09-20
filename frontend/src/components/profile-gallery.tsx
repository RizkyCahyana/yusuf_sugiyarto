"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import type { Locale } from "@/lib/i18n";

const photos = [
  ["/images/profile/yusuf-portrait-focus.png", "Potret Yusuf Sugiyarto"],
  ["/images/gallery/yusuf-aksi.jpg", "Menjaga ritme gerakan"],
  ["/images/gallery/yusuf-aksi-3.jpg", "Merawat percakapan"],
  ["/images/gallery/yusuf-aksi-4.jpg", "Hadir di tengah masyarakat"],
  ["/images/gallery/yusuf-aksi-2.jpg", "Ruang dialog dan aksi"],
  ["/images/gallery/yusuf-aksi-5.jpg", "Belajar dari lapangan"],
  ["/images/gallery/yusuf-pemateri.webp", "Berbagi pengetahuan"],
  ["/images/gallery/yusuf-pelantikan.webp", "Meneguhkan amanah"],
  [
    "/images/gallery/yusuf-caketum-bandung.jpg",
    "Bergerak bersama untuk Bandung",
  ],
] as const;

export function ProfileGallery({ locale = "id" }: { locale?: Locale }) {
  const [selected, setSelected] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (selected === null) return;
    const dialog = dialogRef.current;
    dialog?.showModal();
    return () => dialog?.close();
  }, [selected]);

  return (
    <>
      <div className="profile-gallery">
        {photos.map(([src, caption], index) => (
          <button
            className={`profile-gallery-item${index === 0 ? " profile-gallery-featured" : ""}${index === 3 || index === 4 ? " profile-gallery-landscape" : ""}`}
            key={src}
            type="button"
            onClick={() => setSelected(index)}
            aria-label={`${locale === "id" ? "Perbesar foto" : "Enlarge photo"}: ${caption}`}
          >
            <Image
              src={src}
              alt={caption}
              fill
              quality={90}
              sizes="(max-width: 650px) 100vw, (max-width: 900px) 50vw, 33vw"
            />
            <span>{caption}</span>
          </button>
        ))}
      </div>
      {selected !== null ? (
        <dialog
          ref={dialogRef}
          onClose={() => setSelected(null)}
          className="profile-gallery-modal"
          role="dialog"
          aria-modal="true"
          aria-label={photos[selected][1]}
          onClick={(event) => {
            if (event.target === event.currentTarget) setSelected(null);
          }}
        >
          <button
            className="profile-gallery-close"
            type="button"
            onClick={() => setSelected(null)}
            aria-label={
              locale === "id" ? "Tutup tampilan foto" : "Close photo viewer"
            }
          >
            <X aria-hidden="true" />
          </button>
          <div className="profile-gallery-modal-image">
            <Image
              src={photos[selected][0]}
              alt={photos[selected][1]}
              fill
              quality={95}
              sizes="(max-width: 900px) 92vw, 78vw"
            />
          </div>
          <p>{photos[selected][1]}</p>
        </dialog>
      ) : null}
    </>
  );
}
