"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface AudioControllerProps {
  src?: string;
}

export default function AudioController({
  src = "/audio/Sunlight_on_Marble.mp3",
}: AudioControllerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const isInsideHeroRef = useRef<boolean>(true);
  const isUserMutedRef = useRef<boolean>(false);
  const hasInteractedRef = useRef<boolean>(false);

  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // Smooth audio volume fade utility
  const fadeAudio = (targetVolume: number, duration = 350, onComplete?: () => void) => {
    const audio = audioRef.current;
    if (!audio) return;

    if (targetVolume > 0 && audio.paused) {
      audio.play().catch(() => {});
    }

    const startVolume = audio.volume;
    const startTime = performance.now();

    const animateVolume = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);
      audio.volume = Math.max(0, Math.min(1, startVolume + (targetVolume - startVolume) * progress));

      if (progress < 1) {
        requestAnimationFrame(animateVolume);
      } else {
        if (targetVolume === 0) {
          audio.pause();
        }
        if (onComplete) onComplete();
      }
    };

    requestAnimationFrame(animateVolume);
  };

  useEffect(() => {
    const audio = new Audio(src);
    audio.loop = true;
    audio.volume = 0; // Starts silent, fades in smoothly
    audioRef.current = audio;

    // Start playback when user scrolls or clicks anywhere
    const handleFirstInteraction = () => {
      if (!hasInteractedRef.current && audioRef.current) {
        hasInteractedRef.current = true;
        if (isInsideHeroRef.current && !isUserMutedRef.current) {
          audioRef.current
            .play()
            .then(() => {
              fadeAudio(0.45, 400);
              setIsPlaying(true);
            })
            .catch(() => {
              setIsPlaying(false);
            });
        }
      }
    };

    window.addEventListener("scroll", handleFirstInteraction, { passive: true, once: true });
    window.addEventListener("click", handleFirstInteraction, { passive: true, once: true });
    window.addEventListener("touchstart", handleFirstInteraction, { passive: true, once: true });

    // GSAP ScrollTrigger: Plays continuously across all hero frames (from top 0% to bottom 100%) and when scrolling back
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: "#hero-section",
        start: "top top",
        end: "+=450%", // Exact pinned scroll distance
        onUpdate: (self) => {
          // Inside hero frames: progress between 0 and 0.999
          const isInside = self.progress >= 0 && self.progress < 0.999;

          if (isInside) {
            if (!isInsideHeroRef.current) {
              isInsideHeroRef.current = true;
              if (hasInteractedRef.current && !isUserMutedRef.current) {
                fadeAudio(0.45, 350);
                setIsPlaying(true);
              }
            }
          } else {
            // Scrolled past the hero frames into subsequent sections
            if (isInsideHeroRef.current) {
              isInsideHeroRef.current = false;
              fadeAudio(0, 250, () => {
                setIsPlaying(false);
              });
            }
          }
        },
        onLeave: () => {
          isInsideHeroRef.current = false;
          fadeAudio(0, 250, () => {
            setIsPlaying(false);
          });
        },
        onEnterBack: () => {
          isInsideHeroRef.current = true;
          if (hasInteractedRef.current && !isUserMutedRef.current) {
            fadeAudio(0.45, 350);
            setIsPlaying(true);
          }
        },
      });
    });

    return () => {
      ctx.revert();
      window.removeEventListener("scroll", handleFirstInteraction);
      window.removeEventListener("click", handleFirstInteraction);
      window.removeEventListener("touchstart", handleFirstInteraction);
      audio.pause();
      audio.src = "";
      audioRef.current = null;
    };
  }, [src]);

  const toggleSound = () => {
    const audio = audioRef.current;
    if (!audio) return;

    hasInteractedRef.current = true;

    if (!isPlaying || isMuted) {
      // User explicitly unmuting/starting
      isUserMutedRef.current = false;
      setIsMuted(false);
      if (isInsideHeroRef.current) {
        fadeAudio(0.45, 300);
        setIsPlaying(true);
      }
    } else {
      // User explicitly muting
      isUserMutedRef.current = true;
      setIsMuted(true);
      fadeAudio(0, 250, () => {
        setIsPlaying(false);
      });
    }
  };

  const soundActive = isPlaying && !isMuted;

  return (
    <div className="fixed bottom-6 left-6 md:bottom-8 md:left-8 z-40 select-none">
      <button
        type="button"
        onClick={toggleSound}
        className="group flex items-center space-x-3 bg-[#141414]/90 border border-[rgba(245,241,234,0.18)] hover:border-[#A8895C] px-3.5 py-2 transition-all duration-300 shadow-none focus:outline-none"
        aria-label={soundActive ? "Mute audio" : "Unmute audio"}
      >
        {/* Minimal Animated Equalizer / Speaker Icon */}
        <div className="flex items-center space-x-0.5 h-3.5 w-3.5 justify-center">
          {soundActive ? (
            <>
              <span className="w-[1.5px] h-3 bg-[#A8895C] animate-[pulse_0.8s_ease-in-out_infinite]" />
              <span className="w-[1.5px] h-2 bg-[#A8895C] animate-[pulse_0.6s_ease-in-out_infinite_0.2s]" />
              <span className="w-[1.5px] h-3.5 bg-[#A8895C] animate-[pulse_1s_ease-in-out_infinite_0.4s]" />
            </>
          ) : (
            <svg
              className="w-3.5 h-3.5 stroke-[#A39E93] group-hover:stroke-[#A8895C] stroke-[1.2] fill-none transition-colors"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M11 5L6 9H2v6h4l5 4V5z" />
              <line x1="23" y1="9" x2="17" y2="15" />
              <line x1="17" y1="9" x2="23" y2="15" />
            </svg>
          )}
        </div>

        {/* Minimal Audio Status Label */}
        <span className="text-[9px] tracking-[0.25em] font-mono text-[#A39E93] group-hover:text-[#F5F1EA] uppercase transition-colors">
          {soundActive ? "Sound On" : "Sound Off"}
        </span>
      </button>
    </div>
  );
}
