"use client";

import React from "react";
import { ScrollFrameSequence } from "./ScrollFrameSequence";
import { LensLogoReveal } from "./LensLogoReveal";

const clamp = (v: number, min = 0, max = 1) => Math.max(min, Math.min(max, v));

/** Nº de frames em /public/frames/lente (gerado do Video.mp4 a 15fps). */
const FRAME_COUNT = 120;

/** Marca InMotion (mesma técnica de máscara do Nav: gradiente vermelho+branco). */
function InMotionMark({ className = "" }: { className?: string }) {
  return (
    <div
      className={className}
      role="img"
      aria-label="InMotion Movies"
      style={{
        backgroundImage:
          "linear-gradient(to right, var(--color-accent) 19%, var(--color-text-hi) 19%), linear-gradient(to right, var(--color-text-mut) 100%)",
        backgroundSize: "100% 75%, 100% 18%",
        backgroundPosition: "top left, bottom left",
        backgroundRepeat: "no-repeat",
        WebkitMaskImage: "url(/inmotion-logo.png)",
        WebkitMaskSize: "contain",
        WebkitMaskRepeat: "no-repeat",
        WebkitMaskPosition: "center",
        maskImage: "url(/inmotion-logo.png)",
        maskSize: "contain",
        maskRepeat: "no-repeat",
        maskPosition: "center",
      }}
    />
  );
}

/**
 * LensHero — hero scroll-driven da InMotion.
 * Placa de vídeo (lente Veo 3.1) + overlays por fase, sincronizados ao scroll:
 *   0.00–0.28  headline visível, some conforme entra na lente
 *   0.50–0.70  marca InMotion resolve no centro escuro da íris (+ scrim)
 *   0.74–1.00  logos de clientes resolvem abaixo (data-driven via lib/clientLogos)
 */
export function LensHero() {
  return (
    <section id="intro" className="relative w-full bg-ink-abyss">
      <ScrollFrameSequence
        framesPath="/frames/lente"
        frameCount={FRAME_COUNT}
        scrollHeightVh={3}
        scrub={1.2}
        posterIndex={FRAME_COUNT}
      >
        {(p) => {
          const headlineOut = 1 - clamp((p - 0.04) / 0.24); // some cedo
          const markIn = clamp((p - 0.5) / 0.2); // entra no centro
          return (
            <>
              {/* Fase 1 — Headline */}
              <div
                className="absolute inset-0 flex items-center justify-center px-6"
                style={{
                  opacity: headlineOut,
                  transform: `translateY(${(1 - headlineOut) * -16}px)`,
                  visibility: headlineOut <= 0.01 ? "hidden" : "visible",
                }}
              >
                <h2 className="font-display text-3xl md:text-5xl uppercase leading-[1.1] tracking-[0.1em] text-text-hi max-w-3xl text-center">
                  Olhe através da<br />nossa lente
                </h2>
              </div>

              {/* Fase 2 — Marca InMotion no centro da íris */}
              <div
                className="absolute inset-0 flex items-center justify-center"
                style={{
                  opacity: markIn,
                  transform: `scale(${0.88 + markIn * 0.12})`,
                  visibility: markIn <= 0.01 ? "hidden" : "visible",
                }}
              >
                {/* scrim radial pra marca destacar do fundo da lente */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute h-[55vh] w-[55vh] rounded-full"
                  style={{
                    opacity: markIn * 0.9,
                    background:
                      "radial-gradient(circle, rgba(5,5,5,0.85) 0%, rgba(5,5,5,0.4) 50%, rgba(5,5,5,0) 72%)",
                  }}
                />
                <InMotionMark className="relative h-14 w-[260px] md:h-20 md:w-[380px]" />
              </div>

              {/* Fase 3 — Logos de clientes (resolvem por último, abaixo do centro) */}
              <div className="absolute inset-x-0 bottom-[12%] flex justify-center">
                <LensLogoReveal progress={p} revealStart={0.74} baseHeight={22} />
              </div>

              {/* Dica de scroll (some assim que começa) */}
              <div
                className="absolute inset-x-0 bottom-8 flex flex-col items-center gap-2"
                style={{ opacity: 1 - clamp(p / 0.08) }}
              >
                <span className="font-display text-xs tracking-[0.35em] text-text-mut uppercase">
                  Role
                </span>
                <span className="h-8 w-px bg-text-mut/40" />
              </div>
            </>
          );
        }}
      </ScrollFrameSequence>
    </section>
  );
}

export default LensHero;
