"use client";

import { useState } from "react";

interface ThreePanelLayoutProps {
  sidebar: React.ReactNode;
  content: React.ReactNode;
  chat: React.ReactNode;
  sidebarCollapsed?: boolean;
}

export default function ThreePanelLayout({
  sidebar,
  content,
  chat,
  sidebarCollapsed = false,
}: ThreePanelLayoutProps) {
  const [contentWidth, setContentWidth] = useState(50); // percentage of remaining space
  const [isResizing, setIsResizing] = useState(false);

  const handleMouseDown = () => {
    setIsResizing(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isResizing) return;

    const container = e.currentTarget as HTMLElement;
    const containerRect = container.getBoundingClientRect();
    const sidebarWidth = sidebarCollapsed ? 80 : 320; // 20 * 4 = 80px collapsed, 80 * 4 = 320px expanded
    const availableWidth = containerRect.width - sidebarWidth;
    const mouseX = e.clientX - containerRect.left - sidebarWidth;

    const newContentWidth = (mouseX / availableWidth) * 100;

    // Limit content width between 30% and 80% of available space
    if (newContentWidth >= 30 && newContentWidth <= 80) {
      setContentWidth(newContentWidth);
    }
  };

  const handleMouseUp = () => {
    setIsResizing(false);
  };

  const sidebarWidth = sidebarCollapsed ? "w-20" : "w-80";
  const chatWidth = 100 - contentWidth;

  return (
    <div
      className="flex w-full h-full bg-gray-50 overflow-hidden"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      data-oid="13bo99q"
    >
      {/* Navigation Sidebar - Fixed with internal scrolling */}
      <div
        className={`${sidebarWidth} flex-shrink-0 transition-all duration-200 h-full overflow-hidden`}
        data-oid="zde6nlp"
      >
        {sidebar}
      </div>

      {/* Content Panel - Only this scrolls */}
      <div
        className="bg-white border-r border-gray-200 overflow-auto flex-shrink-0 h-full"
        style={{ width: `${contentWidth}%` }}
        data-oid="pxvijni"
      >
        {content}
      </div>

      {/* Resize Handle */}
      <div
        className="w-1 bg-gray-200 hover:bg-gray-300 cursor-col-resize flex-shrink-0 transition-colors"
        onMouseDown={handleMouseDown}
        title="Drag to resize panels"
        data-oid="bd6f:lg"
      />

      {/* Chat Panel - Fixed height, internal scrolling */}
      <div
        className="bg-gray-50 overflow-hidden h-full flex flex-col"
        style={{ width: `${chatWidth}%` }}
        data-oid="-0i2cct"
      >
        {chat}
      </div>
    </div>
  );
}
