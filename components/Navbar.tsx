"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import CurrencySwitcher from "./CurrencySwitcher";

export default function Navbar() {
  const navRef = useRef<HTMLElement>(null);
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;

    const ctx = gsap.context(() => {
      // Smart Auto-Hide on Scroll Down / Reveal on Scroll Up
      ScrollTrigger.create({
        start: "top top",
        end: "max",
        onUpdate: (self) => {
          const currentY = self.scroll();
          const direction = self.direction;

          if (currentY > 120 && direction === 1) {
            gsap.to(nav, {
              yPercent: -100,
              duration: 0.35,
              ease: "power2.out",
              overwrite: "auto",
            });
          } else {
            gsap.to(nav, {
              yPercent: 0,
              duration: 0.35,
              ease: "power2.out",
              overwrite: "auto",
            });
          }

          if (currentY > 80) {
            gsap.to(nav, {
              backgroundColor: "rgba(20, 20, 20, 0.85)",
              borderBottomColor: "rgba(245, 241, 234, 0.08)",
              backdropFilter: "blur(12px)",
              duration: 0.3,
              overwrite: "auto",
            });
          } else {
            gsap.to(nav, {
              backgroundColor: "transparent",
              borderBottomColor: "transparent",
              backdropFilter: "blur(0px)",
              duration: 0.3,
              overwrite: "auto",
            });
          }

          lastScrollY.current = currentY;
        },
      });
    });

    return () => ctx.revert();
  }, [pathname]);

  const navLinks = [
    { name: "Walkthrough", href: "/" },
    { name: "Residences", href: "/residences" },
    { name: "Amenities", href: "/amenities" },
    { name: "Location", href: "/location" },
    { name: "Enquire", href: "/enquire", isButton: true },
  ];

  return (
    <>
      <header
        ref={navRef}
        className="fixed top-0 left-0 right-0 z-40 h-20 transition-transform duration-300 border-b border-transparent bg-transparent"
        style={{ willChange: "transform, background-color, border-color" }}
      >
        <div className="max-w-7xl mx-auto h-full px-6 md:px-12 flex items-center justify-between">
          {/* Brand Logo / Wordmark */}
          <Link href="/" className="group flex items-center space-x-3">
            <svg
              className="w-8 h-8 text-[#A8895C] transition-transform duration-300 group-hover:scale-105"
              viewBox="0 0 512 512"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="512" height="512" rx="108" fill="#1A1A1A" stroke="#A8895C" strokeWidth="12" opacity="0.8" />
              <g transform="translate(256, 256)" stroke="#A8895C" strokeWidth="18" strokeLinecap="round" strokeLinejoin="round" fill="none">
                <path d="M -90 -100 L 0 110 L 90 -100" />
                <line x1="-110" y1="-100" x2="-70" y2="-100" />
                <line x1="70" y1="-100" x2="110" y2="-100" />
              </g>
            </svg>
            <div className="flex flex-col">
              <span className="font-serif text-lg md:text-xl tracking-[0.22em] text-[#F5F1EA] uppercase font-light transition-colors group-hover:text-[#A8895C]">
                The Valmont
              </span>
              <span className="text-[8px] tracking-[0.3em] text-[#A39E93] uppercase font-sans -mt-0.5">
                Valmont & Co. Estates
              </span>
            </div>
          </Link>

          {/* Desktop Navigation & Currency Switcher */}
          <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
            <nav className="flex items-center space-x-6 lg:space-x-8">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;

                if (link.isButton) {
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`text-[11px] uppercase tracking-[0.22em] px-4 py-2 transition-all duration-200 rounded-[1px] border ${
                        isActive
                          ? "border-[#A8895C] text-[#A8895C] bg-[#141414]"
                          : "text-[#F5F1EA] border-[rgba(245,241,234,0.3)] hover:border-[#A8895C] hover:text-[#A8895C]"
                      }`}
                    >
                      {link.name}
                    </Link>
                  );
                }

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`text-[11px] uppercase tracking-[0.22em] transition-colors duration-200 relative py-1 ${
                      isActive
                        ? "text-[#F5F1EA] font-medium"
                        : "text-[#A39E93] hover:text-[#F5F1EA]"
                    }`}
                  >
                    {link.name}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-[1px] bg-[#A8895C]" />
                    )}
                  </Link>
                );
              })}
            </nav>

            <div className="pl-2 border-l border-[rgba(245,241,234,0.12)]">
              <CurrencySwitcher />
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden flex flex-col justify-center items-center w-8 h-8 space-y-1.5 focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            <span
              className={`w-5 h-[1px] bg-[#F5F1EA] transition-transform duration-300 ${
                mobileOpen ? "rotate-45 translate-y-[7px]" : ""
              }`}
            />
            <span
              className={`w-5 h-[1px] bg-[#F5F1EA] transition-opacity duration-300 ${
                mobileOpen ? "opacity-0" : "opacity-100"
              }`}
            />
            <span
              className={`w-5 h-[1px] bg-[#F5F1EA] transition-transform duration-300 ${
                mobileOpen ? "-rotate-45 -translate-y-[7px]" : ""
              }`}
            />
          </button>
        </div>
      </header>

      {/* Mobile Overlay Menu */}
      {mobileOpen && (
        <div className="fixed inset-0 z-30 bg-[#141414] pt-28 px-8 flex flex-col justify-between pb-12 md:hidden">
          <div className="space-y-6">
            <nav className="flex flex-col space-y-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`font-serif text-2xl tracking-[0.15em] uppercase border-b border-[rgba(245,241,234,0.08)] pb-3 ${
                    pathname === link.href ? "text-[#A8895C]" : "text-[#F5F1EA]"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            <div className="pt-4 flex items-center justify-between border-t border-[rgba(245,241,234,0.1)]">
              <span className="text-[10px] tracking-[0.2em] text-[#A39E93] uppercase font-mono">Currency:</span>
              <CurrencySwitcher />
            </div>
          </div>

          <div className="text-[10px] tracking-[0.25em] text-[#A39E93] uppercase font-sans">
            The Valmont &copy; {new Date().getFullYear()} Valmont & Co. Estates
          </div>
        </div>
      )}
    </>
  );
}
