# Master Blueprint: High-Performance Scroll-Driven Video & Canvas Scrubbing

> **A Comprehensive Guide & Master AI Prompt for Building 60fps, Zero-Lag, Apple-Grade Scroll-Scrubbed Web Experiences.**

---

## 📋 Table of Contents
1. [Core Architectural Philosophy](#1-core-architectural-philosophy)
2. [Approach A: Canvas 2D WebP Sequence (The Apple Standard)](#2-approach-a-canvas-2d-webp-sequence-the-apple-standard)
3. [Approach B: HTML5 Video In-Memory Blob Scrubbing](#3-approach-b-html5-video-in-memory-blob-scrubbing)
4. [Video Encoding Guide (H.264 & Next-Gen AV1)](#4-video-encoding-guide-h264--next-gen-av1)
5. [Critical Performance Traps & How to Avoid Them](#5-critical-performance-traps--how-to-avoid-them)
6. [Next.js & CDN Edge Caching Configuration](#6-nextjs--cdn-edge-caching-configuration)
7. [The Master Copy-Paste AI Prompt](#7-the-master-copy-paste-ai-prompt)

---

## 1. Core Architectural Philosophy

When building scroll-driven media scrubbing (where user scroll position directly dictates the video timestamp or image frame):

| Requirement | Why Traditional Approaches Fail | The High-Performance Solution |
| :--- | :--- | :--- |
| **Instant First Frame** | Waiting for a 40MB MP4 blocks interaction for 10+ seconds. | Render Frame 0 in <50ms with a lightweight WebP poster image. |
| **Zero Network Lag** | Scrubbing a `<video>` over standard HTTP fires dozens of HTTP 206 Range requests, causing network connection pool exhaustion and stalls. | Use either **Canvas 2D WebP Sequences** OR **In-Memory Blob URL Prefetching** so seeking happens 100% in local RAM. |
| **60fps / 120fps Smoothness** | Direct synchronous drawing inside scroll event listeners blocks the browser's main thread. | Decouple the scroll listener from rendering using a dedicated `requestAnimationFrame` render loop. |
| **No React Re-render Lag** | Calling `setState` inside scroll/GSAP `onUpdate` forces React to re-render the DOM tree 60 times/sec. | Use mutable `useRef` handles and direct DOM style manipulation for all high-frequency updates. |

---

## 2. Approach A: Canvas 2D WebP Sequence (The Apple Standard)

Used by Apple, Porsche, and Nike for buttery-smooth interactive product walkthroughs.

### Architecture Highlights:
- **360 WebP Frames** (~15–30 KB each, total ~6–9 MB).
- **Concurrent Stream Pool**: 24 parallel HTTP/2 downloads via sliding-window queue (no artificial pauses).
- **GPU Hardware Decoding**: `img.decode()` offloads image decompression from the main CPU thread to the GPU.
- **Decoupled rAF Loop**: The canvas redraws only when `targetFrame !== currentDrawnFrame` at the monitor's native refresh rate (60Hz/120Hz/144Hz).
- **Retina DPR Scaling**: Canvas pixel dimensions must be multiplied by `window.devicePixelRatio` (2x on Retina, 3x on some phones) and scaled down via CSS to avoid blurry output.
- **IntersectionObserver Pause**: The rAF render loop should skip draws when the hero is scrolled out of viewport, saving GPU cycles on the rest of the page.

### Core Implementation Pattern:

```tsx
"use client";

import React, { useEffect, useRef, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

const TOTAL_FRAMES = 360;

export default function ScrollVideoHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<(HTMLImageElement | null)[]>(new Array(TOTAL_FRAMES).fill(null));
  const currentDrawnFrameRef = useRef<number>(-1);
  const targetFrameRef = useRef<number>(0);
  const isVisibleRef = useRef<boolean>(true);

  const getFrameSrc = useCallback((index: number) => {
    const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
    const folder = isMobile ? "mobile" : "desktop";
    const frameNum = String(index + 1).padStart(4, "0");
    return `/frames/${folder}/frame_${frameNum}.webp`;
  }, []);

  // Draw frame to canvas with aspect-ratio cover
  const drawFrame = useCallback((frameIndex: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    const img = imagesRef.current[frameIndex];
    if (!img || !img.complete || img.naturalWidth === 0) return;

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    const cw = canvas.width;
    const ch = canvas.height;
    const imgRatio = img.naturalWidth / img.naturalHeight;
    const canvasRatio = cw / ch;

    let drawW = cw, drawH = ch, offsetX = 0, offsetY = 0;
    if (canvasRatio > imgRatio) {
      drawH = cw / imgRatio;
      offsetY = (ch - drawH) / 2;
    } else {
      drawW = ch * imgRatio;
      offsetX = (cw - drawW) / 2;
    }

    ctx.drawImage(img, offsetX, offsetY, drawW, drawH);
  }, []);

  // Decoupled 60fps/120fps Render Loop with Nearest Available Frame Fallback
  useEffect(() => {
    let animId: number;

    const findClosestAvailableFrame = (target: number): number => {
      // 1. Direct match if already loaded
      const direct = imagesRef.current[target];
      if (direct && direct.complete && direct.naturalWidth > 0) return target;

      // 2. Scan backwards for closest loaded frame (prevents freezing on scroll)
      for (let i = target - 1; i >= 0; i--) {
        const img = imagesRef.current[i];
        if (img && img.complete && img.naturalWidth > 0) return i;
      }

      // 3. Scan forwards if nothing found backwards
      for (let i = target + 1; i < TOTAL_FRAMES; i++) {
        const img = imagesRef.current[i];
        if (img && img.complete && img.naturalWidth > 0) return i;
      }

      return 0; // Fallback to Frame 0
    };

    const renderLoop = () => {
      if (isVisibleRef.current) {
        const target = targetFrameRef.current;
        const bestFrame = findClosestAvailableFrame(target);
        if (bestFrame !== currentDrawnFrameRef.current) {
          currentDrawnFrameRef.current = bestFrame;
          drawFrame(bestFrame);
        }
      }
      animId = requestAnimationFrame(renderLoop);
    };

    animId = requestAnimationFrame(renderLoop);
    return () => cancelAnimationFrame(animId);
  }, [drawFrame]);

  // High-Throughput 24-Stream Concurrent Preloader
  useEffect(() => {
    let isCancelled = false;

    const loadSingleImage = (index: number): Promise<void> => {
      return new Promise((resolve) => {
        const img = new Image();
        img.src = getFrameSrc(index);
        const onDone = () => {
          if (isCancelled) return;
          imagesRef.current[index] = img;
          if (index === 0 && currentDrawnFrameRef.current < 0) {
            currentDrawnFrameRef.current = 0;
            targetFrameRef.current = 0;
            drawFrame(0);
          }
          resolve();
        };
        img.onload = () => {
          if (typeof img.decode === "function") {
            img.decode().then(onDone).catch(onDone);
          } else {
            onDone();
          }
        };
        img.onerror = () => onDone();
      });
    };

    const startPreloader = async () => {
      await loadSingleImage(0); // Priority 1: First frame instant render
      if (isCancelled) return;

      const CONCURRENCY = 24;
      let currentIndex = 1;
      const worker = async () => {
        while (currentIndex < TOTAL_FRAMES && !isCancelled) {
          const idx = currentIndex++;
          await loadSingleImage(idx);
        }
      };
      await Promise.all(Array.from({ length: CONCURRENCY }, () => worker()));
    };

    startPreloader();
    return () => { isCancelled = true; };
  }, [drawFrame, getFrameSrc]);

  // GSAP ScrollTrigger Binding
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: container,
        start: "top top",
        end: "+=450%",
        pin: true,
        scrub: true,
        onUpdate: (self) => {
          const frameIndex = Math.min(
            TOTAL_FRAMES - 1,
            Math.max(0, Math.floor(self.progress * TOTAL_FRAMES))
          );
          targetFrameRef.current = frameIndex;
        },
      });
    }, container);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="relative w-full h-screen bg-[#141414] overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full object-cover" />
    </section>
  );
}
```

---

## 3. Approach B: HTML5 Video In-Memory Blob Scrubbing

Used when you want to use genuine MP4 video files without suffering from HTTP 206 Range request cancellations.

### The Problem:
Setting `video.currentTime = targetTime` over a standard HTTP URL forces the browser to cancel in-flight HTTP requests and send new range requests 60 times/sec. This floods Chrome's network pool, causing **"Stalled"** status and severe skipping.

### The Solution (In-Memory Blob URL Prefetching):
1. Download video chunks into RAM once via `fetch(src).then(res => res.blob())`.
2. Convert the Blob to a local object URL: `URL.createObjectURL(blob)`.
3. Point `<video src={blobUrl}>`.
4. Now, all `video.currentTime` seek operations execute in **local RAM at 0ms network latency** with zero HTTP requests.

### Core Implementation Pattern:

```tsx
useEffect(() => {
  let isMounted = true;
  const createdUrls: string[] = [];

  const loadBlobs = async () => {
    for (let i = 0; i < videoParts.length; i++) {
      try {
        const res = await fetch(videoParts[i]);
        if (!res.ok) throw new Error("Fetch failed");
        const blob = await res.blob();
        if (!isMounted) return;

        const url = URL.createObjectURL(blob);
        createdUrls.push(url);

        if (videoRefs.current[i]) {
          videoRefs.current[i]!.src = url;
          videoRefs.current[i]!.load();
        }
      } catch {
        // Fallback to static src if blob fetch fails
      }
    }
  };

  loadBlobs();
  return () => {
    isMounted = false;
    createdUrls.forEach((url) => URL.revokeObjectURL(url));
  };
}, [videoParts]);
```

---

## 4. Video Encoding & Frame Extraction Guide

### 4A. How to Extract WebP Frames from a Source Video

If you have a source MP4/MOV video and need to produce the 360-frame WebP sequence:

```bash
# Step 1: Extract 360 frames from a video (evenly spaced across entire duration)
ffmpeg -i source_video.mp4 -vf "select='not(mod(n\,N))',setpts=N/FRAME_RATE/TB" -frames:v 360 -q:v 80 public/frames/desktop/frame_%04d.webp

# Step 2: Create mobile-optimized versions (720px wide, quality 75)
for file in public/frames/desktop/*.webp; do
  cwebp -q 75 -resize 720 0 "$file" -o "public/frames/mobile/$(basename $file)"
done
```

> **Tip**: If you have a 3D render (Blender, Unreal, etc.), export directly as a PNG/WebP image sequence at 1920×1080 for desktop and 720×1280 for mobile. No video encoding needed.

### 4B. Mandatory Rule for Scrubbable Videos: Every-Frame Keyframes (`-g 1`)
Standard videos place keyframes (I-frames) every 1–2 seconds. For scroll scrubbing, **every frame must be a keyframe** so the decoder never has to interpolate backwards.

### 4C. Scrub-Ready H.264 (Every-Frame Keyframes)
```bash
# Desktop (1080p, CRF 18, 15fps, All Keyframes)
ffmpeg -i input.mp4 -c:v libx264 -preset slow -crf 18 -r 15 -g 1 -keyint_min 1 -movflags +faststart -an output_desktop.mp4

# Mobile (720p, CRF 20, 15fps, All Keyframes)
ffmpeg -i input.mp4 -c:v libx264 -preset slow -crf 20 -r 15 -g 1 -keyint_min 1 -vf scale=720:-2 -movflags +faststart -an output_mobile.mp4
```

### 4D. High-Fidelity AV1 Encoding (For Background/Ambient Autoplay — 85% Smaller)
```bash
# AV1 10-bit Crystal Clarity (Crushes 20MB down to ~3MB with zero blur)
ffmpeg -i input.mp4 -c:v libsvtav1 -pix_fmt yuv420p10le -crf 22 -preset 4 -svtav1-params tune=0 -movflags +faststart -an output_av1.mp4
```

> **AV1 is 100% free & open-source** (created by Google, Apple, Netflix, Meta). Use it for background autoplay videos (non-scrubbed). For scroll-scrubbing, stick with WebP frame sequences.

---

## 5. Critical Performance Traps & How to Avoid Them

### ❌ Trap 1: React State in GSAP `onUpdate`
```tsx
// BAD: Re-renders the entire React component tree 60 times/sec!
onUpdate: (self) => {
  setActiveIndex(Math.floor(self.progress * 3));
}

// GOOD: Use refs and direct DOM manipulation
onUpdate: (self) => {
  const nextIdx = Math.floor(self.progress * 3);
  if (activeRef.current !== nextIdx) {
    activeRef.current = nextIdx;
    elementsRef.current.forEach((el, i) => {
      if (el) el.style.opacity = i === nextIdx ? "1" : "0";
    });
  }
}
```

### ❌ Trap 2: Preloader Restart Loops
If a loading progress callback `onLoadingProgress` is passed to a component and included in `useEffect` dependency arrays, every state update triggers effect teardown and restarts frame downloads from frame 0!
- **Solution**: Store callbacks in mutable refs:
```tsx
const onProgressRef = useRef(onLoadingProgress);
useEffect(() => { onProgressRef.current = onLoadingProgress; }, [onLoadingProgress]);

// Inside preloader effect — call via ref, NOT the prop directly:
onProgressRef.current?.(percent, loadedCount >= 20);

// Dependency array stays clean (no onLoadingProgress):
}, [drawFrame, getFrameSrc, resizeCanvas]);
```

### ❌ Trap 3: Heavy Desktop Frames (> 100 KB)
- Uncompressed desktop WebP frames (400 KB each × 360 frames = 144 MB) will saturate the network.
- Compress desktop frames with `q:v 80` to keep them at **~20 KB each** (~7 MB total).

### ❌ Trap 4: Forgetting Canvas Retina DPR Scaling
```tsx
// BAD: Canvas looks blurry on Retina/HiDPI displays
canvas.width = canvas.clientWidth;
canvas.height = canvas.clientHeight;

// GOOD: Scale by device pixel ratio
const dpr = window.devicePixelRatio || 1;
canvas.width = canvas.clientWidth * dpr;
canvas.height = canvas.clientHeight * dpr;
```

### ❌ Trap 5: Not Pausing the rAF Loop When Off-Screen
The render loop runs continuously even when the user scrolls past the hero section, wasting GPU cycles.
```tsx
// Use IntersectionObserver to toggle isVisibleRef
useEffect(() => {
  const container = containerRef.current;
  if (!container) return;
  const observer = new IntersectionObserver(
    ([entry]) => { isVisibleRef.current = entry.isIntersecting; },
    { threshold: 0 }
  );
  observer.observe(container);
  return () => observer.disconnect();
}, []);
```

### ❌ Trap 6: Dark Overlays That Kill Frame Quality
Adding `bg-black/30` over the canvas for text contrast makes the entire walkthrough look dim and washed out. Use `bg-black/5` or no overlay at all — give text contrast via per-overlay backdrop cards (`bg-[#141414]/85`) instead.

---

## 6. Next.js & CDN Edge Caching Configuration

Add long-term immutable caching headers in `next.config.ts` so all media assets load from local disk RAM on repeat visits:

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/frames/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/video/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
```

---

## 7. Lenis Smooth Scroll Integration

GSAP ScrollTrigger works best when paired with **Lenis** for buttery inertia scrolling. Wrap your app in a `SmoothScrollProvider`:

```tsx
"use client";
import { ReactNode, useEffect, useRef } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

export default function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.08,
      smoothWheel: true,
      syncTouch: true,
    });
    lenisRef.current = lenis;

    // Bridge Lenis → GSAP ScrollTrigger
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  return <>{children}</>;
}
```

---

## 8. Accessibility: Reduced Motion Fallback

Always provide a static fallback for users who have `prefers-reduced-motion: reduce` enabled:

```tsx
const [reducedMotion, setReducedMotion] = useState(false);

useEffect(() => {
  setReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
}, []);

if (reducedMotion) {
  return (
    <section className="relative w-full min-h-[90vh] flex items-center justify-center bg-[#141414] px-6">
      <div className="text-center">
        <h1 className="font-serif text-5xl md:text-7xl text-[#F5F1EA] uppercase">The Belmoor</h1>
        <p className="text-[#A39E93] mt-4">A private residential sanctuary on the parklands</p>
      </div>
    </section>
  );
}
```

---

## 9. Mobile-Specific Optimizations

| Concern | Desktop | Mobile |
| :--- | :--- | :--- |
| **Frame resolution** | 1920×1080 (~20-30 KB/frame) | 720×1280 (~10-15 KB/frame) |
| **Concurrent streams** | 24 | 12–16 (mobile browsers have fewer connections) |
| **Touch scrolling** | N/A | Use Lenis `syncTouch: true` for native-feeling inertia |
| **Total payload** | ~7–9 MB | ~3.5–5 MB |
| **Detection** | `window.innerWidth >= 768` | `window.innerWidth < 768` |

Detect on mount (not reactively during resize) to avoid re-downloading the wrong frame set:
```tsx
const isMobileRef = useRef(false);
useEffect(() => {
  isMobileRef.current = window.innerWidth < 768;
}, []);
```

---

## 10. The Master Copy-Paste AI Prompt

> *Copy and paste this prompt into any AI (Claude, ChatGPT, Gemini, etc.) to build a production-ready scroll scrubbing hero from scratch in any new project:*

```text
Act as a Senior Creative Frontend Engineer specializing in high-performance interactive media experiences. Build a 60fps scroll-driven media walkthrough hero component.

Tech stack: Next.js 15 App Router, TypeScript, Tailwind CSS, GSAP ScrollTrigger, Lenis Smooth Scroll.

Follow these STRICT performance engineering principles learned from real production deployments:

═══════════════════════════════════════════════════════════
1. RENDERING ARCHITECTURE (Canvas 2D / WebP Image Sequence)
═══════════════════════════════════════════════════════════
- Render a 360-frame WebP sequence from /frames/desktop/frame_0001.webp to frame_0360.webp.
- Serve /frames/mobile/ for viewports < 768px (detected once on mount via useRef, NOT reactively).
- Canvas MUST be scaled by window.devicePixelRatio (DPR) for Retina clarity:
    canvas.width = canvas.clientWidth * dpr;
    canvas.height = canvas.clientHeight * dpr;
- Draw frames using ctx.drawImage() with aspect-ratio "cover" math (compare canvas vs image ratios).
- Implement a DECOUPLED requestAnimationFrame render loop:
    - The loop runs continuously at the monitor refresh rate (60/120/144 Hz).
    - It only calls ctx.drawImage() when targetFrameRef.current !== currentDrawnFrameRef.current.
    - It checks isVisibleRef.current (set by IntersectionObserver) and skips draws when off-screen.
- Use img.decode() for async GPU hardware decoding before storing in imagesRef.

═══════════════════════════════════════════════════════════
2. HIGH-THROUGHPUT CONCURRENT PRELOADER
═══════════════════════════════════════════════════════════
- Instantly fetch and draw Frame 0 (< 50ms) so the hero is never blank.
- Then launch a 24-stream sliding-window concurrent worker pool:
    const CONCURRENCY = 24;
    let currentIndex = 1;
    const worker = async () => {
      while (currentIndex < TOTAL_FRAMES && !isCancelled) {
        const idx = currentIndex++;
        await loadSingleImage(idx);
      }
    };
    await Promise.all(Array.from({ length: CONCURRENCY }, () => worker()));
- Do NOT use chunked batches with setTimeout pauses between them.
- If a parent passes onLoadingProgress as a prop, store it in a useRef to prevent effect restarts:
    const onProgressRef = useRef(onLoadingProgress);
    useEffect(() => { onProgressRef.current = onLoadingProgress; }, [onLoadingProgress]);
    // Call via ref inside preloader: onProgressRef.current?.(percent, isReady);
    // Do NOT include onLoadingProgress in the preloader useEffect dependency array.

═══════════════════════════════════════════════════════════
3. GSAP SCROLLTRIGGER BINDING
═══════════════════════════════════════════════════════════
- Pin the section for 450% scroll distance:
    ScrollTrigger.create({ trigger, start: "top top", end: "+=450%", pin: true, scrub: true })
- NEVER call React setState inside onUpdate. It re-renders the entire tree 60x/sec.
- Map progress (0.0–1.0) directly to targetFrameRef.current = Math.floor(progress * TOTAL_FRAMES).
- Narrative text overlays (e.g., 3 sections at 0-18%, 35-55%, 75-95%) must be controlled via
  direct ref.style.opacity and ref.style.transform manipulation, NOT conditional JSX rendering.
- Use IntersectionObserver to toggle isVisibleRef so the rAF loop pauses when the hero is off-screen.

═══════════════════════════════════════════════════════════
4. LENIS SMOOTH SCROLL INTEGRATION
═══════════════════════════════════════════════════════════
- Wrap the app in a SmoothScrollProvider that creates a Lenis instance.
- Bridge Lenis to GSAP: lenis.on("scroll", ScrollTrigger.update) and gsap.ticker.add((t) => lenis.raf(t * 1000)).
- Disable GSAP lag smoothing: gsap.ticker.lagSmoothing(0).
- Use Lenis options: { lerp: 0.08, smoothWheel: true, syncTouch: true }.

═══════════════════════════════════════════════════════════
5. CINEMATIC INTRO / LOADING SCREEN
═══════════════════════════════════════════════════════════
- Create a full-screen intro overlay (z-[100]) that plays a GSAP timeline on mount:
    Step 1: Logo emblem descends with power3.out (0.9s)
    Step 2: Developer name eyebrow text falls into place with letter-spacing expansion (0.8s)
    Step 3: Brand title letters stagger-fall individually (stagger: 0.04, rotateX: -45 → 0, back.out ease)
    Step 4: Gold accent line expands from center (scaleX: 0 → 1)
    Step 5: Tagline and location float upward
    Step 6: Hold for ~1.2s (lets 24-stream pool buffer frames)
    Step 7: All text lifts away (opacity → 0, y → -30)
    Step 8: Full-screen dark backdrop slides up (yPercent: -100, power4.inOut, 1.0s)
- Lock body scroll (overflow: hidden) while intro plays; restore on complete.
- Use a SINGLE solid backdrop div, NOT a split curtain (avoids visible seam line in the middle).

═══════════════════════════════════════════════════════════
6. VISUAL OVERLAY RULES
═══════════════════════════════════════════════════════════
- Do NOT place a heavy dark overlay (bg-black/30) over the canvas. It kills the natural brightness.
- Use bg-black/5 at most for a minimal veil.
- Give text overlays their own localized backdrop cards (e.g., bg-[#141414]/85 with border) instead.

═══════════════════════════════════════════════════════════
7. CACHING & CDN
═══════════════════════════════════════════════════════════
- Add immutable 1-year Cache-Control headers for /frames/** and /video/** in next.config.ts:
    Cache-Control: public, max-age=31536000, immutable
- This ensures repeat visits and page transitions load frames from disk cache in 0ms.

═══════════════════════════════════════════════════════════
8. ACCESSIBILITY
═══════════════════════════════════════════════════════════
- Detect prefers-reduced-motion: reduce and render a static fallback section with no scroll animation.

═══════════════════════════════════════════════════════════
9. MOBILE OPTIMIZATION
═══════════════════════════════════════════════════════════
- Serve smaller mobile frames (720px wide, ~10-15 KB each).
- Reduce concurrent streams from 24 to 12-16 on mobile.
- Detect mobile once on mount via useRef, not reactively during resize.
```
