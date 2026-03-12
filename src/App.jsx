import React, { useState, useEffect } from "react";
import {
  Calendar,
  CalendarCheck,
  BookOpen,
  Search,
  Plus,
  ArrowLeft,
  X,
  Tag,
  Trash2,
  Edit2,
  Heart,
  Flower2,
  Smile,
  Zap,
  Brain,
  Lightbulb,
  CloudRain,
  Frown,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const MOODS = [
  {
    value: "happy",
    label: "Happy",
    emoji: "😊",
    icon: Smile,
    color: "bg-yellow-200",
    textColor: "text-yellow-700",
    darkColor: "bg-yellow-300",
  },
  {
    value: "grateful",
    label: "Grateful",
    emoji: "💝",
    icon: Heart,
    color: "bg-pink-200",
    textColor: "text-pink-700",
    darkColor: "bg-pink-300",
  },
  {
    value: "reflective",
    label: "Reflective",
    emoji: "🧠",
    icon: Brain,
    color: "bg-purple-200",
    textColor: "text-purple-700",
    darkColor: "bg-purple-300",
  },
  {
    value: "sad",
    label: "Sad",
    emoji: "😢",
    icon: Frown,
    color: "bg-blue-200",
    textColor: "text-blue-700",
    darkColor: "bg-blue-300",
  },
  {
    value: "excited",
    label: "Excited",
    emoji: "✨",
    icon: Zap,
    color: "bg-orange-200",
    textColor: "text-orange-700",
    darkColor: "bg-orange-300",
  },
  {
    value: "anxious",
    label: "Anxious",
    emoji: "😰",
    icon: CloudRain,
    color: "bg-red-200",
    textColor: "text-red-700",
    darkColor: "bg-red-300",
  },
  {
    value: "peaceful",
    label: "Peaceful",
    emoji: "☮️",
    icon: Flower2,
    color: "bg-green-200",
    textColor: "text-green-700",
    darkColor: "bg-green-300",
  },
  {
    value: "creative",
    label: "Creative",
    emoji: "💡",
    icon: Lightbulb,
    color: "bg-teal-200",
    textColor: "text-teal-700",
    darkColor: "bg-teal-300",
  },
];

const STORAGE_KEY = "journal_entries";

export default function JournalApp() {
  const [entries, setEntries] = useState([]);
  const [currentView, setCurrentView] = useState("home");
  const [editingEntry, setEditingEntry] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [moodFilter, setMoodFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [previewPhoto, setPreviewPhoto] = useState(null);
  const [showWelcome, setShowWelcome] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    date: new Date().toISOString().split("T")[0],
    mood: "",
    thoughts: "",
    photos: [],
    tags: [],
  });
  const [newTag, setNewTag] = useState("");

  const dismissWelcome = () => {
    localStorage.setItem("has_visited", "true");
    setShowWelcome(false);
  };

  useEffect(() => {
    loadEntries();
    const hasVisited = localStorage.getItem("has_visited");
    if (!hasVisited) {
      setShowWelcome(true);
    }
  }, []);

  const loadEntries = () => {
    try {
      setIsLoading(true);
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const loadedEntries = JSON.parse(stored);
        setEntries(
          loadedEntries.sort((a, b) => new Date(b.date) - new Date(a.date)),
        );
      }
    } catch (error) {
      console.error("Failed to load entries:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveToLocalStorage = (updatedEntries) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedEntries));
    } catch (error) {
      console.error("Failed to save to localStorage:", error);
      throw error;
    }
  };

  const saveEntry = () => {
    const entry = {
      ...formData,
      id: editingEntry?.id || `entry_${Date.now()}`,
      createdAt: editingEntry?.createdAt || new Date().toISOString(),
    };

    try {
      let updatedEntries;
      if (editingEntry) {
        updatedEntries = entries.map((e) => (e.id === entry.id ? entry : e));
      } else {
        updatedEntries = [entry, ...entries];
      }

      updatedEntries.sort((a, b) => new Date(b.date) - new Date(a.date));

      saveToLocalStorage(updatedEntries);
      setEntries(updatedEntries);
      resetForm();
      setCurrentView("home");
    } catch (error) {
      alert("Failed to save entry. Please try again.");
    }
  };

  const deleteEntry = (id) => {
    if (!confirm("Delete this entry? This cannot be undone.")) return;
    try {
      const updatedEntries = entries.filter((e) => e.id !== id);
      saveToLocalStorage(updatedEntries);
      setEntries(updatedEntries);
      setCurrentView("home");
    } catch (error) {
      console.error("Delete failed:", error);
      alert("Failed to delete entry. Please try again.");
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      date: new Date().toISOString().split("T")[0],
      mood: "",
      thoughts: "",
      photos: [],
      tags: [],
    });
    setEditingEntry(null);
    setNewTag("");
  };

  const startNewEntry = () => {
    resetForm();
    setCurrentView("edit");
  };

  const startEditEntry = (entry) => {
    setEditingEntry(entry);
    setFormData(entry);
    setCurrentView("edit");
  };

  const compressImage = (file, maxWidth = 1200, quality = 0.75) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const scale = Math.min(1, maxWidth / img.width);
          canvas.width = img.width * scale;
          canvas.height = img.height * scale;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          resolve(canvas.toDataURL("image/jpeg", quality));
        };
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
    });
  };

  const handlePhotoUpload = async (e) => {
    const files = Array.from(e.target.files);
    for (const file of files) {
      const compressed = await compressImage(file);
      setFormData((prev) => ({
        ...prev,
        photos: [...prev.photos, compressed],
      }));
    }
  };

  const removePhoto = (index) => {
    setFormData((prev) => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index),
    }));
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim().toLowerCase())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag.trim().toLowerCase()],
      }));
      setNewTag("");
    }
  };

  const removeTag = (tag) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }));
  };

  const filteredEntries = entries.filter((entry) => {
    const matchesSearch =
      !searchQuery ||
      entry.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.thoughts?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.tags?.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase()),
      );

    const matchesMood = moodFilter === "all" || entry.mood === moodFilter;

    return matchesSearch && matchesMood;
  });

  const groupedEntries = filteredEntries.reduce((acc, entry) => {
    const date = new Date(entry.date);
    const monthYear = date
      .toLocaleDateString("en-US", { month: "long", year: "numeric" })
      .toUpperCase();
    if (!acc[monthYear]) acc[monthYear] = [];
    acc[monthYear].push(entry);
    return acc;
  }, {});

  if (currentView === "edit") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 flex flex-col">
        <div className="bg-white/80 backdrop-blur-lg border-b border-amber-100/50 sticky top-0 z-50">
          <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
            <a href="/" className="flex items-center gap-3 group">
              {" "}
              {/*this should be link*/}
              <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  My Journal
                </h1>
                <p className="text-xs text-gray-500">Your private sanctuary</p>
              </div>
            </a>
            <button
              onClick={startNewEntry}
              className="px-4 py-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg font-medium hover:shadow-lg transition-all flex items-center gap-2">
              <Plus className="w-4 mr-2" /> New Entry
            </button>
          </div>
        </div>

        <div className="flex-1 max-w-4xl w-full mx-auto px-4 py-6">
          <button
            onClick={() => {
              setCurrentView("home");
              resetForm();
            }}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to journal
          </button>

          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {editingEntry ? "Edit Entry" : "New Entry"}
            </h2>
            <p className="text-gray-500">
              {editingEntry
                ? "Update your thoughts and memories"
                : "What's on your mind today?"}
            </p>
          </div>
          <div className="rounded-xl border text-card-foreground bg-white/80 backdrop-blur-sm border-white/50 shadow-xl">
            <div className="p-8">
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">
                  Title{" "}
                  <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="Give your entry a title..."
                  className="w-full px-4 py-1 bg-white/80 border-[2px] border-gray-200/50 rounded-lg outline-none ring-0 focus:outline-none focus:ring-0 focus:border-transparent focus:shadow-[inset_0_0_0_1px_black,inset_0_0_0_2px_rgb(250_204_21)] transition-all"
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date
                    </label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) =>
                        setFormData({ ...formData, date: e.target.value })
                      }
                      className="w-full px-4 py-1 bg-white/80 border-[2px] border-gray-200/50 rounded-lg outline-none ring-0 focus:outline-none focus:ring-0 focus:border-transparent focus:shadow-[inset_0_0_0_1px_black,inset_0_0_0_2px_rgb(250_204_21)] transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mood{" "}
                      <span className="text-gray-400 font-normal">
                        (optional)
                      </span>
                    </label>
                    <div className="relative">
                      <Select
                        value={formData.mood} // ✅ Use formData.mood
                        onValueChange={(value) =>
                          setFormData({ ...formData, mood: value })
                        } // ✅ Update formData.mood
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="How are you feeling?" />
                        </SelectTrigger>
                        <SelectContent>
                          {MOODS.map((m) => (
                            <SelectItem key={m.value} value={m.value}>
                              {m.emoji} {m.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      {/* <svg
                        className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg> */}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your thoughts
                  </label>
                  <textarea
                    value={formData.thoughts}
                    onChange={(e) =>
                      setFormData({ ...formData, thoughts: e.target.value })
                    }
                    placeholder="What's on your mind? Write freely..."
                    rows={10}
                    className="w-full px-4 py-3 bg-white/80 border-[2px] border-gray-200/50 rounded-lg focus:outline-none focus:ring-0 focus:border-transparent focus:shadow-[inset_0_0_0_1px_black,inset_0_0_0_2px_rgb(250_204_21)] transition-all resize-y"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Photos
                  </label>
                  {formData.photos.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
                      {formData.photos.map((photo, idx) => (
                        <div key={idx} className="relative group aspect-square">
                          <img
                            src={photo}
                            alt=""
                            className="relative group aspect-square rounded-lg overflow-hidden border-2 border-white shadow-md"
                          />
                          <button
                            onClick={() => removePhoto(idx)}
                            className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  <label className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border-input bg-background shadow-sm hover:text-accent-foreground px-4 py-1 w-full sm:w-auto border-dashed border-2 hover:border-amber-300 hover:bg-amber-50">
                    <svg
                      className="w-5 h-5 text-gray-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24">
                      <rect
                        x="3"
                        y="3"
                        width="18"
                        height="18"
                        rx="2"
                        ry="2"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <circle
                        cx="8.5"
                        cy="8.5"
                        r="1.5"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <polyline
                        points="21 15 16 10 5 21"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span className="text-gray-700">Add Photos</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tags
                  </label>
                  {formData.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {formData.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm flex items-center gap-1">
                          {tag}
                          <button
                            onClick={() => removeTag(tag)}
                            className="hover:text-amber-900">
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyPress={(e) =>
                        e.key === "Enter" && (e.preventDefault(), addTag())
                      }
                      placeholder="Add a tag..."
                      className="min-w-0 flex-1 px-4 py-1 bg-white/80 border-[2px] border-gray-200/50 rounded-lg focus:outline-none focus:ring-0 focus:border-transparent focus:shadow-[inset_0_0_0_1px_black,inset_0_0_0_2px_rgb(250_204_21)] transition-all"
                    />
                    <button
                      onClick={addTag}
                      className="px-3 py-1 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground">
                      <Tag className="w-4 h-4" />
                      <span className="sr-only sm:not-sr-only">Add</span>
                    </button>
                  </div>
                </div>

                {/* <div className="bg-gradient-to-r from-amber-50 to-orange-50 px-6 sm:px-8 py-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-t border-amber-100/50"> */}
              </div>
            </div>

            <div className="bg-gradient-to-r from-amber-50 to-orange-50 px-6 sm:px-8 py-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-t border-amber-100/50 rounded-b-xl">
              {" "}
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setCurrentView("home");
                    resetForm();
                  }}
                  className="flex-1 sm:flex-none px-6 py-1 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200">
                  Cancel
                </button>
                {editingEntry && (
                  <button
                    onClick={() => deleteEntry(editingEntry.id)}
                    className="flex-1 sm:flex-none px-6 py-1 bg-white text-red-600 rounded-lg hover:bg-red-50 transition-colors inline-flex justify-center items-center gap-2 border border-gray-200">
                    <Trash2 className="w-4 h-4" /> Delete
                  </button>
                )}
              </div>
              <button
                onClick={saveEntry}
                className="w-full sm:w-auto px-6 py-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg font-medium hover:shadow-lg transition-all flex items-center justify-center gap-2">
                <CalendarCheck className="w-4 h-4" /> Save Entry
              </button>
            </div>
          </div>
        </div>

        <footer className="bg-white/50 backdrop-blur-sm border-t border-amber-100/50 mt-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 text-center text-sm text-gray-500">
            Your thoughts, your memories, your story.
          </div>
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 flex flex-col">
      <div className="bg-white/80 backdrop-blur-lg border-b border-amber-100/50 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <a href="/" className="flex items-center gap-3 group">
            {" "}
            {/*this should be link*/}
            <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                My Journal
              </h1>
              <p className="text-xs text-gray-500">Your private sanctuary</p>
            </div>
          </a>
          <button
            onClick={startNewEntry}
            className="px-4 py-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg font-medium hover:shadow-lg transition-all flex items-center gap-2">
            <Plus className="w-4 mr-2" /> New Entry
          </button>
        </div>
      </div>

      <div className="flex-1 max-w-5xl w-full mx-auto px-4 py-6">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 rounded-full text-sm text-gray-600 mb-4">
            ✨ Welcome back to your journal
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-2">Your Story</h2>
          <p className="text-gray-500">
            {entries.length} {entries.length === 1 ? "entry" : "entries"}{" "}
            written so far
          </p>
        </div>

        <div className="bg-[#faf8f5] rounded-lg shadow-lg p-4 mb-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-4 border border-gray-200 ">
          <div className="flex-1 flex items-center gap-2 px-4 py-1  bg-white border-[2px] border-gray-200 rounded-md focus-within:border-transparent focus-within:shadow-[inset_0_0_0_1px_black,inset_0_0_0_2px_rgb(250_204_21)] transition-all">
            <Search className="w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search entries, tags..."
              className="flex-1 bg-transparent border-none outline-none text-gray-700 focus:outline-none focus:ring-0"
            />
          </div>
          <div className="relative sm:w-48">
            <Select
              value={moodFilter} // ✅ Use moodFilter
              onValueChange={setMoodFilter} // ✅ Update moodFilter directly
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="All Moods" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Moods</SelectItem>
                {MOODS.map((m) => (
                  <SelectItem key={m.value} value={m.value}>
                    {/* {m.emoji} {m.label} */}
                    {m.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* <svg
              className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24  ">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg> */}
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-12 text-gray-500">
            Loading your journal...
          </div>
        ) : entries.length === 0 ? (
          <div className="text-center py-16">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Start Your Journey
            </h3>
            <p className="text-gray-500 mb-6">
              Your journal is empty. Create your first entry!
            </p>
            <button
              onClick={startNewEntry}
              className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg font-medium hover:shadow-lg transition-all">
              Write First Entry
            </button>
          </div>
        ) : filteredEntries.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            No entries match your search.
          </div>
        ) : (
          <div className="space-y-12">
            {Object.entries(groupedEntries).map(([month, monthEntries]) => (
              <div key={month}>
                <h3 className="text-sm font-semibold text-gray-400 tracking-wide mb-6 text-center">
                  {month}
                </h3>
                <div className="space-y-6">
                  {monthEntries.map((entry) => {
                    const moodData = MOODS.find((m) => m.value === entry.mood);
                    const MoodIcon = moodData?.icon;
                    return (
                      <div
                        key={entry.id}
                        className="bg-white rounded-xl shadow-md hover:shadow-xl hover:scale-[1.02] transition-all duration-500 ease-out group relative !transform">
                        <div className="overflow-hidden rounded-xl">
                          {moodData && (
                            <div
                              className="h-[4px] opacity-60 mt-[2px]"
                              style={{
                                background: `linear-gradient(to right, 
                                ${
                                  moodData.darkColor === "bg-yellow-300"
                                    ? "#fddf475c"
                                    : moodData.darkColor === "bg-pink-300"
                                      ? "#f9a8d45c"
                                      : moodData.darkColor === "bg-purple-300"
                                        ? "#d8b4fe5c"
                                        : moodData.darkColor === "bg-blue-300"
                                          ? "#93c5fd5c"
                                          : moodData.darkColor ===
                                              "bg-orange-300"
                                            ? "#fdba745c"
                                            : moodData.darkColor ===
                                                "bg-red-300"
                                              ? "#fca5a55c"
                                              : moodData.darkColor ===
                                                  "bg-green-300"
                                                ? "#86efac5c"
                                                : "#5eead433"
                                }, 
                                ${
                                  moodData.darkColor === "bg-yellow-300"
                                    ? "#fddf4780"
                                    : moodData.darkColor === "bg-pink-300"
                                      ? "#f9a8d480"
                                      : moodData.darkColor === "bg-purple-300"
                                        ? "#d8b4fe80"
                                        : moodData.darkColor === "bg-blue-300"
                                          ? "#93c5fd80"
                                          : moodData.darkColor ===
                                              "bg-orange-300"
                                            ? "#fdba7480"
                                            : moodData.darkColor ===
                                                "bg-red-300"
                                              ? "#fca5a580"
                                              : moodData.darkColor ===
                                                  "bg-green-300"
                                                ? "#86efac80"
                                                : "#5eead480"
                                })`,
                              }}></div>
                          )}

                          <button
                            onClick={() => startEditEntry(entry)}
                            className="absolute top-4 right-4 p-2 bg-white/90 hover:bg-white rounded-md shadow-md opacity-0 group-hover:opacity-100 transition-opacity z-10"
                            title="Edit entry">
                            <Edit2 className="w-4 h-4 text-gray-600" />
                          </button>
                          <div className="p-6">
                            <div className="flex items-start gap-2 text-sm text-gray-500 mb-3">
                              <Calendar className="w-4 h-4 mt-0.5" />
                              {new Date(entry.date).toLocaleDateString(
                                "en-US",
                                {
                                  weekday: "long",
                                  month: "long",
                                  day: "numeric",
                                  year: "numeric",
                                },
                              )}
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-amber-700 transition-colors">
                              {entry.title || "Untitled Entry"}
                            </h3>
                            <p className="text-gray-700 leading-relaxed mb-4 line-clamp-3">
                              {entry.thoughts}
                            </p>
                            {entry.photos && entry.photos.length > 0 && (
                              <div className="mb-4 mx-[-1.5rem] px-6">
                                <div
                                  className="flex gap-2 overflow-x-auto scroll-smooth
        [scrollbar-width:none] [&::-webkit-scrollbar]:hidden
        snap-x snap-mandatory touch-pan-x"
                                  onClick={(e) => e.stopPropagation()}>
                                  {entry.photos.map((photo, idx) => (
                                    <img
                                      key={idx}
                                      src={photo}
                                      alt=""
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setPreviewPhoto(photo);
                                      }}
                                      className="flex-shrink-0 w-24 h-24 rounded-lg border-2 border-white shadow-md object-cover cursor-zoom-in snap-start"
                                    />
                                  ))}
                                </div>
                              </div>
                            )}
                            <div className="flex flex-wrap gap-2">
                              {entry.mood && moodData && MoodIcon && (
                                <span
                                  className={`px-3 py-1 h-6 ${moodData.color} ${moodData.textColor} rounded-full text-sm flex items-center gap-1 font-medium lowercase`}>
                                  <MoodIcon className="w-3 h-3" />{" "}
                                  {moodData.label}
                                </span>
                              )}
                              {entry.tags?.map((tag) => (
                                <span
                                  key={tag}
                                  className="px-3 py-1 h-6 bg-gray-100 text-gray-700 rounded-full text-sm flex items-center">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {previewPhoto && (
        <div
          onClick={() => setPreviewPhoto(null)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 cursor-zoom-out">
          <img
            src={previewPhoto}
            alt=""
            className="max-w-full max-h-full rounded-xl shadow-2xl object-contain"
          />
          <button
            onClick={() => setPreviewPhoto(null)}
            className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors">
            <X className="w-5 h-5 text-white" />
          </button>
        </div>
      )}
      {showWelcome && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center">
            <div className="w-14 h-14 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg mx-auto mb-5">
              <BookOpen className="w-7 h-7 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Welcome to My Journal
            </h2>
            <p className="text-gray-500 leading-relaxed mb-8">
              Your personal journalling app. If this is your first time, please
              feel free to save personal information at your discretion — your
              data is stored only in the browser on this device and never sent
              anywhere.
            </p>
            <button
              onClick={dismissWelcome}
              className="w-full px-6 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg font-medium hover:shadow-lg transition-all">
              Start Writing
            </button>
          </div>
        </div>
      )}
      <footer className="bg-white/50 backdrop-blur-sm border-t border-amber-100/50 mt-20">
        <div className="max-w-5xl mx-auto px-4 py-6 text-center">
          <p className="text-gray-400 text-sm">
            Your thoughts, your memories, your story.
          </p>
        </div>
      </footer>
    </div>
  );
}
