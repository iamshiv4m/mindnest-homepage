"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Play, Check, Trash2, Calendar, Clock, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAppStore } from "@/lib/store";
import { useIsMobile } from "@/hooks/use-mobile";

const routineStepOptions = [
  {
    id: "wake-up",
    title: "Wake Up",
    emoji: "🌅",
    description: "Start the day",
  },
  {
    id: "brush-teeth",
    title: "Brush Teeth",
    emoji: "🦷",
    description: "Clean teeth",
  },
  {
    id: "wash-face",
    title: "Wash Face",
    emoji: "🧼",
    description: "Clean face",
  },
  {
    id: "get-dressed",
    title: "Get Dressed",
    emoji: "👕",
    description: "Put on clothes",
  },
  {
    id: "eat-breakfast",
    title: "Eat Breakfast",
    emoji: "🥞",
    description: "Morning meal",
  },
  {
    id: "pack-bag",
    title: "Pack Bag",
    emoji: "🎒",
    description: "Get ready to go",
  },
  {
    id: "go-to-school",
    title: "Go to School",
    emoji: "🏫",
    description: "Travel to school",
  },
  { id: "lunch", title: "Lunch Time", emoji: "🍎", description: "Midday meal" },
  {
    id: "homework",
    title: "Do Homework",
    emoji: "📚",
    description: "Study time",
  },
  {
    id: "play",
    title: "Play Time",
    emoji: "🎮",
    description: "Fun activities",
  },
  {
    id: "dinner",
    title: "Eat Dinner",
    emoji: "🍽️",
    description: "Evening meal",
  },
  { id: "bath", title: "Take Bath", emoji: "🛁", description: "Get clean" },
  { id: "bedtime", title: "Go to Bed", emoji: "🛏️", description: "Sleep time" },
];

export function VisualRoutineBuilder() {
  const {
    routines,
    currentRoutine,
    addRoutine,
    updateRoutine,
    deleteRoutine,
    setCurrentRoutine,
    updateRoutineStep,
    speak,
    animationsEnabled,
  } = useAppStore();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newRoutineTitle, setNewRoutineTitle] = useState("");
  const [selectedSteps, setSelectedSteps] = useState<typeof routineStepOptions>(
    []
  );
  const isMobile = useIsMobile();

  const handleCreateRoutine = () => {
    if (!newRoutineTitle.trim() || selectedSteps.length === 0) return;

    const routine = {
      title: newRoutineTitle,
      steps: selectedSteps.map((step, index) => ({
        id: step.id,
        title: step.title,
        description: step.description,
        emoji: step.emoji,
        completed: false,
        order: index,
      })),
    };

    addRoutine(routine);
    setNewRoutineTitle("");
    setSelectedSteps([]);
    setShowCreateForm(false);
    speak(`Created new routine: ${newRoutineTitle}`);
  };

  const handleStepToggle = (
    routineId: string,
    stepId: string,
    completed: boolean
  ) => {
    updateRoutineStep(routineId, stepId, completed);
    const step = routines
      .find((r) => r.id === routineId)
      ?.steps.find((s) => s.id === stepId);
    if (step) {
      speak(
        completed ? `Completed: ${step.title}` : `Unchecked: ${step.title}`
      );
    }
  };

  const handleStartRoutine = (routine: any) => {
    setCurrentRoutine(routine);
    speak(`Starting routine: ${routine.title}`);
  };

  if (showCreateForm) {
    return (
      <div className="space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
            Create New Routine
          </h2>
          <Button variant="outline" onClick={() => setShowCreateForm(false)}>
            Cancel
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Routine Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 sm:space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Routine Name
              </label>
              <Input
                value={newRoutineTitle}
                onChange={(e) => setNewRoutineTitle(e.target.value)}
                placeholder="My Morning Routine"
                className="text-base sm:text-lg py-2 sm:py-3"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3 sm:mb-4">
                Choose Steps (tap to add/remove)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3">
                {routineStepOptions.map((step) => {
                  const isSelected = selectedSteps.some(
                    (s) => s.id === step.id
                  );
                  return (
                    <motion.button
                      key={step.id}
                      onClick={() => {
                        if (isSelected) {
                          setSelectedSteps(
                            selectedSteps.filter((s) => s.id !== step.id)
                          );
                        } else {
                          setSelectedSteps([...selectedSteps, step]);
                        }
                      }}
                      className={`p-3 sm:p-4 rounded-xl border-2 transition-all duration-200 ${
                        isSelected
                          ? "border-blue-500 bg-blue-50 text-blue-700"
                          : "border-gray-200 hover:border-gray-300 bg-white"
                      }`}
                      whileHover={animationsEnabled ? { scale: 1.02 } : {}}
                      whileTap={animationsEnabled ? { scale: 0.98 } : {}}
                    >
                      <div className="text-2xl sm:text-3xl mb-1 sm:mb-2">
                        {step.emoji}
                      </div>
                      <div className="font-medium text-xs sm:text-sm">
                        {step.title}
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {selectedSteps.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Selected Steps ({selectedSteps.length})
                </label>
                <div className="flex flex-wrap gap-2">
                  {selectedSteps.map((step, index) => (
                    <div
                      key={step.id}
                      className="flex items-center gap-1 sm:gap-2 bg-blue-100 text-blue-800 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm"
                    >
                      <span>{index + 1}.</span>
                      <span>{step.emoji}</span>
                      <span className="hidden sm:inline">{step.title}</span>
                      <span className="sm:hidden">
                        {step.title.split(" ")[0]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <Button
              onClick={handleCreateRoutine}
              disabled={!newRoutineTitle.trim() || selectedSteps.length === 0}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2 sm:py-3 text-base sm:text-lg"
            >
              <Plus className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              Create Routine
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (currentRoutine) {
    const completedSteps = currentRoutine.steps.filter(
      (step) => step.completed
    ).length;
    const totalSteps = currentRoutine.steps.length;
    const progress = (completedSteps / totalSteps) * 100;

    return (
      <div className="space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
              {currentRoutine.title}
            </h2>
            <p className="text-sm sm:text-base text-gray-600">
              {completedSteps} of {totalSteps} steps completed
            </p>
          </div>
          <Button variant="outline" onClick={() => setCurrentRoutine(null)}>
            Back to Routines
          </Button>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-3 sm:h-4">
          <motion.div
            className="bg-gradient-to-r from-green-400 to-blue-500 h-3 sm:h-4 rounded-full flex items-center justify-end pr-2"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          >
            {progress > 20 && (
              <span className="text-white text-xs font-bold">
                {Math.round(progress)}%
              </span>
            )}
          </motion.div>
        </div>

        {/* Steps */}
        <div className="space-y-3 sm:space-y-4">
          {currentRoutine.steps.map((step, index) => (
            <motion.div
              key={step.id}
              initial={
                animationsEnabled ? { opacity: 0, x: -20 } : { opacity: 1 }
              }
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card
                className={`transition-all duration-300 ${
                  step.completed
                    ? "bg-green-50 border-green-200"
                    : "hover:shadow-md"
                }`}
              >
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <button
                      onClick={() =>
                        handleStepToggle(
                          currentRoutine.id,
                          step.id,
                          !step.completed
                        )
                      }
                      className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                        step.completed
                          ? "bg-green-500 border-green-500 text-white"
                          : "border-gray-300 hover:border-green-400"
                      }`}
                    >
                      {step.completed ? (
                        <Check className="w-5 h-5 sm:w-6 sm:h-6" />
                      ) : (
                        <span className="text-base sm:text-lg font-bold">
                          {index + 1}
                        </span>
                      )}
                    </button>

                    <div className="text-3xl sm:text-4xl">{step.emoji}</div>

                    <div className="flex-1 min-w-0">
                      <h3
                        className={`text-lg sm:text-xl font-semibold truncate ${
                          step.completed
                            ? "text-green-700 line-through"
                            : "text-gray-800"
                        }`}
                      >
                        {step.title}
                      </h3>
                      {step.description && (
                        <p
                          className={`text-sm sm:text-base text-gray-600 ${
                            step.completed ? "line-through" : ""
                          }`}
                        >
                          {step.description}
                        </p>
                      )}
                    </div>

                    {step.completed && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="text-green-500 flex-shrink-0"
                      >
                        <Star className="w-5 h-5 sm:w-6 sm:h-6 fill-current" />
                      </motion.div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {completedSteps === totalSteps && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-4 p-6 sm:p-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-xl text-white"
          >
            <div className="text-4xl sm:text-6xl">🎉</div>
            <h3 className="text-xl sm:text-2xl font-bold">Congratulations!</h3>
            <p className="text-base sm:text-lg">You completed your routine!</p>
            <Button
              onClick={() => setCurrentRoutine(null)}
              className="bg-white text-green-600 hover:bg-gray-100"
            >
              Back to Routines
            </Button>
          </motion.div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-2 sm:gap-3">
          <motion.div
            className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-full p-2 sm:p-3"
            whileHover={animationsEnabled ? { scale: 1.05 } : {}}
          >
            <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </motion.div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
            My Routines
          </h1>
        </div>

        <Button
          onClick={() => setShowCreateForm(true)}
          className="bg-gradient-to-r from-blue-500 to-purple-600 text-white w-full sm:w-auto"
        >
          <Plus className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
          Create Routine
        </Button>
      </div>

      {routines.length === 0 ? (
        <Card className="border-2 border-dashed border-gray-300 bg-gradient-to-br from-blue-50 to-purple-50">
          <CardContent className="p-6 sm:p-12 text-center space-y-4 sm:space-y-6">
            <div className="text-4xl sm:text-6xl">📅</div>
            <div className="space-y-2 sm:space-y-3">
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-800">
                Ready to create your first routine?
              </h3>
              <p className="text-sm sm:text-lg text-gray-600">
                Build step-by-step visual guides that help you navigate your day
                with confidence
              </p>
            </div>
            <Button
              onClick={() => setShowCreateForm(true)}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 sm:px-8 py-2 sm:py-3 text-base sm:text-lg"
            >
              <Plus className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3" />
              Create New Routine
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {routines.map((routine, index) => {
            const completedSteps = routine.steps.filter(
              (step) => step.completed
            ).length;
            const totalSteps = routine.steps.length;
            const progress =
              totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0;

            return (
              <motion.div
                key={routine.id}
                initial={
                  animationsEnabled ? { opacity: 0, y: 20 } : { opacity: 1 }
                }
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base sm:text-lg truncate">
                        {routine.title}
                      </CardTitle>
                      <div className="flex gap-1 sm:gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteRoutine(routine.id);
                          }}
                          className="text-red-500 hover:text-red-700 p-1 sm:p-2"
                        >
                          <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3 sm:space-y-4">
                    <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                      <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span>{totalSteps} steps</span>
                      <span>•</span>
                      <span>{completedSteps} completed</span>
                    </div>

                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      />
                    </div>

                    <div className="flex flex-wrap gap-1 sm:gap-2">
                      {routine.steps.slice(0, isMobile ? 4 : 6).map((step) => (
                        <span
                          key={step.id}
                          className="text-xl sm:text-2xl"
                          title={step.title}
                        >
                          {step.emoji}
                        </span>
                      ))}
                      {routine.steps.length > (isMobile ? 4 : 6) && (
                        <span className="text-gray-400 text-xs sm:text-sm">
                          +{routine.steps.length - (isMobile ? 4 : 6)} more
                        </span>
                      )}
                    </div>

                    <Button
                      onClick={() => handleStartRoutine(routine)}
                      className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm sm:text-base"
                    >
                      <Play className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                      Start Routine
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
