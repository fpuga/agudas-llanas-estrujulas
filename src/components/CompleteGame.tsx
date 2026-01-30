import { useState, useEffect } from 'react';
import type { Word, WordType } from '../types';
import {
  playSuccessSound,
  playErrorSound,
  playClickSound,
} from '../utils/sound';
import { SyllableBlock } from './SyllableBlock';

interface CompleteGameProps {
  words: Word[];
  onFinish: () => void;
}

type Phase = 'SELECT_TONIC' | 'CLASSIFY';

export function CompleteGame({ words, onFinish }: CompleteGameProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>('SELECT_TONIC');
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<WordType | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [shuffledOptions, setShuffledOptions] = useState<string[]>([]);

  // New state for input mode
  const initialMode =
    import.meta.env.VITE_COMPLETE_GAME_MODE === 'input' ? 'input' : 'choice';
  const [inputMode, setInputMode] = useState<'choice' | 'input'>(initialMode);
  const [inputValue, setInputValue] = useState('');
  const [attempts, setAttempts] = useState(0);

  const currentWord = words[currentIndex];

  useEffect(() => {
    if (!currentWord) return;

    // Reset state for new word
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setAttempts(0);
    setInputValue('');
    setInputMode(
      import.meta.env.VITE_COMPLETE_GAME_MODE === 'input' ? 'input' : 'choice'
    );

    const correctSyllable = currentWord.syllables[currentWord.tonic_index];

    // Get all syllables from all words to use as distractors
    const allSyllables = words.flatMap((w) => w.syllables);
    // Filter out the correct one and duplicates, then shuffle
    const uniqueSyllables = [
      ...new Set(allSyllables.filter((s) => s !== correctSyllable)),
    ];
    const distractors = uniqueSyllables
      .sort(() => Math.random() - 0.5)
      .slice(0, 2); // 2 distractors

    setShuffledOptions(
      [correctSyllable, ...distractors].sort(() => Math.random() - 0.5)
    );
  }, [currentWord, words]);

  const handleSyllableSelect = (syllable: string) => {
    playClickSound();
    setSelectedOption(syllable);

    const correctSyllable = currentWord.syllables[currentWord.tonic_index];

    if (syllable.toLowerCase() === correctSyllable.toLowerCase()) {
      // Correct syllable, move to classify phase
      // small delay to show selection
      setTimeout(() => {
        setPhase('CLASSIFY');
        setSelectedOption(null); // Reset for next phase cleanliness
        setInputValue('');
      }, 500);
    } else {
      // Wrong syllable
      playErrorSound();
      setIsCorrect(false);
      // Reset after delay
      setTimeout(() => {
        setSelectedOption(null);
        setIsCorrect(null);
      }, 1000);
    }
  };

  const handleInputSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const correctSyllable = currentWord.syllables[currentWord.tonic_index];

    if (inputValue.trim().toLowerCase() === correctSyllable.toLowerCase()) {
      playSuccessSound();
      setIsCorrect(true);
      setTimeout(() => {
        setPhase('CLASSIFY');
        setInputValue('');
        setIsCorrect(null);
      }, 500);
    } else {
      playErrorSound();
      setIsCorrect(false);
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);

      setTimeout(() => {
        setIsCorrect(null);
        // If 3 attempts failed, switch to choice mode
        if (newAttempts >= 3) {
          setInputMode('choice');
        }
      }, 1000);
    }
  };

  const handleTypeSelect = (type: WordType) => {
    playClickSound();
    setSelectedType(type);

    if (type === currentWord.type) {
      playSuccessSound();
      setIsCorrect(true);
      setTimeout(() => {
        handleNext();
      }, 1500);
    } else {
      playErrorSound();
      setIsCorrect(false);
      setTimeout(() => {
        setSelectedType(null);
        setIsCorrect(null);
      }, 1000);
    }
  };

  const handleNext = () => {
    if (currentIndex < words.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setPhase('SELECT_TONIC');
      setSelectedOption(null);
      setSelectedType(null);
      setIsCorrect(null);
    } else {
      onFinish();
    }
  };

  if (!currentWord) return null;

  return (
    <div className="animate-fade-in flex flex-col items-center gap-8">
      {/* Progress Bar */}
      <div className="h-4 w-full overflow-hidden rounded-full bg-slate-200 shadow-inner">
        <div
          className="h-full bg-emerald-500 transition-all duration-500 ease-out"
          style={{ width: `${(currentIndex / words.length) * 100}%` }}
        ></div>
      </div>

      <div className="w-full rounded-3xl border-4 border-emerald-100 bg-white p-8 text-center shadow-xl">
        {phase === 'SELECT_TONIC' ? (
          <>
            <h2 className="mb-8 text-2xl font-bold text-slate-700">
              Completa la palabra con la sílaba tónica:
            </h2>

            {/* Word with missing syllable */}
            <div className="mb-12 flex flex-wrap items-center justify-center gap-2">
              {currentWord.syllables.map((syl, idx) =>
                idx === currentWord.tonic_index ? (
                  <div
                    key={idx}
                    className="flex h-20 w-20 animate-pulse items-center justify-center rounded-2xl border-b-8 border-slate-300 bg-slate-50 md:h-28 md:w-28"
                  >
                    <span className="text-4xl font-black text-slate-300">
                      ?
                    </span>
                  </div>
                ) : (
                  <SyllableBlock key={idx} syllable={syl} disabled={true} />
                )
              )}
            </div>

            {/* Input or Options */}
            {inputMode === 'input' ? (
              <form
                onSubmit={handleInputSubmit}
                className="flex flex-col items-center gap-4"
              >
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className={`w-48 rounded-xl border-4 p-4 text-center text-3xl font-bold transition outline-none ${
                    isCorrect === false
                      ? 'border-rose-500 bg-rose-50 text-rose-700'
                      : isCorrect === true
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                        : 'border-sky-200 text-slate-700 focus:border-sky-400'
                  } `}
                  placeholder="..."
                  autoFocus
                />
                <button
                  type="submit"
                  className="rounded-xl bg-sky-500 px-8 py-3 text-xl font-bold text-white shadow transition hover:bg-sky-600 active:scale-95"
                >
                  Comprobar
                </button>
                <p className="text-sm text-slate-400">
                  {attempts > 0 && `Intentos: ${attempts}/3`}
                </p>
              </form>
            ) : (
              <div className="flex justify-center gap-6">
                {shuffledOptions.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSyllableSelect(opt)}
                    className={`transform rounded-2xl border-b-4 px-8 py-4 text-2xl font-bold shadow-lg transition hover:scale-105 active:scale-95 ${
                      selectedOption === opt
                        ? isCorrect === false
                          ? 'border-rose-700 bg-rose-500 text-white'
                          : 'border-emerald-700 bg-emerald-500 text-white'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-emerald-300'
                    } `}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </>
        ) : (
          <>
            <h2 className="mb-8 text-2xl font-bold text-slate-700">
              ¿Qué tipo de palabra es?
            </h2>

            {/* Completed Word */}
            <div className="mb-12 flex flex-wrap items-center justify-center gap-2">
              {currentWord.syllables.map((syl, idx) => (
                <SyllableBlock
                  key={idx}
                  syllable={syl}
                  isTonic={idx === currentWord.tonic_index}
                  isSelected={idx === currentWord.tonic_index}
                  disabled={true}
                />
              ))}
            </div>

            {/* Classification Buttons */}
            <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-3">
              {(['aguda', 'llana', 'esdrujula'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => handleTypeSelect(type)}
                  className={`transform rounded-2xl border-b-4 p-6 text-xl font-bold tracking-wider uppercase shadow-md transition hover:scale-105 active:scale-95 ${
                    selectedType === type
                      ? isCorrect === false
                        ? 'border-rose-700 bg-rose-500 text-white'
                        : 'border-emerald-700 bg-emerald-500 text-white'
                      : type === 'aguda'
                        ? 'border-blue-300 bg-blue-100 text-blue-800 hover:bg-blue-200'
                        : type === 'llana'
                          ? 'border-green-300 bg-green-100 text-green-800 hover:bg-green-200'
                          : 'border-red-300 bg-red-100 text-red-800 hover:bg-red-200'
                  } `}
                >
                  {type === 'esdrujula' ? 'Esdrújula' : type}
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      {isCorrect === false && (
        <div className="animate-bounce rounded-full bg-rose-100 px-6 py-2 text-xl font-bold text-rose-500">
          ¡Inténtalo de nuevo! ❌
        </div>
      )}
    </div>
  );
}
