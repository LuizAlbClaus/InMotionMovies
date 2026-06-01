"use client";

import React, { useEffect, useState } from "react";
import { ScrollFrameSequence } from "./ScrollFrameSequence";
import { LensLogoReveal } from "./LensLogoReveal";
import { heroStripLogos } from "@/lib/clientLogos";

const clamp = (v: number, min = 0, max = 1) => Math.max(min, Math.min(max, v));

/** Nº de frames em /public/frames/lente (gerado do Video.mp4 a 15fps). */
const FRAME_COUNT = 120;

/** true quando a viewport é mobile (alinhado ao breakpoint do ScrollFrameSequence). */
function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
    const on = () => setIsMobile(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, [breakpoint]);
  return isMobile;
}

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
 * LensHero — hero da InMotion.
 * Desktop: scroll dirige a lente (push-in → marca no centro → logos embaixo).
 * Mobile: o mesmo arco toca como VÍDEO autoplay; marca + logos num stack vertical
 *         centralizado (sem colisão em tela estreita).
 */
export function LensHero() {
  const isMobile = useIsMobile();

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

              {/* Fase 2+3 — payoff: marca InMotion + logos de clientes */}
              {isMobile ? (
                // MOBILE: stack vertical centralizado (marca em cima, logos compactos embaixo)
                <div
                  className="absolute inset-0 flex flex-col items-center justify-center gap-7 px-6"
                  style={{ visibility: payoffVisible ? "visible" : "hidden" }}
                >
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0"
                    style={{
                      opacity: markIn * 0.9,
                      background:
                        "radial-gradient(ellipse 70% 55% at center, rgba(5,5,5,0.9) 0%, rgba(5,5,5,0.55) 45%, rgba(5,5,5,0) 75%)",
                    }}
                  />
                  <div
                    style={{ opacity: markIn, transform: `scale(${0.9 + markIn * 0.1})` }}
                  >
                    <InMotionMark className="relative h-12 w-[220px]" />
                  </div>
                  <div className="relative">
                    <LensLogoReveal
                      progress={p}
                      revealStart={0.7}
                      baseHeight={15}
                      logos={heroStripLogos.slice(0, 6)}
                      scrim={false}
                    />
                  </div>
                </div>
              ) : (
                // DESKTOP: marca no centro exato da íris + logos em faixa embaixo
                <>
                  <div
                    className="absolute inset-0 flex items-center justify-center"
                    style={{
                      opacity: markIn,
                      transform: `scale(${0.88 + markIn * 0.12})`,
                      visibility: payoffVisible ? "visible" : "hidden",
                    }}
                  >
                    <div
                      aria-hidden
                      className="pointer-events-none absolute h-[55vh] w-[55vh] rounded-full"
                      style={{
                        opacity: markIn * 0.9,
                        background:
                          "radial-gradient(circle, rgba(5,5,5,0.85) 0%, rgba(5,5,5,0.4) 50%, rgba(5,5,5,0) 72%)",
                      }}
                    />
                    <InMotionMark className="relative h-20 w-[380px]" />
                  </div>
                  <div className="absolute inset-x-0 bottom-[12%] flex justify-center">
                    <LensLogoReveal progress={p} revealStart={0.74} baseHeight={22} />
                  </div>
                </>
              )}

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
