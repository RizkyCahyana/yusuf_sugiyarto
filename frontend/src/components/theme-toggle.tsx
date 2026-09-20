"use client";

import { useEffect, useRef, type MouseEvent } from "react";
import { Moon, Sun } from "lucide-react";

const STORAGE_KEY = "yusuf-site-theme";

export function ThemeToggle() {
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    buttonRef.current?.setAttribute(
      "aria-pressed",
      String(document.documentElement.dataset.theme === "dark"),
    );
  }, []);

  function toggleTheme(event: MouseEvent<HTMLButtonElement>) {
    const root = document.documentElement;
    const nextTheme = root.dataset.theme === "dark" ? "light" : "dark";

    root.dataset.theme = nextTheme;
    localStorage.setItem(STORAGE_KEY, nextTheme);
    event.currentTarget.setAttribute(
      "aria-pressed",
      String(nextTheme === "dark"),
    );
  }

  return (
    <button
      ref={buttonRef}
      className="theme-toggle"
      type="button"
      onClick={toggleTheme}
      aria-pressed="false"
      aria-label="Ganti mode warna terang atau gelap"
      title="Ganti mode warna"
    >
      <Moon className="theme-toggle-moon" aria-hidden="true" />
      <Sun className="theme-toggle-sun" aria-hidden="true" />
    </button>
  );
}
