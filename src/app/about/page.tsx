"use client";

import { useState } from "react";
import { 
  BookOpen, 
  Brain, 
  Play, 
  Zap, 
  Users, 
  MessageCircle, 
  BarChart3, 
  Lightbulb,
  ChevronDown,
  ChevronRight,
  Podcast,
  Target,
  Sparkles,
  Clock,
  CheckCircle,
  ArrowLeft,
  HelpCircle,
  Mouse,
  Keyboard,
  Eye,
  Mic
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "@/components/ui/Button";
import Link from "next/link";

interface FAQItem {
  question: string;
  answer: string;
}

interface GuideSection {
  title: string;
  icon: React.ComponentType<any>;
  content: string;
  tips?: string[];
}

export default function AboutPage() {
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);
  const [activeGuideSection, setActiveGuideSection] = useState(0);

  const faqItems: FAQItem[] = [
    {
      question: "How do I get the most out of ElectroSage AI tutor?",
      answer: "Ask questions naturally, think through problems step-by-step, and don't be afraid to say 'I don't know.' ElectroSage uses the Socratic method, so it will guide you to discover answers rather than giving them directly. The more you engage with the questioning process, the deeper your understanding will become."
    },
    {
      question: "What are the interactive visualizations and when should I use them?",
      answer: "We have 14 interactive visualizations covering everything from atomic structure to AC waveforms. Use them when you want to see concepts in action - for example, use the Ohm's Law Calculator when working on circuit problems, or the Current Flow visualization when learning about electron movement. Each section suggests relevant visualizations."
    },
    {
      question: "How does the progress tracking work?",
      answer: "Your progress is automatically tracked as you complete sections, interact with visualizations, and engage with the AI tutor. The percentage in the header shows your overall course progress, and you can see detailed progress for each section in the navigation sidebar."
    },
    {
      question: "Can I use this on mobile devices?",
      answer: "Yes! ElectroSage Academy is fully responsive and optimized for mobile learning. All visualizations and features work seamlessly on tablets and smartphones."
    },
    {
      question: "What makes this different from traditional electrical engineering courses?",
      answer: "Our platform combines AI-powered Socratic tutoring with interactive visualizations and practical circuit building tools. Instead of passive reading, you actively discover concepts through guided questioning and hands-on experimentation."
    },
    {
      question: "Is there a recommended learning path?",
      answer: "Start with the Introduction, then follow the sections in order: Atomic Structure → Voltage & Current → Resistance → Circuits → Advanced Topics. Each section builds on previous knowledge, but you can also jump to specific topics as needed."
    },
    {
      question: "How does the voice-to-text feature work?",
      answer: "Click the microphone button next to the chat input to start recording your question. The system uses OpenAI Whisper to convert your speech to text. Note: Voice recording requires HTTPS or localhost for security. The transcribed text appears in the input field for you to review before sending."
    },
    {
      question: "What accessibility features are available?",
      answer: "ElectroSage Academy includes comprehensive accessibility features: full keyboard navigation, screen reader support with ARIA labels, high contrast mode, reduced motion options, and voice-to-text input. Press Ctrl/Cmd+A to access the accessibility panel."
    }
  ];

  const guideSections: GuideSection[] = [
    {
      title: "AI Tutor Interaction",
      icon: Brain,
      content: "ElectroSage uses the Socratic method to guide your learning. Instead of providing direct answers, it asks strategic questions to help you discover concepts yourself.",
      tips: [
        "Ask open-ended questions about concepts you want to understand",
        "Think out loud - share your reasoning process",
        "Don't hesitate to say 'I don't understand' - that's valuable feedback",
        "Follow up with 'why' and 'how' questions",
        "Request examples or analogies when concepts seem abstract",
        "Use the microphone button for voice-to-text input when typing is inconvenient"
      ]
    },
    {
      title: "Interactive Visualizations",
      icon: Play,
      content: "14 specialized visualizations bring electrical concepts to life. Each visualization is context-aware and appears when most relevant to your current learning.",
      tips: [
        "Experiment with different parameters to see how they affect outcomes",
        "Use visualizations alongside reading to reinforce concepts",
        "Try the Ohm's Law Calculator for practical circuit calculations",
        "Explore the Atomic Structure visualization to understand electron behavior",
        "Use Circuit Diagram Builder for hands-on circuit design practice"
      ]
    },
    {
      title: "Navigation & Progress",
      icon: BarChart3,
      content: "Track your learning journey with detailed progress indicators and efficient navigation tools.",
      tips: [
        "Use Ctrl/Cmd + N to toggle the navigation sidebar",
        "Click section titles to jump between topics",
        "Your progress is saved automatically",
        "Use the search function to quickly find specific topics",
        "Bookmark important sections for quick reference"
      ]
    },
    {
      title: "Learning Best Practices",
      icon: Target,
      content: "Maximize your learning effectiveness with proven study strategies tailored for electrical engineering.",
      tips: [
        "Spend time with fundamentals before advancing to complex topics",
        "Practice calculations by hand before using the calculator tools",
        "Relate new concepts to real-world applications",
        "Review previous sections periodically to reinforce learning",
        "Take breaks between intensive study sessions"
      ]
    }
  ];

  const visualizations = [
    "Atomic Structure", "Voltage Demonstration", "Current Flow", "Resistance Demo",
    "Series Circuits", "Parallel Circuits", "Ohm's Law Calculator", "AC Waveforms",
    "Circuit Diagram Builder", "Component Library", "Safety Demonstration",
    "Capacitor Demo", "Inductor Demo", "Transformer Demo"
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Course</span>
                </Button>
              </Link>
              <div className="h-6 w-px bg-gray-300 dark:bg-gray-600" />
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">About ElectroSage Academy</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-gradient-to-br from-electric-500 to-blue-600 rounded-2xl">
              <Zap className="w-12 h-12 text-white" />
            </div>
          </div>
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Master Electrical Engineering with AI
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            ElectroSage Academy combines cutting-edge AI tutoring with interactive visualizations 
            to create the most effective electrical engineering learning experience.
          </p>
        </motion.div>

        {/* Platform Overview */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-12"
        >
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
            <BookOpen className="w-6 h-6 mr-3 text-electric-600" />
            What Makes ElectroSage Academy Special
          </h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center mb-4">
                <Brain className="w-8 h-8 text-blue-600 mr-3" />
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white">AI-Powered Socratic Tutoring</h4>
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                Our ElectroSage AI tutor uses the proven Socratic method, guiding you to discover 
                concepts through strategic questioning rather than passive information delivery.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center mb-4">
                <Sparkles className="w-8 h-8 text-purple-600 mr-3" />
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white">14 Interactive Visualizations</h4>
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                From atomic structure to AC waveforms, our visualizations make abstract 
                electrical concepts tangible and understandable.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center mb-4">
                <Target className="w-8 h-8 text-green-600 mr-3" />
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Professional Circuit Tools</h4>
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                Build and analyze circuits with professional-grade tools, from basic resistor 
                networks to complex electronic systems.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center mb-4">
                <BarChart3 className="w-8 h-8 text-orange-600 mr-3" />
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Intelligent Progress Tracking</h4>
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                Monitor your learning journey with detailed progress analytics and 
                personalized recommendations for optimal learning paths.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center mb-4">
                <Mic className="w-8 h-8 text-red-600 mr-3" />
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Voice-to-Text Learning</h4>
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                Ask questions naturally using speech-to-text powered by OpenAI Whisper. 
                Simply click the microphone and speak your questions to the AI tutor.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center mb-4">
                <Eye className="w-8 h-8 text-indigo-600 mr-3" />
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Accessibility-First Design</h4>
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                Full keyboard navigation, screen reader support, high contrast mode, 
                and reduced motion options ensure learning accessibility for everyone.
              </p>
            </div>
          </div>
        </motion.section>

        {/* User Guide */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
            <Lightbulb className="w-6 h-6 mr-3 text-electric-600" />
            How to Use the Platform
          </h3>

          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="flex border-b border-gray-200 dark:border-gray-700">
              {guideSections.map((section, index) => {
                const IconComponent = section.icon;
                return (
                  <button
                    key={index}
                    onClick={() => setActiveGuideSection(index)}
                    className={`flex-1 p-4 text-left border-r border-gray-200 dark:border-gray-700 last:border-r-0 transition-colors ${
                      activeGuideSection === index
                        ? 'bg-electric-50 dark:bg-electric-900/20 text-electric-700 dark:text-electric-300'
                        : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <IconComponent className={`w-5 h-5 ${
                        activeGuideSection === index ? 'text-electric-600' : 'text-gray-500'
                      }`} />
                      <span className="font-medium text-sm">{section.title}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="p-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeGuideSection}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    {guideSections[activeGuideSection].title}
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {guideSections[activeGuideSection].content}
                  </p>
                  
                  {guideSections[activeGuideSection].tips && (
                    <div>
                      <h5 className="font-medium text-gray-900 dark:text-white mb-2">Pro Tips:</h5>
                      <ul className="space-y-2">
                        {guideSections[activeGuideSection].tips!.map((tip, index) => (
                          <li key={index} className="flex items-start space-x-2">
                            <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-gray-600 dark:text-gray-400">{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </motion.section>

        {/* Visualization Guide */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-12"
        >
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
            <Play className="w-6 h-6 mr-3 text-electric-600" />
            Interactive Visualizations Guide
          </h3>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Our 14 interactive visualizations are designed to make complex electrical concepts intuitive. 
              Each visualization appears contextually based on your current section and can be accessed 
              through the dropdown menu in each section.
            </p>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
              {visualizations.map((viz, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-md"
                >
                  <div className="w-2 h-2 bg-electric-500 rounded-full" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{viz}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Educational Podcasts */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-12"
        >
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
            <Podcast className="w-6 h-6 mr-3 text-electric-600" />
            Educational Podcasts
          </h3>
          
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 p-6 rounded-lg border border-purple-200 dark:border-purple-800">
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <Podcast className="w-8 h-8 text-purple-600" />
              </div>
              <div className="flex-1">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Section-Based Podcast Collection
                </h4>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Enhance your learning with our collection of 8 educational podcasts, one for each course section. 
                  These podcasts provide in-depth discussions, real-world applications, and expert insights 
                  that complement the interactive content and visualizations.
                </p>
                
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-purple-200 dark:border-purple-700">
                  <h5 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center">
                    <Play className="w-4 h-4 mr-2 text-purple-600" />
                    Available Podcasts
                  </h5>
                  <div className="grid md:grid-cols-2 gap-2">
                    {[
                      "Section 1: Atomic Structure & Fundamentals",
                      "Section 2: Voltage & Electrical Pressure",
                      "Section 3: Current & Electron Flow",
                      "Section 4: Resistance & Power Dissipation",
                      "Section 5: Series Circuit Analysis",
                      "Section 6: Parallel Circuit Design",
                      "Section 7: Advanced Circuit Concepts",
                      "Section 8: Electronic Components & Safety"
                    ].map((podcast, index) => (
                      <div
                        key={index}
                        className="flex items-center space-x-2 p-2 bg-purple-50 dark:bg-purple-900/30 rounded-md"
                      >
                        <div className="w-2 h-2 bg-purple-500 rounded-full" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">{podcast}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                  <div className="flex items-center space-x-2 text-sm text-green-700 dark:text-green-400">
                    <CheckCircle className="w-4 h-4" />
                    <span className="font-medium">How to Access:</span>
                  </div>
                  <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                    Find the podcast player with dropdown menu in each section to listen to the corresponding episode 
                    while studying the material.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* FAQ Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-12"
        >
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
            <HelpCircle className="w-6 h-6 mr-3 text-electric-600" />
            Frequently Asked Questions
          </h3>
          
          <div className="space-y-4">
            {faqItems.map((item, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
              >
                <button
                  onClick={() => setExpandedFAQ(expandedFAQ === index ? null : index)}
                  className="w-full p-4 text-left flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <span className="font-medium text-gray-900 dark:text-white pr-4">
                    {item.question}
                  </span>
                  {expandedFAQ === index ? (
                    <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-gray-500 flex-shrink-0" />
                  )}
                </button>
                
                <AnimatePresence>
                  {expandedFAQ === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="border-t border-gray-200 dark:border-gray-700"
                    >
                      <div className="p-4 text-gray-600 dark:text-gray-400">
                        {item.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Keyboard Shortcuts */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-12"
        >
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
            <Keyboard className="w-6 h-6 mr-3 text-electric-600" />
            Keyboard Shortcuts
          </h3>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900 dark:text-white">Navigation</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Toggle sidebar</span>
                    <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs">Ctrl/Cmd + N</kbd>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Go to section 1-8</span>
                    <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs">1-8</kbd>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Go to introduction</span>
                    <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs">Home</kbd>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900 dark:text-white">Accessibility</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Focus chat input</span>
                    <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs">Ctrl/Cmd + /</kbd>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Skip to content</span>
                    <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs">Tab</kbd>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Get Started CTA */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="text-center"
        >
          <div className="bg-gradient-to-r from-electric-500 to-blue-600 p-8 rounded-lg text-white">
            <h3 className="text-2xl font-bold mb-4">Ready to Start Your Electrical Engineering Journey?</h3>
            <p className="text-electric-100 mb-6 max-w-2xl mx-auto">
              Join thousands of students mastering electrical engineering with AI-powered learning. 
              Start with the fundamentals and build your way up to advanced circuit design.
            </p>
            <Link href="/">
              <Button variant="secondary" size="lg" className="bg-white text-electric-600 hover:bg-gray-100">
                <Zap className="w-5 h-5 mr-2" />
                Start Learning Now
              </Button>
            </Link>
          </div>
        </motion.section>

      </div>
    </div>
  );
}