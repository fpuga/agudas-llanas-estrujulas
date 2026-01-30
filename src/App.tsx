import { useState, useEffect } from 'react';
import type { AppView } from './types';
import { useWordStore } from './hooks/useWordStore';
import { useSettings } from './hooks/useSettings';
import { DetectiveGame } from './components/DetectiveGame';
import { ClassifierGame } from './components/ClassifierGame';
import { CompleteGame } from './components/CompleteGame';
import { PrintLayout } from './components/PrintLayout';
import { AdminPanel } from './components/AdminPanel';
import { LabGame } from './components/LabGame';
import { playSuccessSound } from './utils/sound';

type GameType = 'DETECTIVE' | 'CLASSIFIER' | 'LAB' | 'COMPLETE';

// Components (will be moved to separate files later)
function Menu({
  setView,
  onStartGame,
  userName,
  onStartRandom,
}: {
  setView: (v: AppView) => void;
  onStartGame: (t: GameType) => void;
  userName?: string;
  onStartRandom: () => void;
}) {
  return (
    <div className="flex flex-col items-center gap-6">
      <div className="mb-8 text-center">
        <h1 className="mb-2 text-5xl font-extrabold text-sky-600 drop-shadow-sm">
          Entrenador de Palabras
        </h1>
        {userName ? (
          <h2 className="text-3xl font-bold text-sky-400">
            ¡Hola, <span className="text-amber-500">{userName}</span>! 👋
          </h2>
        ) : (
          <h2 className="text-3xl font-bold text-sky-400">
            ¡Hola!{' '}
            <button
              onClick={() => setView('ADMIN')}
              className="text-amber-500 underline transition hover:text-amber-600"
            >
              ¿Cómo te llamas?
            </button>
          </h2>
        )}
      </div>

      <button
        onClick={onStartRandom}
        className="mb-4 flex w-full max-w-2xl transform flex-col items-center gap-2 rounded-3xl border-b-8 border-purple-800 bg-gradient-to-r from-purple-500 to-pink-500 p-6 text-3xl font-black text-white shadow-xl transition hover:scale-105 hover:from-purple-600 hover:to-pink-600 active:translate-y-2 active:border-b-0"
      >
        <span>🎲</span>
        Modo Aleatorio
      </button>

      <div className="grid w-full max-w-2xl grid-cols-1 gap-6 md:grid-cols-2">
        <button
          onClick={() => onStartGame('DETECTIVE')}
          className="flex transform flex-col items-center gap-2 rounded-3xl border-b-8 border-sky-700 bg-sky-500 p-8 text-2xl font-black text-white shadow-xl transition hover:scale-105 hover:bg-sky-600 active:translate-y-2 active:border-b-0"
        >
          <span>🔍</span>
          Detective de Sílabas
        </button>
        <button
          onClick={() => onStartGame('CLASSIFIER')}
          className="flex transform flex-col items-center gap-2 rounded-3xl border-b-8 border-indigo-700 bg-indigo-500 p-8 text-2xl font-black text-white shadow-xl transition hover:scale-105 hover:bg-indigo-600 active:translate-y-2 active:border-b-0"
        >
          <span>📦</span>
          El Clasificador
        </button>
        <button
          onClick={() => onStartGame('COMPLETE')}
          className="flex transform flex-col items-center gap-2 rounded-3xl border-b-8 border-orange-600 bg-orange-400 p-8 text-2xl font-black text-white shadow-xl transition hover:scale-105 hover:bg-orange-500 active:translate-y-2 active:border-b-0"
        >
          <span>✏️</span>
          Completar y Clasificar
        </button>
        <button
          onClick={() => onStartGame('LAB')}
          className="flex transform flex-col items-center gap-2 rounded-3xl border-b-8 border-rose-600 bg-rose-400 p-8 text-2xl font-black text-white shadow-xl transition hover:scale-105 hover:bg-rose-500 active:translate-y-2 active:border-b-0"
        >
          <span>🧪</span>
          Laboratorio
        </button>
        <button
          onClick={() => setView('THEORY')}
          className="flex transform flex-col items-center gap-2 rounded-3xl border-b-8 border-amber-600 bg-amber-400 p-8 text-2xl font-black text-white shadow-xl transition hover:scale-105 hover:bg-amber-500 active:translate-y-2 active:border-b-0"
        >
          <span>📖</span>
          La Pizarra
        </button>
        <button
          onClick={() => setView('PRINT')}
          className="flex transform flex-col items-center gap-2 rounded-3xl border-b-8 border-emerald-700 bg-emerald-500 p-8 text-2xl font-black text-white shadow-xl transition hover:scale-105 hover:bg-emerald-600 active:translate-y-2 active:border-b-0"
        >
          <span>🖨️</span>
          Imprimir Fichas
        </button>
      </div>

      <button
        onClick={() => setView('ADMIN')}
        className="mt-8 flex items-center gap-2 font-bold text-slate-400 transition hover:text-slate-600"
      >
        <span>⚙️</span> Ajustes y Palabras
      </button>
    </div>
  );
}

function Theory({ onBack }: { onBack: () => void }) {
  return (
    <div className="mx-auto max-w-4xl">
      <button
        onClick={onBack}
        className="mb-6 flex items-center gap-2 font-bold text-sky-600"
      >
        ← Volver
      </button>
      <h2 className="mb-8 text-center text-4xl font-bold text-sky-800">
        ¿Cómo se acentúan las palabras?
      </h2>

      <div className="grid gap-8">
        <section className="border-aguda rounded-2xl border-4 bg-blue-50 p-6">
          <h3 className="text-aguda mb-2 text-2xl font-bold">
            🔵 Palabras Agudas
          </h3>
          <p className="text-lg">
            Tienen la fuerza en la <strong>última</strong> sílaba.
          </p>
          <p className="mt-2 rounded-lg bg-white p-3 italic">
            Llevan tilde si terminan en <strong>N</strong>, <strong>S</strong> o{' '}
            <strong>Vocal</strong>.
          </p>
          <div className="mt-4 flex gap-2">
            <span className="border-aguda rounded-full border bg-white px-3 py-1">
              ca-<strong>fé</strong>
            </span>
            <span className="border-aguda rounded-full border bg-white px-3 py-1">
              ca-mi-<strong>ón</strong>
            </span>
            <span className="border-aguda rounded-full border bg-white px-3 py-1">
              re-<strong>loj</strong>
            </span>
          </div>
        </section>

        <section className="border-llana rounded-2xl border-4 bg-green-50 p-6">
          <h3 className="text-llana mb-2 text-2xl font-bold">
            🟢 Palabras Llanas
          </h3>
          <p className="text-lg">
            Tienen la fuerza en la <strong>penúltima</strong> sílaba.
          </p>
          <p className="mt-2 rounded-lg bg-white p-3 italic">
            Llevan tilde si <strong>NO</strong> terminan en N, S o Vocal.
          </p>
          <div className="mt-4 flex gap-2">
            <span className="border-llana rounded-full border bg-white px-3 py-1">
              <strong>ár</strong>-bol
            </span>
            <span className="border-llana rounded-full border bg-white px-3 py-1">
              ca-<strong>mi</strong>-sa
            </span>
            <span className="border-llana rounded-full border bg-white px-3 py-1">
              <strong>lá</strong>-piz
            </span>
          </div>
        </section>

        <section className="border-esdrujula rounded-2xl border-4 bg-red-50 p-6">
          <h3 className="text-esdrujula mb-2 text-2xl font-bold">
            🔴 Palabras Esdrújulas
          </h3>
          <p className="text-lg">
            Tienen la fuerza en la <strong>antepenúltima</strong> sílaba.
          </p>
          <p className="mt-2 rounded-lg bg-white p-3 font-bold text-red-600 italic">
            ¡Siempre llevan tilde!
          </p>
          <div className="mt-4 flex gap-2">
            <span className="border-esdrujula rounded-full border bg-white px-3 py-1">
              <strong>plá</strong>-ta-no
            </span>
            <span className="border-esdrujula rounded-full border bg-white px-3 py-1">
              <strong>mú</strong>-si-ca
            </span>
            <span className="border-esdrujula rounded-full border bg-white px-3 py-1">
              <strong>brú</strong>-ju-la
            </span>
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
  const [session, setSession] = useState<{
    active: boolean;
    current: number;
    total: number;
  } | null>(null);

  const { words, addWord, loadFromFile, saveToFile, isLocalFile } =
    useWordStore();

  const { userName, defaultRounds, updateUserName, updateDefaultRounds } =
    useSettings();

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
  }, [words, isGameView, gameType, session?.active]); // Re-roll when round changes

  const startGame = (type: GameType) => {
    setSession(null); // Clear any session
    setGameType(type);
    setView('GAME');
  };

  const startRandomSession = () => {
    setSession({
      active: true,
      current: 1,
      total: defaultRounds,
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

  const handleUpdateSettings = (name: string, rounds: number) => {
    updateUserName(name);
    updateDefaultRounds(rounds);
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      <main className="mx-auto max-w-5xl">
        {view === 'MENU' && (
          <Menu
            setView={(v) => {
              if (v === 'GAME') {
                // Default if accessed directly
              }
              setView(v);
            }}
            onStartGame={startGame}
            userName={userName}
            onStartRandom={startRandomSession}
          />
        )}
        {view === 'THEORY' && <Theory onBack={() => setView('MENU')} />}
        {view === 'GAME' && (
          <div className="mx-auto max-w-3xl">
            <div className="mb-6 flex items-center justify-between">
              <button
                onClick={() => {
                  setView('MENU');
                  setGameType(null);
                  setSession(null);
                }}
                className="font-bold text-sky-600 hover:underline"
              >
                ← Salir
              </button>

              <div className="flex items-center gap-4">
                {session?.active && (
                  <div className="rounded-full border-2 border-purple-200 bg-purple-100 px-4 py-2 font-bold text-purple-700">
                    🎲 Ronda {session.current}/{session.total}
                  </div>
                )}
                <div className="rounded-full bg-sky-100 px-4 py-2 font-bold text-sky-700">
                  🎯{' '}
                  {gameType === 'DETECTIVE'
                    ? 'Detective de Sílabas'
                    : gameType === 'CLASSIFIER'
                      ? 'El Clasificador'
                      : gameType === 'COMPLETE'
                        ? 'Completar y Clasificar'
                        : 'Laboratorio'}
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
            currentUserName={userName}
            currentRounds={defaultRounds}
            onUpdateSettings={handleUpdateSettings}
          />
        )}
      </main>

      <footer className="mt-12 py-6 text-center text-slate-400">
        <p className="flex items-center justify-center gap-2 text-sm font-medium">
          Hecho con <span className="text-rose-400">❤️</span> por{' '}
          <a
            href="https://franciscopuga.es"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sky-400 transition hover:text-sky-500 hover:underline"
          >
            Francisco Puga
          </a>
          <span className="mx-2 opacity-30">|</span>
          <a
            href="https://github.com/fpuga/agudas-llanas-estrujulas"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 transition hover:text-slate-600"
          >
            Código Fuente
          </a>
        </p>
      </footer>
    </div>
  );
}

export default App;
