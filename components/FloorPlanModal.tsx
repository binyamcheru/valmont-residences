"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useCurrency } from "./CurrencySwitcher";

interface ResidenceTypology {
  id: string;
  name: string;
  tagline: string;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  sqm: number;
  terraceSqft: number;
  ceilingHeight: string;
  priceGBP: number;
  floorRange: string;
  image: string;
  features: string[];
}

const typologies: ResidenceTypology[] = [
  {
    id: "penthouse",
    name: "The Crown Penthouse",
    tagline: "Triplex Sky Residence with 360° Mayfair Views",
    bedrooms: 5,
    bathrooms: 6,
    sqft: 6850,
    sqm: 636,
    terraceSqft: 1450,
    ceilingHeight: "4.2m Triple Volume",
    priceGBP: 24500000,
    floorRange: "Floors 18 - 20",
    image: "/frames/desktop/frame_0240.webp",
    features: [
      "Private Sky Pool & Thermal Terrace",
      "Direct Keyed Elevator Access",
      "Monolithic Calacatta Marble Fireplace",
      "Custom Molteni Kitchen & Wine Sanctuary",
    ],
  },
  {
    id: "sky-villa",
    name: "The Sky Villa",
    tagline: "Duplex Residence with Private Loggia",
    bedrooms: 4,
    bathrooms: 4.5,
    sqft: 4320,
    sqm: 401,
    terraceSqft: 620,
    ceilingHeight: "3.6m Dual Volume",
    priceGBP: 14800000,
    floorRange: "Floors 13 - 17",
    image: "/frames/desktop/frame_0180.webp",
    features: [
      "Dual East-West Exposure Loggia",
      "Sub-Zero & Wolf Appliance Suite",
      "Freestanding Basalt Soak Tub",
      "Motorized Bronze Mesh Sun Screens",
    ],
  },
  {
    id: "parkland-suite",
    name: "The Parkland Suite",
    tagline: "Lateral Residence with Garden Vistas",
    bedrooms: 3,
    bathrooms: 3.5,
    sqft: 2850,
    sqm: 265,
    terraceSqft: 340,
    ceilingHeight: "3.4m Volume",
    priceGBP: 8900000,
    floorRange: "Floors 04 - 12",
    image: "/frames/desktop/frame_0120.webp",
    features: [
      "Direct Views Over Private Botanical Grounds",
      "Chevron Smoked Oak Flooring",
      "Acoustic Triple-Glazed Framing",
      "Private Storage Unit & Wine Locker",
    ],
  },
];

interface FloorPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTypologyId?: string;
  onEnquire?: (typologyName: string) => void;
}

export default function FloorPlanModal({
  isOpen,
  onClose,
  initialTypologyId = "penthouse",
  onEnquire,
}: FloorPlanModalProps) {
  const [activeId, setActiveId] = useState(initialTypologyId);
  const [unitMetric, setUnitMetric] = useState<"sqft" | "sqm">("sqft");
  const { formatPrice } = useCurrency();

  if (!isOpen) return null;

  const current = typologies.find((t) => t.id === activeId) || typologies[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-5xl bg-[#161616] border border-[#A8895C]/40 p-6 md:p-10 max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          type="button"
          aria-label="Close modal"
          className="absolute top-4 right-4 text-[#A39E93] hover:text-[#F5F1EA] text-2xl font-mono p-2"
        >
          ✕
        </button>

        {/* Modal Header */}
        <div className="mb-6 pb-4 border-b border-[rgba(245,241,234,0.12)]">
          <span className="text-[9px] tracking-[0.35em] text-[#A8895C] uppercase font-mono block mb-1">
            Valmont Architectural Specifications
          </span>
          <h2 className="font-serif text-2xl md:text-4xl text-[#F5F1EA] font-light uppercase">
            Interactive Floor Plan & Typology Explorer
          </h2>
        </div>

        {/* Typology Tab Navigation */}
        <div className="flex flex-wrap gap-2 mb-8 border-b border-[rgba(245,241,234,0.1)] pb-4">
          {typologies.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveId(t.id)}
              className={`px-4 py-2 text-[10px] tracking-[0.2em] uppercase font-sans transition-all border ${
                activeId === t.id
                  ? "bg-[#A8895C] text-[#0D0D0D] border-[#A8895C] font-semibold"
                  : "bg-[#101010] text-[#A39E93] border-[rgba(245,241,234,0.12)] hover:border-[#A8895C]"
              }`}
            >
              {t.name}
            </button>
          ))}

          <div className="ml-auto flex items-center space-x-2">
            <span className="text-[9px] uppercase font-mono text-[#A39E93]">Area Unit:</span>
            <div className="inline-flex border border-[rgba(245,241,234,0.15)] bg-[#101010] p-0.5">
              <button
                onClick={() => setUnitMetric("sqft")}
                className={`px-2 py-0.5 text-[8px] font-mono uppercase ${
                  unitMetric === "sqft" ? "bg-[#A8895C] text-[#0D0D0D]" : "text-[#A39E93]"
                }`}
              >
                SQ FT
              </button>
              <button
                onClick={() => setUnitMetric("sqm")}
                className={`px-2 py-0.5 text-[8px] font-mono uppercase ${
                  unitMetric === "sqm" ? "bg-[#A8895C] text-[#0D0D0D]" : "text-[#A39E93]"
                }`}
              >
                SQ M
              </button>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Image & Render Container */}
          <div className="lg:col-span-7">
            <div className="relative w-full aspect-[16/10] bg-[#0D0D0D] border border-[rgba(245,241,234,0.12)] overflow-hidden mb-4">
              <Image
                src={current.image}
                alt={current.name}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 60vw"
              />
              <div className="absolute top-3 left-3 bg-[#141414]/90 px-3 py-1 text-[9px] tracking-[0.25em] text-[#A8895C] font-mono uppercase border border-[rgba(245,241,234,0.15)]">
                {current.floorRange}
              </div>
            </div>

            {/* Spec Highlights Grid */}
            <div className="grid grid-cols-4 gap-3 bg-[#101010] p-4 border border-[rgba(245,241,234,0.08)] text-center">
              <div>
                <span className="text-[8px] uppercase font-mono text-[#A39E93] block">Bedrooms</span>
                <span className="font-serif text-lg text-[#F5F1EA]">{current.bedrooms}</span>
              </div>
              <div>
                <span className="text-[8px] uppercase font-mono text-[#A39E93] block">Bathrooms</span>
                <span className="font-serif text-lg text-[#F5F1EA]">{current.bathrooms}</span>
              </div>
              <div>
                <span className="text-[8px] uppercase font-mono text-[#A39E93] block">Total Area</span>
                <span className="font-serif text-lg text-[#A8895C]">
                  {unitMetric === "sqft" ? `${current.sqft.toLocaleString()} sq ft` : `${current.sqm} sq m`}
                </span>
              </div>
              <div>
                <span className="text-[8px] uppercase font-mono text-[#A39E93] block">Ceilings</span>
                <span className="font-serif text-sm text-[#F5F1EA] leading-tight block mt-1">
                  {current.ceilingHeight}
                </span>
              </div>
            </div>
          </div>

          {/* Detailed Info Sidebar */}
          <div className="lg:col-span-5 flex flex-col justify-between h-full space-y-6">
            <div>
              <span className="text-[9px] tracking-[0.25em] text-[#A8895C] font-mono uppercase block mb-1">
                {current.tagline}
              </span>
              <h3 className="font-serif text-2xl text-[#F5F1EA] uppercase mb-2">
                {current.name}
              </h3>
              <p className="text-xs text-[#A39E93] leading-relaxed mb-6 font-light">
                Architectural layout engineered for maximum natural light penetration and discreet acoustic isolation.
              </p>

              <h4 className="text-[9px] tracking-[0.25em] text-[#F5F1EA] uppercase font-mono mb-3 pb-1 border-b border-[rgba(245,241,234,0.1)]">
                Bespoke Residence Features
              </h4>
              <ul className="space-y-2 mb-6">
                {current.features.map((feat, idx) => (
                  <li key={idx} className="flex items-start text-xs text-[#A39E93]">
                    <span className="text-[#A8895C] mr-2.5 font-mono">✦</span>
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-[#101010] border border-[#A8895C]/30 p-5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[9px] tracking-[0.2em] text-[#A39E93] font-mono uppercase">
                  Guide Price
                </span>
                <span className="font-serif text-2xl text-[#A8895C] font-normal">
                  {formatPrice(current.priceGBP)}
                </span>
              </div>

              <button
                type="button"
                onClick={() => {
                  onClose();
                  if (onEnquire) onEnquire(current.name);
                }}
                className="w-full py-3 bg-[#A8895C] text-[#0D0D0D] font-sans text-[10px] tracking-[0.3em] font-semibold uppercase hover:bg-[#c4a475] transition-colors"
              >
                Schedule Private Viewing For {current.name}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
