import type { Metadata } from "next";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { ProcessContent } from "@/components/ProcessContent";

export const metadata: Metadata = {
  title: "Como Trabalhamos | InMotion Movies",
  description:
    "Da estratégia à entrega: a InMotion conduz sua produção audiovisual de ponta a ponta — com método, prazos definidos e direitos claros.",
  openGraph: {
    title: "Como Trabalhamos | InMotion Movies",
    description:
      "Da estratégia à entrega: produção audiovisual conduzida de ponta a ponta, sem caos.",
    type: "website",
    locale: "pt_BR",
  },
};

export default function ProcessoPage() {
  return (
    <>
      <Nav />
      <main className="flex-1 w-full flex flex-col bg-ink-base">
        <ProcessContent />
      </main>
      <Footer />
    </>
  );
}
