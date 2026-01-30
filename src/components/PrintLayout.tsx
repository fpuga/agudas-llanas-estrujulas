import { useState } from 'react';
import type { Word } from '../types';

interface PrintLayoutProps {
  words: Word[];
  onBack: () => void;
  userName?: string;
}

type ExerciseType =
  | 'syllables'
  | 'classify'
  | 'complete'
  | 'arrows'
  | 'sentence';

interface PrintOptions {
  pageCount: number;
  exercises: Record<ExerciseType, boolean>;
}

export function PrintLayout({ words, onBack, userName }: PrintLayoutProps) {
  const [options, setOptions] = useState<PrintOptions>({
    pageCount: 1,
    exercises: {
      syllables: true,
      classify: true,
      complete: true, // New exercise enabled by default
      arrows: true,
      sentence: true,
    },
  });
  const [isGenerated, setIsGenerated] = useState(false);
  const [pagesData, setPagesData] = useState<Word[][]>([]);

  // Generate unique sets of words for each page when options change or generation is triggered
  const generatePages = () => {
    const newPages: Word[][] = [];
    for (let i = 0; i < options.pageCount; i++) {
      // Shuffle and pick words. We need:
      // 6 for syllables
      // 6 for classify
      // 6 for complete (New)
      // 5 for arrows
      // Total: 23 words. If we don't have enough unique words, we might repeat or overlap,
      // but let's assume we have enough or just slice safely.
      const pageWords = [...words].sort(() => Math.random() - 0.5).slice(0, 23);
      newPages.push(pageWords);
    }
    setPagesData(newPages);
    setIsGenerated(true);
  };

  const today = new Date().toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const handleOptionChange = (key: ExerciseType) => {
    setOptions((prev) => ({
      ...prev,
      exercises: { ...prev.exercises, [key]: !prev.exercises[key] },
    }));
  };

  // Helper to format word with missing tonic syllable
  const formatMissingTonic = (word: Word) => {
    const syllables = [...word.syllables];
    // Replace tonic syllable with '___' or '...'
    syllables[word.tonic_index] = '.......';
    return syllables.join('');
  };

  if (!isGenerated) {
    return (
      <div className="mx-auto min-h-screen max-w-2xl bg-white p-8">
        <button onClick={onBack} className="mb-6 font-bold text-sky-600">
          ← Volver
        </button>

        <h1 className="mb-8 text-3xl font-black text-slate-800">
          Configurar Fichas
        </h1>

        <div className="mb-8 rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-bold text-slate-700">
            1. Selecciona los ejercicios
          </h2>
          <div className="space-y-3">
            <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-slate-200 bg-white p-3 transition hover:border-sky-400">
              <input
                type="checkbox"
                checked={options.exercises.syllables}
                onChange={() => handleOptionChange('syllables')}
                className="h-5 w-5 rounded text-sky-600"
              />
              <span className="font-medium">
                Separa en sílabas y rodea la tónica
              </span>
            </label>
            <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-slate-200 bg-white p-3 transition hover:border-sky-400">
              <input
                type="checkbox"
                checked={options.exercises.classify}
                onChange={() => handleOptionChange('classify')}
                className="h-5 w-5 rounded text-sky-600"
              />
              <span className="font-medium">
                Clasifica en tabla (Agudas, Llanas, Esdrújulas)
              </span>
            </label>
            <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-slate-200 bg-white p-3 transition hover:border-sky-400">
              <input
                type="checkbox"
                checked={options.exercises.complete}
                onChange={() => handleOptionChange('complete')}
                className="h-5 w-5 rounded text-sky-600"
              />
              <span className="font-medium">
                Completa la tónica y clasifica (Nuevo)
              </span>
            </label>
            <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-slate-200 bg-white p-3 transition hover:border-sky-400">
              <input
                type="checkbox"
                checked={options.exercises.arrows}
                onChange={() => handleOptionChange('arrows')}
                className="h-5 w-5 rounded text-sky-600"
              />
              <span className="font-medium">Une con flechas</span>
            </label>
            <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-slate-200 bg-white p-3 transition hover:border-sky-400">
              <input
                type="checkbox"
                checked={options.exercises.sentence}
                onChange={() => handleOptionChange('sentence')}
                className="h-5 w-5 rounded text-sky-600"
              />
              <span className="font-medium">Escribe una oración</span>
            </label>
          </div>

          <h2 className="mt-8 mb-4 text-xl font-bold text-slate-700">
            2. Opciones de impresión
          </h2>
          <div className="flex items-center gap-4">
            <label className="font-medium">Número de páginas:</label>
            <input
              type="number"
              min="1"
              max="20"
              value={options.pageCount}
              onChange={(e) =>
                setOptions((prev) => ({
                  ...prev,
                  pageCount: parseInt(e.target.value) || 1,
                }))
              }
              className="w-20 rounded-lg border-2 border-slate-200 p-2 text-center font-bold"
            />
          </div>
        </div>

        <button
          onClick={generatePages}
          className="w-full transform rounded-xl bg-sky-600 py-4 text-xl font-black text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-sky-700 hover:shadow-xl"
        >
          Generar Fichas PDF ✨
        </button>
      </div>
    );
  }

  // --- PREVIEW / PRINT MODE ---

  // Identify active exercises to number them dynamically
  const activeExercises = [
    options.exercises.syllables && 'syllables',
    options.exercises.classify && 'classify',
    options.exercises.complete && 'complete',
    options.exercises.arrows && 'arrows',
    options.exercises.sentence && 'sentence',
  ].filter(Boolean) as ExerciseType[];

  return (
    <div className="min-h-screen bg-slate-100">
      {/* UI Controls - Hidden when printing */}
      <div className="sticky top-0 z-10 border-b border-slate-200 bg-white shadow-sm print:hidden">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
          <div className="flex gap-4">
            <button
              onClick={onBack}
              className="font-bold text-slate-500 hover:text-slate-800"
            >
              ← Salir
            </button>
            <button
              onClick={() => setIsGenerated(false)}
              className="font-bold text-sky-600 hover:text-sky-800"
            >
              ↺ Configurar
            </button>
          </div>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 rounded-full bg-sky-600 px-6 py-2 font-bold text-white shadow-md transition hover:bg-sky-700"
          >
            <span>🖨️</span> Imprimir {options.pageCount} página(s)
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-[210mm] space-y-8 p-8 print:p-0">
        {pagesData.map((pageWords, pageIndex) => (
          <div
            key={pageIndex}
            className="relative min-h-[297mm] bg-white p-12 shadow-xl print:break-after-page print:shadow-none last:print:break-after-auto"
          >
            {/* Header */}
            <header className="mb-8 flex items-end justify-between border-b-2 border-black pb-4">
              <div>
                <h1 className="text-3xl font-black tracking-tight uppercase">
                  Ficha de Lengua
                </h1>
                <p className="text-lg text-gray-600">
                  Agudas, Llanas y Esdrújulas
                </p>
              </div>
              <div className="text-right">
                <p className="mb-2 w-48 border-b border-black pl-1 text-left text-sm text-gray-400">
                  Nombre:{' '}
                  <span className="ml-2 text-lg font-bold text-black">
                    {userName}
                  </span>
                </p>
                <p className="text-sm">
                  Fecha: {today} • Pág. {pageIndex + 1}/{options.pageCount}
                </p>
              </div>
            </header>

            {/* Exercises */}
            <div className="space-y-8">
              {options.exercises.syllables && (
                <section>
                  <h2 className="mb-4 text-xl font-bold">
                    {activeExercises.indexOf('syllables') + 1}. Separa en
                    sílabas y rodea la tónica:
                  </h2>
                  <div className="grid grid-cols-2 gap-x-12 gap-y-6">
                    {pageWords.slice(0, 6).map((w, idx) => (
                      <div key={idx} className="flex items-end gap-3">
                        <span className="text-sm font-bold text-slate-400">
                          {idx + 1}.
                        </span>
                        <span className="w-28 pb-1 font-medium">{w.word}</span>
                        <div className="h-6 flex-1 border-b-2 border-dotted border-slate-300"></div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {options.exercises.classify && (
                <section>
                  <h2 className="mb-4 text-xl font-bold">
                    {activeExercises.indexOf('classify') + 1}. Clasifica las
                    siguientes palabras:
                  </h2>
                  <div className="mb-4 rounded border border-slate-200 bg-slate-50 p-3 text-center text-sm font-medium tracking-wide">
                    {pageWords.slice(6, 12).length > 0
                      ? pageWords
                          .slice(6, 12)
                          .map((w) => w.word)
                          .join(' • ')
                      : pageWords
                          .slice(0, 6)
                          .map((w) => w.word)
                          .join(' • ')}
                  </div>
                  <table className="w-full border-collapse border-2 border-black">
                    <thead>
                      <tr>
                        <th className="w-1/3 border-2 border-black bg-slate-100 p-2 uppercase print:bg-transparent">
                          Agudas
                        </th>
                        <th className="w-1/3 border-2 border-black bg-slate-100 p-2 uppercase print:bg-transparent">
                          Llanas
                        </th>
                        <th className="w-1/3 border-2 border-black bg-slate-100 p-2 uppercase print:bg-transparent">
                          Esdrújulas
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {[1, 2, 3, 4].map((i) => (
                        <tr key={i} className="h-10">
                          <td className="border-2 border-black"></td>
                          <td className="border-2 border-black"></td>
                          <td className="border-2 border-black"></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </section>
              )}

              {options.exercises.complete && (
                <section>
                  <h2 className="mb-4 text-xl font-bold">
                    {activeExercises.indexOf('complete') + 1}. Completa con la
                    sílaba tónica y clasifica:
                  </h2>
                  <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                    {/* Use words 12 to 18 (6 words) */}
                    {pageWords.slice(12, 18).map((w, idx) => (
                      <div key={idx} className="flex items-end gap-2 text-lg">
                        <div className="w-32 text-right font-mono font-medium tracking-tighter">
                          {formatMissingTonic(w)}
                        </div>
                        <span className="font-bold">→</span>
                        <div className="h-6 flex-1 border-b-2 border-dotted border-slate-400"></div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {options.exercises.arrows && (
                <section>
                  <h2 className="mb-4 text-xl font-bold">
                    {activeExercises.indexOf('arrows') + 1}. Une cada palabra
                    con su tipo:
                  </h2>
                  <div className="flex items-center justify-between px-8">
                    <div className="flex w-1/3 flex-col gap-5">
                      {/* Use words 18 to 23 (5 words) */}
                      {pageWords.slice(18, 23).map((w, i) => (
                        <div
                          key={i}
                          className="relative py-1 pr-4 text-right font-medium"
                        >
                          {w.word}
                          <span className="absolute top-1/2 right-0 h-2 w-2 -translate-y-1/2 rounded-full bg-black"></span>
                        </div>
                      ))}
                    </div>

                    <div className="flex w-1/3 flex-col items-center gap-6">
                      {['Aguda', 'Llana', 'Esdrújula'].map((type, i) => (
                        <div
                          key={i}
                          className="relative w-full rounded-lg border-2 border-black px-6 py-2 text-center font-bold"
                        >
                          <span className="absolute top-1/2 left-0 -ml-1.5 h-2 w-2 -translate-y-1/2 rounded-full bg-black"></span>
                          {type}
                        </div>
                      ))}
                    </div>
                  </div>
                </section>
              )}

              {options.exercises.sentence && (
                <section>
                  <h2 className="mb-4 text-xl font-bold">
                    {activeExercises.indexOf('sentence') + 1}. Escribe una
                    oración con una palabra esdrújula:
                  </h2>
                  <div className="mb-4 h-8 border-b border-black"></div>
                  <div className="h-8 border-b border-black"></div>
                </section>
              )}
            </div>

            <footer className="absolute bottom-12 left-0 w-full text-center text-xs text-gray-400">
              Generado con el Entrenador de Palabras
            </footer>
          </div>
        ))}
      </div>

      <style>{`
        @media print {
          @page { margin: 0; }
          body { background: white; }
        }
      `}</style>
    </div>
  );
}
