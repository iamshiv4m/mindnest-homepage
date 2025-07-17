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

export interface ScheduleActivity {
  id: string;
  title: string;
  emoji: string;
  time?: string; // Optional time for the activity (e.g., "08:00 AM")
  completed: boolean;
  order: number;
}

export interface DailySchedule {
  date: string; // YYYY-MM-DD format
  activities: ScheduleActivity[];
}

export interface IEPProgressEntry {
  id: string;
  date: string; // YYYY-MM-DD
  value: number; // e.g., percentage, count, or score
  notes?: string;
  timestamp: Date;
}

export interface IEPGoal {
  id: string;
  title: string;
  description?: string;
  target: string; // e.g., "80% accuracy", "5 times per day"
  progressEntries: IEPProgressEntry[];
  createdAt: Date;
}

export interface IEP {
  id: string;
  studentName: string;
  iepPeriod: string; // e.g., "2023-2024"
  goals: IEPGoal[];
  createdAt: Date;
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

  // Daily Schedules
  dailySchedules: { [date: string]: DailySchedule }; // Keyed by YYYY-MM-DD

  // IEPs
  ieps: IEP[];

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

  // Schedule Actions
  addOrUpdateDailySchedule: (
    date: string,
    activities: ScheduleActivity[]
  ) => void;
  getDailySchedule: (date: string) => DailySchedule | undefined;
  updateScheduleActivity: (
    date: string,
    activityId: string,
    updates: Partial<ScheduleActivity>
  ) => void;
  clearDailySchedule: (date: string) => void;

  // IEP Actions
  addIEP: (iep: Omit<IEP, "id" | "createdAt" | "goals">) => void;
  updateIEP: (iepId: string, updates: Partial<IEP>) => void;
  deleteIEP: (iepId: string) => void;
  addIEPGoal: (
    iepId: string,
    goal: Omit<IEPGoal, "id" | "createdAt" | "progressEntries">
  ) => void;
  updateIEPGoal: (
    iepId: string,
    goalId: string,
    updates: Partial<IEPGoal>
  ) => void;
  deleteIEPGoal: (iepId: string, goalId: string) => void;
  addIEPProgressEntry: (
    iepId: string,
    goalId: string,
    entry: Omit<IEPProgressEntry, "id" | "timestamp">
  ) => void;
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
      dailySchedules: {},
      ieps: [],

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

      // Schedule Actions
      addOrUpdateDailySchedule: (date, activities) =>
        set((state) => ({
          dailySchedules: {
            ...state.dailySchedules,
            [date]: { date, activities },
          },
        })),
      getDailySchedule: (date) => get().dailySchedules[date],
      updateScheduleActivity: (date, activityId, updates) =>
        set((state) => {
          const schedule = state.dailySchedules[date];
          if (!schedule) return state;

          const updatedActivities = schedule.activities.map((activity) =>
            activity.id === activityId ? { ...activity, ...updates } : activity
          );
          return {
            dailySchedules: {
              ...state.dailySchedules,
              [date]: { ...schedule, activities: updatedActivities },
            },
          };
        }),
      clearDailySchedule: (date) =>
        set((state) => {
          const newSchedules = { ...state.dailySchedules };
          delete newSchedules[date];
          return { dailySchedules: newSchedules };
        }),

      // IEP Actions
      addIEP: (iepData) => {
        const iep: IEP = {
          ...iepData,
          id: Date.now().toString(),
          createdAt: new Date(),
          goals: [],
        };
        set((state) => ({ ieps: [...state.ieps, iep] }));
      },
      updateIEP: (iepId, updates) =>
        set((state) => ({
          ieps: state.ieps.map((iep) =>
            iep.id === iepId ? { ...iep, ...updates } : iep
          ),
        })),
      deleteIEP: (iepId) =>
        set((state) => ({
          ieps: state.ieps.filter((iep) => iep.id !== iepId),
        })),
      addIEPGoal: (iepId, goalData) =>
        set((state) => ({
          ieps: state.ieps.map((iep) =>
            iep.id === iepId
              ? {
                  ...iep,
                  goals: [
                    ...iep.goals,
                    {
                      ...goalData,
                      id: Date.now().toString(),
                      createdAt: new Date(),
                      progressEntries: [],
                    },
                  ],
                }
              : iep
          ),
        })),
      updateIEPGoal: (iepId, goalId, updates) =>
        set((state) => ({
          ieps: state.ieps.map((iep) =>
            iep.id === iepId
              ? {
                  ...iep,
                  goals: iep.goals.map((goal) =>
                    goal.id === goalId ? { ...goal, ...updates } : goal
                  ),
                }
              : iep
          ),
        })),
      deleteIEPGoal: (iepId, goalId) =>
        set((state) => ({
          ieps: state.ieps.map((iep) =>
            iep.id === iepId
              ? {
                  ...iep,
                  goals: iep.goals.filter((goal) => goal.id !== goalId),
                }
              : iep
          ),
        })),
      addIEPProgressEntry: (iepId, goalId, entryData) =>
        set((state) => ({
          ieps: state.ieps.map((iep) =>
            iep.id === iepId
              ? {
                  ...iep,
                  goals: iep.goals.map((goal) =>
                    goal.id === goalId
                      ? {
                          ...goal,
                          progressEntries: [
                            ...goal.progressEntries,
                            {
                              ...entryData,
                              id: Date.now().toString(),
                              timestamp: new Date(),
                            },
                          ].sort(
                            (a, b) =>
                              new Date(a.date).getTime() -
                              new Date(b.date).getTime()
                          ), // Sort by date
                        }
                      : goal
                  ),
                }
              : iep
          ),
        })),
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
        dailySchedules: state.dailySchedules,
        ieps: state.ieps, // Persist IEP data
      }),
    }
  )
);
