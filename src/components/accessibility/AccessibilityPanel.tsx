"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Settings,
  Eye,
  Type,
  Palette,
  Volume2,
  X,
  RotateCcw,
} from "lucide-react";
import { useAccessibility } from "@/contexts/AccessibilityContext";

interface AccessibilityPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AccessibilityPanel({ isOpen, onClose }: AccessibilityPanelProps) {
  const { accessibility, theme, updateAccessibility, updateTheme, resetSettings } = useAccessibility();
  const [activeTab, setActiveTab] = useState<"visual" | "reading" | "interaction">("visual");

  if (!isOpen) return null;

  const handleSettingsChange = (newSettings: Partial<typeof accessibility & typeof theme>) => {
    // Split settings between accessibility and theme
    const accKeys = ["fontSize", "fontFamily", "focusMode"];
    const themeKeys = ["colorScheme", "accentColor"];
    const accSettings: any = {};
    const themeSettings: any = {};
    Object.entries(newSettings).forEach(([key, value]) => {
      if (accKeys.includes(key)) accSettings[key] = value;
      if (themeKeys.includes(key)) themeSettings[key] = value;
    });
    if (Object.keys(accSettings).length) updateAccessibility(accSettings);
    if (Object.keys(themeSettings).length) updateTheme(themeSettings);
  };

  const resetToDefaults = () => {
    resetSettings();
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      data-oid="g2cylz9"
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full h-[520px] flex flex-col overflow-hidden"
        data-oid="ze7d07r"
      >
        {/* Header */}
        <div
          className="flex items-center justify-between p-6 border-b border-gray-200"
          data-oid="t91e999"
        >
          <div className="flex items-center space-x-2" data-oid="4re-2h.">
            <Settings className="w-5 h-5 text-blue-600" data-oid="ztxxkbd" />
            <h2
              className="text-xl font-semibold text-gray-900"
              data-oid="tqrfey-"
            >
              Accessibility Settings
            </h2>
          </div>
          <div className="flex items-center space-x-2" data-oid="wa4mtnd">
            <button
              onClick={resetToDefaults}
              className="flex items-center space-x-1 px-3 py-1 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded transition-colors"
              title="Reset to defaults"
              data-oid="1n:6jat"
            >
              <RotateCcw className="w-4 h-4" data-oid="g5c_zk5" />
              <span data-oid="8llm91v">Reset</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Close accessibility settings"
              data-oid="f3v2m5w"
            >
              <X className="w-5 h-5 text-gray-500" data-oid="dmwkjew" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 px-2" data-oid="mj8f8ra">
          {[
            { id: "visual", label: "Visual", icon: Eye },
            { id: "reading", label: "Reading", icon: Type },
            { id: "interaction", label: "Interaction", icon: Volume2 },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as any)}
              className={`flex items-center space-x-2 px-6 py-3 text-sm font-medium transition-colors ${
                activeTab === id
                  ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                  : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
              }`}
              data-oid="lzz20c_"
            >
              <Icon className="w-4 h-4" data-oid="e:2mavq" />
              <span data-oid="zk6jmv5">{label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 relative" data-oid="kwje5-8">
          <AnimatePresence mode="wait">
            {activeTab === "visual" && (
              <motion.div 
                key="visual"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                className="space-y-6 min-h-full" 
                data-oid="n4dkb1e"
              >
              {/* Color Scheme */}
              <div data-oid="xj1macm">
                <label
                  className="block text-sm font-medium text-gray-700 mb-3"
                  data-oid="rwpyxeu"
                >
                  Color Scheme
                </label>
                <div className="grid grid-cols-3 gap-3" data-oid="0gcro0h">
                  {[
                    {
                      value: "light",
                      label: "Light",
                      preview: "bg-white border-gray-300",
                    },
                    {
                      value: "dark",
                      label: "Dark",
                      preview: "bg-gray-900 border-gray-600",
                    },
                    {
                      value: "auto",
                      label: "Auto",
                      preview: "bg-gradient-to-r from-white to-gray-900",
                    },
                  ].map(({ value, label, preview }) => (
                    <button
                      key={value}
                      onClick={() =>
                        handleSettingsChange({ colorScheme: value as any })
                      }
                      className={`p-3 rounded-lg border-2 transition-all ${
                        theme.colorScheme === value
                          ? "border-blue-600 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      data-oid="6:2066w"
                    >
                      <div
                        className={`w-full h-8 rounded mb-2 ${preview}`}
                        data-oid="ltazb51"
                      />
                      <span className="text-sm font-medium" data-oid="9f692em">
                        {label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>



              {/* Accent Color */}
              <div data-oid="0-8xmyn">
                <label
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3"
                  data-oid="b-kdi7e"
                >
                  Accent Color
                </label>
                <div className="grid grid-cols-6 gap-2" data-oid="zkm7ep7">
                  {[
                    "#0066FF",
                    "#FF6B35",
                    "#FFD700",
                    "#10B981",
                    "#8B5CF6",
                    "#EF4444",
                  ].map((color) => (
                    <button
                      key={color}
                      onClick={() => handleSettingsChange({ accentColor: color })}
                      className={`w-10 h-10 rounded-full border-2 transition-all ${
                        theme.accentColor === color
                          ? "border-gray-800 dark:border-gray-200 scale-110"
                          : "border-gray-300 dark:border-gray-600 hover:scale-105"
                      }`}
                      style={{ backgroundColor: color }}
                      title={`Select ${color} as accent color`}
                      data-oid="qy42pdd"
                    />
                  ))}
                </div>
              </div>
              </motion.div>
            )}

            {activeTab === "reading" && (
              <motion.div 
                key="reading"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                className="space-y-6 min-h-full" 
                data-oid="t3th:0m"
              >
              {/* Font Size */}
              <div data-oid="_kjmgzu">
                <label
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3"
                  data-oid="pn:1tc6"
                >
                  Font Size
                </label>
                <div className="grid grid-cols-4 gap-3" data-oid="idj7p0z">
                  {[
                    { value: "small", label: "Small", size: "text-sm" },
                    { value: "normal", label: "Normal", size: "text-base" },
                    { value: "large", label: "Large", size: "text-lg" },
                    {
                      value: "extra-large",
                      label: "Extra Large",
                      size: "text-xl",
                    },
                  ].map(({ value, label, size }) => (
                    <button
                      key={value}
                      onClick={() =>
                        handleSettingsChange({ fontSize: value as any })
                      }
                      className={`p-3 rounded-lg border-2 transition-all ${
                        accessibility.fontSize === value
                          ? "border-blue-600 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/30"
                          : "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500"
                      }`}
                      data-oid="_p5tqur"
                    >
                      <div
                        className={`${size} font-medium mb-1`}
                        data-oid=".tym6v."
                      >
                        Aa
                      </div>
                      <span className="text-xs text-gray-700 dark:text-gray-300" data-oid="m26ltz.">
                        {label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Font Family */}
              <div data-oid="30-kgtp">
                <label
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3"
                  data-oid="33bc-jn"
                >
                  Font Family
                </label>
                <div className="space-y-2" data-oid="am7lenv">
                  {[
                    {
                      value: "lexend",
                      label: "Lexend (Recommended)",
                      description: "Optimized for reading proficiency",
                    },
                    {
                      value: "opendyslexic",
                      label: "OpenDyslexic",
                      description: "Designed for dyslexic readers",
                    },
                    {
                      value: "dyslexie",
                      label: "Dyslexie",
                      description: "Reduces reading errors",
                    },
                    {
                      value: "atkinson",
                      label: "Atkinson Hyperlegible",
                      description: "High clarity and readability",
                    },
                  ].map(({ value, label, description }) => (
                    <button
                      key={value}
                      onClick={() =>
                        handleSettingsChange({ fontFamily: value as any })
                      }
                      className={`w-full p-3 text-left rounded-lg border-2 transition-all ${
                        accessibility.fontFamily === value
                          ? "border-blue-600 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/30"
                          : "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500"
                      }`}
                      data-oid="kx.a3i4"
                    >
                      <div className="font-medium text-sm text-gray-900 dark:text-gray-100" data-oid="9jlme0_">
                        {label}
                      </div>
                      <div
                        className="text-xs text-gray-500 dark:text-gray-400 mt-1"
                        data-oid="6ue70t."
                      >
                        {description}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              </motion.div>
            )}

            {activeTab === "interaction" && (
              <motion.div 
                key="interaction"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                className="space-y-6 min-h-full" 
                data-oid="n63nc4b"
              >
              {/* Keyboard Shortcuts */}
              <div data-oid="d9nifmz">
                <h3
                  className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3"
                  data-oid="pea-.-d"
                >
                  Keyboard Shortcuts
                </h3>
                <div className="space-y-2 text-sm" data-oid="3ugk0.w">
                  <div
                    className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-700 rounded"
                    data-oid="57nltv7"
                  >
                    <span className="text-gray-900 dark:text-gray-100" data-oid="ls-e69w">Next Section</span>
                    <kbd
                      className="px-2 py-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded text-xs text-gray-900 dark:text-gray-100"
                      data-oid="mlmad75"
                    >
                      →
                    </kbd>
                  </div>
                  <div
                    className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-700 rounded"
                    data-oid="ofe7:hm"
                  >
                    <span className="text-gray-900 dark:text-gray-100" data-oid="2w_av-m">Previous Section</span>
                    <kbd
                      className="px-2 py-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded text-xs text-gray-900 dark:text-gray-100"
                      data-oid="rst31ke"
                    >
                      ←
                    </kbd>
                  </div>
                  <div
                    className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-700 rounded"
                    data-oid="zf-xeo4"
                  >
                    <span className="text-gray-900 dark:text-gray-100" data-oid="554bsgu">Toggle Navigation</span>
                    <kbd
                      className="px-2 py-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded text-xs text-gray-900 dark:text-gray-100"
                      data-oid="ga.:sx9"
                    >
                      Ctrl + N
                    </kbd>
                  </div>
                  <div
                    className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-700 rounded"
                    data-oid="m.xkg2f"
                  >
                    <span className="text-gray-900 dark:text-gray-100" data-oid="vo6osaq">Open Accessibility</span>
                    <kbd
                      className="px-2 py-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded text-xs text-gray-900 dark:text-gray-100"
                      data-oid="6b.no9p"
                    >
                      Ctrl + A
                    </kbd>
                  </div>
                  <div
                    className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-700 rounded"
                    data-oid="u2h2ic1"
                  >
                    <span className="text-gray-900 dark:text-gray-100" data-oid="t:w215r">Focus Mode</span>
                    <kbd
                      className="px-2 py-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded text-xs text-gray-900 dark:text-gray-100"
                      data-oid="zy:yw_j"
                    >
                      F
                    </kbd>
                  </div>
                </div>
              </div>

              {/* Screen Reader Info */}
              <div data-oid="t9h77d.">
                <h3
                  className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3"
                  data-oid="c.sj1k9"
                >
                  Screen Reader Support
                </h3>
                <div className="p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg" data-oid="p_-85ks">
                  <p className="text-sm text-blue-800 dark:text-blue-200" data-oid="4q_v6aj">
                    This application is optimized for screen readers with:
                  </p>
                  <ul
                    className="text-sm text-blue-700 dark:text-blue-300 mt-2 space-y-1"
                    data-oid="do.vfap"
                  >
                    <li data-oid="1ahg3od">• Semantic HTML structure</li>
                    <li data-oid="mqxjtnj">• ARIA labels and descriptions</li>
                    <li data-oid="f-syy9z">
                      • Live regions for dynamic updates
                    </li>
                    <li data-oid="c_rcp_x">
                      • Alternative text for visualizations
                    </li>
                  </ul>
                </div>
              </div>

              {/* Voice Control */}
              <div data-oid="x4qhc8y">
                <h3
                  className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3"
                  data-oid="_1tj.ps"
                >
                  Voice Control
                </h3>
                <div className="p-4 bg-green-50 dark:bg-green-900/30 rounded-lg" data-oid="v5abo3q">
                  <p className="text-sm text-green-800 dark:text-green-200" data-oid="mbx.mwx">
                    Compatible with voice control software. All interactive
                    elements can be activated using voice commands.
                  </p>
                </div>
              </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div
          className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 flex-shrink-0"
          data-oid="8c6xvm:"
        >
          <div className="flex items-center justify-between" data-oid="7rme:ar">
            <p className="text-xs text-gray-500 dark:text-gray-400" data-oid="kcr2al7">
              Settings are automatically saved and will persist across sessions.
            </p>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors text-sm font-medium"
              data-oid="cfj1y_w"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
