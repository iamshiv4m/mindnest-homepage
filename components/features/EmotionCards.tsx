"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Heart, MessageSquare, Calendar, Smile } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { useAppStore } from "@/lib/store"

const emotions = [
  {
    id: "happy",
    name: "Happy",
    emoji: "😊",
    color: "from-yellow-400 to-orange-500",
    description: "I feel joyful and good",
  },
  { id: "sad", name: "Sad", emoji: "😢", color: "from-blue-400 to-blue-600", description: "I feel down or upset" },
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
]

export function EmotionCards() {
  const { emotionHistory, addEmotionEntry, speak, animationsEnabled } = useAppStore()
  const [selectedEmotion, setSelectedEmotion] = useState<(typeof emotions)[0] | null>(null)
  const [note, setNote] = useState("")
  const [showHistory, setShowHistory] = useState(false)

  const handleEmotionSelect = (emotion: (typeof emotions)[0]) => {
    setSelectedEmotion(emotion)
    speak(`I feel ${emotion.name}. ${emotion.description}`)
  }

  const handleSaveEmotion = () => {
    if (!selectedEmotion) return

    addEmotionEntry({
      emotion: selectedEmotion.name,
      emoji: selectedEmotion.emoji,
      note: note.trim() || undefined,
    })

    speak(`Saved: I feel ${selectedEmotion.name}`)
    setSelectedEmotion(null)
    setNote("")
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }).format(new Date(date))
  }

  if (showHistory) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div
              className="bg-gradient-to-r from-pink-500 to-purple-600 rounded-full p-3"
              whileHover={animationsEnabled ? { scale: 1.05 } : {}}
            >
              <Calendar className="w-6 h-6 text-white" />
            </motion.div>
            <h1 className="text-2xl font-bold text-gray-800">My Emotion History</h1>
          </div>
          <Button variant="outline" onClick={() => setShowHistory(false)}>
            Back to Emotions
          </Button>
        </div>

        {emotionHistory.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center space-y-4">
              <div className="text-6xl">📝</div>
              <h3 className="text-xl font-semibold text-gray-800">No emotions recorded yet</h3>
              <p className="text-gray-600">Start tracking how you feel to see your history here</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {emotionHistory.map((entry, index) => (
              <motion.div
                key={entry.id}
                initial={animationsEnabled ? { opacity: 0, x: -20 } : { opacity: 1 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="text-3xl">{entry.emoji}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-gray-800">I felt {entry.emotion}</h3>
                          <span className="text-sm text-gray-500">{formatDate(entry.timestamp)}</span>
                        </div>
                        {entry.note && <p className="text-gray-600 mt-1">{entry.note}</p>}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    )
  }

  if (selectedEmotion) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">How I Feel</h2>
          <Button variant="outline" onClick={() => setSelectedEmotion(null)}>
            Choose Different Emotion
          </Button>
        </div>

        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className={`bg-gradient-to-br ${selectedEmotion.color} p-8 text-white text-center`}>
              <motion.div
                className="text-8xl mb-4"
                animate={animationsEnabled ? { scale: [1, 1.1, 1] } : {}}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              >
                {selectedEmotion.emoji}
              </motion.div>
              <h2 className="text-3xl font-bold mb-2">I feel {selectedEmotion.name}</h2>
              <p className="text-xl opacity-90">{selectedEmotion.description}</p>
            </div>

            <div className="p-8 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Want to tell me more? (optional)</label>
                <Textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="What made you feel this way? What happened today?"
                  className="min-h-[100px] text-lg"
                />
              </div>

              <div className="flex gap-4">
                <Button
                  onClick={handleSaveEmotion}
                  className={`flex-1 bg-gradient-to-r ${selectedEmotion.color} text-white py-3 text-lg`}
                >
                  <Heart className="w-5 h-5 mr-2" />
                  Save My Feeling
                </Button>
                <Button
                  variant="outline"
                  onClick={() => speak(`I feel ${selectedEmotion.name}. ${selectedEmotion.description}`)}
                  className="px-6"
                >
                  <MessageSquare className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <motion.div
            className="bg-gradient-to-r from-pink-500 to-purple-600 rounded-full p-3"
            whileHover={animationsEnabled ? { scale: 1.05 } : {}}
          >
            <Heart className="w-6 h-6 text-white" />
          </motion.div>
          <h1 className="text-2xl font-bold text-gray-800">How I Feel</h1>
        </div>

        {emotionHistory.length > 0 && (
          <Button variant="outline" onClick={() => setShowHistory(true)}>
            <Calendar className="w-4 h-4 mr-2" />
            My History
          </Button>
        )}
      </div>

      <div className="text-center space-y-4">
        <div className="text-6xl">
          <Smile />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-gray-800">How are you feeling right now?</h2>
          <p className="text-gray-600 text-lg">Tap on the emotion that matches how you feel</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {emotions.map((emotion, index) => (
          <motion.button
            key={emotion.id}
            onClick={() => handleEmotionSelect(emotion)}
            className={`bg-gradient-to-br ${emotion.color} text-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-200 aspect-square flex flex-col items-center justify-center`}
            whileHover={animationsEnabled ? { scale: 1.05 } : {}}
            whileTap={animationsEnabled ? { scale: 0.95 } : {}}
            initial={animationsEnabled ? { opacity: 0, y: 20 } : { opacity: 1 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <div className="text-4xl mb-3">{emotion.emoji}</div>
            <div className="font-semibold text-lg text-center">{emotion.name}</div>
          </motion.button>
        ))}
      </div>

      {emotionHistory.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Recent Feelings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 overflow-x-auto pb-2">
              {emotionHistory.slice(0, 5).map((entry) => (
                <div key={entry.id} className="flex-shrink-0 text-center">
                  <div className="text-2xl mb-1">{entry.emoji}</div>
                  <div className="text-xs text-gray-500 whitespace-nowrap">{formatDate(entry.timestamp)}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
