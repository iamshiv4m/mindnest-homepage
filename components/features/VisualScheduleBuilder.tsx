"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  ClipboardList,
  Plus,
  Check,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Edit,
  Save,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAppStore, type ScheduleActivity } from "@/lib/store";

const predefinedActivities = [
  { id: "wake-up", title: "Wake Up", emoji: "🌅" },
  { id: "brush-teeth", title: "Brush Teeth", emoji: "🦷" },
  { id: "eat-breakfast", title: "Eat Breakfast", emoji: "🥞" },
  { id: "go-to-school", title: "Go to School", emoji: "🏫" },
  { id: "lunch", title: "Lunch Time", emoji: "🍎" },
  { id: "play-time", title: "Play Time", emoji: "🎮" },
  { id: "homework", title: "Do Homework", emoji: "📚" },
  { id: "eat-dinner", title: "Eat Dinner", emoji: "🍽️" },
  { id: "bath-time", title: "Bath Time", emoji: "🛁" },
  { id: "bedtime", title: "Go to Bed", emoji: "🛏️" },
  { id: "read-book", title: "Read a Book", emoji: "📖" },
  { id: "clean-room", title: "Clean Room", emoji: "🧹" },
  { id: "exercise", title: "Exercise", emoji: "🏃" },
  { id: "therapy", title: "Therapy Session", emoji: "🧠" },
  { id: "chores", title: "Do Chores", emoji: "🧺" },
];

const formatDate = (date: Date) => date.toISOString().split("T")[0]; // YYYY-MM-DD
const displayDate = (date: Date) => {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  if (formatDate(date) === formatDate(today)) return "Today";
  if (formatDate(date) === formatDate(tomorrow)) return "Tomorrow";
  if (formatDate(date) === formatDate(yesterday)) return "Yesterday";

  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
};

export function VisualScheduleBuilder() {
  const {
    getDailySchedule,
    addOrUpdateDailySchedule,
    updateScheduleActivity,
    clearDailySchedule,
    speak,
    animationsEnabled,
  } = useAppStore();

  const [currentDate, setCurrentDate] = useState(new Date());
  const [scheduleActivities, setScheduleActivities] = useState<
    ScheduleActivity[]
  >([]);
  const [editingMode, setEditingMode] = useState(false);
  const [newActivityTitle, setNewActivityTitle] = useState("");
  const [newActivityEmoji, setNewActivityEmoji] = useState("");
  const [editingActivityId, setEditingActivityId] = useState<string | null>(
    null
  );

  const formattedCurrentDate = formatDate(currentDate);

  useEffect(() => {
    const savedSchedule = getDailySchedule(formattedCurrentDate);
    if (savedSchedule) {
      setScheduleActivities(savedSchedule.activities);
    } else {
      setScheduleActivities([]);
    }
    setEditingMode(false); // Exit editing mode when date changes
    setEditingActivityId(null);
  }, [formattedCurrentDate, getDailySchedule]);

  const handleSaveSchedule = useCallback(() => {
    const sortedActivities = [...scheduleActivities].sort(
      (a, b) => a.order - b.order
    );
    addOrUpdateDailySchedule(formattedCurrentDate, sortedActivities);
    setEditingMode(false);
    setEditingActivityId(null);
    speak("Schedule saved!");
  }, [
    scheduleActivities,
    formattedCurrentDate,
    addOrUpdateDailySchedule,
    speak,
  ]);

  const handleActivityToggle = useCallback(
    (activityId: string, completed: boolean) => {
      setScheduleActivities((prev) =>
        prev.map((activity) =>
          activity.id === activityId ? { ...activity, completed } : activity
        )
      );
      updateScheduleActivity(formattedCurrentDate, activityId, { completed });
      const activity = scheduleActivities.find((a) => a.id === activityId);
      if (activity) {
        speak(
          completed
            ? `Completed: ${activity.title}`
            : `Unchecked: ${activity.title}`
        );
      }
    },
    [formattedCurrentDate, scheduleActivities, speak, updateScheduleActivity]
  );

  const handleAddActivity = useCallback(
    (title: string, emoji: string, time?: string) => {
      if (!title.trim() || !emoji.trim()) return;

      const newActivity: ScheduleActivity = {
        id: Date.now().toString(),
        title: title.trim(),
        emoji: emoji.trim(),
        time: time || undefined,
        completed: false,
        order: scheduleActivities.length,
      };
      setScheduleActivities((prev) => [...prev, newActivity]);
      setNewActivityTitle("");
      setNewActivityEmoji("");
      speak(`Added ${title} to schedule.`);
    },
    [scheduleActivities.length, speak]
  );

  const handleUpdateActivity = useCallback(
    (
      activityId: string,
      newTitle: string,
      newEmoji: string,
      newTime?: string
    ) => {
      setScheduleActivities((prev) =>
        prev.map((activity) =>
          activity.id === activityId
            ? {
                ...activity,
                title: newTitle,
                emoji: newEmoji,
                time: newTime || undefined,
              }
            : activity
        )
      );
      setEditingActivityId(null);
      speak("Activity updated.");
    },
    [speak]
  );

  const handleDeleteActivity = useCallback(
    (activityId: string) => {
      setScheduleActivities((prev) =>
        prev.filter((activity) => activity.id !== activityId)
      );
      speak("Activity deleted.");
    },
    [speak]
  );

  const handleMoveActivity = useCallback(
    (activityId: string, direction: "up" | "down") => {
      setScheduleActivities((prev) => {
        const index = prev.findIndex((a) => a.id === activityId);
        if (index === -1) return prev;

        const newIndex = direction === "up" ? index - 1 : index + 1;
        if (newIndex < 0 || newIndex >= prev.length) return prev;

        const newActivities = [...prev];
        const [movedActivity] = newActivities.splice(index, 1);
        newActivities.splice(newIndex, 0, movedActivity);

        // Reassign order based on new array position
        return newActivities.map((activity, idx) => ({
          ...activity,
          order: idx,
        }));
      });
    },
    []
  );

  const handleClearDaySchedule = useCallback(() => {
    if (
      window.confirm(
        "Are you sure you want to clear all activities for this day?"
      )
    ) {
      clearDailySchedule(formattedCurrentDate);
      setScheduleActivities([]);
      speak("Daily schedule cleared.");
    }
  }, [clearDailySchedule, formattedCurrentDate, speak]);

  const navigateDate = (days: number) => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + days);
    setCurrentDate(newDate);
    speak(`Navigating to ${displayDate(newDate)}'s schedule.`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <motion.div
            className="bg-gradient-to-r from-teal-500 to-cyan-600 rounded-full p-3"
            whileHover={animationsEnabled ? { scale: 1.05 } : {}}
          >
            <ClipboardList className="w-6 h-6 text-white" />
          </motion.div>
          <h1 className="text-2xl font-bold text-gray-800">
            My Daily Schedule
          </h1>
        </div>
        <div className="flex gap-2">
          {editingMode ? (
            <Button
              onClick={handleSaveSchedule}
              className="bg-green-500 text-white"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Schedule
            </Button>
          ) : (
            <Button onClick={() => setEditingMode(true)} variant="outline">
              <Edit className="w-4 h-4 mr-2" />
              Edit Schedule
            </Button>
          )}
        </div>
      </div>

      {/* Date Navigation */}
      <Card>
        <CardContent className="p-4 flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => navigateDate(-1)}
            aria-label="Previous Day"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <h2 className="text-xl font-semibold text-gray-800">
            {displayDate(currentDate)}
          </h2>
          <Button
            variant="ghost"
            onClick={() => navigateDate(1)}
            aria-label="Next Day"
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </CardContent>
      </Card>

      {scheduleActivities.length === 0 && !editingMode ? (
        <Card className="border-2 border-dashed border-teal-300 bg-gradient-to-br from-cyan-50 to-teal-50">
          <CardContent className="p-12 text-center space-y-6">
            <div className="text-6xl">🗓️</div>
            <div className="space-y-3">
              <h3 className="text-2xl font-semibold text-gray-800">
                No schedule for today!
              </h3>
              <p className="text-gray-600 text-lg">
                Create a visual schedule to help organize your day and know
                what's next.
              </p>
            </div>
            <Button
              onClick={() => setEditingMode(true)}
              className="bg-gradient-to-r from-teal-500 to-cyan-600 text-white px-8 py-3 text-lg"
            >
              <Plus className="w-6 h-6 mr-3" />
              Build Schedule
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {scheduleActivities.length > 0 && (
            <div className="flex justify-end">
              <Button
                onClick={handleClearDaySchedule}
                variant="destructive"
                size="sm"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Clear Day
              </Button>
            </div>
          )}

          {scheduleActivities.map((activity, index) => (
            <motion.div
              key={activity.id}
              initial={
                animationsEnabled ? { opacity: 0, y: 20 } : { opacity: 1 }
              }
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card
                className={`transition-all duration-300 ${
                  activity.completed
                    ? "bg-green-50 border-green-200"
                    : "hover:shadow-md"
                }`}
              >
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    {!editingMode && (
                      <button
                        onClick={() =>
                          handleActivityToggle(activity.id, !activity.completed)
                        }
                        className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                          activity.completed
                            ? "bg-green-500 border-green-500 text-white"
                            : "border-gray-300 hover:border-green-400"
                        }`}
                        aria-label={
                          activity.completed
                            ? `Mark ${activity.title} as incomplete`
                            : `Mark ${activity.title} as complete`
                        }
                      >
                        {activity.completed ? (
                          <Check className="w-6 h-6" />
                        ) : (
                          <span className="text-lg font-bold">{index + 1}</span>
                        )}
                      </button>
                    )}
                    {editingMode && (
                      <div className="w-12 h-12 flex items-center justify-center text-lg font-bold text-gray-600">
                        {index + 1}
                      </div>
                    )}

                    <div className="text-4xl">{activity.emoji}</div>

                    <div className="flex-1">
                      {editingActivityId === activity.id ? (
                        <div className="flex flex-col gap-2">
                          <Input
                            value={activity.title}
                            onChange={(e) =>
                              setScheduleActivities((prev) =>
                                prev.map((a) =>
                                  a.id === activity.id
                                    ? { ...a, title: e.target.value }
                                    : a
                                )
                              )
                            }
                            placeholder="Activity title"
                            className="text-lg py-2"
                          />
                          <div className="flex gap-2">
                            <Input
                              value={activity.emoji}
                              onChange={(e) =>
                                setScheduleActivities((prev) =>
                                  prev.map((a) =>
                                    a.id === activity.id
                                      ? { ...a, emoji: e.target.value }
                                      : a
                                  )
                                )
                              }
                              placeholder="Emoji"
                              className="w-20 text-lg py-2"
                            />
                            <Input
                              type="time"
                              value={activity.time || ""}
                              onChange={(e) =>
                                setScheduleActivities((prev) =>
                                  prev.map((a) =>
                                    a.id === activity.id
                                      ? { ...a, time: e.target.value }
                                      : a
                                  )
                                )
                              }
                              className="w-32 text-lg py-2"
                            />
                            <Button
                              onClick={() =>
                                handleUpdateActivity(
                                  activity.id,
                                  activity.title,
                                  activity.emoji,
                                  activity.time
                                )
                              }
                              size="sm"
                            >
                              <Save className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <h3
                            className={`text-xl font-semibold ${
                              activity.completed
                                ? "text-green-700 line-through"
                                : "text-gray-800"
                            }`}
                          >
                            {activity.title}
                          </h3>
                          {activity.time && (
                            <p
                              className={`text-gray-600 text-sm ${
                                activity.completed ? "line-through" : ""
                              }`}
                            >
                              {activity.time}
                            </p>
                          )}
                        </>
                      )}
                    </div>

                    {editingMode && editingActivityId !== activity.id && (
                      <div className="flex flex-col gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingActivityId(activity.id)}
                          aria-label={`Edit ${activity.title}`}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteActivity(activity.id)}
                          className="text-red-500 hover:text-red-700"
                          aria-label={`Delete ${activity.title}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleMoveActivity(activity.id, "up")}
                          disabled={index === 0}
                          aria-label={`Move ${activity.title} up`}
                        >
                          <ArrowUp className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            handleMoveActivity(activity.id, "down")
                          }
                          disabled={index === scheduleActivities.length - 1}
                          aria-label={`Move ${activity.title} down`}
                        >
                          <ArrowDown className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}

          {editingMode && (
            <Card className="border-2 border-dashed border-gray-300 bg-gray-50">
              <CardContent className="p-6 space-y-4">
                <h3 className="text-lg font-semibold text-gray-700">
                  Add New Activity
                </h3>
                <div className="flex gap-2">
                  <Input
                    value={newActivityTitle}
                    onChange={(e) => setNewActivityTitle(e.target.value)}
                    placeholder="Activity title (e.g., 'Go to park')"
                    className="flex-1 text-lg py-2"
                  />
                  <Input
                    value={newActivityEmoji}
                    onChange={(e) => setNewActivityEmoji(e.target.value)}
                    placeholder="Emoji (e.g., 🌳)"
                    className="w-24 text-lg py-2"
                  />
                  <Input
                    type="time"
                    onChange={(e) =>
                      handleAddActivity(
                        newActivityTitle,
                        newActivityEmoji,
                        e.target.value
                      )
                    }
                    className="w-32 text-lg py-2"
                  />
                  <Button
                    onClick={() =>
                      handleAddActivity(newActivityTitle, newActivityEmoji)
                    }
                    disabled={
                      !newActivityTitle.trim() || !newActivityEmoji.trim()
                    }
                    className="px-4 py-2"
                  >
                    <Plus className="w-5 h-5" />
                  </Button>
                </div>

                <h3 className="text-lg font-semibold text-gray-700 mt-6">
                  Or Choose from Predefined
                </h3>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                  {predefinedActivities.map((activity) => (
                    <motion.button
                      key={activity.id}
                      onClick={() =>
                        handleAddActivity(activity.title, activity.emoji)
                      }
                      className="p-3 rounded-lg border border-gray-200 bg-white hover:bg-gray-100 transition-colors text-center"
                      whileHover={animationsEnabled ? { scale: 1.02 } : {}}
                      whileTap={animationsEnabled ? { scale: 0.98 } : {}}
                    >
                      <div className="text-3xl mb-1">{activity.emoji}</div>
                      <div className="text-xs font-medium">
                        {activity.title}
                      </div>
                    </motion.button>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
