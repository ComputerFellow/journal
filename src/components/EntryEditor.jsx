// src/components/EntryEditor.jsx
import React, { useState } from "react";
import { ArrowLeft, X, Tag, Trash2, Calendar } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MOODS } from "../constants/moods";

export default function EntryEditor({ entry, onSave, onCancel, onDelete }) {
  const [formData, setFormData] = useState(
    entry || {
      title: "",
      date: new Date().toISOString().split("T")[0],
      mood: "",
      thoughts: "",
      photos: [],
      tags: [],
    }
  );
  const [newTag, setNewTag] = useState("");

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          photos: [...prev.photos, reader.result],
        }));
      };
      reader.readAsDataURL(file);
    });
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

  const handleSave = () => {
    onSave(formData);
  };

  return (
    <>
      <div className="flex-1 max-w-4xl w-full mx-auto px-4 py-6">
        <button
          onClick={onCancel}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to journal
        </button>

        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            {entry ? "Edit Entry" : "New Entry"}
          </h2>
          <p className="text-gray-500">
            {entry
              ? "Update your thoughts and memories"
              : "What's on your mind today?"}
          </p>
        </div>

        <div className="rounded-xl border text-card-foreground bg-white/80 backdrop-blur-sm border-white/50 shadow-xl">
          <div className="p-8">
            <div className="space-y-3">
              {/* Title Input */}
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
                className="w-full px-4 py-3 h-10 bg-white/80 border-[2px] border-gray-200/50 rounded-lg outline-none ring-0 focus:outline-none focus:ring-0 focus:border-transparent focus:shadow-[inset_0_0_0_1px_black,inset_0_0_0_2px_rgb(250_204_21)] transition-all"
              />

              {/* Date and Mood */}
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
                    className="w-full px-4 py-3 h-10 bg-white/80 border-[2px] border-gray-200/50 rounded-lg outline-none ring-0 focus:outline-none focus:ring-0 focus:border-transparent focus:shadow-[inset_0_0_0_1px_black,inset_0_0_0_2px_rgb(250_204_21)] transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mood{" "}
                    <span className="text-gray-400 font-normal">
                      (optional)
                    </span>
                  </label>
                  <Select
                    value={formData.mood}
                    onValueChange={(value) =>
                      setFormData({ ...formData, mood: value })
                    }
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
                </div>
              </div>

              {/* Thoughts Textarea */}
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

              {/* Photos Section */}
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
                          className="w-full h-full object-cover rounded-lg border-2 border-white shadow-md"
                        />
                        <button
                          onClick={() => removePhoto(idx)}
                          className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <label className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border-input bg-background shadow-sm hover:text-accent-foreground h-9 px-4 py-2 w-full sm:w-auto border-dashed border-2 hover:border-amber-300 hover:bg-amber-50 cursor-pointer">
                  <svg
                    className="w-5 h-5 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
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

              {/* Tags Section */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags
                </label>
                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {formData.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm flex items-center gap-1"
                      >
                        {tag}
                        <button
                          onClick={() => removeTag(tag)}
                          className="hover:text-amber-900"
                        >
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
                    className="px-4 py-2 h-10 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground flex-shrink-0"
                  >
                    <Tag className="w-4 h-4" /> Add
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 px-6 sm:px-8 py-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-t border-amber-100/50 rounded-b-xl">
            <div className="flex gap-3">
              <button
                onClick={onCancel}
                className="flex-1 sm:flex-none px-6 py-1 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200"
              >
                Cancel
              </button>
              {entry && (
                <button
                  onClick={onDelete}
                  className="flex-1 sm:flex-none justify-center px-6 py-1 bg-white text-red-600 rounded-lg hover:bg-red-50 transition-colors flex items-center gap-2 border border-gray-200"
                >
                  <Trash2 className="w-4 h-4" /> Delete
                </button>
              )}
            </div>
            <button
              onClick={handleSave}
              className="w-full sm:w-auto px-6 py-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg font-medium hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <Calendar className="w-4 h-4" /> Save Entry
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white/50 backdrop-blur-sm border-t border-amber-100/50 mt-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 text-center text-sm text-gray-500">
          Your thoughts, your memories, your story.
        </div>
      </footer>
    </>
  );
}
