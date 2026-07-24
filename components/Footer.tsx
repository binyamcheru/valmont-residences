"use client";

import React from "react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full bg-[#0D0D0D] text-[#F5F1EA] pt-24 pb-16 px-6 md:px-12 lg:px-20 border-t border-[rgba(245,241,234,0.12)]">
      <div className="max-w-7xl mx-auto flex flex-col justify-between space-y-16">
        {/* Top Tier: Wordmark and Navigation Links */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
          {/* Brand & Developer identity */}
          <div className="md:col-span-5 space-y-4">
            <span className="text-[9px] tracking-[0.35em] text-[#A8895C] uppercase font-sans block">
              Valmont & Co. Estates
            </span>
            <Link href="/" className="inline-block">
              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl tracking-[0.15em] font-light uppercase text-[#F5F1EA] hover:text-[#A8895C] transition-colors">
                The Valmont
              </h2>
            </Link>
            <p className="text-xs text-[#A39E93] font-sans font-light leading-relaxed max-w-sm">
              Eighteen distinguished private residences positioned along the parkland edge. An architectural commission by Valmont & Co. Estates.
            </p>
          </div>

          {/* Navigation Directory */}
          <div className="md:col-span-4 grid grid-cols-2 gap-8 text-[11px] uppercase tracking-[0.2em] font-sans">
            <div className="space-y-3">
              <span className="text-[9px] tracking-[0.3em] text-[#A8895C] font-mono block mb-4">
                Architecture
              </span>
              <div>
                <Link
                  href="/"
                  className="text-[#A39E93] hover:text-[#F5F1EA] transition-colors"
                >
                  Walkthrough
                </Link>
              </div>
              <div>
                <Link
                  href="/residences"
                  className="text-[#A39E93] hover:text-[#F5F1EA] transition-colors"
                >
                  Residences
                </Link>
              </div>
              <div>
                <Link
                  href="/amenities"
                  className="text-[#A39E93] hover:text-[#F5F1EA] transition-colors"
                >
                  Amenities
                </Link>
              </div>
            </div>

            <div className="space-y-3">
              <span className="text-[9px] tracking-[0.3em] text-[#A8895C] font-mono block mb-4">
                Location & Enquiry
              </span>
              <div>
                <Link
                  href="/location"
                  className="text-[#A39E93] hover:text-[#F5F1EA] transition-colors"
                >
                  The Enclave
                </Link>
              </div>
              <div>
                <Link
                  href="/enquire"
                  className="text-[#A39E93] hover:text-[#F5F1EA] transition-colors"
                >
                  Private Enquiry
                </Link>
              </div>
              <div>
                <Link
                  href="/enquire"
                  className="text-[#A39E93] hover:text-[#F5F1EA] transition-colors"
                >
                  Sales Gallery
                </Link>
              </div>
            </div>
          </div>

          {/* Social / Plain text representations */}
          <div className="md:col-span-3 space-y-3 text-[11px] font-sans">
            <span className="text-[9px] tracking-[0.3em] text-[#A8895C] font-mono block mb-4 uppercase">
              Private Folio
            </span>
            <div className="flex flex-col space-y-2 text-[#A39E93] tracking-[0.15em] uppercase">
              <Link
                href="/enquire"
                className="hover:text-[#F5F1EA] transition-colors"
              >
                Archival Brochure [PDF]
              </Link>
              <Link
                href="/enquire"
                className="hover:text-[#F5F1EA] transition-colors"
              >
                Press & Monograph
              </Link>
              <Link
                href="/enquire"
                className="hover:text-[#F5F1EA] transition-colors"
              >
                Private Client Portal
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Tier: Disclaimers and Copyright */}
        <div className="pt-10 border-t border-[rgba(245,241,234,0.08)] flex flex-col md:flex-row justify-between items-start md:items-center gap-6 text-[9px] tracking-[0.2em] text-[#6E6961] font-mono uppercase">
          <div>
            &copy; {new Date().getFullYear()} Valmont & Co. Estates Ltd. All rights reserved.
          </div>
          <div className="flex flex-wrap gap-6 text-[#A39E93]">
            <span>Architectural Artist Impression</span>
            <span>Subject to Final Approvals</span>
            <span>Privacy Policy</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
