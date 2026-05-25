"use client";

import React, { useEffect } from "react";
import { ReactLenis, useLenis } from "lenis/react";
import { gsap } from "@/lib/gsap";
import { useReducedMotion } from "@/lib/useReducedMotion";

function RafSync() {
  const lenis = useLenis();

  useEffect(() => {
    if (!lenis) return;

    const update = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(update);

    return () => {
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
