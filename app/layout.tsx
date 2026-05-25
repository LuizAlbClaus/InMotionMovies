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
  },
  icons: {
    icon: "/favicon.ico",
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
