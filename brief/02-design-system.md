# 02 — Design System (build-ready)

> Reconcilia a paleta declarada da InMotion com boas práticas de dark-UI 2026. Fundamentado na pesquisa (notebook `inmotion-landing-design-20260524`).

## Cores — tokens

```css
:root {
  --ink-abyss: #050505; /* SÓ atrás de vídeo/imagem full-bleed (sem texto). Preto profundo = pop cinematográfico. */
  --ink-base:  #111111; /* fundo padrão de TODA seção com texto (grafite da marca ≈ recomendação dark-UI) */
  --ink-raise: #1A1A1A; /* cards / superfícies elevadas / hover */
  --text-hi:   #F5F5F5; /* SÓ headlines de display grandes e esparsas */
  --text-body: #E8E8E8; /* corpo de texto longo — abaixo do branco puro pra reduzir halation */
  --text-mut:  #B8B8B8; /* texto secundário / legendas */
  --accent:    #B0242F; /* vermelho cinematográfico DESSATURADO (~75%). Só pontuação. */
  --accent-deep: #8E2433; /* alternativa oxblood mais contida */
}
```

**Por que não usar `#050505` em tudo:** preto puro sob texto causa *halation* (borrão) e fadiga. Por isso `#111111` é o fundo das seções com texto, e `#050505` fica reservado pra trás de mídia. Texto longo em `#E8E8E8` (não branco puro). Alvo de contraste **≥ 4.5:1**.

**O vermelho:** vermelho vibrante puro fica "berrante" no escuro — dessature pra **70-80%**. Use `--accent` SÓ como pontuação: CTA primário, underline de nav ativo, o triângulo de play, uma keyline. Nunca em blocos grandes. (Valor final é decisão do Luiz; `#B0242F` é o ponto de partida, `#8E2433` se quiser mais sóbrio.)

## Tipografia

**Display (títulos):** **Rift** — condensada, caixa-alta, geométrica. Arquivos em `assets/fonts/`. Use as variantes **"hard"** (Rift Regular/Medium/Demi/Bold) pro tom sério; **evite a "Rift Soft" (arredondada)**. Caixa-alta com `letter-spacing` levemente aberto (~0.02-0.04em). Em títulos enormes, cor `#E0E0E0`/`--text-hi` (evita glare).

```css
@font-face { font-family:"Rift"; src:url("/fonts/RiftRegular.otf") format("opentype"); font-weight:400; font-display:swap; }
@font-face { font-family:"Rift"; src:url("/fonts/RiftDemi.otf")    format("opentype"); font-weight:600; font-display:swap; }
@font-face { font-family:"Rift"; src:url("/fonts/RiftBold.otf")    format("opentype"); font-weight:700; font-display:swap; }
/* (renomeie os .otf ao mover pra /public/fonts) */
```

**Corpo:** Rift é SÓ display (caixa-alta condensada destrói legibilidade em parágrafo). Use uma **grotesca neutra**:
- **Recomendado:** **Satoshi** (grátis em fontshare.com) — moderno, limpo, encaixa no "tech".
- **Alternativa premium:** **Neue Montreal** (licença).
- `line-height` 1.5-1.8; medida de 45-75 caracteres por linha; evite bold em excesso.

**Sistema:** no máximo 2-3 fontes com papéis exclusivos (display Rift / corpo grotesca / [opcional] mono pra detalhes técnicos).

## Layout & espaço
- **Espaço negativo generoso**, grid podendo ser assimétrico/quebrado pra jogar o olho no visual central. 2-3 tons calibrados.
- Cuidado: minimalismo não pode esconder a navegação — streamline sem virar incerteza.
- Escala tipográfica ampla (headlines bem maiores que o corpo) cria a hierarquia "cinematográfica".

## Textura — grão de filme (a "ilustração" da marca)
Overlay de ruído sutil dá o ar analógico/cinematográfico **e mata o color-banding** dos gradientes escuros:
```css
/* SVG <feTurbulence> como background-image, por baixo de um gradiente */
.grain { position:fixed; inset:0; pointer-events:none; opacity:.06;
  background:url("data:image/svg+xml,...feTurbulence..."); mix-blend-mode:multiply; }
```
Boost com `filter: brightness(.8) contrast(1.2)` pra puxar o ruído pra grão nítido. Mantenha opacidade baixa (~5-8%) — é textura, não estrela.

## Acessibilidade (parte do "objetivo/sério")
- Contraste ≥ 4.5:1 (texto normal). Não usar `#000` sob texto.
- `prefers-reduced-motion`: obrigatório (ver `03-motion-and-build.md`).
- Foco visível nos interativos; alt text; vídeo `muted` no autoplay.
