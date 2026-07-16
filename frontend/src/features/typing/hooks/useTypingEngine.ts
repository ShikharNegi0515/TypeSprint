import { useState, useEffect, useCallback, useRef } from 'react';

export type TestStatus = 'idle' | 'running' | 'finished';

export type TestMode = 'time' | 'words';

export interface HistoryData {
  time: number;
  wpm: number;
  raw: number;
  errors: number;
}

interface UseTypingEngineProps {
  mode: TestMode;
  timeLimit: number;
  words: string;
}

export const useTypingEngine = ({ mode, timeLimit, words }: UseTypingEngineProps) => {
  const [status, setStatus] = useState<TestStatus>('idle');
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [typedChars, setTypedChars] = useState<string>('');
  const [mistakes, setMistakes] = useState(0);
  const [history, setHistory] = useState<HistoryData[]>([]);

  // Refs to keep track of current values for the interval
  const typedCharsRef = useRef(typedChars);
  const mistakesRef = useRef(mistakes);

  useEffect(() => {
    typedCharsRef.current = typedChars;
    mistakesRef.current = mistakes;
  }, [typedChars, mistakes]);

  const start = useCallback(() => {
    setStatus('running');
    setHistory([]);
  }, []);

  const reset = useCallback(() => {
    setStatus('idle');
    setTimeElapsed(0);
    setTypedChars('');
    setMistakes(0);
    setHistory([]);
  }, []);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (status === 'finished') return;

      if (status === 'idle') {
        if (typedChars.length === 0 && e.key !== words[0]) {
          return; // Wait for the first correct character to start
        }
        start();
      }

      // Ignore meta keys
      if (
        e.ctrlKey ||
        e.metaKey ||
        e.altKey ||
        ['Tab', 'Enter', 'Escape', 'Shift', 'CapsLock'].includes(e.key)
      ) {
        return;
      }

      e.preventDefault();

      if (e.key === 'Backspace') {
        setTypedChars((prev) => prev.slice(0, -1));
        return;
      }

      if (e.key.length === 1) {
        setTypedChars((prev) => {
          const nextStr = prev + e.key;
          // Count mistake if the character is wrong
          if (nextStr.length <= words.length) {
            const expectedChar = words[nextStr.length - 1];
            if (e.key !== expectedChar) {
              setMistakes((m) => m + 1);
            }
          }
          return nextStr;
        });

        // Finish if reached the end
        if (typedChars.length + 1 >= words.length) {
          setStatus('finished');
        }
      }
    },
    [status, words, typedChars.length, start]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (status === 'running') {
      timer = setInterval(() => {
        setTimeElapsed((prev) => {
          const nextTime = prev + 1;
          
          // Calculate history stats at this specific second
          const currentTyped = typedCharsRef.current;
          const currentMistakes = mistakesRef.current;
          
          const rawWpmNow = (currentTyped.length / 5) / (nextTime / 60);
          const accuracyNow = currentTyped.length > 0 
            ? Math.max(0, ((currentTyped.length - currentMistakes) / currentTyped.length) * 100)
            : 100;
          const wpmNow = Math.max(0, rawWpmNow * (accuracyNow / 100));

          setHistory(h => [...h, {
            time: nextTime,
            wpm: Math.round(wpmNow),
            raw: Math.round(rawWpmNow),
            errors: currentMistakes // Total errors so far, or can compute diff if needed
          }]);
          
          return nextTime;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [status]);

  useEffect(() => {
    if (status === 'running' && mode === 'time' && timeElapsed >= timeLimit) {
      setStatus('finished');
    }
  }, [status, mode, timeElapsed, timeLimit]);

  // Calculations
  const timeForCalc = timeElapsed === 0 ? 1 : timeElapsed;
  const rawWpm =
    status === 'finished' || timeElapsed > 0
      ? (typedChars.length / 5 / (timeForCalc / 60)) || 0
      : 0;
      
  const accuracy = 
    typedChars.length > 0 
      ? Math.max(0, ((typedChars.length - mistakes) / typedChars.length) * 100)
      : 100;

  const wpm = Math.max(0, rawWpm * (accuracy / 100));

  return {
    status,
    timeElapsed,
    timeLeft: mode === 'time' ? Math.max(0, timeLimit - timeElapsed) : 0,
    typedChars,
    mistakes,
    wpm: Math.round(wpm),
    rawWpm: Math.round(rawWpm),
    accuracy: Math.round(accuracy),
    history,
    reset,
  };
};
