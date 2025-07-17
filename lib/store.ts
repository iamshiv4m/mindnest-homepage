import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Routine {
  id: string;
  title: string;
  steps: RoutineStep[];
  createdAt: Date;
  completedAt?: Date;
}

export interface RoutineStep {
  id: string;
  title: string;
  description?: string;
  emoji: string;
  completed: boolean;
  order: number;
}

export interface EmotionEntry {
  id: string;
  emotion: string;
  emoji: string;
  timestamp: Date;
  note?: string;
}

export interface AppSettings {
  theme: "light" | "dark" | "high-contrast";
  soundEnabled: boolean;
  animationsEnabled: boolean;
  textSize: "small" | "medium" | "large";
  autoSpeak: boolean;
}

interface AppState {
  // Settings
  theme: AppSettings["theme"];
  soundEnabled: boolean;
  animationsEnabled: boolean;
  textSize: AppSettings["textSize"];
  autoSpeak: boolean;

  // Routines
  routines: Routine[];
  currentRoutine: Routine | null;

  // Emotions
  emotionHistory: EmotionEntry[];

  // Recently used AAC symbols
  recentSymbols: string[];

  // Actions
  updateSettings: (settings: Partial<AppSettings>) => void;
  addRoutine: (routine: Omit<Routine, "id" | "createdAt">) => void;
  updateRoutine: (id: string, updates: Partial<Routine>) => void;
  deleteRoutine: (id: string) => void;
  setCurrentRoutine: (routine: Routine | null) => void;
  updateRoutineStep: (
    routineId: string,
    stepId: string,
    completed: boolean
  ) => void;
  addEmotionEntry: (entry: Omit<EmotionEntry, "id" | "timestamp">) => void;
  addRecentSymbol: (symbolId: string) => void;
  speak: (text: string) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial settings
      theme: "light",
      soundEnabled: true,
      animationsEnabled: true,
      textSize: "medium",
      autoSpeak: true,

      // Initial data
      routines: [],
      currentRoutine: null,
      emotionHistory: [],
      recentSymbols: [],

      // Actions
      updateSettings: (settings) => set((state) => ({ ...state, ...settings })),

      addRoutine: (routineData) => {
        const routine: Routine = {
          ...routineData,
          id: Date.now().toString(),
          createdAt: new Date(),
        };
        set((state) => ({ routines: [...state.routines, routine] }));
      },

      updateRoutine: (id, updates) =>
        set((state) => ({
          routines: state.routines.map((routine) =>
            routine.id === id ? { ...routine, ...updates } : routine
          ),
        })),

      deleteRoutine: (id) =>
        set((state) => ({
          routines: state.routines.filter((routine) => routine.id !== id),
          currentRoutine:
            state.currentRoutine?.id === id ? null : state.currentRoutine,
        })),

      setCurrentRoutine: (routine) => set({ currentRoutine: routine }),

      updateRoutineStep: (routineId, stepId, completed) =>
        set((state) => ({
          routines: state.routines.map((routine) =>
            routine.id === routineId
              ? {
                  ...routine,
                  steps: routine.steps.map((step) =>
                    step.id === stepId ? { ...step, completed } : step
                  ),
                }
              : routine
          ),
        })),

      addEmotionEntry: (entryData) => {
        const entry: EmotionEntry = {
          ...entryData,
          id: Date.now().toString(),
          timestamp: new Date(),
        };
        set((state) => ({ emotionHistory: [entry, ...state.emotionHistory] }));
      },

      addRecentSymbol: (symbolId) =>
        set((state) => ({
          recentSymbols: [
            symbolId,
            ...state.recentSymbols.filter((id) => id !== symbolId),
          ].slice(0, 6),
        })),

      speak: (text) => {
        const { soundEnabled } = get();
        if (!soundEnabled || !("speechSynthesis" in window)) return;

        speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.8;
        utterance.pitch = 1.1;
        utterance.volume = 0.8;
        speechSynthesis.speak(utterance);
      },
    }),
    {
      name: "mindnest-storage",
      partialize: (state) => ({
        theme: state.theme,
        soundEnabled: state.soundEnabled,
        animationsEnabled: state.animationsEnabled,
        textSize: state.textSize,
        autoSpeak: state.autoSpeak,
        routines: state.routines,
        emotionHistory: state.emotionHistory,
        recentSymbols: state.recentSymbols,
      }),
    }
  )
);
