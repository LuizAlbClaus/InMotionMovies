"use client";

import React, { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useReducedMotion } from "@/lib/useReducedMotion";

export function About() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const p1Ref = useRef<HTMLParagraphElement>(null);
  const p2Ref = useRef<HTMLParagraphElement>(null);
  const p3Ref = useRef<HTMLParagraphElement>(null);
  const p4Ref = useRef<HTMLParagraphElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);
  const isReduced = useReducedMotion();
  const [years, setYears] = useState(0);

  // Staggered word-by-word scroll-based fade reveal
  useEffect(() => {
    if (isReduced || typeof window === "undefined") return;

    const paragraphs = [p1Ref.current, p2Ref.current, p3Ref.current, p4Ref.current];

    paragraphs.forEach((p) => {
      if (!p) return;

      const words = p.innerText.split(" ");
      p.innerHTML = words
        .map((word) => `<span class="opacity-20 transition-colors duration-150">${word}</span>`)
        .join(" ");

      const spanElements = p.querySelectorAll("span");

      gsap.to(spanElements, {
        opacity: 1,
        stagger: 0.1,
        scrollTrigger: {
          trigger: p,
          start: "top 85%",
          end: "bottom 55%",
          scrub: 1,
        },
      });
    });

    // Count-up animation for "20 anos"
    if (countRef.current) {
      gsap.to(
        { val: 0 },
        {
          val: 20,
          duration: 2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: countRef.current,
            start: "top 90%",
            toggleActions: "play none none none",
          },
          onUpdate: function () {
            setYears(Math.floor(this.targets()[0].val));
          },
        }
      );
    }

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.vars.trigger === p1Ref.current || trigger.vars.trigger === countRef.current) {
          trigger.kill();
        }
      });
    };
  }, [isReduced]);

  // Fallback count for reduced motion
  useEffect(() => {
    if (isReduced) {
      setYears(20);
    }
  }, [isReduced]);

  return (
    <section
      id="sobre"
      ref={sectionRef}
      className="relative w-full py-24 md:py-36 bg-ink-base flex flex-col justify-center"
    >
      <div className="max-w-5xl mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-12">
        {/* Left Side: Editorial Label & Count-up */}
        <div className="md:col-span-4 flex flex-col justify-between space-y-8 md:space-y-0">
          <div>
            <span className="font-display text-base tracking-[0.25em] text-accent uppercase block mb-3">
              Conheça a InMotion
            </span>
            <h2 className="font-display text-4xl md:text-5xl tracking-wide text-text-hi uppercase leading-none">
              Construindo
              <br />
              Percepção
            </h2>
          </div>

          <div className="border-l-2 border-accent/40 pl-6 py-2">
            <div className="font-display text-6xl md:text-8xl tracking-tight text-text-hi leading-none">
              <span ref={countRef}>{years}</span>+
            </div>
            <p className="font-display text-sm tracking-widest text-text-mut uppercase mt-2">
              Anos criando narrativas
            </p>
          </div>
        </div>

        {/* Right Side: Editorial Narrative */}
        <div className="md:col-span-8 space-y-8 text-lg md:text-2xl font-light text-text-body leading-relaxed max-w-3xl">
          <p ref={p1Ref} className={isReduced ? "opacity-100" : ""}>
            A InMotion Movies nasceu da mistura entre linguagem cinematográfica, publicidade e estratégia de marca. Ao
            longo de 20 anos, produzimos filmes, campanhas e conteúdos para empresas que entenderam uma verdade simples:
            quem domina atenção, domina o mercado.
          </p>

          <p ref={p2Ref} className={isReduced ? "opacity-100" : ""}>
            Em um mundo saturado de conteúdo, poucas marcas conseguem ser lembradas. Nós acreditamos em filmes que criam
            presença, imagens que fazem empresas parecerem maiores do que são. Histórias que transformam atenção em
            valor.
          </p>

          <p ref={p3Ref} className={isReduced ? "opacity-100" : ""}>
            Existe uma enorme diferença entre produzir conteúdo e construir percepção. Conteúdo comum passa. Marcas
            fortes permanecem.
          </p>

          <p ref={p4Ref} className={isReduced ? "opacity-100" : ""}>
            Nosso foco nunca foi apenas filmar. Nosso foco é construir valor visual. Cada projeto é pensado para
            transmitir autoridade, sofisticação, emoção, identidade, posicionamento. Estética importa, narrativa
            importa, direção importa. Porque empresas que parecem maiores normalmente são percebidas como mais valiosas.
          </p>
        </div>
      </div>
    </section>
  );
}
