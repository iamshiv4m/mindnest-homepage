"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Heart,
  MessageCircle,
  BookOpen,
  Flower2,
  Settings,
  Sparkles,
  Users,
  ClipboardList,
  ClipboardCheck,
  Menu,
  X,
} from "lucide-react";
import { VisualRoutineBuilder } from "@/components/features/VisualRoutineBuilder";
import { EmotionCards } from "@/components/features/EmotionCards";
import { AACSymbolGrid } from "@/components/features/AACSymbolGrid";
import { SocialStoryViewer } from "@/components/features/SocialStoryViewer";
import { CalmingCorner } from "@/components/features/CalmingCorner";
import { useAppStore } from "@/lib/store";
import { AppSettings } from "@/components/features/AppSettings";
import { SocialSkillsGame } from "@/components/features/SocialSkillsGame";
import { VisualScheduleBuilder } from "@/components/features/VisualScheduleBuilder";
import { IEPTracker } from "@/components/features/IEPTracker";
import { useIsMobile } from "@/hooks/use-mobile";

const navigationItems = [
  {
    id: "routines",
    label: "My Routines",
    icon: Calendar,
    color: "from-blue-400 to-blue-600",
  },
  {
    id: "emotions",
    label: "How I Feel",
    icon: Heart,
    color: "from-pink-400 to-pink-600",
  },
  {
    id: "communication",
    label: "Talk",
    icon: MessageCircle,
    color: "from-purple-400 to-purple-600",
  },
  {
    id: "stories",
    label: "Stories",
    icon: BookOpen,
    color: "from-green-400 to-green-600",
  },
  {
    id: "calm",
    label: "Calm Corner",
    icon: Flower2,
    color: "from-rose-400 to-rose-600",
  },
  {
    id: "social-skills",
    label: "Social Skills",
    icon: Users,
    color: "from-orange-400 to-yellow-600",
  },
  {
    id: "visual-schedule",
    label: "My Schedule",
    icon: ClipboardList,
    color: "from-teal-400 to-cyan-600",
  },
  {
    id: "iep-tracker",
    label: "IEP Tracker",
    icon: ClipboardCheck,
    color: "from-indigo-400 to-purple-600",
  },
];

export default function MindNestApp() {
  const [currentPage, setCurrentPage] = useState("routines");
  const [showSettings, setShowSettings] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const isMobile = useIsMobile();
  const { theme, soundEnabled, animationsEnabled, updateSettings } =
    useAppStore();

  const renderPage = () => {
    if (showSettings)
      return <AppSettings onClose={() => setShowSettings(false)} />;

    switch (currentPage) {
      case "routines":
        return <VisualRoutineBuilder />;
      case "emotions":
        return <EmotionCards />;
      case "communication":
        return <AACSymbolGrid />;
      case "stories":
        return <SocialStoryViewer />;
      case "calm":
        return <CalmingCorner />;
      case "social-skills":
        return <SocialSkillsGame />;
      case "visual-schedule":
        return <VisualScheduleBuilder />;
      case "iep-tracker":
        return <IEPTracker />;
      default:
        return <VisualRoutineBuilder />;
    }
  };

  const getThemeClasses = () => {
    switch (theme) {
      case "dark":
        return "bg-gray-900 text-white";
      case "high-contrast":
        return "bg-black text-yellow-400";
      default:
        return "bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50";
    }
  };

  return (
    <div className={`min-h-screen ${getThemeClasses()}`}>
      {/* Animated Background (only if animations enabled) */}
      {animationsEnabled && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{ x: [0, 100, 0], y: [0, -50, 0], rotate: [0, 360, 720] }}
            transition={{
              duration: 30,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
            className="absolute top-20 right-20 w-16 h-16 md:w-32 md:h-32 bg-gradient-to-r from-blue-300 to-purple-400 rounded-full opacity-10"
          />
          <motion.div
            animate={{ x: [0, -80, 0], y: [0, 30, 0], scale: [1, 1.2, 1] }}
            transition={{
              duration: 25,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
              delay: 5,
            }}
            className="absolute bottom-20 left-20 w-12 h-12 md:w-24 md:h-24 bg-gradient-to-r from-pink-300 to-rose-400 rounded-full opacity-10"
          />
        </div>
      )}

      <div className="relative z-10">
        {/* Header */}
        <header
          className={`${
            theme === "dark"
              ? "bg-gray-800/80"
              : theme === "high-contrast"
              ? "bg-black"
              : "bg-white/80"
          } backdrop-blur-sm border-b ${
            theme === "high-contrast" ? "border-yellow-400" : "border-gray-200"
          } sticky top-0 z-50`}
        >
          <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
            <div className="flex items-center justify-between h-14 sm:h-16">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-1.5 sm:p-2">
                  <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <h1
                  className={`text-xl sm:text-2xl font-bold ${
                    theme === "high-contrast"
                      ? "text-yellow-400"
                      : "bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
                  }`}
                >
                  MindNest
                </h1>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setShowSettings(true)}
                  className={`p-1.5 sm:p-2 rounded-lg transition-colors ${
                    theme === "high-contrast"
                      ? "text-yellow-400 hover:bg-yellow-400 hover:text-black"
                      : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
                  }`}
                  aria-label="Settings"
                >
                  <Settings className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>

                {/* Mobile Menu Button */}
                {isMobile && (
                  <button
                    onClick={() => setShowMobileMenu(!showMobileMenu)}
                    className={`p-1.5 sm:p-2 rounded-lg transition-colors ${
                      theme === "high-contrast"
                        ? "text-yellow-400 hover:bg-yellow-400 hover:text-black"
                        : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
                    }`}
                    aria-label="Menu"
                  >
                    {showMobileMenu ? (
                      <X className="w-5 h-5 sm:w-6 sm:h-6" />
                    ) : (
                      <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Mobile Menu Overlay */}
        {isMobile && showMobileMenu && (
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setShowMobileMenu(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className={`fixed top-0 right-0 h-full w-80 max-w-[85vw] z-50 ${
                theme === "dark"
                  ? "bg-gray-800"
                  : theme === "high-contrast"
                  ? "bg-black"
                  : "bg-white"
              } shadow-2xl`}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold">Navigation</h2>
                  <button
                    onClick={() => setShowMobileMenu(false)}
                    className="p-2 rounded-lg hover:bg-gray-100"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="space-y-2">
                  {navigationItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = currentPage === item.id;

                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          setCurrentPage(item.id);
                          setShowMobileMenu(false);
                        }}
                        className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 ${
                          isActive
                            ? theme === "high-contrast"
                              ? "bg-yellow-400 text-black"
                              : `bg-gradient-to-r ${item.color} text-white`
                            : theme === "high-contrast"
                            ? "text-yellow-400 hover:bg-yellow-400 hover:text-black"
                            : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="font-medium">{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        )}

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8 pb-20 sm:pb-24">
          <AnimatePresence mode="wait">
            <motion.div
              key={showSettings ? "settings" : currentPage}
              initial={
                animationsEnabled ? { opacity: 0, y: 20 } : { opacity: 1 }
              }
              animate={{ opacity: 1, y: 0 }}
              exit={animationsEnabled ? { opacity: 0, y: -20 } : { opacity: 1 }}
              transition={{ duration: animationsEnabled ? 0.3 : 0 }}
            >
              {renderPage()}
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Bottom Navigation - Only show on mobile */}
        {!showSettings && isMobile && (
          <nav
            className={`fixed bottom-0 left-0 right-0 ${
              theme === "dark"
                ? "bg-gray-800/95"
                : theme === "high-contrast"
                ? "bg-black"
                : "bg-white/95"
            } backdrop-blur-sm border-t ${
              theme === "high-contrast"
                ? "border-yellow-400"
                : "border-gray-200"
            } z-50`}
          >
            <div className="max-w-7xl mx-auto px-2">
              <div className="grid grid-cols-4 gap-1 py-2">
                {navigationItems.slice(0, 4).map((item) => {
                  const Icon = item.icon;
                  const isActive = currentPage === item.id;

                  return (
                    <motion.button
                      key={item.id}
                      onClick={() => setCurrentPage(item.id)}
                      className={`flex flex-col items-center py-2 px-1 rounded-lg transition-all duration-300 ${
                        isActive
                          ? theme === "high-contrast"
                            ? "bg-yellow-400 text-black"
                            : `bg-gradient-to-r ${item.color} text-white shadow-lg`
                          : theme === "high-contrast"
                          ? "text-yellow-400 hover:bg-yellow-400 hover:text-black"
                          : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
                      }`}
                      whileTap={animationsEnabled ? { scale: 0.95 } : {}}
                      aria-label={item.label}
                    >
                      <Icon className="w-5 h-5 mb-1" />
                      <span className="text-xs font-medium leading-tight">
                        {item.label}
                      </span>
                    </motion.button>
                  );
                })}
              </div>

              {/* Second row for remaining items */}
              <div className="grid grid-cols-4 gap-1 py-2 border-t border-gray-200">
                {navigationItems.slice(4, 8).map((item) => {
                  const Icon = item.icon;
                  const isActive = currentPage === item.id;

                  return (
                    <motion.button
                      key={item.id}
                      onClick={() => setCurrentPage(item.id)}
                      className={`flex flex-col items-center py-2 px-1 rounded-lg transition-all duration-300 ${
                        isActive
                          ? theme === "high-contrast"
                            ? "bg-yellow-400 text-black"
                            : `bg-gradient-to-r ${item.color} text-white shadow-lg`
                          : theme === "high-contrast"
                          ? "text-yellow-400 hover:bg-yellow-400 hover:text-black"
                          : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
                      }`}
                      whileTap={animationsEnabled ? { scale: 0.95 } : {}}
                      aria-label={item.label}
                    >
                      <Icon className="w-5 h-5 mb-1" />
                      <span className="text-xs font-medium leading-tight">
                        {item.label}
                      </span>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </nav>
        )}
      </div>
    </div>
  );
}
