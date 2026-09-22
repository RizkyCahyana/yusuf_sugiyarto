"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import type { Locale } from "@/lib/i18n";

const photos = [
  {
    src: "/images/profile/yusuf-portrait-focus.png",
    caption: "Potret Yusuf Sugiyarto",
    position: "center 18%",
    featured: true,
  },
  {
    src: "/images/gallery/yusuf-bem-sambutan.jpg",
    caption: "Menyampaikan gagasan di ruang mahasiswa",
    position: "center 28%",
  },
  {
    src: "/images/gallery/yusuf-bem-sambutan-2.jpg",
    caption: "Melatih keberanian menyuarakan gagasan",
    position: "center 24%",
  },
  {
    src: "/images/gallery/yusuf-indonesia.jpg",
    caption: "Berakar pada identitas keindonesiaan",
    position: "68% 55%",
  },
  {
    src: "/images/gallery/yusuf-aksi-8.jpg",
    caption: "Dialog kader dalam gerakan mahasiswa",
    position: "center 30%",
  },
  {
    src: "/images/gallery/yusuf-pemateri-2.jpg",
    caption: "Membawa pandangan kader ke ruang nasional",
    position: "center 24%",
  },
  {
    src: "/images/gallery/yusuf-sambutan-crop.jpg",
    caption: "Meneguhkan nilai dalam forum kaderisasi",
    position: "46% 30%",
    hideCaption: true,
  },
  {
    src: "/images/gallery/yusuf-aksi.jpg",
    caption: "Menjaga ritme gerakan",
    position: "center",
  },
  {
    src: "/images/gallery/yusuf-aksi-3.jpg",
    caption: "Merawat percakapan",
    position: "center",
  },
  {
    src: "/images/gallery/yusuf-aksi-4.jpg",
    caption: "Hadir di tengah masyarakat",
    position: "center",
    landscape: true,
  },
  {
    src: "/images/gallery/yusuf-aksi-2.jpg",
    caption: "Ruang dialog dan aksi",
    position: "center",
    landscape: true,
  },
  {
    src: "/images/gallery/yusuf-aksi-5.jpg",
    caption: "Belajar dari lapangan",
    position: "center",
  },
  {
    src: "/images/gallery/yusuf-pemateri.webp",
    caption: "Berbagi pengetahuan",
    position: "center 24%",
  },
  {
    src: "/images/gallery/yusuf-pelantikan.webp",
    caption: "Meneguhkan amanah",
    position: "center 22%",
  },
  {
    src: "/images/gallery/yusuf-caketum-bandung.jpg",
    caption: "Bergerak bersama untuk Bandung",
    position: "center",
  },
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
        {photos.map((photo, index) => (
          <button
            className={`profile-gallery-item${"featured" in photo && photo.featured ? " profile-gallery-featured" : ""}${"landscape" in photo && photo.landscape ? " profile-gallery-landscape" : ""}${"hideCaption" in photo && photo.hideCaption ? " profile-gallery-no-caption" : ""}`}
            key={photo.src}
            type="button"
            onClick={() => setSelected(index)}
            aria-label={`${locale === "id" ? "Perbesar foto" : "Enlarge photo"}: ${photo.caption}`}
          >
            <Image
              src={photo.src}
              alt={photo.caption}
              fill
              quality={90}
              sizes="(max-width: 650px) 100vw, (max-width: 900px) 50vw, 33vw"
              style={{ objectPosition: photo.position }}
            />
            {!("hideCaption" in photo && photo.hideCaption) ? (
              <span>{photo.caption}</span>
            ) : null}
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
          aria-label={photos[selected].caption}
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
              src={photos[selected].src}
              alt={photos[selected].caption}
              fill
              quality={95}
              sizes="(max-width: 900px) 92vw, 78vw"
            />
          </div>
          {!(
            "hideCaption" in photos[selected] && photos[selected].hideCaption
          ) ? (
            <p>{photos[selected].caption}</p>
          ) : null}
        </dialog>
      ) : null}
    </>
  );
}
