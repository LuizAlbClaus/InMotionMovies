# Brief de Produção — Animação de Scroll do Hero (InMotion)

Baseado nas respostas estratégicas + paleta real do projeto + 40 logos de clientes.
Pipeline: Nano Banana → Veo 3.1 (Frames to Video) → frame-sequence 15fps → canvas/scroll Next.js.

## Decisões travadas (do brief)
- **Objetivo:** statement de marca + autoridade. A animação É a prova ("entregam nível cinema") —
  não depende de métricas de cliente. Logos reais entram como prova social (autoridade por associação).
- **Lugar:** Hero, primeira dobra. É a ESTRELA — dona da experiência de abertura no scroll.
- **Mensagem:** "Entregamos no nível do cinema." Diferenciação: estética de cinema + infraestrutura + profissionalismo.
- **Tom:** tradição cinematográfica (NÃO statement de IA). Contenção elegante = premium.
- **Paleta:** #050505 / #111111 (fundos), #b0242f (vermelho-cinema/flare/glow), #f5f5f5 (texto), grain. Fonte display: Rift.
- **Público:** donos de empresa, agências, produtoras de filme, políticos em campanha.
- **4K:** não importa → libera usar 1080p e até o tier Light pra testes.

---

## 3 CONCEITOS (escolha 1 como herói; podem virar um arco de 3 atos)

### ⭐ Conceito 1 — "A LENTE" (recomendado como herói/MVP)
A primeira dobra abre num close extremo da lente de cinema anamórfica (metal preto fosco, reflexo
de flare vermelho no vidro). Conforme você desce, a câmera faz um **slow push-in para DENTRO da lente**.
Nos reflexos do vidro, **os logos dos clientes resolvem de fora-de-foco para foco** (rack focus), um a um.
As lâminas do diafragma (íris) abrem com um glow vermelho. Frame final: a íris abre revelando o
**wordmark InMotion + tagline** em Rift.
- **Câmera:** slow push-in (atenção/tensão) + rack focus (profundidade). Movimento contido = caro.
- **Logos:** compostos nos reflexos da lente no estágio do Nano Banana (logos como object references).
- **Significa:** "somos a lente que transforma sua marca em cinema" + autoridade (veja quem confia).

### Conceito 2 — "O SET GANHA VIDA" (melhor pra infraestrutura/profissionalismo)
Abre no escuro. Ao descer, um set de filmagem "liga": refletores/HMI acendem um a um (tingidos de
vermelho), revelando equipamento profissional — câmera num trilho de dolly, braço de grua varrendo,
cabos, monitores. A câmera faz **tracking lateral** pelo set (parallax). É o "behind the scenes" de uma
produção REAL = prova de infraestrutura (mata a objeção "é só um freelancer com câmera"). Os logos
aparecem como "slates"/claquetes nos monitores.
- **Câmera:** tracking lateral (traversal, revela infraestrutura) + crane.
- **Significa:** escala de estúdio de verdade, não freelancer.

### Conceito 3 — "DO REAL AO CINEMA" (o "componente impossível" de site $15K)
A dobra mostra uma cena/objeto comum (uma cidade, um produto, um rosto) que, ao scrollar, **transforma-se**
na versão cinematográfica de si mesmo — color grading, flare anamórfico, profundidade. Mostra
literalmente "transformamos o comum em cinematográfico". Usa Frames to Video (frame inicial = real/flat,
frame final = cinema graded). Logos aparecem no estado-cinema final.
- **Câmera:** slow push-in + a própria transformação.
- **Significa:** a promessa central, feita literal.

> **Arco de 3 atos (opcional, se quiser sequência longa):** Ato 1 = entra na Lente (C1) → Ato 2 = emerge
> no Set ligando (C2, logos como slates) → Ato 3 = resolve no mark InMotion. 3 beats de ~6–8s encadeados
> por manual clip-chaining. MVP = só o Ato 1.

---

## PRODUÇÃO PASSO A PASSO — Conceito 1 "A Lente" (pronto pra colar no Flow)

### Passo 1 — Nano Banana: FRAME INICIAL (lente fechada, macro)
```
Macro lens, extreme close-up of a vintage anamorphic cinema lens, front glass element filling the
frame. Matte black metal barrel with subtle engraved focus markings. A single deep crimson red
(#b0242f) anamorphic flare streak crosses the glass, faint teal lens-coating reflections. Background
pure near-black (#050505) with soft cinematic film grain. Low-key chiaroscuro lighting, one rim light
catching the lens edge. Photorealistic, 1980s film stock, shallow depth of field f/1.4, 16:9.
```

### Passo 2 — Nano Banana: FRAME FINAL (câmera dentro da lente + logos nos reflexos)
Use o frame inicial como referência + suba 3–5 logos brancos (ex.: governo-sc-white, colcci, unicred):
```
Use the previous lens image as reference, keep identity and palette. The camera is now pushed deep
into the front glass element. Iris aperture blades visible and beginning to open, glowing faint
crimson from within. Inside the glass reflections, place these client wordmark logos [attach logo
PNGs] floating softly, resolving from out-of-focus to sharp, white, minimalist. Maintain the same
dark crimson palette, same lighting, same grain. No changes to the lens barrel. Photorealistic,
shallow depth of field, 16:9.
```
Regras de consistência: "same palette", "maintain lighting", "no changes to the lens barrel".

### Passo 3 — Veo 3.1 (Flow → Frames to Video → sobe frame inicial + final)
```
Slow cinematic push-in toward the lens. The camera glides forward into the front glass element.
Faint crimson light blooms from inside as the aperture blades begin to open. A subtle anamorphic
flare drifts across the frame. The client logos in the reflections gently rack into focus. Gentle,
controlled, premium motion. Dark cinematic mood, heavy film grain, 24fps. No on-screen text.
```
- Duração: 6–8s. Tier: **Quality** pro render final; **Light** pra testar timing (mais barato/rápido).
- Aspect ratio idêntico nos dois frames (16:9). 1080p (4K dispensável).

### Passo 4 (opcional) — encadear Ato 2/3
Extraia o ÚLTIMO frame do Ato 1 → use como PRIMEIRO frame do Ato 2 (set ligando) → novo frame final →
prompt do movimento. Mantém posição/luz travadas (corte invisível). Cole os mesmos tokens de estilo
("Style Bible": dark, crimson #b0242f, film grain, anamorphic) em TODO hop.

---

## EXPORT + INTEGRAÇÃO NO SITE (Abordagem B — frame-sequence scrub)
1. Baixe o .mp4 do Flow.
2. Extraia sequência de imagens a **15fps** (30 é exagero, infla arquivo):
   `ffmpeg -i lente.mp4 -vf "fps=15,scale=1280:-1" -q:v 5 public/frames/lente/%03d.webp`
   (~8s → ~120 frames; alvo de payload < 3–4 MB no total em WebP).
3. Componente React + `<canvas>`: pré-carregue os primeiros ~10 frames, lazy-load o resto; mapeie a
   posição do scroll (GSAP ScrollTrigger `scrub`) ao índice do frame e desenhe no canvas via
   `requestAnimationFrame`. (Detalhe técnico no wiki inmotion-scroll-animation.)

## RECOMENDAÇÃO MOBILE + ACESSIBILIDADE (sua pergunta 18)
- **Desktop:** frame-sequence scrub completo (1280px, 15fps).
- **Mobile / conexão lenta:** NÃO scrubbar 120 WebPs em aparelho fraco. Detecte
  `navigator.connection?.saveData` / `effectiveType` e largura < 768px → sirva (a) um set reduzido
  (~60 frames @ 960px) OU (b) um loop autoplay `muted playsinline` curto e leve OU (c) pin do
  FRAME mais cinematográfico (estático) com leve parallax CSS.
- **`prefers-reduced-motion: reduce`:** mostre 1 frame estático (o final, mais cinema), sem scrub.
  (globals.css já zera animações; adicione o guard no componente de scrub.)
- **Performance é crítico:** "site pesado = usuário sai". Budget de payload do hero < 4 MB; preload só
  os primeiros frames; resto em lazy-load.

## TIER / CUSTO (seu Flow: Omni, Veo 3.1 Light, Quality)
- **Quality** → render final do herói (texturas/luz finas, adere a prompt complexo, conteúdo de público).
- **Light** → iterar timing/movimento barato antes de gastar no Quality.
- Logos entram no estágio Nano Banana (grátis no Flow) → não precisa de Ingredients no vídeo →
  o caminho Frames to Video serve até no Light. Itere MUITO na imagem (grátis) antes do vídeo (pago).
