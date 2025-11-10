// src/constants/moods.js
import { Heart, Flower2, Smile, Zap, Brain, Lightbulb, CloudRain, Frown } from "lucide-react";

export const MOODS = [
  {
    value: "happy",
    label: "Happy",
    emoji: "😊",
    icon: Smile,  // ✅ No quotes - it's the actual component
    color: "bg-yellow-200",
    textColor: "text-yellow-700",
    darkColor: "bg-yellow-300",
  },
  {
    value: "grateful",
    label: "Grateful",
    emoji: "💝",
    icon: Heart,  // ✅ No quotes
    color: "bg-pink-200",
    textColor: "text-pink-700",
    darkColor: "bg-pink-300",
  },
  {
    value: "reflective",
    label: "Reflective",
    emoji: "🧠",
    icon: Brain,  // ✅ No quotes
    color: "bg-purple-200",
    textColor: "text-purple-700",
    darkColor: "bg-purple-300",
  },
  {
    value: "sad",
    label: "Sad",
    emoji: "😢",
    icon: Frown,  // ✅ No quotes
    color: "bg-blue-200",
    textColor: "text-blue-700",
    darkColor: "bg-blue-300",
  },
  {
    value: "excited",
    label: "Excited",
    emoji: "✨",
    icon: Zap,  // ✅ No quotes
    color: "bg-orange-200",
    textColor: "text-orange-700",
    darkColor: "bg-orange-300",
  },
  {
    value: "anxious",
    label: "Anxious",
    emoji: "😰",
    icon: CloudRain,  // ✅ No quotes
    color: "bg-red-200",
    textColor: "text-red-700",
    darkColor: "bg-red-300",
  },
  {
    value: "peaceful",
    label: "Peaceful",
    emoji: "☮️",
    icon: Flower2,  // ✅ No quotes
    color: "bg-green-200",
    textColor: "text-green-700",
    darkColor: "bg-green-300",
  },
  {
    value: "creative",
    label: "Creative",
    emoji: "💡",
    icon: Lightbulb,  // ✅ No quotes
    color: "bg-teal-200",
    textColor: "text-teal-700",
    darkColor: "bg-teal-300",
  },
];

export const STORAGE_KEY = "journal_entries";

// Utility function for mood gradients
export const getMoodGradient = (darkColor) => {
  const colorMap = {
    "bg-yellow-300": { light: "#fddf475c", dark: "#fddf4780" },
    "bg-pink-300": { light: "#f9a8d45c", dark: "#f9a8d480" },
    "bg-purple-300": { light: "#d8b4fe5c", dark: "#d8b4fe80" },
    "bg-blue-300": { light: "#93c5fd5c", dark: "#93c5fd80" },
    "bg-orange-300": { light: "#fdba745c", dark: "#fdba7480" },
    "bg-red-300": { light: "#fca5a55c", dark: "#fca5a580" },
    "bg-green-300": { light: "#86efac5c", dark: "#86efac80" },
    "bg-teal-300": { light: "#5eead433", dark: "#5eead480" },
  };
  const colors = colorMap[darkColor] || colorMap["bg-teal-300"];
  return `linear-gradient(to right, ${colors.light}, ${colors.dark})`;
};