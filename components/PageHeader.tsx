"use client";

import React from "react";

interface PageHeaderProps {
  number: string;
  eyebrow: string;
  title: string;
  subtitle?: string;
  description?: string;
}

export default function PageHeader({
  number,
  eyebrow,
  title,
  subtitle,
  description,
}: PageHeaderProps) {
  return (
    <div className="relative w-full pt-36 pb-20 md:pt-44 md:pb-24 px-6 md:px-12 lg:px-20 border-b border-[rgba(245,241,234,0.12)] bg-[#141414]">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center space-x-4 mb-6">
          <span className="text-[10px] tracking-[0.35em] text-[#A8895C] uppercase font-sans font-medium">
            {number} / {eyebrow}
          </span>
          <div className="h-[1px] w-12 bg-[#A8895C]/40" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
          <div className="lg:col-span-8">
            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl tracking-[0.06em] font-light text-[#F5F1EA] uppercase leading-[1.1]">
              {title} {subtitle && <span className="italic text-[#A8895C] block mt-2 font-normal">{subtitle}</span>}
            </h1>
          </div>

          {description && (
            <div className="lg:col-span-4">
              <p className="text-xs md:text-sm text-[#A39E93] font-sans font-light leading-relaxed tracking-wide">
                {description}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
