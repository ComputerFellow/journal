// src/components/HomePage.jsx
import React, { useState } from "react";
import SearchAndFilter from "./SearchAndFilter";
import EntriesList from "./EntriesList";
import EmptyState from "./EmptyState";

export default function HomePage({ entries, isLoading, onNewEntry, onEditEntry }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [moodFilter, setMoodFilter] = useState("all");

  const filteredEntries = entries.filter((entry) => {
    const matchesSearch =
      !searchQuery ||
      entry.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.thoughts?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.tags?.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      );

    const matchesMood = moodFilter === "all" || entry.mood === moodFilter;

    return matchesSearch && matchesMood;
  });

  return (
    <>
      <div className="flex-1 max-w-5xl w-full mx-auto px-4 py-6">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 rounded-full text-sm text-gray-600 mb-4">
            ✨ Welcome back to your journal
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-2">Your Story</h2>
          <p className="text-gray-500">
            {entries.length} {entries.length === 1 ? "entry" : "entries"} written
            so far
          </p>
        </div>

        <SearchAndFilter
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          moodFilter={moodFilter}
          onMoodChange={setMoodFilter}
        />

        {isLoading ? (
          <div className="text-center py-12 text-gray-500">
            Loading your journal...
          </div>
        ) : entries.length === 0 ? (
          <EmptyState onNewEntry={onNewEntry} />
        ) : filteredEntries.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            No entries match your search.
          </div>
        ) : (
          <EntriesList entries={filteredEntries} onEdit={onEditEntry} />
        )}
      </div>

      <footer className="bg-white/50 backdrop-blur-sm border-t border-amber-100/50 mt-20">
        <div className="max-w-5xl mx-auto px-4 py-6 text-center">
          <p className="text-gray-400 text-sm">
            Your thoughts, your memories, your story.
          </p>
        </div>
      </footer>
    </>
  );
}