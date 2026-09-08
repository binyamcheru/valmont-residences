"use client";

import React from "react";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import ScrollZoomFrame from "@/components/ScrollZoomFrame";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SmoothScrollProvider from "@/components/SmoothScrollProvider";
import { CurrencyProvider } from "@/components/CurrencySwitcher";

const LANDMARKS = [
  {
    name: "The Royal Botanic Reserve & Arboretum",
    category: "Nature & Parkland",
    distance: "0.2 Miles",
    transit: "4-minute direct garden walk",
    detail: "Direct private gate key provides resident access into protected heritage woodlands.",
  },
  {
    name: "The National Opera & Arts Pavilion",
    category: "Culture & Performance",
    distance: "0.6 Miles",
    transit: "8-minute stroll",
    detail: "World-class classical symphony, opera, and international gallery exhibitions.",
  },
  {
    name: "Belgravia Culinary Row & Private Clubs",
    category: "Gastronomy",
    distance: "0.4 Miles",
    transit: "6-minute walk",
    detail: "Seven Michelin-starred establishments and heritage private members' establishments.",
  },
  {
    name: "Metropolitan Private Aviation Heliport",
    category: "Transit",
    distance: "6.8 Miles",
    transit: "12-minute private chauffeur",
    detail: "Direct liaison with Valmont concierge for seamless tarmac transfers and international arrivals.",
  },
];

const DISTRICTS = [
  {
    title: "Parkland Frontage",
    copy: "Fronting eighty acres of protected parkland, The Valmont ensures that expansive natural tree canopies remain permanently unobstructed.",
  },
  {
    title: "Acoustic Tranquility",
    copy: "Set back from commercial thoroughfares within an established private residential mews, offering rare stillness in the capital's heart.",
  },
  {
    title: "Diplomatic Enclave",
    copy: "Surrounded by historic embassies, consulate residences, and distinguished residential architecture with 24-hour neighborhood security.",
  },
];

export default function LocationPage() {
  return (
    <CurrencyProvider>
      <SmoothScrollProvider>
        <Navbar />

        <main className="relative w-full bg-[#141414] text-[#F5F1EA]">
          {/* Editorial Page Header */}
          <PageHeader
            number="03"
            eyebrow="Setting & Environs"
            title="The Enclave"
            subtitle="Mayfair Parkland Perimeter"
            description="Nestled directly against the western tree line, offering secluded privacy within moments of the capital's celebrated cultural institutions."
          />

          {/* Scroll-Driven Grounds & Arrival Frame Zoom Showcase (Frames 01 to 110) */}
          <ScrollZoomFrame
            startFrame={1}
            endFrame={110}
            zoomIntensity={1.15}
            scrollDistance="260%"
            overlays={[
              {
                range: [0.15, 0.45],
                eyebrow: "The Approach",
                title: "Discreet Parkland Arrival",
                copy: "Tree-lined private access mews leading directly into the sheltered porte-cochère and attended subterranean vehicle reception.",
                align: "left",
              },
              {
                range: [0.55, 0.85],
                eyebrow: "Prime Setting",
                title: "Direct Botanic Access",
                copy: "Residents enjoy keyholder privilege to the private arboretum paths and serene parkland lawns bordering the western elevation.",
                align: "right",
              },
            ]}
          />

          {/* Topographical Map and Landmarks Grid */}
          <section className="py-24 md:py-36 px-6 md:px-12 lg:px-20 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 pb-6 border-b border-[rgba(245,241,234,0.12)]">
              <div>
                <span className="text-[10px] tracking-[0.35em] text-[#A8895C] uppercase font-sans font-medium mb-2 block">
                  Topographical Context
                </span>
                <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl tracking-[0.06em] uppercase font-light text-[#F5F1EA]">
                  The Neighborhood
                </h2>
              </div>
              <span className="mt-4 md:mt-0 text-[10px] tracking-[0.2em] text-[#A39E93] uppercase font-mono">
                Coordinates: 51°30&apos;28&quot; N · 0°09&apos;42&quot; W
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
              {/* Custom Vector Topography Graphic (7 cols) */}
              <div className="lg:col-span-7 bg-[#1A1A1A] border border-[rgba(245,241,234,0.12)] p-6 sm:p-8 flex flex-col justify-between relative min-h-[480px] overflow-hidden">
                <svg
                  className="absolute inset-0 w-full h-full stroke-[rgba(245,241,234,0.07)] stroke-[1] fill-none pointer-events-none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M-50,120 Q180,90 320,240 T700,200"
                    stroke="rgba(168, 137, 92, 0.2)"
                    strokeDasharray="4 4"
                  />
                  <line x1="10%" y1="0" x2="10%" y2="100%" />
                  <line x1="32%" y1="0" x2="32%" y2="100%" />
                  <line x1="58%" y1="0" x2="58%" y2="100%" />
                  <line x1="84%" y1="0" x2="84%" y2="100%" />
                  <line x1="0" y1="25%" x2="100%" y2="25%" />
                  <line x1="0" y1="52%" x2="100%" y2="52%" />
                  <line x1="0" y1="78%" x2="100%" y2="78%" />
                  <line x1="0" y1="90%" x2="100%" y2="10%" stroke="rgba(245,241,234,0.14)" />
                </svg>

                <div className="flex justify-between items-start z-10">
                  <div>
                    <span className="text-[9px] tracking-[0.3em] font-mono text-[#A8895C] uppercase block">
                      Topographical Plot 04
                    </span>
                    <span className="text-xs text-[#F5F1EA] font-serif uppercase tracking-[0.1em]">
                      Valmont Gardens, Enclave West
                    </span>
                  </div>
                  <div className="border border-[rgba(245,241,234,0.2)] px-2.5 py-1 text-[8px] tracking-[0.2em] font-mono text-[#A39E93]">
                    NORTH ORIENTATION ↑
                  </div>
                </div>

                <div className="my-auto z-10 flex flex-col items-center justify-center py-12">
                  <div className="relative flex items-center justify-center">
                    <div className="w-12 h-12 border border-[#A8895C]/60 flex items-center justify-center">
                      <div className="w-3 h-3 bg-[#A8895C]" />
                    </div>
                    <div className="absolute -top-8 whitespace-nowrap bg-[#141414] px-3 py-1 border border-[#A8895C] text-[10px] tracking-[0.25em] font-mono text-[#F5F1EA] uppercase">
                      The Valmont
                    </div>
                  </div>
                  <span className="text-[9px] tracking-[0.25em] text-[#A39E93] uppercase font-sans mt-3">
                    14 Valmont Gardens, Mayfair
                  </span>
                </div>

                <div className="flex justify-between items-end z-10 pt-4 border-t border-[rgba(245,241,234,0.08)] text-[9px] tracking-[0.2em] font-mono text-[#A39E93]">
                  <span>Valmont Geographic Registry</span>
                  <span className="text-[#A8895C]">Scale: 1:5000 Cadastral</span>
                </div>
              </div>

              {/* Landmarks Proximity List (5 cols) */}
              <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  {LANDMARKS.map((landmark, idx) => (
                    <div
                      key={idx}
                      className="p-5 bg-[#1A1A1A] border border-[rgba(245,241,234,0.1)] transition-colors hover:border-[#A8895C]/50 group"
                    >
                      <div className="flex justify-between items-start mb-1">
                        <span className="text-[8px] tracking-[0.25em] text-[#A8895C] uppercase font-mono">
                          {landmark.category}
                        </span>
                        <span className="text-[11px] font-mono text-[#F5F1EA] font-medium">
                          {landmark.distance}
                        </span>
                      </div>
                      <h3 className="font-serif text-lg text-[#F5F1EA] tracking-[0.04em] font-light group-hover:text-[#A8895C] transition-colors">
                        {landmark.name}
                      </h3>
                      <p className="text-[11px] text-[#A8895C] font-mono mt-1">
                        {landmark.transit}
                      </p>
                      <p className="text-xs text-[#A39E93] font-sans font-light mt-2 leading-relaxed">
                        {landmark.detail}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* District Highlights */}
          <section className="py-20 md:py-32 px-6 md:px-12 lg:px-20 max-w-7xl mx-auto border-t border-[rgba(245,241,234,0.12)]">
            <div className="max-w-3xl mb-12">
              <span className="text-[10px] tracking-[0.35em] text-[#A8895C] uppercase font-sans font-medium mb-3 block">
                The Enclave Atmosphere
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl tracking-[0.06em] uppercase font-light text-[#F5F1EA]">
                Quiet Proximity
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {DISTRICTS.map((d, idx) => (
                <div
                  key={idx}
                  className="bg-[#1A1A1A] border border-[rgba(245,241,234,0.12)] p-6 sm:p-8"
                >
                  <span className="text-[9px] tracking-[0.25em] font-mono text-[#A8895C] block mb-3">
                    0{idx + 1}
                  </span>
                  <h3 className="font-serif text-xl text-[#F5F1EA] font-light mb-3">
                    {d.title}
                  </h3>
                  <p className="text-xs text-[#A39E93] font-sans font-light leading-relaxed">
                    {d.copy}
                  </p>
                </div>
              ))}
            </div>

            {/* Consultation Banner */}
            <div className="mt-16 p-8 sm:p-12 bg-[#1A1A1A] border border-[rgba(245,241,234,0.12)] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div>
                <h3 className="font-serif text-2xl sm:text-3xl text-[#F5F1EA] font-light uppercase mb-2">
                  Visit the Private Sales Gallery
                </h3>
                <p className="text-xs text-[#A39E93] font-sans font-light max-w-md">
                  Located within Valmont Pavilion. Private chauffeur pickup from London airports or heliports is provided.
                </p>
              </div>
              <Link
                href="/enquire"
                className="px-6 py-3 border border-[#A8895C] text-[10px] tracking-[0.3em] uppercase text-[#F5F1EA] hover:bg-[#A8895C] hover:text-[#0D0D0D] transition-colors whitespace-nowrap"
              >
                Plan Your Visit
              </Link>
            </div>
          </section>
        </main>

        <Footer />
      </SmoothScrollProvider>
    </CurrencyProvider>
  );
}
