"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useReducedMotion } from "@/lib/useReducedMotion";

interface ServiceItem {
  id: string;
  num: string;
  title: string;
  desc: string;
  image: string;
}

const SERVICES_DATA: ServiceItem[] = [
  {
    id: "publicidade",
    num: "01",
    title: "Comercial e Publicidade",
    desc: "Campanhas cinematográficas para marcas que querem impacto, desejo e presença. Filmes construídos para fortalecer percepção e aumentar valor de marca.",
    image: "/video/service-1.png",
  },
  {
    id: "corporativo",
    num: "02",
    title: "Institucional e Corporativo",
    desc: "Produções empresariais modernas e sofisticadas, longe do institucional engessado. Conteúdo que transmite autoridade sem parecer frio.",
    image: "/video/service-2.png",
  },
  {
    id: "redes",
    num: "03",
    title: "Conteúdo para Redes Sociais",
    desc: "Vídeos rápidos, estratégicos, adaptados ao comportamento digital atual. Narrativa, retenção e estética trabalhando juntas.",
    image: "/video/service-3.png",
  },
  {
    id: "fashion",
    num: "04",
    title: "Fashion e Lifestyle",
    desc: "Produções com linguagem contemporânea, direção estética forte e identidade cinematográfica.",
    image: "/video/service-4.png",
  },
  {
    id: "documentario",
    num: "05",
    title: "Documentários e Storytelling",
    desc: "Histórias reais contadas com profundidade, emoção e construção narrativa.",
    image: "/video/service-5.png",
  },
];

export function Services() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isReduced = useReducedMotion();

  useEffect(() => {
    if (isReduced || typeof window === "undefined") return;

    const blocks = containerRef.current?.querySelectorAll(".service-block");
    if (!blocks) return;

    blocks.forEach((block) => {
      const img = block.querySelector(".parallax-img");
      if (!img) return;

      // Parallax scroll on image (zoom and slow slide)
      gsap.fromTo(
        img,
        { scale: 1.05, yPercent: -8 },
        {
          scale: 1.2,
          yPercent: 8,
          ease: "none",
          scrollTrigger: {
            trigger: block,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        }
      );
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => {
        // clean up our own triggers
        if (containerRef.current?.contains(trigger.vars.trigger as Node)) {
          trigger.kill();
        }
      });
    };
  }, [isReduced]);

  return (
    <section
      id="servicos"
      ref={containerRef}
      className="relative w-full py-24 md:py-36 bg-ink-base border-t border-ink-raise/30"
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="mb-20 md:mb-32 text-center md:text-left">
          <span className="font-display text-base tracking-[0.25em] text-accent uppercase block mb-3">
            O que fazemos
          </span>
          <h2 className="font-display text-4xl md:text-6xl tracking-wide text-text-hi uppercase leading-none">
            Áreas de Atuação
          </h2>
        </div>

        {/* List of Services */}
        <div className="space-y-24 md:space-y-36">
          {SERVICES_DATA.map((service, index) => {
            const isEven = index % 2 === 0;
            return (
              <div
                key={service.id}
                className="service-block grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-16 items-center"
              >
                {/* Text Content */}
                <div
                  className={`lg:col-span-5 flex flex-col justify-center space-y-4 md:space-y-6 ${
                    isEven ? "lg:order-1" : "lg:order-2"
                  }`}
                >
                  <div className="flex items-baseline space-x-4">
                    <span className="font-display text-2xl md:text-3xl text-accent/70 font-medium">
                      {service.num}
                    </span>
                    <h3 className="font-display text-3xl md:text-4xl lg:text-5xl tracking-wide text-text-hi uppercase leading-tight">
                      {service.title}
                    </h3>
                  </div>
                  <p className="text-base md:text-lg font-light text-text-mut leading-relaxed">
                    {service.desc}
                  </p>
                </div>

                {/* Media Wrapper */}
                <div
                  className={`lg:col-span-7 overflow-hidden rounded border border-ink-raise/45 bg-ink-abyss aspect-[16/10] relative group cursor-pointer transition-all duration-500 hover:border-accent/40 hover:shadow-[0_0_30px_rgba(176,36,47,0.15)] ${
                    isEven ? "lg:order-2" : "lg:order-1"
                  }`}
                >
                  {/* Subtle inner dark gradient overlay for visual containment */}
                  <div className="absolute inset-0 bg-gradient-to-t from-ink-abyss/60 via-transparent to-ink-abyss/40 z-10 pointer-events-none" />

                  {/* Image with Parallax wrapper */}
                  <div className="w-full h-full relative overflow-hidden">
                    <Image
                      src={service.image}
                      alt={service.title}
                      fill
                      className={`parallax-img object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-500 ${
                        isReduced ? "" : "transform will-change-transform"
                      }`}
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                  </div>

                  {/* Hover icon/label overlay */}
                  <div className="absolute bottom-6 right-6 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center space-x-2 bg-ink-base/80 backdrop-blur-sm border border-ink-raise/60 px-4 py-2 rounded">
                    <span className="font-display text-xs tracking-widest text-text-hi uppercase">
                      Ver Portfólio
                    </span>
                    <span className="text-accent text-sm">▶</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
