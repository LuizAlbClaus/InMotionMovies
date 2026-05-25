"use client";

import React, { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { VideoModal } from "./VideoModal";

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const playBtnRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subheadlineRef = useRef<HTMLParagraphElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const isReduced = useReducedMotion();
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Lazy load video when in viewport to protect LCP
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !videoSrc) {
            setVideoSrc("/video/hero.mp4");
            observer.disconnect();
          }
        });
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [videoSrc]);

  // Magnetic button effect using GSAP (bypassed if reduced motion is enabled)
  useEffect(() => {
    if (isReduced || typeof window === "undefined") return;

    const buttons = containerRef.current?.querySelectorAll(".magnetic-btn");
    if (!buttons) return;

    buttons.forEach((btn) => {
      const mouseMove = (e: MouseEvent) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        gsap.to(btn, {
          x: x * 0.35,
          y: y * 0.35,
          duration: 0.3,
          ease: "power2.out",
        });
      };

      const mouseLeave = () => {
        gsap.to(btn, {
          x: 0,
          y: 0,
          duration: 0.5,
          ease: "elastic.out(1, 0.3)",
        });
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

    // Split text into words manually to avoid heavy external libraries
    const text = headline.textContent || "";
    headline.innerHTML = text
      .split(" ")
      .map((word) => `<span class="inline-block opacity-0 translate-y-6 mr-[0.25em]">${word}</span>`)
      .join("");

    const words = headline.querySelectorAll("span");

    const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

    // 1. Play Button Reveal
    if (playBtnRef.current) {
      tl.fromTo(
        playBtnRef.current,
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1, duration: 1.0 }
      );
    }

    // 2. Headline Words Stagger
    tl.to(
      words,
      {
        opacity: 1,
        y: 0,
        stagger: 0.08,
        duration: 1.2,
      },
      playBtnRef.current ? "-=0.7" : "0"
    );

    // 3. Subheadline
    if (subheadlineRef.current) {
      tl.fromTo(
        subheadlineRef.current,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 1.0 },
        "-=0.6"
      );
    }

    // 4. Action Buttons
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
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="hero"
      ref={containerRef}
      className="relative w-full h-screen flex items-center justify-center overflow-hidden bg-ink-abyss"
    >
      {/* Background Poster & Video */}
      <div className="absolute inset-0 w-full h-full z-0 select-none pointer-events-none">
        {/* Dynamic Dark Gradient Overlay to guarantee text contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-ink-base via-ink-base/30 to-ink-abyss/80 z-10" />

        {/* Poster Image */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/video/hero-poster.png"
          alt="Cinematic background placeholder"
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
            videoSrc ? "opacity-0" : "opacity-30"
          }`}
        />

        {/* Video Player */}
        {videoSrc && (
          <video
            ref={videoRef}
            src={videoSrc}
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover opacity-25 transition-opacity duration-1000"
          />
        )}
      </div>

      {/* Hero Content */}
      <div className="relative z-20 max-w-5xl mx-auto px-6 text-center flex flex-col items-center">
        {/* Accent Tag */}
        <span className="font-display text-sm md:text-base tracking-[0.35em] text-accent uppercase mb-4 animate-pulse">
          InMotion Movies
        </span>

        {/* Big Circular Play Button (AT Agency Style) */}
        <div
          ref={playBtnRef}
          onClick={() => setIsModalOpen(true)}
          className={`magnetic-btn group mb-6 cursor-pointer focus:outline-none rounded-full ${
            isReduced ? "opacity-100" : "opacity-0"
          }`}
          role="button"
          tabIndex={0}
          aria-label="Assistir Showreel"
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              setIsModalOpen(true);
            }
          }}
        >
          <div className="w-20 h-20 md:w-24 md:h-24 rounded-full border border-text-hi/15 group-hover:border-accent/80 flex items-center justify-center bg-ink-raise/20 backdrop-blur-md transition-all duration-500 shadow-lg relative">
            {/* Pulsing/Rotating Accent Ring */}
            <div className="absolute inset-0 rounded-full border border-transparent border-t-accent opacity-0 group-hover:opacity-100 group-hover:rotate-180 transition-all duration-700 ease-out" />
            <div className="absolute inset-[-4px] rounded-full border border-accent/20 scale-90 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-500 animate-pulse" />

            {/* Play Triangle SVG */}
            <svg
              width="24"
              height="28"
              viewBox="0 0 18 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="ml-1.5 text-text-hi group-hover:text-accent transition-colors duration-300 transform group-hover:scale-105"
            >
              <path
                d="M2 2L15 10L2 18V2Z"
                fill="currentColor"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

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
        videoUrl="https://www.youtube.com/watch?v=88R8UwRvBPE"
      />
    </section>
  );
}

