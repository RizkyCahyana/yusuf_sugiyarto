"use client";

import Image from "next/image";
import { useState } from "react";

export function MediaSlot({
  src,
  alt,
  className = "",
}: {
  src?: string;
  alt: string;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);
  return (
    <div className={`media-slot ${className}`}>
      {src && !failed ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(max-width: 900px) 100vw, 50vw"
          onError={() => setFailed(true)}
        />
      ) : (
        <div
          className="media-placeholder"
          role="img"
          aria-label={`Ruang foto: ${alt}`}
        >
          <span>{alt}</span>
          <small>1600 × 1000 · 8:5</small>
        </div>
      )}
    </div>
  );
}
