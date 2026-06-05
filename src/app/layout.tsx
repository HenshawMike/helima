import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/* ─── Viewport (themeColor lives here since Next.js 14) ─── */
export const viewport: Viewport = {
  themeColor: "#09071c",
};

/* ─── Metadata / SEO ─── */
export const metadata: Metadata = {
  metadataBase: new URL("https://helima.com"),

  title: {
    default: "Helima — Premium Fashion & Lifestyle",
    template: "%s | Helima",
  },
  description:
    "Discover premium fashion and lifestyle products at Helima — curated with care, delivered with love.",
  keywords: [
    "Helima",
    "Helima store",
    "Helima fashion",
    "Helima clothing",
    "Helima official",
    "Helima online shop",
    "fashion",
    "lifestyle",
    "premium",
    "ecommerce",
    "online store",
    "buy online",
    "shop online",
    "online boutique",
    "luxury store",
    "direct to consumer",
    "global delivery",
    "curated collection",
    "luxury fashion",
    "premium apparel",
    "designer clothes",
    "luxury accessories",
    "elegant outfits",
    "high fashion",
    "streetwear",
    "stylish wear",
    "premium garments",
    "boutique apparel",
    "high-end clothing",
    "fashion boutique",
    "curated style",
    "aesthetic outfits",
    "modern wardrobe",
    "sleek style",
    "mens fashion",
    "womens fashion",
    "unisex luxury",
    "minimalist fashion",
    "streetwear fashion",
    "elegant style",
    "luxury fashion boutique",
    "clean aesthetic fashion",
    "solid style",
    "contemporary fashion",
    "premium t-shirts",
    "designer jackets",
    "luxury streetwear",
    "luxury bags",
    "fashion accessories",
    "minimal jewelry",
    "premium shoes",
    "high-quality footwear",
    "luxury sneakers",
    "stylish caps",
    "curated imports",
    "imported luxury goods",
    "global goods",
    "premium fashion Nigeria",
    "luxury store Lagos",
    "Abuja luxury fashion",
    "online boutique Nigeria",
    "secure checkout Nigeria",
    "designer clothing",
    "urban fashion",
    "modern streetwear",
    "unisex apparel",
    "luxury brand",
    "high quality shirts",
    "trendy clothing",
    "designer shoes",
    "premium bags",
    "fashion collection",
    "style catalog",
    "lifestyle boutique",
    "exclusive wear",
    "classy clothing",
    "chic outfits",
    "smart casual wear",
    "hypebeast fashion",
    "athleisure premium",
    "luxury wear",
    "designer brand online",
    "high-end accessories",
    "authentic products",
    "verified quality clothing",
    "fast delivery fashion",
    "premium online shopping",
    "curated clothing store",
    "helima shopping",
    "secure payment store",
    "lifestyle products online",
    "imported clothing",
    "exclusive designer items",
    "high quality hoodies",
    "luxury pants",
    "minimalist wardrobe essentials",
    "elevated basics",
    "timeless fashion pieces",
    "statement jackets",
    "premium leather goods",
    "finest fabric apparel",
    "luxury shopping site",
    "premium clothing brand"
  ],
  applicationName: "Helima",
  category: "ecommerce",

  /* ── Icons ── */
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any", type: "image/x-icon" },
      { url: "/favicon-48x48.png", sizes: "48x48", type: "image/png" },
      {
        url: "/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
    apple: [
      {
        url: "/apple-icon-180x180.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  },

  /* ── Manifest ── */
  manifest: "/manifest.webmanifest",

  /* ── Open Graph ── */
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://helima.com",
    siteName: "Helima",
    title: "Helima — Premium Fashion & Lifestyle",
    description:
      "Discover premium fashion and lifestyle products at Helima — curated with care, delivered with love.",
    images: [
      {
        url: "/helima.png",
        width: 1200,
        height: 630,
        alt: "Helima — Premium Fashion & Lifestyle",
      },
    ],
  },

  /* ── Twitter Card ── */
  twitter: {
    card: "summary_large_image",
    title: "Helima — Premium Fashion & Lifestyle",
    description:
      "Discover premium fashion and lifestyle products at Helima — curated with care, delivered with love.",
    images: ["/helima.png"],
  },

  /* ── Robots ── */
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  /* ── Microsoft Tile / Legacy ── */
  other: {
    "msapplication-TileColor": "#ffffff",
    "msapplication-TileImage": "/ms-icon-144x144.png",
    "msapplication-config": "/browserconfig.xml",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
