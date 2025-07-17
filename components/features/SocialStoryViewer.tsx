"use client"

import { useState } from "react"
import { useAppStore } from "@/lib/store"

interface StoryPage {
  id: number
  image: string
  text: string
  audioText?: string
}

interface SocialStory {
  id: string
  title: string
  description: string
  emoji: string
  color: string
  pages: StoryPage[]
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
]

export function SocialStoryViewer() {
  const { speak, animationsEnabled } = useAppStore()
  const [selectedStory, setSelectedStory] = useState<SocialStory | null>(null)
  const [currentPage, setCurrentPage] = useState(0)

  const handleStorySelect = (story: SocialStory) => {
    setSelectedStory(story)
    setCurrentPage(0)
    speak(`Starting story: ${story.title}`)
  }

  const handleNextPage = () => {
    if (selectedStory && currentPage < selectedStory.pages.length - 1) {
      setCurrentPage(currentPage + 1)
    }
  }

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1)
    }
  }

  const handlePageSpeak = () => {
    if (selectedStory) {
      const page = selectedStory.pages[currentPage]
      speak(page.text)
    }
  }

  const resetStory = () => {
    setSelectedStory(null)
    setCurrentPage(0)
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel()
