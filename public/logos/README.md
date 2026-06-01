# public/logos — Logos de clientes da InMotion

20 logos de clientes, para a **faixa de clientes** (home) e as **paredes de logos** das verticais. Fonte da verdade dos metadados: **`logos.json`** (consuma ele nos componentes).

## Convenção
- Nome: `logo-{slug}.{ext}` — slug minúsculo, sem acento, com hífen.
- Extensão = formato REAL do arquivo (alguns chegaram com extensão errada; já normalizei).

## ⚠️ Regra de ouro: o site é ESCURO (#111111)

A maioria dos logos é **transparente porém colorida/preta** → **somem no fundo escuro** se usados na cor nativa. Solução = padrão premium de faixa de clientes: **renderizar todos em BRANCO uniforme via filtro CSS**. Isso resolve Colcci (preto), Governo (texto preto), FACISC, Unicred etc. de uma vez, e dá o visual monocromático elegante de produtora top.

```tsx
// Faixa de clientes — logo mono branco, realça no hover
<img
  src={`/logos/${logo.file}`}
  alt={logo.company}
  className="h-8 w-auto object-contain opacity-65 transition
             [filter:brightness(0)_invert(1)] hover:opacity-100"
/>
// Renderize SÓ os logos com darkBgRender === "mono-filter".
// Pule os "needs-rework" (têm fundo opaco → viram caixa branca).
```

## Tiers (ver detalhe em logos.json)
- **Tier 1 (8) — prontos pra faixa do hero:** Colcci · Governo SC · Prefeitura Floripa · FACISC · CAASC · Unicred · COC Floripa · Brasil Atacadista. (Array `heroStrip` no JSON.)
- **Tier 2 — bons pras paredes de vertical:** Lumma · Norte · Nova Fase · Uniprime · Elisa Andreoli · Criativo · Fátima · Incentivo.
- **Tier 3 — usar com ressalva:** Colégio Conhecimento (baixa-res 328×60).

## ❌ Precisam de rework (NÃO usar no escuro até consertar)
Fundo OPACO → viram caixa branca:
- **Forum** (`logo-forum.gif`, opaco) — marca de moda nacional, versão transparente é fácil de obter.
- **Teltec** (`logo-teltec.jpg`, opaco 200px).
- **Fairyland** (`logo-fairyland.jpg`, opaco) — badge colorido; avaliar se combina com o tom premium.

## ❌ FALTANDO (6) — pedir/coletar
- **Costão do Santinho** — CRÍTICO (flagship de hospitalidade; o CSV dizia OK mas o arquivo não veio).
- Colégio Tendência · Criarte · MPB Engenharia · Comando Painéis Elétricos · Microlight World.

## Descartados na importação
- `logo-colcci.svg` recebido era uma página HTML "404" (worldvectorlogo) — descartado; usar `logo-colcci.png`.
- `logo-unicred.svg` recebido tinha cores erradas (azul, não verde/dourado) — descartado; usar `logo-unicred.png`.

## Próximo passo recomendado
Coletar os 6 faltantes + versões transparentes dos 3 de rework (Manus ou direto com o cliente — colégios e firmas locais têm o vetor e gostam de ser destacados). Costão é prioridade: é prova de peso na faixa do hero.
