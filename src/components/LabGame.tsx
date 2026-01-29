import { useState, useEffect } from 'react';
import type { Word } from '../types';
import { playSuccessSound, playErrorSound, playClickSound } from '../utils/sound';

interface LabGameProps {
  words: Word[];
  onFinish: () => void;
}

export function LabGame({ words, onFinish }: LabGameProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [shuffledSyllables, setShuffledSyllables] = useState<string[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<number[]>([]);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const currentWord = words[currentIndex];

  useEffect(() => {
    if (currentWord) {
      const shuffled = [...currentWord.syllables].sort(() => Math.random() - 0.5);
      setShuffledSyllables(shuffled);
      setSelectedOrder([]);
      setStatus('idle');
    }
  }, [currentIndex, currentWord]);

  const handleSyllableClick = (index: number) => {
    if (status !== 'idle' || selectedOrder.includes(index)) return;
    
    playClickSound();
    const newOrder = [...selectedOrder, index];
    setSelectedOrder(newOrder);

    if (newOrder.length === currentWord.syllables.length) {
      const formedWord = newOrder.map(idx => shuffledSyllables[idx]).join('');
      if (formedWord.toLowerCase() === currentWord.word.toLowerCase().replace(/[^a-záéíóúüñ]/g, '')) {
        playSuccessSound();
        setStatus('success');
        setTimeout(() => {
          if (currentIndex < words.length - 1) {
            setCurrentIndex(prev => prev + 1);
          } else {
            onFinish();
          }
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

  if (!currentWord) return null;

  return (
    <div className="flex flex-col items-center py-8">
      <h3 className="text-2xl font-bold text-sky-700 mb-8 text-center">
        ¡Ordena las sílabas para formar la palabra!
      </h3>
      
      <div className="mb-12 w-full max-w-xl">
        <div className="flex flex-wrap justify-center gap-4 min-h-[100px] p-6 bg-white rounded-3xl border-4 border-dashed border-sky-200 mb-8">
          {selectedOrder.map((idx) => (
            <div key={`selected-${idx}`} className="bg-sky-500 text-white w-16 h-16 md:w-20 md:h-20 rounded-xl flex items-center justify-center text-xl md:text-2xl font-black uppercase shadow-md">
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
              className={`
                w-16 h-16 md:w-20 md:h-20 rounded-xl flex items-center justify-center
                text-xl md:text-2xl font-black uppercase shadow-lg transition-all
                ${selectedOrder.includes(idx) 
                  ? 'bg-gray-100 text-gray-300 border-0 opacity-50' 
                  : 'bg-white text-sky-800 border-b-4 border-sky-200 active:border-b-0 active:translate-y-1 hover:bg-sky-50'}
              `}
            >
              {syl}
            </button>
          ))}
        </div>
      </div>

      <div className="h-16">
        {status === 'success' && <div className="animate-bounce text-4xl">🏆 ¡Genial! 🏆</div>}
        {status === 'error' && <div className="animate-shake text-2xl text-rose-500 font-bold">¡Vuelve a intentarlo!</div>}
      </div>
      
      <p className="mt-8 text-gray-500">Palabra {currentIndex + 1} de {words.length}</p>
    </div>
  );
}
