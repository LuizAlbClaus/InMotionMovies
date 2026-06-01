"use client";

import React from "react";
import { sealLogos, type ClientLogo } from "@/lib/clientLogos";

const clamp = (v: number, min = 0, max = 1) => Math.max(min, Math.min(max, v));

/**
 * LensSealRing
 * ------------
 * "Clímax de autoridade": poucos selos-peso (clientes) arranjados num ANEL ao redor
 * da marca InMotion, dentro da íris. Entrada em RACK-FOCUS (desfoque→nítido), como a
 * lente focando — em stagger leve, terminando todos nítidos no fim da animação.
 *
 * Data-driven: edita `sealLogos` em lib/clientLogos.ts (a ordem define a posição no anel).
 * Dirigido pelo `progress` (0→1) do ScrollFrameSequence (scroll no desktop / vídeo no mobile).
 */
export function LensSealRing({
  progress,
  logos = sealLogos,
  /** Raio horizontal do anel em px */
  radius = 300,
  /** Raio vertical (default = radius). No mobile use oval vertical (radiusY > radius). */
  radiusY,
  /** Altura base de cada selo em px (× scale do item) */
  baseHeight = 38,
  /** Quando os selos começam a focar (após a marca resolver) */
  revealStart = 0.7,
  /** Quando o último selo termina de focar */
  revealEnd = 1,
  /** Desfoque inicial do rack-focus, em px */
  blurMax = 9,
}: {
  progress: number;
  logos?: ClientLogo[];
  radius?: number;
  radiusY?: number;
  baseHeight?: number;
  revealStart?: number;
  revealEnd?: number;
  blurMax?: number;
}) {
  const rY = radiusY ?? radius;
  const n = logos.length;
  // Caixa fixa por selo: TODOS ocupam o mesmo retângulo e se ajustam dentro com
  // object-contain. Isso dá peso visual equilibrado entre wordmarks largas (Unicred,
  // Colcci) e emblemas quadrados (Governo SC, Prefeitura) — em vez de escalar por
  // altura (o que faria wordmarks largas estourarem em largura e invadirem a marca).
  const boxH = baseHeight;
  const boxW = baseHeight * 2.7;
  const span = Math.max(0.0001, revealEnd - revealStart);
  // staggerSpan + resolveSpan < 1 deixa um "beat" final com TODOS os selos nítidos.
  const staggerSpan = span * 0.5; // janela em que os selos COMEÇAM a focar
  const resolveSpan = span * 0.42; // duração do foco de cada selo

  // Camada de GPU promovida UMA vez para o anel inteiro durante a janela de reveal.
  // (Antes o willChange alternava por-selo a cada cruzamento de 0/1 do `local`, o que,
  // somado ao stagger, fazia o navegador criar/destruir camadas em cascata no scroll-up
  // → flicker "craquelado". Promover/rebaixar uma vez só elimina esse thrash.)
  const ringActive = progress > revealStart - 0.06 && progress < 1;
  const willChange = ringActive ? "transform, opacity, filter" : "auto";

  return (
    <div className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center">
      {logos.map((logo, i) => {
        const t0 = revealStart + staggerSpan * (i / Math.max(1, n - 1));
        const local = clamp((progress - t0) / resolveSpan);
        // ângulo: começa no topo (-90°) e distribui no sentido horário
        const angle = ((-90 + (360 / n) * i) * Math.PI) / 180;
        // profundidade: entra um pouco mais "dentro" e assenta no raio ao focar
        const depth = 0.82 + 0.18 * local;
        const x = Math.cos(angle) * radius * depth;
        const y = Math.sin(angle) * rY * depth;
        // Snap do blur a 1 casa: corta repaints redundantes por micro-variação no scrub.
        const blur = (Math.round((1 - local) * blurMax * 10) / 10).toFixed(1);
        return (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={logo.company}
            src={`/logos/${logo.file}`}
            alt={logo.company}
            loading="lazy"
            decoding="async"
            className="absolute left-1/2 top-1/2 object-contain"
            style={{
              height: `${boxH}px`,
              width: `${boxW}px`,
              opacity: local,
              // translateZ(0) mantém o selo na mesma camada de compositor durante o reveal,
              // evitando re-rasterização do blur quadro a quadro.
              transform: `translate(-50%, -50%) translate(${x}px, ${y}px) scale(${
                0.9 + local * 0.1
              }) translateZ(0)`,
              // rack-focus: desfoque→nítido. brightness(0) invert(1) = branco uniforme.
              filter: `brightness(0) invert(1) blur(${blur}px)`,
              backfaceVisibility: "hidden",
              willChange,
            }}
          />
        );
      })}
    </div>
  );
}

export default LensSealRing;
