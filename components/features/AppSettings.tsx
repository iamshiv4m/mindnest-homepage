"use client"
import { motion } from "framer-motion"
import { Settings, Palette, Volume2, VolumeX, Zap, ZapOff, Type, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAppStore } from "@/lib/store"

interface AppSettingsProps {
  onClose: () => void
}

export function AppSettings({ onClose }: AppSettingsProps) {
  const {
    theme,
    soundEnabled,
    animationsEnabled,
    textSize,
    updateSettings,
    animationsEnabled: animEnabled,
  } = useAppStore()

  const themeOptions = [
    { id: "light", name: "Light", description: "Bright and colorful", emoji: "☀️" },
    { id: "dark", name: "Dark", description: "Easy on the eyes", emoji: "🌙" },
    { id: "high-contrast", name: "High Contrast", description: "Better visibility", emoji: "⚡" },
  ]

  const textSizeOptions = [
    { id: "small", name: "Small", description: "Compact text", size: "text-sm" },
    { id: "medium", name: "Medium", description: "Standard text", size: "text-base" },
    { id: "large", name: "Large", description: "Bigger text", size: "text-lg" },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <motion.div
            className="bg-gradient-to-r from-gray-500 to-gray-700 rounded-full p-3"
            whileHover={animEnabled ? { scale: 1.05 } : {}}
          >
            <Settings className="w-6 h-6 text-white" />
          </motion.div>
          <h1 className="text-2xl font-bold text-gray-800">Settings</h1>
        </div>
        <Button variant="outline" onClick={onClose} className="p-2 bg-transparent">
          <X className="w-4 h-4" />
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Theme Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="w-5 h-5" />
              Theme
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {themeOptions.map((option) => (
              <motion.button
                key={option.id}
                onClick={() => updateSettings({ theme: option.id as any })}
                className={`w-full p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                  theme === option.id
                    ? "border-blue-500 bg-blue-50 text-blue-700"
                    : "border-gray-200 hover:border-gray-300 bg-white"
                }`}
                whileHover={animEnabled ? { scale: 1.02 } : {}}
                whileTap={animEnabled ? { scale: 0.98 } : {}}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{option.emoji}</span>
                  <div>
                    <div className="font-medium">{option.name}</div>
                    <div className="text-sm text-gray-600">{option.description}</div>
                  </div>
                </div>
              </motion.button>
            ))}
          </CardContent>
        </Card>

        {/* Audio Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
              Sound
            </CardTitle>
          </CardHeader>
          <CardContent>
            <motion.button
              onClick={() => updateSettings({ soundEnabled: !soundEnabled })}
              className={`w-full p-4 rounded-lg border-2 transition-all duration-200 ${
                soundEnabled
                  ? "border-green-500 bg-green-50 text-green-700"
                  : "border-gray-200 bg-gray-50 text-gray-700"
              }`}
              whileHover={animEnabled ? { scale: 1.02 } : {}}
              whileTap={animEnabled ? { scale: 0.98 } : {}}
            >
              <div className="flex items-center justify-between">
                <div className="text-left">
                  <div className="font-medium">{soundEnabled ? "Sound On" : "Sound Off"}</div>
                  <div className="text-sm opacity-75">
                    {soundEnabled ? "Voice and sound effects enabled" : "All sounds muted"}
                  </div>
                </div>
                <div className="text-2xl">{soundEnabled ? "🔊" : "🔇"}</div>
              </div>
            </motion.button>
          </CardContent>
        </Card>

        {/* Animation Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {animationsEnabled ? <Zap className="w-5 h-5" /> : <ZapOff className="w-5 h-5" />}
              Animations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <motion.button
              onClick={() => updateSettings({ animationsEnabled: !animationsEnabled })}
              className={`w-full p-4 rounded-lg border-2 transition-all duration-200 ${
                animationsEnabled
                  ? "border-purple-500 bg-purple-50 text-purple-700"
                  : "border-gray-200 bg-gray-50 text-gray-700"
              }`}
              whileHover={animEnabled ? { scale: 1.02 } : {}}
              whileTap={animEnabled ? { scale: 0.98 } : {}}
            >
              <div className="flex items-center justify-between">
                <div className="text-left">
                  <div className="font-medium">{animationsEnabled ? "Animations On" : "Animations Off"}</div>
                  <div className="text-sm opacity-75">
                    {animationsEnabled ? "Smooth transitions and effects" : "Reduced motion for focus"}
                  </div>
                </div>
                <div className="text-2xl">{animationsEnabled ? "✨" : "⏸️"}</div>
              </div>
            </motion.button>
          </CardContent>
        </Card>

        {/* Text Size Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Type className="w-5 h-5" />
              Text Size
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {textSizeOptions.map((option) => (
              <motion.button
                key={option.id}
                onClick={() => updateSettings({ textSize: option.id as any })}
                className={`w-full p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                  textSize === option.id
                    ? "border-blue-500 bg-blue-50 text-blue-700"
                    : "border-gray-200 hover:border-gray-300 bg-white"
                }`}
                whileHover={animEnabled ? { scale: 1.02 } : {}}
                whileTap={animEnabled ? { scale: 0.98 } : {}}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{option.name}</div>
                    <div className="text-sm text-gray-600">{option.description}</div>
                  </div>
                  <div className={`${option.size} font-medium`}>Aa</div>
                </div>
              </motion.button>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Reset Settings */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-800">Reset All Settings</h3>
              <p className="text-sm text-gray-600">Return to default settings</p>
            </div>
            <Button
              variant="outline"
              onClick={() => {
                updateSettings({
                  theme: "light",
                  soundEnabled: true,
                  animationsEnabled: true,
                  textSize: "medium",
                })
              }}
              className="text-red-600 border-red-200 hover:bg-red-50"
            >
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
