"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { ArrowRight, X } from "lucide-react";
import { AskaraLogo } from "./askara-logo";
import { welcomeLetter } from "@/lib/welcome-letter";
import { campaignStory } from "@/lib/campaign-content";

const SESSION_KEY = "yusuf-welcome-seen";

export function WelcomePopup() {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const reopen = () => {
      if (!dialogRef.current?.open) dialogRef.current?.showModal();
    };
    window.addEventListener("open-welcome", reopen);
    return () => window.removeEventListener("open-welcome", reopen);
  }, []);

  useEffect(() => {
    try {
      if (sessionStorage.getItem(SESSION_KEY) === "1") return;
    } catch {
      /* Storage can be disabled; the dialog still works. */
    }
    const timer = window.setTimeout(() => {
      const dialog = dialogRef.current;
      if (!dialog || dialog.open) return;
      dialog.showModal();
      try {
        sessionStorage.setItem(SESSION_KEY, "1");
      } catch {
        /* Optional persistence. */
      }
    }, 500);
    return () => {
      window.clearTimeout(timer);
    };
  }, []);

  function closeDialog() {
    dialogRef.current?.close();
  }

  return (
    <dialog
      ref={dialogRef}
      className="welcome-dialog"
      aria-labelledby="welcome-title"
      aria-describedby="welcome-copy"
      onClick={(event) => {
        if (event.target === event.currentTarget) closeDialog();
      }}
    >
      <div className="welcome-card">
        <button
          className="welcome-close"
          type="button"
          onClick={closeDialog}
          aria-label="Tutup ucapan selamat datang"
        >
          <X aria-hidden="true" />
        </button>
        <div className="welcome-portrait" aria-hidden="true">
          <span className="welcome-orbit welcome-orbit-one" />
          <span className="welcome-orbit welcome-orbit-two" />
          <Image
            src="/images/yusuf-sugiyarto.jpg"
            alt=""
            fill
            priority
            sizes="(max-width: 700px) 86vw, 390px"
          />
        </div>
        <div className="welcome-content">
          <AskaraLogo className="welcome-askara" />
          <span className="eyebrow">Selamat datang</span>
          <h2 id="welcome-title">
            Ruang gagasan, dialog, dan ikhtiar bersama.
          </h2>
          <div id="welcome-copy" className="welcome-copy">
            <p>
              Assalamu’alaikum Wr. Wb. Terima kasih atas kunjungan Anda. Mari
              berbagi gagasan dan melanjutkan ikhtiar pengabdian bagi umat dan
              bangsa.
            </p>
            <p>
              Perjuangan ini bukan tentang memulai sesuatu yang baru, melainkan
              melanjutkan amanah yang diwariskan para pendahulu.
            </p>
            <p>
              Modernitas adalah ruang baru bagi nilai-nilai perjuangan untuk
              menemukan bentuk pengabdiannya—profesional, meritokratis, adaptif,
              berilmu, dan terhubung.
            </p>
          </div>
          <article className="welcome-letter" aria-label="Sambutan lengkap">
            <div className="welcome-letter-heading">
              <span className="eyebrow">Sambutan lengkap</span>
              <h3>HMI: Creative Minority</h3>
            </div>
            <p lang="ar" dir="rtl" className="letter-arabic">
              وَالَّذِينَ جَاهَدُوا فِينَا لَنَهْدِيَنَّهُمْ سُبُلَنَا وَإِنَّ
              اللَّهَ لَمَعَ الْمُحْسِنِينَ
            </p>
            <blockquote>
              <p>“{campaignStory.scripture}”</p>
              <cite>{campaignStory.scriptureSource}</cite>
            </blockquote>
            <p>Assalamu’alaikum Wr. Wb.</p>
            {welcomeLetter.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
            <p>Wassalamu’alaikum Wr. Wb.</p>
          </article>
          <div className="welcome-signature">
            <span
              role="img"
              aria-label="Tanda tangan Yusuf Sugiyarto"
              className="signature-mark"
            />
          </div>
          <div className="welcome-actions">
            <Link href="/program" className="button" onClick={closeDialog}>
              Jelajahi gagasan <ArrowRight aria-hidden="true" size={18} />
            </Link>
            <button
              className="welcome-continue"
              type="button"
              onClick={closeDialog}
            >
              Lanjut ke situs
            </button>
          </div>
        </div>
      </div>
    </dialog>
  );
}
