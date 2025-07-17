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
} from "lucide-react";
import { VisualRoutineBuilder } from "@/components/features/VisualRoutineBuilder";
import { EmotionCards } from "@/components/features/EmotionCards";
import { AACSymbolGrid } from "@/components/features/AACSymbolGrid";
import { SocialStoryViewer } from "@/components/features/SocialStoryViewer";
import { CalmingCorner } from "@/components/features/CalmingCorner";
import { useAppStore } from "@/lib/store";
import { AppSettings } from "@/components/features/AppSettings";

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
];

export default function MindNestApp() {
  const [currentPage, setCurrentPage] = useState("routines");
  const [showSettings, setShowSettings] = useState(false);
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
            className="absolute top-20 right-20 w-32 h-32 bg-gradient-to-r from-blue-300 to-purple-400 rounded-full opacity-10"
          />
          <motion.div
            animate={{ x: [0, -80, 0], y: [0, 30, 0], scale: [1, 1.2, 1] }}
            transition={{
              duration: 25,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
              delay: 5,
            }}
            className="absolute bottom-20 left-20 w-24 h-24 bg-gradient-to-r from-pink-300 to-rose-400 rounded-full opacity-10"
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
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-2">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <h1
                  className={`text-2xl font-bold ${
                    theme === "high-contrast"
                      ? "text-yellow-400"
                      : "bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
                  }`}
                >
                  MindNest
                </h1>
              </div>

              <button
                onClick={() => setShowSettings(true)}
                className={`p-2 rounded-lg transition-colors ${
                  theme === "high-contrast"
                    ? "text-yellow-400 hover:bg-yellow-400 hover:text-black"
                    : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
                }`}
                aria-label="Settings"
              >
                <Settings className="w-6 h-6" />
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24">
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

        {/* Bottom Navigation */}
        {!showSettings && (
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
            <div className="max-w-7xl mx-auto px-4">
              <div className="flex justify-around py-2">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentPage === item.id;

                  return (
                    <motion.button
                      key={item.id}
                      onClick={() => setCurrentPage(item.id)}
                      className={`flex flex-col items-center py-3 px-4 rounded-xl transition-all duration-300 ${
                        isActive
                          ? theme === "high-contrast"
                            ? "bg-yellow-400 text-black"
                            : `bg-gradient-to-r ${item.color} text-white shadow-lg`
                          : theme === "high-contrast"
                          ? "text-yellow-400 hover:bg-yellow-400 hover:text-black"
                          : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
                      }`}
                      whileTap={animationsEnabled ? { scale: 0.95 } : {}}
                      whileHover={animationsEnabled ? { scale: 1.05 } : {}}
                      aria-label={item.label}
                    >
                      <Icon className={`w-6 h-6 mb-1`} />
                      <span className="text-sm font-medium">{item.label}</span>
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
