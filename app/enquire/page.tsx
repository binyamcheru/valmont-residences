"use client";

import React, { useState } from "react";
import PageHeader from "@/components/PageHeader";
import ScrollZoomFrame from "@/components/ScrollZoomFrame";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SmoothScrollProvider from "@/components/SmoothScrollProvider";
import { CurrencyProvider } from "@/components/CurrencySwitcher";

export default function EnquirePage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    residenceInterest: "The Park Panorama Suite",
    timing: "Immediate Acquisition (Q3 2026)",
    preferredDate: "",
    preferredTime: "14:00 (Afternoon)",
    consultationType: "In-Person (Mayfair Sales Gallery)",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email) return;
    setSubmitted(true);
  };

  return (
    <CurrencyProvider>
      <SmoothScrollProvider>
        <Navbar />

        <main className="relative w-full bg-[#141414] text-[#F5F1EA]">
          {/* Editorial Page Header */}
          <PageHeader
            number="04"
            eyebrow="Private Office"
            title="Acquisitions & Enquiry"
            subtitle="Confidential Consultations"
            description="Private preview appointments and architectural monographs are available upon confidential request through Valmont & Co. Estates."
          />

          {/* Scroll-Driven Penthouse Crown & Horizon Frame Zoom Showcase */}
          <ScrollZoomFrame
            startFrame={260}
            endFrame={360}
            zoomIntensity={1.15}
            scrollDistance="260%"
            overlays={[
              {
                range: [0.15, 0.45],
                eyebrow: "The Crown",
                title: "Penthouse Terraces & Sky Salon",
                copy: "Private rooftop swimming facilities and 360-degree panoramic outlooks over the capital canopy.",
                align: "left",
              },
              {
                range: [0.55, 0.85],
                eyebrow: "Private Acquisition",
                title: "Discreet Consultations by Appointment",
                copy: "All transactions and bespoke floor plan modifications are coordinated directly with Valmont Senior Principals.",
                align: "right",
              },
            ]}
          />

          {/* Form and Gallery Section */}
          <section className="py-24 md:py-36 px-6 md:px-12 lg:px-20 max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
              {/* Sales Gallery Details (5 cols) */}
              <div className="lg:col-span-5 flex flex-col justify-between space-y-10">
                <div className="space-y-8">
                  <div>
                    <span className="text-[9px] tracking-[0.3em] text-[#A8895C] uppercase font-mono block mb-2">
                      Private Sales Gallery
                    </span>
                    <h3 className="font-serif text-2xl sm:text-3xl text-[#F5F1EA] font-light leading-snug">
                      The Valmont Pavilion <br />
                      14 Valmont Gardens, Mayfair <br />
                      London W1K 7BN
                    </h3>
                  </div>

                  <div className="space-y-4 pt-6 border-t border-[rgba(245,241,234,0.08)]">
                    <div>
                      <span className="text-[9px] tracking-[0.25em] text-[#A39E93] uppercase font-sans block mb-1">
                        Direct Telephone Line
                      </span>
                      <a
                        href="tel:+442079460912"
                        className="text-base font-mono text-[#F5F1EA] hover:text-[#A8895C] transition-colors"
                      >
                        +44 (0) 20 7946 0912
                      </a>
                    </div>

                    <div>
                      <span className="text-[9px] tracking-[0.25em] text-[#A39E93] uppercase font-sans block mb-1">
                        Confidential Correspondence
                      </span>
                      <a
                        href="mailto:enquiries@thevalmont.com"
                        className="text-base font-mono text-[#F5F1EA] hover:text-[#A8895C] transition-colors"
                      >
                        enquiries@thevalmont.com
                      </a>
                    </div>

                    <div>
                      <span className="text-[9px] tracking-[0.25em] text-[#A39E93] uppercase font-sans block mb-1">
                        Private Gallery Hours
                      </span>
                      <p className="text-xs text-[#A39E93] font-sans">
                        Monday through Saturday, 10:00 – 18:00 <br />
                        Private Evening Presentations by Request
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-5 bg-[#1A1A1A] border border-[rgba(245,241,234,0.1)] text-[10px] tracking-[0.15em] text-[#A39E93] uppercase font-mono">
                  Represented Exclusively by Valmont & Co. Estates
                </div>
              </div>

              {/* Underlined Minimalist Interactive Viewing Scheduler Form (7 cols) */}
              <div className="lg:col-span-7 bg-[#1A1A1A]/40 p-8 sm:p-12 border border-[rgba(245,241,234,0.12)]">
                {submitted ? (
                  <div className="py-16 text-center space-y-4">
                    <div className="w-12 h-12 mx-auto rounded-full border border-[#A8895C] flex items-center justify-center text-[#A8895C] font-mono text-xl">
                      ✓
                    </div>
                    <span className="text-[10px] tracking-[0.3em] text-[#A8895C] uppercase font-mono block">
                      Appointment Scheduled
                    </span>
                    <h3 className="font-serif text-3xl sm:text-4xl text-[#F5F1EA] uppercase font-light">
                      Thank You, {formData.fullName}
                    </h3>
                    <p className="text-xs text-[#A39E93] max-w-md mx-auto font-sans leading-relaxed">
                      Your request for a <span className="text-[#F5F1EA]">{formData.consultationType}</span> on <span className="text-[#A8895C]">{formData.preferredDate || "your requested date"}</span> at <span className="text-[#A8895C]">{formData.preferredTime}</span> has been logged. A Valmont Senior Advisor will confirm details via <span className="text-[#F5F1EA]">{formData.email}</span>.
                    </p>
                    <button
                      type="button"
                      onClick={() => setSubmitted(false)}
                      className="mt-6 text-[10px] tracking-[0.25em] uppercase text-[#A8895C] border border-[#A8895C] px-5 py-2.5 hover:bg-[#A8895C] hover:text-[#141414] transition-colors"
                    >
                      Schedule Another Appointment
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Full Name */}
                    <div className="relative">
                      <label
                        htmlFor="fullName"
                        className="block text-[10px] tracking-[0.25em] text-[#A39E93] uppercase font-sans mb-2"
                      >
                        Full Name *
                      </label>
                      <input
                        type="text"
                        id="fullName"
                        required
                        value={formData.fullName}
                        onChange={(e) =>
                          setFormData({ ...formData, fullName: e.target.value })
                        }
                        placeholder="e.g. Lord Alistair Vance"
                        className="w-full bg-transparent border-0 border-b border-[rgba(245,241,234,0.2)] pb-2 text-sm text-[#F5F1EA] font-sans placeholder-[#6E6961] focus:outline-none focus:border-[#A8895C] transition-colors rounded-none"
                      />
                    </div>

                    {/* Email and Phone */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                      <div className="relative">
                        <label
                          htmlFor="email"
                          className="block text-[10px] tracking-[0.25em] text-[#A39E93] uppercase font-sans mb-2"
                        >
                          Email Address *
                        </label>
                        <input
                          type="email"
                          id="email"
                          required
                          value={formData.email}
                          onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                          }
                          placeholder="e.g. vance@privateoffice.co.uk"
                          className="w-full bg-transparent border-0 border-b border-[rgba(245,241,234,0.2)] pb-2 text-sm text-[#F5F1EA] font-sans placeholder-[#6E6961] focus:outline-none focus:border-[#A8895C] transition-colors rounded-none"
                        />
                      </div>

                      <div className="relative">
                        <label
                          htmlFor="phone"
                          className="block text-[10px] tracking-[0.25em] text-[#A39E93] uppercase font-sans mb-2"
                        >
                          Telephone Number
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          value={formData.phone}
                          onChange={(e) =>
                            setFormData({ ...formData, phone: e.target.value })
                          }
                          placeholder="e.g. +44 7700 900077"
                          className="w-full bg-transparent border-0 border-b border-[rgba(245,241,234,0.2)] pb-2 text-sm text-[#F5F1EA] font-sans placeholder-[#6E6961] focus:outline-none focus:border-[#A8895C] transition-colors rounded-none"
                        />
                      </div>
                    </div>

                    {/* Appointment Date & Slot Picker */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                      <div className="relative">
                        <label
                          htmlFor="preferredDate"
                          className="block text-[10px] tracking-[0.25em] text-[#A8895C] uppercase font-sans mb-2"
                        >
                          Preferred Viewing Date
                        </label>
                        <input
                          type="date"
                          id="preferredDate"
                          value={formData.preferredDate}
                          onChange={(e) =>
                            setFormData({ ...formData, preferredDate: e.target.value })
                          }
                          className="w-full bg-[#141414] border-0 border-b border-[rgba(245,241,234,0.2)] pb-2 text-sm text-[#F5F1EA] font-sans focus:outline-none focus:border-[#A8895C] transition-colors rounded-none"
                        />
                      </div>

                      <div className="relative">
                        <label
                          htmlFor="preferredTime"
                          className="block text-[10px] tracking-[0.25em] text-[#A8895C] uppercase font-sans mb-2"
                        >
                          Preferred Time Window
                        </label>
                        <select
                          id="preferredTime"
                          value={formData.preferredTime}
                          onChange={(e) =>
                            setFormData({ ...formData, preferredTime: e.target.value })
                          }
                          className="w-full bg-[#141414] border-0 border-b border-[rgba(245,241,234,0.2)] pb-2 text-sm text-[#F5F1EA] font-sans focus:outline-none focus:border-[#A8895C] transition-colors rounded-none"
                        >
                          <option value="11:00 (Morning)">11:00 AM (Morning Private Tour)</option>
                          <option value="14:00 (Afternoon)">14:00 PM (Afternoon Salon)</option>
                          <option value="17:30 (Twilight)">17:30 PM (Twilight & Sky Terrace Viewing)</option>
                        </select>
                      </div>
                    </div>

                    {/* Consultation Type & Residence Interest */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                      <div className="relative">
                        <label
                          htmlFor="consultationType"
                          className="block text-[10px] tracking-[0.25em] text-[#A39E93] uppercase font-sans mb-2"
                        >
                          Consultation Format
                        </label>
                        <select
                          id="consultationType"
                          value={formData.consultationType}
                          onChange={(e) =>
                            setFormData({ ...formData, consultationType: e.target.value })
                          }
                          className="w-full bg-[#141414] border-0 border-b border-[rgba(245,241,234,0.2)] pb-2 text-sm text-[#F5F1EA] font-sans focus:outline-none focus:border-[#A8895C] transition-colors rounded-none"
                        >
                          <option value="In-Person (Mayfair Sales Gallery)">In-Person (Mayfair Sales Gallery)</option>
                          <option value="Private Virtual 3D Presentation">Private Virtual 3D Presentation</option>
                          <option value="On-Site Hardhat Architectural Walk">On-Site Hardhat Architectural Walk</option>
                        </select>
                      </div>

                      <div className="relative">
                        <label
                          htmlFor="residenceInterest"
                          className="block text-[10px] tracking-[0.25em] text-[#A39E93] uppercase font-sans mb-2"
                        >
                          Residence Interest
                        </label>
                        <select
                          id="residenceInterest"
                          value={formData.residenceInterest}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              residenceInterest: e.target.value,
                            })
                          }
                          className="w-full bg-[#141414] border-0 border-b border-[rgba(245,241,234,0.2)] pb-2 text-sm text-[#F5F1EA] font-sans focus:outline-none focus:border-[#A8895C] transition-colors rounded-none"
                        >
                          <option value="The Garden Villa">
                            The Garden Villa (3 Bed · 3,450 SQ FT)
                          </option>
                          <option value="The Park Panorama Suite">
                            The Park Panorama Suite (4 Bed · 4,820 SQ FT)
                          </option>
                          <option value="The Valmont Grand Penthouse">
                            The Valmont Grand Penthouse (5 Bed · 7,200 SQ FT)
                          </option>
                          <option value="General Investment Folio">
                            General Portfolio Consultation
                          </option>
                        </select>
                      </div>
                    </div>

                    {/* Message */}
                    <div className="relative">
                      <label
                        htmlFor="message"
                        className="block text-[10px] tracking-[0.25em] text-[#A39E93] uppercase font-sans mb-2"
                      >
                        Bespoke Architectural Requirements
                      </label>
                      <textarea
                        id="message"
                        rows={3}
                        value={formData.message}
                        onChange={(e) =>
                          setFormData({ ...formData, message: e.target.value })
                        }
                        placeholder="Indicate custom joinery, security requirements, or chauffeur parking needs."
                        className="w-full bg-transparent border-0 border-b border-[rgba(245,241,234,0.2)] pb-2 text-sm text-[#F5F1EA] font-sans placeholder-[#6E6961] focus:outline-none focus:border-[#A8895C] transition-colors resize-none rounded-none"
                      />
                    </div>

                    {/* Submit Action */}
                    <div className="pt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <button
                        type="submit"
                        className="w-full sm:w-auto px-8 py-3.5 bg-[#A8895C] text-[#0D0D0D] text-[10px] tracking-[0.3em] font-semibold uppercase hover:bg-[#c4a475] transition-colors duration-200"
                      >
                        Confirm Viewing Schedule
                      </button>
                      <span className="text-[9px] tracking-[0.15em] text-[#A39E93] uppercase font-mono">
                        Strict Confidentiality Assured
                      </span>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </SmoothScrollProvider>
    </CurrencyProvider>
  );
}
