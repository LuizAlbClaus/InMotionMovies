// Cases (estudos de caso) da InMotion — template multi-page /cases/{slug}.
//
// ⚠️ CONTEÚDO ABAIXO É PLACEHOLDER (estrutura pronta, texto/imagens de exemplo).
//    Substituir por: vídeo real (videoId YouTube), fotos de BASTIDORES reais (bts[]),
//    desafio/conceito/execução reais e a citação real do diretor.
//    Imagens usam os placeholders de /public/video/ por enquanto.

export type CaseStudy = {
  slug: string;
  client: string;
  title: string;
  sector: string;
  type: string;
  year: string;
  videoId: string; // YouTube ID do vídeo principal (placeholder = showreel)
  poster: string; // imagem de capa
  summary: string;
  challenge: string;
  concept: string;
  execution: string;
  scope: { label: string; value: string }[];
  bts: string[]; // bastidores
  directorQuote: string;
  directorName: string;
  deliverables: string[];
};

const SHOWREEL_ID = "88R8UwRvBPE"; // placeholder — trocar pelo vídeo de cada case

export const cases: Record<string, CaseStudy> = {
  "costao-do-santinho": {
    slug: "costao-do-santinho",
    client: "Costão do Santinho",
    title: "A experiência que não cabe em uma foto",
    sector: "Hospitalidade",
    type: "Filme institucional",
    year: "2023",
    videoId: SHOWREEL_ID,
    poster: "/video/portfolio-1.png",
    summary:
      "Um filme que traduz a sensação de estar no resort — não o que ele tem, mas o que ele faz você sentir.",
    challenge:
      "Resorts costumam se vender por listas: piscinas, quartos, estrutura. O desafio era o oposto — capturar a emoção de uma estadia e transformar o Costão em um destino desejado, não em um folheto de comodidades.",
    concept:
      "Construímos uma narrativa sensorial: luz natural, mar, silêncio e gente real vivendo o lugar. Direção de fotografia cinematográfica, ritmo contemplativo e trilha original para criar presença, não propaganda.",
    execution:
      "Três diárias de captação entre a orla, as áreas comuns e os bastidores da operação. Equipe enxuta e ágil para não interferir na rotina dos hóspedes, com drone para os planos de abertura e captação de áudio ambiente real.",
    scope: [
      { label: "Diárias de filmagem", value: "3 diárias" },
      { label: "Equipe", value: "Direção, DOP, drone, produção" },
      { label: "Locação", value: "Costão do Santinho Resort, Florianópolis" },
      { label: "Captação", value: "4K · áudio direto · aéreo" },
    ],
    bts: ["/video/service-1.png", "/video/service-2.png", "/video/portfolio-2.png", "/video/portfolio-3.png"],
    directorQuote:
      "Não filmamos um hotel. Filmamos a memória que o hóspede leva embora — e é isso que faz a marca parecer maior.",
    directorName: "Direção · InMotion Movies",
    deliverables: [
      "Filme principal (90s)",
      "Cortes para redes (15s · 30s)",
      "Versão internacional legendada",
      "Banco de imagens e stills",
    ],
  },
  colcci: {
    slug: "colcci",
    client: "Colcci",
    title: "Moda em movimento",
    sector: "Moda & Lifestyle",
    type: "Fashion film",
    year: "2022",
    videoId: SHOWREEL_ID,
    poster: "/video/portfolio-4.png",
    summary: "Um fashion film com direção estética forte para uma marca que já é referência nacional.",
    challenge:
      "Para uma marca de moda consolidada, o vídeo não pode apenas mostrar a coleção — precisa elevar a percepção e reafirmar liderança a cada temporada.",
    concept:
      "Linguagem contemporânea, color grading autoral e edição no ritmo da música. O produto aparece, mas o protagonismo é da atitude da marca.",
    execution:
      "Captação em estúdio e locação urbana, com casting alinhado à identidade da marca e direção de movimento para cada look.",
    scope: [
      { label: "Diárias de filmagem", value: "2 diárias" },
      { label: "Equipe", value: "Direção, DOP, styling, casting" },
      { label: "Locação", value: "Estúdio + externa urbana" },
      { label: "Captação", value: "4K · slow motion · color autoral" },
    ],
    bts: ["/video/service-4.png", "/video/portfolio-5.png", "/video/portfolio-6.png", "/video/service-3.png"],
    directorQuote:
      "Moda é ritmo. O corte certo no tempo certo é o que separa um vídeo de produto de um filme de marca.",
    directorName: "Direção · InMotion Movies",
    deliverables: ["Fashion film (60s)", "Teasers para redes", "Stills de campanha"],
  },
  "governo-sc": {
    slug: "governo-sc",
    client: "Governo do Estado de SC",
    title: "Comunicação pública com linguagem de cinema",
    sector: "Governo & Institucional",
    type: "Institucional",
    year: "2023",
    videoId: SHOWREEL_ID,
    poster: "/video/portfolio-2.png",
    summary: "Tirar o institucional público do lugar-comum, sem perder seriedade e alcance.",
    challenge:
      "Comunicação de governo costuma ser fria e engessada. O desafio era informar com clareza e, ao mesmo tempo, emocionar e aproximar o cidadão.",
    concept:
      "Histórias reais como fio condutor, fotografia cuidadosa e narração sóbria. Autoridade sem distância.",
    execution:
      "Captação em múltiplas cidades, com logística para integrar agendas públicas e equipes locais dentro do cronograma.",
    scope: [
      { label: "Diárias de filmagem", value: "Multi-locação" },
      { label: "Equipe", value: "Direção, DOP, produção executiva" },
      { label: "Locação", value: "Diversas cidades de SC" },
      { label: "Captação", value: "4K · entrevistas · aéreo" },
    ],
    bts: ["/video/service-5.png", "/video/portfolio-3.png", "/video/portfolio-1.png", "/video/service-1.png"],
    directorQuote:
      "Comunicação pública não precisa ser fria. Direção é o que transforma informação em conexão.",
    directorName: "Direção · InMotion Movies",
    deliverables: ["Filme institucional", "Cortes temáticos", "Versões para TV e redes"],
  },
};

export function getCase(slug: string): CaseStudy | undefined {
  return cases[slug];
}

export function getRelatedCases(slug: string, limit = 2): CaseStudy[] {
  return Object.values(cases)
    .filter((c) => c.slug !== slug)
    .slice(0, limit);
}
