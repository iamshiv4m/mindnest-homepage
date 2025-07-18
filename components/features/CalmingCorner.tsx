"use client";

import type React from "react";
import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Flower2,
  Palette,
  Music,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAppStore } from "@/lib/store";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider"; // Assuming you have a Slider component from shadcn/ui
import { useIsMobile } from "@/hooks/use-mobile";

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
  const { animationsEnabled } = useAppStore();
  const isMobile = useIsMobile();

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
    <div className="text-center space-y-6 sm:space-y-8">
      <div className="relative w-48 h-48 sm:w-64 sm:h-64 mx-auto">
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full opacity-30"
          animate={animationsEnabled ? { scale: getCircleScale() } : {}}
          transition={{
            duration: phase === "hold" ? 2 : phase === "inhale" ? 4 : 6,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute inset-4 sm:inset-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full opacity-50 flex items-center justify-center"
          animate={animationsEnabled ? { scale: getCircleScale() } : {}}
          transition={{
            duration: phase === "hold" ? 2 : phase === "inhale" ? 4 : 6,
            ease: "easeInOut",
          }}
        >
          <div className="text-white text-center">
            <div className="text-3xl sm:text-4xl font-bold mb-1 sm:mb-2">
              {count}
            </div>
            <div className="text-sm sm:text-lg">{getInstructions()}</div>
          </div>
        </motion.div>
      </div>

      <div className="space-y-3 sm:space-y-4">
        <Button
          onClick={() => setIsActive(!isActive)}
          className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 sm:px-8 py-2 sm:py-3 text-base sm:text-lg"
        >
          {isActive ? (
            <Pause className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
          ) : (
            <Play className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
          )}
          {isActive ? "Pause" : "Start Breathing"}
        </Button>

        <p className="text-sm sm:text-base text-gray-600">
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
  const { soundEnabled, animationsEnabled } = useAppStore();

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
          onClick={() =>
            useAppStore
              .getState()
              .updateSettings({ soundEnabled: !soundEnabled })
          }
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
              initial={
                animationsEnabled ? { scale: 0, opacity: 0 } : { opacity: 1 }
              }
              animate={{ scale: 1, opacity: 0.8 }}
              exit={
                animationsEnabled ? { scale: 0, opacity: 0 } : { opacity: 1 }
              }
              whileHover={animationsEnabled ? { scale: 1.1 } : {}}
              whileTap={animationsEnabled ? { scale: 0.8 } : {}}
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
                animate={animationsEnabled ? { scale: [1, 1.2, 1] } : {}}
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
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { soundEnabled, animationsEnabled } = useAppStore();

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
    if (!soundEnabled) return; // Only play if sound is enabled in global settings

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    if (currentSound === soundId) {
      setCurrentSound(null);
      audioRef.current = null;
      return;
    }

    // In a real app, you would load actual audio files like this:
    // const newAudio = new Audio(`/sounds/${soundId}.mp3`);
    // For now, we'll use a placeholder and rely on the soundEnabled flag
    const newAudio = new Audio(); // Placeholder for actual audio
    audioRef.current = newAudio;
    setCurrentSound(soundId);
    // newAudio.loop = true; // Loop the sound
    // newAudio.play();
  };

  useEffect(() => {
    // Cleanup audio when component unmounts or sound is disabled
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, [soundEnabled]);

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
            whileHover={animationsEnabled ? { scale: 1.05 } : {}}
            whileTap={animationsEnabled ? { scale: 0.95 } : {}}
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

// Visual Timer Component
const VisualTimer = () => {
  const [duration, setDuration] = useState(5 * 60); // Default to 5 minutes in seconds
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isRunning, setIsRunning] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const { soundEnabled, animationsEnabled, speak } = useAppStore();

  const handleStartPause = () => {
    if (isRunning) {
      clearInterval(timerRef.current!);
      speak("Timer paused.");
    } else {
      if (timeLeft === 0) {
        setTimeLeft(duration); // Reset if timer finished
      }
      speak("Timer started.");
    }
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    clearInterval(timerRef.current!);
    setIsRunning(false);
    setTimeLeft(duration);
    speak("Timer reset.");
  };

  const handleSetDuration = (e: React.ChangeEvent<HTMLInputElement>) => {
    const minutes = Number.parseInt(e.target.value);
    if (!isNaN(minutes) && minutes >= 0) {
      const newDuration = minutes * 60;
      setDuration(newDuration);
      setTimeLeft(newDuration);
    }
  };

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      clearInterval(timerRef.current!);
      setIsRunning(false);
      speak("Time's up! Great job!");
      // Play a completion sound if desired
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRunning, timeLeft, speak]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  const progress = (timeLeft / duration) * 100;

  return (
    <div className="space-y-6 text-center">
      <div className="text-2xl font-bold text-gray-800">
        Set Timer Duration (minutes)
      </div>
      <Input
        type="number"
        value={Math.floor(duration / 60)}
        onChange={handleSetDuration}
        min="1"
        className="w-32 mx-auto text-center text-lg py-3"
        aria-label="Set timer duration in minutes"
      />

      <div className="relative w-64 h-64 mx-auto bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 origin-bottom"
          style={{ height: `${progress}%` }}
          initial={animationsEnabled ? { height: "100%" } : {}}
          animate={animationsEnabled ? { height: `${progress}%` } : {}}
          transition={{ duration: 1, ease: "linear" }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-white text-5xl font-bold drop-shadow-lg z-10">
            {formatTime(timeLeft)}
          </div>
        </div>
      </div>

      <div className="flex justify-center gap-4">
        <Button
          onClick={handleStartPause}
          className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 text-lg"
        >
          {isRunning ? (
            <Pause className="w-5 h-5 mr-2" />
          ) : (
            <Play className="w-5 h-5 mr-2" />
          )}
          {isRunning ? "Pause" : "Start"}
        </Button>
        <Button
          onClick={handleReset}
          variant="outline"
          className="px-8 py-3 text-lg bg-transparent"
        >
          <RotateCcw className="w-5 h-5 mr-2" />
          Reset
        </Button>
      </div>

      <p className="text-gray-600">
        Use this timer to help with transitions, focus on tasks, or manage
        waiting times.
      </p>
    </div>
  );
};

// Sensory Play Component
const SensoryPlay = () => {
  const [activeTool, setActiveTool] = useState<
    "color-mixer" | "sound-mixer" | null
  >(null);
  const { soundEnabled, animationsEnabled } = useAppStore();
  const isMobile = useIsMobile();

  // Color Mixer Sub-component
  const ColorMixer = () => {
    const [colors, setColors] = useState<string[]>([]);
    const colorOptions = [
      "bg-red-500",
      "bg-blue-500",
      "bg-green-500",
      "bg-yellow-500",
      "bg-purple-500",
      "bg-pink-500",
      "bg-orange-500",
      "bg-teal-500",
    ];

    const addColor = (colorClass: string) => {
      setColors((prev) => [...prev, colorClass]);
    };

    const clearColors = () => {
      setColors([]);
    };

    return (
      <div className="space-y-4 sm:space-y-6">
        <div className="text-center space-y-2 sm:space-y-3">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-800">
            Color Mixer
          </h3>
          <p className="text-sm sm:text-base text-gray-600">
            Tap colors to create your own visual experience
          </p>
        </div>

        <div className="flex flex-wrap gap-2 sm:gap-3 justify-center">
          {colorOptions.map((color) => (
            <motion.button
              key={color}
              onClick={() => addColor(color)}
              className={`w-12 h-12 sm:w-16 sm:h-16 rounded-full ${color} shadow-lg hover:shadow-xl transition-all duration-200`}
              whileHover={animationsEnabled ? { scale: 1.1 } : {}}
              whileTap={animationsEnabled ? { scale: 0.9 } : {}}
            />
          ))}
        </div>

        {colors.length > 0 && (
          <div className="space-y-3 sm:space-y-4">
            <div className="flex justify-center">
              <Button
                onClick={clearColors}
                variant="outline"
                className="text-sm sm:text-base"
              >
                Clear Colors
              </Button>
            </div>
            <div className="flex flex-wrap gap-1 sm:gap-2 justify-center">
              {colors.map((color, index) => (
                <motion.div
                  key={index}
                  className={`w-8 h-8 sm:w-12 sm:h-12 rounded-full ${color} shadow-md`}
                  initial={animationsEnabled ? { scale: 0 } : {}}
                  animate={animationsEnabled ? { scale: 1 } : {}}
                  transition={{ delay: index * 0.1 }}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  // Sound Mixer Sub-component
  const SoundMixer = () => {
    const [activeSounds, setActiveSounds] = useState<Record<string, boolean>>(
      {}
    );
    const [volumes, setVolumes] = useState<Record<string, number>>({});

    const sounds = [
      { id: "rain", name: "Rain", emoji: "🌧️" },
      { id: "waves", name: "Ocean Waves", emoji: "🌊" },
      { id: "forest", name: "Forest", emoji: "🌲" },
      { id: "fire", name: "Fire", emoji: "🔥" },
      { id: "birds", name: "Birds", emoji: "🐦" },
      { id: "wind", name: "Wind", emoji: "💨" },
    ];

    const toggleSound = (id: string) => {
      setActiveSounds((prev) => ({
        ...prev,
        [id]: !prev[id],
      }));
      if (!volumes[id]) {
        setVolumes((prev) => ({ ...prev, [id]: 50 }));
      }
    };

    const handleVolumeChange = (id: string, newVolume: number[]) => {
      setVolumes((prev) => ({ ...prev, [id]: newVolume[0] }));
    };

    return (
      <div className="space-y-4 sm:space-y-6">
        <div className="text-center space-y-2 sm:space-y-3">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-800">
            Sound Mixer
          </h3>
          <p className="text-sm sm:text-base text-gray-600">
            Mix different sounds to create your perfect calming soundscape
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
          {sounds.map((sound) => (
            <div
              key={sound.id}
              className={`p-3 sm:p-4 rounded-lg border-2 transition-all duration-200 ${
                activeSounds[sound.id]
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 bg-white"
              }`}
            >
              <div className="flex items-center justify-between mb-2 sm:mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl sm:text-3xl">{sound.emoji}</span>
                  <span className="text-sm sm:text-base font-medium">
                    {sound.name}
                  </span>
                </div>
                <Button
                  variant={activeSounds[sound.id] ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleSound(sound.id)}
                  className="p-1 sm:p-2"
                >
                  {activeSounds[sound.id] ? (
                    <Volume2 className="w-3 h-3 sm:w-4 sm:h-4" />
                  ) : (
                    <VolumeX className="w-3 h-3 sm:w-4 sm:h-4" />
                  )}
                </Button>
              </div>
              {activeSounds[sound.id] && (
                <div className="space-y-2">
                  <Slider
                    value={[volumes[sound.id] || 50]}
                    onValueChange={(value) =>
                      handleVolumeChange(sound.id, value)
                    }
                    max={100}
                    step={1}
                    className="w-full"
                  />
                  <div className="text-xs sm:text-sm text-gray-500 text-center">
                    {volumes[sound.id] || 50}%
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        {!soundEnabled && (
          <p className="text-center text-red-500 text-xs sm:text-sm">
            Sound is currently disabled in settings. Please enable it to use the
            sound mixer.
          </p>
        )}
        <p className="text-center text-sm sm:text-base text-gray-600">
          Mix different sounds to create your perfect calming soundscape.
        </p>
      </div>
    );
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
        <Button
          onClick={() => setActiveTool("color-mixer")}
          variant={activeTool === "color-mixer" ? "default" : "outline"}
          className="flex-1 py-2 sm:py-3 text-sm sm:text-lg"
        >
          <Palette className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
          Color Mixer
        </Button>
        <Button
          onClick={() => setActiveTool("sound-mixer")}
          variant={activeTool === "sound-mixer" ? "default" : "outline"}
          className="flex-1 py-2 sm:py-3 text-sm sm:text-lg"
        >
          <Music className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
          Sound Mixer
        </Button>
      </div>

      <Card>
        <CardContent className="p-4 sm:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTool}
              initial={
                animationsEnabled ? { opacity: 0, y: 20 } : { opacity: 1 }
              }
              animate={{ opacity: 1, y: 0 }}
              exit={animationsEnabled ? { opacity: 0, y: -20 } : { opacity: 1 }}
              transition={{ duration: animationsEnabled ? 0.3 : 0 }}
            >
              {activeTool === "color-mixer" && <ColorMixer />}
              {activeTool === "sound-mixer" && <SoundMixer />}
              {!activeTool && (
                <div className="text-center space-y-3 sm:space-y-4 p-6 sm:p-8">
                  <div className="text-4xl sm:text-6xl">✨</div>
                  <h3 className="text-lg sm:text-2xl font-bold text-gray-800">
                    Choose a Sensory Tool
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600">
                    Explore visual or auditory experiences to help you regulate.
                  </p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </CardContent>
      </Card>
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
  {
    id: "timer",
    title: "Visual Timer",
    description: "See time pass visually for tasks and transitions",
    emoji: "⏳",
    color: "from-orange-400 to-yellow-600",
    component: VisualTimer,
  },
  {
    id: "sensory-play",
    title: "Sensory Play",
    description: "Explore interactive visual and auditory tools",
    emoji: "🌈",
    color: "from-purple-400 to-pink-600",
    component: SensoryPlay,
  },
];

export function CalmingCorner() {
  const [selectedActivity, setSelectedActivity] =
    useState<CalmingActivity | null>(null);
  const { animationsEnabled } = useAppStore();
  const isMobile = useIsMobile();

  if (!selectedActivity) {
    return (
      <div className="space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex items-center gap-2 sm:gap-3">
          <motion.div
            className="bg-gradient-to-r from-rose-500 to-pink-600 rounded-full p-2 sm:p-3"
            whileHover={animationsEnabled ? { scale: 1.05 } : {}}
          >
            <Flower2 className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </motion.div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
            Calming Corner
          </h1>
        </div>

        <p className="text-sm sm:text-lg text-gray-600 text-center max-w-2xl mx-auto">
          Take a moment to relax and feel peaceful. Choose an activity that
          helps you feel calm and happy.
        </p>

        {/* Activity Selection */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {activities.map((activity, index) => (
            <motion.div
              key={activity.id}
              initial={
                animationsEnabled ? { opacity: 0, y: 20 } : { opacity: 1 }
              }
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card
                className="cursor-pointer hover:shadow-lg transition-all duration-300 overflow-hidden"
                onClick={() => setSelectedActivity(activity)}
              >
                <CardContent className="p-0">
                  <div
                    className={`bg-gradient-to-br ${activity.color} p-6 sm:p-8 text-white text-center`}
                  >
                    <div className="text-4xl sm:text-5xl mb-3 sm:mb-4">
                      {activity.emoji}
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold mb-1 sm:mb-2">
                      {activity.title}
                    </h3>
                  </div>
                  <div className="p-4 sm:p-6 text-center">
                    <p className="text-sm sm:text-base text-gray-600">
                      {activity.description}
                    </p>
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
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 sm:gap-3">
          <Button
            variant="outline"
            onClick={() => setSelectedActivity(null)}
            className="p-1.5 sm:p-2"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
          <h1 className="text-lg sm:text-xl font-bold text-gray-800">
            {selectedActivity.title}
          </h1>
        </div>
      </div>

      {/* Activity Content */}
      <Card>
        <CardContent className="p-4 sm:p-8">
          <ActivityComponent />
        </CardContent>
      </Card>
    </div>
  );
}
