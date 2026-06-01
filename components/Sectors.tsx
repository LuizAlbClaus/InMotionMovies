"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { sectors } from "@/lib/sectors";

export function Sectors() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isReduced = useReducedMotion();

  useEffect(() => {
    if (isReduced || typeof window === "undefined") return;

    const cards = containerRef.current?.querySelectorAll(".sector-card");
    if (!cards || !containerRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        cards,
        { opacity: 0, y: 28 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: "power3.out",
          stagger: 0.08,
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 75%",
            toggleActions: "play none none none",
          },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, [isReduced]);

  // Por enquanto leva ao portfólio; trocar por /verticais/{slug} quando as páginas existirem.
  const goToPortfolio = () => {
    document.getElementById("portfolio")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="setores"
      ref={containerRef}
      className="relative w-full py-24 md:py-36 bg-ink-base border-t border-ink-raise/30"
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Header — enquadramento de AMPLITUDE, não de nicho */}
        <div className="mb-16 md:mb-24 text-center md:text-left max-w-3xl">
          <span className="font-display text-base tracking-[0.25em] text-accent uppercase block mb-3">
            Quem confia na InMotion
          </span>
          <h2 className="font-display text-4xl md:text-6xl tracking-wide text-text-hi uppercase leading-none mb-5">
            Marcas de todos os segmentos
          </h2>
          <p className="text-base md:text-lg font-light text-text-mut leading-relaxed">
            Mais de 20 anos e dezenas de marcas atendidas — de moda e varejo a governo,
            construção, educação e hospitalidade. A InMotion não se prende a um nicho:
            adaptamos linguagem e direção para qualquer marca que queira ser percebida
            como maior.
          </p>
        </div>

        {/* Grid de segmentos — prova de ALCANCE (cada card = um segmento já atendido) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {sectors.map((sector) => (
            <button
              key={sector.slug}
              onClick={goToPortfolio}
              data-vertical={sector.slug}
              className="sector-card group text-left flex flex-col h-full rounded-lg border border-ink-raise/50 bg-ink-raise/15 hover:bg-ink-raise/30 hover:border-accent/40 hover:shadow-[0_0_30px_rgba(176,36,47,0.12)] transition-all duration-500 p-7 md:p-8 cursor-pointer focus:outline-none focus:border-accent/60"
            >
              {/* Top: nome do segmento + contagem */}
              <div className="flex items-start justify-between gap-4 mb-5">
                <h3 className="font-display text-2xl md:text-3xl tracking-wide text-text-hi uppercase leading-tight group-hover:text-accent transition-colors duration-300">
                  {sector.name}
                </h3>
                <span className="shrink-0 font-display text-xs tracking-widest text-text-mut uppercase border border-ink-raise/60 rounded-full px-3 py-1 mt-1">
                  {sector.clients.length}
                </span>
              </div>

              {/* Lista de clientes (prova) */}
              <ul className="mt-auto flex flex-wrap gap-x-2 gap-y-1.5">
                {sector.clients.map((client) => (
                  <li
                    key={client}
                    className="text-xs font-light text-text-body/70 after:content-['·'] after:ml-2 after:text-text-mut/40 last:after:content-['']"
                  >
                    {client}
                  </li>
                ))}
              </ul>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
