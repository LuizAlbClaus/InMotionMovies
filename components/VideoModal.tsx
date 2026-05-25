"use client";

import React, { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { gsap, useGSAP } from "@/lib/gsap";
import { useLenis } from "lenis/react";

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoUrl: string;
}

// Parses YouTube or Vimeo URLs to get a clean embed link with autoplay
function getEmbedUrl(url: string) {
  if (!url) return "";

  // YouTube match
  const ytMatch = url.match(
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i
  );
  if (ytMatch && ytMatch[1]) {
    return `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1&modestbranding=1&rel=0&showinfo=0&mute=0&playsinline=1`;
  }

  // Vimeo match
  const vimeoMatch = url.match(/(?:vimeo\.com\/|player\.vimeo\.com\/video\/)([0-9]+)/i);
  if (vimeoMatch && vimeoMatch[1]) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1&muted=0&playsinline=1`;
  }

  return url;
}

export function VideoModal({ isOpen, onClose, videoUrl }: VideoModalProps) {
  const [isRendered, setIsRendered] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const lenis = useLenis();
  const embedUrl = getEmbedUrl(videoUrl);

  // Synchronize component mounting state for transitions
  useEffect(() => {
    if (isOpen) {
      setIsRendered(true);
    }
  }, [isOpen]);

  // Handle page scrolling lock (Lenis + native overflow)
  useEffect(() => {
    if (isOpen && isRendered) {
      if (lenis) lenis.stop();
      document.body.style.overflow = "hidden";
    } else {
      if (lenis) lenis.start();
      document.body.style.overflow = "";
    }

    return () => {
      if (lenis) lenis.start();
      document.body.style.overflow = "";
    };
  }, [isOpen, isRendered, lenis]);

  // Keyboard close shortcut (Escape)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Focus management
  useEffect(() => {
    if (isOpen && isRendered) {
      closeButtonRef.current?.focus();
    }
  }, [isOpen, isRendered]);

  // Entrance & Exit animations
  useGSAP(() => {
    if (!isRendered) return;

    if (isOpen) {
      // Transition IN
      gsap.fromTo(
        modalRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.4, ease: "power2.out" }
      );

      gsap.fromTo(
        videoContainerRef.current,
        { scale: 0.95, y: 30, opacity: 0 },
        { scale: 1, y: 0, opacity: 1, duration: 0.6, ease: "power4.out", delay: 0.1 }
      );

      gsap.fromTo(
        closeButtonRef.current,
        { opacity: 0, rotation: -90 },
        { opacity: 1, rotation: 0, duration: 0.5, ease: "power2.out", delay: 0.3 }
      );
    } else {
      // Transition OUT
      const tl = gsap.timeline({
        onComplete: () => {
          setIsRendered(false);
        },
      });

      tl.to(videoContainerRef.current, {
        scale: 0.95,
        y: 20,
        opacity: 0,
        duration: 0.4,
        ease: "power3.in",
      });

      tl.to(
        closeButtonRef.current,
        {
          opacity: 0,
          rotation: 90,
          duration: 0.3,
          ease: "power2.in",
        },
        "<"
      );

      tl.to(
        modalRef.current,
        {
          opacity: 0,
          duration: 0.3,
          ease: "power2.inOut",
        },
        "-=0.2"
      );
    }
  }, { dependencies: [isOpen, isRendered], scope: modalRef });

  if (!isRendered) return null;

  return (
    <div
      ref={modalRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="video-modal-title"
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 bg-ink-abyss/95 backdrop-blur-xl transition-all duration-300"
      onClick={onClose}
    >
      <span id="video-modal-title" className="sr-only">
        Showreel Video Player
      </span>

      {/* Close button with circular rotating border on hover */}
      <button
        ref={closeButtonRef}
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        className="absolute top-6 right-6 md:top-10 md:right-10 flex items-center gap-2 group text-text-mut hover:text-text-hi transition-colors focus:outline-none focus:ring-2 focus:ring-accent rounded-full p-2 z-[110]"
        aria-label="Fechar vídeo"
      >
        <span className="font-display text-base tracking-widest uppercase hidden md:inline opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          Fechar
        </span>
        <div className="relative w-12 h-12 flex items-center justify-center rounded-full bg-ink-raise/40 border border-text-mut/20 group-hover:border-accent group-hover:bg-ink-raise transition-all duration-500">
          {/* Animated rotation element on hover */}
          <div className="absolute inset-0 rounded-full border border-transparent border-t-accent opacity-0 group-hover:opacity-100 group-hover:rotate-180 transition-all duration-500" />
          <X className="w-5 h-5 relative z-10 transition-transform duration-500 group-hover:scale-110" />
        </div>
      </button>

      {/* Video Iframe Container */}
      <div
        ref={videoContainerRef}
        className="relative w-full max-w-5xl aspect-video rounded-lg overflow-hidden shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] border border-ink-raise/60 bg-black"
        onClick={(e) => e.stopPropagation()}
      >
        {embedUrl ? (
          <iframe
            src={embedUrl}
            title="InMotion Movies Showreel"
            allow="autoplay; encrypted-media; picture-in-picture; web-share"
            allowFullScreen
            className="absolute inset-0 w-full h-full border-0"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-text-mut">
            Vídeo indisponível
          </div>
        )}
      </div>
    </div>
  );
}
