"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Volume2,
  RotateCcw,
  Play,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAppStore } from "@/lib/store";

interface StoryPage {
  id: number;
  image: string;
  text: string;
  audioText?: string;
}

interface SocialStory {
  id: string;
  title: string;
  description: string;
  emoji: string;
  color: string;
  pages: StoryPage[];
}

const socialStories: SocialStory[] = [
  {
    id: "going-to-school",
    title: "Going to School",
    description: "A story about what happens when we go to school",
    emoji: "🏫",
    color: "from-blue-400 to-blue-600",
    pages: [
      {
        id: 1,
        image: "/placeholder.svg?height=300&width=400",
        text: "Every morning, I get ready for school. I brush my teeth and eat breakfast.",
        audioText:
          "Every morning, I get ready for school. I brush my teeth and eat a healthy breakfast to start my day.",
      },
      {
        id: 2,
        image: "/placeholder.svg?height=300&width=400",
        text: "I put on my backpack and say goodbye to my family.",
        audioText:
          "I put on my backpack with all my school supplies and say goodbye to my family with a hug.",
      },
      {
        id: 3,
        image: "/placeholder.svg?height=300&width=400",
        text: "At school, I see my teacher and friends. We say hello to each other.",
        audioText:
          "When I arrive at school, I see my teacher and friends. We greet each other with friendly hellos and smiles.",
      },
      {
        id: 4,
        image: "/placeholder.svg?height=300&width=400",
        text: "We do fun activities like reading, drawing, and playing games.",
        audioText:
          "During the school day, we do many fun activities like reading interesting books, drawing colorful pictures, and playing educational games together.",
      },
      {
        id: 5,
        image: "/placeholder.svg?height=300&width=400",
        text: "When school is over, I pack my things and go home. School is fun!",
        audioText:
          "When the school day ends, I pack up all my things in my backpack and head home. School is fun and I learn new things every day!",
      },
    ],
  },
  {
    id: "visiting-doctor",
    title: "Visiting the Doctor",
    description: "What to expect when visiting the doctor",
    emoji: "👩‍⚕️",
    color: "from-green-400 to-green-600",
    pages: [
      {
        id: 1,
        image: "/placeholder.svg?height=300&width=400",
        text: "Today I'm going to visit the doctor. The doctor helps keep me healthy.",
        audioText:
          "Today I'm going to visit the doctor. The doctor is a kind person who helps keep me healthy and strong.",
      },
      {
        id: 2,
        image: "/placeholder.svg?height=300&width=400",
        text: "We sit in the waiting room. I can read books or play quietly while we wait.",
        audioText:
          "We sit in the comfortable waiting room. I can read books, look at magazines, or play quietly with toys while we wait for our turn.",
      },
      {
        id: 3,
        image: "/placeholder.svg?height=300&width=400",
        text: "The doctor is kind and gentle. They might check my height and weight.",
        audioText:
          "The doctor is very kind and gentle. They might check how tall I am and how much I weigh to make sure I'm growing well.",
      },
      {
        id: 4,
        image: "/placeholder.svg?height=300&width=400",
        text: "The doctor listens to my heart and looks in my ears. It doesn't hurt.",
        audioText:
          "The doctor uses a special tool called a stethoscope to listen to my heart beating. They also look in my ears with a small light. None of this hurts at all.",
      },
      {
        id: 5,
        image: "/placeholder.svg?height=300&width=400",
        text: "When we're done, I get a sticker! The doctor visit helps me stay healthy.",
        audioText:
          "When the visit is finished, I get to choose a fun sticker as a reward! Doctor visits help me stay healthy and strong.",
      },
    ],
  },
  {
    id: "making-friends",
    title: "Making Friends",
    description: "How to make new friends and be kind to others",
    emoji: "👫",
    color: "from-pink-400 to-pink-600",
    pages: [
      {
        id: 1,
        image: "/placeholder.svg?height=300&width=400",
        text: "Making friends is fun! I can start by saying hello and smiling.",
        audioText:
          "Making friends is really fun! I can start by saying hello with a big smile. Smiling shows others that I'm friendly and kind.",
      },
      {
        id: 2,
        image: "/placeholder.svg?height=300&width=400",
        text: "I can ask someone if they want to play with me. 'Would you like to play?'",
        audioText:
          "I can ask someone if they want to play with me by saying 'Would you like to play together?' in a friendly voice.",
      },
      {
        id: 3,
        image: "/placeholder.svg?height=300&width=400",
        text: "Good friends share toys and take turns. Sharing makes everyone happy.",
        audioText:
          "Good friends share their toys and take turns playing games. When we share, everyone gets to have fun and feel happy.",
      },
      {
        id: 4,
        image: "/placeholder.svg?height=300&width=400",
        text: "If someone is sad, I can be kind and ask if they're okay.",
        audioText:
          "If I see someone who looks sad or upset, I can be kind and gently ask 'Are you okay?' This shows that I care about their feelings.",
      },
      {
        id: 5,
        image: "/placeholder.svg?height=300&width=400",
        text: "Being a good friend means being kind, sharing, and having fun together!",
        audioText:
          "Being a good friend means being kind to others, sharing our toys and games, and having lots of fun together. Good friends care about each other!",
      },
    ],
  },
  {
    id: "bedtime-routine",
    title: "Getting Ready for Bed",
    description: "A peaceful bedtime routine story",
    emoji: "🌙",
    color: "from-purple-400 to-indigo-600",
    pages: [
      {
        id: 1,
        image: "/placeholder.svg?height=300&width=400",
        text: "When it's bedtime, I start getting ready to sleep. First, I put away my toys.",
        audioText:
          "When bedtime comes, I start my peaceful routine to get ready for sleep. First, I put away all my toys in their special places.",
      },
      {
        id: 2,
        image: "/placeholder.svg?height=300&width=400",
        text: "I take a warm bath or wash my face and hands. This helps me feel clean and relaxed.",
        audioText:
          "I take a warm, relaxing bath or wash my face and hands with soap. This helps me feel clean, fresh, and ready for sleep.",
      },
      {
        id: 3,
        image: "/placeholder.svg?height=300&width=400",
        text: "I brush my teeth to keep them healthy and clean.",
        audioText:
          "I brush my teeth carefully with my toothbrush and toothpaste to keep them healthy, clean, and sparkling.",
      },
      {
        id: 4,
        image: "/placeholder.svg?height=300&width=400",
        text: "I put on my comfortable pajamas and maybe read a bedtime story.",
        audioText:
          "I put on my soft, comfortable pajamas that keep me cozy. Sometimes I read a quiet bedtime story or someone reads to me.",
      },
      {
        id: 5,
        image: "/placeholder.svg?height=300&width=400",
        text: "I get into my cozy bed and close my eyes. Good night! Sweet dreams!",
        audioText:
          "I climb into my warm, cozy bed and pull up my soft blankets. I close my eyes and drift off to sleep. Good night and sweet dreams!",
      },
    ],
  },
];

export function SocialStoryViewer() {
  const { speak, animationsEnabled } = useAppStore();
  const [selectedStory, setSelectedStory] = useState<SocialStory | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(false);

  const handleStorySelect = (story: SocialStory) => {
    setSelectedStory(story);
    setCurrentPage(0);
    setIsAutoPlay(false);
    speak(`Starting story: ${story.title}`);
  };

  const handleNextPage = () => {
    if (selectedStory && currentPage < selectedStory.pages.length - 1) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      if (isAutoPlay) {
        const page = selectedStory.pages[nextPage];
        speak(page.audioText || page.text);
      }
    } else if (
      selectedStory &&
      currentPage === selectedStory.pages.length - 1
    ) {
      // Story finished
      speak("Story complete! Great job reading along!");
      setIsAutoPlay(false);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 0) {
      const prevPage = currentPage - 1;
      setCurrentPage(prevPage);
      if (isAutoPlay && selectedStory) {
        const page = selectedStory.pages[prevPage];
        speak(page.audioText || page.text);
      }
    }
  };

  const handlePageSpeak = () => {
    if (selectedStory) {
      const page = selectedStory.pages[currentPage];
      speak(page.audioText || page.text);
    }
  };

  const handleAutoPlay = () => {
    if (!selectedStory) return;

    setIsAutoPlay(!isAutoPlay);
    if (!isAutoPlay) {
      // Starting auto-play
      const page = selectedStory.pages[currentPage];
      speak(page.audioText || page.text);
      speak("Auto-play started. The story will read itself.");
    } else {
      // Stopping auto-play
      if ("speechSynthesis" in window) {
        speechSynthesis.cancel();
      }
      speak("Auto-play stopped.");
    }
  };

  const resetStory = () => {
    setSelectedStory(null);
    setCurrentPage(0);
    setIsAutoPlay(false);
    if ("speechSynthesis" in window) {
      speechSynthesis.cancel();
    }
  };

  const getProgressPercentage = () => {
    if (!selectedStory) return 0;
    return ((currentPage + 1) / selectedStory.pages.length) * 100;
  };

  // Auto-advance pages when auto-play is enabled
  useState(() => {
    if (!isAutoPlay || !selectedStory) return;

    const currentPageData = selectedStory.pages[currentPage];
    const textLength = (currentPageData.audioText || currentPageData.text)
      .length;
    const readingTime = Math.max(3000, textLength * 100); // Minimum 3 seconds, ~100ms per character

    const timer = setTimeout(() => {
      if (currentPage < selectedStory.pages.length - 1) {
        handleNextPage();
      } else {
        setIsAutoPlay(false);
        speak("Story finished! You did great!");
      }
    }, readingTime);

    return () => clearTimeout(timer);
  });

  if (!selectedStory) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <motion.div
            className="bg-gradient-to-r from-green-500 to-blue-600 rounded-full p-3"
            whileHover={animationsEnabled ? { scale: 1.05 } : {}}
          >
            <BookOpen className="w-6 h-6 text-white" />
          </motion.div>
          <h1 className="text-2xl font-bold text-gray-800">Social Stories</h1>
        </div>

        <div className="text-center space-y-4">
          <div className="text-6xl">📚</div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-gray-800">
              Choose a Story to Read
            </h2>
            <p className="text-gray-600 text-lg">
              Stories help us learn about different situations and what to
              expect
            </p>
          </div>
        </div>

        {/* Story Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {socialStories.map((story, index) => (
            <motion.div
              key={story.id}
              initial={
                animationsEnabled ? { opacity: 0, y: 20 } : { opacity: 1 }
              }
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card
                className="cursor-pointer hover:shadow-lg transition-all duration-300 overflow-hidden"
                onClick={() => handleStorySelect(story)}
              >
                <CardContent className="p-0">
                  <div
                    className={`bg-gradient-to-br ${story.color} p-6 text-white text-center`}
                  >
                    <div className="text-4xl mb-3">{story.emoji}</div>
                    <h3 className="text-xl font-bold mb-2">{story.title}</h3>
                    <div className="text-sm opacity-90">
                      {story.pages.length} pages
                    </div>
                  </div>
                  <div className="p-6">
                    <p className="text-gray-600 text-center">
                      {story.description}
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

  const currentPageData = selectedStory.pages[currentPage];
  const isLastPage = currentPage === selectedStory.pages.length - 1;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={resetStory}
            className="p-2 bg-transparent"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
          <h1 className="text-xl font-bold text-gray-800">
            {selectedStory.title}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={isAutoPlay ? "default" : "outline"}
            onClick={handleAutoPlay}
            className="flex items-center gap-2"
          >
            <Play className="w-4 h-4" />
            {isAutoPlay ? "Stop Auto-Play" : "Auto-Play"}
          </Button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-3">
        <motion.div
          className={`bg-gradient-to-r ${selectedStory.color} h-3 rounded-full flex items-center justify-end pr-2`}
          initial={{ width: 0 }}
          animate={{ width: `${getProgressPercentage()}%` }}
          transition={{ duration: 0.5 }}
        >
          {getProgressPercentage() > 15 && (
            <span className="text-white text-xs font-bold">
              {currentPage + 1}/{selectedStory.pages.length}
            </span>
          )}
        </motion.div>
      </div>

      {/* Story Content */}
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              initial={
                animationsEnabled ? { opacity: 0, x: 50 } : { opacity: 1 }
              }
              animate={{ opacity: 1, x: 0 }}
              exit={animationsEnabled ? { opacity: 0, x: -50 } : { opacity: 1 }}
              transition={{ duration: animationsEnabled ? 0.3 : 0 }}
              className="space-y-6"
            >
              {/* Story Image */}
              <div className="relative h-64 md:h-80 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                <img
                  src={currentPageData.image || "/placeholder.svg"}
                  alt={`Story illustration for page ${currentPage + 1}`}
                  className="max-w-full max-h-full object-contain rounded-lg"
                />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-sm font-medium text-gray-700">
                  Page {currentPage + 1}
                </div>
              </div>

              {/* Story Text */}
              <div className="p-8 space-y-6">
                <div className="text-center">
                  <p className="text-xl leading-relaxed text-gray-800 max-w-3xl mx-auto">
                    {currentPageData.text}
                  </p>
                </div>

                {/* Audio Controls */}
                <div className="flex justify-center">
                  <Button
                    onClick={handlePageSpeak}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3"
                  >
                    <Volume2 className="w-5 h-5 mr-2" />
                    Read This Page
                  </Button>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </CardContent>
      </Card>

      {/* Navigation Controls */}
      <div className="flex items-center justify-between">
        <Button
          onClick={handlePrevPage}
          disabled={currentPage === 0}
          variant="outline"
          className="flex items-center gap-2 px-6 py-3 bg-transparent"
        >
          <ChevronLeft className="w-5 h-5" />
          Previous
        </Button>

        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">
            {currentPage + 1} of {selectedStory.pages.length}
          </span>
        </div>

        <Button
          onClick={handleNextPage}
          disabled={isLastPage}
          className={`flex items-center gap-2 px-6 py-3 ${
            isLastPage
              ? "bg-green-500 hover:bg-green-600"
              : `bg-gradient-to-r ${selectedStory.color}`
          } text-white`}
        >
          {isLastPage ? "Finish Story" : "Next"}
          <ChevronRight className="w-5 h-5" />
        </Button>
      </div>

      {/* Story Completion */}
      {isLastPage && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-4 p-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-xl text-white"
        >
          <div className="text-6xl">🎉</div>
          <h3 className="text-2xl font-bold">Great Job!</h3>
          <p className="text-lg">
            You finished reading "{selectedStory.title}"!
          </p>
          <div className="flex gap-4 justify-center">
            <Button
              onClick={resetStory}
              className="bg-white text-green-600 hover:bg-gray-100"
            >
              Read Another Story
            </Button>
            <Button
              onClick={() => {
                setCurrentPage(0);
                speak(
                  `Starting ${selectedStory.title} again from the beginning.`
                );
              }}
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-green-600"
            >
              Read Again
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
