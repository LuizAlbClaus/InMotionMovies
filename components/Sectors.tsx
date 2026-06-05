"use client";

import React from "react";

export function Sectors() {
  return (
    <section
      id="setores"
      className="relative w-full py-24 md:py-36 bg-ink-base border-t border-ink-raise/30"
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Header — manifesto editorial */}
        <div className="max-w-6xl">
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
      </div>
    </section>
  );
}
