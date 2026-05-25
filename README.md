# InMotion Movies — Site Institucional (pacote de construção)

Pacote auto-contido para construir o site institucional da **InMotion Movies** (produtora audiovisual premium) em outro chat/LLM ou com um dev. Tudo que é preciso pra começar está aqui.

## Como usar
1. Abra **`00-START-HERE.md`** e cole o prompt nele num chat novo (Claude/Cursor/etc.).
2. O LLM lê os 4 docs em `brief/` + os assets e começa a construir.

## O que tem aqui
```
InMotionMovies/
├── README.md                  ← este arquivo
├── 00-START-HERE.md           ← prompt pronto pra colar num LLM novo + checklist
├── brief/
│   ├── 01-brand-brief.md      ← marca, posicionamento, tom + TODO o texto do site
│   ├── 02-design-system.md    ← cores, tipografia, espaçamento, textura, vermelho
│   ├── 03-motion-and-build.md ← motion seção-a-seção + stack/código + ordem de build
│   └── 04-references.md       ← 23 fontes de referência + sites premiados pra estudar
└── assets/
    ├── fonts/                 ← família Rift completa (.otf) — fonte de display da marca
    └── logo/inmotion-logo.png ← logo (IN cinza + MOTION preto + triângulo de play)
```

## Resumo de 10 segundos
- **Marca:** produtora audiovisual premium. Pitch: *"Transformamos empresas em marcas que parecem gigantes."*
- **Estética:** escura, minimalista, elegante, cinematográfica. Séria e objetiva — **contenção** é o que faz parecer premium (motion como pontuação, não decoração).
- **Stack recomendada:** Next.js (App Router) + GSAP (ScrollTrigger) + Lenis (smooth scroll) + Tailwind.
- **Regras inegociáveis:** carrega rápido (vídeo-hero otimizado, LCP < 2.5s), respeita `prefers-reduced-motion`, contraste acessível.

> Pesquisa grounded por trás disto: notebook NotebookLM `inmotion-landing-design-20260524` (23 fontes). Detalhes em `brief/04-references.md`.
