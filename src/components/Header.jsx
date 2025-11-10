// src/components/Header.jsx
import React from "react";
import { BookOpen, Plus } from "lucide-react";

export default function Header({ onNewEntry }) {
  return (
    <div className="bg-white/80 backdrop-blur-lg border-b border-amber-100/50 sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
        <a href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-gray-900">My Journal</h1>
            <p className="text-xs text-gray-500">Your private sanctuary</p>
          </div>
        </a>
        <button
          onClick={onNewEntry}
          className="px-4 py-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg font-medium hover:shadow-lg transition-all flex items-center gap-2">
          <Plus className="w-4 h-4 mr-2" /> New Entry
        </button>
      </div>
    </div>
  );
}