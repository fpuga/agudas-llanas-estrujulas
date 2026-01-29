import { useState } from 'react';
import type { Word } from '../types';

interface PrintLayoutProps {
  words: Word[];
  onBack: () => void;
  userName?: string;
}

type ExerciseType = 'syllables' | 'classify' | 'complete' | 'arrows' | 'sentence';

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
    year: 'numeric' 
  });

  const handleOptionChange = (key: ExerciseType) => {
    setOptions(prev => ({
      ...prev,
      exercises: { ...prev.exercises, [key]: !prev.exercises[key] }
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
      <div className="bg-white min-h-screen p-8 max-w-2xl mx-auto">
        <button onClick={onBack} className="text-sky-600 font-bold mb-6">← Volver</button>
        
        <h1 className="text-3xl font-black text-slate-800 mb-8">Configurar Fichas</h1>
        
        <div className="bg-slate-50 p-6 rounded-2xl shadow-sm border border-slate-200 mb-8">
          <h2 className="text-xl font-bold mb-4 text-slate-700">1. Selecciona los ejercicios</h2>
          <div className="space-y-3">
            <label className="flex items-center gap-3 p-3 bg-white rounded-lg border border-slate-200 cursor-pointer hover:border-sky-400 transition">
              <input 
                type="checkbox" 
                checked={options.exercises.syllables}
                onChange={() => handleOptionChange('syllables')}
                className="w-5 h-5 text-sky-600 rounded"
              />
              <span className="font-medium">Separa en sílabas y rodea la tónica</span>
            </label>
            <label className="flex items-center gap-3 p-3 bg-white rounded-lg border border-slate-200 cursor-pointer hover:border-sky-400 transition">
              <input 
                type="checkbox" 
                checked={options.exercises.classify}
                onChange={() => handleOptionChange('classify')}
                className="w-5 h-5 text-sky-600 rounded"
              />
              <span className="font-medium">Clasifica en tabla (Agudas, Llanas, Esdrújulas)</span>
            </label>
            <label className="flex items-center gap-3 p-3 bg-white rounded-lg border border-slate-200 cursor-pointer hover:border-sky-400 transition">
              <input 
                type="checkbox" 
                checked={options.exercises.complete}
                onChange={() => handleOptionChange('complete')}
                className="w-5 h-5 text-sky-600 rounded"
              />
              <span className="font-medium">Completa la tónica y clasifica (Nuevo)</span>
            </label>
            <label className="flex items-center gap-3 p-3 bg-white rounded-lg border border-slate-200 cursor-pointer hover:border-sky-400 transition">
              <input 
                type="checkbox" 
                checked={options.exercises.arrows}
                onChange={() => handleOptionChange('arrows')}
                className="w-5 h-5 text-sky-600 rounded"
              />
              <span className="font-medium">Une con flechas</span>
            </label>
            <label className="flex items-center gap-3 p-3 bg-white rounded-lg border border-slate-200 cursor-pointer hover:border-sky-400 transition">
              <input 
                type="checkbox" 
                checked={options.exercises.sentence}
                onChange={() => handleOptionChange('sentence')}
                className="w-5 h-5 text-sky-600 rounded"
              />
              <span className="font-medium">Escribe una oración</span>
            </label>
          </div>

          <h2 className="text-xl font-bold mt-8 mb-4 text-slate-700">2. Opciones de impresión</h2>
          <div className="flex items-center gap-4">
            <label className="font-medium">Número de páginas:</label>
            <input 
              type="number" 
              min="1" 
              max="20"
              value={options.pageCount}
              onChange={(e) => setOptions(prev => ({ ...prev, pageCount: parseInt(e.target.value) || 1 }))}
              className="w-20 p-2 border-2 border-slate-200 rounded-lg text-center font-bold"
            />
          </div>
        </div>

        <button 
          onClick={generatePages}
          className="w-full bg-sky-600 text-white py-4 rounded-xl font-black text-xl hover:bg-sky-700 transition shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
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
    <div className="bg-slate-100 min-h-screen">
      {/* UI Controls - Hidden when printing */}
      <div className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-10 print:hidden">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex gap-4">
            <button onClick={onBack} className="text-slate-500 font-bold hover:text-slate-800">← Salir</button>
            <button onClick={() => setIsGenerated(false)} className="text-sky-600 font-bold hover:text-sky-800">↺ Configurar</button>
          </div>
          <button 
            onClick={() => window.print()}
            className="bg-sky-600 text-white px-6 py-2 rounded-full font-bold hover:bg-sky-700 transition shadow-md flex items-center gap-2"
          >
            <span>🖨️</span> Imprimir {options.pageCount} página(s)
          </button>
        </div>
      </div>

      <div className="print:p-0 p-8 max-w-[210mm] mx-auto space-y-8">
        {pagesData.map((pageWords, pageIndex) => (
          <div 
            key={pageIndex} 
            className="bg-white shadow-xl print:shadow-none p-12 min-h-[297mm] relative print:break-after-page last:print:break-after-auto"
          >
            {/* Header */}
            <header className="flex justify-between items-end border-b-2 border-black pb-4 mb-8">
              <div>
                <h1 className="text-3xl font-black uppercase tracking-tight">Ficha de Lengua</h1>
                <p className="text-lg text-gray-600">Agudas, Llanas y Esdrújulas</p>
              </div>
              <div className="text-right">
                <p className="border-b border-black w-48 mb-2 text-left text-sm text-gray-400 pl-1">
                  Nombre: <span className="text-black text-lg font-bold ml-2">{userName}</span>
                </p>
                <p className="text-sm">Fecha: {today} • Pág. {pageIndex + 1}/{options.pageCount}</p>
              </div>
            </header>

            {/* Exercises */}
            <div className="space-y-8">
              
              {options.exercises.syllables && (
                <section>
                  <h2 className="text-xl font-bold mb-4">
                    {activeExercises.indexOf('syllables') + 1}. Separa en sílabas y rodea la tónica:
                  </h2>
                  <div className="grid grid-cols-2 gap-y-6 gap-x-12">
                    {pageWords.slice(0, 6).map((w, idx) => (
                      <div key={idx} className="flex items-end gap-3">
                        <span className="text-sm font-bold text-slate-400">{idx + 1}.</span>
                        <span className="font-medium w-28 pb-1">{w.word}</span>
                        <div className="flex-1 border-b-2 border-dotted border-slate-300 h-6"></div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {options.exercises.classify && (
                <section>
                  <h2 className="text-xl font-bold mb-4">
                    {activeExercises.indexOf('classify') + 1}. Clasifica las siguientes palabras:
                  </h2>
                  <div className="mb-4 p-3 bg-slate-50 border border-slate-200 rounded text-center text-sm font-medium tracking-wide">
                     {pageWords.slice(6, 12).length > 0 
                       ? pageWords.slice(6, 12).map(w => w.word).join(' • ')
                       : pageWords.slice(0, 6).map(w => w.word).join(' • ')
                     }
                  </div>
                  <table className="w-full border-collapse border-2 border-black">
                    <thead>
                      <tr>
                        <th className="border-2 border-black p-2 w-1/3 uppercase bg-slate-100 print:bg-transparent">Agudas</th>
                        <th className="border-2 border-black p-2 w-1/3 uppercase bg-slate-100 print:bg-transparent">Llanas</th>
                        <th className="border-2 border-black p-2 w-1/3 uppercase bg-slate-100 print:bg-transparent">Esdrújulas</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[1, 2, 3, 4].map(i => (
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
                  <h2 className="text-xl font-bold mb-4">
                    {activeExercises.indexOf('complete') + 1}. Completa con la sílaba tónica y clasifica:
                  </h2>
                  <div className="grid grid-cols-2 gap-y-6 gap-x-8">
                     {/* Use words 12 to 18 (6 words) */}
                     {pageWords.slice(12, 18).map((w, idx) => (
                      <div key={idx} className="flex items-end gap-2 text-lg">
                        <div className="w-32 font-medium text-right font-mono tracking-tighter">
                          {formatMissingTonic(w)}
                        </div>
                        <span className="font-bold">→</span>
                        <div className="flex-1 border-b-2 border-dotted border-slate-400 h-6"></div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {options.exercises.arrows && (
                <section>
                  <h2 className="text-xl font-bold mb-4">
                    {activeExercises.indexOf('arrows') + 1}. Une cada palabra con su tipo:
                  </h2>
                  <div className="flex justify-between items-center px-8">
                    <div className="flex flex-col gap-5 w-1/3">
                      {/* Use words 18 to 23 (5 words) */}
                      {pageWords.slice(18, 23).map((w, i) => (
                        <div key={i} className="text-right pr-4 py-1 font-medium relative">
                          {w.word}
                          <span className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-black rounded-full"></span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex flex-col gap-6 w-1/3 items-center">
                      {['Aguda', 'Llana', 'Esdrújula'].map((type, i) => (
                        <div key={i} className="border-2 border-black px-6 py-2 rounded-lg relative w-full text-center font-bold">
                          <span className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-black rounded-full -ml-1.5"></span>
                          {type}
                        </div>
                      ))}
                    </div>
                  </div>
                </section>
              )}

              {options.exercises.sentence && (
                <section>
                  <h2 className="text-xl font-bold mb-4">
                    {activeExercises.indexOf('sentence') + 1}. Escribe una oración con una palabra esdrújula:
                  </h2>
                  <div className="border-b border-black h-8 mb-4"></div>
                  <div className="border-b border-black h-8"></div>
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