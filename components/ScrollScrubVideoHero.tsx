"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface ScrollScrubVideoHeroProps {
  desktopParts?: string[];
  mobileParts?: string[];
  desktopSrc?: string;
  mobileSrc?: string;
  posterSrc?: string;
  scrollDistance?: string; // e.g. "450%"
}

const DEFAULT_DESKTOP_PARTS = [
  "/video/hero_desktop_part1.mp4",
  "/video/hero_desktop_part2.mp4",
  "/video/hero_desktop_part3.mp4",
];

const DEFAULT_MOBILE_PARTS = [
  "/video/hero_mobile_part1.mp4",
  "/video/hero_mobile_part2.mp4",
  "/video/hero_mobile_part3.mp4",
];

export default function ScrollScrubVideoHero({
  desktopParts = DEFAULT_DESKTOP_PARTS,
  mobileParts = DEFAULT_MOBILE_PARTS,
  desktopSrc,
  mobileSrc,
  posterSrc = "/frames/desktop/frame_0001.webp",
  scrollDistance = "450%",
}: ScrollScrubVideoHeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const progressLineRef = useRef<HTMLDivElement>(null);

  const overlay1Ref = useRef<HTMLDivElement>(null);
  const overlay2Ref = useRef<HTMLDivElement>(null);
  const overlay3Ref = useRef<HTMLDivElement>(null);

  const [isVideoReady, setIsVideoReady] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const activePartIndexRef = useRef(0);
  const isVisibleRef = useRef<boolean>(true);

  // Normalize parts (support legacy single src or array of parts)
  const resolvedDesktop = desktopParts.length > 0 ? desktopParts : desktopSrc ? [desktopSrc] : DEFAULT_DESKTOP_PARTS;
  const resolvedMobile = mobileParts.length > 0 ? mobileParts : mobileSrc ? [mobileSrc] : DEFAULT_MOBILE_PARTS;

  const [currentParts, setCurrentParts] = useState<string[]>(resolvedDesktop);
  const [blobUrls, setBlobUrls] = useState<string[]>([]);

  // Switch video parts based on viewport width
  const updateVideoSource = useCallback(() => {
    if (typeof window === "undefined") return;
    const isMobile = window.innerWidth < 768;
    const nextParts = isMobile ? resolvedMobile : resolvedDesktop;
    setCurrentParts((prev) => {
      if (prev.length === nextParts.length && prev.every((v, i) => v === nextParts[i])) {
        return prev;
      }
      return nextParts;
    });
  }, [resolvedDesktop, resolvedMobile]);

  useEffect(() => {
    const isReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setReducedMotion(isReduced);

    updateVideoSource();
    window.addEventListener("resize", updateVideoSource);
    return () => window.removeEventListener("resize", updateVideoSource);
  }, [updateVideoSource]);

  // In-Memory Blob Prefetching: Downloads video chunks once into RAM.
  // This completely eliminates HTTP 206 Range requests during scroll scrubbing.
  useEffect(() => {
    let isMounted = true;
    const createdUrls: string[] = [];

    const loadBlobs = async () => {
      for (let i = 0; i < currentParts.length; i++) {
        const src = currentParts[i];
        try {
          const res = await fetch(src);
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          const blob = await res.blob();
          if (!isMounted) return;

          const url = URL.createObjectURL(blob);
          createdUrls.push(url);

          // Update video source to blob in DOM for instant RAM seeking
          const vid = videoRefs.current[i];
          if (vid) {
            const prevTime = vid.currentTime || 0.001;
            vid.src = url;
            vid.currentTime = prevTime;
          }
        } catch {
          // If blob fetch fails, keep native static src fallback
        }
      }
    };

    loadBlobs();

    return () => {
      isMounted = false;
      createdUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [currentParts]);

  // Pause updates when hero is out of view
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

  // Multi-part ScrollTrigger Scrubbing with direct DOM and smooth seeks
  useEffect(() => {
    if (reducedMotion) return;
    const container = containerRef.current;
    if (!container) return;

    const numParts = currentParts.length;
    if (numParts === 0) return;

    let st: ScrollTrigger | null = null;
    let cancelled = false;

    // Warm-up and preload all video elements immediately
    videoRefs.current.forEach((vid) => {
      if (vid) {
        vid.muted = true;
        vid.playsInline = true;
        vid.preload = "auto";
      }
    });

    const primaryVideo = videoRefs.current[0];
    if (!primaryVideo) return;

    const setup = () => {
      if (cancelled) return;

      try {
        if (primaryVideo.currentTime === 0) {
          primaryVideo.currentTime = 0.001;
        }
      } catch {
        // Ignore seek error during initial render
      }

      st = ScrollTrigger.create({
        trigger: container,
        start: "top top",
        end: `+=${scrollDistance}`,
        pin: true,
        scrub: true,
        anticipatePin: 1,
        onUpdate: (self) => {
          if (!isVisibleRef.current) return;

          const progress = self.progress;
          const partDuration = 1 / numParts;

          // Determine which video chunk is active
          let partIdx = Math.floor(progress / partDuration);
          if (partIdx >= numParts) partIdx = numParts - 1;

          // Calculate local progress inside the active chunk (0.0 to 1.0)
          const localProgress = Math.min(
            1,
            Math.max(0, (progress - partIdx * partDuration) / partDuration)
          );

          // Direct DOM opacity swap without triggering React re-renders
          if (activePartIndexRef.current !== partIdx) {
            activePartIndexRef.current = partIdx;
            videoRefs.current.forEach((vid, idx) => {
              if (vid) {
                if (idx === partIdx) {
                  vid.style.opacity = "1";
                  vid.style.pointerEvents = "auto";
                } else {
                  vid.style.opacity = "0";
                  vid.style.pointerEvents = "none";
                }
              }
            });
          }

          // Seek the active video element
          const activeVideo = videoRefs.current[partIdx];
          if (activeVideo && activeVideo.duration && !isNaN(activeVideo.duration)) {
            const targetTime = Math.min(
              activeVideo.duration - 0.05,
              Math.max(0, localProgress * activeVideo.duration)
            );

            // Avoid thrashing seek if already close enough (< 30ms difference)
            if (Math.abs(activeVideo.currentTime - targetTime) > 0.03) {
              try {
                activeVideo.currentTime = targetTime;
              } catch {
                // Ignore seek collisions during momentum scrolling
              }
            }
          }

          // Update progress hairline indicator
          if (progressLineRef.current) {
            progressLineRef.current.style.transform = `scaleY(${progress})`;
          }

          // Narrative Overlay 1 (0%–18% — Arrival & Gate)
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

          // Narrative Overlay 2 (35%–55% — Lobby & Amenities)
          if (overlay2Ref.current) {
            let opacity = 0;
            if (progress >= 0.3 && progress <= 0.4) {
              opacity = (progress - 0.3) / 0.1;
            } else if (progress > 0.4 && progress <= 0.48) {
              opacity = 1;
            } else if (progress > 0.48 && progress <= 0.58) {
              opacity = Math.max(0, 1 - (progress - 0.48) / 0.1);
            }
            overlay2Ref.current.style.opacity = `${opacity}`;
            overlay2Ref.current.style.transform = `translate3d(0, ${-(progress - 0.44) * 25}px, 0)`;
          }

          // Narrative Overlay 3 (75%–95% — Residence & Horizons)
          if (overlay3Ref.current) {
            let opacity = 0;
            if (progress >= 0.7 && progress <= 0.8) {
              opacity = (progress - 0.7) / 0.1;
            } else if (progress > 0.8 && progress <= 0.88) {
              opacity = 1;
            } else if (progress > 0.88 && progress <= 0.98) {
              opacity = Math.max(0, 1 - (progress - 0.88) / 0.1);
            }
            overlay3Ref.current.style.opacity = `${opacity}`;
            overlay3Ref.current.style.transform = `translate3d(0, ${-(progress - 0.84) * 25}px, 0)`;
          }
        },
      });

      setIsVideoReady(true);
      ScrollTrigger.refresh();
    };

    if (primaryVideo.readyState >= 1 && primaryVideo.duration) {
      setup();
    } else {
      primaryVideo.addEventListener("loadedmetadata", setup, { once: true });
      primaryVideo.load();
    }

    return () => {
      cancelled = true;
      primaryVideo.removeEventListener("loadedmetadata", setup);
      if (st) st.kill();
    };
  }, [currentParts, reducedMotion, scrollDistance]);

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
      {/* High-Resolution Instant Base Poster (Prevents any black screen flash) */}
      <img
        src={posterSrc}
        alt="The Valmont Estate"
        className="absolute inset-0 w-full h-full object-cover z-0"
        loading="eager"
      />

      {/* Layered Multi-Part Video Elements for Fast Chunked Streaming */}
      {currentParts.map((src, index) => (
        <video
          key={src}
          ref={(el) => {
            videoRefs.current[index] = el;
          }}
          src={src}
          poster={index === 0 ? posterSrc : undefined}
          muted
          playsInline
          preload="auto"
          disablePictureInPicture
          disableRemotePlayback
          className="absolute inset-0 w-full h-full object-cover z-0 transition-opacity duration-150"
          style={{
            opacity: index === 0 ? 1 : 0,
            pointerEvents: index === 0 ? "auto" : "none",
          }}
        />
      ))}

      {/* Subtle flat dark contrast overlay */}
      <div className="absolute inset-0 bg-[#141414]/5 pointer-events-none z-10" />

      {/* Minimal buffering cue if first chunk hasn't resolved */}
      {!isVideoReady && (
        <div className="absolute top-6 left-1/2 -translate-x-1/2 z-30 flex items-center space-x-2 text-[9px] tracking-[0.25em] font-mono text-[#A8895C] uppercase bg-[#141414]/80 px-3 py-1 border border-[rgba(245,241,234,0.1)]">
          <span className="w-1.5 h-1.5 bg-[#A8895C] animate-pulse" />
          <span>Initializing Experience</span>
        </div>
      )}

      {/* Narrative Overlay 1: 0%–18% (Arrival & Gate) */}
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

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center space-y-2 pointer-events-none opacity-60">
        <span className="text-[9px] tracking-[0.3em] uppercase text-[#F5F1EA] font-sans font-light">
          Scroll to Explore
        </span>
        <div className="w-[1px] h-6 bg-[rgba(245,241,234,0.3)] animate-pulse" />
      </div>
    </section>
  );
}