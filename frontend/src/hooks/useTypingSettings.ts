import { useState, useEffect, useCallback } from 'react';

export type TestMode = 'time' | 'words';
export type Difficulty = 'easy' | 'medium' | 'hard';

export interface TypingSettings {
  mode: TestMode;
  timeConfig: number;
  wordsConfig: number;
  difficulty: Difficulty;
  includeNumbers: boolean;
  includePunctuation: boolean;
}

const STORAGE_KEY = 'typingSettings';

export const defaultTypingSettings: TypingSettings = {
  mode: 'time',
  timeConfig: 25,
  wordsConfig: 50,
  difficulty: 'medium',
  includeNumbers: false,
  includePunctuation: false,
};

function loadSettings(): TypingSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return defaultTypingSettings;
    }
    return { ...defaultTypingSettings, ...JSON.parse(raw) };
  } catch {
    return defaultTypingSettings;
  }
}

export function useTypingSettings() {
  const [settings, setSettingsState] = useState<TypingSettings>(loadSettings);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  const setSettings = useCallback((patch: Partial<TypingSettings>) => {
    setSettingsState((prev) => ({ ...prev, ...patch }));
  }, []);

  const resetSettings = useCallback(() => {
    setSettingsState(defaultTypingSettings);
  }, []);

  return { settings, setSettings, resetSettings };
}

export function getTypingSettingsSnapshot(): TypingSettings {
  return loadSettings();
}
