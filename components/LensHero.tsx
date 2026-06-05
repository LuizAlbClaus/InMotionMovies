"use client";

import React from "react";
import Image from "next/image";
import { ScrollFrameSequence } from "./ScrollFrameSequence";

const clamp = (v: number, min = 0, max = 1) => Math.max(min, Math.min(max, v));

/**
 * Easing "back-out": passa um pouco do alvo e assenta (overshoot → settle).
 * Com o scrub suavizado (~1.2s de catch-up ao soltar o scroll), isso vira um
 * assentamento elástico VISÍVEL no instante em que o scroll para — em vez de
 * a animação congelar de uma vez. s controla a intensidade do overshoot.
 */
const backOut = (t: number, s = 1.70158) => {
  const u = t - 1;
  return 1 + (s + 1) * u * u * u + s * u * u;
};

/** Nº de frames em /public/frames/lente (gerado do Video.mp4 a 15fps). */
const FRAME_COUNT = 120;

/** Marca InMotion — logo principal (versão escura, com tagline) sobre a íris. */
function InMotionMark({ className = "" }: { className?: string }) {
  return (
    <div className={`relative ${className}`} role="img" aria-label="InMotion Movies">
      <Image
        src="/logo-inmotion-full.png"
        alt="InMotion Movies"
        fill
        sizes="(min-width: 768px) 380px, 220px"
        className="object-contain"
      />
    </div>
  );
}

/**
 * LensHero — hero da InMotion.
 * Desktop: scroll dirige a lente (push-in → marca no centro → logos embaixo).
 * Mobile: o mesmo arco toca como VÍDEO autoplay; marca + logos num stack vertical
 *         centralizado (sem colisão em tela estreita).
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
        mobileVideoSrc="/video/lente.mp4"
      >
        {(p) => {
          const headlineOut = 1 - clamp((p - 0.04) / 0.24);
          const markIn = clamp((p - 0.5) / 0.2);
          const payoffVisible = markIn > 0.01;
          // Promove a marca a uma camada de GPU só durante o trecho em que ela escala
          // (0.5→0.7). Sem isso, escalar um elemento com mask-image re-rasteriza a máscara
          // a cada quadro → cintilação no meio da animação. Um flip só, sem thrash.
          const markActive = p > 0.46 && p < 0.74;
          // Escala da marca com overshoot (assentamento elástico na chegada).
          const markScale = 0.88 + backOut(markIn) * 0.12;
          // "idle" (0→1): liga o respiro contínuo só na reta final (90%→100%),
          // pra composição nunca congelar seca quando o scroll termina.
          const idle = clamp((p - 0.9) / 0.1);
          // Frase-manifesto: entra DEPOIS da marca resolver, em rack-focus
          // (desfoque→nítido), como a lente focando na ideia. Termina antes do fim
          // do scroll → sobra um "beat" final com marca + frase nítidas.
          const lineIn = clamp((p - 0.66) / 0.24); // 0.66→0.90
          const lineBlur = Math.round((1 - lineIn) * 8 * 10) / 10; // px, snap p/ cortar repaints
          const lineActive = p > 0.62 && p < 0.94;
          return (
            <>
              {/* Fase 1 — Headline / teaser */}
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

              {/* Fase 2 — payoff: marca resolve + frase-manifesto entra em rack-focus */}
              <div
                className="absolute inset-0"
                style={{ visibility: payoffVisible ? "visible" : "hidden" }}
              >
                {/* scrim radial pra marca + frase destacarem do fundo da lente */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0"
                  style={{
                    opacity: markIn * 0.92,
                    background:
                      "radial-gradient(ellipse 62% 66% at center, rgba(5,5,5,0.92) 0%, rgba(5,5,5,0.55) 50%, rgba(5,5,5,0) 78%)",
                  }}
                />
                {/* stack centralizado: marca em cima, frase logo abaixo */}
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 md:gap-9 px-6">
                  {/* Marca no centro da íris */}
                  <div
                    style={{
                      opacity: markIn,
                      transform: `scale(${markScale}) translateZ(0)`,
                      willChange: markActive ? "transform, opacity" : "auto",
                      backfaceVisibility: "hidden",
                    }}
                  >
                    {/* wrapper de respiro: anima sozinho (CSS), sem brigar com o scroll */}
                    <div
                      className="hero-breathe-mark"
                      style={{ ["--idle" as string]: idle } as React.CSSProperties}
                    >
                      <InMotionMark className="relative h-12 w-[220px] md:h-20 md:w-[380px]" />
                    </div>
                  </div>
                  {/* Frase-manifesto — desfocada→nítida (a lente focando na ideia) */}
                  <p
                    className="font-display text-lg md:text-2xl lg:text-3xl uppercase tracking-[0.08em] leading-[1.25] text-center max-w-2xl text-text-hi"
                    style={{
                      opacity: lineIn,
                      filter: `blur(${lineBlur}px)`,
                      transform: `translateY(${(1 - lineIn) * 14}px) translateZ(0)`,
                      willChange: lineActive ? "opacity, filter, transform" : "auto",
                      backfaceVisibility: "hidden",
                    }}
                  >
                    Nós não filmamos empresas.
                    <br />
                    <span className="text-accent-bright">Filmamos a versão maior delas.</span>
                  </p>
                </div>
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
