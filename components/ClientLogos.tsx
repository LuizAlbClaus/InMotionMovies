"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { heroStripLogos } from "@/lib/clientLogos";

export function ClientLogos() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const eyebrowRef = useRef<HTMLSpanElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const isReduced = useReducedMotion();

  useEffect(() => {
    if (isReduced || typeof window === "undefined") return;

    const eyebrow = eyebrowRef.current;
    const wrapper = gridRef.current;
    if (!wrapper || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          toggleActions: "play none none none",
        },
        defaults: { ease: "power3.out" },
      });

      if (eyebrow) {
        tl.fromTo(eyebrow, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.6 });
      }
      tl.fromTo(
        wrapper,
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.7 },
        eyebrow ? "-=0.3" : "0"
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [isReduced]);

  return (
    <section
      ref={sectionRef}
      aria-label="Marcas que confiaram na InMotion"
      className="relative w-full bg-ink-base border-t border-text-hi/5 py-14 md:py-20"
    >
      <div className="max-w-6xl mx-auto px-6">
        <span
          ref={eyebrowRef}
          className={`block text-center font-display text-xs md:text-sm tracking-[0.3em] text-text-mut uppercase mb-10 ${
            isReduced ? "opacity-100" : "opacity-0"
          }`}
        >
          Marcas que confiaram na InMotion
        </span>

        <div
          ref={gridRef}
          className={`flex overflow-hidden relative group w-full ${
            isReduced ? "opacity-100" : "opacity-0"
          }`}
          style={{
            maskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
            WebkitMaskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)"
          }}
        >
          <div className="flex animate-marquee min-w-max shrink-0 items-center gap-10 md:gap-16 pr-10 md:pr-16 group-hover:[animation-play-state:paused]">
            {heroStripLogos.map((logo, index) => (
              <div
                key={`${logo.file}-${index}`}
                className="client-logo shrink-0 flex items-center justify-center w-[100px] h-[32px] md:w-[130px] md:h-[40px]"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`/logos/${logo.file}`}
                  alt={logo.company}
                  title={logo.company}
                  loading="lazy"
                  className="max-w-full max-h-full object-contain
                             [filter:brightness(0)_invert(1)]
                             opacity-60 hover:opacity-100
                             transition-opacity duration-300"
                />
              </div>
            ))}
          </div>
          <div aria-hidden="true" className="flex animate-marquee min-w-max shrink-0 items-center gap-10 md:gap-16 pr-10 md:pr-16 group-hover:[animation-play-state:paused]">
            {heroStripLogos.map((logo, index) => (
              <div
                key={`${logo.file}-dup-${index}`}
                className="client-logo shrink-0 flex items-center justify-center w-[100px] h-[32px] md:w-[130px] md:h-[40px]"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`/logos/${logo.file}`}
                  alt={logo.company}
                  title={logo.company}
                  loading="lazy"
                  className="max-w-full max-h-full object-contain
                             [filter:brightness(0)_invert(1)]
                             opacity-60 hover:opacity-100
                             transition-opacity duration-300"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
