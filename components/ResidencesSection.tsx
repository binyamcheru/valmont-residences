"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

interface ResidenceItem {
  id: string;
  name: string;
  category: string;
  sqft: string;
  beds: string;
  baths: string;
  outdoor: string;
  exposure: string;
  image: string;
  description: string;
  rooms: string[];
}

const RESIDENCES: ResidenceItem[] = [
  {
    id: "residence-a",
    name: "The Garden Villa",
    category: "Ground & Courtyard",
    sqft: "3,450 SQ FT / 320 M²",
    beds: "3 Bedrooms",
    baths: "3.5 Bathrooms",
    outdoor: "850 SQ FT Private Garden Terrace",
    exposure: "East & South Parklands",
    image: "/frames/desktop/frame_0055.webp",
    description:
      "A grounded sanctuary boasting seamless indoor-outdoor transition, custom European white oak millwork, and private landscaped courtyard frontage.",
    rooms: [
      "Grand Living & Dining Salon (32' × 18')",
      "Custom Poliform Chef's Kitchen & Scullery",
      "Primary Suite with Dual Dressing Rooms",
      "Private Heated Outdoor Courtyard",
    ],
  },
  {
    id: "residence-b",
    name: "The Park Panorama Suite",
    category: "Mid-Tower Levels 04–10",
    sqft: "4,820 SQ FT / 448 M²",
    beds: "4 Bedrooms",
    baths: "4.5 Bathrooms",
    outdoor: "420 SQ FT Wrap-around Loggia",
    exposure: "Triple Exposure (North, East, South)",
    image: "/frames/desktop/frame_0075.webp",
    description:
      "Full-floor privacy accessed via direct high-speed private elevator. Features 11-foot ceilings, floor-to-ceiling acoustic glass, and panoramic canopy vistas.",
    rooms: [
      "Corner Great Room with Honed Stone Hearth",
      "Formal Dining Room for 14 Guests",
      "Primary Suite Wing with Spa-grade Bath",
      "Wine Tasting Alcove & Executive Study",
    ],
  },
  {
    id: "residence-c",
    name: "The Valmont Grand Penthouse",
    category: "Crown Duplex Level 12–14",
    sqft: "7,200 SQ FT / 669 M²",
    beds: "5 Bedrooms",
    baths: "6 Bathrooms",
    outdoor: "1,800 SQ FT Rooftop Sky Deck & Lap Pool",
    exposure: "360-Degree Unobstructed Horizon",
    image: "/frames/desktop/frame_0095.webp",
    description:
      "The pinnacle of Valmont & Co. Estates' residential achievements. Spanning three crown levels with an internal glass elevator, private 12-metre rooftop swimming pool, and sky salon.",
    rooms: [
      "Double-Height Grand Atrium Living Space",
      "Private Heated Rooftop Lap Pool & Outdoor Kitchen",
      "Full-Floor Primary Retreat with Wellness Spa",
      "Subterranean Chauffeur Staging & Double Garage",
    ],
  },
];

export default function ResidencesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<ResidenceItem | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const validCards = cardsRef.current.filter(Boolean);
      gsap.fromTo(
        validCards,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1.1,
          stagger: 0.2,
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
      id="residences"
      ref={sectionRef}
      className="relative w-full bg-[#141414] py-32 md:py-44 px-6 md:px-12 lg:px-20 border-t border-[rgba(245,241,234,0.12)]"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 md:mb-24 pb-8 border-b border-[rgba(245,241,234,0.12)]">
          <div>
            <span className="text-[10px] tracking-[0.35em] text-[#A8895C] uppercase font-sans font-medium mb-3 block">
              02 / The Collection
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-[0.08em] font-light text-[#F5F1EA] uppercase leading-none">
              Residences
            </h2>
          </div>
          <p className="mt-4 md:mt-0 text-xs md:text-sm text-[#A39E93] font-sans font-light max-w-sm tracking-wide">
            Eighteen full-floor and multi-level estates designed with acoustic precision, natural stone finishes, and uninterrupted park outlooks.
          </p>
        </div>

        {/* Residences Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
          {RESIDENCES.map((residence, idx) => (
            <div
              key={residence.id}
              ref={(el) => {
                cardsRef.current[idx] = el;
              }}
              className="flex flex-col justify-between bg-[#1A1A1A] border border-[rgba(245,241,234,0.12)] p-6 lg:p-8 transition-colors duration-300 hover:border-[#A8895C]/60 group"
            >
              <div>
                {/* Image Container */}
                <div className="relative w-full aspect-[16/10] bg-[#0D0D0D] border border-[rgba(245,241,234,0.08)] overflow-hidden mb-6">
                  <Image
                    src={residence.image}
                    alt={residence.name}
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-[#141414]/20 pointer-events-none" />
                  <div className="absolute top-3 left-3 bg-[#141414]/90 px-2.5 py-1 text-[8px] tracking-[0.25em] text-[#A8895C] uppercase font-mono border border-[rgba(245,241,234,0.1)]">
                    {residence.category}
                  </div>
                </div>

                {/* Title and Specs */}
                <h3 className="font-serif text-2xl lg:text-3xl tracking-[0.08em] font-light text-[#F5F1EA] uppercase mb-2">
                  {residence.name}
                </h3>
                <span className="text-[11px] tracking-[0.2em] text-[#A8895C] font-mono block mb-4">
                  {residence.sqft}
                </span>

                <p className="text-xs text-[#A39E93] font-sans font-light leading-relaxed mb-6">
                  {residence.description}
                </p>

                {/* Key Attributes List */}
                <div className="space-y-2 py-4 border-y border-[rgba(245,241,234,0.08)] text-[11px] font-sans text-[#F5F1EA]/80">
                  <div className="flex justify-between">
                    <span className="text-[#A39E93]">Bedrooms</span>
                    <span>{residence.beds}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#A39E93]">Bathrooms</span>
                    <span>{residence.baths}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#A39E93]">Exposure</span>
                    <span>{residence.exposure}</span>
                  </div>
                </div>
              </div>

              {/* View Floor Plan Action (Underlined text, no button fill) */}
              <div className="mt-8 pt-4">
                <button
                  type="button"
                  onClick={() => setSelectedPlan(residence)}
                  className="inline-flex items-center text-[10px] tracking-[0.25em] text-[#F5F1EA] uppercase font-sans border-b border-[#F5F1EA]/30 pb-1 hover:border-[#A8895C] hover:text-[#A8895C] transition-all duration-200"
                >
                  <span>View Floor Plan & Specs</span>
                  <span className="ml-2 font-mono text-[9px] text-[#A8895C]">→</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Floor Plan Detail Modal */}
      {selectedPlan && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#0D0D0D]/90 backdrop-blur-none"
        >
          <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-[#141414] border border-[rgba(245,241,234,0.18)] p-6 sm:p-10 text-[#F5F1EA]">
            {/* Modal Header */}
            <div className="flex justify-between items-start border-b border-[rgba(245,241,234,0.12)] pb-6 mb-8">
              <div>
                <span className="text-[9px] tracking-[0.3em] text-[#A8895C] uppercase font-mono block mb-1">
                  Architectural Schematic / {selectedPlan.category}
                </span>
                <h3 className="font-serif text-3xl md:text-4xl tracking-[0.1em] font-light uppercase">
                  {selectedPlan.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedPlan(null)}
                className="text-xs uppercase tracking-[0.2em] text-[#A39E93] hover:text-[#F5F1EA] border border-[rgba(245,241,234,0.2)] px-3 py-1.5 transition-colors"
                aria-label="Close floor plan modal"
              >
                Close ✕
              </button>
            </div>

            {/* Modal Content Grid */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
              {/* Floor Plan Schematic CAD Drawing */}
              <div className="md:col-span-7 bg-[#1A1A1A] p-6 border border-[rgba(245,241,234,0.1)] flex flex-col items-center justify-center min-h-[320px]">
                {/* Clean Custom Architectural Vector Diagram */}
                <div className="w-full max-w-sm aspect-[4/3] border border-dashed border-[#A8895C]/40 p-4 relative flex flex-col justify-between">
                  <div className="flex justify-between text-[8px] tracking-[0.2em] font-mono text-[#A8895C]">
                    <span>TERRACE LOGGIA</span>
                    <span>NORTH ↑</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 h-36 my-2">
                    <div className="border border-[rgba(245,241,234,0.2)] p-2 flex flex-col justify-between">
                      <span className="text-[8px] tracking-[0.15em] text-[#A39E93]">SALON</span>
                      <span className="text-[8px] font-mono text-[#A8895C]">32&apos; × 18&apos;</span>
                    </div>
                    <div className="border border-[rgba(245,241,234,0.2)] p-2 flex flex-col justify-between">
                      <span className="text-[8px] tracking-[0.15em] text-[#A39E93]">PRIMARY WING</span>
                      <span className="text-[8px] font-mono text-[#A8895C]">24&apos; × 16&apos;</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-1.5 h-16">
                    <div className="border border-[rgba(245,241,234,0.2)] p-1 text-[7px] text-[#A39E93]">KITCHEN</div>
                    <div className="border border-[rgba(245,241,234,0.2)] p-1 text-[7px] text-[#A39E93]">GUEST BED</div>
                    <div className="border border-[#A8895C]/60 p-1 text-[7px] text-[#A8895C]">PRIVATE ELEVATOR</div>
                  </div>
                </div>
                <span className="mt-4 text-[8px] tracking-[0.2em] font-mono text-[#A39E93]">
                  Scale 1:100 Architectural Layout · Certified by Valmont Studio
                </span>
              </div>

              {/* Specifications & Room Breakdown */}
              <div className="md:col-span-5 space-y-6">
                <div>
                  <h4 className="text-[10px] tracking-[0.25em] text-[#A8895C] uppercase font-sans font-medium mb-3">
                    Dimensions & Details
                  </h4>
                  <div className="space-y-2 text-xs font-sans text-[#F5F1EA]/90">
                    <div className="flex justify-between border-b border-[rgba(245,241,234,0.06)] pb-1.5">
                      <span className="text-[#A39E93]">Total Living Area:</span>
                      <span className="font-mono">{selectedPlan.sqft}</span>
                    </div>
                    <div className="flex justify-between border-b border-[rgba(245,241,234,0.06)] pb-1.5">
                      <span className="text-[#A39E93]">Outdoor Loggia:</span>
                      <span className="font-mono">{selectedPlan.outdoor}</span>
                    </div>
                    <div className="flex justify-between border-b border-[rgba(245,241,234,0.06)] pb-1.5">
                      <span className="text-[#A39E93]">Bedrooms:</span>
                      <span>{selectedPlan.beds}</span>
                    </div>
                    <div className="flex justify-between border-b border-[rgba(245,241,234,0.06)] pb-1.5">
                      <span className="text-[#A39E93]">Bathrooms:</span>
                      <span>{selectedPlan.baths}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-[10px] tracking-[0.25em] text-[#A8895C] uppercase font-sans font-medium mb-3">
                    Primary Chambers
                  </h4>
                  <ul className="space-y-2 text-xs text-[#A39E93] font-sans">
                    {selectedPlan.rooms.map((room, i) => (
                      <li key={i} className="flex items-center space-x-2">
                        <span className="w-1.5 h-[1px] bg-[#A8895C]" />
                        <span>{room}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-4 border-t border-[rgba(245,241,234,0.1)]">
                  <a
                    href="#enquire"
                    onClick={() => setSelectedPlan(null)}
                    className="block text-center text-xs tracking-[0.25em] uppercase text-[#F5F1EA] border border-[#A8895C] py-3 hover:bg-[#A8895C] hover:text-[#141414] transition-colors"
                  >
                    Request Full Archival Folio
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
