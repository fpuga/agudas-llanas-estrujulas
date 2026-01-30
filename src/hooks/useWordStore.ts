import { useState } from 'react';
import type { Word } from '../types';
import initialWords from '../data/words.json';

export function useWordStore() {
  const [words, setWords] = useState<Word[]>(initialWords as Word[]);
  const [fileHandle, setFileHandle] = useState<FileSystemFileHandle | null>(
    null
  );

  // Load words from a local file if desired
  const loadFromFile = async () => {
    try {
      const [handle] = await window.showOpenFilePicker({
        types: [
          {
            description: 'JSON Files',
            accept: { 'application/json': ['.json'] },
          },
        ],
      });
      setFileHandle(handle);
      const file = await handle.getFile();
      const content = await file.text();
      const data = JSON.parse(content);
      setWords(data);
    } catch (err) {
      console.error('Error loading file:', err);
    }
  };

  // Save words to the current file handle
  const saveToFile = async (newWords?: Word[]) => {
    const wordsToSave = newWords || words;
    if (!fileHandle) {
      try {
        const handle = await window.showSaveFilePicker({
          suggestedName: 'words.json',
          types: [
            {
              description: 'JSON Files',
              accept: { 'application/json': ['.json'] },
            },
          ],
        });
        setFileHandle(handle);
        const writable = await handle.createWritable();
        await writable.write(JSON.stringify(wordsToSave, null, 2));
        await writable.close();
      } catch (err) {
        console.error('Error saving file:', err);
      }
      return;
    }

    try {
      const writable = await fileHandle.createWritable();
      await writable.write(JSON.stringify(wordsToSave, null, 2));
      await writable.close();
    } catch (err) {
      console.error('Error saving to existing file:', err);
    }
  };

  const addWord = (word: Word) => {
    const updated = [...words, word];
    setWords(updated);
  };

  return {
    words,
    addWord,
    loadFromFile,
    saveToFile,
    isLocalFile: !!fileHandle,
  };
}
