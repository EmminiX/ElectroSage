"use client";

import { useState } from "react";
import { Settings, BookOpen, Menu, User, BarChart3 } from "lucide-react";
import Button from "@/components/ui/Button";
import { useAccessibility } from "@/contexts/AccessibilityContext";
import { useProgress } from "@/contexts/ProgressContext";
import { useContent } from "@/hooks/useContent";

interface HeaderProps {
  // Props are now optional since we get data from useContent
}
export default function Header() {
  const [showSections, setShowSections] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showProgress, setShowProgress] = useState(false);
  const { accessibility, updateAccessibility, resetSettings } =
    useAccessibility();
  const { getOverallProgress, progress, getSectionProgress } = useProgress();
  const { sections, currentSection, navigateToSection } = useContent();

  const overallProgress = getOverallProgress();

  return (
    <header
      className="bg-white border-b border-gray-200 px-4 py-2 relative"
      data-oid="eregg3n"
    >
      <div className="flex items-center justify-between" data-oid="b-nft:.">
        <div className="flex items-center gap-4" data-oid="1_rt4m0">
          <div className="flex items-center gap-2" data-oid="jmzz9oa">
            <BookOpen
              className="w-6 h-6 text-electric-600"
              data-oid="_bax17d"
            />
            <h1 className="text-xl font-bold text-gray-900" data-oid="g3fx:qy">
              Basic Electricity Tutor
            </h1>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowSections(!showSections)}
            className="flex items-center gap-2"
            data-oid="61wi4_t"
          >
            <Menu className="w-4 h-4" data-oid="2r3en0q" />
            Sections
          </Button>
        </div>

        <div className="flex items-center gap-2" data-oid="lccf-qo">
          {/* Progress indicator */}
          <div
            className="flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-full"
            data-oid=":qeufog"
          >
            <BarChart3
              className="w-4 h-4 text-electric-600"
              data-oid="ce9.yk6"
            />
            <span
              className="text-sm font-medium text-gray-700"
              data-oid="v5_abi9"
            >
              {overallProgress}%
            </span>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowSettings(!showSettings)}
            title="Settings"
            data-oid="290yx.c"
          >
            <Settings className="w-4 h-4" data-oid="d371u1m" />
          </Button>
        </div>
      </div>

      {/* Section Dropdown */}
      {showSections && (
        <div
          className="absolute top-full left-4 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 w-80"
          data-oid="75twxa:"
        >
          <div className="p-2" data-oid="61p_ppk">
            <h3 className="font-semibold text-gray-700 mb-2" data-oid="xiufta:">
              Learning Sections
            </h3>
            <div className="max-h-60 overflow-y-auto" data-oid="o_btm23">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => {
                    navigateToSection(section.id);
                    setShowSections(false);
                  }}
                  className={`w-full text-left p-2 rounded hover:bg-gray-100 text-sm ${
                    currentSection?.id === section.id
                      ? "bg-electric-50 text-electric-700"
                      : "text-gray-700"
                  }`}
                  data-oid="_znvqso"
                >
                  {section.title}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Settings Dropdown */}
      {showSettings && (
        <div
          className="absolute top-full right-4 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 w-64"
          data-oid="r8nu0qd"
        >
          <div className="p-4" data-oid="h2up:_k">
            <h3 className="font-semibold text-gray-700 mb-3" data-oid="j2p6qwf">
              Accessibility Settings
            </h3>

            <div className="space-y-3" data-oid="o6-9_k8">
              <div data-oid="h3_y1i9">
                <label
                  className="block text-sm text-gray-600 mb-1"
                  data-oid="1y_ms.r"
                >
                  Font Size
                </label>
                <select
                  className="w-full p-2 border border-gray-300 rounded text-sm"
                  value={accessibility.fontSize}
                  onChange={(e) =>
                    updateAccessibility({ fontSize: e.target.value as any })
                  }
                  data-oid="g.pt:wr"
                >
                  <option value="small" data-oid="w_1lrpf">
                    Small
                  </option>
                  <option value="normal" data-oid="9e885ju">
                    Normal
                  </option>
                  <option value="large" data-oid="8n_0hkt">
                    Large
                  </option>
                  <option value="extra-large" data-oid="ks66374">
                    Extra Large
                  </option>
                </select>
              </div>

              <div data-oid="v9es-vl">
                <label
                  className="block text-sm text-gray-600 mb-1"
                  data-oid="mgv6aaz"
                >
                  Font Family
                </label>
                <select
                  className="w-full p-2 border border-gray-300 rounded text-sm"
                  value={accessibility.fontFamily}
                  onChange={(e) =>
                    updateAccessibility({ fontFamily: e.target.value as any })
                  }
                  data-oid="d4xk8ry"
                >
                  <option value="lexend" data-oid="wh6klvt">
                    Lexend (Recommended)
                  </option>
                  <option value="opendyslexic" data-oid="2l.jwi-">
                    OpenDyslexic
                  </option>
                  <option value="dyslexie" data-oid="jrit9il">
                    Dyslexie
                  </option>
                  <option value="atkinson" data-oid="aw84l3r">
                    Atkinson Hyperlegible
                  </option>
                </select>
              </div>

              <div className="flex items-center gap-2" data-oid="l:0jpgb">
                <input
                  type="checkbox"
                  id="high-contrast"
                  className="rounded"
                  checked={accessibility.highContrast}
                  onChange={(e) =>
                    updateAccessibility({ highContrast: e.target.checked })
                  }
                  data-oid="h..ky39"
                />

                <label
                  htmlFor="high-contrast"
                  className="text-sm text-gray-600"
                  data-oid="9xfvabc"
                >
                  High Contrast Mode
                </label>
              </div>

              <div className="flex items-center gap-2" data-oid="nf39qtu">
                <input
                  type="checkbox"
                  id="reduced-motion"
                  className="rounded"
                  checked={accessibility.reducedMotion}
                  onChange={(e) =>
                    updateAccessibility({ reducedMotion: e.target.checked })
                  }
                  data-oid="nsza1f-"
                />

                <label
                  htmlFor="reduced-motion"
                  className="text-sm text-gray-600"
                  data-oid="_-kxupk"
                >
                  Reduce Motion
                </label>
              </div>

              <div className="flex items-center gap-2" data-oid="_e5mm0c">
                <input
                  type="checkbox"
                  id="focus-mode"
                  className="rounded"
                  checked={accessibility.focusMode}
                  onChange={(e) =>
                    updateAccessibility({ focusMode: e.target.checked })
                  }
                  data-oid="ggf7vdl"
                />

                <label
                  htmlFor="focus-mode"
                  className="text-sm text-gray-600"
                  data-oid="k5nz89j"
                >
                  Focus Mode
                </label>
              </div>

              <div className="pt-2 border-t border-gray-200" data-oid=":33ua2_">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={resetSettings}
                  className="w-full"
                  data-oid="jora46j"
                >
                  Reset to Defaults
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Click outside to close dropdowns */}
      {(showSections || showSettings) && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => {
            setShowSections(false);
            setShowSettings(false);
          }}
          data-oid="1he3ncb"
        />
      )}
    </header>
  );
}
