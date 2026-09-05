"use client";

import React, { useState } from "react";

interface DossierModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DossierModal({ isOpen, onClose }: DossierModalProps) {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    interest: "Penthouse Collection",
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const handleReset = () => {
    setSubmitted(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg bg-[#181818] border border-[#A8895C]/40 p-8 shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          type="button"
          aria-label="Close modal"
          className="absolute top-4 right-4 text-[#A39E93] hover:text-[#F5F1EA] text-xl font-mono p-2"
        >
          ✕
        </button>

        {!submitted ? (
          <div>
            <span className="text-[9px] tracking-[0.35em] text-[#A8895C] uppercase font-mono block mb-2">
              Valmont Private Office
            </span>
            <h3 className="font-serif text-2xl md:text-3xl text-[#F5F1EA] uppercase font-light mb-3">
              Request Architectural Dossier
            </h3>
            <p className="text-xs text-[#A39E93] font-sans leading-relaxed mb-6">
              Receive confidential floor plans, material specifications, and private pricing schedules for The Valmont Residences.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[9px] tracking-[0.2em] text-[#A39E93] uppercase font-mono mb-1">
                  Full Name *
                </label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Lord Alexander Sterling"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full bg-[#101010] border border-[rgba(245,241,234,0.15)] text-[#F5F1EA] px-3.5 py-2.5 text-xs focus:border-[#A8895C] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[9px] tracking-[0.2em] text-[#A39E93] uppercase font-mono mb-1">
                  Private Email *
                </label>
                <input
                  required
                  type="email"
                  placeholder="a.sterling@privateoffice.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-[#101010] border border-[rgba(245,241,234,0.15)] text-[#F5F1EA] px-3.5 py-2.5 text-xs focus:border-[#A8895C] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[9px] tracking-[0.2em] text-[#A39E93] uppercase font-mono mb-1">
                  Phone / WhatsApp (Optional)
                </label>
                <input
                  type="tel"
                  placeholder="+44 20 7946 0912"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-[#101010] border border-[rgba(245,241,234,0.15)] text-[#F5F1EA] px-3.5 py-2.5 text-xs focus:border-[#A8895C] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[9px] tracking-[0.2em] text-[#A39E93] uppercase font-mono mb-1">
                  Primary Interest
                </label>
                <select
                  value={formData.interest}
                  onChange={(e) => setFormData({ ...formData, interest: e.target.value })}
                  className="w-full bg-[#101010] border border-[rgba(245,241,234,0.15)] text-[#F5F1EA] px-3.5 py-2.5 text-xs focus:border-[#A8895C] focus:outline-none"
                >
                  <option value="Penthouse Collection">The Crown Penthouse (Floor 18-20)</option>
                  <option value="Parkland Suite">Parkland Suite (Floor 4-12)</option>
                  <option value="Sky Villa">Sky Villa (Floor 13-17)</option>
                  <option value="Entire Estate Investment">Entire Portfolio Enquiry</option>
                </select>
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  className="w-full py-3.5 bg-[#A8895C] text-[#0D0D0D] font-sans text-[10px] tracking-[0.3em] font-semibold uppercase hover:bg-[#c4a475] transition-colors"
                >
                  Download Dossier Package (PDF)
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="py-8 text-center space-y-4">
            <div className="w-12 h-12 mx-auto rounded-full border border-[#A8895C] flex items-center justify-center text-[#A8895C] font-mono text-xl">
              ✓
            </div>
            <h4 className="font-serif text-2xl text-[#F5F1EA] uppercase tracking-wide">
              Dossier Dispatched
            </h4>
            <p className="text-xs text-[#A39E93] max-w-sm mx-auto leading-relaxed">
              Thank you, <span className="text-[#F5F1EA]">{formData.fullName}</span>. The confidential architectural portfolio and private floor plans have been sent to <span className="text-[#A8895C]">{formData.email}</span>.
            </p>
            <div className="pt-4">
              <button
                type="button"
                onClick={handleReset}
                className="px-6 py-2.5 border border-[rgba(245,241,234,0.2)] text-[10px] tracking-[0.25em] text-[#F5F1EA] uppercase hover:border-[#A8895C] transition-colors"
              >
                Close & Return
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
