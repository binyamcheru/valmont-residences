"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import SmoothScrollProvider from "@/components/SmoothScrollProvider";
import Navbar from "@/components/Navbar";
import ScrollVideoHero from "@/components/ScrollVideoHero";
import LoadingScreen from "@/components/LoadingScreen";
import IntroSection from "@/components/IntroSection";
import AudioController from "@/components/AudioController";
import Footer from "@/components/Footer";
import DossierModal from "@/components/DossierModal";
import { CurrencyProvider } from "@/components/CurrencySwitcher";

export default function Home() {
  const [dossierOpen, setDossierOpen] = useState(false);

  const chapters = [
    {
      num: "01",
      title: "Residences",
      tagline: "Three Typologies",
      desc: "Eighteen tailored estates featuring 3.4m ceiling volumes, monolithic fireplaces, and private parkland loggias.",
      href: "/residences",
      image: "/frames/desktop/frame_0240.webp",
    },
    {
      num: "02",
      title: "Amenities",
      tagline: "Wellness & Discretion",
      desc: "Subterranean 25m heated basalt lap pool, Finnish saunas, private screening salon, and 24-hour valet.",
      href: "/amenities",
      image: "/frames/desktop/frame_0140.webp",
    },
    {
      num: "03",
      title: "The Enclave",
      tagline: "Mayfair Parkland",
      desc: "Direct botanical garden access and tranquil mews seclusion within moments of premier cultural landmarks.",
      href: "/location",
      image: "/frames/desktop/frame_0060.webp",
    },
  ];

  return (
    <CurrencyProvider>
      <SmoothScrollProvider>
        {/* Luxury Cinematic Brand Intro Screen */}
        <LoadingScreen />

        {/* Global Navigation */}
        <Navbar />

        <main className="relative w-full bg-[#141414] text-[#F5F1EA] overflow-hidden">
          {/* Instant-Load 60fps Canvas Frame Sequence Hero Section */}
          <ScrollVideoHero />

          {/* Architectural Philosophy Section */}
          <IntroSection />

          {/* Exploration Chapters Grid */}
          <section className="py-28 md:py-40 px-6 md:px-12 lg:px-20 max-w-7xl mx-auto border-t border-[rgba(245,241,234,0.12)]">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 pb-6 border-b border-[rgba(245,241,234,0.12)]">
              <div>
                <span className="text-[10px] tracking-[0.35em] text-[#A8895C] uppercase font-sans font-medium mb-2 block">
                  The Estate Overview
                </span>
                <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl tracking-[0.06em] uppercase font-light text-[#F5F1EA]">
                  Discover The Valmont
                </h2>
              </div>
              <span className="mt-4 md:mt-0 text-[10px] tracking-[0.2em] text-[#A39E93] uppercase font-mono">
                Select a chapter to explore
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
              {chapters.map((chapter) => (
                <Link
                  key={chapter.num}
                  href={chapter.href}
                  className="group flex flex-col justify-between bg-[#1A1A1A] border border-[rgba(245,241,234,0.12)] p-6 lg:p-8 transition-colors duration-300 hover:border-[#A8895C]/60"
                >
                  <div>
                    <div className="relative w-full aspect-[16/11] bg-[#0D0D0D] border border-[rgba(245,241,234,0.08)] overflow-hidden mb-6">
                      <Image
                        src={chapter.image}
                        alt={chapter.title}
                        fill
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-[#141414]/25 pointer-events-none" />
                      <div className="absolute top-3 left-3 bg-[#141414]/90 px-2.5 py-1 text-[8px] tracking-[0.25em] text-[#A8895C] uppercase font-mono border border-[rgba(245,241,234,0.1)]">
                        Chapter {chapter.num}
                      </div>
                    </div>

                    <span className="text-[9px] tracking-[0.25em] text-[#A8895C] uppercase font-mono block mb-1">
                      {chapter.tagline}
                    </span>
                    <h3 className="font-serif text-2xl lg:text-3xl tracking-[0.06em] font-light text-[#F5F1EA] group-hover:text-[#A8895C] transition-colors mb-3">
                      {chapter.title}
                    </h3>
                    <p className="text-xs text-[#A39E93] font-sans font-light leading-relaxed">
                      {chapter.desc}
                    </p>
                  </div>

                  <div className="mt-8 pt-4 border-t border-[rgba(245,241,234,0.08)] flex items-center justify-between text-[10px] tracking-[0.25em] text-[#F5F1EA] uppercase font-sans group-hover:text-[#A8895C]">
                    <span>Explore {chapter.title}</span>
                    <span className="font-mono text-[#A8895C]">→</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* Private Acquisitions Banner */}
          <section className="py-24 px-6 md:px-12 lg:px-20 max-w-7xl mx-auto border-t border-[rgba(245,241,234,0.12)]">
            <div className="bg-[#1A1A1A] border border-[rgba(245,241,234,0.12)] p-8 md:p-14 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
              <div className="max-w-xl">
                <span className="text-[9px] tracking-[0.3em] text-[#A8895C] uppercase font-mono block mb-2">
                  Valmont Private Office
                </span>
                <h3 className="font-serif text-3xl md:text-4xl text-[#F5F1EA] font-light uppercase mb-3">
                  Private Acquisitions & Viewings
                </h3>
                <p className="text-xs md:text-sm text-[#A39E93] font-sans font-light leading-relaxed">
                  Confidential appointments are hosted within the Mayfair Sales Gallery. Request complete architectural dossiers and availability schedules.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                <button
                  type="button"
                  onClick={() => setDossierOpen(true)}
                  className="px-6 py-4 bg-[#A8895C] text-[#0D0D0D] text-[10px] tracking-[0.3em] font-semibold uppercase hover:bg-[#c4a475] transition-colors whitespace-nowrap text-center"
                >
                  Request Dossier (PDF)
                </button>
                <Link
                  href="/enquire"
                  className="px-6 py-4 border border-[rgba(245,241,234,0.3)] text-[10px] tracking-[0.3em] uppercase text-[#F5F1EA] hover:border-[#A8895C] hover:text-[#A8895C] transition-colors whitespace-nowrap text-center"
                >
                  Initiate Enquiry
                </Link>
              </div>
            </div>
          </section>
        </main>

        {/* Ambient Audio Controller (Homepage only) */}
        <AudioController />

        {/* Dossier Request Modal */}
        <DossierModal isOpen={dossierOpen} onClose={() => setDossierOpen(false)} />

        {/* Luxury Footer */}
        <Footer />
      </SmoothScrollProvider>
    </CurrencyProvider>
  );
}
