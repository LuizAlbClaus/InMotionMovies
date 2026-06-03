"use client";

import React from "react";
import { heroStripLogos, type ClientLogo } from "@/lib/clientLogos";

const clamp = (v: number, min = 0, max = 1) => Math.max(min, Math.min(max, v));

/** Uma fileira da esteira (marquee). Função, não componente — duas fileiras idênticas
 *  lado a lado dão o loop contínuo sem emenda. `dup` só diferencia keys + acessibilidade. */
function marqueeRow(logos: ClientLogo[], dup: boolean) {
  return (
    <div
      key={dup ? "row-dup" : "row"}
      aria-hidden={dup || undefined}
      className="flex animate-marquee min-w-max shrink-0 items-center gap-12 md:gap-20 pr-12 md:pr-20"
    >
      {logos.map((logo, i) => (
        <div
          key={`${logo.file}-${dup ? "dup" : "a"}-${i}`}
          className="shrink-0 flex items-center justify-center w-[104px] h-[34px] md:w-[140px] md:h-[44px]"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`/logos/${logo.file}`}
            alt={dup ? "" : logo.company}
            loading="lazy"
            decoding="async"
            className="max-w-full max-h-full object-contain [filter:brightness(0)_invert(1)] opacity-80"
          />
        </div>
      ))}
    </div>
  );
}

/**
 * LensLogoConveyor
 * ----------------
 * Payoff da lente: uma ESTEIRA horizontal de logos de clientes (marquee contínuo)
 * que entra por baixo da marca InMotion conforme a íris abre. Substitui o antigo
 * "anel de selos" (LensSealRing) — esteira lê mais profissional e cabe melhor no
 * formato (funciona igual no desktop scrub e no vídeo mobile).
 *
 * Data-driven: edita `heroStripLogos` em lib/clientLogos.ts.
 * `reveal` (opacity/slide) é dirigido pelo `progress` do ScrollFrameSequence;
 * o deslize horizontal é uma animação CSS contínua (animate-marquee), independente
 * do scroll — é o que dá a sensação de "esteira" rodando.
 */
export function LensLogoConveyor({
  progress,
  logos = heroStripLogos,
  /** Quando a esteira começa a aparecer (após a marca resolver). */
  revealStart = 0.62,
  /** Quando a esteira está totalmente revelada. */
  revealEnd = 0.9,
}: {
  progress: number;
  logos?: ClientLogo[];
  revealStart?: number;
  revealEnd?: number;
}) {
  const reveal = clamp((progress - revealStart) / Math.max(0.0001, revealEnd - revealStart));

  return (
    <div
      className="pointer-events-none relative w-full max-w-4xl"
      style={{
        opacity: reveal,
        transform: `translateY(${(1 - reveal) * 24}px)`,
        visibility: reveal <= 0.01 ? "hidden" : "visible",
      }}
    >
      {/* Faixa escura por baixo da esteira: garante leitura dos logos sobre a parte
          clara/iluminada da lente, sem depender só do scrim central da marca. */}
      <div
        aria-hidden
        className="absolute left-1/2 top-1/2 -z-10 h-[260%] w-screen -translate-x-1/2 -translate-y-1/2"
        style={{
          background:
            "radial-gradient(ellipse 60% 100% at center, rgba(5,5,5,0.92) 0%, rgba(5,5,5,0.6) 55%, rgba(5,5,5,0) 80%)",
        }}
      />
      <div
        className="relative flex w-full overflow-hidden"
        style={{
          maskImage: "linear-gradient(to right, transparent, black 12%, black 88%, transparent)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent, black 12%, black 88%, transparent)",
        }}
      >
        {marqueeRow(logos, false)}
        {marqueeRow(logos, true)}
      </div>
    </div>
  );
}

export default LensLogoConveyor;
