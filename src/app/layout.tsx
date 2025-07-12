import type { Metadata } from "next";
import "@/styles/globals.css";
import ClientLayout from "@/components/layout/ClientLayout";

export const metadata: Metadata = {
  title: "ElectroSage Academy - Master Electrical Engineering with AI",
  description:
    "Comprehensive electrical education platform featuring AI-powered Socratic tutoring, 14 interactive visualizations, and professional circuit building tools. Master electrical engineering from fundamentals to advanced concepts.",
  keywords: [
    "electrical engineering",
    "electricity education",
    "AI tutor",
    "interactive learning",
    "circuit builder",
    "electrical visualization",
    "STEM education",
    "ElectroSage",
    "Socratic method",
    "physics"
  ],
  authors: [{ name: "ElectroSage Academy Team" }],
  creator: "ElectroSage Academy",
  publisher: "ElectroSage Academy",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    title: "ElectroSage Academy - Master Electrical Engineering with AI",
    description:
      "Comprehensive electrical education platform with AI-powered tutoring, interactive visualizations, and professional circuit tools.",
    siteName: "ElectroSage Academy",
  },
  twitter: {
    card: "summary_large_image",
    title: "ElectroSage Academy - Master Electrical Engineering with AI",
    description:
      "Comprehensive electrical education platform with AI-powered tutoring, interactive visualizations, and professional circuit tools.",
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
      </head>
      <body className="antialiased bg-gray-50 animations-enabled" data-oid="7qpeq2m">
        <a href="#main" className="skip-link" data-oid="d5ntef0">
          Skip to main content
        </a>
        <ClientLayout data-oid="s62qade">{children}</ClientLayout>
      </body>
    </html>
  );
}
