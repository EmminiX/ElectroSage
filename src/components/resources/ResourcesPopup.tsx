"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, 
  ExternalLink, 
  BookOpen, 
  Video, 
  Calculator, 
  Globe, 
  GraduationCap, 
  Wrench,
  Zap,
  FileText,
  Youtube,
  Book,
  Monitor
} from "lucide-react";
import Button from "@/components/ui/Button";

interface Resource {
  id: string;
  title: string;
  description: string;
  url: string;
  category: 'reference' | 'tools' | 'videos' | 'courses' | 'simulators' | 'documentation';
  icon: React.ComponentType<any>;
  isPremium?: boolean;
}

interface ResourcesPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const resources: Resource[] = [
  // Reference Materials
  {
    id: "nist-ref",
    title: "NIST Physical Constants",
    description: "Authoritative physical constants and electrical units from NIST",
    url: "https://physics.nist.gov/cuu/Constants/",
    category: "reference",
    icon: FileText
  },
  {
    id: "electronics-tutorials",
    title: "Electronics Tutorials",
    description: "Comprehensive electronics and electrical engineering tutorials",
    url: "https://www.electronics-tutorials.ws/",
    category: "reference",
    icon: BookOpen
  },
  {
    id: "all-about-circuits",
    title: "All About Circuits",
    description: "Free electrical engineering textbooks and circuit analysis",
    url: "https://www.allaboutcircuits.com/",
    category: "reference",
    icon: Book
  },

  // Educational Videos
  {
    id: "khan-academy",
    title: "Khan Academy - Electrical Engineering",
    description: "Free electrical engineering courses and circuit analysis",
    url: "https://www.khanacademy.org/science/electrical-engineering",
    category: "videos",
    icon: GraduationCap
  },
  {
    id: "eevblog",
    title: "EEVblog",
    description: "Popular electronics engineering video blog and tutorials",
    url: "https://www.eevblog.com/",
    category: "videos",
    icon: Youtube
  },
  {
    id: "mit-circuits",
    title: "MIT 6.002x Circuits Course",
    description: "MIT's introduction to circuits and electronics on edX",
    url: "https://www.edx.org/course/circuits-and-electronics",
    category: "courses",
    icon: GraduationCap
  },

  // Online Tools and Simulators
  {
    id: "falstad-simulator",
    title: "Falstad Circuit Simulator",
    description: "Interactive circuit simulator for testing and learning",
    url: "https://www.falstad.com/circuit/",
    category: "simulators",
    icon: Monitor
  },
  {
    id: "online-calculator",
    title: "Electrical Engineering Calculators",
    description: "Comprehensive collection of electrical engineering calculators",
    url: "https://www.rapidtables.com/calc/electric/",
    category: "tools",
    icon: Calculator
  },
  {
    id: "multisim-live",
    title: "Multisim Live",
    description: "Free online circuit simulation from National Instruments",
    url: "https://www.multisim.com/",
    category: "simulators",
    icon: Zap,
    isPremium: true
  },

  // Professional Resources
  {
    id: "ieee",
    title: "IEEE Xplore Digital Library",
    description: "Premier research database for electrical engineering",
    url: "https://ieeexplore.ieee.org/",
    category: "reference",
    icon: Globe,
    isPremium: true
  },
  {
    id: "nec-code",
    title: "National Electrical Code (NEC)",
    description: "US standard for electrical installation and safety",
    url: "https://www.nfpa.org/codes-and-standards/all-codes-and-standards/list-of-codes-and-standards/detail?code=70",
    category: "documentation",
    icon: Wrench,
    isPremium: true
  },

  // Additional Learning Platforms
  {
    id: "coursera-circuits",
    title: "Coursera - Circuit Analysis",
    description: "University-level circuit analysis courses",
    url: "https://www.coursera.org/courses?query=circuit%20analysis",
    category: "courses",
    icon: GraduationCap
  }
];

const categoryConfig = {
  reference: { name: "Reference Materials", color: "blue", icon: BookOpen },
  tools: { name: "Calculation Tools", color: "green", icon: Calculator },
  videos: { name: "Educational Videos", color: "red", icon: Video },
  courses: { name: "Online Courses", color: "purple", icon: GraduationCap },
  simulators: { name: "Circuit Simulators", color: "orange", icon: Monitor },
  documentation: { name: "Standards & Codes", color: "gray", icon: FileText }
};

export default function ResourcesPopup({ isOpen, onClose }: ResourcesPopupProps) {
  const [activeCategory, setActiveCategory] = useState<string>('reference');

  const categories = Object.keys(categoryConfig) as Array<keyof typeof categoryConfig>;
  const filteredResources = resources.filter(resource => resource.category === activeCategory);

  const handleResourceClick = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Popup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-4 md:inset-8 lg:inset-16 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-electric-50 to-blue-50 dark:from-electric-900/20 dark:to-blue-900/20">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-electric-100 dark:bg-electric-900/30 rounded-lg">
                  <Globe className="w-6 h-6 text-electric-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Learning Resources
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Curated external resources to deepen your electrical engineering knowledge
                  </p>
                </div>
              </div>
              <Button
                onClick={onClose}
                variant="ghost"
                size="sm"
                className="rounded-full w-10 h-10 p-0"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="flex flex-1 overflow-hidden">
              {/* Category Sidebar */}
              <div className="w-64 bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 p-4">
                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-4">
                  Categories
                </h3>
                <div className="space-y-2">
                  {categories.map((category) => {
                    const config = categoryConfig[category];
                    const IconComponent = config.icon;
                    const isActive = activeCategory === category;
                    
                    return (
                      <button
                        key={category}
                        onClick={() => setActiveCategory(category)}
                        className={`w-full flex items-center space-x-3 p-3 rounded-lg text-left transition-colors ${
                          isActive
                            ? 'bg-electric-100 dark:bg-electric-900/30 text-electric-700 dark:text-electric-300'
                            : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        <IconComponent className={`w-5 h-5 ${
                          isActive ? 'text-electric-600' : 'text-gray-500'
                        }`} />
                        <span className="font-medium text-sm">{config.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Resources Content */}
              <div className="flex-1 p-6 overflow-y-auto">
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {categoryConfig[activeCategory as keyof typeof categoryConfig].name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Click any resource to open it in a new tab
                  </p>
                </div>

                <div className="grid gap-4">
                  {filteredResources.map((resource) => {
                    const IconComponent = resource.icon;
                    
                    return (
                      <motion.div
                        key={resource.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer group"
                        onClick={() => handleResourceClick(resource.url)}
                      >
                        <div className="flex items-start space-x-4">
                          <div className="flex-shrink-0">
                            <div className="w-12 h-12 bg-gray-100 dark:bg-gray-600 rounded-lg flex items-center justify-center group-hover:bg-electric-100 dark:group-hover:bg-electric-900/30 transition-colors">
                              <IconComponent className="w-6 h-6 text-gray-600 dark:text-gray-400 group-hover:text-electric-600 transition-colors" />
                            </div>
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 mb-1">
                              <h4 className="font-semibold text-gray-900 dark:text-white group-hover:text-electric-600 transition-colors">
                                {resource.title}
                              </h4>
                              {resource.isPremium && (
                                <span className="px-2 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 text-xs font-medium rounded">
                                  Premium
                                </span>
                              )}
                              <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-electric-500 transition-colors" />
                            </div>
                            <p className="text-gray-600 dark:text-gray-400 text-sm">
                              {resource.description}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-900">
              <div className="flex items-center justify-between">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  External resources open in new tabs • Some resources may require registration
                </p>
                <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
                  <span>Found {filteredResources.length} resources</span>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}