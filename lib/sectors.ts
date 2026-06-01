// Segmentos atendidos pela InMotion — agrupados a partir do roster real de clientes.
// Usados na seção "Clientes / Marcas de todos os segmentos" da home (prova de ALCANCE/versatilidade).
// Ordem = por prestígio/reconhecimento de marca primeiro (de-niche: não abrir com a parede de colégios).
// `tagline` mantida só para as futuras páginas /verticais/{slug} (não é renderizada na home).
// `num` é legado (não renderizado).

export type Sector = {
  slug: string;
  num: string;
  name: string;
  tagline: string;
  clients: string[];
};

export const sectors: Sector[] = [
  {
    slug: "moda-lifestyle",
    num: "01",
    name: "Moda & Lifestyle",
    tagline: "Fashion films e campanhas com direção estética forte.",
    clients: ["Colcci", "Forum"],
  },
  {
    slug: "governo-institucional",
    num: "02",
    name: "Governo & Institucional",
    tagline: "Campanhas, eventos e comunicação para o setor público e associações.",
    clients: [
      "Governo do Estado de SC",
      "Prefeitura de Florianópolis",
      "FACISC",
      "CAASC",
    ],
  },
  {
    slug: "hospitalidade-varejo-industria",
    num: "03",
    name: "Hospitalidade, Varejo & Indústria",
    tagline: "Branding de experiência, produto e narrativa para marcas diversas.",
    clients: [
      "Costão do Santinho",
      "Brasil Atacadista",
      "Teltec Solutions",
      "Microlight World",
      "Fairyland",
    ],
  },
  {
    slug: "construcao-engenharia",
    num: "04",
    name: "Construção & Engenharia",
    tagline: "Lançamentos de empreendimentos, obras e filmes institucionais.",
    clients: [
      "Lumma Construtora",
      "Norte Construções",
      "MPB Engenharia",
      "Nova Fase Instalações Elétricas",
      "Comando Painéis Elétricos",
    ],
  },
  {
    slug: "cooperativas-financas",
    num: "05",
    name: "Cooperativas & Finanças",
    tagline: "Conteúdo institucional e de relacionamento para cooperativas.",
    clients: ["Uniprime", "Unicred"],
  },
  {
    slug: "educacao",
    num: "06",
    name: "Educação",
    tagline: "Captação de matrículas, identidade e eventos para instituições de ensino.",
    clients: [
      "Colégio Elisa Andreoli",
      "Colégio Criativo",
      "Colégio Tendência",
      "Colégio N. Sra. de Fátima",
      "Colégio Conhecimento",
      "Colégio Incentivo",
      "COC Floripa",
      "Criarte",
    ],
  },
];
