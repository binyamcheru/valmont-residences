"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function IntroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const textColRef = useRef<HTMLDivElement>(null);
  const imageColRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const textCol = textColRef.current;
    const imageCol = imageColRef.current;
    if (!section || !textCol || !imageCol) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        textCol,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: section,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        }
      );

      gsap.fromTo(
        imageCol,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1.4,
          delay: 0.15,
          ease: "power2.out",
          scrollTrigger: {
            trigger: section,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="philosophy"
      ref={sectionRef}
      className="relative w-full bg-[#141414] py-32 md:py-48 px-6 md:px-12 lg:px-20 border-t border-[rgba(245,241,234,0.12)]"
    >
      <div className="max-w-7xl mx-auto">
        {/* Eyebrow and Section Marker */}
        <div className="flex items-center space-x-4 mb-16 md:mb-24">
          <span className="text-[10px] tracking-[0.35em] text-[#A8895C] uppercase font-sans font-medium">
            01 / Architecture & Vision
          </span>
          <div className="h-[1px] w-16 bg-[#A8895C]/40" />
        </div>

        {/* Asymmetrical Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Text Content Column (7 cols) */}
          <div ref={textColRef} className="lg:col-span-7 flex flex-col space-y-8 pr-0 lg:pr-8">
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-[0.08em] font-light text-[#F5F1EA] uppercase leading-[1.15]">
              Formulated with restraint. <br />
              <span className="italic text-[#A8895C] font-normal">Rooted in permanence.</span>
            </h2>

            <div className="w-16 h-[1px] bg-[#A8895C]/60 my-2" />

            <div className="space-y-6 text-sm md:text-base text-[#A39E93] font-sans font-light leading-relaxed tracking-wide">
              <p>
                The Valmont Residences represents Valmont & Co. Estates&apos; commitment to quiet, enduring architecture. Situated within secluded private grounds, the building was designed from the inside out — privileging natural daylight, generous spatial proportions, and acoustic solitude above all else.
              </p>
              <p>
                Every material has been selected for its tactile honesty and longevity: fluted limestone façades, monolithic bronze joinery, and wide-plank European timber floors that settle gracefully with time. The result is an environment that requires no embellishment, designed for those who appreciate considered proportion and calm precision.
              </p>
            </div>

            {/* Subtle Metrics / Key Values */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-[rgba(245,241,234,0.12)]">
              <div>
                <span className="block font-serif text-2xl md:text-3xl text-[#F5F1EA] font-light">
                  18
                </span>
                <span className="text-[9px] tracking-[0.25em] text-[#A8895C] uppercase font-sans">
                  Exclusive Residences
                </span>
              </div>
              <div>
                <span className="block font-serif text-2xl md:text-3xl text-[#F5F1EA] font-light">
                  3.4m
                </span>
                <span className="text-[9px] tracking-[0.25em] text-[#A8895C] uppercase font-sans">
                  Ceiling Clearances
                </span>
              </div>
              <div>
                <span className="block font-serif text-2xl md:text-3xl text-[#F5F1EA] font-light">
                  100%
                </span>
                <span className="text-[9px] tracking-[0.25em] text-[#A8895C] uppercase font-sans">
                  Private Park Frontage
                </span>
              </div>
            </div>
          </div>

          {/* Architectural Still Image Column (5 cols, offset) */}
          <div
            ref={imageColRef}
            className="lg:col-span-5 relative mt-4 lg:mt-12 group"
          >
            <div className="relative w-full aspect-[4/5] bg-[#1A1A1A] border border-[rgba(245,241,234,0.15)] overflow-hidden">
              <Image
                src="/frames/desktop/frame_0045.webp"
                alt="The Valmont Architectural Façade and Lobby Volume"
                fill
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                sizes="(max-width: 1024px) 100vw, 40vw"
              />
              {/* Flat dark vignette overlay */}
              <div className="absolute inset-0 bg-[#141414]/15 pointer-events-none" />
            </div>

            <div className="mt-4 flex justify-between items-center text-[9px] tracking-[0.25em] text-[#A39E93] uppercase font-mono">
              <span>Plate 01 — Atrium Ingress</span>
              <span className="text-[#A8895C]">Valmont Archival</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
