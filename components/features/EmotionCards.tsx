"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Heart, MessageSquare, Calendar, Smile } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useAppStore } from "@/lib/store";
import { useIsMobile } from "@/hooks/use-mobile";

const emotions = [
  {
    id: "happy",
    name: "Happy",
    emoji: "😊",
    color: "from-yellow-400 to-orange-500",
    description: "I feel joyful and good",
  },
  {
    id: "sad",
    name: "Sad",
    emoji: "😢",
    color: "from-blue-400 to-blue-600",
    description: "I feel down or upset",
  },
  {
    id: "angry",
    name: "Angry",
    emoji: "😠",
    color: "from-red-400 to-red-600",
    description: "I feel mad or frustrated",
  },
  {
    id: "excited",
    name: "Excited",
    emoji: "🤩",
    color: "from-purple-400 to-pink-500",
    description: "I feel energetic and thrilled",
  },
  {
    id: "worried",
    name: "Worried",
    emoji: "😰",
    color: "from-gray-400 to-gray-600",
    description: "I feel anxious or concerned",
  },
  {
    id: "tired",
    name: "Tired",
    emoji: "😴",
    color: "from-indigo-400 to-purple-600",
    description: "I feel sleepy or worn out",
  },
  {
    id: "calm",
    name: "Calm",
    emoji: "😌",
    color: "from-green-400 to-teal-500",
    description: "I feel peaceful and relaxed",
  },
  {
    id: "confused",
    name: "Confused",
    emoji: "😕",
    color: "from-orange-400 to-yellow-500",
    description: "I don't understand something",
  },
];

export function EmotionCards() {
  const { emotionHistory, addEmotionEntry, speak, animationsEnabled } =
    useAppStore();
  const [selectedEmotion, setSelectedEmotion] = useState<
    (typeof emotions)[0] | null
  >(null);
  const [note, setNote] = useState("");
  const [showHistory, setShowHistory] = useState(false);
  const isMobile = useIsMobile();

  const handleEmotionSelect = (emotion: (typeof emotions)[0]) => {
    setSelectedEmotion(emotion);
    speak(`I feel ${emotion.name}. ${emotion.description}`);
  };

  const handleSaveEmotion = () => {
    if (!selectedEmotion) return;

    addEmotionEntry({
      emotion: selectedEmotion.name,
      emoji: selectedEmotion.emoji,
      note: note.trim() || undefined,
    });

    speak(`Saved: I feel ${selectedEmotion.name}`);
    setSelectedEmotion(null);
    setNote("");
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }).format(new Date(date));
  };

  if (showHistory) {
    return (
      <div className="space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <motion.div
              className="bg-gradient-to-r from-pink-500 to-purple-600 rounded-full p-2 sm:p-3"
              whileHover={animationsEnabled ? { scale: 1.05 } : {}}
            >
              <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </motion.div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
              My Emotion History
            </h1>
          </div>
          <Button variant="outline" onClick={() => setShowHistory(false)}>
            Back to Emotions
          </Button>
        </div>

        {emotionHistory.length === 0 ? (
          <Card>
            <CardContent className="p-6 sm:p-12 text-center space-y-4">
              <div className="text-4xl sm:text-6xl">📝</div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800">
                No emotions recorded yet
              </h3>
              <p className="text-sm sm:text-base text-gray-600">
                Start tracking how you feel to see your history here
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {emotionHistory.map((entry, index) => (
              <motion.div
                key={entry.id}
                initial={
                  animationsEnabled ? { opacity: 0, x: -20 } : { opacity: 1 }
                }
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card>
                  <CardContent className="p-3 sm:p-4">
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="text-2xl sm:text-3xl">{entry.emoji}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                          <h3 className="font-semibold text-gray-800 text-sm sm:text-base">
                            I felt {entry.emotion}
                          </h3>
                          <span className="text-xs sm:text-sm text-gray-500">
                            {formatDate(entry.timestamp)}
                          </span>
                        </div>
                        {entry.note && (
                          <p className="text-xs sm:text-sm text-gray-600 mt-1">
                            {entry.note}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    );
  }

  if (selectedEmotion) {
    return (
      <div className="space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
            How I Feel
          </h2>
          <Button variant="outline" onClick={() => setSelectedEmotion(null)}>
            Choose Different Emotion
          </Button>
        </div>

        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div
              className={`bg-gradient-to-br ${selectedEmotion.color} p-6 sm:p-8 text-white text-center`}
            >
              <motion.div
                className="text-6xl sm:text-8xl mb-3 sm:mb-4"
                animate={animationsEnabled ? { scale: [1, 1.1, 1] } : {}}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              >
                {selectedEmotion.emoji}
              </motion.div>
              <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3">
                I feel {selectedEmotion.name}
              </h3>
              <p className="text-sm sm:text-base opacity-90">
                {selectedEmotion.description}
              </p>
            </div>

            <div className="p-4 sm:p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Add a note (optional)
                </label>
                <Textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="What made you feel this way?"
                  className="min-h-[80px] sm:min-h-[100px] text-sm sm:text-base"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={handleSaveEmotion}
                  className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 text-white py-2 sm:py-3"
                >
                  <Heart className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  Save Emotion
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setSelectedEmotion(null)}
                  className="flex-1"
                >
                  Choose Different
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-2 sm:gap-3">
          <motion.div
            className="bg-gradient-to-r from-pink-500 to-purple-600 rounded-full p-2 sm:p-3"
            whileHover={animationsEnabled ? { scale: 1.05 } : {}}
          >
            <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </motion.div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
            How I Feel
          </h1>
        </div>

        <Button
          variant="outline"
          onClick={() => setShowHistory(true)}
          className="w-full sm:w-auto"
        >
          <Calendar className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
          View History
        </Button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
        {emotions.map((emotion) => (
          <motion.button
            key={emotion.id}
            onClick={() => handleEmotionSelect(emotion)}
            className={`p-4 sm:p-6 rounded-xl border-2 transition-all duration-200 hover:shadow-lg ${
              // theme === "high-contrast"
              //   ? "border-yellow-400 hover:border-yellow-300 bg-white"
              //   : "border-gray-200 hover:border-gray-300 bg-white"
              "border-gray-200 hover:border-gray-300 bg-white"
            }`}
            whileHover={animationsEnabled ? { scale: 1.02 } : {}}
            whileTap={animationsEnabled ? { scale: 0.98 } : {}}
          >
            <div
              className={`bg-gradient-to-br ${emotion.color} rounded-lg p-3 sm:p-4 mb-3 sm:mb-4 text-center`}
            >
              <div className="text-3xl sm:text-4xl mb-2">{emotion.emoji}</div>
              <h3 className="font-semibold text-white text-sm sm:text-base">
                {emotion.name}
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-gray-600 text-center leading-tight">
              {emotion.description}
            </p>
          </motion.button>
        ))}
      </div>

      {emotionHistory.length > 0 && (
        <Card className="border-2 border-dashed border-gray-300 bg-gradient-to-br from-pink-50 to-purple-50">
          <CardContent className="p-4 sm:p-6 text-center space-y-3 sm:space-y-4">
            <div className="text-3xl sm:text-4xl">📊</div>
            <div className="space-y-2">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800">
                Track Your Emotions
              </h3>
              <p className="text-sm sm:text-base text-gray-600">
                You've recorded {emotionHistory.length} emotions. Keep tracking
                to see patterns!
              </p>
            </div>
            <Button
              onClick={() => setShowHistory(true)}
              className="bg-gradient-to-r from-pink-500 to-purple-600 text-white"
            >
              <Calendar className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              View History
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
