import { useState } from 'react';
import type { Word } from '../types';
import { splitSyllables, findTonicIndex, getWordType } from '../utils/syllable-parser';

interface AdminPanelProps {
  words: Word[];
  onAddWord: (word: Word) => void;
  onLoadFromFile: () => void;
  onSaveToFile: () => void;
  isLocalFile: boolean;
  onBack: () => void;
}

export function AdminPanel({ 
  words, 
  onAddWord, 
  onLoadFromFile, 
  onSaveToFile, 
  isLocalFile,
  onBack 
}: AdminPanelProps) {
  const [newWord, setNewWord] = useState('');
  const [preview, setPreview] = useState<Word | null>(null);

  const handleWordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.trim();
    setNewWord(val);
    
    if (val.length > 1) {
      const syllables = splitSyllables(val);
      const tonic_index = findTonicIndex(syllables);
      const type = getWordType(syllables, tonic_index);
      setPreview({ word: val, syllables, tonic_index, type });
    } else {
      setPreview(null);
    }
  };

  const handleAdd = () => {
    if (preview) {
      onAddWord(preview);
      setNewWord('');
      setPreview(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <button onClick={onBack} className="text-sky-600 font-bold">← Volver</button>
        <div className="flex gap-2">
          <button 
            onClick={onLoadFromFile}
            className="bg-slate-200 hover:bg-slate-300 px-4 py-2 rounded-lg font-bold transition"
          >
            📂 Cargar JSON
          </button>
          <button 
            onClick={onSaveToFile}
            className="bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-lg font-bold transition"
          >
            💾 Guardar {isLocalFile ? 'Cambios' : 'como JSON'}
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <section className="bg-white p-6 rounded-2xl shadow-lg">
          <h3 className="text-xl font-bold mb-4">Añadir Palabra</h3>
          <div className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Palabra</label>
              <input 
                type="text" 
                value={newWord}
                onChange={handleWordChange}
                placeholder="Ej: relámpago"
                className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-sky-500 outline-none transition"
              />
            </div>

            {preview && (
              <div className="p-4 bg-sky-50 rounded-xl border-2 border-sky-100">
                <p className="text-sm text-sky-600 font-bold mb-2">Previsualización:</p>
                <div className="flex gap-2 mb-2">
                  {preview.syllables.map((s, i) => (
                    <span key={i} className={`px-2 py-1 rounded ${i === preview.tonic_index ? 'bg-sky-500 text-white font-bold' : 'bg-white'}`}>
                      {s}
                    </span>
                  ))}
                </div>
                <p className="text-sm capitalize">Tipo: <strong>{preview.type}</strong></p>
                <button 
                  onClick={handleAdd}
                  className="mt-4 w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2 rounded-lg transition"
                >
                  Confirmar y Añadir
                </button>
              </div>
            )}
          </div>
        </section>

        <section className="bg-white p-6 rounded-2xl shadow-lg">
          <h3 className="text-xl font-bold mb-4">Palabras Actuales ({words.length})</h3>
          <div className="max-h-[400px] overflow-y-auto">
            <table className="w-full">
              <thead className="sticky top-0 bg-white">
                <tr className="text-left border-b">
                  <th className="pb-2">Palabra</th>
                  <th className="pb-2">Tipo</th>
                </tr>
              </thead>
              <tbody>
                {words.slice().reverse().map((w, i) => (
                  <tr key={i} className="border-b last:border-0">
                    <td className="py-2">{w.word}</td>
                    <td className="py-2">
                      <span className={`text-xs font-bold px-2 py-1 rounded uppercase 
                        ${w.type === 'aguda' ? 'bg-blue-100 text-blue-700' : 
                          w.type === 'llana' ? 'bg-green-100 text-green-700' : 
                          'bg-red-100 text-red-700'}`}
                      >
                        {w.type}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
