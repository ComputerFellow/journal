// src/components/EntriesList.jsx
import React from "react";
import EntryCard from "./EntryCard";

export default function EntriesList({ entries, onEdit }) {
  const groupedEntries = entries.reduce((acc, entry) => {
    const date = new Date(entry.date);
    const monthYear = date
      .toLocaleDateString("en-US", { month: "long", year: "numeric" })
      .toUpperCase();
    if (!acc[monthYear]) acc[monthYear] = [];
    acc[monthYear].push(entry);
    return acc;
  }, {});

  return (
    <div className="space-y-12">
      {Object.entries(groupedEntries).map(([month, monthEntries]) => (
        <div key={month}>
          <h3 className="text-sm font-semibold text-gray-400 tracking-wide mb-6 text-center">
            {month}
          </h3>
          <div className="space-y-6">
            {monthEntries.map((entry) => (
              <EntryCard key={entry.id} entry={entry} onEdit={onEdit} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}