"use client";

import { ReactNode } from "react";
import { AccessibilityProvider } from "@/contexts/AccessibilityContext";
import { ProgressProvider } from "@/contexts/ProgressContext";
import Header from "@/components/layout/Header";

interface ClientLayoutProps {
  children: ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  return (
    <AccessibilityProvider data-oid="-l:oy19">
      <ProgressProvider data-oid="0s1a6qh">
        <Header data-oid="a25sp20" />
        <main id="main" className="relative" data-oid="bwiob7a">
          {children}
        </main>
      </ProgressProvider>
    </AccessibilityProvider>
  );
}
