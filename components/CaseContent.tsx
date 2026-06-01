"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useReducedMotion } from "@/lib/useReducedMotion";
import type { CaseStudy } from "@/lib/cases";
import { getRelatedCases } from "@/lib/cases";
import { VideoModal } from "./VideoModal";

export function CaseContent({ caseStudy: c }: { caseStudy: CaseStudy }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const isReduced = useReducedMotion();
  const [modalOpen, setModalOpen] = useState(false);
  const related = getRelatedCases(c.slug, 2);

  useEffect(() => {
    if (isReduced || typeof window === "undefined") return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".reveal-up").forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 26 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 88%", toggleActions: "play none none none" },
          }
        );
      });
    }, rootRef);
    return () => {
      ctx.revert();
      ScrollTrigger.refresh();
    };
  }, [isReduced]);

  return (
    <div ref={rootRef} className="w-full">
      {/* ───────── HERO ───────── */}
      <section className="relative w-full h-[88vh] min-h-[560px] flex items-end overflow-hidden bg-ink-abyss">
        {/* Capa */}
        <Image src={c.poster} alt={`${c.client} — ${c.title}`} fill priority className="object-cover opacity-50" sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-base via-ink-abyss/50 to-ink-abyss/70 z-10" />

        {/* Conteúdo do hero */}
        <div className="relative z-20 w-full max-w-7xl mx-auto px-6 pb-16 md:pb-24">
          {/* Breadcrumb */}
          <div className="mb-6 flex items-center gap-3 font-display text-xs md:text-sm tracking-widest uppercase text-text-mut">
            <Link href="/#setores" className="hover:text-accent transition-colors">
              Clientes
            </Link>
            <span className="text-text-mut/40">/</span>
            <span className="text-text-body">{c.client}</span>
          </div>

          <h1 className="font-display text-4xl md:text-6xl lg:text-7xl tracking-wide text-text-hi uppercase leading-[1.04] max-w-4xl mb-6">
            {c.title}
          </h1>

          <p className="text-lg md:text-2xl font-light text-text-body leading-relaxed max-w-2xl mb-8">
            {c.summary}
          </p>

          {/* Tags + play */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setModalOpen(true)}
              className="group flex items-center gap-3 font-display text-sm md:text-base tracking-widest bg-accent hover:bg-accent-deep text-text-hi px-6 py-3 rounded uppercase transition-all duration-300 cursor-pointer"
            >
              <svg width="11" height="13" viewBox="0 0 12 14" fill="currentColor" className="transition-transform duration-300 group-hover:scale-110">
                <path d="M2 1L10 7L2 13V1Z" />
              </svg>
              Assistir
            </button>
            {[c.client, c.sector, c.type, c.year].map((tag) => (
              <span
                key={tag}
                className="font-display text-xs tracking-widest uppercase text-text-mut border border-ink-raise/60 rounded-full px-4 py-2"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── DESAFIO + CONCEITO ───────── */}
      <section className="relative w-full py-24 md:py-36 bg-ink-base">
        <div className="max-w-5xl mx-auto px-6 space-y-20 md:space-y-28">
          {[
            { label: "O Desafio", body: c.challenge },
            { label: "O Conceito", body: c.concept },
            { label: "A Execução", body: c.execution },
          ].map((block) => (
            <div key={block.label} className="reveal-up grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-10">
              <div className="md:col-span-4">
                <span className="font-display text-base tracking-[0.25em] text-accent uppercase">
                  {block.label}
                </span>
              </div>
              <p className="md:col-span-8 text-xl md:text-2xl font-light text-text-body leading-relaxed">
                {block.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ───────── ESCOPO + BASTIDORES ───────── */}
      <section className="relative w-full py-20 md:py-28 bg-ink-abyss border-t border-ink-raise/30">
        <div className="max-w-7xl mx-auto px-6">
          {/* Escopo */}
          <div className="reveal-up grid grid-cols-2 lg:grid-cols-4 gap-px mb-16 md:mb-24 border border-ink-raise/40 rounded-lg overflow-hidden">
            {c.scope.map((s) => (
              <div key={s.label} className="bg-ink-raise/20 p-6 md:p-8">
                <span className="font-display text-xs tracking-widest text-accent/70 uppercase block mb-2">
                  {s.label}
                </span>
                <span className="text-sm md:text-base text-text-body font-light">{s.value}</span>
              </div>
            ))}
          </div>

          {/* Bastidores */}
          <div className="reveal-up mb-8">
            <span className="font-display text-base tracking-[0.25em] text-accent uppercase">Bastidores</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {c.bts.map((src, i) => (
              <div
                key={src + i}
                className={`reveal-up relative overflow-hidden rounded-md border border-ink-raise/40 group ${
                  i === 0 ? "col-span-2 row-span-2 aspect-square md:aspect-auto" : "aspect-[4/3]"
                }`}
              >
                <Image
                  src={src}
                  alt={`Bastidores ${c.client} ${i + 1}`}
                  fill
                  className="object-cover opacity-70 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                  sizes="(max-width:768px) 50vw, 25vw"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── DIREÇÃO (pull-quote) ───────── */}
      <section className="relative w-full py-28 md:py-40 bg-ink-base border-t border-ink-raise/30">
        <div className="max-w-4xl mx-auto px-6 text-center reveal-up">
          <span className="font-display text-7xl md:text-8xl text-accent/30 leading-none block mb-2">&ldquo;</span>
          <blockquote className="font-display text-2xl md:text-4xl tracking-wide text-text-hi leading-snug mb-8 -mt-6">
            {c.directorQuote}
          </blockquote>
          <cite className="font-display text-sm tracking-widest text-text-mut uppercase not-italic">
            {c.directorName}
          </cite>
        </div>
      </section>

      {/* ───────── ENTREGÁVEIS ───────── */}
      <section className="relative w-full py-20 md:py-28 bg-ink-abyss border-t border-ink-raise/30">
        <div className="max-w-5xl mx-auto px-6">
          <div className="reveal-up mb-10">
            <span className="font-display text-base tracking-[0.25em] text-accent uppercase block mb-3">
              Entregáveis
            </span>
            <h2 className="font-display text-3xl md:text-4xl tracking-wide text-text-hi uppercase leading-none">
              O que a marca levou
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {c.deliverables.map((d, i) => (
              <div
                key={d}
                className="reveal-up flex items-center gap-4 border-t border-ink-raise/40 py-5"
              >
                <span className="font-display text-lg text-accent/60">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-base md:text-lg text-text-body font-light">{d}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── CASES RELACIONADOS ───────── */}
      {related.length > 0 && (
        <section className="relative w-full py-20 md:py-28 bg-ink-base border-t border-ink-raise/30">
          <div className="max-w-7xl mx-auto px-6">
            <div className="reveal-up mb-10">
              <span className="font-display text-base tracking-[0.25em] text-accent uppercase">
                Outros trabalhos
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
              {related.map((r) => (
                <Link
                  key={r.slug}
                  href={`/cases/${r.slug}`}
                  className="reveal-up group relative overflow-hidden rounded-lg border border-ink-raise/40 aspect-[16/9] block"
                >
                  <Image
                    src={r.poster}
                    alt={r.client}
                    fill
                    className="object-cover opacity-50 group-hover:opacity-70 group-hover:scale-105 transition-all duration-500"
                    sizes="(max-width:768px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink-abyss/90 to-transparent z-10" />
                  <div className="absolute bottom-0 left-0 p-6 md:p-8 z-20">
                    <span className="font-display text-xs tracking-widest text-text-mut uppercase block mb-1">
                      {r.sector}
                    </span>
                    <span className="font-display text-2xl md:text-3xl text-text-hi uppercase tracking-wide group-hover:text-accent transition-colors duration-300">
                      {r.client}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ───────── CTA ───────── */}
      <section className="relative w-full py-24 md:py-36 bg-ink-abyss border-t border-ink-raise/30">
        <div className="max-w-3xl mx-auto px-6 text-center reveal-up">
          <h2 className="font-display text-3xl md:text-5xl tracking-wide text-text-hi uppercase leading-tight mb-6">
            Quer algo nesse nível?
          </h2>
          <p className="text-base md:text-lg font-light text-text-mut leading-relaxed mb-10 max-w-xl mx-auto">
            Conte o que sua marca precisa comunicar. A InMotion conduz do conceito à entrega.
          </p>
          <Link
            href="/#contato"
            className="inline-block font-display text-base md:text-lg tracking-widest bg-accent hover:bg-accent-deep text-text-hi px-8 py-3.5 rounded border border-accent/25 transition-all duration-300 uppercase"
          >
            Solicitar orçamento
          </Link>
        </div>
      </section>

      <VideoModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        videoUrl={`https://www.youtube.com/watch?v=${c.videoId}`}
      />
    </div>
  );
}
