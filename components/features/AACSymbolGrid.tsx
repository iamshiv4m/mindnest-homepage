"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Grid3X3, List, Search, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useAppStore } from "@/lib/store";
import { useIsMobile } from "@/hooks/use-mobile";

interface AACSymbol {
  id: string;
  text: string;
  emoji: string;
  category: string;
  color: string;
}

const aacSymbols: AACSymbol[] = [
  // Basic Needs
  {
    id: "water",
    text: "I need water",
    emoji: "💧",
    category: "needs",
    color: "from-blue-400 to-blue-600",
  },
  {
    id: "food",
    text: "I'm hungry",
    emoji: "🍎",
    category: "needs",
    color: "from-green-400 to-green-600",
  },
  {
    id: "toilet",
    text: "I need the bathroom",
    emoji: "🚽",
    category: "needs",
    color: "from-purple-400 to-purple-600",
  },
  {
    id: "help",
    text: "I need help",
    emoji: "🙋",
    category: "needs",
    color: "from-red-400 to-red-600",
  },
  {
    id: "break",
    text: "I need a break",
    emoji: "⏸️",
    category: "needs",
    color: "from-orange-400 to-orange-600",
  },
  {
    id: "sleep",
    text: "I'm tired",
    emoji: "😴",
    category: "needs",
    color: "from-indigo-400 to-indigo-600",
  },

  // Feelings
  {
    id: "happy",
    text: "I feel happy",
    emoji: "😊",
    category: "feelings",
    color: "from-yellow-400 to-yellow-600",
  },
  {
    id: "sad",
    text: "I feel sad",
    emoji: "😢",
    category: "feelings",
    color: "from-blue-400 to-blue-600",
  },
  {
    id: "angry",
    text: "I feel angry",
    emoji: "😠",
    category: "feelings",
    color: "from-red-400 to-red-600",
  },
  {
    id: "scared",
    text: "I feel scared",
    emoji: "😨",
    category: "feelings",
    color: "from-purple-400 to-purple-600",
  },
  {
    id: "excited",
    text: "I feel excited",
    emoji: "🤩",
    category: "feelings",
    color: "from-pink-400 to-pink-600",
  },

  // Actions
  {
    id: "yes",
    text: "Yes",
    emoji: "✅",
    category: "actions",
    color: "from-green-400 to-green-600",
  },
  {
    id: "no",
    text: "No",
    emoji: "❌",
    category: "actions",
    color: "from-red-400 to-red-600",
  },
  {
    id: "more",
    text: "More please",
    emoji: "➕",
    category: "actions",
    color: "from-blue-400 to-blue-600",
  },
  {
    id: "stop",
    text: "Stop",
    emoji: "🛑",
    category: "actions",
    color: "from-red-400 to-red-600",
  },
  {
    id: "go",
    text: "Let's go",
    emoji: "🚶",
    category: "actions",
    color: "from-green-400 to-green-600",
  },
  {
    id: "wait",
    text: "Wait",
    emoji: "✋",
    category: "actions",
    color: "from-orange-400 to-orange-600",
  },

  // Social
  {
    id: "hello",
    text: "Hello",
    emoji: "👋",
    category: "social",
    color: "from-pink-400 to-pink-600",
  },
  {
    id: "goodbye",
    text: "Goodbye",
    emoji: "👋",
    category: "social",
    color: "from-purple-400 to-purple-600",
  },
  {
    id: "please",
    text: "Please",
    emoji: "🙏",
    category: "social",
    color: "from-blue-400 to-blue-600",
  },
  {
    id: "thankyou",
    text: "Thank you",
    emoji: "💝",
    category: "social",
    color: "from-pink-400 to-pink-600",
  },
  {
    id: "sorry",
    text: "I'm sorry",
    emoji: "😔",
    category: "social",
    color: "from-gray-400 to-gray-600",
  },
  {
    id: "love",
    text: "I love you",
    emoji: "❤️",
    category: "social",
    color: "from-red-400 to-pink-500",
  },
];

const categories = [
  { id: "all", name: "All", emoji: "🌟" },
  { id: "needs", name: "Needs", emoji: "🏠" },
  { id: "feelings", name: "Feelings", emoji: "❤️" },
  { id: "actions", name: "Actions", emoji: "⚡" },
  { id: "social", name: "Social", emoji: "👥" },
];

export function AACSymbolGrid() {
  const {
    recentSymbols,
    addRecentSymbol,
    speak,
    soundEnabled,
    animationsEnabled,
  } = useAppStore();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const isMobile = useIsMobile();

  const handleSymbolPress = useCallback(
    (symbol: AACSymbol) => {
      speak(symbol.text);
      addRecentSymbol(symbol.id);
    },
    [speak, addRecentSymbol]
  );

  const filteredSymbols = aacSymbols.filter((symbol) => {
    const matchesCategory =
      selectedCategory === "all" || symbol.category === selectedCategory;
    const matchesSearch = symbol.text
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const recentSymbolsData = recentSymbols
    .map((id) => aacSymbols.find((s) => s.id === id))
    .filter(Boolean) as AACSymbol[];

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex items-center gap-2 sm:gap-3">
          <motion.div
            className="bg-gradient-to-r from-purple-500 to-blue-600 rounded-full p-2 sm:p-3"
            whileHover={animationsEnabled ? { scale: 1.05 } : {}}
          >
            <Grid3X3 className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </motion.div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
            Talk & Communicate
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === "grid" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("grid")}
            className="p-1.5 sm:p-2"
          >
            <Grid3X3 className="w-4 h-4" />
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("list")}
            className="p-1.5 sm:p-2"
          >
            <List className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
        <Input
          placeholder="Search symbols..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-9 sm:pl-10 text-sm sm:text-lg py-2 sm:py-3"
        />
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <Button
            key={category.id}
            variant={selectedCategory === category.id ? "default" : "outline"}
            onClick={() => setSelectedCategory(category.id)}
            className="flex items-center gap-1 sm:gap-2 text-sm sm:text-lg py-1.5 sm:py-2 px-3 sm:px-4"
          >
            <span className="text-lg sm:text-xl">{category.emoji}</span>
            <span className="hidden sm:inline">{category.name}</span>
            <span className="sm:hidden">{category.name.split(" ")[0]}</span>
          </Button>
        ))}
      </div>

      {/* Recently Used */}
      {recentSymbolsData.length > 0 && (
        <Card>
          <CardContent className="p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-semibold text-gray-700 flex items-center gap-2 mb-3 sm:mb-4">
              <Star className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />
              Recently Used
            </h3>
            <div className="flex flex-wrap gap-2 sm:gap-3">
              {recentSymbolsData.map((symbol) => (
                <motion.button
                  key={`recent-${symbol.id}`}
                  onClick={() => handleSymbolPress(symbol)}
                  className={`bg-gradient-to-br ${symbol.color} text-white rounded-xl p-3 sm:p-4 shadow-lg hover:shadow-xl transition-all duration-200 min-w-[100px] sm:min-w-[120px]`}
                  whileHover={animationsEnabled ? { scale: 1.05 } : {}}
                  whileTap={animationsEnabled ? { scale: 0.95 } : {}}
                  initial={
                    animationsEnabled
                      ? { opacity: 0, scale: 0.8 }
                      : { opacity: 1 }
                  }
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <div className="text-2xl sm:text-3xl mb-1 sm:mb-2">
                    {symbol.emoji}
                  </div>
                  <div className="text-xs sm:text-sm font-medium">
                    {symbol.text}
                  </div>
                </motion.button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Symbol Grid/List */}
      <div className="space-y-3">
        <h3 className="text-base sm:text-lg font-semibold text-gray-700">
          {selectedCategory === "all"
            ? "All Symbols"
            : categories.find((c) => c.id === selectedCategory)?.name}
          <span className="text-xs sm:text-sm text-gray-500 ml-2">
            ({filteredSymbols.length} symbols)
          </span>
        </h3>

        {viewMode === "grid" ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
            {filteredSymbols.map((symbol, index) => (
              <motion.button
                key={symbol.id}
                onClick={() => handleSymbolPress(symbol)}
                className={`bg-gradient-to-br ${symbol.color} text-white rounded-xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-all duration-200 aspect-square flex flex-col items-center justify-center`}
                whileHover={animationsEnabled ? { scale: 1.05 } : {}}
                whileTap={animationsEnabled ? { scale: 0.95 } : {}}
                initial={
                  animationsEnabled ? { opacity: 0, y: 20 } : { opacity: 1 }
                }
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <div className="text-3xl sm:text-4xl mb-2 sm:mb-3">
                  {symbol.emoji}
                </div>
                <div className="text-xs sm:text-sm font-medium text-center leading-tight">
                  {symbol.text}
                </div>
              </motion.button>
            ))}
          </div>
        ) : (
          <div className="space-y-2 sm:space-y-3">
            {filteredSymbols.map((symbol, index) => (
              <motion.button
                key={symbol.id}
                onClick={() => handleSymbolPress(symbol)}
                className={`w-full bg-gradient-to-r ${symbol.color} text-white rounded-xl p-3 sm:p-4 shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-3 sm:gap-4`}
                whileHover={animationsEnabled ? { scale: 1.02 } : {}}
                whileTap={animationsEnabled ? { scale: 0.98 } : {}}
                initial={
                  animationsEnabled ? { opacity: 0, x: -20 } : { opacity: 1 }
                }
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.03 }}
              >
                <div className="text-2xl sm:text-3xl">{symbol.emoji}</div>
                <div className="text-sm sm:text-lg font-medium">
                  {symbol.text}
                </div>
              </motion.button>
            ))}
          </div>
        )}
      </div>

      {filteredSymbols.length === 0 && (
        <Card>
          <CardContent className="p-6 sm:p-12 text-center space-y-4">
            <div className="text-4xl sm:text-6xl">🔍</div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-600">
              No symbols found
            </h3>
            <p className="text-sm sm:text-base text-gray-500">
              Try adjusting your search or category filter
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
