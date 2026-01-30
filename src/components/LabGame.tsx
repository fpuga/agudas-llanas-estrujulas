import { useState } from 'react';
import type { Word } from '../types';
import {
  playSuccessSound,
  playErrorSound,
  playClickSound,
} from '../utils/sound';

interface LabGameProps {
  words: Word[];
  onFinish: () => void;
}

export function LabGame({ words, onFinish }: LabGameProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    if (currentIndex < words.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      onFinish();
    }
  };

  const currentWord = words[currentIndex];

  if (!currentWord) return null;

  return (
    <SingleLabGame
      key={currentIndex}
      word={currentWord}
      onComplete={handleNext}
      index={currentIndex}
      total={words.length}
    />
  );
}

interface SingleLabGameProps {
  word: Word;
  onComplete: () => void;
  index: number;
  total: number;
}

function SingleLabGame({ word, onComplete, index, total }: SingleLabGameProps) {
  // Initialize shuffled syllables only once when the component mounts (which happens for every new word due to key)
  const [shuffledSyllables] = useState(() =>
    [...word.syllables].sort(() => Math.random() - 0.5)
  );

  const [selectedOrder, setSelectedOrder] = useState<number[]>([]);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSyllableClick = (idx: number) => {
    if (status !== 'idle' || selectedOrder.includes(idx)) return;

    playClickSound();
    const newOrder = [...selectedOrder, idx];
    setSelectedOrder(newOrder);

    if (newOrder.length === word.syllables.length) {
      const formedWord = newOrder.map((i) => shuffledSyllables[i]).join('');
      // Compare ignoring case and accents on the comparison target if needed,
      // but usually we want exact match. The logic before was tolerant:
      if (
        formedWord.toLowerCase() ===
        word.word.toLowerCase().replace(/[^a-záéíóúüñ]/g, '')
      ) {
        playSuccessSound();
        setStatus('success');
        setTimeout(() => {
          onComplete();
        }, 1500);
      } else {
        playErrorSound();
        setStatus('error');
        setTimeout(() => {
          setSelectedOrder([]);
          setStatus('idle');
        }, 1500);
      }
    }
  };

  return (
    <div className="flex flex-col items-center py-8">
      <h3 className="mb-8 text-center text-2xl font-bold text-sky-700">
        ¡Ordena las sílabas para formar la palabra!
      </h3>

      <div className="mb-12 w-full max-w-xl">
        <div className="mb-8 flex min-h-[100px] flex-wrap justify-center gap-4 rounded-3xl border-4 border-dashed border-sky-200 bg-white p-6">
          {selectedOrder.map((idx) => (
            <div
              key={`selected-${idx}`}
              className="flex h-16 w-16 items-center justify-center rounded-xl bg-sky-500 text-xl font-black text-white uppercase shadow-md md:h-20 md:w-20 md:text-2xl"
            >
              {shuffledSyllables[idx]}
            </div>
          ))}
        </div>

        <div className="flex flex-wrap justify-center gap-4">
          {shuffledSyllables.map((syl, idx) => (
            <button
              key={`shuffled-${idx}`}
              onClick={() => handleSyllableClick(idx)}
              disabled={selectedOrder.includes(idx) || status !== 'idle'}
              className={`flex h-16 w-16 items-center justify-center rounded-xl text-xl font-black uppercase shadow-lg transition-all md:h-20 md:w-20 md:text-2xl ${
                selectedOrder.includes(idx)
                  ? 'border-0 bg-gray-100 text-gray-300 opacity-50'
                  : 'border-b-4 border-sky-200 bg-white text-sky-800 hover:bg-sky-50 active:translate-y-1 active:border-b-0'
              } `}
            >
              {syl}
            </button>
          ))}
        </div>
      </div>

      <div className="h-16">
        {status === 'success' && (
          <div className="animate-bounce text-4xl">🏆 ¡Genial! 🏆</div>
        )}
        {status === 'error' && (
          <div className="animate-shake text-2xl font-bold text-rose-500">
            ¡Vuelve a intentarlo!
          </div>
        )}
      </div>

      <p className="mt-8 text-gray-500">
        Palabra {index + 1} de {total}
      </p>
    </div>
  );
}
