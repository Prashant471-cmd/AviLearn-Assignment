import React, { useState } from 'react';
import { AIIdentificationResult } from '../types';
import { Sparkles, Upload, Image as ImageIcon, MessageSquare, Bot, Send, Loader2, CheckCircle2, ShieldAlert, ArrowRight, User } from 'lucide-react';

interface AIScannerProps {
  onEarnXp: (amount: number) => void;
  onAddLifeList: (speciesId: string, location: string, notes: string) => void;
}

export const AIScanner: React.FC<AIScannerProps> = ({ onEarnXp, onAddLifeList }) => {
  const [activeSubTab, setActiveSubTab] = useState<'scanner' | 'chat'>('scanner');

  // Scanner states
  const [selectedImageBase64, setSelectedImageBase64] = useState<string | null>(null);
  const [imageMimeType, setImageMimeType] = useState<string>('image/jpeg');
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [descriptionNote, setDescriptionNote] = useState<string>('');
  const [locationInput, setLocationInput] = useState<string>('Eastern North America');
  const [seasonInput, setSeasonInput] = useState<string>('Spring Migration');

  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [aiResult, setAiResult] = useState<AIIdentificationResult | null>(null);
  const [scannerError, setScannerError] = useState<string | null>(null);

  // Chat states
  const [chatMessages, setChatMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([
    {
      role: 'assistant',
      content:
        'Hello! I am Dr. Evelyn Vance, Senior Ornithologist. Ask me anything about bird behavior, nesting habits, optic gear tips, call identification, or migration flyways!',
    },
  ]);
  const [chatInput, setChatInput] = useState<string>('');
  const [isChatSending, setIsChatSending] = useState<boolean>(false);

  // Handle file drop or selection
  const handleImageUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64Data = result.split(',')[1];
      setSelectedImageBase64(base64Data);
      setImageMimeType(file.type || 'image/jpeg');
      setImagePreviewUrl(result);
    };
    reader.readAsDataURL(file);
  };

  const handleSampleImage = (url: string, desc: string) => {
    // For sample image URLs, set description
    setDescriptionNote(desc);
    setImagePreviewUrl(url);
    // Convert sample image URL to base64 via fetch if needed, or pass description
    fetch(url)
      .then((res) => res.blob())
      .then((blob) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const res = reader.result as string;
          setSelectedImageBase64(res.split(',')[1]);
          setImageMimeType(blob.type || 'image/jpeg');
        };
        reader.readAsDataURL(blob);
      })
      .catch(() => {
        // Fallback to text description if fetch blocked
        setSelectedImageBase64(null);
      });
  };

  const handleAnalyzePhoto = async () => {
    if (!selectedImageBase64 && !descriptionNote) {
      setScannerError('Please upload a photo or enter field observation notes.');
      return;
    }

    setIsAnalyzing(true);
    setScannerError(null);
    setAiResult(null);

    try {
      const response = await fetch('/api/identify-bird', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: selectedImageBase64,
          mimeType: imageMimeType,
          description: descriptionNote,
          location: locationInput,
          season: seasonInput,
        }),
      });

      const data = await response.json();
      if (!data.success || !data.result || !data.result.primaryMatch) {
        throw new Error(data.error || 'Species identification failed.');
      }

      setAiResult(data.result);
      onEarnXp(40);
    } catch (err: any) {
      console.error('AI Identification error:', err);
      setScannerError(err.message || 'Error communicating with AI server. Please verify GEMINI_API_KEY.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSendChatMessage = async () => {
    if (!chatInput.trim() || isChatSending) return;

    const userText = chatInput.trim();
    setChatInput('');
    setChatMessages((prev) => [...prev, { role: 'user', content: userText }]);
    setIsChatSending(true);

    try {
      const response = await fetch('/api/ask-ornithologist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: userText,
          conversationHistory: chatMessages,
        }),
      });

      const data = await response.json();
      if (!data.success || !data.text) {
        throw new Error(data.error || 'Failed to get response.');
      }

      setChatMessages((prev) => [...prev, { role: 'assistant', content: data.text }]);
      onEarnXp(10);
    } catch (err: any) {
      console.error('Chat error:', err);
      setChatMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Apologies, I encountered an issue processing your query. Please try again.' },
      ]);
    } finally {
      setIsChatSending(false);
    }
  };

  return (
    <div className="space-y-6 font-serif">
      {/* Banner */}
      <div className="bg-[#F7F5F0] border border-black/10 p-6 md:p-8 shadow-sm relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2 font-sans text-[10px] uppercase tracking-[0.25em] text-[#8C867A]">
              <span className="px-2.5 py-0.5 bg-[#3D4435] text-[#FDFCFB] font-bold">
                Gemini AI Vision & Assistant
              </span>
              <span>Dr. Evelyn Vance Field AI</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-[#121212] tracking-tight">
              AI Photo Scanner & <span className="italic font-light text-[#3D4435]">Expert Ornithologist</span>
            </h1>
            <p className="font-sans text-xs text-[#6B665E] max-w-xl mt-1">
              Upload field photographs or describe mysterious plumage to get instant computer vision species identification and diagnostic tips.
            </p>
          </div>

          <div className="flex items-center gap-2 font-sans text-xs uppercase tracking-wider">
            <button
              onClick={() => setActiveSubTab('scanner')}
              className={`px-3.5 py-2 font-semibold transition-all border flex items-center gap-1.5 ${
                activeSubTab === 'scanner'
                  ? 'bg-[#121212] text-[#FDFCFB] border-black shadow-sm'
                  : 'bg-[#FDFCFB] text-[#121212] border-black/15 hover:border-black'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Photo Scanner</span>
            </button>
            <button
              onClick={() => setActiveSubTab('chat')}
              className={`px-3.5 py-2 font-semibold transition-all border flex items-center gap-1.5 ${
                activeSubTab === 'chat'
                  ? 'bg-[#121212] text-[#FDFCFB] border-black shadow-sm'
                  : 'bg-[#FDFCFB] text-[#121212] border-black/15 hover:border-black'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Ask Ornithologist</span>
            </button>
          </div>
        </div>
      </div>

      {activeSubTab === 'scanner' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: Input Form / Drag-Drop */}
          <div className="bg-[#FFFFFF] border border-black/10 p-6 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-[#121212] flex items-center gap-2 border-b border-black/10 pb-3">
              <ImageIcon className="w-4 h-4 text-[#3D4435]" />
              <span>Upload Bird Photo or Field Notes</span>
            </h3>

            {/* Drag & Drop Box */}
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                  handleImageUpload(e.dataTransfer.files[0]);
                }
              }}
              className="border-2 border-dashed border-black/20 hover:border-black p-6 text-center bg-[#FDFCFB] transition-colors cursor-pointer relative"
            >
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleImageUpload(e.target.files[0]);
                  }
                }}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />

              {imagePreviewUrl ? (
                <div className="space-y-2">
                  <img
                    src={imagePreviewUrl}
                    alt="Uploaded bird preview"
                    className="max-h-48 mx-auto object-contain border border-black/10 shadow-sm"
                  />
                  <p className="font-sans text-xs text-[#3D4435] font-bold">
                    ✓ Photo Loaded for AI Analysis
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="w-12 h-12 bg-[#F7F5F0] border border-black/10 flex items-center justify-center mx-auto text-[#3D4435]">
                    <Upload className="w-6 h-6" />
                  </div>
                  <div className="text-xs font-bold text-[#121212] font-sans">
                    Drag and drop your bird photo here
                  </div>
                  <p className="font-sans text-[11px] text-[#8C867A]">
                    Supports JPG, PNG, WEBP (Max 10MB)
                  </p>
                </div>
              )}
            </div>

            {/* Quick Sample Photos */}
            <div>
              <label className="block font-sans text-[10px] font-bold text-[#8C867A] uppercase tracking-wider mb-1.5">
                Or Try Sample Bird Photos:
              </label>
              <div className="grid grid-cols-3 gap-2 font-sans">
                <button
                  onClick={() =>
                    handleSampleImage(
                      'https://images.unsplash.com/photo-1549608276-5786777e6587?auto=format&fit=crop&w=800&q=80',
                      'Bright red body, black mask around bill, distinct crest.'
                    )
                  }
                  className="p-2 bg-[#F7F5F0] hover:bg-[#E8E6E0] border border-black/15 text-xs text-[#121212] font-medium flex items-center gap-1.5 transition-colors"
                >
                  <span>🔴 Cardinal</span>
                </button>
                <button
                  onClick={() =>
                    handleSampleImage(
                      'https://images.unsplash.com/photo-1574063413132-355dbfd83e08?auto=format&fit=crop&w=800&q=80',
                      'Slate gray back, mustache mark below eye, long pointed wings.'
                    )
                  }
                  className="p-2 bg-[#F7F5F0] hover:bg-[#E8E6E0] border border-black/15 text-xs text-[#121212] font-medium flex items-center gap-1.5 transition-colors"
                >
                  <span>🦅 Falcon</span>
                </button>
                <button
                  onClick={() =>
                    handleSampleImage(
                      'https://images.unsplash.com/photo-1568819317551-31051b37f69f?auto=format&fit=crop&w=800&q=80',
                      'White owl with golden yellow eyes, dark barring.'
                    )
                  }
                  className="p-2 bg-[#F7F5F0] hover:bg-[#E8E6E0] border border-black/15 text-xs text-[#121212] font-medium flex items-center gap-1.5 transition-colors"
                >
                  <span>🦉 Snowy Owl</span>
                </button>
              </div>
            </div>

            {/* Text Description & Location */}
            <div className="space-y-3 pt-2 text-xs">
              <div>
                <label className="block font-sans text-[10px] uppercase tracking-wider text-[#121212] font-bold mb-1">
                  Field Description & Behavior Notes
                </label>
                <textarea
                  rows={2}
                  value={descriptionNote}
                  onChange={(e) => setDescriptionNote(e.target.value)}
                  placeholder="Describe bill shape, crown pattern, wing bars, flight behavior, or habitat..."
                  className="w-full bg-[#F7F5F0] border border-black/20 p-2 text-[#121212] focus:outline-none focus:border-black font-serif text-xs resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 font-sans">
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-[#121212] font-bold mb-1">Observation Location</label>
                  <input
                    type="text"
                    value={locationInput}
                    onChange={(e) => setLocationInput(e.target.value)}
                    className="w-full bg-[#F7F5F0] border border-black/20 p-2 text-[#121212] focus:outline-none focus:border-black text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-[#121212] font-bold mb-1">Season / Month</label>
                  <input
                    type="text"
                    value={seasonInput}
                    onChange={(e) => setSeasonInput(e.target.value)}
                    className="w-full bg-[#F7F5F0] border border-black/20 p-2 text-[#121212] focus:outline-none focus:border-black text-xs"
                  />
                </div>
              </div>
            </div>

            {scannerError && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-xs text-rose-800 font-sans">
                ⚠️ {scannerError}
              </div>
            )}

            <button
              onClick={handleAnalyzePhoto}
              disabled={isAnalyzing}
              className="w-full bg-[#121212] hover:bg-[#3D4435] text-[#FDFCFB] font-bold py-3 px-4 text-xs font-sans uppercase tracking-wider transition-colors flex items-center justify-center gap-2 border border-black shadow-sm disabled:opacity-50"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Analyzing Field Marks with Gemini AI...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Run AI Vision Identification</span>
                </>
              )}
            </button>
          </div>

          {/* Right: AI Identification Results */}
          <div className="bg-[#FFFFFF] border border-black/10 p-6 shadow-sm flex flex-col justify-between">
            {aiResult ? (
              <div className="space-y-4 animate-fadeIn">
                <div className="flex items-center justify-between border-b border-black/10 pb-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-[#3D4435]" />
                    <h3 className="text-lg font-extrabold text-[#121212]">
                      {aiResult.primaryMatch.commonName}
                    </h3>
                  </div>

                  <span className="font-sans text-[10px] bg-[#3D4435] text-[#FDFCFB] font-bold px-2.5 py-1 uppercase tracking-wider">
                    {aiResult.primaryMatch.confidencePercentage}% Confidence ({aiResult.primaryMatch.confidence})
                  </span>
                </div>

                <p className="text-xs text-[#8C867A] italic">
                  {aiResult.primaryMatch.scientificName} • Order {aiResult.primaryMatch.order} ({aiResult.primaryMatch.family})
                </p>

                <p className="text-xs text-[#121212] leading-relaxed bg-[#F7F5F0] p-3 border border-black/10">
                  {aiResult.primaryMatch.summary}
                </p>

                {/* Field Marks */}
                <div className="space-y-1.5">
                  <h4 className="text-xs font-bold text-[#3D4435] font-sans uppercase tracking-wider">Diagnostic Field Marks:</h4>
                  <ul className="list-disc list-inside text-xs text-[#121212] space-y-1">
                    {aiResult.primaryMatch.keyFieldMarks.map((mark, idx) => (
                      <li key={idx}>{mark}</li>
                    ))}
                  </ul>
                </div>

                {/* Habitat & Call */}
                <div className="grid grid-cols-2 gap-2 text-xs bg-[#F7F5F0] p-3 border border-black/10 font-sans">
                  <div>
                    <span className="text-[#8C867A] text-[10px] uppercase tracking-wider block">Habitat:</span>
                    <span className="text-[#121212] font-semibold">{aiResult.primaryMatch.habitat}</span>
                  </div>
                  <div>
                    <span className="text-[#8C867A] text-[10px] uppercase tracking-wider block">Call / Song:</span>
                    <span className="text-[#121212] font-semibold">{aiResult.primaryMatch.callDescription}</span>
                  </div>
                </div>

                {/* Similar Lookalikes */}
                {aiResult.similarSpecies && aiResult.similarSpecies.length > 0 && (
                  <div className="space-y-1.5 pt-2 border-t border-black/10">
                    <h4 className="text-xs font-bold text-[#121212] font-sans uppercase tracking-wider">Look-Alike Species Comparison:</h4>
                    <div className="space-y-1">
                      {aiResult.similarSpecies.map((sim, i) => (
                        <div key={i} className="text-xs text-[#6B665E] bg-[#F7F5F0] p-2 border border-black/10">
                          <strong className="text-[#121212]">{sim.commonName}:</strong> {sim.distinguishingFeature}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action button */}
                <button
                  onClick={() => {
                    onAddLifeList(
                      aiResult.primaryMatch.commonName,
                      locationInput,
                      `AI Identified with ${aiResult.primaryMatch.confidencePercentage}% confidence.`
                    );
                  }}
                  className="w-full mt-2 bg-[#121212] hover:bg-[#3D4435] text-[#FDFCFB] font-bold py-2.5 px-4 text-xs font-sans uppercase tracking-wider transition-colors border border-black shadow-sm"
                >
                  Save to My Life List (+40 XP)
                </button>
              </div>
            ) : (
              <div className="my-auto text-center py-12 space-y-3 font-sans">
                <div className="w-16 h-16 bg-[#F7F5F0] border border-black/10 flex items-center justify-center mx-auto text-[#3D4435]">
                  <Sparkles className="w-8 h-8 text-[#3D4435]" />
                </div>
                <h4 className="text-sm font-bold text-[#121212]">AI Vision Analysis Ready</h4>
                <p className="text-xs text-[#6B665E] max-w-xs mx-auto font-serif">
                  Upload a photo or select a sample image on the left to receive AI species classification and expert field tips.
                </p>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Ask AI Ornithologist Chat */
        <div className="bg-[#FFFFFF] border border-black/10 p-6 shadow-sm space-y-4 flex flex-col h-[520px]">
          <div className="flex items-center gap-3 border-b border-black/10 pb-3">
            <div className="w-10 h-10 bg-[#F7F5F0] text-[#3D4435] border border-black/10 flex items-center justify-center font-bold shrink-0">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#121212]">Dr. Evelyn Vance, Senior Ornithologist</h3>
              <p className="font-sans text-xs text-[#8C867A]">AI Expert in Avian Taxonomy, Migration & Behavior</p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-thin">
            {chatMessages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex gap-3 text-xs ${
                  msg.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {msg.role === 'assistant' && (
                  <div className="w-7 h-7 bg-[#F7F5F0] border border-black/10 text-[#3D4435] flex items-center justify-center shrink-0">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`p-3.5 max-w-lg leading-relaxed whitespace-pre-line border ${
                    msg.role === 'user'
                      ? 'bg-[#121212] text-[#FDFCFB] border-black font-sans'
                      : 'bg-[#F7F5F0] border-black/10 text-[#121212]'
                  }`}
                >
                  {msg.content}
                </div>

                {msg.role === 'user' && (
                  <div className="w-7 h-7 bg-[#121212] text-[#FDFCFB] flex items-center justify-center shrink-0">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Chat Input */}
          <div className="flex gap-2 pt-2 border-t border-black/10 font-sans">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendChatMessage()}
              placeholder="Ask about bird identification, binocular optics, nesting habits..."
              className="flex-1 bg-[#F7F5F0] border border-black/20 px-4 py-2.5 text-xs text-[#121212] placeholder-[#8C867A] focus:outline-none focus:border-black font-serif"
            />
            <button
              onClick={handleSendChatMessage}
              disabled={isChatSending || !chatInput.trim()}
              className="bg-[#121212] hover:bg-[#3D4435] text-[#FDFCFB] font-bold px-4 py-2.5 text-xs transition-colors flex items-center gap-1.5 border border-black disabled:opacity-40"
            >
              {isChatSending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4 stroke-[2.5]" />
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
