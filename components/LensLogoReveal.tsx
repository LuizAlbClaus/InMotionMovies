"use client";

import React from "react";
import { heroStripLogos, type ClientLogo } from "@/lib/clientLogos";

const clamp = (v: number, min = 0, max = 1) => Math.max(min, Math.min(max, v));

/**
 * LensLogoReveal
 * --------------
 * Camada de logos sobreposta ao vídeo da lente. As logos NÃO estão no vídeo —
 * são renderizadas pelo código e reveladas (blur→nítido, fade, leve scale) em
 * sincronia com o `progress` (0→1) do ScrollFrameSequence.
 *
 * Trocar/adicionar cliente = editar `lib/clientLogos.ts`. O vídeo nunca muda.
 *
 * Uso:
 *   <ScrollFrameSequence framesPath="/frames/lente" frameCount={120}>
 *     {(p) => <LensLogoReveal progress={p} />}
 *   </ScrollFrameSequence>
 */
export function LensLogoReveal({
  progress,
  logos = heroStripLogos,
  /** Quando as logos começam a aparecer (após a íris abrir) */
  revealStart = 0.55,
  /** Quando a última logo termina de resolver */
  revealEnd = 1,
  /** Altura base de cada logo em px (multiplicada pelo scale do item) */
  baseHeight = 36,
  /** Scrim radial escuro atrás do cluster (garante legibilidade sobre fundo claro) */
  scrim = true,
}: {
  progress: number;
  logos?: ClientLogo[];
  revealStart?: number;
  revealEnd?: number;
  baseHeight?: number;
  scrim?: boolean;
}) {
  const span = Math.max(0.0001, revealEnd - revealStart);
  // Janela em que TODAS começam (60% do span é distribuído em stagger);
  // cada logo resolve em 40% do span a partir do seu start.
  const staggerSpan = span * 0.6;
  const resolveSpan = span * 0.4;
  // Opacidade do scrim acompanha o início do reveal.
  const scrimOpacity = Math.max(0, Math.min(1, (progress - revealStart + 0.1) / 0.2));

  return (
    <div className="relative flex max-w-3xl flex-wrap items-center justify-center gap-x-10 gap-y-7 px-6">
      {scrim && (
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[160%] w-[160%] -translate-x-1/2 -translate-y-1/2"
          style={{
            opacity: scrimOpacity,
            background:
              "radial-gradient(ellipse at center, rgba(5,5,5,0.78) 0%, rgba(5,5,5,0.5) 45%, rgba(5,5,5,0) 72%)",
          }}
        />
      )}
      {logos.map((logo, i) => {
        const t0 = revealStart + staggerSpan * (i / Math.max(1, logos.length - 1));
        const local = clamp((progress - t0) / resolveSpan);
        return (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={logo.company}
            src={`/logos/${logo.file}`}
            alt={logo.company}
            loading="lazy"
            decoding="async"
            className="object-contain"
            style={{
              height: `${baseHeight * (logo.scale ?? 1)}px`,
              maxHeight: `${baseHeight * 1.3}px`,
              width: "auto",
              maxWidth: "160px",
              opacity: local,
              // só opacity + transform (compositor) — sem filter blur animado (caro)
              transform: `translateY(${(1 - local) * 10}px) scale(${0.94 + local * 0.06})`,
              // brightness(0) invert(1) = branco uniforme; estático, não anima.
              filter: "brightness(0) invert(1)",
            }}
          />
        );
      })}
    </div>
  );
}

export default LensLogoReveal;
