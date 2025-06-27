"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface SplitScreenProps {
  children: React.ReactNode;
}

export default function SplitScreen({ children }: SplitScreenProps) {
  const [leftWidth, setLeftWidth] = useState(60); // percentage
  const [isResizing, setIsResizing] = useState(false);

  const handleMouseDown = () => {
    setIsResizing(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isResizing) return;

    const containerWidth = e.currentTarget.clientWidth;
    const newLeftWidth = (e.clientX / containerWidth) * 100;

    // Limit width between 30% and 80%
    if (newLeftWidth >= 30 && newLeftWidth <= 80) {
      setLeftWidth(newLeftWidth);
    }
  };

  const handleMouseUp = () => {
    setIsResizing(false);
  };

  const contentChild = Array.isArray(children) ? children[0] : null;
  const chatChild = Array.isArray(children) ? children[1] : null;

  return (
    <div
      className="flex h-[calc(100vh-60px)] bg-gray-50 overflow-hidden"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      data-oid="1x4_.a4"
    >
      {/* Content Panel */}
      <div
        className="bg-white border-r border-gray-200 overflow-auto"
        style={{ width: `${leftWidth}%` }}
        data-oid="-8_r7mm"
      >
        {contentChild}
      </div>

      {/* Resizer */}
      <div
        className={`w-1 bg-gray-300 hover:bg-electric-500 cursor-col-resize flex items-center justify-center relative group ${
          isResizing ? "bg-electric-500" : ""
        }`}
        onMouseDown={handleMouseDown}
        data-oid="arg3_vx"
      >
        <div
          className="absolute inset-y-0 -left-1 -right-1 flex items-center justify-center"
          data-oid="sqimdx1"
        >
          <div
            className="opacity-0 group-hover:opacity-100 bg-electric-500 text-white rounded-full p-1 transition-opacity"
            data-oid="a0jh._j"
          >
            <ChevronLeft className="w-3 h-3" data-oid="vfys.a0" />
            <ChevronRight className="w-3 h-3" data-oid=".14l:ai" />
          </div>
        </div>
      </div>

      {/* Chat Panel */}
      <div
        className="bg-gray-100 overflow-hidden"
        style={{ width: `${100 - leftWidth}%` }}
        data-oid="hc-.e50"
      >
        {chatChild}
      </div>
    </div>
  );
}
