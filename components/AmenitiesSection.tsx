"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

interface AmenityItem {
  id: string;
  name: string;
  category: string;
  description: string;
  icon: React.ReactNode;
}

const AMENITIES: AmenityItem[] = [
  {
    id: "amenity-pool",
    name: "25-Metre Heated Lap Pool & Thermal Spa",
    category: "Wellness",
    description:
      "Subterranean natural stone pool framed in charcoal basalt, paired with custom Finnish sauna, cold plunge suites, and steam room.",
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
      "Acoustically isolated 14-seat screening salon equipped with DCI-compliant 4K laser projection, accompanied by an architectural library.",
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

export default function AmenitiesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const rowsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const validRows = rowsRef.current.filter(Boolean);
      gsap.fromTo(
        validRows,
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          stagger: 0.1,
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
      id="amenities"
      ref={sectionRef}
      className="relative w-full bg-[#141414] py-32 md:py-44 px-6 md:px-12 lg:px-20 border-t border-[rgba(245,241,234,0.12)]"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 pb-8 border-b border-[rgba(245,241,234,0.12)]">
          <div>
            <span className="text-[10px] tracking-[0.35em] text-[#A8895C] uppercase font-sans font-medium mb-3 block">
              03 / Lifestyle & Amenities
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-[0.08em] font-light text-[#F5F1EA] uppercase leading-none">
              Services & Amenities
            </h2>
          </div>
          <p className="mt-4 md:mt-0 text-xs md:text-sm text-[#A39E93] font-sans font-light max-w-sm tracking-wide">
            A comprehensive suite of private services curated to anticipate resident requirements with absolute discretion.
          </p>
        </div>

        {/* List Layout with Hairline Dividers */}
        <div className="border-t border-[rgba(245,241,234,0.12)]">
          {AMENITIES.map((amenity, idx) => (
            <div
              key={amenity.id}
              ref={(el) => {
                rowsRef.current[idx] = el;
              }}
              className="group py-7 sm:py-8 border-b border-[rgba(245,241,234,0.12)] flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors duration-200 hover:bg-[#1A1A1A]/40 px-2 sm:px-4"
            >
              {/* Left Column: Number + Line Icon + Amenity Name */}
              <div className="flex items-start sm:items-center space-x-6 md:w-1/2">
                <span className="text-[10px] tracking-[0.2em] font-mono text-[#A8895C] opacity-70">
                  {String(idx + 1).padStart(2, "0")}
                </span>
                <div className="p-2 border border-[rgba(245,241,234,0.1)] group-hover:border-[#A8895C] transition-colors shrink-0">
                  {amenity.icon}
                </div>
                <div>
                  <span className="text-[8px] tracking-[0.25em] text-[#A8895C] uppercase font-mono block mb-1">
                    {amenity.category}
                  </span>
                  <h3 className="font-serif text-lg sm:text-xl md:text-2xl tracking-[0.06em] font-light text-[#F5F1EA] group-hover:text-[#A8895C] transition-colors">
                    {amenity.name}
                  </h3>
                </div>
              </div>

              {/* Right Column: Understated Descriptive Copy */}
              <div className="md:w-1/2 pl-12 md:pl-8">
                <p className="text-xs sm:text-[13px] text-[#A39E93] font-sans font-light leading-relaxed tracking-wide max-w-lg">
                  {amenity.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
