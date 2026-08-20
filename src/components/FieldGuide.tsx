import React, { useState } from 'react';
import { BIRDS_DATABASE } from '../data/birdsDatabase';
import { BirdSpecies } from '../types';
import { playBirdCallSound } from '../lib/audioSynth';
import { Search, Volume2, BookOpen, Layers, Feather, Compass, Info, X, Split, Check } from 'lucide-react';

interface FieldGuideProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  onAddLifeList: (speciesId: string, location: string, notes: string) => void;
}

export const FieldGuide: React.FC<FieldGuideProps> = ({
  searchQuery,
  setSearchQuery,
  onAddLifeList,
}) => {
  const [selectedOrder, setSelectedOrder] = useState<string>('All');
  const [selectedSpecies, setSelectedSpecies] = useState<BirdSpecies | null>(null);
  const [comparisonSpecies, setComparisonSpecies] = useState<BirdSpecies | null>(null);
  const [isCompareMode, setIsCompareMode] = useState<boolean>(false);
  const [addedNotice, setAddedNotice] = useState<string | null>(null);

  const orders = ['All', ...Array.from(new Set(BIRDS_DATABASE.map((b) => b.order)))];

  const filteredBirds = BIRDS_DATABASE.filter((bird) => {
    const matchesOrder = selectedOrder === 'All' || bird.order === selectedOrder;
    const matchesSearch =
      !searchQuery ||
      bird.commonName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bird.scientificName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bird.family.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bird.keyFieldMarks.some((m) => m.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesOrder && matchesSearch;
  });

  const handleQuickAddLifeList = (bird: BirdSpecies, e: React.MouseEvent) => {
    e.stopPropagation();
    onAddLifeList(bird.id, 'Field Observation', `Spotted ${bird.commonName} via Field Guide lookup.`);
    setAddedNotice(`Added ${bird.commonName} to your Life List!`);
    setTimeout(() => setAddedNotice(null), 3000);
  };

  return (
    <div className="space-y-6 font-serif">
      {/* Field Guide Banner */}
      <div className="bg-[#F7F5F0] border border-black/10 p-6 md:p-8 shadow-sm relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2 font-sans text-[10px] uppercase tracking-[0.25em] text-[#8C867A]">
              <span className="px-2.5 py-0.5 bg-[#3D4435] text-[#FDFCFB] font-bold">
                Taxonomy & Field Guide
              </span>
              <span>12+ Comprehensive Species Profiles</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-[#121212] tracking-tight">
              Avian Taxonomy & <span className="italic font-light text-[#3D4435]">Field Encyclopedia</span>
            </h1>
            <p className="font-sans text-xs text-[#6B665E] max-w-xl mt-1">
              Inspect diagnostic plumage, compare look-alike species, listen to acoustic flight call patterns, and study wingspan measurements.
            </p>
          </div>

          <button
            onClick={() => {
              setIsCompareMode(!isCompareMode);
              if (!isCompareMode && filteredBirds.length >= 2) {
                setSelectedSpecies(filteredBirds[0]);
                setComparisonSpecies(filteredBirds[1]);
              }
            }}
            className={`px-4 py-2.5 text-xs font-sans uppercase tracking-widest font-bold transition-all border ${
              isCompareMode
                ? 'bg-[#121212] text-[#FDFCFB] border-black shadow-md'
                : 'bg-[#FDFCFB] text-[#121212] border-black/15 hover:border-black'
            }`}
          >
            <Split className="w-4 h-4 inline mr-2" />
            <span>{isCompareMode ? 'Exit Comparison Mode' : 'Side-by-Side Comparison'}</span>
          </button>
        </div>
      </div>

      {/* Added Notification Toast */}
      {addedNotice && (
        <div className="p-3.5 bg-[#3D4435] text-[#FDFCFB] font-sans font-bold text-xs shadow-md flex items-center gap-2 animate-fadeIn uppercase tracking-wider">
          <Check className="w-4 h-4 stroke-[3] text-amber-300" />
          <span>{addedNotice}</span>
        </div>
      )}

      {/* Order Filters */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none font-sans text-xs uppercase tracking-wider">
        <span className="font-bold text-[#8C867A] flex items-center gap-1 shrink-0 mr-2 text-[10px]">
          <Layers className="w-3.5 h-3.5" /> Order:
        </span>
        {orders.map((ord) => (
          <button
            key={ord}
            onClick={() => setSelectedOrder(ord)}
            className={`px-3.5 py-1.5 font-semibold whitespace-nowrap transition-all border ${
              selectedOrder === ord
                ? 'bg-[#121212] text-[#FDFCFB] border-black shadow-sm'
                : 'bg-[#FDFCFB] text-[#121212] border-black/10 hover:border-black'
            }`}
          >
            {ord}
          </button>
        ))}
      </div>

      {/* Side-by-Side Comparison View */}
      {isCompareMode && (
        <div className="bg-[#FFFFFF] border border-black/20 p-6 shadow-md space-y-4">
          <div className="flex items-center justify-between border-b border-black/10 pb-3 font-sans text-xs uppercase tracking-wider">
            <h3 className="font-bold text-[#121212] flex items-center gap-2">
              <Split className="w-4 h-4 text-[#3D4435]" />
              <span>Diagnostic Species Comparison</span>
            </h3>
            <span className="text-[#8C867A]">Select two species to evaluate differences</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Species Picker & Card */}
            <div className="space-y-3 bg-[#F7F5F0] p-5 border border-black/10">
              <label className="block font-sans text-[10px] uppercase tracking-wider font-bold text-[#121212]">Species A</label>
              <select
                value={selectedSpecies?.id || ''}
                onChange={(e) => {
                  const b = BIRDS_DATABASE.find((x) => x.id === e.target.value);
                  if (b) setSelectedSpecies(b);
                }}
                className="w-full bg-[#FDFCFB] border border-black/20 p-2 font-serif text-xs text-[#121212]"
              >
                {BIRDS_DATABASE.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.commonName}
                  </option>
                ))}
              </select>

              {selectedSpecies && (
                <div className="space-y-3 pt-2 text-xs">
                  {selectedSpecies.imageUrl && !selectedSpecies.commonName.toLowerCase().includes('owl') && selectedSpecies.order !== 'Strigiformes' ? (
                    <img
                      src={selectedSpecies.imageUrl}
                      alt={selectedSpecies.commonName}
                      className="w-full h-40 object-cover border border-black/10"
                    />
                  ) : (
                    <div className="w-full h-40 bg-[#3D4435] text-[#FDFCFB] flex flex-col items-center justify-center p-4 text-center font-sans border border-black/10">
                      <Feather className="w-8 h-8 mb-1 stroke-[1.5] text-[#E5E2D9]" />
                      <span className="text-xs uppercase tracking-widest font-bold">{selectedSpecies.commonName}</span>
                    </div>
                  )}
                  <h4 className="font-extrabold text-lg text-[#121212]">{selectedSpecies.commonName}</h4>
                  <p className="text-[#8C867A] italic text-sm">{selectedSpecies.scientificName}</p>
                  
                  <div className="space-y-1.5 pt-2 font-sans">
                    <div className="font-bold text-[#3D4435] text-[10px] uppercase tracking-wider">Field Marks:</div>
                    <ul className="list-disc list-inside text-[#121212] space-y-1 font-serif text-xs">
                      {selectedSpecies.keyFieldMarks.map((m, i) => (
                        <li key={i}>{m}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-black/10 font-sans text-[11px] text-[#6B665E]">
                    <div>Wingspan: <span className="text-[#121212] font-bold">{selectedSpecies.wingspanCm} cm</span></div>
                    <div>Weight: <span className="text-[#121212] font-bold">{selectedSpecies.weightG} g</span></div>
                    <div>Migration: <span className="text-[#121212] font-bold">{selectedSpecies.migrationStatus}</span></div>
                    <div>Status: <span className="text-[#121212] font-bold">{selectedSpecies.statusLabel}</span></div>
                  </div>
                </div>
              )}
            </div>

            {/* Right Species Picker & Card */}
            <div className="space-y-3 bg-[#F7F5F0] p-5 border border-black/10">
              <label className="block font-sans text-[10px] uppercase tracking-wider font-bold text-[#121212]">Species B (Comparison)</label>
              <select
                value={comparisonSpecies?.id || ''}
                onChange={(e) => {
                  const b = BIRDS_DATABASE.find((x) => x.id === e.target.value);
                  if (b) setComparisonSpecies(b);
                }}
                className="w-full bg-[#FDFCFB] border border-black/20 p-2 font-serif text-xs text-[#121212]"
              >
                {BIRDS_DATABASE.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.commonName}
                  </option>
                ))}
              </select>

              {comparisonSpecies && (
                <div className="space-y-3 pt-2 text-xs">
                  {comparisonSpecies.imageUrl && !comparisonSpecies.commonName.toLowerCase().includes('owl') && comparisonSpecies.order !== 'Strigiformes' ? (
                    <img
                      src={comparisonSpecies.imageUrl}
                      alt={comparisonSpecies.commonName}
                      className="w-full h-40 object-cover border border-black/10"
                    />
                  ) : (
                    <div className="w-full h-40 bg-[#3D4435] text-[#FDFCFB] flex flex-col items-center justify-center p-4 text-center font-sans border border-black/10">
                      <Feather className="w-8 h-8 mb-1 stroke-[1.5] text-[#E5E2D9]" />
                      <span className="text-xs uppercase tracking-widest font-bold">{comparisonSpecies.commonName}</span>
                    </div>
                  )}
                  <h4 className="font-extrabold text-lg text-[#121212]">{comparisonSpecies.commonName}</h4>
                  <p className="text-[#8C867A] italic text-sm">{comparisonSpecies.scientificName}</p>
                  
                  <div className="space-y-1.5 pt-2 font-sans">
                    <div className="font-bold text-[#3D4435] text-[10px] uppercase tracking-wider">Field Marks:</div>
                    <ul className="list-disc list-inside text-[#121212] space-y-1 font-serif text-xs">
                      {comparisonSpecies.keyFieldMarks.map((m, i) => (
                        <li key={i}>{m}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-black/10 font-sans text-[11px] text-[#6B665E]">
                    <div>Wingspan: <span className="text-[#121212] font-bold">{comparisonSpecies.wingspanCm} cm</span></div>
                    <div>Weight: <span className="text-[#121212] font-bold">{comparisonSpecies.weightG} g</span></div>
                    <div>Migration: <span className="text-[#121212] font-bold">{comparisonSpecies.migrationStatus}</span></div>
                    <div>Status: <span className="text-[#121212] font-bold">{comparisonSpecies.statusLabel}</span></div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Grid of Bird Species Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBirds.map((bird) => (
          <div
            key={bird.id}
            onClick={() => setSelectedSpecies(bird)}
            className="bg-[#FFFFFF] border border-black/10 hover:border-black transition-all duration-300 hover:-translate-y-1 cursor-pointer group flex flex-col justify-between shadow-xs"
          >
            <div>
              {/* Photo Header */}
              <div className="relative h-52 overflow-hidden bg-[#3D4435]/10">
                {bird.imageUrl && !bird.commonName.toLowerCase().includes('owl') && bird.order !== 'Strigiformes' ? (
                  <>
                    <img
                      src={bird.imageUrl}
                      alt={bird.commonName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  </>
                ) : (
                  <div className="w-full h-full bg-[#3D4435] text-[#FDFCFB] flex flex-col items-center justify-center p-6 text-center font-sans border-b border-black/10">
                    <Feather className="w-12 h-12 mb-2 stroke-[1.5] text-[#E5E2D9]" />
                    <span className="text-xs uppercase tracking-[0.2em] font-bold text-[#FDFCFB]">{bird.order}</span>
                    <span className="text-[10px] text-[#E5E2D9] font-serif italic mt-0.5">{bird.family} Specimen</span>
                  </div>
                )}

                <div className="absolute top-3 left-3 flex items-center gap-1.5">
                  <span className="px-2.5 py-0.5 bg-[#FDFCFB]/90 text-[#121212] font-sans text-[9px] uppercase tracking-widest font-bold border border-black/10">
                    {bird.family}
                  </span>
                </div>

                <button
                  onClick={(e) => handleQuickAddLifeList(bird, e)}
                  className="absolute top-3 right-3 p-2 bg-[#FDFCFB] hover:bg-[#121212] hover:text-[#FDFCFB] text-[#121212] border border-black/20 transition-colors shadow-md"
                  title="Add to Life List"
                >
                  <BookOpen className="w-4 h-4" />
                </button>

                {bird.imageUrl && !bird.commonName.toLowerCase().includes('owl') && bird.order !== 'Strigiformes' && (
                  <div className="absolute bottom-3 left-3 right-3">
                    <h3 className="text-lg font-extrabold text-[#FDFCFB] group-hover:text-amber-200 transition-colors">
                      {bird.commonName}
                    </h3>
                    <p className="text-xs text-[#E5E2D9] italic font-light">{bird.scientificName}</p>
                  </div>
                )}
              </div>

              {/* Card Body */}
              <div className="p-5 space-y-3 text-xs">
                <p className="text-[#6B665E] line-clamp-2 leading-relaxed">
                  {bird.description}
                </p>

                <div className="space-y-1 font-sans">
                  <div className="font-bold text-[#3D4435] text-[10px] uppercase tracking-wider flex items-center gap-1">
                    <Feather className="w-3.5 h-3.5" /> Key Field Marks:
                  </div>
                  <ul className="text-[#121212] font-serif space-y-0.5 pl-2 border-l-2 border-[#3D4435]">
                    {bird.keyFieldMarks.slice(0, 2).map((mark, idx) => (
                      <li key={idx} className="truncate">{mark}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Footer Quick Bar */}
            <div className="p-4 pt-3 border-t border-black/10 flex items-center justify-between font-sans text-xs uppercase tracking-wider">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  playBirdCallSound(bird.audioFrequencyHz || 1200, bird.callPattern || 'whistle-slide');
                }}
                className="flex items-center gap-1.5 text-[#3D4435] hover:text-[#121212] font-bold"
              >
                <Volume2 className="w-4 h-4" />
                <span>Listen Call</span>
              </button>

              <span className="text-[#8C867A] font-semibold text-[10px]">
                {bird.wingspanCm}cm Wingspan
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Detailed Species Modal */}
      {selectedSpecies && !isCompareMode && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FDFCFB] border border-black/20 max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl space-y-5 animate-fadeIn font-serif">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-black/10 pb-4">
              <div>
                <div className="flex items-center gap-2 mb-1 font-sans text-[10px] uppercase tracking-wider">
                  <span className="px-2.5 py-0.5 bg-[#3D4435] text-[#FDFCFB] font-bold">
                    {selectedSpecies.order} • {selectedSpecies.family}
                  </span>
                  <span className="text-[#8C867A] font-semibold">{selectedSpecies.statusLabel}</span>
                </div>
                <h2 className="text-3xl font-extrabold text-[#121212]">{selectedSpecies.commonName}</h2>
                <p className="text-sm text-[#8C867A] italic">{selectedSpecies.scientificName}</p>
              </div>

              <button
                onClick={() => setSelectedSpecies(null)}
                className="p-1 text-[#8C867A] hover:text-[#121212]"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Photo & Sound Player */}
            <div className="relative overflow-hidden h-64 bg-[#3D4435]/10 border border-black/10">
              {selectedSpecies.imageUrl && !selectedSpecies.commonName.toLowerCase().includes('owl') && selectedSpecies.order !== 'Strigiformes' ? (
                <img
                  src={selectedSpecies.imageUrl}
                  alt={selectedSpecies.commonName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-[#3D4435] text-[#FDFCFB] flex flex-col items-center justify-center p-6 text-center font-sans">
                  <Feather className="w-16 h-16 mb-2 stroke-[1.5] text-[#E5E2D9]" />
                  <span className="text-sm uppercase tracking-[0.2em] font-bold text-[#FDFCFB]">{selectedSpecies.commonName}</span>
                  <span className="text-xs text-[#E5E2D9] font-serif italic mt-1">{selectedSpecies.order} • {selectedSpecies.family} Specimen</span>
                </div>
              )}
              <button
                onClick={() =>
                  playBirdCallSound(selectedSpecies.audioFrequencyHz || 1200, selectedSpecies.callPattern || 'whistle-slide')
                }
                className="absolute bottom-4 right-4 bg-[#121212] hover:bg-[#3D4435] text-[#FDFCFB] font-sans font-bold uppercase tracking-wider px-4 py-2.5 text-xs flex items-center gap-2 shadow-xl border border-black"
              >
                <Volume2 className="w-4 h-4" />
                <span>Play Species Song</span>
              </button>
            </div>

            {/* Biological Specifications Table */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-sans text-xs bg-[#F7F5F0] p-4 border border-black/10">
              <div>
                <span className="text-[#8C867A] block uppercase text-[10px] tracking-wider font-semibold">Wingspan</span>
                <span className="text-[#121212] font-bold">{selectedSpecies.wingspanCm} cm</span>
              </div>
              <div>
                <span className="text-[#8C867A] block uppercase text-[10px] tracking-wider font-semibold">Body Length</span>
                <span className="text-[#121212] font-bold">{selectedSpecies.lengthCm} cm</span>
              </div>
              <div>
                <span className="text-[#8C867A] block uppercase text-[10px] tracking-wider font-semibold">Average Weight</span>
                <span className="text-[#121212] font-bold">{selectedSpecies.weightG} g</span>
              </div>
              <div>
                <span className="text-[#8C867A] block uppercase text-[10px] tracking-wider font-semibold">Migration Pattern</span>
                <span className="text-[#3D4435] font-bold">{selectedSpecies.migrationStatus}</span>
              </div>
            </div>

            {/* Diagnostic Field Marks */}
            <div className="space-y-2">
              <h4 className="font-sans text-xs font-bold text-[#3D4435] uppercase tracking-wider flex items-center gap-1.5">
                <Feather className="w-4 h-4" /> Diagnostic Field Marks & Identification Cues
              </h4>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#121212]">
                {selectedSpecies.keyFieldMarks.map((mark, i) => (
                  <li key={i} className="bg-[#F7F5F0] p-3 border border-black/10 flex items-start gap-2">
                    <span className="text-[#3D4435] font-bold">•</span>
                    <span>{mark}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Vocalization & Fun Fact */}
            <div className="p-4 bg-[#F7F5F0] border border-black/10 text-xs space-y-2">
              <div className="font-sans font-bold text-[#3D4435] uppercase tracking-wider text-[10px]">Vocalization Profile:</div>
              <p className="text-[#121212] leading-relaxed italic">{selectedSpecies.callDescription}</p>
              <div className="font-sans font-bold text-[#3D4435] uppercase tracking-wider text-[10px] pt-1">Biological Fact:</div>
              <p className="text-[#121212] leading-relaxed italic">{selectedSpecies.funFact}</p>
            </div>

            {/* Actions */}
            <div className="pt-2 flex justify-end gap-3 border-t border-black/10 font-sans text-xs uppercase tracking-wider">
              <button
                onClick={(e) => {
                  handleQuickAddLifeList(selectedSpecies, e);
                  setSelectedSpecies(null);
                }}
                className="bg-[#121212] hover:bg-[#3D4435] text-[#FDFCFB] font-bold px-6 py-2.5 transition-colors border border-black shadow-md"
              >
                Add to Life List (+30 XP)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
