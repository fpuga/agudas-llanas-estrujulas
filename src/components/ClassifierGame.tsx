import { useState } from 'react';
import type { Word, WordType } from '../types';
import { playSuccessSound, playErrorSound } from '../utils/sound';

interface ClassifierGameProps {
  words: Word[];
  onFinish: () => void;
}

export function ClassifierGame({ words, onFinish }: ClassifierGameProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [selectedType, setSelectedType] = useState<WordType | null>(null);

  const currentWord = words[currentIndex];

  const handleTypeClick = (type: WordType) => {
    if (status !== 'idle') return;

    setSelectedType(type);
    if (type === currentWord.type) {
      playSuccessSound();
      setStatus('success');
      setTimeout(() => {
        if (currentIndex < words.length - 1) {
          setCurrentIndex((prev) => prev + 1);
          setSelectedType(null);
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
        setSelectedType(null);
      }, 1000);
    }
  };

  if (!currentWord) return null;

  const typeButtons: {
    type: WordType;
    label: string;
    color: string;
    bgColor: string;
  }[] = [
    {
      type: 'aguda',
      label: 'Aguda',
      color: 'border-aguda text-aguda',
      bgColor: 'bg-blue-50',
    },
    {
      type: 'llana',
      label: 'Llana',
      color: 'border-llana text-llana',
      bgColor: 'bg-green-50',
    },
    {
      type: 'esdrujula',
      label: 'Esdrújula',
      color: 'border-esdrujula text-esdrujula',
      bgColor: 'bg-red-50',
    },
  ];

  return (
    <div className="flex flex-col items-center py-8">
      <h3 className="mb-8 text-center text-2xl font-bold text-sky-700">
        ¿Qué tipo de palabra es?
      </h3>

      <div className="mb-12">
        <div className="mb-4 transform rounded-3xl border-4 border-sky-100 bg-white px-12 py-8 shadow-2xl transition hover:scale-105">
          <span className="text-5xl font-black tracking-wider text-gray-800 uppercase md:text-7xl">
            {currentWord.word}
          </span>
        </div>
        <p className="text-center text-gray-500">
          Palabra {currentIndex + 1} de {words.length}
        </p>
      </div>

      <div className="grid w-full max-w-2xl grid-cols-1 gap-6 sm:grid-cols-3">
        {typeButtons.map((btn) => (
          <button
            key={btn.type}
            onClick={() => handleTypeClick(btn.type)}
            disabled={status !== 'idle'}
            className={` ${btn.bgColor} ${btn.color} rounded-2xl border-4 border-b-8 p-6 text-2xl font-bold transition-all ${status === 'idle' ? 'hover:-translate-y-1 hover:border-b-12' : ''} ${selectedType === btn.type && status === 'success' ? 'border-emerald-600! bg-emerald-500! text-white!' : ''} ${selectedType === btn.type && status === 'error' ? 'border-rose-600! bg-rose-500! text-white!' : ''} active:translate-y-1 active:border-b-4 disabled:opacity-80`}
          >
            {btn.label}
          </button>
        ))}
      </div>

      <div className="mt-12 flex h-16 items-center justify-center">
        {status === 'success' && (
          <div className="animate-bounce text-4xl font-bold text-emerald-600">
            ✨ ¡Correcto! ✨
          </div>
        )}
        {status === 'error' && (
          <div className="animate-pulse text-2xl font-bold text-rose-500">
            Ups... ¡Prueba otra vez!
          </div>
        )}
      </div>
    </div>
  );
}
