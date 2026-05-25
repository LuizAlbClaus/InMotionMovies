import React from "react";
import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Services } from "@/components/Services";
import { PortfolioGrid } from "@/components/PortfolioGrid";
import { ContactCTA } from "@/components/ContactCTA";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Nav />
      <main className="flex-1 w-full flex flex-col bg-ink-base">
        <Hero />
        <About />
        <Services />
        <PortfolioGrid />
        <ContactCTA />
      </main>
      <Footer />
    </>
  );
}
