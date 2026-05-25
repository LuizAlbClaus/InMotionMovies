# START HERE — prompt pra colar num chat/LLM novo

Copie o bloco abaixo num chat novo (Claude Code, Cursor, etc.) **com esta pasta aberta como contexto**. Ele orienta o LLM a construir o site.

---

```
Você vai construir o site institucional de uma produtora audiovisual premium, a InMotion Movies.

CONTEXTO: leia, nesta pasta, na ordem:
- brief/01-brand-brief.md   (marca, tom e TODO o texto do site)
- brief/02-design-system.md (cores, tipografia, espaçamento, textura, vermelho)
- brief/03-motion-and-build.md (motion seção-a-seção, stack, código, ordem de build)
- brief/04-references.md    (referências e sites premiados pra inspirar)
Os assets estão em assets/fonts/ (família Rift) e assets/logo/.

STACK: Next.js (App Router) + TypeScript + Tailwind CSS + GSAP (ScrollTrigger) + Lenis (smooth scroll). Hospedagem alvo: Vercel.

ESTÉTICA (inegociável): escura, minimalista, elegante, cinematográfica. Séria e objetiva.
A marca quer parecer GIGANTE — isso vem de CONTENÇÃO e craft, não de excesso de efeito.
Animação é PONTUAÇÃO, não decoração. Poucos movimentos, executados com perfeição.

REGRAS DURAS:
1. Carrega rápido. Vídeo-hero com poster-first, lazy/preload controlado, LCP < 2.5s.
2. Respeita prefers-reduced-motion (CSS + JS) desde o começo.
3. Contraste acessível (≥ 4.5:1). Nada de preto puro #000 sob texto.
4. Mobile impecável (motion pesado quebra em mobile — teste).

COMECE POR (não pule etapas):
1. Scaffold Next.js + Tailwind + fontes (Rift como display) + tokens de cor do design-system.
   Faça a página parecer premium PARADA antes de qualquer animação.
2. Lenis + GSAP com fallback prefers-reduced-motion.
3. Hero (poster + vídeo otimizado, depois a revelação da headline).
4. Seções Sobre → Áreas de Atuação (5) → CTA/Contato.
5. Auditar performance (LCP/CLS) antes de qualquer enfeite extra (ex.: cena 3D).

Me mostre o plano de arquivos/components antes de escrever muito código. Pergunte se algo do brief estiver ambíguo.
```

---

## Checklist de pré-produção (você, Luiz)
- [ ] **Vídeo do hero:** clipe cinematográfico curto (10-20s, loop), comprimido < 10MB, sem áudio. Mais um **poster** (frame estático de alta qualidade).
- [ ] **Portfólio:** 6-12 thumbnails + vídeos/links dos cases (com título, cliente, categoria).
- [ ] **Fonte de corpo:** baixar Satoshi (grátis, fontshare.com) OU licenciar Neue Montreal. (Rift, em `assets/fonts/`, é só pra títulos.)
- [ ] **Vermelho:** confirmar o tom (sugestão: `#B0242F`; ver design-system).
- [ ] **Contato:** WhatsApp (número), telefone, email, cidade.
- [ ] **Domínio + Vercel** pra deploy.

## Notas
- Família **Rift** completa (.otf) já está em `assets/fonts/` — use as variantes "hard" (Regular/Medium/Demi/Bold) pra um tom sério; evite a "Soft" (arredondada).
- O logo (`assets/logo/inmotion-logo.png`) tem o triângulo de "play" integrado — pode virar um motivo gráfico recorrente (loader, ícone de play nos vídeos).
