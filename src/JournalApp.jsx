// src/JournalApp.jsx
import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import HomePage from "./components/HomePage";
import EntryEditor from "./components/EntryEditor";
import { STORAGE_KEY } from "./constants/moods";

export default function JournalApp() {
  const [entries, setEntries] = useState([]);
  const [currentView, setCurrentView] = useState("home");
  const [editingEntry, setEditingEntry] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadEntries();
  }, []);

  const loadEntries = () => {
    try {
      setIsLoading(true);
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const loadedEntries = JSON.parse(stored);
        setEntries(
          loadedEntries.sort((a, b) => new Date(b.date) - new Date(a.date))
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

  const handleSaveEntry = (formData) => {
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
      setEditingEntry(null);
      setCurrentView("home");
    } catch (error) {
      alert("Failed to save entry. Please try again.");
    }
  };

  const handleDeleteEntry = () => {
    if (!editingEntry) return;
    if (!confirm("Delete this entry? This cannot be undone.")) return;
    
    try {
      const updatedEntries = entries.filter((e) => e.id !== editingEntry.id);
      saveToLocalStorage(updatedEntries);
      setEntries(updatedEntries);
      setEditingEntry(null);
      setCurrentView("home");
    } catch (error) {
      console.error("Delete failed:", error);
      alert("Failed to delete entry. Please try again.");
    }
  };

  const handleNewEntry = () => {
    setEditingEntry(null);
    setCurrentView("edit");
  };

  const handleEditEntry = (entry) => {
    setEditingEntry(entry);
    setCurrentView("edit");
  };

  const handleCancel = () => {
    setEditingEntry(null);
    setCurrentView("home");
  };

  return (
    <div className="min-h-screen py-1 bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 flex flex-col">
      <Header onNewEntry={handleNewEntry} />
      
      {currentView === "edit" ? (
        <EntryEditor
          entry={editingEntry}
          onSave={handleSaveEntry}
          onCancel={handleCancel}
          onDelete={handleDeleteEntry}
        />
      ) : (
        <HomePage
          entries={entries}
          isLoading={isLoading}
          onNewEntry={handleNewEntry}
          onEditEntry={handleEditEntry}
        />
      )}
    </div>
  );
}