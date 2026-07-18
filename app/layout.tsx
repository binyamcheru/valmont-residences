import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "The Valmont Residences — Private Estates | Valmont & Co.",
  description:
    "A limited collection of architecturally distinguished luxury residences overlooking private parklands. Developed by Valmont & Co. Estates.",
  keywords: [
    "The Valmont Residences",
    "Valmont Estates",
    "Valmont & Co",
    "Luxury Residences",
    "Private Estate",
    "Architectural Penthouse",
    "Mayfair Parkland",
  ],
  authors: [{ name: "Valmont & Co. Estates" }],
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
  openGraph: {
    title: "The Valmont Residences — Private Estates",
    description:
      "A limited collection of architecturally distinguished luxury residences overlooking private parklands.",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/logo.svg",
        width: 512,
        height: 512,
        alt: "The Valmont Monogram",
      },
    ],
  },
};

export const viewport: Viewport = {
  themeColor: "#141414",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${plusJakarta.variable} bg-[#141414] text-[#F5F1EA] antialiased`}
    >
      <body className="min-h-screen bg-[#141414] text-[#F5F1EA] font-sans selection:bg-[#A8895C] selection:text-[#0D0D0D]">
        {children}
      </body>
    </html>
  );
}
