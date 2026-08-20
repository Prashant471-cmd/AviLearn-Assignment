import React, { useState } from 'react';
import { QUIZ_SETS } from '../data/quizzesDatabase';
import { QuizQuestion, QuizSet } from '../types';
import { playBirdCallSound } from '../lib/audioSynth';
import { Volume2, Sparkles, CheckCircle2, XCircle, ArrowRight, RotateCcw, Lightbulb, Trophy, BrainCircuit, RefreshCw } from 'lucide-react';

interface QuizSectionProps {
  onEarnXp: (amount: number) => void;
}

export const QuizSection: React.FC<QuizSectionProps> = ({ onEarnXp }) => {
  const [selectedQuizSet, setSelectedQuizSet] = useState<QuizSet>(QUIZ_SETS[0]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [quizFinished, setQuizFinished] = useState<boolean>(false);

  // AI Quiz Generator states
  const [isGeneratingAiQuiz, setIsGeneratingAiQuiz] = useState<boolean>(false);
  const [aiTopic, setAiTopic] = useState<string>('Songbird Identification & Calls');
  const [aiDifficulty, setAiDifficulty] = useState<'Beginner' | 'Intermediate' | 'Expert'>('Intermediate');
  const [aiRegion, setAiRegion] = useState<string>('North America');
  const [aiError, setAiError] = useState<string | null>(null);

  const currentQuestion: QuizQuestion | undefined = selectedQuizSet.questions[currentQuestionIndex];

  const handleSelectOption = (index: number) => {
    if (isSubmitted) return;
    setSelectedOptionIndex(index);
  };

  const handleSubmitAnswer = () => {
    if (selectedOptionIndex === null || isSubmitted || !currentQuestion) return;
    setIsSubmitted(true);

    if (selectedOptionIndex === currentQuestion.correctIndex) {
      setScore((prev) => prev + 1);
      onEarnXp(25);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex + 1 < selectedQuizSet.questions.length) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedOptionIndex(null);
      setIsSubmitted(false);
      setShowHint(false);
    } else {
      setQuizFinished(true);
      onEarnXp(50); // Completion bonus
    }
  };

  const handleResetQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedOptionIndex(null);
    setIsSubmitted(false);
    setScore(0);
    setShowHint(false);
    setQuizFinished(false);
  };

  const handleGenerateAiQuiz = async () => {
    setIsGeneratingAiQuiz(true);
    setAiError(null);
    try {
      const response = await fetch('/api/generate-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: aiTopic,
          difficulty: aiDifficulty,
          region: aiRegion,
          count: 4,
        }),
      });

      const data = await response.json();
      if (!data.success || !data.quiz || !data.quiz.questions || data.quiz.questions.length === 0) {
        throw new Error(data.error || 'Failed to generate quiz format.');
      }

      const generatedSet: QuizSet = {
        id: `ai-quiz-${Date.now()}`,
        title: data.quiz.quizTitle || `AI ${aiTopic} Challenge`,
        description: data.quiz.quizDescription || `Custom generated AI quiz for ${aiRegion}.`,
        category: 'AI Dynamic Generator',
        difficulty: aiDifficulty,
        questions: data.quiz.questions.map((q: any, idx: number) => ({
          id: `ai-q-${idx}`,
          type: 'fieldmark',
          question: q.question,
          options: q.options,
          correctIndex: q.correctIndex ?? 0,
          explanation: q.explanation,
          fieldMarkHint: q.fieldMarkHint,
          difficulty: aiDifficulty,
        })),
      };

      setSelectedQuizSet(generatedSet);
      handleResetQuiz();
    } catch (err: any) {
      console.error('AI quiz generation error:', err);
      setAiError(err.message || 'Could not generate quiz. Check API key setup or try again.');
    } finally {
      setIsGeneratingAiQuiz(false);
    }
  };

  const handlePlayAudioCue = () => {
    if (currentQuestion) {
      const freq = currentQuestion.audioFrequencyHz || 1200;
      const pattern = currentQuestion.audioPattern || 'whistle-slide';
      playBirdCallSound(freq, pattern);
    }
  };

  return (
    <div className="space-y-6 font-serif">
      {/* Quiz Category Banner */}
      <div className="bg-[#F7F5F0] border border-black/10 p-6 md:p-8 shadow-sm relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2 font-sans text-[10px] uppercase tracking-[0.25em] text-[#8C867A]">
              <span className="px-2.5 py-0.5 bg-[#3D4435] text-[#FDFCFB] font-bold">
                Session 014 / Quiz
              </span>
              <span>Diagnostic Taxonomy & Acoustic Calls</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-[#121212] tracking-tight mb-1">
              Field Identification <span className="italic font-light text-[#3D4435]">Quizzes</span>
            </h1>
            <p className="font-sans text-xs text-[#6B665E] max-w-xl">
              Sharpen your field mark identification, listen to synthesized call rhythms, or generate custom AI quizzes covering global flyway species.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 font-sans text-xs uppercase tracking-wider">
            {QUIZ_SETS.map((quiz) => (
              <button
                key={quiz.id}
                onClick={() => {
                  setSelectedQuizSet(quiz);
                  handleResetQuiz();
                }}
                className={`px-3.5 py-2 font-semibold transition-all border ${
                  selectedQuizSet.id === quiz.id
                    ? 'bg-[#121212] text-[#FDFCFB] border-black shadow-sm'
                    : 'bg-[#FDFCFB] text-[#121212] border-black/15 hover:border-black'
                }`}
              >
                {quiz.title}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Grid: Quiz Player vs AI Quiz Generator Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quiz Player Card (Cols 2) */}
        <div className="lg:col-span-2 bg-[#FFFFFF] border border-black/10 p-6 shadow-sm flex flex-col justify-between">
          {!quizFinished && currentQuestion ? (
            <div>
              {/* Progress Header */}
              <div className="flex items-center justify-between border-b border-black/10 pb-4 mb-4 font-sans text-xs uppercase tracking-widest">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[#8C867A]">
                    Question {currentQuestionIndex + 1} of {selectedQuizSet.questions.length}
                  </span>
                  <span className="text-black/20">•</span>
                  <span className="font-bold text-[#3D4435] bg-[#E5E2D9] px-2.5 py-0.5 border border-black/5">
                    {currentQuestion.type} Mode
                  </span>
                </div>

                <div className="flex items-center gap-3 font-semibold">
                  <span className="text-[#6B665E]">
                    Score: <span className="text-[#121212] font-black">{score}</span> / {currentQuestionIndex}
                  </span>
                </div>
              </div>

              {/* Question Image or Audio Cue */}
              {currentQuestion.imageUrl && (
                <div className="relative overflow-hidden mb-5 bg-[#E8E6E0] border border-black/10 h-64 max-h-72">
                  <img
                    src={currentQuestion.imageUrl}
                    alt="Bird Identification Challenge"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-3 bg-[#FDFCFB]/90 backdrop-blur-md px-3 py-1 text-[10px] font-sans uppercase tracking-widest text-[#121212] border border-black/10 font-bold">
                    Diagnostic Field Marks
                  </div>
                </div>
              )}

              {/* Sound Audio Synthesizer Trigger */}
              {(currentQuestion.type === 'audio' || currentQuestion.audioFrequencyHz) && (
                <div className="bg-[#F7F5F0] border border-black/10 p-4 mb-5 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={handlePlayAudioCue}
                      className="w-12 h-12 bg-[#3D4435] hover:bg-[#121212] text-[#FDFCFB] flex items-center justify-center transition-transform active:scale-95 shadow-md"
                      title="Play synthesized call audio"
                    >
                      <Volume2 className="w-5 h-5 fill-current" />
                    </button>
                    <div>
                      <h4 className="font-serif font-bold text-sm text-[#121212]">Synthesized Call Audio</h4>
                      <p className="font-sans text-[11px] text-[#6B665E]">
                        Pattern: {currentQuestion.audioPattern || 'whistle'} ({currentQuestion.audioFrequencyHz || 1200} Hz)
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handlePlayAudioCue}
                    className="font-sans text-xs uppercase tracking-widest text-[#3D4435] hover:text-[#121212] font-bold border-b border-[#3D4435]"
                  >
                    Play Call Sound
                  </button>
                </div>
              )}

              {/* Question Text */}
              <h3 className="text-xl sm:text-2xl font-semibold text-[#121212] mb-4 leading-snug">
                {currentQuestion.question}
              </h3>

              {/* Field Hint Button */}
              {currentQuestion.fieldMarkHint && (
                <div className="mb-4 font-sans text-xs">
                  {!showHint ? (
                    <button
                      onClick={() => setShowHint(true)}
                      className="inline-flex items-center gap-1.5 text-[#3D4435] bg-[#E5E2D9]/60 hover:bg-[#E5E2D9] border border-black/10 px-3 py-1.5 uppercase tracking-wider font-semibold transition-colors"
                    >
                      <Lightbulb className="w-3.5 h-3.5" />
                      <span>Show Diagnostic Field Tip</span>
                    </button>
                  ) : (
                    <div className="p-3 bg-[#F7F5F0] border border-black/15 text-[#121212]">
                      💡 <strong>Field Tip:</strong> {currentQuestion.fieldMarkHint}
                    </div>
                  )}
                </div>
              )}

              {/* Option Choices */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6 font-sans">
                {currentQuestion.options.map((option, idx) => {
                  let isSelected = selectedOptionIndex === idx;
                  let optionStyle = 'bg-[#FDFCFB] border-black/15 text-[#121212] hover:bg-[#F7F5F0] hover:border-black';

                  if (isSubmitted) {
                    if (idx === currentQuestion.correctIndex) {
                      optionStyle = 'bg-[#3D4435] border-[#3D4435] text-[#FDFCFB] font-bold';
                    } else if (isSelected) {
                      optionStyle = 'bg-rose-100 border-rose-400 text-rose-900';
                    } else {
                      optionStyle = 'bg-[#FDFCFB] border-black/5 text-[#8C867A] opacity-50';
                    }
                  } else if (isSelected) {
                    optionStyle = 'bg-[#121212] border-black text-[#FDFCFB] font-semibold';
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectOption(idx)}
                      disabled={isSubmitted}
                      className={`p-4 border text-left text-xs transition-all flex items-center justify-between ${optionStyle}`}
                    >
                      <span className="font-medium text-sm">{option}</span>
                      {isSubmitted && idx === currentQuestion.correctIndex && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0 ml-2" />
                      )}
                      {isSubmitted && isSelected && idx !== currentQuestion.correctIndex && (
                        <XCircle className="w-4 h-4 text-rose-600 shrink-0 ml-2" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Explanation & Feedback Box */}
              {isSubmitted && (
                <div className="p-4 bg-[#F7F5F0] border border-black/10 mb-6 space-y-1.5 animate-fadeIn">
                  <div className="font-sans text-xs uppercase tracking-widest">
                    {selectedOptionIndex === currentQuestion.correctIndex ? (
                      <span className="text-[#3D4435] font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" /> Correct (+25 XP)
                      </span>
                    ) : (
                      <span className="text-rose-700 font-bold flex items-center gap-1">
                        <XCircle className="w-4 h-4" /> Incorrect
                      </span>
                    )}
                  </div>
                  <p className="font-serif text-sm text-[#121212] leading-relaxed italic">
                    {currentQuestion.explanation}
                  </p>
                </div>
              )}

              {/* Action Bar */}
              <div className="flex items-center justify-between pt-4 border-t border-black/10 font-sans text-xs uppercase tracking-wider">
                <button
                  onClick={handleResetQuiz}
                  className="flex items-center gap-1.5 text-[#8C867A] hover:text-[#121212] font-semibold"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Restart Quiz</span>
                </button>

                {!isSubmitted ? (
                  <button
                    onClick={handleSubmitAnswer}
                    disabled={selectedOptionIndex === null}
                    className="bg-[#121212] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#3D4435] text-[#FDFCFB] font-bold px-6 py-2.5 transition-colors border border-black"
                  >
                    Submit Answer
                  </button>
                ) : (
                  <button
                    onClick={handleNextQuestion}
                    className="bg-[#3D4435] hover:bg-[#121212] text-[#FDFCFB] font-bold px-6 py-2.5 transition-colors flex items-center gap-2 border border-black"
                  >
                    <span>
                      {currentQuestionIndex + 1 < selectedQuizSet.questions.length ? 'Next Question' : 'View Results'}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ) : (
            /* Quiz Completed Summary View */
            <div className="py-12 text-center space-y-6 my-auto">
              <div className="w-20 h-20 bg-[#3D4435] text-[#FDFCFB] border border-black/10 rounded-full flex items-center justify-center mx-auto shadow-md">
                <Trophy className="w-10 h-10" />
              </div>

              <div>
                <h3 className="text-3xl font-extrabold text-[#121212]">Quiz Completed</h3>
                <p className="font-sans text-xs text-[#6B665E] uppercase tracking-widest mt-1">
                  You scored <span className="text-[#121212] font-black text-base">{score}</span> out of {selectedQuizSet.questions.length} questions.
                </p>
              </div>

              <div className="bg-[#F7F5F0] border border-black/10 p-5 max-w-sm mx-auto text-left space-y-2 font-sans text-xs">
                <div className="font-bold uppercase tracking-wider text-[#121212]">Earned Rewards</div>
                <div className="flex items-center justify-between text-[#3D4435] font-semibold">
                  <span>Correct Answer Bonuses</span>
                  <span>+{score * 25} XP</span>
                </div>
                <div className="flex items-center justify-between text-[#3D4435] font-semibold border-t border-black/10 pt-2">
                  <span>Quiz Completion Bonus</span>
                  <span>+50 XP</span>
                </div>
              </div>

              <div className="pt-2 flex justify-center gap-3 font-sans text-xs uppercase tracking-wider">
                <button
                  onClick={handleResetQuiz}
                  className="bg-[#121212] hover:bg-[#3D4435] text-[#FDFCFB] font-bold px-8 py-3 transition-colors border border-black"
                >
                  Try Again
                </button>
              </div>
            </div>
          )}
        </div>

        {/* AI Quiz Generator Card (Col 1) */}
        <div className="bg-[#3D4435] text-[#FDFCFB] border border-black/20 p-6 shadow-md space-y-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 font-sans text-xs uppercase tracking-[0.2em] font-bold text-amber-300 border-b border-white/10 pb-3">
              <BrainCircuit className="w-4 h-4 text-amber-300" />
              <span>AI Dynamic Quiz Generator</span>
            </div>

            <p className="font-sans text-xs text-white/80 leading-relaxed mt-3">
              Need custom practice? Powered by Gemini AI, generate custom ornithology quizzes tailored to specific regions, skill levels, or topics.
            </p>

            <div className="space-y-4 pt-4 font-sans text-xs">
              <div>
                <label className="block uppercase tracking-wider font-semibold text-white/70 text-[10px] mb-1">
                  Topic / Specialization
                </label>
                <select
                  value={aiTopic}
                  onChange={(e) => setAiTopic(e.target.value)}
                  className="w-full bg-[#2C3225] border border-white/20 p-2.5 text-white focus:outline-none focus:border-amber-300"
                >
                  <option value="Songbird Identification & Calls">Songbird Plumage & Calls</option>
                  <option value="Raptors & Birds of Prey">Raptors & Birds of Prey</option>
                  <option value="Waterfowl & Shorebirds">Waterfowl & Shorebirds</option>
                  <option value="Bird Migration & Flyways">Bird Migration & Flyways</option>
                  <option value="Anatomy & Flight Mechanics">Anatomy & Flight Mechanics</option>
                </select>
              </div>

              <div>
                <label className="block uppercase tracking-wider font-semibold text-white/70 text-[10px] mb-1">
                  Difficulty Level
                </label>
                <div className="grid grid-cols-3 gap-1.5 uppercase tracking-wider text-[10px]">
                  {(['Beginner', 'Intermediate', 'Expert'] as const).map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setAiDifficulty(lvl)}
                      className={`py-2 px-1 border transition-colors ${
                        aiDifficulty === lvl
                          ? 'bg-amber-300 text-[#121212] font-bold border-amber-300'
                          : 'bg-[#2C3225] text-white/70 border-white/20 hover:text-white'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block uppercase tracking-wider font-semibold text-white/70 text-[10px] mb-1">
                  Geographic Focus
                </label>
                <input
                  type="text"
                  value={aiRegion}
                  onChange={(e) => setAiRegion(e.target.value)}
                  placeholder="e.g. North America, Neotropics, Europe"
                  className="w-full bg-[#2C3225] border border-white/20 p-2.5 text-white placeholder-white/40 focus:outline-none focus:border-amber-300"
                />
              </div>

              {aiError && (
                <div className="p-3 bg-rose-900/40 border border-rose-400 text-rose-200 text-xs">
                  ⚠️ {aiError}
                </div>
              )}
            </div>
          </div>

          <button
            onClick={handleGenerateAiQuiz}
            disabled={isGeneratingAiQuiz}
            className="w-full bg-[#FDFCFB] hover:bg-[#E5E2D9] text-[#121212] font-sans font-bold uppercase tracking-[0.18em] py-3 px-4 text-xs transition-all flex items-center justify-center gap-2 border border-black/20 shadow-md disabled:opacity-50 mt-4"
          >
            {isGeneratingAiQuiz ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Synthesizing AI Quiz...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-[#3D4435]" />
                <span>Generate Custom AI Quiz</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
