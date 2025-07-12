"use client";

import { motion } from "framer-motion";
import { ExternalLink, Zap, Globe, Leaf, Terminal, Calculator, Bot, BookOpen } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const projects = [
    {
      name: "Linux Learning",
      url: "https://linux.emmi.zone/",
      icon: Terminal,
      description: "Interactive Linux tutorials"
    },
    {
      name: "Green Ireland",
      url: "https://greencelt.emmi.zone/",
      icon: Leaf,
      description: "Environmental insights for Ireland"
    },
    {
      name: "EU Green Policies Bot",
      url: "https://github.com/EmminiX/Eu-Green-Agent",
      icon: Bot,
      description: "AI for EU environmental policies"
    }
  ];

  const comingSoon = [
    {
      name: "Math & Physics",
      icon: Calculator,
      description: "Interactive STEM learning"
    }
  ];

  return (
    <footer className="flex-shrink-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 shadow-lg">
      <div className="max-w-7xl mx-auto px-6 py-4">
        {/* Compact Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          
          {/* Brand Section */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-gradient-to-br from-electric-500 to-blue-600 rounded-lg">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white">ElectroSage Academy</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Master Electrical Engineering with AI</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Comprehensive electrical education platform with AI-powered Socratic tutoring, interactive visualizations, and professional circuit tools.
            </p>
          </div>

          {/* Educational Projects */}
          <div className="space-y-3">
            <h4 className="font-semibold text-gray-900 dark:text-white">Other Learning Platforms</h4>
            <div className="space-y-3">
              {projects.map((project) => {
                const IconComponent = project.icon;
                return (
                  <motion.a
                    key={project.name}
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group"
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="p-1.5 bg-blue-100 dark:bg-blue-900/30 rounded-md group-hover:bg-blue-200 dark:group-hover:bg-blue-800/50 transition-colors">
                      <IconComponent className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-1">
                        <span className="font-medium text-gray-900 dark:text-white text-sm truncate">
                          {project.name}
                        </span>
                        <ExternalLink className="w-3 h-3 text-gray-400 dark:text-gray-500 flex-shrink-0" />
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
                        {project.description}
                      </p>
                    </div>
                  </motion.a>
                );
              })}
            </div>
          </div>

          {/* Coming Soon */}
          <div className="space-y-3">
            <h4 className="font-semibold text-gray-900 dark:text-white">Coming Soon</h4>
            <div className="space-y-3">
              {comingSoon.map((project) => {
                const IconComponent = project.icon;
                return (
                  <div
                    key={project.name}
                    className="flex items-start space-x-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800 opacity-75"
                  >
                    <div className="p-1.5 bg-amber-100 dark:bg-amber-900/30 rounded-md">
                      <IconComponent className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-gray-900 dark:text-white text-sm">
                          {project.name}
                        </span>
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300">
                          Soon
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
                        {project.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Blog & Resources */}
          <div className="space-y-3">
            <h4 className="font-semibold text-gray-900 dark:text-white">Resources & Insights</h4>
            <motion.a
              href="https://emmi.zone/blogs.html"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group"
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="p-1.5 bg-purple-100 dark:bg-purple-900/30 rounded-md group-hover:bg-purple-200 dark:group-hover:bg-purple-800/50 transition-colors">
                <BookOpen className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-1">
                  <span className="font-medium text-gray-900 dark:text-white text-sm">
                    Tech Blog
                  </span>
                  <ExternalLink className="w-3 h-3 text-gray-400 dark:text-gray-500" />
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
                  Technical insights, tutorials & development stories
                </p>
              </div>
            </motion.a>

          </div>
        </div>

        {/* Bottom Section */}
        <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
            {/* Creator Attribution */}
            <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
              <span>Built with</span>
              <span className="text-red-500">♥</span>
              <span>by</span>
              <motion.a
                href="https://emmi.zone"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1 font-medium text-electric-600 dark:text-electric-400 hover:text-electric-700 dark:hover:text-electric-300 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Globe className="w-4 h-4" />
                <span>Emmi C.</span>
                <ExternalLink className="w-3 h-3" />
              </motion.a>
            </div>

            {/* Copyright */}
            <div className="text-sm text-gray-500 dark:text-gray-400">
              © {currentYear} Interactive Learning Platforms. Educational use encouraged.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}