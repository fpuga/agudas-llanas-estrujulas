/**
 * A basic Spanish syllable splitter.
 * Note: This is a simplified version and might not handle all edge cases (diphthongs/hiatus).
 */
export function splitSyllables(word: string): string[] {
  const vowels = 'aeiouáéíóúüAEIOUÁÉÍÓÚÜ';
  const syllables: string[] = [];
  let currentSyllable = '';

  const isVowel = (char: string) => vowels.includes(char);

  for (let i = 0; i < word.length; i++) {
    const char = word[i];
    const nextChar = word[i + 1];
    const nextNextChar = word[i + 2];

    currentSyllable += char;

    // Basic rule: if we have a vowel followed by a consonant and then another vowel,
    // the consonant starts a new syllable.
    if (isVowel(char)) {
      if (
        nextChar &&
        !isVowel(nextChar) &&
        nextNextChar &&
        isVowel(nextNextChar)
      ) {
        syllables.push(currentSyllable);
        currentSyllable = '';
      } else if (
        nextChar &&
        !isVowel(nextChar) &&
        nextNextChar &&
        !isVowel(nextNextChar)
      ) {
        // Two consonants. Check for inseparable groups like 'bl', 'tr', etc.
        const pair = nextChar + nextNextChar;
        const inseparable = [
          'bl',
          'cl',
          'fl',
          'gl',
          'pl',
          'br',
          'cr',
          'dr',
          'fr',
          'gr',
          'pr',
          'tr',
          'ch',
          'll',
          'rr',
        ];

        // Special case for 'ns' + consonant (e.g. trans-por-te, ins-tan-te)
        // If we have Vowel + 'n' + 's' + Consonant, the 'ns' stays with the vowel.
        const nextNextNextChar = word[i + 3];
        if (
          nextChar === 'n' &&
          nextNextChar === 's' &&
          nextNextNextChar &&
          !isVowel(nextNextNextChar)
        ) {
          currentSyllable += nextChar + nextNextChar;
          syllables.push(currentSyllable);
          currentSyllable = '';
          i += 2; // Skip 'n' and 's'
        } else if (inseparable.includes(pair.toLowerCase())) {
          syllables.push(currentSyllable);
          currentSyllable = '';
        } else {
          // Normal case: first consonant goes with current syllable
          currentSyllable += nextChar;
          syllables.push(currentSyllable);
          currentSyllable = '';
          i++; // Skip the nextChar as we already added it
        }
      } else if (nextChar && isVowel(nextChar)) {
        // Vowel-Vowel. Could be diphthong or hiatus.
        // Simple heuristic: if one has accent, it might be hiatus (not always, but good enough for now).
        const strongVowels = 'aeoAEOáéíóú'; // Simplified
        if (strongVowels.includes(char) && strongVowels.includes(nextChar)) {
          // Probably hiatus
          syllables.push(currentSyllable);
          currentSyllable = '';
        }
        // Diphthongs stay together (simplified)
      }
    }
  }

  if (currentSyllable) {
    syllables.push(currentSyllable);
  }

  return syllables;
}

export function findTonicIndex(syllables: string[]): number {
  const accentedVowels = 'áéíóúÁÉÍÓÚ';
  for (let i = 0; i < syllables.length; i++) {
    for (const char of syllables[i]) {
      if (accentedVowels.includes(char)) {
        return i;
      }
    }
  }

  // Default rules if no accent:
  // 1. If ends in n, s or vowel -> penultimate
  // 2. Otherwise -> last
  const lastSyllable = syllables[syllables.length - 1].toLowerCase();
  const lastChar = lastSyllable[lastSyllable.length - 1];
  const endsInNSVowel = 'aeiouáéíóúns'.includes(lastChar);

  if (syllables.length === 1) return 0;

  return endsInNSVowel ? syllables.length - 2 : syllables.length - 1;
}

export function getWordType(
  syllables: string[],
  tonicIndex: number
): 'aguda' | 'llana' | 'esdrujula' {
  const posFromEnd = syllables.length - 1 - tonicIndex;
  if (posFromEnd === 0) return 'aguda';
  if (posFromEnd === 1) return 'llana';
  return 'esdrujula';
}
