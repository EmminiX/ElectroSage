import type { Metadata } from "next";
import "@/styles/globals.css";
import ClientLayout from "@/components/layout/ClientLayout";

export const metadata: Metadata = {
  title: "Basic Electricity Tutor",
  description:
    "Interactive web application for learning basic electricity concepts",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-oid="pcldwnh">
      <head data-oid="._oblg9">
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
          data-oid="qyk.oxt"
        />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
          data-oid="cs5oxib"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Lexend:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
          data-oid="oojuqhs"
        />
      </head>
      <body className="font-lexend antialiased bg-gray-50" data-oid="7qpeq2m">
        <a href="#main" className="skip-link" data-oid="d5ntef0">
          Skip to main content
        </a>
        <ClientLayout data-oid="s62qade">{children}</ClientLayout>
      </body>
    </html>
  );
}
