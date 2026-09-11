"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface OverlayItem {
  range: [number, number]; // [startProgress, endProgress] between 0 and 1
  eyebrow: string;
  title: string;
  copy: string;
  align?: "left" | "center" | "right";
}

interface ScrollZoomFrameProps {
  startFrame: number; // 1-indexed (e.g. 1)
  endFrame: number; // 1-indexed (e.g. 120)
  title?: string;
  eyebrow?: string;
  overlays?: OverlayItem[];
  zoomIntensity?: number; // e.g. 1.15
  scrollDistance?: string; // e.g. "250%"
}

export default function ScrollZoomFrame({
  startFrame,
  endFrame,
  overlays = [],
  zoomIntensity = 1.15,
  scrollDistance = "260%",
}: ScrollZoomFrameProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayContainerRef = useRef<HTMLDivElement>(null);
  const imagesRef = useRef<(HTMLImageElement | null)[]>([]);
  const currentDrawnFrameRef = useRef<number>(-1);
  const targetFrameRef = useRef<number>(0);
  const currentScaleRef = useRef<number>(1);
  const isVisibleRef = useRef<boolean>(true);
  const isMobileRef = useRef<boolean>(false);
  const [activeOverlayIndex, setActiveOverlayIndex] = useState<number>(-1);
  const [activeOverlayOpacity, setActiveOverlayOpacity] = useState<number>(0);

  const totalRangeFrames = Math.max(1, endFrame - startFrame + 1);

  // Format frame path: always use /frames/desktop/frame_0001.webp
  const getFrameSrc = useCallback((frameNum: number) => {
    const formatted = String(frameNum).padStart(4, "0");
    return `/frames/desktop/frame_${formatted}.webp`;
  }, []);

  const drawFrame = useCallback(
    (relIndex: number, currentScale = 1) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d", { alpha: false });
      if (!ctx) return;

      const img = imagesRef.current[relIndex];
      if (!img || !img.complete || img.naturalWidth === 0) {
        return;
      }

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";

      const cw = canvas.width;
      const ch = canvas.height;
      const imgRatio = img.naturalWidth / img.naturalHeight;
      const canvasRatio = cw / ch;

      let drawW = cw * currentScale;
      let drawH = ch * currentScale;

      if (canvasRatio > imgRatio) {
        drawH = (cw / imgRatio) * currentScale;
      } else {
        drawW = ch * imgRatio * currentScale;
      }

      const offsetX = (cw - drawW) / 2;
      const offsetY = (ch - drawH) / 2;

      ctx.drawImage(img, offsetX, offsetY, drawW, drawH);
    },
    []
  );

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = canvas.parentElement?.clientWidth || window.innerWidth;
    const height = canvas.parentElement?.clientHeight || window.innerHeight;

    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    const frameToDraw = currentDrawnFrameRef.current >= 0 ? currentDrawnFrameRef.current : 0;
    drawFrame(frameToDraw, currentScaleRef.current);
  }, [drawFrame]);

  // Decoupled rAF render loop with Nearest Available Frame Fallback
  useEffect(() => {
    let animId: number;

    const findClosestAvailableFrame = (target: number): number => {
      const direct = imagesRef.current[target];
      if (direct && direct.complete && direct.naturalWidth > 0) return target;

      for (let i = target - 1; i >= 0; i--) {
        const img = imagesRef.current[i];
        if (img && img.complete && img.naturalWidth > 0) return i;
      }

      for (let i = target + 1; i < totalRangeFrames; i++) {
        const img = imagesRef.current[i];
        if (img && img.complete && img.naturalWidth > 0) return i;
      }

      return 0;
    };

    const renderLoop = () => {
      if (isVisibleRef.current) {
        const target = targetFrameRef.current;
        const bestFrame = findClosestAvailableFrame(target);
        if (bestFrame !== currentDrawnFrameRef.current) {
          currentDrawnFrameRef.current = bestFrame;
          drawFrame(bestFrame, currentScaleRef.current);
        }
      }
      animId = requestAnimationFrame(renderLoop);
    };

    animId = requestAnimationFrame(renderLoop);

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [drawFrame, totalRangeFrames]);

  // Preload frame range with async GPU decoding
  useEffect(() => {
    isMobileRef.current = window.innerWidth < 768;
    let isCancelled = false;

    imagesRef.current = new Array(totalRangeFrames).fill(null);

    const loadSingleImage = (relIdx: number) => {
      return new Promise<void>((resolve) => {
        const frameNum = startFrame + relIdx;
        const img = new Image();
        img.src = getFrameSrc(frameNum);

        const onDone = () => {
          if (isCancelled) return;
          imagesRef.current[relIdx] = img;
          if (relIdx === 0 && currentDrawnFrameRef.current < 0) {
            currentDrawnFrameRef.current = 0;
            targetFrameRef.current = 0;
            drawFrame(0, 1);
          }
          resolve();
        };

        img.onload = () => {
          onDone();
        };

        img.onerror = () => {
          onDone();
        };
      });
    };

    const loadSequence = async () => {
      // Step 1: Instant load first frame for 0ms initial render
      await loadSingleImage(0);
      if (isCancelled) return;

      // Step 2: High-throughput concurrent worker pool (20 parallel streams)
      const CONCURRENCY = 20;
      let currentIndex = 1;

      const worker = async () => {
        while (currentIndex < totalRangeFrames && !isCancelled) {
          const indexToFetch = currentIndex++;
          await loadSingleImage(indexToFetch);
        }
      };

      const pool = Array.from({ length: CONCURRENCY }, () => worker());
      await Promise.all(pool);
    };

    loadSequence();

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    return () => {
      isCancelled = true;
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [drawFrame, getFrameSrc, resizeCanvas, startFrame, totalRangeFrames]);

  // IntersectionObserver
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

  // GSAP ScrollTrigger: Direct 1-to-1 sync with Lenis smooth scroll
  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: container,
        start: "top top",
        end: `+=${scrollDistance}`,
        pin: true,
        scrub: true,
        anticipatePin: 1,
        onUpdate: (self) => {
          if (!isVisibleRef.current) return;

          const progress = self.progress;
          const relFrame = Math.min(
            totalRangeFrames - 1,
            Math.max(0, Math.floor(progress * (totalRangeFrames - 0.001)))
          );
          currentScaleRef.current = 1 + (zoomIntensity - 1) * progress;
          targetFrameRef.current = relFrame;

          // Overlays evaluation
          if (overlays.length > 0) {
            let matchedIndex = -1;
            let matchedOpacity = 0;

            for (let idx = 0; idx < overlays.length; idx++) {
              const [start, end] = overlays[idx].range;
              if (progress >= start && progress <= end) {
                matchedIndex = idx;
                const rangeLength = end - start;
                const mid = start + rangeLength / 2;
                if (progress < mid) {
                  matchedOpacity = (progress - start) / (rangeLength / 2);
                } else {
                  matchedOpacity = (end - progress) / (rangeLength / 2);
                }
                break;
              }
            }

            setActiveOverlayIndex(matchedIndex);
            setActiveOverlayOpacity(Math.min(1, Math.max(0, matchedOpacity)));
          }
        },
      });
    }, container);

    return () => ctx.revert();
  }, [overlays, scrollDistance, totalRangeFrames, zoomIntensity]);

  const currentOverlay =
    activeOverlayIndex >= 0 ? overlays[activeOverlayIndex] : null;

  return (
    <div
      ref={containerRef}
      className="relative w-full h-screen h-[100dvh] bg-[#141414] overflow-hidden select-none border-y border-[rgba(245,241,234,0.12)]"
    >
      {/* High-Resolution Canvas frame */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full object-cover z-0"
      />

      {/* Subtle minimal contrast overlay */}
      <div className="absolute inset-0 bg-[#141414]/5 pointer-events-none z-10" />

      {/* Synchronized Pinned Overlay Narrative */}
      {currentOverlay && (
        <div
          ref={overlayContainerRef}
          className={`absolute inset-0 z-20 flex flex-col justify-center px-8 md:px-20 pointer-events-none transition-opacity duration-200 ${
            currentOverlay.align === "right"
              ? "items-end text-right"
              : currentOverlay.align === "center"
              ? "items-center text-center"
              : "items-start text-left"
          }`}
          style={{ opacity: activeOverlayOpacity }}
        >
          <div className="max-w-xl bg-[#141414]/85 p-8 md:p-10 border border-[rgba(245,241,234,0.12)]">
            <span className="text-[10px] md:text-[11px] tracking-[0.3em] text-[#A8895C] uppercase font-sans mb-3 block font-medium">
              {currentOverlay.eyebrow}
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl md:text-4xl tracking-[0.08em] font-light text-[#F5F1EA] uppercase leading-tight mb-4">
              {currentOverlay.title}
            </h3>
            <div
              className={`w-10 h-[1px] bg-[#A8895C] mb-4 opacity-60 ${
                currentOverlay.align === "right"
                  ? "ml-auto"
                  : currentOverlay.align === "center"
                  ? "mx-auto"
                  : ""
              }`}
            />
            <p className="text-xs md:text-sm text-[#A39E93] font-sans font-light leading-relaxed tracking-wide">
              {currentOverlay.copy}
            </p>
          </div>
        </div>
      )}

      {/* Bottom Section Frame Indicator */}
      <div className="absolute bottom-6 right-8 z-20 flex items-center space-x-3 text-[9px] tracking-[0.25em] text-[#A8895C] uppercase font-mono bg-[#141414]/80 px-3 py-1 border border-[rgba(245,241,234,0.1)]">
        <span>Frame Sequence {String(startFrame).padStart(3, "0")}–{String(endFrame).padStart(3, "0")}</span>
        <span className="w-1.5 h-1.5 bg-[#A8895C]" />
      </div>
    </div>
  );
}
