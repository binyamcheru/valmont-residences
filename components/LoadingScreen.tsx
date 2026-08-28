"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";

interface LoadingScreenProps {
  onIntroComplete?: () => void;
}

export default function LoadingScreen({ onIntroComplete }: LoadingScreenProps) {
  const [shouldRender, setShouldRender] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const curtainTopRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const eyebrowRef = useRef<HTMLDivElement>(null);
  const titleLettersRef = useRef<(HTMLSpanElement | null)[]>([]);
  const lineRef = useRef<HTMLDivElement>(null);
  const taglineRef = useRef<HTMLDivElement>(null);
  const locationRef = useRef<HTMLDivElement>(null);

  // Lock scroll while intro is playing
  useEffect(() => {
    if (shouldRender) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [shouldRender]);

  // Cinematic GSAP Welcome & Intro Animation
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          setShouldRender(false);
          onIntroComplete?.();
        },
      });

      // Initial state
      gsap.set([logoRef.current, eyebrowRef.current, lineRef.current, taglineRef.current, locationRef.current], {
        opacity: 0,
      });
      gsap.set(logoRef.current, { y: -40, scale: 0.9 });
      gsap.set(eyebrowRef.current, { y: -30, letterSpacing: "0.2em" });
      gsap.set(titleLettersRef.current, { y: -60, opacity: 0, rotateX: -45 });
      gsap.set(lineRef.current, { scaleX: 0, transformOrigin: "center" });
      gsap.set(taglineRef.current, { y: 20, opacity: 0 });
      gsap.set(locationRef.current, { y: 15, opacity: 0 });

      // Step 1: Architectural Emblem descends gracefully (0.0s - 0.9s)
      tl.to(logoRef.current, {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.9,
        ease: "power3.out",
      })

      // Step 2: Eyebrow "Ashcombe Developers Presents" falls into place (0.4s)
      .to(
        eyebrowRef.current,
        {
          y: 0,
          opacity: 1,
          letterSpacing: "0.45em",
          duration: 0.8,
          ease: "power3.out",
        },
        "-=0.5"
      )

      // Step 3: "THE BELMOOR" characters stagger-fall from above with gold shimmer (0.8s)
      .to(
        titleLettersRef.current,
        {
          y: 0,
          opacity: 1,
          rotateX: 0,
          duration: 0.8,
          stagger: 0.04,
          ease: "back.out(1.4)",
        },
        "-=0.4"
      )

      // Step 4: Brushed gold accent line expands outward (1.3s)
      .to(
        lineRef.current,
        {
          scaleX: 1,
          opacity: 0.8,
          duration: 0.7,
          ease: "expo.out",
        },
        "-=0.3"
      )

      // Step 5: Tagline & Mayfair Location float up gracefully (1.6s)
      .to(
        [taglineRef.current, locationRef.current],
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: "power2.out",
        },
        "-=0.3"
      )

      // Step 6: Luxury Hold (~1.4s hold while user absorbs brand presentation & background buffer fills)
      .to({}, { duration: 1.2 })

      // Step 7: Text elements lift upwards gracefully (3.4s)
      .to(
        [logoRef.current, eyebrowRef.current, titleLettersRef.current, lineRef.current, taglineRef.current, locationRef.current],
        {
          y: -30,
          opacity: 0,
          stagger: 0.02,
          duration: 0.6,
          ease: "power2.in",
        }
      )

      // Step 8: Theatrical Curtain Reveal — Seamlessly lifts upwards revealing estate (3.8s - 4.5s)
      .to(
        curtainTopRef.current,
        {
          yPercent: -100,
          duration: 1.0,
          ease: "power4.inOut",
        },
        "-=0.2"
      );
    }, container);

    return () => ctx.revert();
  }, [onIntroComplete]);

  if (!shouldRender) return null;

  const titleText = "THE VALMONT";

  return (
    <div
      ref={containerRef}
      aria-hidden={!shouldRender}
      className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none select-none overflow-hidden"
    >
      {/* Seamless Fullscreen Solid Curtain Backdrop (No middle seam/lines) */}
      <div
        ref={curtainTopRef}
        className="absolute inset-0 bg-[#0D0D0D] z-0"
      >
        {/* Ambient center gold glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(168,137,92,0.08)_0%,transparent_65%)] pointer-events-none" />
      </div>

      {/* Center Cinematic Content */}
      <div className="relative z-10 flex flex-col items-center max-w-xl w-full px-6 text-center">
        {/* Architectural Monogram Emblem */}
        <div ref={logoRef} className="mb-6 relative will-change-transform">
          <svg
            className="w-14 h-14 md:w-16 md:h-16 text-[#A8895C]"
            viewBox="0 0 512 512"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect width="512" height="512" rx="108" fill="#181818" stroke="#A8895C" strokeWidth="10" opacity="0.75" />
            <g transform="translate(256, 256)" stroke="#A8895C" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round">
              <path d="M -110 130 L -110 -20 A 110 110 0 0 1 110 -20 L 110 130" />
              <polygon points="0,-145 10,-130 0,-115 -10,-130" fill="#A8895C" stroke="none" />
              <line x1="-55" y1="-75" x2="-55" y2="105" strokeWidth="18" />
              <path d="M -55 -75 L 0 -75 C 40 -75 40 10 -55 10" />
              <path d="M -55 10 L 10 10 C 55 10 55 105 -55 105" />
              <line x1="-125" y1="130" x2="125" y2="130" strokeWidth="14" />
            </g>
          </svg>
        </div>

        {/* Developer Eyebrow */}
        <div ref={eyebrowRef} className="will-change-transform mb-3">
          <span className="text-[10px] sm:text-[11px] tracking-[0.45em] text-[#A8895C] uppercase font-sans font-medium">
            Valmont & Co. Estates Presents
          </span>
        </div>

        {/* Falling Grand Title: "THE VALMONT" */}
        <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl tracking-[0.18em] font-light text-[#F5F1EA] uppercase leading-none mb-5 flex justify-center overflow-hidden">
          {"THE VALMONT".split("").map((char, index) => (
            <span
              key={index}
              ref={(el) => {
                titleLettersRef.current[index] = el;
              }}
              className="inline-block will-change-transform"
              style={{ whiteSpace: char === " " ? "pre" : "normal" }}
            >
              {char}
            </span>
          ))}
        </h1>

        {/* Expanding Brushed Gold Line */}
        <div
          ref={lineRef}
          className="w-24 sm:w-32 h-[1px] bg-[#A8895C] mx-auto mb-5 will-change-transform"
        />

        {/* Architectural Tagline */}
        <div ref={taglineRef} className="will-change-transform mb-2">
          <p className="text-xs sm:text-sm tracking-[0.3em] text-[#F5F1EA]/90 uppercase font-sans font-light">
            A Limited Collection of Private Parkland Estates
          </p>
        </div>

        {/* Location Subtitle */}
        <div ref={locationRef} className="will-change-transform">
          <span className="text-[9px] sm:text-[10px] tracking-[0.35em] text-[#A39E93] uppercase font-sans font-light">
            Mayfair &bull; London
          </span>
        </div>
      </div>
    </div>
  );
}
