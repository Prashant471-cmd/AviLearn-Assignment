import React, { useState } from 'react';
import { LifeListEntry } from '../types';
import { BIRDS_DATABASE } from '../data/birdsDatabase';
import { Notebook, Award, Plus, Download, Trash2, Calendar, MapPin, Search, Feather, Sparkles } from 'lucide-react';

interface FieldJournalProps {
  lifeList: LifeListEntry[];
  onAddEntry: (entry: LifeListEntry) => void;
  onRemoveEntry: (id: string) => void;
  userXp: number;
  userLevel: number;
}

export const FieldJournal: React.FC<FieldJournalProps> = ({
  lifeList,
  onAddEntry,
  onRemoveEntry,
  userXp,
  userLevel,
}) => {
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [journalSearch, setJournalSearch] = useState<string>('');

  // New Entry Form State
  const [selectedSpeciesId, setSelectedSpeciesId] = useState<string>(BIRDS_DATABASE[0].id);
  const [entryDate, setEntryDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [entryLocation, setEntryLocation] = useState<string>('Cape May Bird Observatory, NJ');
  const [entryNotes, setEntryNotes] = useState<string>('Observed in canopy feeding during early morning hours.');

  const uniqueSpeciesCount = new Set(lifeList.map((item) => item.speciesId)).size;

  const milestones = [
    { title: 'First Sightings', desc: 'Record 1 species in your life list', target: 1, current: uniqueSpeciesCount },
    { title: 'Passerine Specialist', desc: 'Record 5 species in your life list', target: 5, current: uniqueSpeciesCount },
    { title: 'Master Birder', desc: 'Record 10 species in your life list', target: 10, current: uniqueSpeciesCount },
  ];

  const handleCreateCustomEntry = (e: React.FormEvent) => {
    e.preventDefault();
    const sp = BIRDS_DATABASE.find((b) => b.id === selectedSpeciesId) || BIRDS_DATABASE[0];

    const newEntry: LifeListEntry = {
      id: `journal-${Date.now()}`,
      speciesId: sp.id,
      commonName: sp.commonName,
      scientificName: sp.scientificName,
      date: entryDate,
      location: entryLocation,
      notes: entryNotes,
      photoUrl: sp.imageUrl,
      behaviorTags: ['Visual ID', 'Field Log'],
    };

    onAddEntry(newEntry);
    setShowAddForm(false);
  };

  const handleExportCsv = () => {
    const headers = 'Common Name,Scientific Name,Date,Location,Notes\n';
    const rows = lifeList
      .map(
        (item) =>
          `"${item.commonName}","${item.scientificName}","${item.date}","${item.location}","${item.notes.replace(/"/g, '""')}"`
      )
      .join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Ornithology_LifeList_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const filteredJournal = lifeList.filter(
    (item) =>
      item.commonName.toLowerCase().includes(journalSearch.toLowerCase()) ||
      item.location.toLowerCase().includes(journalSearch.toLowerCase()) ||
      item.notes.toLowerCase().includes(journalSearch.toLowerCase())
  );

  return (
    <div className="space-y-6 font-serif">
      {/* Banner Header */}
      <div className="bg-[#F7F5F0] border border-black/10 p-6 md:p-8 shadow-sm relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2 font-sans text-[10px] uppercase tracking-[0.25em] text-[#8C867A]">
              <span className="px-2.5 py-0.5 bg-[#3D4435] text-[#FDFCFB] font-bold">
                Personal Field Log
              </span>
              <span>Life List Milestones & Logs</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-[#121212] tracking-tight">
              Life List & <span className="italic font-light text-[#3D4435]">Field Journal</span>
            </h1>
            <p className="font-sans text-xs text-[#6B665E] max-w-xl mt-1">
              Track your personal life list of bird species observed in the wild. Export records to CSV, unlock birder milestones, and document behaviors.
            </p>
          </div>

          <div className="flex items-center gap-3 font-sans text-xs uppercase tracking-wider">
            <button
              onClick={handleExportCsv}
              className="bg-[#FDFCFB] hover:bg-[#F7F5F0] text-[#121212] border border-black/20 font-semibold px-4 py-2.5 transition-colors flex items-center gap-1.5"
            >
              <Download className="w-4 h-4" />
              <span>Export CSV</span>
            </button>

            <button
              onClick={() => setShowAddForm(true)}
              className="bg-[#121212] hover:bg-[#3D4435] text-[#FDFCFB] font-bold px-4 py-2.5 transition-colors border border-black flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Add Entry</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Summary & Milestones Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Total Species Stat Box */}
        <div className="bg-[#FFFFFF] border border-black/10 p-5 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 bg-[#F7F5F0] border border-black/10 text-[#3D4435] flex items-center justify-center font-bold shrink-0">
            <Feather className="w-6 h-6" />
          </div>
          <div>
            <div className="text-3xl font-extrabold text-[#121212]">{uniqueSpeciesCount}</div>
            <div className="font-sans text-[10px] uppercase tracking-wider text-[#8C867A] font-semibold">Unique Species Logged</div>
          </div>
        </div>

        {/* Milestone Cards */}
        {milestones.map((m, idx) => {
          const isComplete = m.current >= m.target;
          return (
            <div
              key={idx}
              className={`p-4 border text-xs flex flex-col justify-between font-sans ${
                isComplete
                  ? 'bg-[#F7F5F0] border-black/30'
                  : 'bg-[#FFFFFF] border-black/10 opacity-75'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-[#121212] uppercase tracking-wider text-[11px]">{m.title}</span>
                {isComplete && <Award className="w-4 h-4 text-[#3D4435]" />}
              </div>
              <p className="text-[#6B665E] text-[11px] mb-2 font-serif">{m.desc}</p>

              <div className="w-full bg-[#E8E6E0] h-1.5 overflow-hidden">
                <div
                  className="bg-[#3D4435] h-full transition-all"
                  style={{ width: `${Math.min(100, (m.current / m.target) * 100)}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Journal Table / Feed */}
      <div className="bg-[#FFFFFF] border border-black/10 p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-black/10 pb-4">
          <h3 className="text-lg font-bold text-[#121212] flex items-center gap-2">
            <Notebook className="w-5 h-5 text-[#3D4435]" />
            <span>My Recorded Life List ({lifeList.length} Entries)</span>
          </h3>

          <div className="relative max-w-xs w-full font-sans">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#8C867A]" />
            <input
              type="text"
              placeholder="Search journal..."
              value={journalSearch}
              onChange={(e) => setJournalSearch(e.target.value)}
              className="w-full bg-[#F7F5F0] border border-black/15 pl-8 pr-3 py-1.5 text-xs text-[#121212] focus:outline-none focus:border-black"
            />
          </div>
        </div>

        {filteredJournal.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredJournal.map((entry) => (
              <div
                key={entry.id}
                className="bg-[#FDFCFB] border border-black/10 hover:border-black p-4 space-y-3 text-xs relative group shadow-xs transition-all"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    {entry.photoUrl && (
                      <img
                        src={entry.photoUrl}
                        alt={entry.commonName}
                        className="w-12 h-12 object-cover border border-black/10 shrink-0"
                      />
                    )}
                    <div>
                      <h4 className="font-bold text-[#121212] text-base">{entry.commonName}</h4>
                      <p className="text-xs text-[#8C867A] italic">{entry.scientificName}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => onRemoveEntry(entry.id)}
                    className="text-[#8C867A] hover:text-rose-700 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Delete Entry"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-1 font-sans text-[#6B665E]">
                  <div className="flex items-center gap-1.5 text-[11px]">
                    <Calendar className="w-3.5 h-3.5 text-[#3D4435]" /> {entry.date}
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px]">
                    <MapPin className="w-3.5 h-3.5 text-[#3D4435]" /> {entry.location}
                  </div>
                </div>

                <p className="text-[#121212] bg-[#F7F5F0] p-3 border border-black/10 text-xs italic">
                  "{entry.notes}"
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-[#8C867A] space-y-2 font-sans">
            <p className="text-sm font-semibold text-[#121212]">No Life List entries recorded yet.</p>
            <p className="text-xs text-[#6B665E] font-serif">
              Complete quizzes, identify species in the Field Guide, or click "Add Entry" to build your field journal!
            </p>
          </div>
        )}
      </div>

      {/* Add Entry Modal */}
      {showAddForm && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FDFCFB] border border-black/20 max-w-md w-full p-6 shadow-2xl space-y-4 animate-fadeIn font-serif">
            <h3 className="text-lg font-bold text-[#121212] flex items-center gap-2 border-b border-black/10 pb-3">
              <Plus className="w-5 h-5 text-[#3D4435]" />
              <span>Record Life List Sighting</span>
            </h3>

            <form onSubmit={handleCreateCustomEntry} className="space-y-3 font-sans text-xs">
              <div>
                <label className="block text-[#121212] font-semibold uppercase tracking-wider text-[10px] mb-1">Species</label>
                <select
                  value={selectedSpeciesId}
                  onChange={(e) => setSelectedSpeciesId(e.target.value)}
                  className="w-full bg-[#F7F5F0] border border-black/20 p-2 text-[#121212] focus:outline-none focus:border-black font-serif text-xs"
                >
                  {BIRDS_DATABASE.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.commonName} ({b.scientificName})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[#121212] font-semibold uppercase tracking-wider text-[10px] mb-1">Observation Date</label>
                <input
                  type="date"
                  value={entryDate}
                  onChange={(e) => setEntryDate(e.target.value)}
                  className="w-full bg-[#F7F5F0] border border-black/20 p-2 text-[#121212] focus:outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="block text-[#121212] font-semibold uppercase tracking-wider text-[10px] mb-1">Location</label>
                <input
                  type="text"
                  value={entryLocation}
                  onChange={(e) => setEntryLocation(e.target.value)}
                  className="w-full bg-[#F7F5F0] border border-black/20 p-2 text-[#121212] focus:outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="block text-[#121212] font-semibold uppercase tracking-wider text-[10px] mb-1">Field Notes & Behavior</label>
                <textarea
                  rows={3}
                  value={entryNotes}
                  onChange={(e) => setEntryNotes(e.target.value)}
                  className="w-full bg-[#F7F5F0] border border-black/20 p-2 text-[#121212] focus:outline-none focus:border-black font-serif text-xs resize-none"
                />
              </div>

              <div className="pt-3 flex justify-end gap-3 border-t border-black/10 uppercase tracking-wider">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 border border-black/20 text-[#6B665E] hover:text-[#121212] font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#121212] hover:bg-[#3D4435] text-[#FDFCFB] font-bold transition-colors border border-black shadow-sm"
                >
                  Save Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
