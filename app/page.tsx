import React from "react";
import { Nav } from "@/components/Nav";
import { LensHero } from "@/components/LensHero";
import { Hero } from "@/components/Hero";
import { ClientLogos } from "@/components/ClientLogos";
import { About } from "@/components/About";
import { Sectors } from "@/components/Sectors";
import { PortfolioGrid } from "@/components/PortfolioGrid";
import { ContactCTA } from "@/components/ContactCTA";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Nav />
      <main className="flex-1 w-full flex flex-col bg-ink-base">
        <Hero />
        <LensHero />
        <ClientLogos />
        <About />
        <Sectors />
        <PortfolioGrid />
        <ContactCTA />
      </main>
      <Footer />
    </>
  );
}
