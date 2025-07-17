"use client";

import { useState } from "react";
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
      },
      {
        id: 2,
        image: "/placeholder.svg?height=300&width=400",
        text: "I put on my backpack and say goodbye to my family.",
      },
      {
        id: 3,
        image: "/placeholder.svg?height=300&width=400",
        text: "At school, I see my teacher and friends. We say hello to each other.",
      },
      {
        id: 4,
        image: "/placeholder.svg?height=300&width=400",
        text: "We do fun activities like reading, drawing, and playing games.",
      },
      {
        id: 5,
        image: "/placeholder.svg?height=300&width=400",
        text: "When school is over, I pack my things and go home. School is fun!",
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
      },
      {
        id: 2,
        image: "/placeholder.svg?height=300&width=400",
        text: "We sit in the waiting room. I can read books or play quietly while we wait.",
      },
      {
        id: 3,
        image: "/placeholder.svg?height=300&width=400",
        text: "The doctor is kind and gentle. They might check my height and weight.",
      },
      {
        id: 4,
        image: "/placeholder.svg?height=300&width=400",
        text: "The doctor listens to my heart and looks in my ears. It doesn't hurt.",
      },
      {
        id: 5,
        image: "/placeholder.svg?height=300&width=400",
        text: "When we're done, I get a sticker! The doctor visit helps me stay healthy.",
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
      },
      {
        id: 2,
        image: "/placeholder.svg?height=300&width=400",
        text: "I can ask someone if they want to play with me. 'Would you like to play?'",
      },
      {
        id: 3,
        image: "/placeholder.svg?height=300&width=400",
        text: "Good friends share toys and take turns. Sharing makes everyone happy.",
      },
      {
        id: 4,
        image: "/placeholder.svg?height=300&width=400",
        text: "If someone is sad, I can be kind and ask if they're okay.",
      },
      {
        id: 5,
        image: "/placeholder.svg?height=300&width=400",
        text: "Being a good friend means being kind, sharing, and having fun together!",
      },
    ],
  },
];

export function SocialStoryViewer() {
  const { speak, animationsEnabled } = useAppStore();
  const [selectedStory, setSelectedStory] = useState<SocialStory | null>(null);
  const [currentPage, setCurrentPage] = useState(0);

  const handleStorySelect = (story: SocialStory) => {
    setSelectedStory(story);
    setCurrentPage(0);
    speak(`Starting story: ${story.title}`);
  };

  const handleNextPage = () => {
    if (selectedStory && currentPage < selectedStory.pages.length - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handlePageSpeak = () => {
    if (selectedStory) {
      const page = selectedStory.pages[currentPage];
      speak(page.text);
    }
  };

  const resetStory = () => {
    setSelectedStory(null);
    setCurrentPage(0);
    if ("speechSynthesis" in window) {
      speechSynthesis.cancel();
    }
  };

  if (!selectedStory) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Social Stories
          </h2>
          <p className="text-gray-600">Choose a story to read together</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {socialStories.map((story) => (
            <div
              key={story.id}
              onClick={() => handleStorySelect(story)}
              className={`bg-gradient-to-br ${
                story.color
              } p-6 rounded-lg cursor-pointer transform transition-all duration-200 hover:scale-105 ${
                animationsEnabled ? "hover:shadow-lg" : ""
              }`}
            >
              <div className="text-4xl mb-3">{story.emoji}</div>
              <h3 className="text-lg font-semibold text-white mb-2">
                {story.title}
              </h3>
              <p className="text-white/90 text-sm">{story.description}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const currentPageData = selectedStory.pages[currentPage];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <button
            onClick={resetStory}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            ← Back to Stories
          </button>
          <h2 className="text-2xl font-bold text-gray-900 mt-2">
            {selectedStory.title}
          </h2>
        </div>
        <div className="text-4xl">{selectedStory.emoji}</div>
      </div>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="aspect-video bg-gray-100 flex items-center justify-center">
          <img
            src={currentPageData.image}
            alt={`Page ${currentPage + 1}`}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-gray-500">
              Page {currentPage + 1} of {selectedStory.pages.length}
            </span>
            <button
              onClick={handlePageSpeak}
              className="p-2 text-blue-600 hover:text-blue-800 rounded-full hover:bg-blue-50"
            >
              🔊
            </button>
          </div>

          <p className="text-lg text-gray-800 leading-relaxed">
            {currentPageData.text}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <button
          onClick={handlePrevPage}
          disabled={currentPage === 0}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300"
        >
          Previous
        </button>

        <div className="flex space-x-2">
          {selectedStory.pages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentPage(index)}
              className={`w-3 h-3 rounded-full ${
                index === currentPage ? "bg-blue-600" : "bg-gray-300"
              }`}
            />
          ))}
        </div>

        <button
          onClick={handleNextPage}
          disabled={currentPage === selectedStory.pages.length - 1}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700"
        >
          Next
        </button>
      </div>
    </div>
  );
}
