"use client";

import React, { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useReducedMotion } from "@/lib/useReducedMotion";

export function ContactCTA() {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);
  const isReduced = useReducedMotion();

  // Scroll reveal animation for the contact section
  useEffect(() => {
    if (isReduced || typeof window === "undefined") return;

    const el = containerRef.current;
    if (!el) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: el,
        start: "top 80%",
        toggleActions: "play none none none",
      },
    });

    tl.fromTo(
      textRef.current?.querySelectorAll("p, h3") || [],
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1.0, stagger: 0.15, ease: "power3.out" }
    );

    tl.fromTo(
      infoRef.current?.querySelectorAll(".info-item, .cta-button") || [],
      { opacity: 0, x: 20 },
      { opacity: 1, x: 0, duration: 0.8, stagger: 0.1, ease: "power3.out" },
      "-=0.6"
    );

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.vars.trigger === el) {
          trigger.kill();
        }
      });
    };
  }, [isReduced]);

  const rawPhone = "5548992199990"; // WhatsApp raw format (Brazilian country code 55 + area 48 + number)
  const formattedPhone = "(48) 99219-9990";
  const whatsappUrl = `https://wa.me/${rawPhone}?text=Olá%20InMotion,%20gostaria%20de%20solicitar%20um%20orçamento%20para%20minha%20marca.`;

  return (
    <section
      id="contato"
      ref={containerRef}
      className="relative w-full py-24 md:py-36 bg-ink-base border-t border-ink-raise/30 flex items-center"
    >
      {/* Background desaturated spotlight shadow */}
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[150px] pointer-events-none z-0" />

      <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          
          {/* Left / Top Side: Final Narrative & Keyline */}
          <div ref={textRef} className="lg:col-span-7 space-y-8 max-w-2xl">
            <span className="font-display text-base tracking-[0.25em] text-accent uppercase block">
              Vamos Criar Algo Grande
            </span>

            <h3 className="font-display text-4xl md:text-5xl lg:text-6xl tracking-wide text-text-hi uppercase leading-none">
              Marcas Fortes
              <br />
              <span className="text-accent">Constroem Presença.</span>
            </h3>

            <div className="h-[2px] w-20 bg-accent my-6" />

            <div className="space-y-6 text-base md:text-xl font-light text-text-body leading-relaxed">
              <p>
                Vivemos em uma era onde todo mundo publica. Mas poucas marcas conseguem permanecer. A maioria disputa
                atenção. As grandes marcas constroem presença.
              </p>
              <p>
                Nós acreditamos em filmes que carregam identidade. Narrativas que fazem empresas parecerem maiores.
                Imagens que transformam percepção.
              </p>
              <p>
                Conteúdo pode gerar visualização. Mas direção gera valor — e valor percebido muda tudo. A forma como sua
                marca é vista influencia diretamente como ela é percebida. Se a imagem da sua empresa ainda não transmite
                o nível que ela realmente possui, talvez esteja na hora de mudar isso.
              </p>
            </div>
          </div>

          {/* Right / Bottom Side: Direct Contact Details & WhatsApp Button */}
          <div
            ref={infoRef}
            className="lg:col-span-5 bg-ink-raise/40 border border-ink-raise/70 rounded p-8 md:p-10 space-y-8 flex flex-col justify-between"
          >
            <div>
              <h4 className="font-display text-lg tracking-widest text-text-hi uppercase mb-6">
                Fale Conosco
              </h4>
              
              <div className="space-y-6">
                <div className="info-item flex flex-col space-y-1">
                  <span className="text-xs text-text-mut uppercase tracking-wider font-light">
                    WhatsApp / Telefone
                  </span>
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-lg md:text-xl text-text-body hover:text-accent transition-colors font-medium"
                  >
                    {formattedPhone}
                  </a>
                </div>

                <div className="info-item flex flex-col space-y-1">
                  <span className="text-xs text-text-mut uppercase tracking-wider font-light">
                    E-mail
                  </span>
                  <a
                    href="mailto:contato@inmotionmovies.com.br"
                    className="text-lg md:text-xl text-text-body hover:text-accent transition-colors font-medium"
                  >
                    contato@inmotionmovies.com.br
                  </a>
                </div>

                <div className="info-item flex flex-col space-y-1">
                  <span className="text-xs text-text-mut uppercase tracking-wider font-light">
                    Localização
                  </span>
                  <p className="text-lg md:text-xl text-text-body font-medium">
                    Florianópolis, Santa Catarina (SC)
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="cta-button w-full block text-center font-display text-lg tracking-widest bg-accent hover:bg-accent-deep text-text-hi py-4 rounded border border-accent/20 transition-all duration-300 uppercase shadow-[0_0_20px_rgba(176,36,47,0.15)] hover:shadow-[0_0_30px_rgba(176,36,47,0.35)]"
              >
                Agendar Reunião
              </a>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
