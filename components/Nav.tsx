"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const SECTIONS: { id: string; label: string }[] = [
  { id: "sobre", label: "Sobre" },
  { id: "setores", label: "Clientes" },
  { id: "portfolio", label: "Portfólio" },
];

export function Nav() {
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const goToSection = (id: string) => {
    setMenuOpen(false);
    if (pathname === "/") {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    } else {
      router.push(`/#${id}`);
    }
  };

  const goHome = () => {
    setMenuOpen(false);
    if (pathname === "/") {
      document.getElementById("hero")?.scrollIntoView({ behavior: "smooth" });
    } else {
      router.push("/");
    }
  };

  const linkClass =
    "font-display text-lg tracking-widest text-text-mut hover:text-accent transition-colors duration-300 uppercase cursor-pointer";

  return (
    <>
      <nav className="fixed top-0 left-0 w-full z-50 bg-ink-base/80 backdrop-blur-md border-b border-ink-raise/40 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          {/* Logo */}
          <div className="relative h-9 w-40 cursor-pointer" onClick={goHome}>
            <Image
              src="/logo-inmotion-full.png"
              alt="InMotion Movies — Produtora Audiovisual"
              fill
              priority
              sizes="160px"
              className="object-contain object-left transition-opacity duration-300 hover:opacity-85"
            />
          </div>

          {/* Desktop links */}
          <div className="hidden md:flex items-center space-x-10">
            {SECTIONS.map((s) => (
              <button key={s.id} onClick={() => goToSection(s.id)} className={linkClass}>
                {s.label}
              </button>
            ))}
            <Link href="/processo" className={linkClass}>
              Processo
            </Link>
            <button onClick={() => goToSection("contato")} className={linkClass}>
              Contato
            </button>
          </div>

          {/* Mobile: CTA + hamburger */}
          <div className="md:hidden flex items-center gap-3">
            <button
              onClick={() => setMenuOpen((o) => !o)}
              aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
              aria-expanded={menuOpen}
              className="w-11 h-11 flex items-center justify-center text-text-hi"
            >
              {menuOpen ? (
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <line x1="4" y1="4" x2="16" y2="16" />
                  <line x1="16" y1="4" x2="4" y2="16" />
                </svg>
              ) : (
                <svg width="22" height="16" viewBox="0 0 22 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <line x1="0" y1="2" x2="22" y2="2" />
                  <line x1="0" y1="8" x2="22" y2="8" />
                  <line x1="0" y1="14" x2="22" y2="14" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile full-screen overlay — below the nav bar (z-49) */}
      {menuOpen && (
        <div className="md:hidden fixed inset-0 z-[49] bg-ink-abyss/98 backdrop-blur-sm flex flex-col pt-20">
          <nav className="flex flex-col flex-1 overflow-y-auto px-6 justify-center gap-0">
            {SECTIONS.map((s) => (
              <button
                key={s.id}
                onClick={() => goToSection(s.id)}
                className="font-display text-left text-4xl tracking-wide text-text-hi hover:text-accent active:text-accent transition-colors duration-200 uppercase py-5 border-b border-ink-raise/40"
              >
                {s.label}
              </button>
            ))}
            <Link
              href="/processo"
              onClick={() => setMenuOpen(false)}
              className="font-display text-4xl tracking-wide text-text-hi hover:text-accent active:text-accent transition-colors duration-200 uppercase py-5 border-b border-ink-raise/40 block"
            >
              Processo
            </Link>
            <button
              onClick={() => goToSection("contato")}
              className="font-display text-left text-4xl tracking-wide text-text-hi hover:text-accent active:text-accent transition-colors duration-200 uppercase py-5 border-b border-ink-raise/40"
            >
              Contato
            </button>
          </nav>
        </div>
      )}
    </>
  );
}
