"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import ResidencesHero from "@/components/ResidencesHero";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SmoothScrollProvider from "@/components/SmoothScrollProvider";
import FloorPlanModal from "@/components/FloorPlanModal";
import DossierModal from "@/components/DossierModal";
import { CurrencyProvider } from "@/components/CurrencySwitcher";

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
    image: "/frames/desktop/frame_0180.webp",
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
    image: "/frames/desktop/frame_0240.webp",
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
    image: "/frames/desktop/frame_0330.webp",
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

const FINISHES = [
  {
    category: "Natural Stone",
    details: "Honed Fior di Bosco marble, Calacatta Monet vanity slabs, and fluted basalt fireplace surrounds.",
  },
  {
    category: "Joinery & Millwork",
    details: "Custom rift-sawn European white oak, solid brass recessed shadow-line hardware, and integrated pocketing doors.",
  },
  {
    category: "Glazing & Acoustics",
    details: "Triple-glazed acoustic-laminated floor-to-ceiling curtain wall rated for museum-grade acoustic isolation.",
  },
  {
    category: "Climate & Air Purity",
    details: "Multi-zone VRF concealed climate systems with MERV-16 hospital-grade particulate air filtration.",
  },
];

export default function ResidencesPage() {
  const [floorPlanOpen, setFloorPlanOpen] = useState(false);
  const [dossierOpen, setDossierOpen] = useState(false);
  const [selectedTypology, setSelectedTypology] = useState("penthouse");

  return (
    <CurrencyProvider>
      <SmoothScrollProvider>
        <Navbar />

        <main className="relative w-full bg-[#141414] text-[#F5F1EA]">
        {/* Editorial Page Header */}
        <PageHeader
          number="01"
          eyebrow="The Collection"
          title="Residences"
          subtitle="Three Tailored Typologies"
          description="Eighteen full-floor and multi-level estates designed with acoustic precision, natural stone finishes, and uninterrupted park outlooks."
        />

        {/* Full-Bleed 60fps Residences Canvas Scroll Tour (/frames/desktop2) */}
        <ResidencesHero scrollDistance="400%" />

        {/* Residences Collection Grid */}
        <section className="py-24 md:py-36 px-6 md:px-12 lg:px-20 max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 pb-6 border-b border-[rgba(245,241,234,0.12)]">
            <div>
              <span className="text-[10px] tracking-[0.35em] text-[#A8895C] uppercase font-sans font-medium mb-2 block">
                Floor Plans & Specifications
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl tracking-[0.06em] uppercase font-light text-[#F5F1EA]">
                The Three Typologies
              </h2>
            </div>
            <span className="mt-4 md:mt-0 text-[10px] tracking-[0.2em] text-[#A39E93] uppercase font-mono">
              Limited Availability · 18 Estates Total
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
            {RESIDENCES.map((residence) => (
              <div
                key={residence.id}
                className="flex flex-col justify-between bg-[#1A1A1A] border border-[rgba(245,241,234,0.12)] p-6 lg:p-8 transition-colors duration-300 hover:border-[#A8895C]/60 group"
              >
                <div>
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

                  <h3 className="font-serif text-2xl lg:text-3xl tracking-[0.08em] font-light text-[#F5F1EA] uppercase mb-2">
                    {residence.name}
                  </h3>
                  <span className="text-[11px] tracking-[0.2em] text-[#A8895C] font-mono block mb-4">
                    {residence.sqft}
                  </span>

                  <p className="text-xs text-[#A39E93] font-sans font-light leading-relaxed mb-6">
                    {residence.description}
                  </p>

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

                <div className="mt-8 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedTypology(
                        residence.id === "residence-c"
                          ? "penthouse"
                          : residence.id === "residence-b"
                          ? "sky-villa"
                          : "parkland-suite"
                      );
                      setFloorPlanOpen(true);
                    }}
                    className="inline-flex items-center text-[10px] tracking-[0.25em] text-[#F5F1EA] uppercase font-sans border-b border-[#F5F1EA]/30 pb-1 hover:border-[#A8895C] hover:text-[#A8895C] transition-all duration-200"
                  >
                    <span>View Interactive Floor Plan & Specs</span>
                    <span className="ml-2 font-mono text-[9px] text-[#A8895C]">→</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Materials & Architectural Specifications Table */}
        <section className="py-20 md:py-32 px-6 md:px-12 lg:px-20 max-w-7xl mx-auto border-t border-[rgba(245,241,234,0.12)]">
          <div className="max-w-3xl mb-12">
            <span className="text-[10px] tracking-[0.35em] text-[#A8895C] uppercase font-sans font-medium mb-3 block">
              Architectural Schedule
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl tracking-[0.06em] uppercase font-light text-[#F5F1EA]">
              Finishes & Material Palette
            </h2>
          </div>

          <div className="border-t border-[rgba(245,241,234,0.12)] divide-y divide-[rgba(245,241,234,0.12)]">
            {FINISHES.map((item, idx) => (
              <div
                key={idx}
                className="py-6 sm:py-8 grid grid-cols-1 md:grid-cols-12 gap-4 items-start"
              >
                <div className="md:col-span-4 flex items-center space-x-3">
                  <span className="text-[9px] tracking-[0.2em] font-mono text-[#A8895C]">
                    0{idx + 1}
                  </span>
                  <h3 className="font-serif text-xl sm:text-2xl tracking-[0.05em] font-light text-[#F5F1EA]">
                    {item.category}
                  </h3>
                </div>
                <div className="md:col-span-8">
                  <p className="text-xs sm:text-sm text-[#A39E93] font-sans font-light leading-relaxed">
                    {item.details}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Consultation Banner */}
          <div className="mt-16 p-8 sm:p-12 bg-[#1A1A1A] border border-[rgba(245,241,234,0.12)] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <h3 className="font-serif text-2xl sm:text-3xl text-[#F5F1EA] font-light uppercase mb-2">
                Request Archival Residence Folio
              </h3>
              <p className="text-xs text-[#A39E93] font-sans font-light max-w-md">
                Detailed CAD dimensions, joinery sections, and structural layouts are available for confidential review.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setDossierOpen(true)}
              className="px-6 py-3 bg-[#A8895C] text-[#0D0D0D] text-[10px] tracking-[0.3em] font-semibold uppercase hover:bg-[#c4a475] transition-colors whitespace-nowrap"
            >
              Request Dossier (PDF)
            </button>
          </div>
        </section>
      </main>

      {/* Interactive Floor Plan Modal */}
      <FloorPlanModal
        isOpen={floorPlanOpen}
        onClose={() => setFloorPlanOpen(false)}
        initialTypologyId={selectedTypology}
      />

      {/* Dossier Request Modal */}
      <DossierModal isOpen={dossierOpen} onClose={() => setDossierOpen(false)} />

      <Footer />
    </SmoothScrollProvider>
  </CurrencyProvider>
  );
}
