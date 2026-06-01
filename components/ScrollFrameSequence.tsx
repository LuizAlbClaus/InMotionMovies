"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useReducedMotion } from "@/lib/useReducedMotion";

/**
 * ScrollFrameSequence
 * -------------------
 * Player de animação cinematográfica com 3 modos automáticos:
 *
 *  - "scrub"  (desktop): canvas estilo Apple — o scroll dirige a sequência de frames.
 *  - "video"  (mobile/saveData, se `mobileVideoSrc`): vídeo autoplay mudo inline; o
 *             `currentTime` dirige o `progress` (overlays animam sozinhos, sem custo de scrub).
 *  - "poster" (prefers-reduced-motion, ou mobile sem vídeo): 1 frame estático, progress = 1.
 *
 * O overlay (children) pode ser função (progress: 0→1) => ReactNode e funciona IGUAL nos 3 modos.
 *
 * Frames: ffmpeg -i v.mp4 -vf "fps=15,scale=1280:720" -c:v libwebp -quality 80 public/frames/x/%03d.webp
 * Vídeo mobile: ffmpeg -i v.mp4 -an -c:v libx264 -crf 26 -movflags +faststart public/video/x.mp4
 */
type Mode = "scrub" | "video" | "poster";

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
  /** object-fit do frame/vídeo (default "cover") */
  fit?: "cover" | "contain";
  /** Quantos frames pré-carregar antes de revelar (default 12) */
  preloadCount?: number;
  /** Suavização do scrub do ScrollTrigger (default 0.5) */
  scrub?: number | boolean;
  /** Em telas pequenas / saveData, NÃO scrubar (default true) */
  staticOnMobile?: boolean;
  /** Breakpoint (px) abaixo do qual o modo mobile vale (default 768) */
  mobileBreakpoint?: number;
  /** Frame (1-based, no espaço de startIndex) usado como pôster/fallback. Default: último */
  posterIndex?: number;
  /** MP4 mudo para o modo mobile (autoplay inline). Se ausente, mobile cai pra pôster estático. */
  mobileVideoSrc?: string;
  /** Imagem de pôster do vídeo mobile (default: primeiro frame). */
  poster?: string;
  /** Callback com o progresso (0→1). Sincroniza overlays (logos). */
  onProgress?: (progress: number) => void;
  /**
   * Conteúdo por cima. ReactNode OU (progress: 0→1) => ReactNode (anima overlays em
   * sincronia com scroll/vídeo). No modo "poster" o progress é 1 (estado final).
   */
  children?: React.ReactNode | ((progress: number) => React.ReactNode);
  className?: string;
  /** Cor de fundo enquanto carrega (default "var(--ink-abyss)") */
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
  mobileVideoSrc,
  poster,
  onProgress,
  children,
  className = "",
  background = "var(--ink-abyss)",
}: ScrollFrameSequenceProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const stateRef = useRef({ frame: 0 });
  const lastDrawnRef = useRef(-1);
  const lastProgressRef = useRef(-1);

  const isReduced = useReducedMotion();
  const [ready, setReady] = useState(false);
  const [mode, setMode] = useState<Mode>("scrub");
  const [progress, setProgress] = useState(0);

  // Refs pra os callbacks não re-inscreverem os listeners a cada render.
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

  // Emite progresso (quantizado a 1% pro React não re-renderizar a cada frame).
  const emitProgress = useCallback((p: number) => {
    const clamped = p < 0 ? 0 : p > 1 ? 1 : p;
    onProgressRef.current?.(clamped);
    if (childIsFnRef.current) {
      const pq = Math.round(clamped * 100) / 100;
      if (pq !== lastProgressRef.current) {
        lastProgressRef.current = pq;
        setProgress(pq);
      }
    }
  }, []);

  // Decide o modo: reduced-motion → poster; mobile/saveData → video (se houver) ou poster; senão scrub.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const decide = () => {
      const conn = (navigator as Navigator & { connection?: { saveData?: boolean } })
        .connection;
      const saveData = !!conn?.saveData;
      const smallScreen = window.innerWidth < mobileBreakpoint;
      let m: Mode = "scrub";
      if (isReduced) m = "poster";
      else if (staticOnMobile && (smallScreen || saveData))
        m = mobileVideoSrc ? "video" : "poster";
      setMode(m);
    };
    decide();
    window.addEventListener("resize", decide);
    return () => window.removeEventListener("resize", decide);
  }, [isReduced, staticOnMobile, mobileBreakpoint, mobileVideoSrc]);

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
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
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

  const posterIdx = Math.max(
    0,
    Math.min(frameCount - 1, (posterIndex ?? frameCount) - 1 - (startIndex - 1))
  );

  // Pré-carrega frames: TODOS no scrub; só o pôster no poster; nada no video (o <video> cuida).
  useEffect(() => {
    if (mode === "video") return;
    let cancelled = false;
    const imgs: HTMLImageElement[] = new Array(frameCount);

    if (mode === "poster") {
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
          if (typeof img.decode === "function") img.decode().catch(() => {});
          if (i === 0) drawFrame(0);
          if (loaded >= Math.min(preloadCount, frameCount) && !ready) setReady(true);
        };
        imgs[i] = img;
      }
    }
    imagesRef.current = imgs; // atribui ao ref só depois de montar o array local
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [framesPath, frameCount, mode]);

  // MODO POSTER: progress = 1 e desenha o pôster.
  useEffect(() => {
    if (mode !== "poster") return;
    emitProgress(1);
    let raf = 0;
    const tryDraw = () => {
      const img = imagesRef.current[posterIdx];
      if (img && img.complete && img.naturalWidth > 0) drawFrame(posterIdx);
      else raf = requestAnimationFrame(tryDraw);
    };
    tryDraw();
    const onResize = () => drawFrame(posterIdx);
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, [mode, posterIdx, drawFrame, emitProgress]);

  // MODO VIDEO: autoplay inline; currentTime dirige o progress (rAF + quantização).
  useEffect(() => {
    if (mode !== "video") return;
    const v = videoRef.current;
    if (!v) return;
    let raf = 0;
    let stopped = false;
    const loop = () => {
      if (stopped) return;
      const p = v.duration ? v.currentTime / v.duration : 0;
      emitProgress(p);
      if (v.ended || p >= 1) return; // para o loop ao fim (economiza bateria)
      raf = requestAnimationFrame(loop);
    };
    // Atualiza o progress também via eventos (cobre seek/scrub e o estado após o loop parar).
    const sync = () => emitProgress(v.duration ? v.currentTime / v.duration : 0);
    v.addEventListener("timeupdate", sync);
    v.addEventListener("seeked", sync);

    // autoplay; se o navegador bloquear, cai pra pôster estático.
    v.play().then(() => {
      raf = requestAnimationFrame(loop);
    }).catch(() => setMode("poster"));
    return () => {
      stopped = true;
      cancelAnimationFrame(raf);
      v.removeEventListener("timeupdate", sync);
      v.removeEventListener("seeked", sync);
    };
  }, [mode, emitProgress]);

  // MODO SCRUB: ScrollTrigger pinado mapeia progresso → índice do frame.
  useEffect(() => {
    if (mode !== "scrub" || !ready || typeof window === "undefined") return;
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
          const idx = Math.round(f);
          if (idx !== lastDrawnRef.current) {
            lastDrawnRef.current = idx;
            drawFrame(idx);
          }
          emitProgress(frameCount > 1 ? f / (frameCount - 1) : 0);
        },
      });
      return () => {
        tween.scrollTrigger?.kill();
        tween.kill();
      };
    }, wrap);

    const onResize = () => {
      lastDrawnRef.current = -1;
      drawFrame(Math.round(stateRef.current.frame));
      ScrollTrigger.refresh();
    };
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      ctx.revert();
    };
  }, [mode, ready, frameCount, scrub, drawFrame, emitProgress]);

  // ---- Render ----
  const overlay =
    typeof children === "function"
      ? (children as (p: number) => React.ReactNode)(progress)
      : children;
  const isScrub = mode === "scrub";
  return (
    <section
      ref={wrapRef}
      className={`relative w-full ${className}`}
      style={{ height: isScrub ? `${scrollHeightVh * 100}svh` : "100svh" }}
    >
      <div
        ref={stickyRef}
        className="sticky top-0 h-[100svh] w-full overflow-hidden"
        style={{ background }}
      >
        {mode === "video" ? (
          <video
            ref={videoRef}
            src={mobileVideoSrc}
            poster={poster ?? frameUrl(0)}
            muted
            playsInline
            autoPlay
            preload="auto"
            disablePictureInPicture
            className={`absolute inset-0 h-full w-full ${
              fit === "cover" ? "object-cover" : "object-contain"
            }`}
          />
        ) : (
          <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
        )}
        {/* Overlay */}
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
