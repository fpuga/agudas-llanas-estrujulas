import { useState } from 'react';

const STORAGE_KEY_USER = 'entrenador_user_name';
const STORAGE_KEY_ROUNDS = 'entrenador_default_rounds';

export function useSettings() {
  const [userName, setUserName] = useState<string>(() => {
    return localStorage.getItem(STORAGE_KEY_USER) || '';
  });

  const [defaultRounds, setDefaultRounds] = useState<number>(() => {
    const stored = localStorage.getItem(STORAGE_KEY_ROUNDS);
    return stored ? parseInt(stored, 10) : 15;
  });

  const updateUserName = (name: string) => {
    setUserName(name);
    localStorage.setItem(STORAGE_KEY_USER, name);
  };

  const updateDefaultRounds = (rounds: number) => {
    setDefaultRounds(rounds);
    localStorage.setItem(STORAGE_KEY_ROUNDS, rounds.toString());
  };

  return {
    userName,
    defaultRounds,
    updateUserName,
    updateDefaultRounds,
  };
}
