import React, { useState } from 'react';
import { Compass, Feather, Wind, ShieldAlert, Zap, Layers, Info } from 'lucide-react';

export const AnatomyLab: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'wing' | 'feather' | 'beak' | 'cranial'>('wing');

  const wingTypes = [
    {
      title: 'High-Speed Wings (Peregrine Falcon, Swallows)',
      aspectRatio: 'Long, narrow, swept-back wing tips',
      aerodynamics: 'Minimizes induced drag for extreme vertical dive speeds over 200+ mph.',
      speciesExample: 'Peregrine Falcon, Barn Swallow',
      bgGradient: 'from-rose-500/20 to-orange-500/10 border-rose-500/30',
    },
    {
      title: 'Soaring Wings (Bald Eagle, Albatross)',
      aspectRatio: 'Broad, slotted wing tips with deep camber',
      aerodynamics: 'Generates maximum lift at low speeds over rising thermal air currents.',
      speciesExample: 'Bald Eagle, Osprey, Turkey Vulture',
      bgGradient: 'from-emerald-500/20 to-teal-500/10 border-emerald-500/30',
    },
    {
      title: 'Hovering Figure-8 Wings (Hummingbirds)',
      aspectRatio: 'Rigid humerus bone with 180° shoulder rotation',
      aerodynamics: 'Generates continuous lift on both forward and backward stroke in 50Hz figure-8 motion.',
      speciesExample: 'Ruby-throated Hummingbird',
      bgGradient: 'from-cyan-500/20 to-blue-500/10 border-cyan-500/30',
    },
  ];

  return (
    <div className="space-y-6 font-serif">
      {/* Banner */}
      <div className="bg-[#F7F5F0] border border-black/10 p-6 md:p-8 shadow-sm relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2 font-sans text-[10px] uppercase tracking-[0.25em] text-[#8C867A]">
              <span className="px-2.5 py-0.5 bg-[#3D4435] text-[#FDFCFB] font-bold">
                Avian Physics & Aerodynamics
              </span>
              <span>Biomechanics & Feather Anatomy</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-[#121212] tracking-tight">
              Avian Anatomy & <span className="italic font-light text-[#3D4435]">Flight Physics</span>
            </h1>
            <p className="font-sans text-xs text-[#6B665E] max-w-xl mt-1">
              Explore Bernoulli’s principle in bird flight, structural feather interlocking mechanisms, specialized beak adaptations, and cranial shock absorption.
            </p>
          </div>

          <div className="flex flex-wrap gap-2 font-sans text-xs uppercase tracking-wider">
            {[
              { id: 'wing', label: 'Wing Aerodynamics', icon: Wind },
              { id: 'feather', label: 'Feather Microstructure', icon: Feather },
              { id: 'cranial', label: 'Cranial Shock Protection', icon: ShieldAlert },
            ].map((sec) => {
              const Icon = sec.icon;
              return (
                <button
                  key={sec.id}
                  onClick={() => setActiveSection(sec.id as any)}
                  className={`px-3.5 py-2 font-semibold transition-all border flex items-center gap-1.5 ${
                    activeSection === sec.id
                      ? 'bg-[#121212] text-[#FDFCFB] border-black shadow-sm'
                      : 'bg-[#FDFCFB] text-[#121212] border-black/15 hover:border-black'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{sec.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {activeSection === 'wing' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {wingTypes.map((wt, i) => (
              <div
                key={i}
                className="bg-[#FFFFFF] border border-black/10 p-6 shadow-xs space-y-3 relative overflow-hidden"
              >
                <div className="font-sans text-[10px] font-bold text-[#3D4435] uppercase tracking-wider">
                  Profile #{i + 1}
                </div>
                <h3 className="text-lg font-extrabold text-[#121212]">{wt.title}</h3>
                <div className="space-y-2 text-xs text-[#6B665E]">
                  <div>
                    <span className="font-sans text-[10px] uppercase tracking-wider font-bold text-[#121212] block">Aspect Ratio & Shape:</span>
                    <span>{wt.aspectRatio}</span>
                  </div>
                  <div>
                    <span className="font-sans text-[10px] uppercase tracking-wider font-bold text-[#121212] block">Aerodynamic Advantage:</span>
                    <span>{wt.aerodynamics}</span>
                  </div>
                  <div className="pt-2 border-t border-black/10">
                    <span className="font-sans text-[10px] uppercase tracking-wider font-bold text-[#121212] block">Species Example:</span>
                    <span className="text-[#3D4435] font-bold">{wt.speciesExample}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Airfoil Bernoulli Diagram Box */}
          <div className="bg-[#FFFFFF] border border-black/10 p-6 shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-[#121212] flex items-center gap-2 border-b border-black/10 pb-3">
              <Wind className="w-5 h-5 text-[#3D4435]" />
              <span>Bernoulli’s Principle & Avian Airfoil Camber</span>
            </h3>

            <div className="bg-[#F7F5F0] p-6 border border-black/10 flex flex-col md:flex-row items-center gap-6">
              <div className="w-full md:w-1/2 h-44 bg-[#FDFCFB] border border-black/15 relative overflow-hidden flex items-center justify-center p-4">
                {/* Airfoil SVG Vector */}
                <svg viewBox="0 0 400 150" className="w-full h-full text-[#3D4435]">
                  {/* Airfoil curve */}
                  <path
                    d="M 50 80 Q 150 20 350 80 Q 200 100 50 80 Z"
                    fill="currentColor"
                    fillOpacity="0.15"
                    stroke="currentColor"
                    strokeWidth="3"
                  />
                  {/* High velocity airflow arrows above (low pressure) */}
                  <path d="M 30 30 Q 150 10 370 40" fill="none" stroke="#121212" strokeWidth="2" strokeDasharray="4 4" />
                  <path d="M 30 50 Q 150 25 370 60" fill="none" stroke="#121212" strokeWidth="2" strokeDasharray="4 4" />
                  {/* Slower airflow underneath (high pressure = LIFT) */}
                  <path d="M 30 110 Q 150 115 370 110" fill="none" stroke="#3D4435" strokeWidth="2" />
                  {/* Upward LIFT arrow */}
                  <line x1="200" y1="120" x2="200" y2="30" stroke="#b91c1c" strokeWidth="3" />
                </svg>
              </div>

              <div className="w-full md:w-1/2 space-y-2 text-xs text-[#121212]">
                <h4 className="font-bold text-base text-[#121212]">How Lift is Created:</h4>
                <p className="leading-relaxed">
                  As a bird flapped forward, air travels faster over the curved upper surface (convex camber) than the flat under-wing surface. By Bernoulli’s equation, faster airflow creates lower static air pressure above the wing, generating an upward net force called <strong>LIFT</strong>.
                </p>
                <div className="p-3 bg-[#FDFCFB] border border-black/10 text-[#3D4435] font-sans text-xs">
                  💡 <strong>Slotting Effect:</strong> Wing tip primary feathers separate independently to act as miniature winglets, reducing drag turbulence at wing tips.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeSection === 'feather' && (
        <div className="bg-[#FFFFFF] border border-black/10 p-6 shadow-sm space-y-6">
          <h3 className="text-lg font-bold text-[#121212] flex items-center gap-2 border-b border-black/10 pb-3">
            <Feather className="w-5 h-5 text-[#3D4435]" />
            <span>Feather Microstructure: Shaft, Barbs & Hooked Barbules</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            <div className="space-y-3 bg-[#F7F5F0] p-5 border border-black/10">
              <h4 className="font-extrabold text-base text-[#121212]">Anatomical Feather Parts</h4>
              <div className="space-y-2 text-[#121212]">
                <div className="p-3 bg-[#FDFCFB] border border-black/10">
                  <strong className="text-[#121212] font-sans uppercase text-[10px] tracking-wider block">Calamus (Quill):</strong>
                  Hollow, unpigmented base anchored inside skin follicle.
                </div>
                <div className="p-3 bg-[#FDFCFB] border border-black/10">
                  <strong className="text-[#121212] font-sans uppercase text-[10px] tracking-wider block">Rachis (Shaft):</strong>
                  Solid central stem supporting the feather vane.
                </div>
                <div className="p-3 bg-[#FDFCFB] border border-black/10">
                  <strong className="text-[#121212] font-sans uppercase text-[10px] tracking-wider block">Barbs & Interlocking Barbules:</strong>
                  Microscopic branches with tiny Velcro-like hooks (barbicels) that zipper together to create an airtight flight surface!
                </div>
              </div>
            </div>

            <div className="space-y-3 bg-[#F7F5F0] p-5 border border-black/10">
              <h4 className="font-extrabold text-base text-[#121212]">Structural Color vs Pigments</h4>
              <p className="text-[#6B665E] leading-relaxed">
                While red and yellow plumage comes from ingested carotenoid pigments, blue colors (like on Blue Jays or Eastern Bluebirds) contain NO blue pigment whatsoever!
              </p>
              <div className="p-4 bg-[#FDFCFB] border border-black/10 text-[#121212] leading-relaxed">
                <strong className="font-sans uppercase text-[10px] tracking-wider text-[#3D4435] block mb-1">Microscopic Light Scattering:</strong>
                Microscopic spongy air pockets inside feather keratin scatter short blue wavelengths of sunlight, reflecting vivid cobalt blue to human eyes.
              </div>
            </div>
          </div>
        </div>
      )}

      {activeSection === 'cranial' && (
        <div className="bg-[#FFFFFF] border border-black/10 p-6 shadow-sm space-y-6">
          <h3 className="text-lg font-bold text-[#121212] flex items-center gap-2 border-b border-black/10 pb-3">
            <ShieldAlert className="w-5 h-5 text-[#3D4435]" />
            <span>Pileated Woodpecker Shock Absorption Mechanics (1,000 Gs)</span>
          </h3>

          <div className="bg-[#F7F5F0] p-5 border border-black/10 space-y-4 text-xs text-[#121212]">
            <p className="leading-relaxed">
              When a Pileated Woodpecker hammers into hardwood trees at speeds up to 20 strikes per second, its head experiences deceleration forces of <strong>1,000 Gs</strong> (human concussions occur at ~80 Gs).
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-4 bg-[#FDFCFB] border border-black/10">
                <div className="font-sans font-bold text-[#3D4435] uppercase text-[10px] tracking-wider mb-1">1. Hyoid Safety Sling</div>
                <p className="text-[#6B665E]">Long bone wrapping around the skull acts as an elastic seatbelt to absorb recoil shock.</p>
              </div>
              <div className="p-4 bg-[#FDFCFB] border border-black/10">
                <div className="font-sans font-bold text-[#3D4435] uppercase text-[10px] tracking-wider mb-1">2. Spongy Cranial Bone</div>
                <p className="text-[#6B665E]">Dense trabecular meshwork in skull plates dissipates kinetic impact waves away from brain cavity.</p>
              </div>
              <div className="p-4 bg-[#FDFCFB] border border-black/10">
                <div className="font-sans font-bold text-[#3D4435] uppercase text-[10px] tracking-wider mb-1">3. Nictitating Membrane</div>
                <p className="text-[#6B665E]">Transparent extra eyelid closes milliseconds before impact to protect eye from flying wood chips.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
