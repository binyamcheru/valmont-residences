"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const TOTAL_FRAMES = 360;

interface ScrollVideoHeroProps {
  onLoadingProgress?: (progress: number, isReady: boolean) => void;
}

export default function ScrollVideoHero({
  onLoadingProgress,
}: ScrollVideoHeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const progressLineRef = useRef<HTMLDivElement>(null);

  // Overlay refs
  const overlay1Ref = useRef<HTMLDivElement>(null);
  const overlay2Ref = useRef<HTMLDivElement>(null);
  const overlay3Ref = useRef<HTMLDivElement>(null);

  const imagesRef = useRef<(HTMLImageElement | null)[]>(new Array(TOTAL_FRAMES).fill(null));
  const currentDrawnFrameRef = useRef<number>(-1);
  const targetFrameRef = useRef<number>(0);
  const isVisibleRef = useRef<boolean>(true);
  const [reducedMotion, setReducedMotion] = useState(false);

  // Format frame path: always use /frames/desktop/frame_0001.webp
  const getFrameSrc = useCallback((index: number) => {
    const frameNumber = String(index + 1).padStart(4, "0");
    return `/frames/desktop/frame_${frameNumber}.webp`;
  }, []);

  // Draw frame to canvas with aspect ratio cover & high quality smoothing
  const drawFrame = useCallback((frameIndex: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    const img = imagesRef.current[frameIndex];
    if (!img || !img.complete || img.naturalWidth === 0) {
      return;
    }

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    const cw = canvas.width;
    const ch = canvas.height;
    const imgRatio = img.naturalWidth / img.naturalHeight;
    const canvasRatio = cw / ch;

    let drawW = cw;
    let drawH = ch;
    let offsetX = 0;
    let offsetY = 0;

    if (canvasRatio > imgRatio) {
      drawH = cw / imgRatio;
      offsetY = (ch - drawH) / 2;
    } else {
      drawW = ch * imgRatio;
      offsetX = (cw - drawW) / 2;
    }

    ctx.drawImage(img, offsetX, offsetY, drawW, drawH);
  }, []);

  // Resize canvas according to viewport and retina DPR
  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = window.innerWidth;
    const height = window.innerHeight;

    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    const frameToDraw = currentDrawnFrameRef.current >= 0 ? currentDrawnFrameRef.current : 0;
    drawFrame(frameToDraw);
  }, [drawFrame]);

  // Decoupled 60fps/120fps Render Loop with Nearest Available Frame Fallback
  useEffect(() => {
    let animId: number;

    const findClosestAvailableFrame = (target: number): number => {
      // 1. Direct hit
      const direct = imagesRef.current[target];
      if (direct && direct.complete && direct.naturalWidth > 0) return target;

      // 2. Search backward from target
      for (let i = target - 1; i >= 0; i--) {
        const img = imagesRef.current[i];
        if (img && img.complete && img.naturalWidth > 0) return i;
      }

      // 3. Search forward if nothing backward
      for (let i = target + 1; i < TOTAL_FRAMES; i++) {
        const img = imagesRef.current[i];
        if (img && img.complete && img.naturalWidth > 0) return i;
      }

      return 0; // Fallback to Frame 0
    };

    const renderLoop = () => {
      if (isVisibleRef.current) {
        const target = targetFrameRef.current;
        const bestFrame = findClosestAvailableFrame(target);
        const bestImg = imagesRef.current[bestFrame];
        if (bestImg && bestImg.complete && bestImg.naturalWidth > 0) {
          if (bestFrame !== currentDrawnFrameRef.current) {
            currentDrawnFrameRef.current = bestFrame;
            drawFrame(bestFrame);
          }
        }
      }
      animId = requestAnimationFrame(renderLoop);
    };

    animId = requestAnimationFrame(renderLoop);

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [drawFrame]);

  const onLoadingProgressRef = useRef(onLoadingProgress);
  useEffect(() => {
    onLoadingProgressRef.current = onLoadingProgress;
  }, [onLoadingProgress]);

  // High-Throughput Preloader for 360 frames with async GPU decoding
  useEffect(() => {
    const isReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setReducedMotion(isReduced);

    let loadedCount = 0;
    let isCancelled = false;

    const loadSingleImage = (index: number): Promise<HTMLImageElement> => {
      return new Promise((resolve) => {
        const img = new Image();
        img.src = getFrameSrc(index);

        const onDone = () => {
          if (isCancelled) return;
          imagesRef.current[index] = img;
          loadedCount++;

          if (index === 0) {
            currentDrawnFrameRef.current = 0;
            targetFrameRef.current = 0;
            drawFrame(0);
          }

          const percent = (loadedCount / TOTAL_FRAMES) * 100;
          onLoadingProgressRef.current?.(percent, loadedCount >= 20);

          resolve(img);
        };

        img.onload = () => {
          onDone();
        };

        img.onerror = () => {
          onDone();
        };
      });
    };

    // High-Throughput Concurrent Stream Pool (24 parallel HTTP/2 streams)
    const startPreloader = async () => {
      // Step 1: Immediately fetch Frame 0 for instant visual render
      await loadSingleImage(0);
      if (isCancelled) return;

      // Step 2: Continuous Worker Pool across all remaining frames
      const CONCURRENCY = 24;
      let currentIndex = 1;

      const worker = async () => {
        while (currentIndex < TOTAL_FRAMES && !isCancelled) {
          const indexToFetch = currentIndex++;
          await loadSingleImage(indexToFetch);
        }
      };

      const pool = Array.from({ length: CONCURRENCY }, () => worker());
      await Promise.all(pool);
    };

    startPreloader();

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    return () => {
      isCancelled = true;
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [drawFrame, getFrameSrc, resizeCanvas]);

  // IntersectionObserver to pause rendering when hero is out of view
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisibleRef.current = entry.isIntersecting;
        });
      },
      { threshold: 0 }
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  // GSAP ScrollTrigger Setup: Direct 1-to-1 sync with Lenis smooth scroll
  useEffect(() => {
    if (reducedMotion) return;
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: container,
        start: "top top",
        end: "+=450%", // 4.5x viewport scroll distance
        pin: true,
        scrub: 0.6, // Smooth physics spring eliminates discrete frame stepping
        anticipatePin: 1,
        onUpdate: (self) => {
          const progress = self.progress;

          // Compute target frame across full scroll range
          const targetFrame = Math.min(
            TOTAL_FRAMES - 1,
            Math.max(0, Math.floor(progress * (TOTAL_FRAMES - 0.001)))
          );
          targetFrameRef.current = targetFrame;

          // Update progress line
          if (progressLineRef.current) {
            progressLineRef.current.style.transform = `scaleY(${progress})`;
          }

          // Overlay 1 (0% to 18% progress - Gate/Entrance)
          if (overlay1Ref.current) {
            let opacity = 0;
            if (progress <= 0.12) {
              opacity = 1 - progress / 0.12;
            } else if (progress <= 0.18) {
              opacity = Math.max(0, 1 - (progress - 0.12) / 0.06);
            }
            overlay1Ref.current.style.opacity = `${opacity}`;
            overlay1Ref.current.style.transform = `translate3d(0, ${-progress * 25}px, 0)`;
          }

          // Overlay 2 (32% to 54% progress - Lobby & Amenities)
          if (overlay2Ref.current) {
            let opacity = 0;
            if (progress >= 0.30 && progress <= 0.38) {
              opacity = (progress - 0.30) / 0.08;
            } else if (progress > 0.38 && progress <= 0.46) {
              opacity = 1;
            } else if (progress > 0.46 && progress <= 0.54) {
              opacity = Math.max(0, 1 - (progress - 0.46) / 0.08);
            }
            overlay2Ref.current.style.opacity = `${opacity}`;
            overlay2Ref.current.style.transform = `translate3d(0, ${-(progress - 0.42) * 25}px, 0)`;
          }

          // Overlay 3 (68% to 92% progress - Flat Interior & Views)
          if (overlay3Ref.current) {
            let opacity = 0;
            if (progress >= 0.66 && progress <= 0.74) {
              opacity = (progress - 0.66) / 0.08;
            } else if (progress > 0.74 && progress <= 0.84) {
              opacity = 1;
            } else if (progress > 0.84 && progress <= 0.92) {
              opacity = Math.max(0, 1 - (progress - 0.84) / 0.08);
            }
            overlay3Ref.current.style.opacity = `${opacity}`;
            overlay3Ref.current.style.transform = `translate3d(0, ${-(progress - 0.79) * 25}px, 0)`;
          }
        },
      });
    }, container);

    return () => ctx.revert();
  }, [reducedMotion]);

  if (reducedMotion) {
    return (
      <section
        id="hero-section"
        className="relative w-full min-h-[90vh] flex items-center justify-center bg-[#141414] px-6 py-24"
      >
        <div className="max-w-4xl mx-auto text-center z-10">
          <span className="text-[11px] tracking-[0.35em] text-[#A8895C] uppercase font-sans mb-4 block">
            Valmont & Co. Estates Presents
          </span>
          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl tracking-[0.15em] font-light text-[#F5F1EA] uppercase mb-6">
            The Valmont
          </h1>
          <p className="text-sm md:text-base text-[#A39E93] max-w-lg mx-auto font-sans font-light tracking-wide leading-relaxed">
            An architectural milestone of restrained elegance and private parkland living.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section
      id="hero-section"
      ref={containerRef}
      className="relative w-full h-screen h-[100dvh] bg-[#141414] overflow-hidden select-none"
    >
      {/* Instant Base Poster Frame (Guarantees zero black screen on reload) */}
      <img
        src="/frames/desktop/frame_0001.webp"
        alt="The Valmont"
        className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none"
        loading="eager"
      />

      {/* High-Resolution Canvas 2D frame display */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full object-cover z-0"
      />

      {/* Subtle minimal contrast overlay */}
      <div className="absolute inset-0 bg-[#141414]/5 pointer-events-none z-10" />

      {/* Narrative Overlay 1: 0%–18% (Entrance & Arrival) */}
      <div
        ref={overlay1Ref}
        className="absolute inset-0 z-20 flex flex-col items-center justify-center px-6 text-center pointer-events-none will-change-transform"
        style={{ opacity: 1 }}
      >
        <div className="max-w-4xl mx-auto">
          <span className="text-[10px] md:text-[11px] tracking-[0.35em] text-[#A8895C] uppercase font-sans mb-4 block font-medium">
            Valmont & Co. Estates Presents
          </span>
          <h1 className="font-serif text-5xl sm:text-6xl md:text-8xl tracking-[0.18em] font-light text-[#F5F1EA] uppercase leading-none mb-6">
            The Valmont
          </h1>
          <div className="w-12 h-[1px] bg-[#A8895C] mx-auto mb-6 opacity-70" />
          <p className="text-xs md:text-sm tracking-[0.25em] text-[#A39E93] uppercase font-sans font-light max-w-md mx-auto">
            A private residential sanctuary on the parklands
          </p>
        </div>
      </div>

      {/* Narrative Overlay 2: 35%–55% (Lobby & Amenities) */}
      <div
        ref={overlay2Ref}
        className="absolute inset-0 z-20 flex flex-col items-start justify-center px-8 md:px-20 lg:px-28 pointer-events-none will-change-transform"
        style={{ opacity: 0 }}
      >
        <div className="max-w-xl text-left bg-[#141414]/85 p-8 md:p-10 border border-[rgba(245,241,234,0.12)]">
          <span className="text-[10px] md:text-[11px] tracking-[0.3em] text-[#A8895C] uppercase font-sans mb-3 block font-medium">
            Amenities & Concierge
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl tracking-[0.12em] font-light text-[#F5F1EA] uppercase leading-tight mb-4">
            Private Porte-Cochère & Grand Atrium
          </h2>
          <div className="w-10 h-[1px] bg-[#A8895C] mb-5 opacity-60" />
          <p className="text-xs md:text-sm text-[#A39E93] font-sans font-light leading-relaxed tracking-wide">
            Attended 24-hour concierge service, dedicated chauffeur staging, wellness suites, and temperature-controlled wine cellar.
          </p>
        </div>
      </div>

      {/* Narrative Overlay 3: 75%–95% (The Residence & Interiors) */}
      <div
        ref={overlay3Ref}
        className="absolute inset-0 z-20 flex flex-col items-end justify-center px-8 md:px-20 lg:px-28 pointer-events-none will-change-transform"
        style={{ opacity: 0 }}
      >
        <div className="max-w-xl text-right bg-[#141414]/85 p-8 md:p-10 border border-[rgba(245,241,234,0.12)]">
          <span className="text-[10px] md:text-[11px] tracking-[0.3em] text-[#A8895C] uppercase font-sans mb-3 block font-medium">
            The Residence
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl tracking-[0.12em] font-light text-[#F5F1EA] uppercase leading-tight mb-4">
            Tailored Volumes & City Horizons
          </h2>
          <div className="w-10 h-[1px] bg-[#A8895C] ml-auto mb-5 opacity-60" />
          <p className="text-xs md:text-sm text-[#A39E93] font-sans font-light leading-relaxed tracking-wide">
            Bespoke rift-sawn oak millwork, natural honed stone hearths, and soaring ceiling volumes opening onto private terraces.
          </p>
        </div>
      </div>

      {/* Minimal Right-Hand Hairline Scroll Progress Indicator */}
      <div className="absolute right-6 md:right-12 top-1/2 -translate-y-1/2 z-20 flex flex-col items-center space-y-3 pointer-events-none">
        <span className="text-[8px] tracking-[0.3em] text-[#A39E93] uppercase font-mono [writing-mode:vertical-lr] rotate-180">
          Walkthrough
        </span>
        <div className="w-[1px] h-28 bg-[rgba(245,241,234,0.15)] relative overflow-hidden">
          <div
            ref={progressLineRef}
            className="w-full h-full bg-[#A8895C] origin-top transition-transform duration-75 ease-linear"
            style={{ transform: "scaleY(0)" }}
          />
        </div>
      </div>

      {/* Subtle Scroll Cue */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center space-y-2 pointer-events-none opacity-60">
        <span className="text-[9px] tracking-[0.3em] uppercase text-[#F5F1EA] font-sans font-light">
          Scroll to Explore
        </span>
        <div className="w-[1px] h-6 bg-[rgba(245,241,234,0.3)] animate-pulse" />
      </div>
    </section>
  );
}
