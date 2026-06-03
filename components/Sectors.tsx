"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { sectors } from "@/lib/sectors";

export function Sectors() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isReduced = useReducedMotion();

  useEffect(() => {
    if (isReduced || typeof window === "undefined") return;

    const cards = containerRef.current?.querySelectorAll(".sector-card");
    if (!cards || !containerRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        cards,
        { opacity: 0, y: 28 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: "power3.out",
          stagger: 0.08,
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 75%",
            toggleActions: "play none none none",
          },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, [isReduced]);

  // Por enquanto leva ao portfólio; trocar por /verticais/{slug} quando as páginas existirem.
  const goToPortfolio = () => {
    document.getElementById("portfolio")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="setores"
      ref={containerRef}
      className="relative w-full py-24 md:py-36 bg-ink-base border-t border-ink-raise/30"
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Header — manifesto editorial */}
        <div className="mb-16 md:mb-24 max-w-6xl">
          <span className="font-display font-medium text-base tracking-[0.25em] text-accent-bright uppercase block mb-4">
            Quem confia na InMotion
          </span>
          <h2 className="font-display text-3xl md:text-5xl lg:text-6xl tracking-wide text-text-hi uppercase leading-[1.1] mb-10 md:mb-14 max-w-5xl">
            Mais de 20 anos transformando marcas em histórias que geram resultado.
          </h2>

          {/* Corpo — duas colunas equilibradas (2 parágrafos cada), leitura uniforme */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 lg:gap-x-16 gap-y-6 text-base md:text-lg font-light leading-relaxed text-text-mut">
            <div className="space-y-6">
              <p>
                Há mais de duas décadas, a InMotion Movies atua no mercado audiovisual desenvolvendo produções para empresas, instituições e organizações dos mais diversos segmentos. Ao longo dessa trajetória, construímos experiências em projetos para marcas de moda e varejo, construção civil, indústria, educação, hotelaria, turismo, tecnologia, saúde, agronegócio, órgãos públicos e grandes instituições.
              </p>
              <p>
                Nossa atuação ultrapassa fronteiras. Já realizamos produções em diferentes regiões do Brasil, do norte ao sul do país, além de projetos internacionais na Argentina, Uruguai e Europa, sempre adaptando a linguagem, a narrativa e a estratégia de comunicação à realidade e aos objetivos de cada cliente.
              </p>
            </div>
            <div className="space-y-6">
              <p>
                Não acreditamos em fórmulas prontas. Cada marca possui sua própria identidade, seu público e seus desafios. Por isso, desenvolvemos produções sob medida, capazes de comunicar valor, fortalecer posicionamento e elevar a percepção da marca perante o mercado.
              </p>
              <p>
                Aliamos experiência, direção criativa e tecnologia de ponta para entregar produções com padrão cinematográfico. Trabalhamos com equipamentos próprios, constantemente atualizados, utilizando câmeras de última geração, drones profissionais, sistemas avançados de estabilização, iluminação cinematográfica e fluxos de pós-produção modernos, garantindo máxima qualidade técnica em todas as etapas do projeto.
              </p>
            </div>
          </div>

          {/* Pull-quote — destaque intencional */}
          <blockquote className="mt-12 md:mt-16 border-l-2 border-accent pl-6 md:pl-8 max-w-3xl text-xl md:text-2xl font-light italic text-text-body leading-snug">
            Mais do que produzir vídeos, criamos narrativas visuais que conectam pessoas, fortalecem marcas e transformam percepção em valor.
          </blockquote>

          {/* Assinatura de fecho */}
          <p className="mt-10 md:mt-12 max-w-4xl font-display text-base md:text-lg tracking-wide text-accent-bright leading-relaxed">
            InMotion Movies. Há mais de 20 anos produzindo imagens que ajudam empresas a serem vistas da forma que merecem ser lembradas.
          </p>
        </div>

        {/* Transition Header to the Sectors Grid */}
        <div className="mb-8 md:mb-12 border-t border-ink-raise/30 pt-16">
          <span className="font-display font-medium text-xs tracking-[0.2em] text-accent-bright/80 uppercase block mb-2">
            Nossa atuação por setor
          </span>
          <h3 className="font-display text-2xl md:text-3xl tracking-wide text-text-hi uppercase">
            Segmentos & Marcas atendidas
          </h3>
        </div>

        {/* Grid de segmentos — prova de ALCANCE (cada card = um segmento já atendido) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {sectors.map((sector) => (
            <button
              key={sector.slug}
              onClick={goToPortfolio}
              data-vertical={sector.slug}
              className="sector-card group text-left flex flex-col h-full rounded-lg border border-ink-raise/50 bg-ink-raise/15 hover:bg-ink-raise/30 hover:border-accent/40 hover:shadow-[0_0_30px_rgba(176,36,47,0.12)] transition-all duration-500 p-7 md:p-8 cursor-pointer focus:outline-none focus:border-accent/60"
            >
              {/* Top: nome do segmento + contagem */}
              <div className="flex items-start justify-between gap-4 mb-5">
                <h3 className="font-display text-2xl md:text-3xl tracking-wide text-text-hi uppercase leading-tight group-hover:text-accent transition-colors duration-300">
                  {sector.name}
                </h3>
                <span className="shrink-0 font-display text-xs tracking-widest text-text-mut uppercase border border-ink-raise/60 rounded-full px-3 py-1 mt-1">
                  {sector.clients.length}
                </span>
              </div>

              {/* Lista de clientes (prova) */}
              <ul className="mt-auto flex flex-wrap gap-x-2 gap-y-1.5">
                {sector.clients.map((client) => (
                  <li
                    key={client}
                    className="text-xs font-light text-text-body/70 after:content-['·'] after:ml-2 after:text-text-mut/40 last:after:content-['']"
                  >
                    {client}
                  </li>
                ))}
              </ul>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
