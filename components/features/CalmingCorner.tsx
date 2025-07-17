"use client";

import type React from "react";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Flower2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface CalmingActivity {
  id: string;
  title: string;
  description: string;
  emoji: string;
  color: string;
  component: React.ComponentType;
}

// Breathing Exercise Component
const BreathingExercise = () => {
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<"inhale" | "hold" | "exhale">("inhale");
  const [count, setCount] = useState(4);

  useEffect(() => {
    if (!isActive) return;

    const phases = [
      { name: "inhale" as const, duration: 4000, nextCount: 4 },
      { name: "hold" as const, duration: 2000, nextCount: 6 },
      { name: "exhale" as const, duration: 6000, nextCount: 4 },
    ];

    const currentPhaseIndex = phases.findIndex((p) => p.name === phase);
    const currentPhase = phases[currentPhaseIndex];

    const timer = setTimeout(() => {
      const nextPhaseIndex = (currentPhaseIndex + 1) % phases.length;
      const nextPhase = phases[nextPhaseIndex];
      setPhase(nextPhase.name);
      setCount(nextPhase.nextCount);
    }, currentPhase.duration);

    const countTimer = setInterval(() => {
      setCount((prev) => (prev > 1 ? prev - 1 : currentPhase.nextCount));
    }, currentPhase.duration / currentPhase.nextCount);

    return () => {
      clearTimeout(timer);
      clearInterval(countTimer);
    };
  }, [isActive, phase]);

  const getInstructions = () => {
    switch (phase) {
      case "inhale":
        return "Breathe in slowly...";
      case "hold":
        return "Hold your breath...";
      case "exhale":
        return "Breathe out slowly...";
    }
  };

  const getCircleScale = () => {
    switch (phase) {
      case "inhale":
        return 1.5;
      case "hold":
        return 1.5;
      case "exhale":
        return 1;
    }
  };

  return (
    <div className="text-center space-y-8">
      <div className="relative w-64 h-64 mx-auto">
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full opacity-30"
          animate={{ scale: getCircleScale() }}
          transition={{
            duration: phase === "hold" ? 2 : phase === "inhale" ? 4 : 6,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute inset-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full opacity-50 flex items-center justify-center"
          animate={{ scale: getCircleScale() }}
          transition={{
            duration: phase === "hold" ? 2 : phase === "inhale" ? 4 : 6,
            ease: "easeInOut",
          }}
        >
          <div className="text-white text-center">
            <div className="text-4xl font-bold mb-2">{count}</div>
            <div className="text-lg">{getInstructions()}</div>
          </div>
        </motion.div>
      </div>

      <div className="space-y-4">
        <Button
          onClick={() => setIsActive(!isActive)}
          className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 text-lg"
        >
          {isActive ? (
            <Pause className="w-5 h-5 mr-2" />
          ) : (
            <Play className="w-5 h-5 mr-2" />
          )}
          {isActive ? "Pause" : "Start Breathing"}
        </Button>

        <p className="text-gray-600">
          Follow the circle and breathe along. This helps you feel calm and
          relaxed.
        </p>
      </div>
    </div>
  );
};

// Bubble Pop Game Component
const BubblePopGame = () => {
  const [bubbles, setBubbles] = useState<
    Array<{ id: number; x: number; y: number; size: number; color: string }>
  >([]);
  const [score, setScore] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const colors = [
    "from-pink-400 to-rose-500",
    "from-blue-400 to-cyan-500",
    "from-purple-400 to-indigo-500",
    "from-green-400 to-emerald-500",
    "from-yellow-400 to-orange-500",
  ];

  const createBubble = useCallback(() => {
    const newBubble = {
      id: Date.now() + Math.random(),
      x: Math.random() * 80 + 10, // 10% to 90% of container width
      y: Math.random() * 80 + 10, // 10% to 90% of container height
      size: Math.random() * 60 + 40, // 40px to 100px
      color: colors[Math.floor(Math.random() * colors.length)],
    };
    setBubbles((prev) => [...prev, newBubble]);
  }, []);

  const popBubble = (id: number) => {
    setBubbles((prev) => prev.filter((bubble) => bubble.id !== id));
    setScore((prev) => prev + 1);

    if (soundEnabled) {
      // Create a simple pop sound using Web Audio API
      const audioContext = new (window.AudioContext ||
        (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(
        200,
        audioContext.currentTime + 0.1
      );

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        audioContext.currentTime + 0.1
      );

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.1);
    }
  };

  useEffect(() => {
    const interval = setInterval(createBubble, 2000);
    return () => clearInterval(interval);
  }, [createBubble]);

  // Remove bubbles after 8 seconds
  useEffect(() => {
    const cleanup = setInterval(() => {
      setBubbles((prev) =>
        prev.filter((bubble) => Date.now() - bubble.id < 8000)
      );
    }, 1000);
    return () => clearInterval(cleanup);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="text-2xl font-bold text-gray-800">
          Score: {score} 🎉
        </div>
        <Button
          variant={soundEnabled ? "default" : "outline"}
          size="sm"
          onClick={() => setSoundEnabled(!soundEnabled)}
          className="p-2"
        >
          {soundEnabled ? (
            <Volume2 className="w-4 h-4" />
          ) : (
            <VolumeX className="w-4 h-4" />
          )}
        </Button>
      </div>

      <div className="relative w-full h-96 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl overflow-hidden border-2 border-dashed border-blue-200">
        <AnimatePresence>
          {bubbles.map((bubble) => (
            <motion.button
              key={bubble.id}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 0.8 }}
              exit={{ scale: 0, opacity: 0 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.8 }}
              onClick={() => popBubble(bubble.id)}
              className={`absolute bg-gradient-to-br ${bubble.color} rounded-full shadow-lg cursor-pointer`}
              style={{
                left: `${bubble.x}%`,
                top: `${bubble.y}%`,
                width: `${bubble.size}px`,
                height: `${bubble.size}px`,
                transform: "translate(-50%, -50%)",
              }}
            >
              <motion.div
                className="w-full h-full rounded-full bg-white opacity-30"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              />
            </motion.button>
          ))}
        </AnimatePresence>

        {bubbles.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center text-gray-500 text-lg">
            Bubbles will appear here... Get ready to pop them! 🫧
          </div>
        )}
      </div>

      <p className="text-center text-gray-600">
        Tap the bubbles as they appear to pop them! This helps you focus and
        feel calm.
      </p>
    </div>
  );
};

// Soft Sounds Component
const SoftSounds = () => {
  const [currentSound, setCurrentSound] = useState<string | null>(null);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  const sounds = [
    {
      id: "rain",
      name: "Rain",
      emoji: "🌧️",
      color: "from-blue-400 to-blue-600",
    },
    {
      id: "ocean",
      name: "Ocean Waves",
      emoji: "🌊",
      color: "from-cyan-400 to-blue-500",
    },
    {
      id: "forest",
      name: "Forest",
      emoji: "🌲",
      color: "from-green-400 to-green-600",
    },
    {
      id: "birds",
      name: "Birds",
      emoji: "🐦",
      color: "from-yellow-400 to-orange-500",
    },
    {
      id: "wind",
      name: "Gentle Wind",
      emoji: "🍃",
      color: "from-green-300 to-teal-400",
    },
  ];

  const playSound = (soundId: string) => {
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }

    if (currentSound === soundId) {
      setCurrentSound(null);
      setAudio(null);
      return;
    }

    // In a real app, you would load actual audio files
    // For demo purposes, we'll just track the selected sound
    setCurrentSound(soundId);

    // Simulate audio playback
    const mockAudio = {
      pause: () => {},
      currentTime: 0,
    } as HTMLAudioElement;
    setAudio(mockAudio);
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <h3 className="text-2xl font-bold text-gray-800">Calming Sounds</h3>
        <p className="text-gray-600">
          Choose a sound to help you relax and focus
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {sounds.map((sound) => (
          <motion.button
            key={sound.id}
            onClick={() => playSound(sound.id)}
            className={`bg-gradient-to-br ${
              sound.color
            } text-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-200 ${
              currentSound === sound.id
                ? "ring-4 ring-white ring-opacity-50"
                : ""
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="text-4xl mb-3">{sound.emoji}</div>
            <div className="font-medium">{sound.name}</div>
            {currentSound === sound.id && (
              <motion.div
                className="mt-2 text-sm opacity-80"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                Playing...
              </motion.div>
            )}
          </motion.button>
        ))}
      </div>

      {currentSound && (
        <div className="text-center">
          <Button
            onClick={() => playSound(currentSound)}
            variant="outline"
            className="px-6 py-3"
          >
            <Pause className="w-5 h-5 mr-2" />
            Stop Sound
          </Button>
        </div>
      )}
    </div>
  );
};

const activities: CalmingActivity[] = [
  {
    id: "breathing",
    title: "Breathing Exercise",
    description: "Follow the circle and breathe deeply to feel calm",
    emoji: "🫁",
    color: "from-blue-400 to-purple-600",
    component: BreathingExercise,
  },
  {
    id: "bubbles",
    title: "Bubble Pop",
    description: "Pop bubbles to focus your mind and have fun",
    emoji: "🫧",
    color: "from-pink-400 to-rose-600",
    component: BubblePopGame,
  },
  {
    id: "sounds",
    title: "Soft Sounds",
    description: "Listen to calming nature sounds",
    emoji: "🎵",
    color: "from-green-400 to-teal-600",
    component: SoftSounds,
  },
];

export function CalmingCorner() {
  const [selectedActivity, setSelectedActivity] =
    useState<CalmingActivity | null>(null);

  if (!selectedActivity) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <motion.div
            className="bg-gradient-to-r from-rose-500 to-pink-600 rounded-full p-3"
            whileHover={{ scale: 1.05 }}
          >
            <Flower2 className="w-6 h-6 text-white" />
          </motion.div>
          <h1 className="text-2xl font-bold text-gray-800">Calming Corner</h1>
        </div>

        <p className="text-lg text-gray-600 text-center max-w-2xl mx-auto">
          Take a moment to relax and feel peaceful. Choose an activity that
          helps you feel calm and happy.
        </p>

        {/* Activity Selection */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {activities.map((activity, index) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card
                className="cursor-pointer hover:shadow-lg transition-all duration-300 overflow-hidden"
                onClick={() => setSelectedActivity(activity)}
              >
                <CardContent className="p-0">
                  <div
                    className={`bg-gradient-to-br ${activity.color} p-8 text-white text-center`}
                  >
                    <div className="text-5xl mb-4">{activity.emoji}</div>
                    <h3 className="text-xl font-bold mb-2">{activity.title}</h3>
                  </div>
                  <div className="p-6 text-center">
                    <p className="text-gray-600">{activity.description}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  const ActivityComponent = selectedActivity.component;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => setSelectedActivity(null)}
            className="p-2"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
          <h1 className="text-xl font-bold text-gray-800">
            {selectedActivity.title}
          </h1>
        </div>
      </div>

      {/* Activity Content */}
      <Card>
        <CardContent className="p-8">
          <ActivityComponent />
        </CardContent>
      </Card>
    </div>
  );
}
