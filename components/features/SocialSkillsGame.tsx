"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Users, CheckCircle, XCircle, RotateCcw, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppStore } from "@/lib/store";

interface SocialScenario {
  id: string;
  situation: string;
  emoji: string;
  options: {
    id: string;
    text: string;
    feedback: string;
    isCorrect: boolean;
  }[];
}

const socialScenarios: SocialScenario[] = [
  {
    id: "greeting",
    situation: "Someone says 'Hello!' to you.",
    emoji: "👋",
    options: [
      {
        id: "opt1",
        text: "Say 'Hello!' back",
        feedback: "Great job! Saying hello back is friendly and polite.",
        isCorrect: true,
      },
      {
        id: "opt2",
        text: "Ignore them",
        feedback:
          "Hmm, ignoring someone might make them feel sad or ignored. It's usually best to respond.",
        isCorrect: false,
      },
      {
        id: "opt3",
        text: "Run away",
        feedback:
          "Running away might confuse or worry the other person. It's okay to feel shy, but a small wave or smile can help.",
        isCorrect: false,
      },
    ],
  },
  {
    id: "sharing",
    situation: "Your friend wants to play with your favorite toy.",
    emoji: "🧸",
    options: [
      {
        id: "opt1",
        text: "Say 'No!' and hide the toy",
        feedback:
          "Keeping your toy to yourself might make your friend feel left out. Sharing can be fun!",
        isCorrect: false,
      },
      {
        id: "opt2",
        text: "Say 'Yes!' and share the toy",
        feedback:
          "Wonderful! Sharing your toy makes your friend happy and shows you are a good friend.",
        isCorrect: true,
      },
      {
        id: "opt3",
        text: "Throw the toy",
        feedback:
          "Throwing the toy can be unsafe and might make your friend upset. It's better to use your words.",
        isCorrect: false,
      },
    ],
  },
  {
    id: "asking-to-play",
    situation: "You want to play with some kids on the playground.",
    emoji: "🤸",
    options: [
      {
        id: "opt1",
        text: "Just join in without asking",
        feedback:
          "Joining without asking might surprise or bother the other kids. It's polite to ask first.",
        isCorrect: false,
      },
      {
        id: "opt2",
        text: "Ask 'Can I play too?'",
        feedback:
          "Excellent! Asking politely is a great way to join a game and make new friends.",
        isCorrect: true,
      },
      {
        id: "opt3",
        text: "Stand far away and watch",
        feedback:
          "Standing far away might mean you don't get to play. If you want to join, try asking!",
        isCorrect: false,
      },
    ],
  },
  {
    id: "apology",
    situation: "You accidentally bump into someone.",
    emoji: "😬",
    options: [
      {
        id: "opt1",
        text: "Say 'Sorry!'",
        feedback:
          "That's very kind! Saying sorry shows you care and helps the other person feel better.",
        isCorrect: true,
      },
      {
        id: "opt2",
        text: "Walk away quickly",
        feedback:
          "Walking away without saying anything might make the other person feel confused or hurt. It's good to acknowledge what happened.",
        isCorrect: false,
      },
      {
        id: "opt3",
        text: "Blame them",
        feedback:
          "Blaming someone else isn't fair and can make them feel bad. Taking responsibility is a sign of maturity.",
        isCorrect: false,
      },
    ],
  },
];

export function SocialSkillsGame() {
  const { speak, animationsEnabled } = useAppStore();
  const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0);
  const [feedback, setFeedback] = useState<{
    message: string;
    isCorrect: boolean;
  } | null>(null);
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);

  const currentScenario = socialScenarios[currentScenarioIndex];

  const handleOptionClick = (option: SocialScenario["options"][0]) => {
    setFeedback({ message: option.feedback, isCorrect: option.isCorrect });
    speak(option.feedback);
    if (option.isCorrect) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNextScenario = () => {
    setFeedback(null);
    if (currentScenarioIndex < socialScenarios.length - 1) {
      setCurrentScenarioIndex((prev) => prev + 1);
    } else {
      // Game finished
      speak(`Game over! You scored ${score} out of ${socialScenarios.length}.`);
    }
  };

  const handleRestartGame = () => {
    setCurrentScenarioIndex(0);
    setFeedback(null);
    setScore(0);
    setGameStarted(false);
    speak("Game restarted. Let's practice social skills!");
  };

  const startGame = () => {
    setGameStarted(true);
    speak(
      "Welcome to the Social Skills Game! Choose the best way to respond in each situation."
    );
  };

  if (!gameStarted) {
    return (
      <div className="space-y-6 text-center">
        <div className="flex items-center justify-center gap-3">
          <motion.div
            className="bg-gradient-to-r from-orange-500 to-yellow-600 rounded-full p-3"
            whileHover={animationsEnabled ? { scale: 1.05 } : {}}
          >
            <Users className="w-6 h-6 text-white" />
          </motion.div>
          <h1 className="text-2xl font-bold text-gray-800">
            Social Skills Game
          </h1>
        </div>
        <Card className="border-2 border-dashed border-orange-300 bg-gradient-to-br from-yellow-50 to-orange-50">
          <CardContent className="p-12 space-y-6">
            <div className="text-6xl">🤝</div>
            <div className="space-y-3">
              <h3 className="text-2xl font-semibold text-gray-800">
                Learn to Connect!
              </h3>
              <p className="text-gray-600 text-lg">
                Practice how to respond in different social situations and make
                friends.
              </p>
            </div>
            <Button
              onClick={startGame}
              className="bg-gradient-to-r from-orange-500 to-yellow-600 text-white px-8 py-3 text-lg"
            >
              <Play className="w-6 h-6 mr-3" />
              Start Game
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isGameOver =
    currentScenarioIndex === socialScenarios.length - 1 && feedback !== null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <motion.div
            className="bg-gradient-to-r from-orange-500 to-yellow-600 rounded-full p-3"
            whileHover={animationsEnabled ? { scale: 1.05 } : {}}
          >
            <Users className="w-6 h-6 text-white" />
          </motion.div>
          <h1 className="text-2xl font-bold text-gray-800">
            Social Skills Game
          </h1>
        </div>
        <div className="text-lg font-semibold text-gray-700">
          Score: {score} / {socialScenarios.length}
        </div>
      </div>

      {/* Scenario Card */}
      <Card className="overflow-hidden">
        <CardHeader className="bg-gradient-to-br from-orange-100 to-yellow-100 p-6">
          <CardTitle className="text-center text-2xl font-bold text-gray-800 flex items-center justify-center gap-3">
            <span className="text-4xl">{currentScenario.emoji}</span>
            {currentScenario.situation}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <p className="text-lg text-gray-700 text-center">
            How would you respond?
          </p>
          <div className="grid grid-cols-1 gap-3">
            {currentScenario.options.map((option) => (
              <motion.button
                key={option.id}
                onClick={() => handleOptionClick(option)}
                disabled={feedback !== null} // Disable options after one is chosen
                className={`w-full p-4 rounded-lg border-2 text-left transition-all duration-200 ${
                  feedback
                    ? option.isCorrect
                      ? "border-green-500 bg-green-50 text-green-700"
                      : "border-red-500 bg-red-50 text-red-700"
                    : "border-gray-200 hover:border-gray-300 bg-white"
                } ${feedback && !option.isCorrect && "opacity-50"}`} // Dim incorrect options after choice
                whileHover={
                  animationsEnabled && !feedback ? { scale: 1.02 } : {}
                }
                whileTap={animationsEnabled && !feedback ? { scale: 0.98 } : {}}
                aria-label={option.text}
              >
                {option.text}
              </motion.button>
            ))}
          </div>

          {feedback && (
            <motion.div
              initial={
                animationsEnabled ? { opacity: 0, y: 20 } : { opacity: 1 }
              }
              animate={{ opacity: 1, y: 0 }}
              className={`mt-4 p-4 rounded-lg ${
                feedback.isCorrect
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              } flex items-center gap-3`}
              role="alert"
            >
              {feedback.isCorrect ? (
                <CheckCircle className="w-6 h-6 text-green-600" />
              ) : (
                <XCircle className="w-6 h-6 text-red-600" />
              )}
              <p className="font-medium">{feedback.message}</p>
            </motion.div>
          )}

          {feedback && (
            <div className="flex justify-center mt-6">
              {isGameOver ? (
                <Button
                  onClick={handleRestartGame}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 text-lg"
                >
                  <RotateCcw className="w-5 h-5 mr-2" />
                  Play Again
                </Button>
              ) : (
                <Button
                  onClick={handleNextScenario}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 text-lg"
                >
                  Next Scenario
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {isGameOver && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-4 p-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-xl text-white"
        >
          <div className="text-6xl">🎉</div>
          <h3 className="text-2xl font-bold">Game Over!</h3>
          <p className="text-lg">
            You scored {score} out of {socialScenarios.length} correct
            responses!
          </p>
          <Button
            onClick={handleRestartGame}
            className="bg-white text-green-600 hover:bg-gray-100"
          >
            Play Again
          </Button>
        </motion.div>
      )}
    </div>
  );
}
