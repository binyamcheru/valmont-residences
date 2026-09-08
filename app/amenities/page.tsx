"use client";

import React from "react";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import ScrollZoomFrame from "@/components/ScrollZoomFrame";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SmoothScrollProvider from "@/components/SmoothScrollProvider";
import { CurrencyProvider } from "@/components/CurrencySwitcher";

interface AmenityItem {
  id: string;
  name: string;
  category: string;
  description: string;
  specs: string[];
  icon: React.ReactNode;
}

const AMENITIES: AmenityItem[] = [
  {
    id: "amenity-pool",
    name: "25-Metre Heated Lap Pool & Thermal Spa",
    category: "Wellness",
    description:
      "Subterranean natural stone pool framed in charcoal basalt, paired with custom Finnish cedar sauna, cold plunge hydrotherapy suites, and private steam room.",
    specs: ["25m Length x 6m Width", "Basalt Stone Surround", "Ozone Water Purification", "Private Spa Treatment Rooms"],
    icon: (
      <svg
        className="w-5 h-5 stroke-[#A8895C] stroke-[1] fill-none"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path d="M2 12c1.5-1 3-1 4.5 0s3 1 4.5 0 3-1 4.5 0 3 1 4.5 0" />
        <path d="M2 16c1.5-1 3-1 4.5 0s3 1 4.5 0 3-1 4.5 0 3 1 4.5 0" />
        <path d="M12 4v4m0 0l-2-2m2 2l2-2" />
      </svg>
    ),
  },
  {
    id: "amenity-screening",
    name: "Private Screening Room & Curated Library",
    category: "Culture",
    description:
      "Acoustically isolated 14-seat screening salon equipped with DCI-compliant 4K laser projection, accompanied by an architectural library and private salon.",
    specs: ["DCI-Compliant 4K Laser", "Dolby Atmos Acoustic Array", "14 Motorized Leather Recliners", "Private Screening Host Bar"],
    icon: (
      <svg
        className="w-5 h-5 stroke-[#A8895C] stroke-[1] fill-none"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <rect x="3" y="4" width="18" height="14" rx="0" />
        <path d="M7 8h10M7 12h6M10 18v2m4-2v2" />
      </svg>
    ),
  },
  {
    id: "amenity-lounge",
    name: "Rooftop Horizon Lounge & Sunset Terrace",
    category: "Entertaining",
    description:
      "Landscaped crown terrace featuring sheltered fire pits, outdoor dining tables, and full sommelier prep bar overlooking the city canopy.",
    specs: ["360° Skyline Views", "Sheltered Fire Features", "Outdoor Summer Kitchen", "Private Dining Capacity for 24"],
    icon: (
      <svg
        className="w-5 h-5 stroke-[#A8895C] stroke-[1] fill-none"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path d="M3 18h18M5 18V8l7-4 7 4v10" />
        <circle cx="12" cy="11" r="2" />
      </svg>
    ),
  },
  {
    id: "amenity-fitness",
    name: "Athletic Studio & Movement Suites",
    category: "Wellness",
    description:
      "Fully appointed Technogym conditioning floor, dedicated reformer Pilates studio, and private treatment room for visiting therapists.",
    specs: ["Technogym Artis Line", "Reformer Pilates Suite", "Private Physio Room", "Biomechanics Analysis Area"],
    icon: (
      <svg
        className="w-5 h-5 stroke-[#A8895C] stroke-[1] fill-none"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path d="M4 10v4M20 10v4M7 8v8M17 8v8M7 12h10" />
      </svg>
    ),
  },
  {
    id: "amenity-wine",
    name: "Sommelier Room & Temperature-Controlled Vault",
    category: "Collection",
    description:
      "Private resident wine lockers with individual climate regulation, integrated decanting bar, and private dinner hosting capacity for 16.",
    specs: ["Dual-Zone Climate Vault", "150-Bottle Lockers per Estate", "Tasting Sommelier Bar", "Cigar Humidor Alcove"],
    icon: (
      <svg
        className="w-5 h-5 stroke-[#A8895C] stroke-[1] fill-none"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path d="M8 3h8v6a4 4 0 0 1-8 0V3zM12 13v7M9 20h6" />
      </svg>
    ),
  },
  {
    id: "amenity-concierge",
    name: "24-Hour Concierge & White-Glove Valet",
    category: "Services",
    description:
      "Round-the-clock on-site security, package management with cold storage, private luggage handling, and secure subterranean chauffeur staging.",
    specs: ["24/7 Attended Reception", "Subterranean Chauffeur Bays", "Secure Cold Parcel Vault", "Private Aviation Liaison"],
    icon: (
      <svg
        className="w-5 h-5 stroke-[#A8895C] stroke-[1] fill-none"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path d="M4 18h16M12 6a7 7 0 0 0-7 7h14a7 7 0 0 0-7-7zM12 4v2" />
      </svg>
    ),
  },
  {
    id: "amenity-elevator",
    name: "Direct High-Speed Private Elevator Vestibules",
    category: "Privacy",
    description:
      "Biometrically secured dual elevators providing contactless, direct access into each residence's private formal foyer.",
    specs: ["Biometric Facial & RFID Ingress", "Destination Dispatch System", "Direct Private Formal Foyer Access", "Service & Staff Elevator Separation"],
    icon: (
      <svg
        className="w-5 h-5 stroke-[#A8895C] stroke-[1] fill-none"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <rect x="4" y="3" width="16" height="18" rx="0" />
        <path d="M12 3v18M8 10l2-2 2 2M16 14l-2 2-2-2" />
      </svg>
    ),
  },
];

const PROTOCOLS = [
  {
    role: "Residential Butler & Concierge Desk",
    desc: "Available 24 hours a day to facilitate resident travel logistics, private dining catering, and estate management requests.",
  },
  {
    role: "Subterranean Chauffeur Staging",
    desc: "Automated license-plate recognition and secure subterranean valet reception with direct internal elevator connection.",
  },
  {
    role: "Acoustic Isolation & Privacy Standard",
    desc: "All communal amenity volumes are structurally decoupled from residence floors with double-slab construction.",
  },
];

export default function AmenitiesPage() {
  return (
    <CurrencyProvider>
      <SmoothScrollProvider>
        <Navbar />

        <main className="relative w-full bg-[#141414] text-[#F5F1EA]">
          {/* Editorial Page Header */}
          <PageHeader
            number="02"
            eyebrow="Lifestyle & Services"
            title="Amenities"
            subtitle="Curated Wellness & Discretion"
            description="A comprehensive suite of private services and wellness environments curated to anticipate resident requirements with absolute discretion."
          />

          {/* Scroll-Driven Wellness & Atrium Frame Zoom Showcase (Frames 80 to 210) */}
          <ScrollZoomFrame
            startFrame={80}
            endFrame={210}
            zoomIntensity={1.15}
            scrollDistance="260%"
            overlays={[
              {
                range: [0.15, 0.45],
                eyebrow: "Wellness Enclave",
                title: "Thermal Sanctuary & 25m Lap Pool",
                copy: "Framed in charcoal basalt stone with custom Finnish saunas, cold plunge suites, and natural daylight wells creating an atmosphere of deep restoration.",
                align: "left",
              },
              {
                range: [0.55, 0.85],
                eyebrow: "Private Entertaining",
                title: "Sommelier Vault & Screening Salon",
                copy: "Individual climate-controlled resident cellars, private tasting facilities, and a DCI-compliant 4K cinema designed for private gatherings.",
                align: "right",
              },
            ]}
          />

          {/* Curated Amenities List */}
          <section className="py-24 md:py-36 px-6 md:px-12 lg:px-20 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 pb-6 border-b border-[rgba(245,241,234,0.12)]">
              <div>
                <span className="text-[10px] tracking-[0.35em] text-[#A8895C] uppercase font-sans font-medium mb-2 block">
                  Resident Spaces
                </span>
                <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl tracking-[0.06em] uppercase font-light text-[#F5F1EA]">
                  The Seven Amenity Enclaves
                </h2>
              </div>
              <span className="mt-4 md:mt-0 text-[10px] tracking-[0.2em] text-[#A39E93] uppercase font-mono">
                Exclusively for Valmont Residents & Guests
              </span>
            </div>

            <div className="border-t border-[rgba(245,241,234,0.12)] divide-y divide-[rgba(245,241,234,0.12)]">
              {AMENITIES.map((amenity, idx) => (
                <div
                  key={amenity.id}
                  className="py-10 group grid grid-cols-1 lg:grid-cols-12 gap-6 items-start hover:bg-[#1A1A1A]/30 px-2 sm:px-4 transition-colors duration-200"
                >
                  <div className="lg:col-span-5 flex items-start space-x-6">
                    <span className="text-[10px] tracking-[0.2em] font-mono text-[#A8895C] opacity-70">
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                    <div className="p-2.5 border border-[rgba(245,241,234,0.1)] group-hover:border-[#A8895C] transition-colors shrink-0">
                      {amenity.icon}
                    </div>
                    <div>
                      <span className="text-[8px] tracking-[0.25em] text-[#A8895C] uppercase font-mono block mb-1">
                        {amenity.category}
                      </span>
                      <h3 className="font-serif text-xl sm:text-2xl tracking-[0.05em] font-light text-[#F5F1EA] group-hover:text-[#A8895C] transition-colors">
                        {amenity.name}
                      </h3>
                    </div>
                  </div>

                  <div className="lg:col-span-4 pl-12 lg:pl-0">
                    <p className="text-xs sm:text-[13px] text-[#A39E93] font-sans font-light leading-relaxed tracking-wide">
                      {amenity.description}
                    </p>
                  </div>

                  <div className="lg:col-span-3 pl-12 lg:pl-4">
                    <ul className="space-y-1 text-[10px] font-mono text-[#F5F1EA]/70">
                      {amenity.specs.map((spec, sIdx) => (
                        <li key={sIdx} className="flex items-center space-x-1.5">
                          <span className="w-1 h-[1px] bg-[#A8895C]" />
                          <span>{spec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* White-Glove Service Protocols */}
          <section className="py-20 md:py-32 px-6 md:px-12 lg:px-20 max-w-7xl mx-auto border-t border-[rgba(245,241,234,0.12)]">
            <div className="max-w-3xl mb-12">
              <span className="text-[10px] tracking-[0.35em] text-[#A8895C] uppercase font-sans font-medium mb-3 block">
                Service Infrastructure
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl tracking-[0.06em] uppercase font-light text-[#F5F1EA]">
                Discretion & Protocols
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {PROTOCOLS.map((protocol, idx) => (
                <div
                  key={idx}
                  className="bg-[#1A1A1A] border border-[rgba(245,241,234,0.12)] p-6 sm:p-8 flex flex-col justify-between"
                >
                  <div>
                    <span className="text-[9px] tracking-[0.25em] font-mono text-[#A8895C] block mb-3">
                      Protocol 0{idx + 1}
                    </span>
                    <h3 className="font-serif text-xl text-[#F5F1EA] font-light mb-3">
                      {protocol.role}
                    </h3>
                    <p className="text-xs text-[#A39E93] font-sans font-light leading-relaxed">
                      {protocol.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Consultation Banner */}
            <div className="mt-16 p-8 sm:p-12 bg-[#1A1A1A] border border-[rgba(245,241,234,0.12)] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div>
                <h3 className="font-serif text-2xl sm:text-3xl text-[#F5F1EA] font-light uppercase mb-2">
                  Experience The Valmont Lifestyle
                </h3>
                <p className="text-xs text-[#A39E93] font-sans font-light max-w-md">
                  Private tours of the wellness suites, sommelier cellar, and screening salon are scheduled by arrangement.
                </p>
              </div>
              <Link
                href="/enquire"
                className="px-6 py-3 border border-[#A8895C] text-[10px] tracking-[0.3em] uppercase text-[#F5F1EA] hover:bg-[#A8895C] hover:text-[#0D0D0D] transition-colors whitespace-nowrap"
              >
                Arrange Private Preview
              </Link>
            </div>
          </section>
        </main>

        <Footer />
      </SmoothScrollProvider>
    </CurrencyProvider>
  );
}
