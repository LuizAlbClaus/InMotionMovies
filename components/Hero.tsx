"use client";

import React, { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { VideoModal } from "./VideoModal";

const YT_ID = "88R8UwRvBPE"; // showreel completo (com áudio) — só no lightbox sob clique

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subheadlineRef = useRef<HTMLParagraphElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const isReduced = useReducedMotion();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Background showreel = MP4 self-hosted (autoplay mudo + playsinline). Toca de forma
  // confiável no mobile, ao contrário do iframe do YouTube. O src é atribuído via ref no
  // mount (não em state, pra evitar re-render e mismatch de hidratação): 480p (~5MB) no
  // mobile e 720p no desktop — o poster cobre o tick até o primeiro frame.
  // Garante ainda muted+play robusto: iOS exige muted no load (o atributo do React nem
  // sempre reflete a tempo → forçamos via ref). Re-tenta no canplay, ao voltar a aba pro
  // foco e — último recurso — na primeira interação. Cobre Low Power Mode / autoplay adiado.
  useEffect(() => {
    if (isReduced) return;
    const v = videoRef.current;
    if (!v) return;

    v.src = window.innerWidth < 768 ? "/video/showreel-sm.mp4" : "/video/showreel.mp4";

    const tryPlay = () => {
      v.muted = true;
      const p = v.play();
      if (p) p.catch(() => {});
    };

    tryPlay();
    v.addEventListener("canplay", tryPlay);

    const onVisible = () => {
      if (document.visibilityState === "visible") tryPlay();
    };
    document.addEventListener("visibilitychange", onVisible);

    const onInteract = () => {
      tryPlay();
      window.removeEventListener("touchstart", onInteract);
      window.removeEventListener("pointerdown", onInteract);
      window.removeEventListener("scroll", onInteract);
    };
    window.addEventListener("touchstart", onInteract, { passive: true });
    window.addEventListener("pointerdown", onInteract, { passive: true });
    window.addEventListener("scroll", onInteract, { passive: true });

    return () => {
      v.removeEventListener("canplay", tryPlay);
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("touchstart", onInteract);
      window.removeEventListener("pointerdown", onInteract);
      window.removeEventListener("scroll", onInteract);
    };
  }, [isReduced]);

  // Magnetic button effect (bypassed se reduced motion)
  useEffect(() => {
    if (isReduced || typeof window === "undefined") return;

    const buttons = containerRef.current?.querySelectorAll(".magnetic-btn");
    if (!buttons) return;

    buttons.forEach((btn) => {
      const mouseMove = (e: MouseEvent) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        gsap.to(btn, { x: x * 0.35, y: y * 0.35, duration: 0.3, ease: "power2.out" });
      };
      const mouseLeave = () => {
        gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: "elastic.out(1, 0.3)" });
      };
      btn.addEventListener("mousemove", mouseMove as EventListener);
      btn.addEventListener("mouseleave", mouseLeave);
      return () => {
        btn.removeEventListener("mousemove", mouseMove as EventListener);
        btn.removeEventListener("mouseleave", mouseLeave);
      };
    });
  }, [isReduced]);

  // Headline staggered reveal on load
  useEffect(() => {
    if (isReduced) return;

    const headline = headlineRef.current;
    if (!headline) return;

    const text = headline.textContent || "";
    headline.innerHTML = text
      .split(" ")
      .map((word) => `<span class="inline-block opacity-0 translate-y-6 mr-[0.25em]">${word}</span>`)
      .join("");

    const words = headline.querySelectorAll("span");
    const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

    tl.to(words, { opacity: 1, y: 0, stagger: 0.08, duration: 1.2 }, "0");

    if (subheadlineRef.current) {
      tl.fromTo(
        subheadlineRef.current,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 1.0 },
        "-=0.6"
      );
    }

    if (buttonsRef.current) {
      // O wrapper carrega a classe opacity-0 (estado inicial pré-JS). Precisamos revelá-lo
      // — senão os botões internos animam dentro de um container invisível e os CTAs
      // (incl. mobile) nunca aparecem.
      tl.to(buttonsRef.current, { opacity: 1, duration: 0.4 }, "-=0.6");
      tl.fromTo(
        buttonsRef.current.querySelectorAll("button"),
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.1 },
        "<"
      );
    }
  }, [isReduced]);

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="hero"
      ref={containerRef}
      className="relative w-full h-screen flex items-center justify-center overflow-hidden bg-ink-abyss"
    >
      {/* Background Poster & Video */}
      <div className="absolute inset-0 w-full h-full z-0 select-none pointer-events-none">
        {/* Gradiente escuro para garantir contraste do texto */}
        <div className="absolute inset-0 bg-gradient-to-t from-ink-base via-ink-base/30 to-ink-abyss/85 z-10" />

        {/* Background showreel — vídeo nativo. O poster (frame do próprio showreel) aparece
            instantâneo; com +faststart no MP4 a reprodução começa assim que o primeiro chunk
            chega. opacity-25 constante = transição imperceptível entre poster e vídeo. */}
        {isReduced ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src="/video/showreel-poster.jpg"
            alt=""
            aria-hidden="true"
            className="absolute top-1/2 left-1/2 min-w-full min-h-full w-auto h-auto -translate-x-1/2 -translate-y-1/2 object-cover opacity-25 z-[1]"
          />
        ) : (
          <video
            ref={videoRef}
            className="absolute top-1/2 left-1/2 min-w-full min-h-full w-auto h-auto -translate-x-1/2 -translate-y-1/2 object-cover opacity-25 z-[1]"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            poster="/video/showreel-poster.jpg"
          />
        )}
      </div>

      {/* Hero Content */}
      <div className="relative z-20 max-w-5xl mx-auto px-6 text-center flex flex-col items-center">
        {/* Accent Tag */}
        <span className="font-display font-medium text-sm md:text-base tracking-[0.35em] text-accent-bright uppercase mb-6">
          InMotion Movies
        </span>

        {/* Headline */}
        <h1
          ref={headlineRef}
          className="font-display text-4xl md:text-5xl lg:text-6xl tracking-wide text-text-hi uppercase leading-[1.08] max-w-3xl"
        >
          Filmes que fazem empresas parecerem gigantes.
        </h1>

        {/* Subheadline */}
        <p
          ref={subheadlineRef}
          className={`mt-6 text-base md:text-xl text-text-mut max-w-2xl font-light leading-relaxed ${
            isReduced ? "opacity-100" : "opacity-0"
          }`}
        >
          Produções cinematográficas, campanhas publicitárias e conteúdo estratégico para marcas que querem dominar atenção.
        </p>

        {/* CTAs */}
        <div
          ref={buttonsRef}
          className={`mt-10 flex flex-wrap items-center justify-center gap-4 ${
            isReduced ? "opacity-100" : "opacity-0"
          }`}
        >
          <button
            onClick={() => scrollToSection("sobre")}
            className="magnetic-btn font-display text-base md:text-lg tracking-widest border border-text-mut/30 hover:border-text-hi text-text-hi px-6 py-3 rounded transition-all duration-300 uppercase cursor-pointer"
          >
            Quem somos
          </button>

          <button
            onClick={() => setIsModalOpen(true)}
            className="magnetic-btn group flex items-center gap-2.5 font-display text-base md:text-lg tracking-widest border border-text-mut/30 hover:border-text-hi text-text-hi px-6 py-3 rounded transition-all duration-300 uppercase cursor-pointer"
          >
            <svg
              width="10"
              height="12"
              viewBox="0 0 12 14"
              fill="currentColor"
              className="transition-transform duration-300 group-hover:scale-110"
            >
              <path d="M2 1L10 7L2 13V1Z" />
            </svg>
            Assistir Showreel
          </button>

          <button
            onClick={() => scrollToSection("contato")}
            className="magnetic-btn font-display text-base md:text-lg tracking-widest bg-accent hover:bg-accent-deep text-text-hi px-8 py-3 rounded border border-accent/25 transition-all duration-300 uppercase cursor-pointer"
          >
            Whatsapp
          </button>
        </div>
      </div>

      {/* Fullscreen Video Lightbox */}
      <VideoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        videoUrl={`https://www.youtube.com/watch?v=${YT_ID}`}
      />
    </section>
  );
}
