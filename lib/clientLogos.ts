// Lista curada de logos pra FAIXA DE CLIENTES (home).
// Fonte/metadados completos: public/logos/logos.json
//
// REGRA: a faixa renderiza os logos em BRANCO uniforme (filtro mono CSS), padrão premium.
// Isso funciona LINDO pra WORDMARKS, mas transforma EMBLEMAS/BRASÕES preenchidos em "borrão branco".
// Por isso a faixa usa só wordmarks corretos e verificados visualmente sobre o fundo escuro.

export type ClientLogo = {
  company: string;
  file: string; // dentro de /public/logos/
  scale?: number; // fator de escala visual (padrão 1.0)
};

// ✅ Verificados: corretos + renderizam limpo como branco mono sobre #111.
// Escala visual: todos os logos devem ter peso visual similar (~30–44 px de altura).
// Emblemas/brasões (Governo SC, Prefeitura) têm scale ligeiramente acima de 1 para
// compensar a proporção mais compacta — mas nunca acima de 1.2.
export const heroStripLogos: ClientLogo[] = [
  { company: "Colcci", file: "logo-colcci.png", scale: 0.9 },
  { company: "Governo do Estado de SC", file: "logo-governo-sc-white.png", scale: 1.1 },
  { company: "Prefeitura de Florianópolis", file: "logo-prefeitura-florianopolis-white.png", scale: 1.0 },
  { company: "FACISC", file: "logo-facisc.png", scale: 0.9 },
  { company: "CAASC", file: "logo-caasc-white.png", scale: 0.85 },
  { company: "Unicred", file: "logo-unicred.png", scale: 0.85 },
  { company: "COC Floripa", file: "logo-coc-floripa-white.png", scale: 0.84 },
  { company: "Brasil Atacadista", file: "logo-brasil-atacadista.webp", scale: 1.0 },
  { company: "Costão do Santinho", file: "logo-costao-santinho-white.png", scale: 0.95 },
  { company: "Norte Arquitetura e Construção", file: "logo-norte-construcoes.png", scale: 0.85 },
  { company: "Uniprime", file: "logo-uniprime.png", scale: 0.85 },
];

// Selos-peso para o ANEL do hero (LensSealRing): poucas marcas de maior autoridade,
// arranjadas em círculo ao redor da marca InMotion. Curado p/ IMPACTO, não volume.
// A ordem define a posição no anel (sentido horário a partir do topo) — alternar
// largas/estreitas dá equilíbrio visual.
export const sealLogos: ClientLogo[] = [
  { company: "Governo do Estado de SC", file: "logo-governo-sc-white.png", scale: 1.1 },
  { company: "Unicred", file: "logo-unicred.png", scale: 0.85 },
  { company: "Costão do Santinho", file: "logo-costao-santinho-white.png", scale: 0.95 },
  { company: "Prefeitura de Florianópolis", file: "logo-prefeitura-florianopolis-white.png", scale: 1.0 },
  { company: "Colcci", file: "logo-colcci.png", scale: 0.9 },
  { company: "FACISC", file: "logo-facisc.png", scale: 0.9 },
];

// ⏳ PENDENTES de versão BRANCA/MONO (são brasões/bandeiras → borram no filtro mono).
//    São nomes de alto peso — vale conseguir a versão branca pra entrarem na faixa:
//    - Governo do Estado de SC  (logo-governo-sc.png  = bandeira preenchida)
//    - Prefeitura de Florianópolis (logo-prefeitura-florianopolis.png = brasão)
//
// ❌ ARQUIVOS ERRADOS recebidos do Manus (re-solicitar):
//    - logo-caasc.png        → na verdade é o ícone do app "PopUp CAASC", não o logo da CAASC.
//    - logo-coc-floripa.png  → na verdade é o brasão "Instituto Nossa Senhora da Piedade", não o COC Floripa.
//
// ❌ FUNDO OPACO (precisam de versão transparente; viram caixa branca):
//    - logo-forum.gif · logo-teltec.jpg · logo-fairyland.jpg
//
// ❌ FALTANDO: Costão do Santinho (CRÍTICO) · Colégio Tendência · Criarte · MPB Engenharia · Comando Painéis · Microlight World
