import { useState, useEffect } from 'react';
import type { AppView } from './types';
import { useWordStore } from './hooks/useWordStore';
import { DetectiveGame } from './components/DetectiveGame';
import { ClassifierGame } from './components/ClassifierGame';
import { CompleteGame } from './components/CompleteGame';
import { PrintLayout } from './components/PrintLayout';
import { AdminPanel } from './components/AdminPanel';
import { LabGame } from './components/LabGame';
import { playSuccessSound } from './utils/sound';

type GameType = 'DETECTIVE' | 'CLASSIFIER' | 'LAB' | 'COMPLETE';

// Components (will be moved to separate files later)
function Menu({ setView, onStartGame, userName, onStartRandom }: { 
  setView: (v: AppView) => void, 
  onStartGame: (t: GameType) => void, 
  userName?: string,
  onStartRandom: () => void 
}) {
  return (
    <div className="flex flex-col gap-6 items-center">
      <div className="text-center mb-8">
        <h1 className="text-5xl font-extrabold text-sky-600 drop-shadow-sm mb-2">
          Entrenador de Palabras
        </h1>
        {userName && (
          <h2 className="text-3xl font-bold text-sky-400">
            ¡Hola, <span className="text-amber-500">{userName}</span>! 👋
          </h2>
        )}
      </div>
      
      <button 
        onClick={onStartRandom}
        className="w-full max-w-2xl bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white p-6 rounded-3xl shadow-xl transform transition hover:scale-105 text-3xl font-black flex flex-col items-center gap-2 border-b-8 border-purple-800 active:border-b-0 active:translate-y-2 mb-4"
      >
        <span>🎲</span>
        Modo Aleatorio
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
        <button 
          onClick={() => onStartGame('DETECTIVE')}
          className="bg-sky-500 hover:bg-sky-600 text-white p-8 rounded-3xl shadow-xl transform transition hover:scale-105 text-2xl font-black flex flex-col items-center gap-2 border-b-8 border-sky-700 active:border-b-0 active:translate-y-2"
        >
          <span>🔍</span>
          Detective de Sílabas
        </button>
        <button 
          onClick={() => onStartGame('CLASSIFIER')}
          className="bg-indigo-500 hover:bg-indigo-600 text-white p-8 rounded-3xl shadow-xl transform transition hover:scale-105 text-2xl font-black flex flex-col items-center gap-2 border-b-8 border-indigo-700 active:border-b-0 active:translate-y-2"
        >
          <span>📦</span>
          El Clasificador
        </button>
        <button 
          onClick={() => onStartGame('COMPLETE')}
          className="bg-orange-400 hover:bg-orange-500 text-white p-8 rounded-3xl shadow-xl transform transition hover:scale-105 text-2xl font-black flex flex-col items-center gap-2 border-b-8 border-orange-600 active:border-b-0 active:translate-y-2"
        >
          <span>✏️</span>
          Completar y Clasificar
        </button>
        <button 
          onClick={() => onStartGame('LAB')}
          className="bg-rose-400 hover:bg-rose-500 text-white p-8 rounded-3xl shadow-xl transform transition hover:scale-105 text-2xl font-black flex flex-col items-center gap-2 border-b-8 border-rose-600 active:border-b-0 active:translate-y-2"
        >
          <span>🧪</span>
          Laboratorio
        </button>
        <button 
          onClick={() => setView('THEORY')}
          className="bg-amber-400 hover:bg-amber-500 text-white p-8 rounded-3xl shadow-xl transform transition hover:scale-105 text-2xl font-black flex flex-col items-center gap-2 border-b-8 border-amber-600 active:border-b-0 active:translate-y-2"
        >
          <span>📖</span>
          La Pizarra
        </button>
        <button 
          onClick={() => setView('PRINT')}
          className="bg-emerald-500 hover:bg-emerald-600 text-white p-8 rounded-3xl shadow-xl transform transition hover:scale-105 text-2xl font-black flex flex-col items-center gap-2 border-b-8 border-emerald-700 active:border-b-0 active:translate-y-2"
        >
          <span>🖨️</span>
          Imprimir Fichas
        </button>
      </div>
      
      <button 
        onClick={() => setView('ADMIN')}
        className="mt-8 text-slate-400 hover:text-slate-600 font-bold transition flex items-center gap-2"
      >
        <span>⚙️</span> Ajustes y Palabras
      </button>
    </div>
  );
}

function Theory({ onBack }: { onBack: () => void }) {
  return (
    <div className="max-w-4xl mx-auto">
      <button onClick={onBack} className="mb-6 text-sky-600 font-bold flex items-center gap-2">
        ← Volver
      </button>
      <h2 className="text-4xl font-bold mb-8 text-center text-sky-800">¿Cómo se acentúan las palabras?</h2>
      
      <div className="grid gap-8">
        <section className="bg-blue-50 p-6 rounded-2xl border-4 border-aguda">
          <h3 className="text-2xl font-bold text-aguda mb-2">🔵 Palabras Agudas</h3>
          <p className="text-lg">Tienen la fuerza en la <strong>última</strong> sílaba.</p>
          <p className="mt-2 p-3 bg-white rounded-lg italic">Llevan tilde si terminan en <strong>N</strong>, <strong>S</strong> o <strong>Vocal</strong>.</p>
          <div className="mt-4 flex gap-2">
            <span className="bg-white px-3 py-1 rounded-full border border-aguda">ca-<strong>fé</strong></span>
            <span className="bg-white px-3 py-1 rounded-full border border-aguda">ca-mi-<strong>ón</strong></span>
            <span className="bg-white px-3 py-1 rounded-full border border-aguda">re-<strong>loj</strong></span>
          </div>
        </section>

        <section className="bg-green-50 p-6 rounded-2xl border-4 border-llana">
          <h3 className="text-2xl font-bold text-llana mb-2">🟢 Palabras Llanas</h3>
          <p className="text-lg">Tienen la fuerza en la <strong>penúltima</strong> sílaba.</p>
          <p className="mt-2 p-3 bg-white rounded-lg italic">Llevan tilde si <strong>NO</strong> terminan en N, S o Vocal.</p>
          <div className="mt-4 flex gap-2">
            <span className="bg-white px-3 py-1 rounded-full border border-llana"><strong>ár</strong>-bol</span>
            <span className="bg-white px-3 py-1 rounded-full border border-llana">ca-<strong>mi</strong>-sa</span>
            <span className="bg-white px-3 py-1 rounded-full border border-llana"><strong>lá</strong>-piz</span>
          </div>
        </section>

        <section className="bg-red-50 p-6 rounded-2xl border-4 border-esdrujula">
          <h3 className="text-2xl font-bold text-esdrujula mb-2">🔴 Palabras Esdrújulas</h3>
          <p className="text-lg">Tienen la fuerza en la <strong>antepenúltima</strong> sílaba.</p>
          <p className="mt-2 p-3 bg-white rounded-lg italic font-bold text-red-600">¡Siempre llevan tilde!</p>
          <div className="mt-4 flex gap-2">
            <span className="bg-white px-3 py-1 rounded-full border border-esdrujula"><strong>plá</strong>-ta-no</span>
            <span className="bg-white px-3 py-1 rounded-full border border-esdrujula"><strong>mú</strong>-si-ca</span>
            <span className="bg-white px-3 py-1 rounded-full border border-esdrujula"><strong>brú</strong>-ju-la</span>
          </div>
        </section>
      </div>
    </div>
  );
}

function App() {
  const [view, setView] = useState<AppView>('MENU');
  const [gameType, setGameType] = useState<GameType | null>(null);
  
  // Session State
  const [session, setSession] = useState<{ active: boolean; current: number; total: number } | null>(null);

  const { words, addWord, loadFromFile, saveToFile, isLocalFile } = useWordStore();
  
  const userName = import.meta.env.VITE_USER_NAME;
  const defaultRounds = parseInt(import.meta.env.VITE_DEFAULT_ROUNDS || '15', 10);

  // Helper to pick a random game
  const getRandomGameType = (): GameType => {
    const types: GameType[] = ['DETECTIVE', 'CLASSIFIER', 'LAB', 'COMPLETE'];
    return types[Math.floor(Math.random() * types.length)];
  };

  const isGameView = view === 'GAME';
  const [gameWords, setGameWords] = useState<typeof words>([]);

  useEffect(() => {
    // If we are in a session, we want only 1 word (one round = one exercise)
    // If we are in normal mode, we want a batch of 10 words
    const count = session?.active ? 1 : 10;
    // Use a random seed or dependency to force re-calc if needed
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setGameWords([...words].sort(() => Math.random() - 0.5).slice(0, count));
  }, [words, isGameView, gameType, session?.active, session?.current]); // Re-roll when round changes

  const startGame = (type: GameType) => {
    setSession(null); // Clear any session
    setGameType(type);
    setView('GAME');
  };

  const startRandomSession = () => {
    setSession({
      active: true,
      current: 1,
      total: defaultRounds
    });
    setGameType(getRandomGameType());
    setView('GAME');
  };

  const handleGameFinish = () => {
    if (session?.active) {
      if (session.current < session.total) {
        // Next round
        setSession({ ...session, current: session.current + 1 });
        setGameType(getRandomGameType());
        // The gameWords memo will update because session.current changed
      } else {
        // Session Finished
        playSuccessSound();
        setSession(null);
        setView('MENU');
      }
    } else {
      // Normal game finished
      setView('MENU');
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      <main className="max-w-5xl mx-auto">
        {view === 'MENU' && <Menu 
          setView={(v) => {
            if (v === 'GAME') {
              // Default if accessed directly
            }
            setView(v);
          }} 
          onStartGame={startGame} 
          userName={userName}
          onStartRandom={startRandomSession} 
        />}
        {view === 'THEORY' && <Theory onBack={() => setView('MENU')} />}
        {view === 'GAME' && (
          <div className="max-w-3xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <button 
                onClick={() => {
                  setView('MENU');
                  setGameType(null);
                  setSession(null);
                }} 
                className="text-sky-600 font-bold hover:underline"
              >
                ← Salir
              </button>
              
              <div className="flex gap-4 items-center">
                {session?.active && (
                   <div className="bg-purple-100 px-4 py-2 rounded-full text-purple-700 font-bold border-2 border-purple-200">
                     🎲 Ronda {session.current}/{session.total}
                   </div>
                )}
                <div className="bg-sky-100 px-4 py-2 rounded-full text-sky-700 font-bold">
                  🎯 {gameType === 'DETECTIVE' ? 'Detective de Sílabas' : 
                      gameType === 'CLASSIFIER' ? 'El Clasificador' : 
                      gameType === 'COMPLETE' ? 'Completar y Clasificar' :
                      'Laboratorio'}
                </div>
              </div>
            </div>
            
            {/* Key is important here to force re-mount on round change */}
            {gameType === 'DETECTIVE' && (
              <DetectiveGame 
                key={`detective-${session?.current}`}
                words={gameWords} 
                onFinish={handleGameFinish} 
              />
            )}
            {gameType === 'CLASSIFIER' && (
              <ClassifierGame 
                key={`classifier-${session?.current}`}
                words={gameWords} 
                onFinish={handleGameFinish} 
              />
            )}
            {gameType === 'COMPLETE' && (
              <CompleteGame 
                key={`complete-${session?.current}`}
                words={gameWords} 
                onFinish={handleGameFinish} 
              />
            )}
            {gameType === 'LAB' && (
              <LabGame 
                key={`lab-${session?.current}`}
                words={gameWords} 
                onFinish={handleGameFinish} 
              />
            )}
          </div>
        )}
        {view === 'PRINT' && (
          <PrintLayout 
            words={words} 
            onBack={() => setView('MENU')}
            userName={userName}
          />
        )}
        {view === 'ADMIN' && (
          <AdminPanel 
            words={words}
            onAddWord={addWord}
            onLoadFromFile={loadFromFile}
            onSaveToFile={saveToFile}
            isLocalFile={isLocalFile}
            onBack={() => setView('MENU')}
          />
        )}
      </main>
    </div>
  )
}

export default App