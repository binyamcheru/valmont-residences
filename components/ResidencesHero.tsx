"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const TOTAL_FRAMES = 360;

interface ResidencesHeroProps {
  scrollDistance?: string; // e.g. "450%"
}

export default function ResidencesHero({
  scrollDistance = "450%",
}: ResidencesHeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const progressLineRef = useRef<HTMLDivElement>(null);

  // Minimal Clean Floating Narrative Overlays (Pure typography, no boxes)
  const overlay1Ref = useRef<HTMLDivElement>(null);
  const overlay2Ref = useRef<HTMLDivElement>(null);
  const overlay3Ref = useRef<HTMLDivElement>(null);

  // Floating Chapter Indicator
  const chapterPillTextRef = useRef<HTMLSpanElement>(null);

  const imagesRef = useRef<(HTMLImageElement | null)[]>(new Array(TOTAL_FRAMES).fill(null));
  const currentDrawnFrameRef = useRef<number>(-1);
  const targetFrameRef = useRef<number>(0);
  const isVisibleRef = useRef<boolean>(true);
  const [reducedMotion, setReducedMotion] = useState(false);

  // Frame path: /frames/desktop2/frame_0001.webp
  const getFrameSrc = useCallback((index: number) => {
    const frameNumber = String(index + 1).padStart(4, "0");
    return `/frames/desktop2/frame_${frameNumber}.webp`;
  }, []);

  // Draw frame to canvas with aspect ratio cover & high quality smoothing
  const drawFrame = useCallback((frameIndex: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    const img = imagesRef.current[frameIndex];
    if (!img || !img.complete || img.naturalWidth === 0) return;

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
      const direct = imagesRef.current[target];
      if (direct && direct.complete && direct.naturalWidth > 0) return target;

      for (let i = target - 1; i >= 0; i--) {
        const img = imagesRef.current[i];
        if (img && img.complete && img.naturalWidth > 0) return i;
      }

      for (let i = target + 1; i < TOTAL_FRAMES; i++) {
        const img = imagesRef.current[i];
        if (img && img.complete && img.naturalWidth > 0) return i;
      }

      return 0;
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
    return () => cancelAnimationFrame(animId);
  }, [drawFrame]);

  // High-Throughput 24-Stream Preloader
  useEffect(() => {
    const isReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setReducedMotion(isReduced);

    let isCancelled = false;

    const loadSingleImage = (index: number): Promise<HTMLImageElement> => {
      return new Promise((resolve) => {
        const img = new Image();
        img.src = getFrameSrc(index);

        const onDone = () => {
          if (isCancelled) return;
          imagesRef.current[index] = img;

          if (index === 0 && currentDrawnFrameRef.current === -1) {
            currentDrawnFrameRef.current = 0;
            drawFrame(0);
          }
          resolve(img);
        };

        img.onload = () => onDone();
        img.onerror = () => {
          const fallback = new Image();
          const frameNum = String(index + 1).padStart(4, "0");
          fallback.src = `/frames/desktop/frame_${frameNum}.webp`;
          fallback.onload = () => {
            if (!isCancelled) {
              imagesRef.current[index] = fallback;
            }
            resolve(fallback);
          };
          fallback.onerror = () => onDone();
        };
      });
    };

    const startPreloader = async () => {
      await loadSingleImage(0);
      if (isCancelled) return;

      const CONCURRENCY = 24;
      let currentIndex = 1;

      const worker = async () => {
        while (currentIndex < TOTAL_FRAMES && !isCancelled) {
          const idx = currentIndex++;
          await loadSingleImage(idx);
        }
      };

      await Promise.all(Array.from({ length: CONCURRENCY }, () => worker()));
    };

    startPreloader();
    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    return () => {
      isCancelled = true;
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [drawFrame, getFrameSrc, resizeCanvas]);

  // Pause rendering when hero is offscreen
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisibleRef.current = entry.isIntersecting;
      },
      { threshold: 0 }
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  // GSAP ScrollTrigger Pinned Scrub (Unified Continuous Single Canvas)
  useEffect(() => {
    if (reducedMotion) return;

    const container = containerRef.current;
    if (!container) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: container,
        start: "top top",
        end: `+=${scrollDistance}`,
        pin: true,
        scrub: 0.6, // Smooth physics spring eliminates frame stepping
        anticipatePin: 1,
        onUpdate: (self) => {
          const p = self.progress;

          // Compute target frame across all 360 frames
          const targetFrame = Math.min(
            TOTAL_FRAMES - 1,
            Math.max(0, Math.floor(p * (TOTAL_FRAMES - 0.001)))
          );
          targetFrameRef.current = targetFrame;

          // Update chapter badge text dynamically
          let chapterText = "PART 01 / 03 · THE SALON";
          if (targetFrame < 120) {
            chapterText = "PART 01 / 03 · THE SALON";
          } else if (targetFrame < 240) {
            chapterText = "PART 02 / 03 · PRIVATE SUITES";
          } else {
            chapterText = "PART 03 / 03 · THE PENTHOUSE";
          }

          if (chapterPillTextRef.current) {
            chapterPillTextRef.current.innerText = chapterText;
          }

          // Update timeline hairline indicator
          if (progressLineRef.current) {
            progressLineRef.current.style.transform = `scaleY(${p})`;
          }

          // Narrative Overlay 1: 0%–20% (Part 1 - The Living Salon)
          if (overlay1Ref.current) {
            let opacity = 0;
            if (p <= 0.12) {
              opacity = 1 - p / 0.12;
            } else if (p <= 0.20) {
              opacity = Math.max(0, 1 - (p - 0.12) / 0.08);
            }
            overlay1Ref.current.style.opacity = `${opacity}`;
            overlay1Ref.current.style.transform = `translate3d(0, ${-p * 25}px, 0)`;
          }

          // Narrative Overlay 2: 36%–56% (Part 2 - Private Suites)
          if (overlay2Ref.current) {
            let opacity = 0;
            if (p >= 0.34 && p <= 0.42) {
              opacity = (p - 0.34) / 0.08;
            } else if (p > 0.42 && p <= 0.48) {
              opacity = 1;
            } else if (p > 0.48 && p <= 0.56) {
              opacity = Math.max(0, 1 - (p - 0.48) / 0.08);
            }
            overlay2Ref.current.style.opacity = `${opacity}`;
            overlay2Ref.current.style.transform = `translate3d(0, ${-(p - 0.45) * 25}px, 0)`;
          }

          // Narrative Overlay 3: 70%–92% (Part 3 - Crown Penthouse)
          if (overlay3Ref.current) {
            let opacity = 0;
            if (p >= 0.68 && p <= 0.76) {
              opacity = (p - 0.68) / 0.08;
            } else if (p > 0.76 && p <= 0.84) {
              opacity = 1;
            } else if (p > 0.84 && p <= 0.92) {
              opacity = Math.max(0, 1 - (p - 0.84) / 0.08);
            }
            overlay3Ref.current.style.opacity = `${opacity}`;
            overlay3Ref.current.style.transform = `translate3d(0, ${-(p - 0.80) * 25}px, 0)`;
          }
        },
      });
    }, container);

    return () => ctx.revert();
  }, [reducedMotion, scrollDistance]);

  if (reducedMotion) {
    return (
      <section
        id="residences-hero"
        className="relative w-full min-h-[90vh] flex items-center justify-center bg-[#141414] px-6 py-24"
      >
        <div className="max-w-4xl mx-auto text-center z-10">
          <span className="text-[11px] tracking-[0.35em] text-[#A8895C] uppercase font-sans mb-4 block">
            The Valmont Residences
          </span>
          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl tracking-[0.15em] font-light text-[#F5F1EA] uppercase mb-6">
            Private Estates
          </h1>
          <p className="text-sm md:text-base text-[#A39E93] max-w-lg mx-auto font-sans font-light tracking-wide leading-relaxed">
            Eighteen tailored residences crafted with acoustic seclusion, natural stone fireplaces, and panoramic parkland terraces.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section
      id="residences-hero"
      ref={containerRef}
      className="relative w-full h-screen h-[100dvh] bg-[#141414] overflow-hidden select-none"
    >
      {/* Instant Base Poster Frame (Guarantees zero black screen flash) */}
      <img
        src="/frames/desktop2/frame_0001.webp"
        alt="The Valmont Residences"
        className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none"
        loading="eager"
        onError={(e) => {
          e.currentTarget.src = "/frames/desktop/frame_0180.webp";
        }}
      />

      {/* Unified High-Resolution Canvas 2D frame display */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full object-cover z-0"
      />

      {/* Subtle minimal contrast overlay */}
      <div className="absolute inset-0 bg-[#141414]/5 pointer-events-none z-10" />

      {/* Narrative Overlay 1: 0%–20% (Entrance & Living Salon) */}
      <div
        ref={overlay1Ref}
        className="absolute inset-0 z-20 flex flex-col items-center justify-center px-6 text-center pointer-events-none will-change-transform"
        style={{ opacity: 1 }}
      >
        <div className="max-w-4xl mx-auto">
          <span className="text-[10px] md:text-[11px] tracking-[0.35em] text-[#A8895C] uppercase font-sans mb-4 block font-medium drop-shadow-md">
            Part 01 · The Great Living Salon
          </span>
          <h1 className="font-serif text-5xl sm:text-6xl md:text-8xl tracking-[0.18em] font-light text-[#F5F1EA] uppercase leading-none mb-6 drop-shadow-lg">
            Spatial Harmony
          </h1>
          <div className="w-12 h-[1px] bg-[#A8895C] mx-auto mb-6 opacity-80 shadow-sm" />
          <p className="text-xs md:text-sm tracking-[0.25em] text-[#F5F1EA]/80 uppercase font-sans font-light max-w-md mx-auto drop-shadow-md">
            3.4m ceiling volumes & monolithic stone fireplaces
          </p>
        </div>
      </div>

      {/* Narrative Overlay 2: 36%–56% (Joinery & Private Suites) */}
      <div
        ref={overlay2Ref}
        className="absolute inset-0 z-20 flex flex-col items-start justify-center px-8 md:px-20 lg:px-28 pointer-events-none will-change-transform"
        style={{ opacity: 0 }}
      >
        <div className="max-w-xl text-left bg-[#141414]/85 p-8 md:p-10 border border-[rgba(245,241,234,0.12)] backdrop-blur-md">
          <span className="text-[10px] md:text-[11px] tracking-[0.3em] text-[#A8895C] uppercase font-sans mb-3 block font-medium">
            Part 02 · Joinery & Stone Masonry
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl tracking-[0.12em] font-light text-[#F5F1EA] uppercase leading-tight mb-4">
            Bespoke Rift-Sawn Oak & Marble
          </h2>
          <div className="w-10 h-[1px] bg-[#A8895C] mb-5 opacity-60" />
          <p className="text-xs md:text-sm text-[#A39E93] font-sans font-light leading-relaxed tracking-wide">
            Full-height pocket doors, Calacatta Monet slabs, and Poliform architectural millwork engineered for tactile serenity.
          </p>
        </div>
      </div>

      {/* Narrative Overlay 3: 70%–92% (The Crown Penthouse) */}
      <div
        ref={overlay3Ref}
        className="absolute inset-0 z-20 flex flex-col items-end justify-center px-8 md:px-20 lg:px-28 pointer-events-none will-change-transform text-right"
        style={{ opacity: 0 }}
      >
        <div className="max-w-xl text-right bg-[#141414]/85 p-8 md:p-10 border border-[rgba(245,241,234,0.12)] backdrop-blur-md">
          <span className="text-[10px] md:text-[11px] tracking-[0.3em] text-[#A8895C] uppercase font-sans mb-3 block font-medium">
            Part 03 · The Crown Estates
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl tracking-[0.12em] font-light text-[#F5F1EA] uppercase leading-tight mb-4">
            Private Rooftop Loggias & Sky Pools
          </h2>
          <div className="w-10 h-[1px] bg-[#A8895C] ml-auto mb-5 opacity-60" />
          <p className="text-xs md:text-sm text-[#A39E93] font-sans font-light leading-relaxed tracking-wide">
            Triplex penthouses featuring private 12m basalt rooftop swimming pools, internal glass elevators, and 360-degree skyline panoramas.
          </p>
        </div>
      </div>

      {/* Floating Chapter Pill Indicator (Top-Right) */}
      <div className="absolute top-6 right-8 md:right-12 z-30 flex items-center space-x-2.5 text-[9px] tracking-[0.25em] font-mono text-[#A8895C] uppercase bg-[#141414]/85 px-4 py-2 border border-[rgba(245,241,234,0.15)] shadow-2xl backdrop-blur-md">
        <span className="w-1.5 h-1.5 bg-[#A8895C] rounded-full animate-pulse" />
        <span ref={chapterPillTextRef}>PART 01 / 03 · THE SALON</span>
      </div>

      {/* Left-side Hairline Scroll Progress Bar */}
      <div className="absolute left-8 md:left-12 top-1/2 -translate-y-1/2 h-36 w-[1px] bg-[rgba(245,241,234,0.15)] z-20 hidden md:block">
        <div
          ref={progressLineRef}
          className="w-full h-full bg-[#A8895C] origin-top will-change-transform"
          style={{ transform: "scaleY(0)" }}
        />
      </div>

      {/* Bottom Scroll Cue */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center pointer-events-none">
        <span className="text-[9px] tracking-[0.3em] text-[#A8895C] uppercase font-sans mb-2 font-medium drop-shadow-md">
          Scroll To Tour Estates
        </span>
        <div className="w-[1px] h-6 bg-[rgba(168,137,92,0.4)] relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[#A8895C] animate-pulse" />
        </div>
      </div>
    </section>
  );
}
