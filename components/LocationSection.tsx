"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

interface Landmark {
  name: string;
  category: string;
  distance: string;
  transit: string;
}

const LANDMARKS: Landmark[] = [
  {
    name: "The Royal Botanic Reserve & Arboretum",
    category: "Nature & Parkland",
    distance: "0.2 Miles",
    transit: "4-minute direct garden walk",
  },
  {
    name: "The National Opera & Arts Pavilion",
    category: "Culture & Performance",
    distance: "0.6 Miles",
    transit: "8-minute stroll",
  },
  {
    name: "Belgravia Culinary Row & Private Clubs",
    category: "Gastronomy",
    distance: "0.4 Miles",
    transit: "6-minute walk",
  },
  {
    name: "Metropolitan Private Aviation Heliport",
    category: "Transit",
    distance: "6.8 Miles",
    transit: "12-minute private chauffeur",
  },
];

export default function LocationSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const map = mapRef.current;
    const list = listRef.current;
    if (!section || !map || !list) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        map,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 1.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: section,
            start: "top 75%",
            toggleActions: "play none none reverse",
          },
        }
      );

      gsap.fromTo(
        list,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 1.1,
          delay: 0.15,
          ease: "power2.out",
          scrollTrigger: {
            trigger: section,
            start: "top 75%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="location"
      ref={sectionRef}
      className="relative w-full bg-[#141414] py-32 md:py-44 px-6 md:px-12 lg:px-20 border-t border-[rgba(245,241,234,0.12)]"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 pb-8 border-b border-[rgba(245,241,234,0.12)]">
          <div>
            <span className="text-[10px] tracking-[0.35em] text-[#A8895C] uppercase font-sans font-medium mb-3 block">
              04 / Setting & Environs
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-[0.08em] font-light text-[#F5F1EA] uppercase leading-none">
              The Enclave
            </h2>
          </div>
          <p className="mt-4 md:mt-0 text-xs md:text-sm text-[#A39E93] font-sans font-light max-w-sm tracking-wide">
            Nestled directly against the western tree line, offering secluded privacy within moments of the capital&apos;s celebrated cultural institutions.
          </p>
        </div>

        {/* Location Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
          {/* Custom Styled Architectural Map Graphic (7 cols) */}
          <div
            ref={mapRef}
            className="lg:col-span-7 bg-[#1A1A1A] border border-[rgba(245,241,234,0.12)] p-6 sm:p-8 flex flex-col justify-between relative min-h-[440px] overflow-hidden"
          >
            {/* Minimalist Vector Grid / Street Geometry */}
            <svg
              className="absolute inset-0 w-full h-full stroke-[rgba(245,241,234,0.07)] stroke-[1] fill-none pointer-events-none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Parkland boundary */}
              <path
                d="M-50,120 Q180,90 320,240 T700,200"
                stroke="rgba(168, 137, 92, 0.15)"
                strokeDasharray="4 4"
              />
              {/* Street grid */}
              <line x1="10%" y1="0" x2="10%" y2="100%" />
              <line x1="32%" y1="0" x2="32%" y2="100%" />
              <line x1="58%" y1="0" x2="58%" y2="100%" />
              <line x1="84%" y1="0" x2="84%" y2="100%" />
              <line x1="0" y1="25%" x2="100%" y2="25%" />
              <line x1="0" y1="52%" x2="100%" y2="52%" />
              <line x1="0" y1="78%" x2="100%" y2="78%" />
              {/* Diagonal avenue */}
              <line x1="0" y1="90%" x2="100%" y2="10%" stroke="rgba(245,241,234,0.12)" />
            </svg>

            {/* Top Map Meta */}
            <div className="flex justify-between items-start z-10">
              <div>
                <span className="text-[9px] tracking-[0.3em] font-mono text-[#A8895C] uppercase block">
                  Topographical Plot 04
                </span>
                <span className="text-xs text-[#F5F1EA] font-serif uppercase tracking-[0.1em]">
                  51°30&apos;28&quot; N · 0°09&apos;42&quot; W
                </span>
              </div>
              <div className="border border-[rgba(245,241,234,0.2)] px-2.5 py-1 text-[8px] tracking-[0.2em] font-mono text-[#A39E93]">
                NORTH ORIENTATION ↑
              </div>
            </div>

            {/* Center Landmark Marker for The Valmont */}
            <div className="my-auto z-10 flex flex-col items-center justify-center py-12">
              <div className="relative flex items-center justify-center">
                <div className="w-10 h-10 border border-[#A8895C]/60 flex items-center justify-center">
                  <div className="w-2.5 h-2.5 bg-[#A8895C]" />
                </div>
                <div className="absolute -top-7 whitespace-nowrap bg-[#141414] px-2.5 py-0.5 border border-[#A8895C] text-[9px] tracking-[0.25em] font-mono text-[#F5F1EA] uppercase">
                  The Valmont
                </div>
              </div>
              <span className="text-[9px] tracking-[0.25em] text-[#A39E93] uppercase font-sans mt-3">
                Valmont Gardens, Enclave West
              </span>
            </div>

            {/* Bottom Map Legend */}
            <div className="flex justify-between items-end z-10 pt-4 border-t border-[rgba(245,241,234,0.08)] text-[9px] tracking-[0.2em] font-mono text-[#A39E93]">
              <span>Valmont Geographic Registry</span>
              <span className="text-[#A8895C]">Scale: 1:5000</span>
            </div>
          </div>

          {/* Landmarks Distances List (5 cols) */}
          <div
            ref={listRef}
            className="lg:col-span-5 flex flex-col justify-between space-y-6"
          >
            <div className="space-y-4">
              <h3 className="text-xs tracking-[0.25em] text-[#A8895C] uppercase font-sans font-medium mb-6">
                Proximity & Commute
              </h3>

              <div className="space-y-4">
                {LANDMARKS.map((landmark, idx) => (
                  <div
                    key={idx}
                    className="p-4 sm:p-5 bg-[#1A1A1A] border border-[rgba(245,241,234,0.1)] transition-colors hover:border-[#A8895C]/50 group"
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-[8px] tracking-[0.25em] text-[#A8895C] uppercase font-mono">
                        {landmark.category}
                      </span>
                      <span className="text-[11px] font-mono text-[#F5F1EA] font-medium">
                        {landmark.distance}
                      </span>
                    </div>
                    <h4 className="font-serif text-base sm:text-lg text-[#F5F1EA] tracking-[0.04em] font-light group-hover:text-[#A8895C] transition-colors">
                      {landmark.name}
                    </h4>
                    <p className="text-[11px] text-[#A39E93] font-sans font-light mt-1">
                      {landmark.transit}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 bg-[#141414] border border-[rgba(245,241,234,0.08)] text-[11px] text-[#A39E93] font-sans font-light leading-relaxed">
              Private arrival arrangements via subterranean security porte-cochère are coordinated directly by the residential concierge desk.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
