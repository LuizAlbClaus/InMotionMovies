"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useReducedMotion } from "@/lib/useReducedMotion";

const STEPS = [
  {
    num: "01",
    title: "Conceito & Estratégia",
    body: "Antes de qualquer orçamento, entendemos seu negócio, seu público e o que o vídeo precisa provocar. Definimos o conceito, a abordagem e a linguagem.",
    you: "Briefing inicial e alinhamento de objetivo.",
    time: "3 a 5 dias",
  },
  {
    num: "02",
    title: "Pré-produção",
    body: "Roteiro, storyboard, casting, locação, cronograma e logística. Tudo planejado no papel para que no set não exista surpresa.",
    you: "Aprovação de roteiro e referências.",
    time: "1 a 2 semanas",
  },
  {
    num: "03",
    title: "Produção",
    body: "Captação com equipe e equipamento profissional — 4K, áudio direto, iluminação e drone quando o projeto pede. Direção no set do início ao fim.",
    you: "Acompanhamento opcional na filmagem.",
    time: "1 a 3 diárias",
  },
  {
    num: "04",
    title: "Pós-produção & Entrega",
    body: "Montagem, color grading, trilha, motion e finalização. Entregamos nos formatos certos para cada canal — do filme principal aos cortes para redes.",
    you: "Rodadas de revisão combinadas.",
    time: "1 a 3 semanas",
  },
];

const FAQ = [
  {
    q: "Vocês cuidam da ideia e do roteiro?",
    a: "Sim. Conduzimos do conceito à entrega. Você não precisa chegar com tudo pronto — a estratégia e a direção fazem parte do nosso trabalho.",
  },
  {
    q: "Atendem fora de Florianópolis?",
    a: "Sim. Somos baseados em Florianópolis e produzimos em todo o Brasil.",
  },
  {
    q: "Quantas rodadas de revisão estão incluídas?",
    a: "As rodadas são combinadas no início do projeto e ficam claras no orçamento. Sem revisão infinita, sem escopo mutante.",
  },
  {
    q: "De quem são os direitos do vídeo?",
    a: "Seus, conforme acordado em contrato. Você recebe os arquivos finais e os direitos de uso, sem licença que expira e sem cobrança escondida por uso.",
  },
  {
    q: "Que equipamento vocês usam?",
    a: "Captação em 4K, áudio direto, iluminação profissional e drone quando necessário. A estrutura se adapta à ambição de cada projeto.",
  },
  {
    q: "Como funciona o orçamento?",
    a: "Sob medida por projeto — o valor reflete escopo, ambição e entregáveis. Conte o que você precisa e montamos uma proposta itemizada.",
  },
];

const WHATSAPP_URL =
  "https://wa.me/5548992199990?text=Ol%C3%A1%20InMotion,%20gostaria%20de%20solicitar%20um%20or%C3%A7amento%20para%20minha%20marca.";

export function ProcessContent() {
  const rootRef = useRef<HTMLDivElement>(null);
  const isReduced = useReducedMotion();

  useEffect(() => {
    if (isReduced || typeof window === "undefined") return;

    const ctx = gsap.context(() => {
      const els = gsap.utils.toArray<HTMLElement>(".reveal-up");
      els.forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 26 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 85%", toggleActions: "play none none none" },
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
      {/* HERO / TESE */}
      <section className="relative w-full pt-36 md:pt-48 pb-20 md:pb-28 bg-ink-abyss border-b border-ink-raise/30">
        <div className="max-w-5xl mx-auto px-6">
          <span className="font-display text-sm md:text-base tracking-[0.3em] text-accent uppercase block mb-5">
            Como trabalhamos
          </span>
          <h1 className="font-display text-4xl md:text-6xl lg:text-7xl tracking-wide text-text-hi uppercase leading-[1.05] mb-8 max-w-4xl">
            Conduzimos do conceito à entrega.
          </h1>
          <p className="text-lg md:text-2xl font-light text-text-body leading-relaxed max-w-2xl">
            Você foca no seu negócio. A InMotion conduz a produção de ponta a ponta —
            com método, prazo definido e zero caos.
          </p>
        </div>
      </section>

      {/* 4 ETAPAS */}
      <section className="relative w-full py-24 md:py-36 bg-ink-base">
        <div className="max-w-5xl mx-auto px-6">
          <div className="space-y-px">
            {STEPS.map((step) => (
              <div
                key={step.num}
                className="reveal-up group grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 items-start border-t border-ink-raise/40 py-10 md:py-14 hover:border-accent/40 transition-colors duration-500"
              >
                <div className="md:col-span-2 font-display text-5xl md:text-6xl text-accent/60 leading-none">
                  {step.num}
                </div>
                <div className="md:col-span-6">
                  <h2 className="font-display text-2xl md:text-3xl tracking-wide text-text-hi uppercase leading-tight mb-3">
                    {step.title}
                  </h2>
                  <p className="text-base md:text-lg font-light text-text-mut leading-relaxed">
                    {step.body}
                  </p>
                </div>
                <div className="md:col-span-4 flex flex-col gap-4 md:pl-6 md:border-l border-ink-raise/40">
                  <div>
                    <span className="font-display text-xs tracking-widest text-accent/70 uppercase block mb-1">
                      Você participa
                    </span>
                    <span className="text-sm text-text-body/80 font-light">{step.you}</span>
                  </div>
                  <div>
                    <span className="font-display text-xs tracking-widest text-accent/70 uppercase block mb-1">
                      Prazo típico
                    </span>
                    <span className="text-sm text-text-body/80 font-light">{step.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* REVISÕES + DIREITOS */}
      <section className="relative w-full py-20 md:py-28 bg-ink-base border-t border-ink-raise/30">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          <div className="reveal-up rounded-lg border border-ink-raise/50 bg-ink-raise/15 p-8 md:p-10">
            <h3 className="font-display text-xl md:text-2xl tracking-wide text-text-hi uppercase mb-4">
              Prazos & revisões
            </h3>
            <p className="text-base font-light text-text-mut leading-relaxed">
              Cronograma e rodadas de revisão são definidos no início e cumpridos. Decisões
              importantes não ficam para a última hora — nada de escopo mutante e atraso.
            </p>
          </div>
          <div className="reveal-up rounded-lg border border-ink-raise/50 bg-ink-raise/15 p-8 md:p-10">
            <h3 className="font-display text-xl md:text-2xl tracking-wide text-text-hi uppercase mb-4">
              Direitos & entrega
            </h3>
            <p className="text-base font-light text-text-mut leading-relaxed">
              Você recebe os arquivos finais e os direitos de uso acordados, nos formatos
              certos para cada plataforma. Sem licença que expira, sem cobrança escondida por uso.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="relative w-full py-24 md:py-36 bg-ink-base border-t border-ink-raise/30">
        <div className="max-w-5xl mx-auto px-6">
          <div className="reveal-up mb-14 md:mb-20">
            <span className="font-display text-base tracking-[0.25em] text-accent uppercase block mb-3">
              Dúvidas frequentes
            </span>
            <h2 className="font-display text-3xl md:text-5xl tracking-wide text-text-hi uppercase leading-none">
              Antes de começar
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
            {FAQ.map((item) => (
              <div key={item.q} className="reveal-up">
                <h3 className="font-display text-lg md:text-xl text-text-hi mb-2 leading-snug">
                  {item.q}
                </h3>
                <p className="text-base font-light text-text-mut leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative w-full py-24 md:py-36 bg-ink-abyss border-t border-ink-raise/30">
        <div className="max-w-3xl mx-auto px-6 text-center reveal-up">
          <h2 className="font-display text-3xl md:text-5xl tracking-wide text-text-hi uppercase leading-tight mb-6">
            Pronto para criar algo grande?
          </h2>
          <p className="text-base md:text-lg font-light text-text-mut leading-relaxed mb-10 max-w-xl mx-auto">
            Conte o que sua marca precisa. Montamos a proposta e conduzimos o resto.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/#contato"
              className="font-display text-base md:text-lg tracking-widest bg-accent hover:bg-accent-deep text-text-hi px-8 py-3.5 rounded border border-accent/25 transition-all duration-300 uppercase"
            >
              Solicitar orçamento
            </Link>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="font-display text-base md:text-lg tracking-widest border border-text-mut/30 hover:border-text-hi text-text-hi px-8 py-3.5 rounded transition-all duration-300 uppercase"
            >
              WhatsApp
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
