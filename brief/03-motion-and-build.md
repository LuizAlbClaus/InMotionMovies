# 03 — Motion & Build (Next.js + GSAP + Lenis)

## Doutrina (leia primeiro)
Pra parecer *séria e gigante*, **contenção é o que faz parecer premium** — motion como pontuação, não decoração. Movimento tem que ter função (guiar atenção, sinalizar, dar feedback). Regras:
- Micro-interações de UI: **200-500ms**.
- Scroll cinematográfico: GSAP `scrub` entre **1 e 2** (lag suave de 1-2s).
- `prefers-reduced-motion` desde o dia 1.

## Motion seção a seção

### HERO — vídeo + revelação contida
- **Vídeo poster-first:** poster estático de alta qualidade aparece instantâneo (é o LCP). Vídeo carrega depois (`preload="none"` + IntersectionObserver), `autoplay muted loop playsinline`, < 10MB, sem áudio. (Vídeo-hero custa ~+1.2s de LCP se mal feito.)
- **Headline:** revelação palavra-a-palavra por opacidade (GSAP SplitText com stagger curto, OU Framer Motion `useScroll`).
- **CTA:** botão com leve efeito magnético (segue o mouse, volta a 0 com ease elástico) — um toque, não em tudo.

### SOBRE — texto que respira
- Parágrafos com **opacity-on-scroll palavra-a-palavra** → ar editorial sofisticado sem mover a página. "20 anos" com leve count-up opcional.

### ÁREAS DE ATUAÇÃO (5 blocos)
- **Parallax/zoom em camadas** no scroll (cada bloco = uma "cena"): escala + blur amarrados ao progresso; máscara separando "sujeito" do fundo dá profundidade 3D.
- Thumbnails com hover discreto (escala 1.0→1.03 + reveal de título, 200-400ms).
- Use `clamp()` no `end` do ScrollTrigger pra animação não vazar fora da página.

### CTA / CONTATO
- Fecho com revelação por scroll; **vermelho `--accent` entra aqui** (botão WhatsApp + keyline). Mantenha simples (headline + CTA), selos/extras abaixo da dobra.

### Opcional (v2, alto custo): cena 3D no scroll
- Câmera WebGL/Three.js dirigida 100% pelo ScrollTrigger num container de `500vh`, `perspective: 70vw`, `scrub: 2`. Só DEPOIS do site pronto e rápido.

## Referência de implementação

**Lenis + GSAP (Next.js App Router):**
```tsx
// providers: <ReactLenis root options={{ lerp: 0.1, syncTouch: true, autoRaf: false }}>
gsap.registerPlugin(ScrollTrigger);            // module scope
gsap.ticker.add((time) => lenis.raf(time * 1000)); // sincroniza RAF -> mata o jitter
ScrollTrigger.refresh();
// use o hook useGSAP (auto-cleanup) e gsap.quickSetter pra transforms de parallax
// nested scroll (modais): data-lenis-prevent  (atenção: syncTouch instável em iOS<16)
```
**Reveal de texto:** GSAP `SplitText` → chars/words + timeline com stagger; OU Framer Motion `useScroll` offset `["start 0.9","start 0.25"]`, opacidade 0→1.

**Vídeo-hero:** `<video poster muted loop playsinline preload="none">` + IntersectionObserver pra dar play ao entrar na viewport; poster como LCP com `<link rel="preload" fetchpriority="high">`. Comprimir: `ffmpeg -i in.mov -an -crf 28 -vcodec libx264 out.mp4` (`-an` tira áudio).

**Grão:** SVG `<feTurbulence>` como `background-image` sob `linear-gradient` + `mix-blend-mode: multiply` + `filter: brightness(.8) contrast(1.2)`.

**prefers-reduced-motion (obrigatório):**
```tsx
// CSS: @media (prefers-reduced-motion: reduce) { trocar zoom/pan por fade simples }
// JS:  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return; // pula ScrollTriggers
// Lenis: passar lerp:1 (scroll instantâneo) pra esse público
```

## Ordem de construção
1. **Estático premium primeiro:** scaffold + tokens de cor + tipografia (Rift display) + grão. Tem que impressionar PARADO.
2. **Lenis + GSAP** com `prefers-reduced-motion` no dia 1.
3. **Hero:** poster+vídeo otimizado (medir LCP < 2.5s) → depois a headline.
4. **Sobre + Áreas de Atuação** (reveals + parallax).
5. **CTA/Contato** com o vermelho.
6. **Auditar LCP/CLS** antes da cena 3D opcional.
7. **Testar com reduced-motion ligado + mobile mid-range.**

## Scaffold sugerido (Next.js App Router)
```
app/
  layout.tsx          // <ReactLenis root>, fonts, grão global
  page.tsx            // monta as seções
  globals.css         // tokens (02-design-system), @font-face Rift, grão, reduced-motion
components/
  Hero.tsx            // vídeo poster-first + headline reveal + CTAs
  About.tsx           // texto opacity-on-scroll
  Services.tsx        // 5 blocos com parallax/zoom em camadas
  PortfolioGrid.tsx   // thumbnails + hover
  ContactCTA.tsx      // fecho + WhatsApp (vermelho)
  Nav.tsx / Footer.tsx
lib/
  gsap.ts             // registerPlugin + helpers (useGSAP, quickSetter)
  useReducedMotion.ts
public/
  fonts/ (Rift .otf)  video/hero.mp4 + hero-poster.jpg
```
Deps: `npm i gsap @gsap/react lenis` (+ Tailwind). Deploy: Vercel.
