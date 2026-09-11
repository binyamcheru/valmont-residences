"use client";

import React, { useEffect, createContext, useContext, useRef } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
  if ("scrollRestoration" in window.history) {
    window.history.scrollRestoration = "manual";
  }
}

interface LenisContextType {
  lenis: Lenis | null;
  scrollTo: (target: string | HTMLElement | number, options?: Record<string, unknown>) => void;
}

const LenisContext = createContext<LenisContextType>({
  lenis: null,
  scrollTo: () => {},
});

export const useSmoothScroll = () => useContext(LenisContext);

export default function SmoothScrollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const lenisRef = useRef<Lenis | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      return;
    }

    // High performance smooth scroller with luxurious inertia
    const lenis = new Lenis({
      lerp: 0.075, // Smooth cinematic damping (avoids abrupt frame jumps)
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.2,
      syncTouch: true,
    });

    lenisRef.current = lenis;

    // Sync Lenis scroll updates directly into GSAP ScrollTrigger
    lenis.on("scroll", ScrollTrigger.update);

    // Sync GSAP's requestAnimationFrame ticker with Lenis
    const updateTicker = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(updateTicker);
    gsap.ticker.lagSmoothing(0); // Prevent desync during heavy frame draws

    return () => {
      gsap.ticker.remove(updateTicker);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  // Always reset scroll to top immediately upon route / page change
  useEffect(() => {
    // 1. Instant native window scroll reset
    window.scrollTo(0, 0);

    // 2. Instant Lenis instance scroll reset
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { immediate: true });
    }

    // 3. Clear and recalculate all GSAP ScrollTrigger offsets from top
    const timer = setTimeout(() => {
      window.scrollTo(0, 0);
      if (lenisRef.current) {
        lenisRef.current.scrollTo(0, { immediate: true });
      }
      ScrollTrigger.refresh();
    }, 50);

    return () => clearTimeout(timer);
  }, [pathname]);

  const scrollTo = (
    target: string | HTMLElement | number,
    options?: Record<string, unknown>
  ) => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(target, {
        offset: -40,
        duration: 1.2,
        ...options,
      });
    } else if (typeof target === "string") {
      const el = document.querySelector(target);
      el?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <LenisContext.Provider value={{ lenis: lenisRef.current, scrollTo }}>
      {children}
    </LenisContext.Provider>
  );
}
