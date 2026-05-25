"use client";

import React from "react";
import Image from "next/image";

export function Nav() {
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-ink-base/80 backdrop-blur-md border-b border-ink-raise/40 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <div className="relative h-12 w-48 cursor-pointer" onClick={() => scrollToSection("hero")}>
          <div
            className="w-full h-full transition-all duration-300 hover:opacity-85"
            style={{
              backgroundImage: 'linear-gradient(to right, var(--color-accent) 19%, var(--color-text-hi) 19%), linear-gradient(to right, var(--color-text-mut) 100%)',
              backgroundSize: '100% 75%, 100% 18%',
              backgroundPosition: 'top left, bottom left',
              backgroundRepeat: 'no-repeat',
              WebkitMaskImage: 'url(/inmotion-logo.png)',
              WebkitMaskSize: 'contain',
              WebkitMaskRepeat: 'no-repeat',
              WebkitMaskPosition: 'left center',
              maskImage: 'url(/inmotion-logo.png)',
              maskSize: 'contain',
              maskRepeat: 'no-repeat',
              maskPosition: 'left center',
            }}
            title="InMotion Movies Logo"
          />
        </div>

        {/* Links */}
        <div className="hidden md:flex items-center space-x-10">
          {["sobre", "servicos", "portfolio", "contato"].map((item) => (
            <button
              key={item}
              onClick={() => scrollToSection(item)}
              className="font-display text-lg tracking-widest text-text-mut hover:text-accent transition-colors duration-300 uppercase cursor-pointer"
            >
              {item === "servicos" ? "Serviços" : item}
            </button>
          ))}
          <button
            onClick={() => scrollToSection("contato")}
            className="font-display text-lg tracking-widest bg-accent hover:bg-accent-deep text-text-hi px-5 py-2.5 rounded border border-accent/20 transition-all duration-300 uppercase cursor-pointer"
          >
            Orçamento
          </button>
        </div>

        {/* Mobile menu trigger */}
        <div className="md:hidden">
          <button
            onClick={() => scrollToSection("contato")}
            className="font-display text-base tracking-widest bg-accent hover:bg-accent-deep text-text-hi px-4 py-2 rounded transition-colors uppercase"
          >
            Contato
          </button>
        </div>
      </div>
    </nav>
  );
}
