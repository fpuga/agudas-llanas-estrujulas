import { useState } from 'react';
import type { Word } from '../types';
import { SyllableBlock } from './SyllableBlock';
import { playSuccessSound, playErrorSound } from '../utils/sound';

interface DetectiveGameProps {
  words: Word[];
  onFinish: () => void;
}

export function DetectiveGame({ words, onFinish }: DetectiveGameProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedSyllable, setSelectedSyllable] = useState<number | null>(null);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const currentWord = words[currentIndex];

  const handleSyllableClick = (index: number) => {
    if (status !== 'idle') return;

    setSelectedSyllable(index);
    if (index === currentWord.tonic_index) {
      playSuccessSound();
      setStatus('success');
      setTimeout(() => {
        if (currentIndex < words.length - 1) {
          setCurrentIndex((prev) => prev + 1);
          setSelectedSyllable(null);
          setStatus('idle');
        } else {
          onFinish();
        }
      }, 1500);
    } else {
      playErrorSound();
      setStatus('error');
      setTimeout(() => {
        setStatus('idle');
        setSelectedSyllable(null);
      }, 1000);
    }
  };

  if (!currentWord) return null;

  return (
    <div className="flex flex-col items-center py-8">
      <h3 className="mb-4 text-center text-2xl font-bold text-sky-700">
        ¿Cuál es la sílaba tónica?
      </h3>

      <div className="mb-12">
        <p className="mb-4 text-center text-gray-500">
          Palabra {currentIndex + 1} de {words.length}
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          {currentWord.syllables.map((syl, idx) => (
            <SyllableBlock
              key={`${currentWord.word}-${idx}`}
              syllable={syl}
              isSelected={selectedSyllable === idx}
              isCorrect={
                status === 'success' && idx === currentWord.tonic_index
              }
              isWrong={status === 'error' && selectedSyllable === idx}
              onClick={() => handleSyllableClick(idx)}
              disabled={status !== 'idle'}
            />
          ))}
        </div>
      </div>

      {status === 'success' && (
        <div className="animate-bounce text-4xl">🌟 ¡Muy bien! 🌟</div>
      )}

      {status === 'error' && (
        <div className="animate-pulse text-2xl font-bold text-rose-500">
          ¡Casi! Inténtalo de nuevo.
        </div>
      )}
    </div>
  );
}
