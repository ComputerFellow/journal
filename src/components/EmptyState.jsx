// src/components/EmptyState.jsx
import React from "react";
import { Calendar } from "lucide-react";

export default function EmptyState({ onNewEntry }) {
  return (
    <div className="text-center py-16">
      <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        Start Your Journey
      </h3>
      <p className="text-gray-500 mb-6">
        Your journal is empty. Create your first entry!
      </p>
      <button
        onClick={onNewEntry}
        className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg font-medium hover:shadow-lg transition-all">
        Write First Entry
      </button>
    </div>
  );
}