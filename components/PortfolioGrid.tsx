"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { VideoModal } from "./VideoModal";

interface PortfolioItem {
  id: string;
  title: string;
  client: string;
  category: string;
  image: string;
  videoId: string; // YouTube ID
}

const PORTFOLIO_DATA: PortfolioItem[] = [
  {
    id: "uniprime",
    title: "Amor por Floripa",
    client: "Uniprime",
    category: "Branded Film",
    image: "/video/yt-uniprime.jpg",
    videoId: "-n63Q-kmxBs",
  },
  {
    id: "lumma",
    title: "AcquaVila Home Club",
    client: "Lumma Construtora",
    category: "Imobiliário",
    image: "/video/yt-lumma.jpg",
    videoId: "ryS_3OhqZSc",
  },
  {
    id: "floripa",
    title: "O Amanhã",
    client: "Prefeitura de Florianópolis",
    category: "Institucional",
    image: "/video/yt-floripa.jpg",
    videoId: "M25yLUIiHeU",
  },
  {
    id: "governo-sc",
    title: "SC Mais Asfalto",
    client: "Governo de Santa Catarina",
    category: "Institucional",
    image: "/video/yt-governo-sc.jpg",
    videoId: "KR3wO61rN3A",
  },
  {
    id: "abapa",
    title: "Proteína Animal",
    client: "ABAPA",
    category: "Agronegócio",
    image: "/video/yt-abapa.jpg",
    videoId: "qyJXLcD8Lgc",
  },
  {
    id: "nova-fase",
    title: "Nova Fase",
    client: "Instalações Elétricas",
    category: "Institucional",
    image: "/video/yt-nova-fase.jpg",
    videoId: "24hfPm1ElWw",
  },
];

export function PortfolioGrid() {
  const isReduced = useReducedMotion();
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);

  return (
    <section
      id="portfolio"
      className="relative w-full py-24 md:py-36 bg-ink-base border-t border-ink-raise/30"
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="mb-20 text-center md:text-left">
          <span className="font-display font-medium text-base tracking-[0.25em] text-accent-bright uppercase block mb-3">
            Nossos Trabalhos
          </span>
          <h2 className="font-display text-4xl md:text-6xl tracking-wide text-text-hi uppercase leading-none">
            Portfólio
          </h2>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {PORTFOLIO_DATA.map((item) => (
            <div
              key={item.id}
              role="button"
              tabIndex={0}
              aria-label={`Assistir ${item.title}, ${item.client}`}
              onClick={() => setActiveVideoId(item.videoId)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setActiveVideoId(item.videoId);
                }
              }}
              className="group relative overflow-hidden aspect-[16/10] rounded border border-ink-raise/45 bg-ink-abyss cursor-pointer transition-all duration-500 hover:border-accent/40 hover:shadow-[0_0_25px_rgba(176,36,47,0.1)] focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-ink-base"
            >
              {/* Dark Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-ink-abyss via-ink-abyss/40 to-transparent z-10" />

              {/* Case Image */}
              <Image
                src={item.image}
                alt={`${item.title} case thumbnail`}
                fill
                className={`object-cover opacity-70 group-hover:opacity-90 ${
                  isReduced
                    ? "transition-opacity duration-300"
                    : "transition-all duration-700 ease-out transform group-hover:scale-103"
                }`}
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />

              {/* Central Play Icon — always visible on mobile, hover-only on desktop */}
              <div
                className={`absolute inset-0 z-20 flex items-center justify-center opacity-100 md:opacity-0 group-hover:opacity-100 transition-all duration-300 ${
                  isReduced ? "" : "scale-100 md:scale-90 group-hover:scale-100 transform"
                }`}
              >
                <div className="w-14 h-14 rounded-full bg-accent/90 border border-accent flex items-center justify-center shadow-[0_0_15px_rgba(176,36,47,0.4)]">
                  {/* Triângulo de play do logo */}
                  <svg
                    width="18"
                    height="20"
                    viewBox="0 0 18 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="ml-1"
                  >
                    <path
                      d="M2 2L15 10L2 18V2Z"
                      fill="var(--text-hi)"
                      stroke="var(--text-hi)"
                      strokeWidth="2"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>

              {/* Metadata (Client/Category & Title) */}
              <div className="absolute bottom-6 left-6 right-6 z-20 flex flex-col space-y-1">
                <div className="flex items-center space-x-2 text-[10px] md:text-xs font-light text-text-mut tracking-widest uppercase">
                  <span>{item.client}</span>
                  <span>•</span>
                  <span>{item.category}</span>
                </div>
                <h3
                  className={`font-display text-2xl md:text-3xl tracking-widest text-text-hi uppercase leading-none ${
                    isReduced
                      ? "transition-all duration-300"
                      : "transition-transform duration-500 ease-out transform group-hover:translate-x-1"
                  }`}
                >
                  {item.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>

      <VideoModal
        isOpen={activeVideoId !== null}
        onClose={() => setActiveVideoId(null)}
        videoUrl={activeVideoId ? `https://www.youtube.com/watch?v=${activeVideoId}` : ""}
      />
    </section>
  );
}
