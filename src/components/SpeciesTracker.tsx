import React, { useState, useEffect } from 'react';
import { SightingObservation } from '../types';
import { INITIAL_OBSERVATIONS, generateRandomSighting } from '../data/liveObservations';
import { BIRDS_DATABASE } from '../data/birdsDatabase';
import { MapPin, Radio, Plus, Filter, CheckCircle, ShieldAlert, Sparkles, Clock, Globe, X, Eye } from 'lucide-react';

interface SpeciesTrackerProps {
  onEarnXp: (amount: number) => void;
  onAddLifeList: (speciesId: string, location: string, notes: string) => void;
}

export const SpeciesTracker: React.FC<SpeciesTrackerProps> = ({ onEarnXp, onAddLifeList }) => {
  const [observations, setObservations] = useState<SightingObservation[]>(INITIAL_OBSERVATIONS);
  const [activeFlyway, setActiveFlyway] = useState<string>('All');
  const [selectedObservation, setSelectedObservation] = useState<SightingObservation | null>(null);
  const [isAutoTelemetryActive, setIsAutoTelemetryActive] = useState<boolean>(true);
  const [showLogModal, setShowLogModal] = useState<boolean>(false);

  // New Sighting Form State
  const [newSpeciesId, setNewSpeciesId] = useState<string>(BIRDS_DATABASE[0].id);
  const [newLocation, setNewLocation] = useState<string>('High Island Bird Sanctuary, TX');
  const [newCount, setNewCount] = useState<number>(1);
  const [newHabitat, setNewHabitat] = useState<string>('Coastal Scrub & Marsh');
  const [newNotes, setNewNotes] = useState<string>('Observed active feeding in morning sunlight.');

  // Auto Telemetry Stream simulator
  useEffect(() => {
    if (!isAutoTelemetryActive) return;

    const interval = setInterval(() => {
      const newSighting = generateRandomSighting();
      setObservations((prev) => [newSighting, ...prev.slice(0, 24)]);
    }, 6000);

    return () => clearInterval(interval);
  }, [isAutoTelemetryActive]);

  const filteredObservations = observations.filter((obs) => {
    if (activeFlyway === 'All') return true;
    return obs.flyway === activeFlyway;
  });

  const handleAddSighting = (e: React.FormEvent) => {
    e.preventDefault();
    const sp = BIRDS_DATABASE.find((b) => b.id === newSpeciesId) || BIRDS_DATABASE[0];

    const customObs: SightingObservation = {
      id: `user-obs-${Date.now()}`,
      speciesId: sp.id,
      commonName: sp.commonName,
      scientificName: sp.scientificName,
      observerName: 'You (Field Tracker)',
      locationName: newLocation,
      latitude: 38.0 + (Math.random() - 0.5) * 10,
      longitude: -95.0 + (Math.random() - 0.5) * 20,
      timestamp: new Date().toISOString(),
      count: newCount,
      habitat: newHabitat,
      weather: 'Logged Field Telemetry',
      notes: newNotes,
      rarity: sp.rarityLevel,
      verified: true,
      flyway: sp.flyway || 'Atlantic Flyway',
      imageUrl: sp.imageUrl,
    };

    setObservations((prev) => [customObs, ...prev]);
    onAddLifeList(sp.id, newLocation, newNotes);
    onEarnXp(35);
    setShowLogModal(false);
  };

  return (
    <div className="space-y-6 font-serif">
      {/* Tracker Banner Header */}
      <div className="bg-[#F7F5F0] border border-black/10 p-6 md:p-8 shadow-sm relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2 font-sans text-[10px] uppercase tracking-[0.25em] text-[#8C867A]">
              <span className="flex items-center gap-1 px-2.5 py-0.5 bg-rose-900 text-rose-100 font-bold border border-rose-800">
                <Radio className="w-3 h-3 animate-pulse text-rose-300" /> Live Telemetry Radar
              </span>
              <span>Global Flyway Tracking</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-[#121212] tracking-tight">
              Real-Time Avian <span className="italic font-light text-[#3D4435]">Species Radar</span>
            </h1>
            <p className="font-sans text-xs text-[#6B665E] max-w-xl mt-1">
              Monitor migratory bird arrivals, rare species irruptions, and active flyway hot-spots submitted in real-time by field ornithologists worldwide.
            </p>
          </div>

          <div className="flex items-center gap-3 font-sans text-xs uppercase tracking-wider">
            <button
              onClick={() => setIsAutoTelemetryActive(!isAutoTelemetryActive)}
              className={`px-3.5 py-2 font-semibold border transition-all flex items-center gap-1.5 ${
                isAutoTelemetryActive
                  ? 'bg-rose-50 text-rose-900 border-rose-300'
                  : 'bg-[#FDFCFB] text-[#8C867A] border-black/15'
              }`}
            >
              <Radio className={`w-3.5 h-3.5 ${isAutoTelemetryActive ? 'animate-pulse text-rose-600' : ''}`} />
              <span>{isAutoTelemetryActive ? 'Telemetry: On' : 'Telemetry: Paused'}</span>
            </button>

            <button
              onClick={() => setShowLogModal(true)}
              className="bg-[#121212] hover:bg-[#3D4435] text-[#FDFCFB] font-bold px-4 py-2 transition-colors border border-black flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Log Observation</span>
            </button>
          </div>
        </div>
      </div>

      {/* Flyway Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none font-sans text-xs uppercase tracking-wider">
        <span className="font-bold text-[#8C867A] flex items-center gap-1 mr-2 shrink-0 text-[10px]">
          <Filter className="w-3.5 h-3.5" /> Corridor:
        </span>
        {['All', 'Atlantic Flyway', 'Mississippi Flyway', 'Pacific Flyway', 'Central Flyway'].map((fw) => (
          <button
            key={fw}
            onClick={() => setActiveFlyway(fw)}
            className={`px-3.5 py-1.5 font-semibold whitespace-nowrap transition-all border ${
              activeFlyway === fw
                ? 'bg-[#121212] text-[#FDFCFB] border-black shadow-sm'
                : 'bg-[#FDFCFB] text-[#121212] border-black/10 hover:border-black'
            }`}
          >
            {fw}
          </button>
        ))}
      </div>

      {/* Main Grid: Interactive Map Visualizer & Live Telemetry Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Interactive Flyway Map Component (Cols 2) */}
        <div className="lg:col-span-2 bg-[#FFFFFF] border border-black/10 p-6 shadow-sm flex flex-col justify-between relative overflow-hidden min-h-[420px]">
          <div className="flex items-center justify-between mb-4 z-10 font-sans text-xs uppercase tracking-widest">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-[#3D4435]" />
              <h3 className="font-bold text-[#121212]">North American Flyway Corridor Map</h3>
            </div>
            <div className="text-[10px] text-[#6B665E] bg-[#F7F5F0] px-2.5 py-1 border border-black/10">
              {filteredObservations.length} Active Pins
            </div>
          </div>

          {/* Interactive SVG Radar Map Viewport */}
          <div className="relative w-full h-80 bg-[#F7F5F0] border border-black/10 overflow-hidden flex items-center justify-center">
            {/* Background Grid Lines representing coordinates */}
            <svg className="absolute inset-0 w-full h-full opacity-15 stroke-black" width="100%" height="100%">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>

            {/* Stylized Continent / Flyway Overlay Lines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40" viewBox="0 0 800 400">
              {/* Atlantic Flyway Curved Path */}
              <path d="M 680 50 Q 640 200 620 380" fill="none" stroke="#3D4435" strokeWidth="3" strokeDasharray="6 6" />
              {/* Mississippi Flyway Curved Path */}
              <path d="M 480 60 Q 460 220 440 370" fill="none" stroke="#6B665E" strokeWidth="3" strokeDasharray="6 6" />
              {/* Pacific Flyway Curved Path */}
              <path d="M 200 40 Q 180 180 150 380" fill="none" stroke="#8C867A" strokeWidth="3" strokeDasharray="6 6" />
            </svg>

            {/* Live Observation Map Pins */}
            <div className="absolute inset-0 p-8">
              {filteredObservations.map((obs) => {
                const xPct = Math.min(92, Math.max(8, ((obs.longitude + 130) / 70) * 100));
                const yPct = Math.min(92, Math.max(8, ((55 - obs.latitude) / 35) * 100));

                let pinColor = 'bg-[#121212] text-[#FDFCFB]';
                if (obs.rarity === 'Rare') pinColor = 'bg-rose-700 text-white animate-bounce';
                else if (obs.rarity === 'Uncommon') pinColor = 'bg-[#3D4435] text-white';

                return (
                  <button
                    key={obs.id}
                    onClick={() => setSelectedObservation(obs)}
                    style={{ left: `${xPct}%`, top: `${yPct}%` }}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 p-2 rounded-full shadow-md transition-transform hover:scale-125 z-20 group ${pinColor}`}
                    title={`${obs.commonName} at ${obs.locationName}`}
                  >
                    <MapPin className="w-3.5 h-3.5 stroke-[2.5]" />

                    {/* Hover tooltip */}
                    <div className="absolute left-1/2 bottom-full mb-2 -translate-x-1/2 hidden group-hover:flex flex-col bg-[#121212] border border-black text-[#FDFCFB] p-2.5 shadow-2xl text-[11px] font-sans whitespace-nowrap z-30 pointer-events-none">
                      <span className="font-bold text-[#FDFCFB]">{obs.commonName}</span>
                      <span className="text-[#8C867A]">{obs.locationName}</span>
                      <span className="text-[9px] text-[#E5E2D9] uppercase tracking-wider">{new Date(obs.timestamp).toLocaleTimeString()}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Radar Legend */}
            <div className="absolute bottom-3 left-3 bg-[#FDFCFB]/90 border border-black/10 p-2.5 font-sans text-[10px] text-[#121212] uppercase tracking-wider flex items-center gap-3">
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-[#121212]" /> Common</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-[#3D4435]" /> Uncommon</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-rose-700" /> Rare Sighting</span>
            </div>
          </div>

          {/* Selected Observation Detail Box */}
          {selectedObservation && (
            <div className="mt-4 p-4 bg-[#F7F5F0] border border-black/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-fadeIn">
              <div className="flex items-center gap-4">
                {selectedObservation.imageUrl && (
                  <img
                    src={selectedObservation.imageUrl}
                    alt={selectedObservation.commonName}
                    className="w-14 h-14 object-cover border border-black/10"
                  />
                )}
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-base text-[#121212]">{selectedObservation.commonName}</h4>
                    <span className="text-xs text-[#8C867A] italic">({selectedObservation.scientificName})</span>
                    <span className="font-sans text-[9px] uppercase tracking-wider bg-[#3D4435] text-[#FDFCFB] px-2 py-0.5 font-semibold">
                      Count: {selectedObservation.count}
                    </span>
                  </div>
                  <p className="font-sans text-xs text-[#6B665E] mt-0.5">
                    📍 {selectedObservation.locationName} • Observer: {selectedObservation.observerName}
                  </p>
                  <p className="font-serif text-xs text-[#121212] italic mt-1">
                    "{selectedObservation.notes}"
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedObservation(null)}
                className="font-sans text-xs uppercase tracking-wider text-[#8C867A] hover:text-[#121212] font-bold"
              >
                Close
              </button>
            </div>
          )}
        </div>

        {/* Live Observations Feed Column (Col 1) */}
        <div className="bg-[#FFFFFF] border border-black/10 p-6 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-black/10 pb-3 mb-3 font-sans text-xs uppercase tracking-wider">
              <div className="flex items-center gap-2 font-bold text-[#121212]">
                <Clock className="w-4 h-4 text-[#3D4435]" />
                <span>Live Telemetry Feed</span>
              </div>
              <span className="text-[9px] text-[#3D4435] font-bold animate-pulse">
                ● Telemetry Stream
              </span>
            </div>

            <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1 scrollbar-thin">
              {filteredObservations.map((obs) => (
                <div
                  key={obs.id}
                  onClick={() => setSelectedObservation(obs)}
                  className={`p-3.5 border transition-all cursor-pointer ${
                    selectedObservation?.id === obs.id
                      ? 'bg-[#F7F5F0] border-black font-semibold'
                      : 'bg-[#FDFCFB] border-black/10 hover:border-black/30'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-serif font-bold text-[#121212] text-sm">{obs.commonName}</span>
                    <span className="font-sans text-[10px] text-[#8C867A]">
                      {new Date(obs.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <p className="font-sans text-xs text-[#6B665E] truncate">
                    📍 {obs.locationName}
                  </p>

                  <div className="flex items-center justify-between mt-2 pt-1 border-t border-black/5 font-sans text-[10px] uppercase tracking-wider">
                    <span className="text-[#8C867A]">By {obs.observerName}</span>
                    <span className={`font-bold ${obs.rarity === 'Rare' ? 'text-rose-700' : 'text-[#3D4435]'}`}>
                      {obs.rarity} ({obs.count} count)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Submit Field Observation Modal */}
      {showLogModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FDFCFB] border border-black/20 max-w-lg w-full p-6 shadow-2xl space-y-4 animate-fadeIn font-serif">
            <div className="flex items-center justify-between border-b border-black/10 pb-3">
              <h3 className="text-xl font-bold text-[#121212] flex items-center gap-2">
                <Plus className="w-5 h-5 text-[#3D4435]" />
                <span>Log New Field Sightings</span>
              </h3>
              <button
                onClick={() => setShowLogModal(false)}
                className="text-[#8C867A] hover:text-[#121212]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSighting} className="space-y-4 font-sans text-xs">
              <div>
                <label className="block text-[#121212] font-semibold uppercase tracking-wider text-[10px] mb-1">Species Observed</label>
                <select
                  value={newSpeciesId}
                  onChange={(e) => setNewSpeciesId(e.target.value)}
                  className="w-full bg-[#F7F5F0] border border-black/20 p-2.5 text-[#121212] focus:outline-none focus:border-black font-serif"
                >
                  {BIRDS_DATABASE.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.commonName} ({b.scientificName})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[#121212] font-semibold uppercase tracking-wider text-[10px] mb-1">Location Name</label>
                <input
                  type="text"
                  required
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  className="w-full bg-[#F7F5F0] border border-black/20 p-2.5 text-[#121212] focus:outline-none focus:border-black"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#121212] font-semibold uppercase tracking-wider text-[10px] mb-1">Flock Count</label>
                  <input
                    type="number"
                    min="1"
                    max="500"
                    value={newCount}
                    onChange={(e) => setNewCount(parseInt(e.target.value) || 1)}
                    className="w-full bg-[#F7F5F0] border border-black/20 p-2.5 text-[#121212] focus:outline-none focus:border-black"
                  />
                </div>
                <div>
                  <label className="block text-[#121212] font-semibold uppercase tracking-wider text-[10px] mb-1">Habitat</label>
                  <input
                    type="text"
                    value={newHabitat}
                    onChange={(e) => setNewHabitat(e.target.value)}
                    className="w-full bg-[#F7F5F0] border border-black/20 p-2.5 text-[#121212] focus:outline-none focus:border-black"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#121212] font-semibold uppercase tracking-wider text-[10px] mb-1">Observer Notes & Field Details</label>
                <textarea
                  rows={3}
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  className="w-full bg-[#F7F5F0] border border-black/20 p-2.5 text-[#121212] focus:outline-none focus:border-black font-serif resize-none"
                />
              </div>

              <div className="pt-3 flex justify-end gap-3 border-t border-black/10 uppercase tracking-wider">
                <button
                  type="button"
                  onClick={() => setShowLogModal(false)}
                  className="px-4 py-2.5 border border-black/20 text-[#6B665E] hover:text-[#121212] font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#121212] hover:bg-[#3D4435] text-[#FDFCFB] font-bold transition-colors border border-black"
                >
                  Publish Telemetry (+35 XP)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
