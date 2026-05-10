import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import "@/styles/globals.css";
import ClientLayout from "@/components/layout/ClientLayout";
import StructuredData from "@/components/StructuredData";


export const metadata: Metadata = {
  metadataBase: new URL("https://electrosage.emmi.zone"),
  title: {
    default: "ElectroSage Academy - Master Electrical Engineering with AI",
    template: "%s | ElectroSage Academy"
  },
  description:
    "Comprehensive electrical education platform featuring AI-powered Socratic tutoring, 14 interactive visualizations, educational podcasts, voice-to-text learning, and professional circuit building tools. Master electrical engineering from fundamentals to advanced concepts.",
  keywords: [
    "electrical engineering education",
    "AI-powered tutoring",
    "Socratic method learning",
    "interactive visualizations",
    "circuit builder",
    "electrical engineering course",
    "STEM education platform",
    "OpenAI GPT-4",
    "voice-to-text learning",
    "electrical safety training",
    "atomic structure visualization",
    "AC waveform analysis",
    "transformer visualization",
    "electrical measurements",
    "Ohm's law calculator",
    "series parallel circuits",
    "electrical components",
    "accessibility education",
    "engineering podcasts",
    "ElectroSage Academy"
  ],
  authors: [{ name: "ElectroSage Academy Team" }],
  creator: "ElectroSage Academy",
  publisher: "ElectroSage Academy",
  applicationName: "ElectroSage Academy",
  generator: "Next.js",
  referrer: "origin-when-cross-origin",
  category: "Education",
  classification: "Educational Technology",
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://electrosage.emmi.zone",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://electrosage.emmi.zone",
    title: "ElectroSage Academy - Master Electrical Engineering with AI",
    description:
      "Revolutionary electrical education platform with AI-powered Socratic tutoring, 14 interactive visualizations, educational podcasts, and voice-to-text learning. Perfect for students, professionals, and institutions.",
    siteName: "ElectroSage Academy",
    images: [
      {
        url: "/electrosage-screenshot.jpg",
        width: 1200,
        height: 630,
        alt: "ElectroSage Academy - AI-Powered Electrical Engineering Education Platform featuring interactive circuit builder, AI tutor chat, and comprehensive learning modules",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@ElectroSageAcad",
    creator: "@ElectroSageAcad",
    title: "ElectroSage Academy - Master Electrical Engineering with AI",
    description:
      "Revolutionary electrical education platform with AI-powered Socratic tutoring, 14 interactive visualizations, and voice-to-text learning.",
    images: ["/electrosage-screenshot.jpg"],
  },
  verification: {
    google: "your-google-verification-code",
    yandex: "your-yandex-verification-code",
    yahoo: "your-yahoo-verification-code",
    other: {
      "msvalidate.01": "your-bing-verification-code",
    },
  },
  appleWebApp: {
    capable: true,
    title: "ElectroSage Academy",
    statusBarStyle: "default",
  },
  formatDetection: {
    telephone: false,
  },
  other: {
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
    "theme-color": "#0284c7",
    "msapplication-TileColor": "#0284c7",
    "msapplication-config": "/browserconfig.xml",
    // LinkedIn-specific meta tags
    "article:author": "ElectroSage Academy Team",
    "article:section": "Education Technology",
    "article:tag": "Electrical Engineering, AI Education, EdTech, STEM Learning, Interactive Visualizations",
    // Additional professional metadata
    "og:type": "website",
    "og:site_name": "ElectroSage Academy",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-oid="pcldwnh">
      <head data-oid="._oblg9">
        {/* Fonts are loaded in _document.tsx */}
        <link rel="manifest" href="/manifest.json?v=2" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/icons/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/icons/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/icons/favicon-16x16.png" />
        <meta name="msapplication-TileColor" content="#0284c7" />
        <meta name="theme-color" content="#0284c7" />
      </head>
      <body className="antialiased bg-gray-50 animations-enabled" data-oid="7qpeq2m">
        <StructuredData />
        <a href="#main" className="skip-link" data-oid="d5ntef0">
          Skip to main content
        </a>
        <ClientLayout data-oid="s62qade">{children}</ClientLayout>
        <Analytics />
      </body>
    </html>
  );
}
