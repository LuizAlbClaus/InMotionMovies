"use client";

import React, { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { VideoModal } from "./VideoModal";

const YT_ID = "88R8UwRvBPE";
// youtube-nocookie + sem enablejsapi = embed mais leve para background.
const BG_SRC = `https://www.youtube-nocookie.com/embed/${YT_ID}?autoplay=1&mute=1&loop=1&playlist=${YT_ID}&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1&iv_load_policy=3&disablekb=1`;

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subheadlineRef = useRef<HTMLParagraphElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);

  const isReduced = useReducedMotion();
  const [showVideo, setShowVideo] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Monta o iframe do YouTube logo após o primeiro paint (o texto/headline já é o LCP).
  // Fundo fica preto (bg-ink-abyss) até o vídeo carregar, então faz fade-in.
  useEffect(() => {
    setShowVideo(true);
  }, []);

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
      tl.fromTo(
        buttonsRef.current.querySelectorAll("button"),
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.1 },
        "-=0.6"
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

        {/* Background YouTube (montado após idle, fade-in ao carregar; fundo preto até lá) */}
        {showVideo && (
          <div
            className={`absolute inset-0 w-full h-full overflow-hidden z-[1] transition-opacity duration-1000 ${
              videoLoaded ? "opacity-100" : "opacity-0"
            }`}
          >
            <iframe
              src={BG_SRC}
              title="InMotion Movies Showreel"
              loading="lazy"
              onLoad={() => setVideoLoaded(true)}
              className="absolute top-1/2 left-1/2 w-[100vw] h-[56.25vw] min-h-full min-w-[177.77vh] -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-25"
              allow="autoplay; encrypted-media; picture-in-picture"
              frameBorder="0"
            />
          </div>
        )}
      </div>

      {/* Hero Content */}
      <div className="relative z-20 max-w-5xl mx-auto px-6 text-center flex flex-col items-center">
        {/* Accent Tag */}
        <span className="font-display text-sm md:text-base tracking-[0.35em] text-accent uppercase mb-6 animate-pulse">
          InMotion Movies
        </span>

        {/* Headline */}
        <h1
          ref={headlineRef}
          className="font-display text-5xl md:text-7xl lg:text-8xl tracking-wide text-text-hi uppercase leading-[1.05] max-w-4xl"
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
            Agendar Reunião
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
