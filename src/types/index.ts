export type WordType = 'aguda' | 'llana' | 'esdrujula';

export interface Word {
  word: string;
  syllables: string[];
  tonic_index: number; // 0-based index of the tonic syllable
  type: WordType;
  image_hint?: string;
}

export type AppView = 'MENU' | 'GAME' | 'THEORY' | 'PRINT' | 'ADMIN';
