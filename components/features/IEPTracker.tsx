"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  ClipboardCheck,
  Plus,
  Trash2,
  ArrowLeft,
  Target,
  SquarePen,
  LineChart,
  Printer,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAppStore, type IEP, type IEPGoal } from "@/lib/store";
import { PrintableIEPSummary } from "@/components/features/PrintableIEPSummary";

const formatDate = (date: Date) => date.toISOString().split("T")[0]; // YYYY-MM-DD

export function IEPTracker() {
  const {
    ieps,
    addIEP,
    updateIEP,
    deleteIEP,
    addIEPGoal,
    updateIEPGoal,
    deleteIEPGoal,
    addIEPProgressEntry,
    speak,
    animationsEnabled,
  } = useAppStore();

  const [selectedIEP, setSelectedIEP] = useState<IEP | null>(null);
  const [showAddIEPForm, setShowAddIEPForm] = useState(false);
  const [newIEPName, setNewIEPName] = useState("");
  const [newIEPPeriod, setNewIEPPeriod] = useState("");

  const [showAddGoalForm, setShowAddGoalForm] = useState(false);
  const [newGoalTitle, setNewGoalTitle] = useState("");
  const [newGoalDescription, setNewGoalDescription] = useState("");
  const [newGoalTarget, setNewGoalTarget] = useState("");

  const [showAddProgressForm, setShowAddProgressForm] = useState<string | null>(
    null
  ); // Goal ID
  const [progressValue, setProgressValue] = useState<string>("");
  const [progressNotes, setProgressNotes] = useState("");
  const [progressDate, setProgressDate] = useState(formatDate(new Date()));

  const handleAddIEP = () => {
    if (!newIEPName.trim() || !newIEPPeriod.trim()) return;
    addIEP({ studentName: newIEPName.trim(), iepPeriod: newIEPPeriod.trim() });
    speak(`Added IEP for ${newIEPName} for ${newIEPPeriod}.`);
    setNewIEPName("");
    setNewIEPPeriod("");
    setShowAddIEPForm(false);
  };

  const handleDeleteIEP = (iepId: string) => {
    if (
      window.confirm(
        "Are you sure you want to delete this IEP? This cannot be undone."
      )
    ) {
      deleteIEP(iepId);
      if (selectedIEP?.id === iepId) {
        setSelectedIEP(null);
      }
      speak("IEP deleted.");
    }
  };

  const handleAddGoal = () => {
    if (!selectedIEP || !newGoalTitle.trim() || !newGoalTarget.trim()) return;
    addIEPGoal(selectedIEP.id, {
      title: newGoalTitle.trim(),
      description: newGoalDescription.trim() || undefined,
      target: newGoalTarget.trim(),
    });
    speak(`Added new goal: ${newGoalTitle}.`);
    setNewGoalTitle("");
    setNewGoalDescription("");
    setNewGoalTarget("");
    setShowAddGoalForm(false);
  };

  const handleDeleteGoal = (goalId: string) => {
    if (
      !selectedIEP ||
      !window.confirm("Are you sure you want to delete this goal?")
    )
      return;
    deleteIEPGoal(selectedIEP.id, goalId);
    speak("Goal deleted.");
  };

  const handleAddProgress = (goalId: string) => {
    if (
      !selectedIEP ||
      !showAddProgressForm ||
      !progressValue.trim() ||
      !progressDate.trim()
    )
      return;

    addIEPProgressEntry(selectedIEP.id, goalId, {
      value: Number.parseFloat(progressValue),
      notes: progressNotes.trim() || undefined,
      date: progressDate,
    });
    speak(`Progress added for goal. Value: ${progressValue}.`);
    setShowAddProgressForm(null);
    setProgressValue("");
    setProgressNotes("");
    setProgressDate(formatDate(new Date()));
  };

  const getGoalProgress = (goal: IEPGoal) => {
    if (goal.progressEntries.length === 0) return "No progress yet";
    const latestEntry = goal.progressEntries[goal.progressEntries.length - 1];
    return `Latest: ${latestEntry.value} on ${latestEntry.date}`;
  };

  const getOverallProgressPercentage = (goal: IEPGoal) => {
    if (goal.progressEntries.length === 0) return 0;
    // This is a simplified calculation. A real IEP would have more complex metrics.
    // Assuming target is a number for simplicity, e.g., "80" for 80%
    const latestValue =
      goal.progressEntries[goal.progressEntries.length - 1].value;
    const targetNum = Number.parseFloat(goal.target.replace(/[^0-9.]/g, "")); // Extract number from target string
    if (isNaN(targetNum) || targetNum === 0) return 0;
    return Math.min(100, (latestValue / targetNum) * 100);
  };

  const handlePrintSummary = () => {
    if (selectedIEP) {
      // Temporarily render the printable component in a hidden div
      // and then trigger print.
      const printContent = document.getElementById("print-container");
      if (printContent) {
        const originalContents = document.body.innerHTML;
        const printContents = printContent.innerHTML;

        document.body.innerHTML = printContents;
        window.print();
        document.body.innerHTML = originalContents; // Restore original content
        window.location.reload(); // Reload to re-mount React components
      }
    }
  };

  if (selectedIEP) {
    return (
      <div className="space-y-6">
        {/* Hidden container for printing */}
        <div id="print-container" className="hidden">
          <PrintableIEPSummary iep={selectedIEP} />
        </div>

        {/* IEP Detail Header */}
        <div className="flex items-center justify-between no-print">
          <Button
            variant="outline"
            onClick={() => setSelectedIEP(null)}
            className="p-2"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to IEPs
          </Button>
          <h1 className="text-2xl font-bold text-gray-800">
            {selectedIEP.studentName}'s IEP ({selectedIEP.iepPeriod})
          </h1>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrintSummary}
              aria-label="Print IEP Summary"
            >
              <Printer className="w-4 h-4 mr-2" />
              Print
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => handleDeleteIEP(selectedIEP.id)}
              aria-label={`Delete IEP for ${selectedIEP.studentName}`}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Add Goal Form */}
        {showAddGoalForm ? (
          <Card className="no-print">
            <CardHeader>
              <CardTitle>Add New Goal</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="Goal Title (e.g., 'Identify 5 emotions')"
                value={newGoalTitle}
                onChange={(e) => setNewGoalTitle(e.target.value)}
                className="text-lg py-3"
              />
              <Textarea
                placeholder="Description (optional)"
                value={newGoalDescription}
                onChange={(e) => setNewGoalDescription(e.target.value)}
                className="min-h-[80px] text-lg"
              />
              <Input
                placeholder="Target (e.g., '80% accuracy', '5 times per day')"
                value={newGoalTarget}
                onChange={(e) => setNewGoalTarget(e.target.value)}
                className="text-lg py-3"
              />
              <div className="flex gap-2">
                <Button
                  onClick={handleAddGoal}
                  className="flex-1 bg-green-500 text-white"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Add Goal
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowAddGoalForm(false)}
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Button
            onClick={() => setShowAddGoalForm(true)}
            className="w-full bg-indigo-500 text-white no-print"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add New Goal
          </Button>
        )}

        {/* Goals List */}
        <div className="space-y-4">
          {selectedIEP.goals.length === 0 ? (
            <Card className="border-2 border-dashed border-indigo-300 bg-indigo-50">
              <CardContent className="p-12 text-center space-y-4">
                <div className="text-6xl">🎯</div>
                <h3 className="text-xl font-semibold text-gray-800">
                  No goals defined yet
                </h3>
                <p className="text-gray-600">
                  Add goals to start tracking progress for this IEP.
                </p>
              </CardContent>
            </Card>
          ) : (
            selectedIEP.goals.map((goal, index) => (
              <motion.div
                key={goal.id}
                initial={
                  animationsEnabled ? { opacity: 0, y: 20 } : { opacity: 1 }
                }
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-lg font-semibold flex items-center gap-2">
                      <Target className="w-5 h-5 text-indigo-600" />
                      {goal.title}
                    </CardTitle>
                    <div className="flex gap-2 no-print">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowAddProgressForm(goal.id)}
                        aria-label={`Add progress for ${goal.title}`}
                      >
                        <LineChart className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteGoal(goal.id)}
                        className="text-red-500 hover:text-red-700"
                        aria-label={`Delete goal ${goal.title}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {goal.description && (
                      <p className="text-gray-600 text-sm">
                        {goal.description}
                      </p>
                    )}
                    <p className="text-gray-700 font-medium">
                      Target: {goal.target}
                    </p>

                    {/* Progress Bar */}
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <motion.div
                        className="bg-gradient-to-r from-green-400 to-blue-500 h-3 rounded-full"
                        initial={{ width: 0 }}
                        animate={{
                          width: `${getOverallProgressPercentage(goal)}%`,
                        }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                    <p className="text-sm text-gray-500">
                      Progress: {getOverallProgressPercentage(goal).toFixed(0)}%
                      - {getGoalProgress(goal)}
                    </p>

                    {/* Add Progress Form for this goal */}
                    {showAddProgressForm === goal.id && (
                      <motion.div
                        initial={
                          animationsEnabled
                            ? { opacity: 0, height: 0 }
                            : { opacity: 1 }
                        }
                        animate={{ opacity: 1, height: "auto" }}
                        exit={
                          animationsEnabled
                            ? { opacity: 0, height: 0 }
                            : { opacity: 1 }
                        }
                        className="space-y-3 p-4 bg-gray-50 rounded-lg border border-gray-200 no-print"
                      >
                        <h4 className="font-semibold text-gray-700">
                          Log Progress
                        </h4>
                        <Input
                          type="number"
                          placeholder="Progress Value (e.g., 75 for 75%)"
                          value={progressValue}
                          onChange={(e) => setProgressValue(e.target.value)}
                          className="text-lg py-2"
                        />
                        <Input
                          type="date"
                          value={progressDate}
                          onChange={(e) => setProgressDate(e.target.value)}
                          className="text-lg py-2"
                        />
                        <Textarea
                          placeholder="Notes (optional)"
                          value={progressNotes}
                          onChange={(e) => setProgressNotes(e.target.value)}
                          className="min-h-[60px] text-lg"
                        />
                        <div className="flex gap-2">
                          <Button
                            onClick={() => handleAddProgress(goal.id)}
                            className="flex-1 bg-blue-500 text-white"
                          >
                            Save Progress
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => setShowAddProgressForm(null)}
                          >
                            Cancel
                          </Button>
                        </div>
                      </motion.div>
                    )}

                    {/* Progress History (simplified) */}
                    {goal.progressEntries.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-gray-100 no-print">
                        <h4 className="font-semibold text-gray-700 mb-2">
                          Progress History
                        </h4>
                        <div className="space-y-2 text-sm">
                          {goal.progressEntries.map((entry) => (
                            <div
                              key={entry.id}
                              className="flex justify-between items-center text-gray-600"
                            >
                              <span>
                                {entry.date}: {entry.value}
                                {entry.notes && ` (${entry.notes})`}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <motion.div
          className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full p-3"
          whileHover={animationsEnabled ? { scale: 1.05 } : {}}
        >
          <ClipboardCheck className="w-6 h-6 text-white" />
        </motion.div>
        <h1 className="text-2xl font-bold text-gray-800">IEP Tracker</h1>
      </div>

      {/* Add IEP Form */}
      {showAddIEPForm ? (
        <Card>
          <CardHeader>
            <CardTitle>Add New IEP</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="Student Name"
              value={newIEPName}
              onChange={(e) => setNewIEPName(e.target.value)}
              className="text-lg py-3"
            />
            <Input
              placeholder="IEP Period (e.g., '2023-2024')"
              value={newIEPPeriod}
              onChange={(e) => setNewIEPPeriod(e.target.value)}
              className="text-lg py-3"
            />
            <div className="flex gap-2">
              <Button
                onClick={handleAddIEP}
                className="flex-1 bg-indigo-500 text-white"
              >
                <Plus className="w-5 h-5 mr-2" />
                Create IEP
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowAddIEPForm(false)}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Button
          onClick={() => setShowAddIEPForm(true)}
          className="w-full bg-indigo-500 text-white"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add New IEP
        </Button>
      )}

      {/* IEPs List */}
      {ieps.length === 0 ? (
        <Card className="border-2 border-dashed border-indigo-300 bg-indigo-50">
          <CardContent className="p-12 text-center space-y-6">
            <div className="text-6xl">📝</div>
            <h3 className="text-2xl font-semibold text-gray-800">
              No IEPs added yet
            </h3>
            <p className="text-gray-600 text-lg">
              Create an IEP to track goals and monitor progress for your child.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ieps.map((iep, index) => (
            <motion.div
              key={iep.id}
              initial={
                animationsEnabled ? { opacity: 0, y: 20 } : { opacity: 1 }
              }
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card
                className="cursor-pointer hover:shadow-lg transition-all duration-300 overflow-hidden"
                onClick={() => setSelectedIEP(iep)}
              >
                <CardContent className="p-0">
                  <div className="bg-gradient-to-br from-indigo-400 to-purple-500 p-6 text-white text-center">
                    <div className="text-4xl mb-3">🧑‍🎓</div>
                    <h3 className="text-xl font-bold mb-2">
                      {iep.studentName}
                    </h3>
                    <div className="text-sm opacity-90">{iep.iepPeriod}</div>
                  </div>
                  <div className="p-6 space-y-3">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Target className="w-4 h-4" />
                      <span>{iep.goals.length} Goals</span>
                    </div>
                    {iep.goals.length > 0 && (
                      <div className="space-y-1">
                        {iep.goals.slice(0, 3).map((goal) => (
                          <div
                            key={goal.id}
                            className="flex items-center gap-2 text-sm text-gray-700"
                          >
                            <SquarePen className="w-3 h-3" />
                            <span>{goal.title}</span>
                          </div>
                        ))}
                        {iep.goals.length > 3 && (
                          <p className="text-xs text-gray-500">
                            +{iep.goals.length - 3} more goals
                          </p>
                        )}
                      </div>
                    )}
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
