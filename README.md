# The Valmont Residences | Valmont & Co. Estates

A state-of-the-art, ultra-luxury digital experience crafted for **The Valmont Residences** — an exclusive collection of eighteen private parkland estates situated in Mayfair, London.

Designed with cinematic aesthetics, restrained dark-gold typography, and smooth interactive canvas scrubbers, this web application delivers an immersive architectural showcase.

---

## 🌟 Key Highlights & Features

### 🎬 60FPS Canvas Scroll-Scrubbing Hero
- **360° Architectural Tour**: Custom 2D Canvas scrubbing engine synced directly with **GSAP ScrollTrigger** and **Lenis Smooth Scroll**.
- **Decoupled Render Loop**: Zero-lag frame drawing with adaptive frame fallback to guarantee fluid 60fps/120fps performance across desktop and mobile devices.
- **Concurrent Preloader**: 24-parallel stream pool to pre-fetch image sequences into GPU memory.

### 💱 Dynamic Multi-Currency Converter
- **Live Currency Switcher**: Seamlessly toggle residence pricing between **GBP (£)**, **USD ($)**, **EUR (€)**, and **AED (AED)** across all main pages.
- **Global Context Provider**: Centralized React Context (`CurrencyProvider`) formatting prices in real time.

### 📐 Interactive Floor Plan Explorer
- **Residence Typology Inspector**: Detailed modal viewer on the `/residences` page for exploring private suites, garden villas, and crown penthouses.
- **Architectural Specifications**: Interactive breakdown of ceiling volumes (3.4m–4.2m), aspect orientations, room counts, and high-resolution layout diagrams.

### 📅 Private Acquisitions & Viewing Scheduler
- **Interactive Calendar & Time Slot Picker**: Schedule confidential previews at the Mayfair Sales Gallery or via private presentation.
- **Consultation Format Options**: Select between In-Person Gallery Tours, Virtual 3D Consultations, or On-Site Hardhat Walkthroughs.

### 🖼️ Architectural Dossier & Lightbox Modals
- **Dossier Request Modal**: Discrete modal interface for requesting confidential architectural brochures and private investment folios.
- **Fullscreen Lightbox**: High-resolution gallery viewer for inspecting fine materials, stone masonry, and interior details.

### 🎵 Ambient Acoustic Soundscape
- Integrated ambient audio controller featuring spatial soundscapes (*"Sunlight on Marble"*), complete with mute and volume adjustment.

---

## 🛠️ Technology Stack

| Domain | Technology |
|---|---|
| **Framework** | [Next.js 16](https://nextjs.org/) (App Router & Turbopack) |
| **Language** | [TypeScript](https://www.typescriptlang.org/) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) & Vanilla CSS Tokens |
| **Animation Engine** | [GSAP](https://gsap.com/) (ScrollTrigger) & [Lenis](https://lenis.darkroom.engineering/) |
| **Canvas Graphics** | HTML5 Canvas 2D Engine with GPU Acceleration |
| **Icons & Typography** | Lucide React & Google Fonts (Playfair Display, Inter, JetBrains Mono) |

---

## 📁 Repository Structure

```text
The-Valmont-Residences/
├── app/
│   ├── layout.tsx              # Global metadata, SEO tags, & layout wrapper
│   ├── page.tsx                # Cinematic Homepage with scroll scrubbing hero
│   ├── residences/page.tsx     # Residence collection & floor plan modal viewer
│   ├── amenities/page.tsx      # Wellness, private dining, & concierge details
│   ├── location/page.tsx       # Mayfair enclave map & neighborhood highlights
│   └── enquire/page.tsx        # Private acquisitions & viewing scheduler
├── components/
│   ├── Navbar.tsx              # Top navigation bar with CurrencySwitcher
│   ├── Footer.tsx              # Developer credentials & brand footer
│   ├── ScrollVideoHero.tsx     # 360-degree canvas scrubbing engine
│   ├── ResidencesHero.tsx      # Dedicated residence tour scrub hero
│   ├── CurrencySwitcher.tsx    # Multi-currency context provider & dropdown
│   ├── FloorPlanModal.tsx      # Interactive 2D/3D residence layout modal
│   ├── DossierModal.tsx        # Brochure & monograph request modal
│   ├── GalleryLightbox.tsx     # Fullscreen image lightbox viewer
│   ├── LoadingScreen.tsx       # Animated monogram curtain reveal
│   ├── IntroSection.tsx        # Spatial harmony & architectural reveals
│   ├── LocationSection.tsx     # Interactive enclave map markers
│   └── EnquirySection.tsx      # Acquisitions form & appointment scheduler
├── public/
│   ├── frames/                 # 360-degree WebP frame sequences (desktop/mobile)
│   ├── video/                  # Chunked video fallback streams
│   └── audio/                  # Ambient soundscapes
├── scripts/                    # Frame extraction pipeline scripts
└── docs/                       # Scroll scrubbing architecture blueprints
```

---

## 🚀 Local Development

### 1. Prerequisites
Ensure you have **Node.js 18+** and **npm** installed on your machine.

### 2. Installation
Clone the repository and install dependencies:

```bash
git clone https://github.com/binyamcheru/valmont-residences.git
cd valmont-residences
npm install
```

### 3. Running Locally
Start the Next.js development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

### 4. Building for Production
Validate types and generate optimized static pages:

```bash
npm run build
npm run start
```

---

## 👤 Author & Developer

**Binyam Cheru Debebe**
* **GitHub**: [@binyamcheru](https://github.com/binyamcheru)
* **Email**: binyamcheru123@gmail.com

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
