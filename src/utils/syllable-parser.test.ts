import { describe, it, expect } from 'vitest';
import { splitSyllables, findTonicIndex, getWordType } from './syllable-parser';

describe('Syllable Parser', () => {
  it('should split simple words correctly', () => {
    expect(splitSyllables('casa')).toEqual(['ca', 'sa']);
    expect(splitSyllables('pelota')).toEqual(['pe', 'lo', 'ta']);
  });

  it('should handle words with accents', () => {
    expect(splitSyllables('café')).toEqual(['ca', 'fé']);
    expect(splitSyllables('árbol')).toEqual(['ár', 'bol']);
    expect(splitSyllables('murciélago')).toEqual(['mur', 'cié', 'la', 'go']);
  });

  it('should handle complex consonant clusters', () => {
    expect(splitSyllables('transporte')).toEqual(['trans', 'por', 'te']);
    expect(splitSyllables('plátano')).toEqual(['plá', 'ta', 'no']);
    expect(splitSyllables('coche')).toEqual(['co', 'che']);
  });
});

describe('Tonic Index Finder', () => {
  it('should find tonic index in accented words', () => {
    expect(findTonicIndex(['ca', 'fé'])).toBe(1);
    expect(findTonicIndex(['ár', 'bol'])).toBe(0);
    expect(findTonicIndex(['mur', 'cié', 'la', 'go'])).toBe(1);
  });

  it('should find tonic index in non-accented words (natural stress)', () => {
    // Ends in vowel -> penultimate
    expect(findTonicIndex(['ca', 'sa'])).toBe(0);
    // Ends in consonant != n, s -> last
    expect(findTonicIndex(['pa', 'pel'])).toBe(1);
    // Ends in n, s -> penultimate
    expect(findTonicIndex(['can', 'tan'])).toBe(0);
  });
});

describe('Word Type Classifier', () => {
  it('should classify Agudas correctly', () => {
    expect(getWordType(['ca', 'fé'], 1)).toBe('aguda');
    expect(getWordType(['pa', 'pel'], 1)).toBe('aguda');
  });

  it('should classify Llanas correctly', () => {
    expect(getWordType(['ca', 'sa'], 0)).toBe('llana');
    expect(getWordType(['ár', 'bol'], 0)).toBe('llana');
  });

  it('should classify Esdrujulas correctly', () => {
    expect(getWordType(['mur', 'cié', 'la', 'go'], 1)).toBe('esdrujula');
    expect(getWordType(['pá', 'ja', 'ro'], 0)).toBe('esdrujula');
  });
});
