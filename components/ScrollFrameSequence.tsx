"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useReducedMotion } from "@/lib/useReducedMotion";

/**
 * ScrollFrameSequence
 * -------------------
 * Player canvas estilo Apple (AirPods): mapeia a posição do scroll a uma
 * sequência de frames (imagens) e desenha o frame correto no <canvas>.
 *
 * Pensado para receber a pasta de frames exportada do Veo 3.1 via ffmpeg.
 * Ex.: ffmpeg -i lente.mp4 -vf "fps=15,scale=1280:-1" -q:v 5 public/frames/lente/%03d.webp
 *
 * Uso:
 *   <ScrollFrameSequence framesPath="/frames/lente" frameCount={120}>
 *     <h1 className="font-display ...">Filmes que fazem empresas parecerem gigantes.</h1>
 *   </ScrollFrameSequence>
 *
 * - children são renderizados POR CIMA do canvas (headline, logos, CTA).
 * - Respeita prefers-reduced-motion e cai para frame estático em mobile/saveData.
 */
export type ScrollFrameSequenceProps = {
  /** Pasta dentro de /public, sem barra final. Ex.: "/frames/lente" */
  framesPath: string;
  /** Número total de frames na pasta */
  frameCount: number;
  /** Extensão dos arquivos, sem ponto (default "webp") */
  ext?: string;
  /** Zero-padding do número do arquivo (default 3 → 001, 002, ...) */
  pad?: number;
  /** Índice do primeiro arquivo (default 1 → começa em 001) */
  startIndex?: number;
  /** Altura da região de scroll, em múltiplos da viewport (default 3 → 300vh) */
  scrollHeightVh?: number;
  /** object-fit do frame no canvas (default "cover") */
  fit?: "cover" | "contain";
  /** Quantos frames pré-carregar antes de revelar (default 12) */
  preloadCount?: number;
  /** Suavização do scrub do ScrollTrigger (default 0.5) */
  scrub?: number | boolean;
  /** Em telas pequenas / saveData, mostrar frame estático em vez de scrubar (default true) */
  staticOnMobile?: boolean;
  /** Breakpoint (px) abaixo do qual o fallback mobile vale (default 768) */
  mobileBreakpoint?: number;
  /** Frame (1-based, no espaço de startIndex) usado como pôster/fallback. Default: último */
  posterIndex?: number;
  /** Callback com o progresso do scroll (0→1). Útil pra sincronizar overlays (logos). */
  onProgress?: (progress: number) => void;
  /**
   * Conteúdo por cima do canvas. Pode ser ReactNode OU uma função
   * (progress: 0→1) => ReactNode, para animar overlays em sincronia com o scroll
   * (ex.: revelar logos). No modo estático/mobile o progress recebido é 1.
   */
  children?: React.ReactNode | ((progress: number) => React.ReactNode);
  className?: string;
  /** Cor de fundo enquanto os frames carregam (default "var(--ink-abyss)") */
  background?: string;
};

export function ScrollFrameSequence({
  framesPath,
  frameCount,
  ext = "webp",
  pad = 3,
  startIndex = 1,
  scrollHeightVh = 3,
  fit = "cover",
  preloadCount = 12,
  scrub = 0.5,
  staticOnMobile = true,
  mobileBreakpoint = 768,
  posterIndex,
  onProgress,
  children,
  className = "",
  background = "var(--ink-abyss)",
}: ScrollFrameSequenceProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const stateRef = useRef({ frame: 0 });
  const lastDrawnRef = useRef(-1);
  const lastProgressRef = useRef(-1);

  const isReduced = useReducedMotion();
  const [ready, setReady] = useState(false);
  const [isStatic, setIsStatic] = useState(false);
  const [progress, setProgress] = useState(0);

  // Refs para o onUpdate do ScrollTrigger não re-inscrever a cada render.
  const childIsFn = typeof children === "function";
  const onProgressRef = useRef(onProgress);
  const childIsFnRef = useRef(childIsFn);
  useEffect(() => {
    onProgressRef.current = onProgress;
    childIsFnRef.current = childIsFn;
  });

  const frameUrl = useCallback(
    (i: number) =>
      `${framesPath}/${String(i + startIndex).padStart(pad, "0")}.${ext}`,
    [framesPath, startIndex, pad, ext]
  );

  // Decide o modo (estático vs scrub) com base em reduced-motion / mobile / saveData.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const decide = () => {
      const conn = (navigator as Navigator & { connection?: { saveData?: boolean } })
        .connection;
      const saveData = !!conn?.saveData;
      const smallScreen = window.innerWidth < mobileBreakpoint;
      setIsStatic(isReduced || (staticOnMobile && (smallScreen || saveData)));
    };
    decide();
    window.addEventListener("resize", decide);
    return () => window.removeEventListener("resize", decide);
  }, [isReduced, staticOnMobile, mobileBreakpoint]);

  // Desenha um frame no canvas com cover/contain + devicePixelRatio.
  const drawFrame = useCallback(
    (index: number) => {
      const canvas = canvasRef.current;
      const img = imagesRef.current[index];
      if (!canvas || !img || !img.complete || img.naturalWidth === 0) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const cw = canvas.clientWidth;
      const ch = canvas.clientHeight;
      if (canvas.width !== cw * dpr || canvas.height !== ch * dpr) {
        canvas.width = cw * dpr;
        canvas.height = ch * dpr;
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, cw, ch);

      const ir = img.naturalWidth / img.naturalHeight;
      const cr = cw / ch;
      let dw = cw;
      let dh = ch;
      if (fit === "cover" ? ir > cr : ir < cr) {
        dh = ch;
        dw = ch * ir;
      } else {
        dw = cw;
        dh = cw / ir;
      }
      ctx.drawImage(img, (cw - dw) / 2, (ch - dh) / 2, dw, dh);
    },
    [fit]
  );

  // Pré-carrega as imagens.
  // - SCRUB: carrega + pré-decodifica TODOS os frames (scrub sem stall).
  // - ESTÁTICO (mobile/reduced-motion): carrega só o pôster (evita ~MBs de bitmap à toa).
  useEffect(() => {
    let cancelled = false;
    const imgs: HTMLImageElement[] = new Array(frameCount);
    imagesRef.current = imgs;
    const posterIdx = Math.max(
      0,
      Math.min(frameCount - 1, (posterIndex ?? frameCount) - 1 - (startIndex - 1))
    );

    if (isStatic) {
      const img = new Image();
      img.src = frameUrl(posterIdx);
      img.decoding = "async";
      img.onload = () => {
        if (cancelled) return;
        if (typeof img.decode === "function") img.decode().catch(() => {});
        drawFrame(posterIdx);
      };
      imgs[posterIdx] = img;
    } else {
      let loaded = 0;
      for (let i = 0; i < frameCount; i++) {
        const img = new Image();
        img.src = frameUrl(i);
        img.decoding = "async";
        img.onload = () => {
          if (cancelled) return;
          loaded += 1;
          // Pré-decodifica para o bitmap já estar pronto na hora do scrub (sem stall).
          if (typeof img.decode === "function") img.decode().catch(() => {});
          if (i === 0) drawFrame(0);
          if (loaded >= Math.min(preloadCount, frameCount) && !ready) {
            setReady(true);
          }
        };
        imgs[i] = img;
      }
    }

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [framesPath, frameCount, isStatic]);

  // MODO ESTÁTICO (reduced-motion / mobile / saveData): desenha só o pôster.
  useEffect(() => {
    if (!isStatic) return;
    // No fallback estático o overlay recebe progress = 1 (estado final).
    onProgressRef.current?.(1);
    if (childIsFnRef.current) setProgress(1);
    const poster = (posterIndex ?? frameCount) - 1 - (startIndex - 1);
    const idx = Math.max(0, Math.min(frameCount - 1, poster));
    let raf = 0;
    const tryDraw = () => {
      const img = imagesRef.current[idx];
      if (img && img.complete && img.naturalWidth > 0) {
        drawFrame(idx);
      } else {
        raf = requestAnimationFrame(tryDraw);
      }
    };
    tryDraw();
    const onResize = () => drawFrame(idx);
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, [isStatic, posterIndex, frameCount, startIndex, drawFrame]);

  // MODO SCRUB: ScrollTrigger pinado mapeia progresso → índice do frame.
  useEffect(() => {
    if (isStatic || !ready || typeof window === "undefined") return;
    const wrap = wrapRef.current;
    if (!wrap) return;

    const ctx = gsap.context(() => {
      const tween = gsap.to(stateRef.current, {
        frame: frameCount - 1,
        ease: "none",
        scrollTrigger: {
          trigger: wrap,
          start: "top top",
          end: "bottom bottom",
          scrub,
          pin: stickyRef.current,
          pinSpacing: false,
          invalidateOnRefresh: true,
        },
        onUpdate: () => {
          const f = stateRef.current.frame;
          // Desenha só quando o índice do frame muda (evita drawImage redundante).
          const idx = Math.round(f);
          if (idx !== lastDrawnRef.current) {
            lastDrawnRef.current = idx;
            drawFrame(idx);
          }
          const p = frameCount > 1 ? f / (frameCount - 1) : 0;
          onProgressRef.current?.(p);
          // Quantiza o progresso → re-render do React só a cada ~1% (não a cada frame).
          if (childIsFnRef.current) {
            const pq = Math.round(p * 100) / 100;
            if (pq !== lastProgressRef.current) {
              lastProgressRef.current = pq;
              setProgress(pq);
            }
          }
        },
      });
      return () => {
        tween.scrollTrigger?.kill();
        tween.kill();
      };
    }, wrap);

    const onResize = () => {
      lastDrawnRef.current = -1; // força redesenho após mudar o tamanho do canvas
      drawFrame(Math.round(stateRef.current.frame));
      ScrollTrigger.refresh();
    };
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      ctx.revert();
    };
  }, [isStatic, ready, frameCount, scrub, drawFrame]);

  // ---- Render ----
  // Estático: ocupa 1 viewport. Scrub: a região tem scrollHeightVh viewports
  // e o conteúdo fica "sticky" no topo durante a rolagem.
  const overlay =
    typeof children === "function"
      ? (children as (p: number) => React.ReactNode)(progress)
      : children;
  return (
    <section
      ref={wrapRef}
      className={`relative w-full ${className}`}
      style={{ height: isStatic ? "100svh" : `${scrollHeightVh * 100}svh` }}
    >
      <div
        ref={stickyRef}
        className="sticky top-0 h-[100svh] w-full overflow-hidden"
        style={{ background }}
      >
        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
        {/* Overlay: headline / logos / CTA.
            - children ReactNode  → centralizado (uso simples)
            - children função     → palco full-bleed relativo (controle por fase) */}
        {overlay &&
          (typeof children === "function" ? (
            <div className="pointer-events-none absolute inset-0 z-10">
              <div className="pointer-events-auto relative h-full w-full">{overlay}</div>
            </div>
          ) : (
            <div className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center">
              <div className="pointer-events-auto">{overlay}</div>
            </div>
          ))}
      </div>
    </section>
  );
}

export default ScrollFrameSequence;
