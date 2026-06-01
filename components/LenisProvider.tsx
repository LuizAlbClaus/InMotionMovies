"use client";

import React, { useEffect } from "react";
import { ReactLenis, useLenis } from "lenis/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useReducedMotion } from "@/lib/useReducedMotion";

function RafSync() {
  const lenis = useLenis();

  useEffect(() => {
    if (!lenis) return;

    // Lenis dirige o scroll suave; o ScrollTrigger precisa atualizar a CADA
    // evento de scroll do Lenis, senão o scrub (canvas da lente) engasga.
    const onScroll = () => ScrollTrigger.update();
    lenis.on("scroll", onScroll);

    const update = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.off("scroll", onScroll);
      gsap.ticker.remove(update);
    };
  }, [lenis]);

  return null;
}

export function LenisProvider({ children }: { children: React.ReactNode }) {
  const isReduced = useReducedMotion();

  return (
    <ReactLenis
      root
      options={{
        lerp: isReduced ? 1.0 : 0.08, // disable easing if prefers-reduced-motion is active
        duration: isReduced ? 0.0 : 1.2,
        syncTouch: true,
        autoRaf: false, // let GSAP drive RAF
      }}
    >
      <RafSync />
      {children}
    </ReactLenis>
  );
}
