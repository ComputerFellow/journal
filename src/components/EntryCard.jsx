// src/components/EntryCard.jsx
import React from "react";
import { Calendar, Edit2 } from "lucide-react";
import { MOODS, getMoodGradient } from "../constants/moods";

export default function EntryCard({ entry, onEdit }) {
  const moodData = MOODS.find((m) => m.value === entry.mood);
  const MoodIcon = moodData?.icon;

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl hover:scale-[1.02] transition-all duration-500 ease-out group relative !transform">
      <div className="overflow-hidden rounded-xl">
        {moodData && (
          <div
            className="h-[4px] opacity-60 mt-[2px]"
            style={{ background: getMoodGradient(moodData.darkColor) }}
          />
        )}

        <button
          onClick={() => onEdit(entry)}
          className="absolute top-4 right-4 p-2 bg-white/90 hover:bg-white rounded-md shadow-md opacity-0 group-hover:opacity-100 transition-opacity z-10"
          title="Edit entry">
          <Edit2 className="w-4 h-4 text-gray-600" />
        </button>

        <div className="p-6">
          <div className="flex items-start gap-2 text-sm text-gray-500 mb-3">
            <Calendar className="w-4 h-4 mt-0.5" />
            {new Date(entry.date).toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </div>

          <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-amber-700 transition-colors">
            {entry.title || "Untitled Entry"}
          </h3>

          <p className="text-gray-700 leading-relaxed mb-4 line-clamp-3">
            {entry.thoughts}
          </p>

          {entry.photos && entry.photos.length > 0 && (
            <div className="flex gap-2 mb-4">
              {entry.photos.slice(0, 3).map((photo, idx) => (
                <img
                  key={idx}
                  src={photo}
                  alt=""
                  className="relative flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden border-2 border-white shadow-md"
                />
              ))}
              {entry.photos.length > 3 && (
                <div className="w-20 h-20 bg-gray-100 rounded-md flex items-center justify-center text-gray-500 text-sm">
                  +{entry.photos.length - 3}
                </div>
              )}
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            {entry.mood && moodData && MoodIcon && (
              <span
                className={`px-3 py-1 h-6 ${moodData.color} ${moodData.textColor} rounded-full text-sm flex items-center gap-1 font-medium`}>
                <MoodIcon className="w-3 h-3" /> {moodData.label}
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
}