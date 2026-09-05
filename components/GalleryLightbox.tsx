"use client";

import React from "react";
import Image from "next/image";

interface LightboxProps {
  isOpen: boolean;
  imageSrc: string;
  imageAlt: string;
  caption?: string;
  onClose: () => void;
}

export default function GalleryLightbox({
  isOpen,
  imageSrc,
  imageAlt,
  caption,
  onClose,
}: LightboxProps) {
  if (!isOpen || !imageSrc) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative max-w-6xl w-full max-h-[90vh] flex flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          type="button"
          aria-label="Close lightbox"
          className="absolute -top-10 right-0 text-[#F5F1EA] hover:text-[#A8895C] text-2xl font-mono"
        >
          ✕
        </button>

        <div className="relative w-full aspect-[16/10] max-h-[80vh] border border-[#A8895C]/30 bg-[#0A0A0A] overflow-hidden">
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            className="object-contain"
            sizes="100vw"
            priority
          />
        </div>

        {caption && (
          <div className="mt-4 text-center">
            <span className="text-[10px] tracking-[0.3em] text-[#A8895C] font-mono uppercase block">
              Architectural Detail
            </span>
            <p className="text-xs text-[#F5F1EA] font-serif font-light mt-1 max-w-xl">
              {caption}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
