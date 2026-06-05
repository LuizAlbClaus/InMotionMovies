import type { Metadata, Viewport } from "next";
import "./globals.css";
import { LenisProvider } from "@/components/LenisProvider";

export const metadata: Metadata = {
  title: "InMotion Movies | Produtora Audiovisual Premium",
  description:
    "Produções cinematográficas, campanhas publicitárias e conteúdo estratégico para marcas que querem parecer gigantes e dominar a atenção.",
  keywords: [
    "produtora audiovisual",
    "campanhas publicitárias",
    "cinema corporativo",
    "fashion film",
    "documentário",
    "InMotion Movies",
    "Florianópolis",
  ],
  authors: [{ name: "InMotion Movies" }],
  openGraph: {
    title: "InMotion Movies | Produtora Audiovisual Premium",
    description:
      "Produções cinematográficas, campanhas publicitárias e conteúdo estratégico para marcas que querem parecer gigantes.",
    type: "website",
    locale: "pt_BR",
    url: "https://inmotionmovies.com.br",
    images: [
      {
        url: "https://inmotionmovies.com.br/og-image.png",
        width: 1200,
        height: 630,
        alt: "InMotion Movies | Produtora Audiovisual Premium",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "InMotion Movies | Produtora Audiovisual Premium",
    description:
      "Produções cinematográficas, campanhas publicitárias e conteúdo estratégico para marcas que querem parecer gigantes.",
    images: ["https://inmotionmovies.com.br/og-image.png"],
  },
  icons: {
    apple: "/apple-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#111111",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <head>
        {/* Abre cedo a conexão com o CDN da Satoshi (fonte do corpo) — economiza o
            DNS+TLS na hora de buscar o CSS/woff2. */}
        <link rel="preconnect" href="https://api.fontshare.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://cdn.fontshare.com" crossOrigin="anonymous" />
        {/* Satoshi via <link> (baixa em paralelo) em vez de @import no CSS (serializa
            depois do bundle de estilos). */}
        <link
          rel="stylesheet"
          href="https://api.fontshare.com/v2/css?f[]=satoshi@300,400,500,700,900&display=swap"
        />
        {/* Preload das fontes Rift acima da dobra (hero/nav usam Regular+Medium). */}
        <link
          rel="preload"
          href="/fonts/RiftRegular.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/RiftMedium.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        {/* Poster do showreel: pintura instantânea do fundo do hero enquanto o vídeo carrega. */}
        <link rel="preload" href="/video/showreel-poster.jpg" as="image" />
      </head>
      <body>
        {/* Global Cinematic Grain overlay */}
        <div className="grain" aria-hidden="true" />
        
        <LenisProvider>
          {children}
        </LenisProvider>
      </body>
    </html>
  );
}
