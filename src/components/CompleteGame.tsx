import { useState, useEffect } from 'react';
import type { Word, WordType } from '../types';
import { playSuccessSound, playErrorSound, playClickSound } from '../utils/sound';
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
  const initialMode = import.meta.env.VITE_COMPLETE_GAME_MODE === 'input' ? 'input' : 'choice';
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
    setInputMode(import.meta.env.VITE_COMPLETE_GAME_MODE === 'input' ? 'input' : 'choice');

    const correctSyllable = currentWord.syllables[currentWord.tonic_index];
    
    // Get all syllables from all words to use as distractors
    const allSyllables = words.flatMap(w => w.syllables);
    // Filter out the correct one and duplicates, then shuffle
    const uniqueSyllables = [...new Set(allSyllables.filter(s => s !== correctSyllable))];
    const distractors = uniqueSyllables
      .sort(() => Math.random() - 0.5)
      .slice(0, 2); // 2 distractors

    setShuffledOptions([correctSyllable, ...distractors].sort(() => Math.random() - 0.5));
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
      setCurrentIndex(prev => prev + 1);
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
    <div className="flex flex-col items-center gap-8 animate-fade-in">
        {/* Progress Bar */}
        <div className="w-full bg-slate-200 rounded-full h-4 overflow-hidden shadow-inner">
            <div 
            className="bg-emerald-500 h-full transition-all duration-500 ease-out"
            style={{ width: `${((currentIndex) / words.length) * 100}%` }}
            ></div>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-xl border-4 border-emerald-100 w-full text-center">
            {phase === 'SELECT_TONIC' ? (
                <>
                    <h2 className="text-2xl font-bold text-slate-700 mb-8">
                        Completa la palabra con la sílaba tónica:
                    </h2>
                    
                    {/* Word with missing syllable */}
                    <div className="flex justify-center items-center flex-wrap gap-2 mb-12">
                         {currentWord.syllables.map((syl, idx) => (
                             idx === currentWord.tonic_index ? (
                                 <div key={idx} className="w-20 h-20 md:w-28 md:h-28 border-b-8 border-slate-300 flex items-center justify-center bg-slate-50 rounded-2xl animate-pulse">
                                     <span className="text-4xl font-black text-slate-300">?</span>
                                 </div>
                             ) : (
                                 <SyllableBlock key={idx} syllable={syl} disabled={true} />
                             )
                         ))}
                    </div>

                    {/* Input or Options */}
                    {inputMode === 'input' ? (
                      <form onSubmit={handleInputSubmit} className="flex flex-col items-center gap-4">
                        <input
                          type="text"
                          value={inputValue}
                          onChange={(e) => setInputValue(e.target.value)}
                          className={`
                            w-48 text-center text-3xl font-bold p-4 rounded-xl border-4 outline-none transition
                            ${isCorrect === false 
                              ? 'border-rose-500 bg-rose-50 text-rose-700' 
                              : isCorrect === true
                                ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                                : 'border-sky-200 focus:border-sky-400 text-slate-700'
                            }
                          `}
                          placeholder="..."
                          autoFocus
                        />
                        <button 
                          type="submit"
                          className="bg-sky-500 text-white px-8 py-3 rounded-xl font-bold text-xl shadow hover:bg-sky-600 transition active:scale-95"
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
                                  className={`
                                      px-8 py-4 rounded-2xl text-2xl font-bold transition transform hover:scale-105 active:scale-95 shadow-lg border-b-4
                                      ${selectedOption === opt 
                                          ? (isCorrect === false ? 'bg-rose-500 border-rose-700 text-white' : 'bg-emerald-500 border-emerald-700 text-white')
                                          : 'bg-white border-slate-200 text-slate-700 hover:border-emerald-300'
                                      }
                                  `}
                              >
                                  {opt}
                              </button>
                          ))}
                      </div>
                    )}
                </>
            ) : (
                 <>
                    <h2 className="text-2xl font-bold text-slate-700 mb-8">
                        ¿Qué tipo de palabra es?
                    </h2>
                    
                    {/* Completed Word */}
                    <div className="flex justify-center items-center flex-wrap gap-2 mb-12">
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
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
                        {(['aguda', 'llana', 'esdrujula'] as const).map((type) => (
                            <button
                                key={type}
                                onClick={() => handleTypeSelect(type)}
                                className={`
                                    p-6 rounded-2xl text-xl font-bold uppercase tracking-wider transition transform hover:scale-105 active:scale-95 shadow-md border-b-4
                                    ${selectedType === type
                                        ? (isCorrect === false ? 'bg-rose-500 border-rose-700 text-white' : 'bg-emerald-500 border-emerald-700 text-white')
                                        : (type === 'aguda' ? 'bg-blue-100 border-blue-300 text-blue-800 hover:bg-blue-200' :
                                           type === 'llana' ? 'bg-green-100 border-green-300 text-green-800 hover:bg-green-200' :
                                           'bg-red-100 border-red-300 text-red-800 hover:bg-red-200')
                                    }
                                `}
                            >
                                {type === 'esdrujula' ? 'Esdrújula' : type}
                            </button>
                        ))}
                    </div>
                 </>
            )}
        </div>
        
        {isCorrect === false && (
            <div className="animate-bounce text-xl font-bold text-rose-500 bg-rose-100 px-6 py-2 rounded-full">
                ¡Inténtalo de nuevo! ❌
            </div>
        )}
    </div>
  );
}
