"use client";

import React from "react";
import Image from "next/image";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-ink-abyss border-t border-ink-raise/30 py-16 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
        {/* Brand info */}
        <div className="flex flex-col items-center md:items-start space-y-4">
          <div className="relative h-12 w-44 opacity-90">
            <Image
              src="/logo-inmotion-full.png"
              alt="InMotion Movies — Produtora Audiovisual"
              fill
              sizes="176px"
              className="object-contain object-center md:object-left"
            />
          </div>
          <p className="font-display text-base tracking-widest text-text-mut uppercase">
            Cinema, publicidade e estratégia visual.
          </p>
        </div>

        {/* Contact info shortcut */}
        <div className="flex flex-col items-center md:items-end text-center md:text-right space-y-2 text-sm text-text-mut">
          <p>Florianópolis, Santa Catarina (SC)</p>
          <p>contato@inmotionmovies.com.br</p>
          <p>(48) 99219-9990</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-ink-raise/10 flex flex-col sm:flex-row items-center justify-between text-xs text-text-mut/50 gap-4">
        <p>&copy; {currentYear} InMotion Movies. Todos os direitos reservados.</p>
        <p className="tracking-widest uppercase font-display text-[10px]">
          Transformamos empresas em marcas que parecem gigantes.
        </p>
      </div>
    </footer>
  );
}
