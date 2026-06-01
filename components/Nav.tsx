"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const SECTIONS: { id: string; label: string }[] = [
  { id: "sobre", label: "Sobre" },
  { id: "setores", label: "Clientes" },
  { id: "servicos", label: "Serviços" },
  { id: "portfolio", label: "Portfólio" },
];

export function Nav() {
  const pathname = usePathname();
  const router = useRouter();

  // Route-aware: na home faz smooth-scroll; fora dela navega para /#id.
  const goToSection = (id: string) => {
    if (pathname === "/") {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    } else {
      router.push(`/#${id}`);
    }
  };

  const goHome = () => {
    if (pathname === "/") {
      document.getElementById("hero")?.scrollIntoView({ behavior: "smooth" });
    } else {
      router.push("/");
    }
  };

  const linkClass =
    "font-display text-lg tracking-widest text-text-mut hover:text-accent transition-colors duration-300 uppercase cursor-pointer";

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-ink-base/80 backdrop-blur-md border-b border-ink-raise/40 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <div className="relative h-12 w-48 cursor-pointer" onClick={goHome}>
          <div
            className="w-full h-full transition-all duration-300 hover:opacity-85"
            style={{
              backgroundImage:
                "linear-gradient(to right, var(--color-accent) 19%, var(--color-text-hi) 19%), linear-gradient(to right, var(--color-text-mut) 100%)",
              backgroundSize: "100% 75%, 100% 18%",
              backgroundPosition: "top left, bottom left",
              backgroundRepeat: "no-repeat",
              WebkitMaskImage: "url(/inmotion-logo.png)",
              WebkitMaskSize: "contain",
              WebkitMaskRepeat: "no-repeat",
              WebkitMaskPosition: "left center",
              maskImage: "url(/inmotion-logo.png)",
              maskSize: "contain",
              maskRepeat: "no-repeat",
              maskPosition: "left center",
            }}
            title="InMotion Movies Logo"
          />
        </div>

        {/* Links */}
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
          <button
            onClick={() => goToSection("contato")}
            className="font-display text-lg tracking-widest bg-accent hover:bg-accent-deep text-text-hi px-5 py-2.5 rounded border border-accent/20 transition-all duration-300 uppercase cursor-pointer"
          >
            Orçamento
          </button>
        </div>

        {/* Mobile menu trigger */}
        <div className="md:hidden">
          <button
            onClick={() => goToSection("contato")}
            className="font-display text-base tracking-widest bg-accent hover:bg-accent-deep text-text-hi px-4 py-2 rounded transition-colors uppercase"
          >
            Contato
          </button>
        </div>
      </div>
    </nav>
  );
}
