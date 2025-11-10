// src/components/SearchAndFilter.jsx
import React from "react";
import { Search } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MOODS } from "../constants/moods";

export default function SearchAndFilter({
  searchQuery,
  onSearchChange,
  moodFilter,
  onMoodChange,
}) {
  return (
    <div className="bg-[#faf8f5] rounded-lg shadow-lg p-4 mb-8 flex flex-col sm:flex-row items-stretch gap-4 border border-gray-200">
      <div className="flex-1 flex items-center gap-2 px-4 py-1 bg-white border-[2px] border-gray-200 rounded-md focus-within:border-transparent focus-within:shadow-[inset_0_0_0_1px_black,inset_0_0_0_2px_rgb(250_204_21)] transition-all">
        <Search className="w-5 h-5 text-gray-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search entries, tags..."
          className="flex-1 bg-transparent border-none outline-none text-gray-700 focus:outline-none focus:ring-0"
        />
      </div>
      <div className="relative sm:w-48">
        <Select value={moodFilter} onValueChange={onMoodChange}>
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
      </div>
    </div>
  );
}
