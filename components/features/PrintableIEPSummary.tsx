"use client";

import type { IEP, IEPGoal } from "@/lib/store";
import { LineChart } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Target } from "lucide-react"; // Import the Target component

interface PrintableIEPSummaryProps {
  iep: IEP;
}

const formatDate = (dateString: string | Date) => {
  const date =
    typeof dateString === "string" ? new Date(dateString) : dateString;
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const formatTime = (date: Date) => {
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

const getOverallProgressPercentage = (goal: IEPGoal) => {
  if (goal.progressEntries.length === 0) return 0;
  const latestValue =
    goal.progressEntries[goal.progressEntries.length - 1].value;
  const targetNum = Number.parseFloat(goal.target.replace(/[^0-9.]/g, ""));
  if (isNaN(targetNum) || targetNum === 0) return 0;
  return Math.min(100, (latestValue / targetNum) * 100);
};

export function PrintableIEPSummary({ iep }: PrintableIEPSummaryProps) {
  return (
    <div className="p-8 bg-white text-gray-900 print:p-0 print:text-black print:bg-white">
      <h1 className="text-3xl font-bold mb-6 text-center print:text-2xl">
        IEP Summary for {iep.studentName}
      </h1>
      <p className="text-lg text-center mb-8 print:text-base">
        IEP Period: {iep.iepPeriod} | Created: {formatDate(iep.createdAt)}
      </p>

      <div className="space-y-8">
        {iep.goals.map((goal) => (
          <Card
            key={goal.id}
            className="mb-6 shadow-md print:shadow-none print:border print:border-gray-300"
          >
            <CardHeader className="bg-gray-50 p-4 border-b print:bg-gray-100">
              <CardTitle className="text-xl font-semibold flex items-center gap-2 print:text-lg">
                <Target className="w-5 h-5 text-indigo-600 print:text-indigo-800" />
                {goal.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4 print:p-4">
              {goal.description && (
                <p className="text-gray-700 text-base print:text-sm">
                  <span className="font-medium">Description:</span>{" "}
                  {goal.description}
                </p>
              )}
              <p className="text-gray-800 font-semibold text-base print:text-sm">
                Target: {goal.target}
              </p>

              <div className="w-full bg-gray-200 rounded-full h-3 print:h-2">
                <div
                  className="bg-gradient-to-r from-green-400 to-blue-500 h-3 rounded-full print:h-2"
                  style={{ width: `${getOverallProgressPercentage(goal)}%` }}
                />
              </div>
              <p className="text-sm text-gray-600 print:text-xs">
                Overall Progress:{" "}
                {getOverallProgressPercentage(goal).toFixed(0)}%
              </p>

              {goal.progressEntries.length > 0 && (
                <div className="mt-6 pt-4 border-t border-gray-200 print:border-gray-300">
                  <h4 className="text-lg font-semibold mb-3 flex items-center gap-2 print:text-base">
                    <LineChart className="w-4 h-4" />
                    Progress History
                  </h4>
                  <div className="space-y-2 text-sm print:text-xs">
                    {goal.progressEntries.map((entry) => (
                      <div
                        key={entry.id}
                        className="flex justify-between items-start text-gray-700"
                      >
                        <span className="font-medium">
                          {formatDate(entry.date)}:
                        </span>
                        <span className="flex-1 ml-2">
                          {entry.value} {entry.notes && `(${entry.notes})`}
                        </span>
                        <span className="text-gray-500 ml-4">
                          {formatTime(entry.timestamp)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <style jsx global>{`
        @media print {
          body > div {
            display: none; /* Hide everything except the print container */
          }
          #print-container {
            display: block !important;
            width: 100%;
            margin: 0;
            padding: 0;
          }
          .no-print {
            display: none !important;
          }
          .print\\:p-0 {
            padding: 0 !important;
          }
          .print\\:text-black {
            color: black !important;
          }
          .print\\:bg-white {
            background-color: white !important;
          }
          .print\\:text-2xl {
            font-size: 1.5rem !important;
          }
          .print\\:text-base {
            font-size: 1rem !important;
          }
          .print\\:shadow-none {
            box-shadow: none !important;
          }
          .print\\:border {
            border-width: 1px !important;
          }
          .print\\:border-gray-300 {
            border-color: #d1d5db !important;
          }
          .print\\:bg-gray-100 {
            background-color: #f3f4f6 !important;
          }
          .print\\:text-lg {
            font-size: 1.125rem !important;
          }
          .print\\:text-indigo-800 {
            color: #3730a3 !important;
          }
          .print\\:p-4 {
            padding: 1rem !important;
          }
          .print\\:text-sm {
            font-size: 0.875rem !important;
          }
          .print\\:h-2 {
            height: 0.5rem !important;
          }
          .print\\:text-xs {
            font-size: 0.75rem !important;
          }
          .print\\:text-base {
            font-size: 1rem !important;
          }
        }
      `}</style>
    </div>
  );
}
