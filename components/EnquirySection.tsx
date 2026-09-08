"use client";

import React, { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function EnquirySection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    residenceInterest: "The Park Panorama Suite",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        section.querySelector(".enquiry-container"),
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
    }, section);

    return () => ctx.revert();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email) return;
    setSubmitted(true);
  };

  return (
    <section
      id="enquire"
      ref={sectionRef}
      className="relative w-full bg-[#141414] py-32 md:py-44 px-6 md:px-12 lg:px-20 border-t border-[rgba(245,241,234,0.12)]"
    >
      <div className="max-w-7xl mx-auto enquiry-container">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 pb-8 border-b border-[rgba(245,241,234,0.12)]">
          <div>
            <span className="text-[10px] tracking-[0.35em] text-[#A8895C] uppercase font-sans font-medium mb-3 block">
              05 / Private Consultation
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-[0.08em] font-light text-[#F5F1EA] uppercase leading-none">
              Acquisitions & Enquiry
            </h2>
          </div>
          <p className="mt-4 md:mt-0 text-xs md:text-sm text-[#A39E93] font-sans font-light max-w-sm tracking-wide">
            Private preview appointments are conducted discreetly at the Valmont Sales Gallery or via private presentation.
          </p>
        </div>

        {/* Form and Contact Information Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Direct Lines & Gallery Info (5 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-10">
            <div className="space-y-8">
              <div>
                <span className="text-[9px] tracking-[0.3em] text-[#A8895C] uppercase font-mono block mb-2">
                  Private Sales Gallery
                </span>
                <p className="font-serif text-xl sm:text-2xl text-[#F5F1EA] font-light leading-snug">
                  The Valmont Pavilion <br />
                  14 Valmont Gardens, Mayfair <br />
                  London W1K 7BN
                </p>
              </div>

              <div className="space-y-4 pt-6 border-t border-[rgba(245,241,234,0.08)]">
                <div>
                  <span className="text-[9px] tracking-[0.25em] text-[#A39E93] uppercase font-sans block mb-1">
                    Direct Appointments
                  </span>
                  <a
                    href="tel:+442079460912"
                    className="text-sm md:text-base font-mono text-[#F5F1EA] hover:text-[#A8895C] transition-colors"
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
                    className="text-sm md:text-base font-mono text-[#F5F1EA] hover:text-[#A8895C] transition-colors"
                  >
                    enquiries@thevalmont.com
                  </a>
                </div>

                <div>
                  <span className="text-[9px] tracking-[0.25em] text-[#A39E93] uppercase font-sans block mb-1">
                    Operating Hours
                  </span>
                  <span className="text-xs text-[#A39E93] font-sans">
                    Monday through Saturday, By Prior Arrangement Only
                  </span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-[#1A1A1A] border border-[rgba(245,241,234,0.1)] text-[10px] tracking-[0.15em] text-[#A39E93] uppercase font-mono">
              Represented Exclusively by Valmont & Co. Estates
            </div>
          </div>

          {/* Minimal Underlined Enquiry Form (7 cols) */}
          <div className="lg:col-span-7 bg-[#1A1A1A]/40 p-8 sm:p-12 border border-[rgba(245,241,234,0.12)]">
            {submitted ? (
              <div className="py-16 text-center space-y-4">
                <span className="text-[10px] tracking-[0.3em] text-[#A8895C] uppercase font-mono block">
                  Enquiry Received
                </span>
                <h3 className="font-serif text-3xl sm:text-4xl text-[#F5F1EA] uppercase font-light">
                  Thank You
                </h3>
                <p className="text-xs text-[#A39E93] max-w-md mx-auto font-sans leading-relaxed">
                  A Valmont Senior Advisor will make contact directly within twenty-four hours to coordinate your confidential review.
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="mt-6 text-[10px] tracking-[0.25em] uppercase text-[#A8895C] border border-[#A8895C] px-5 py-2.5 hover:bg-[#A8895C] hover:text-[#141414] transition-colors"
                >
                  Submit Another Enquiry
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

                {/* Email and Phone Grid */}
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

                {/* Residence Selection */}
                <div className="relative">
                  <label
                    htmlFor="residenceInterest"
                    className="block text-[10px] tracking-[0.25em] text-[#A39E93] uppercase font-sans mb-2"
                  >
                    Residence Preference
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

                {/* Specific Requirements / Notes */}
                <div className="relative">
                  <label
                    htmlFor="message"
                    className="block text-[10px] tracking-[0.25em] text-[#A39E93] uppercase font-sans mb-2"
                  >
                    Specific Architectural Requirements / Note
                  </label>
                  <textarea
                    id="message"
                    rows={3}
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    placeholder="Provide details regarding preferred timelines or private viewing requirements."
                    className="w-full bg-transparent border-0 border-b border-[rgba(245,241,234,0.2)] pb-2 text-sm text-[#F5F1EA] font-sans placeholder-[#6E6961] focus:outline-none focus:border-[#A8895C] transition-colors resize-none rounded-none"
                  />
                </div>

                {/* Submit Action (Single bordered button, no fill, brass focus/hover) */}
                <div className="pt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-8 py-3.5 border border-[#A8895C] text-[10px] tracking-[0.3em] uppercase text-[#F5F1EA] hover:bg-[#A8895C] hover:text-[#0D0D0D] transition-colors duration-200"
                  >
                    Submit Private Request
                  </button>
                  <span className="text-[9px] tracking-[0.15em] text-[#A39E93] uppercase font-mono">
                    Strict Confidentiality Assured
                  </span>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
