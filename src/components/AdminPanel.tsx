import { useState } from 'react';
import type { Word } from '../types';
import {
  splitSyllables,
  findTonicIndex,
  getWordType,
} from '../utils/syllable-parser';

interface AdminPanelProps {
  words: Word[];
  onAddWord: (word: Word) => void;
  onLoadFromFile: () => void;
  onSaveToFile: () => void;
  isLocalFile: boolean;
  onBack: () => void;
  // Settings
  currentUserName: string;
  currentRounds: number;
  onUpdateSettings: (name: string, rounds: number) => void;
}

export function AdminPanel({
  words,
  onAddWord,
  onLoadFromFile,
  onSaveToFile,
  isLocalFile,
  onBack,
  currentUserName,
  currentRounds,
  onUpdateSettings,
}: AdminPanelProps) {
  const [newWord, setNewWord] = useState('');
  const [preview, setPreview] = useState<Word | null>(null);

  // Settings local state
  const [tempName, setTempName] = useState(currentUserName);
  const [tempRounds, setTempRounds] = useState(currentRounds);

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

  const handleSaveSettings = () => {
    onUpdateSettings(tempName, tempRounds);
    // Optional: Show a toast or feedback
  };

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-8 flex items-center justify-between">
        <button onClick={onBack} className="font-bold text-sky-600">
          ← Volver
        </button>
        <div className="flex gap-2">
          <button
            onClick={onLoadFromFile}
            className="rounded-lg bg-slate-200 px-4 py-2 font-bold transition hover:bg-slate-300"
          >
            📂 Cargar JSON
          </button>
          <button
            onClick={onSaveToFile}
            className="rounded-lg bg-sky-600 px-4 py-2 font-bold text-white transition hover:bg-sky-700"
          >
            💾 Guardar {isLocalFile ? 'Cambios' : 'como JSON'}
          </button>
        </div>
      </div>

      <div className="mb-8 rounded-2xl bg-amber-50 p-6 shadow-lg">
        <h3 className="mb-4 text-xl font-bold text-amber-800">
          ⚙️ Configuración del Juego
        </h3>
        <div className="flex flex-col gap-4 md:flex-row md:items-end">
          <div className="flex-1">
            <label className="mb-1 block text-sm font-medium text-amber-900">
              Nombre del Jugador
            </label>
            <input
              type="text"
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
              placeholder="Tu nombre"
              className="w-full rounded-xl border-2 border-amber-200 bg-white p-3 outline-none focus:border-amber-500"
            />
          </div>
          <div className="flex-1">
            <label className="mb-1 block text-sm font-medium text-amber-900">
              Rondas por Partida (Aleatorio)
            </label>
            <input
              type="number"
              min="1"
              max="50"
              value={tempRounds}
              onChange={(e) => setTempRounds(parseInt(e.target.value) || 1)}
              className="w-full rounded-xl border-2 border-amber-200 bg-white p-3 outline-none focus:border-amber-500"
            />
          </div>
          <button
            onClick={handleSaveSettings}
            className="h-[52px] rounded-xl bg-amber-500 px-6 font-bold text-white transition hover:bg-amber-600"
          >
            Guardar Configuración
          </button>
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <section className="rounded-2xl bg-white p-6 shadow-lg">
          <h3 className="mb-4 text-xl font-bold">Añadir Palabra</h3>
          <div className="flex flex-col gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Palabra
              </label>
              <input
                type="text"
                value={newWord}
                onChange={handleWordChange}
                placeholder="Ej: relámpago"
                className="w-full rounded-xl border-2 border-gray-200 p-3 transition outline-none focus:border-sky-500"
              />
            </div>

            {preview && (
              <div className="rounded-xl border-2 border-sky-100 bg-sky-50 p-4">
                <p className="mb-2 text-sm font-bold text-sky-600">
                  Previsualización:
                </p>
                <div className="mb-2 flex gap-2">
                  {preview.syllables.map((s, i) => (
                    <span
                      key={i}
                      className={`rounded px-2 py-1 ${i === preview.tonic_index ? 'bg-sky-500 font-bold text-white' : 'bg-white'}`}
                    >
                      {s}
                    </span>
                  ))}
                </div>
                <p className="text-sm capitalize">
                  Tipo: <strong>{preview.type}</strong>
                </p>
                <button
                  onClick={handleAdd}
                  className="mt-4 w-full rounded-lg bg-emerald-500 py-2 font-bold text-white transition hover:bg-emerald-600"
                >
                  Confirmar y Añadir
                </button>
              </div>
            )}
          </div>
        </section>

        <section className="rounded-2xl bg-white p-6 shadow-lg">
          <h3 className="mb-4 text-xl font-bold">
            Palabras Actuales ({words.length})
          </h3>
          <div className="max-h-[400px] overflow-y-auto">
            <table className="w-full">
              <thead className="sticky top-0 bg-white">
                <tr className="border-b text-left">
                  <th className="pb-2">Palabra</th>
                  <th className="pb-2">Tipo</th>
                </tr>
              </thead>
              <tbody>
                {words
                  .slice()
                  .reverse()
                  .map((w, i) => (
                    <tr key={i} className="border-b last:border-0">
                      <td className="py-2">{w.word}</td>
                      <td className="py-2">
                        <span
                          className={`rounded px-2 py-1 text-xs font-bold uppercase ${
                            w.type === 'aguda'
                              ? 'bg-blue-100 text-blue-700'
                              : w.type === 'llana'
                                ? 'bg-green-100 text-green-700'
                                : 'bg-red-100 text-red-700'
                          }`}
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
