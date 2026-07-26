import { useState, useEffect, useCallback, useRef } from 'react';

export type TestStatus = 'idle' | 'running' | 'finished';

export type TestMode = 'time' | 'words';

export interface HistoryData {
  time: number;
  wpm: number;
  raw: number;
  errors?: number;
}

export interface KeystrokeData {
  char: string;
  time: number;
}

interface UseTypingEngineProps {
  mode: TestMode;
  timeLimit: number;
  words: string;
  isEnabled?: boolean;
}

export const useTypingEngine = ({ mode, timeLimit, words, isEnabled = true }: UseTypingEngineProps) => {
  const [status, setStatus] = useState<TestStatus>('idle');
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [typedChars, setTypedChars] = useState<string>('');
  const [mistakes, setMistakes] = useState(0);
  const [missedCharsMap, setMissedCharsMap] = useState<Record<string, number>>({});
  const [history, setHistory] = useState<HistoryData[]>([]);
  const [keystrokes, setKeystrokes] = useState<KeystrokeData[]>([]);
  const startTimeRef = useRef<number | null>(null);

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
    setKeystrokes([]);
    startTimeRef.current = performance.now();
  }, []);

  const reset = useCallback(() => {
    setStatus('idle');
    setTimeElapsed(0);
    setTypedChars('');
    setMistakes(0);
    setMissedCharsMap({});
    setHistory([]);
    setKeystrokes([]);
    startTimeRef.current = null;
  }, []);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isEnabled || status === 'finished') return;

      // Ignore if user is typing in an input or textarea
      if (
        document.activeElement &&
        (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA')
      ) {
        return;
      }

      if (status === 'idle') {
        if (typedChars.length === 0 && e.key !== words[0]) {
          return; // Wait for the first correct character to start
        }
        start();
      }

      // Handle Backspace (including Ctrl+Backspace)
      if (e.key === 'Backspace') {
        e.preventDefault();
        if (status === 'running') {
          setKeystrokes((prev) => [...prev, { char: 'Backspace', time: performance.now() - (startTimeRef.current || performance.now()) }]);
        }
        
        if (e.ctrlKey || e.altKey || e.metaKey) {
          // Delete last word
          setTypedChars((prev) => {
            const trimmed = prev.trimEnd();
            const lastSpaceIdx = trimmed.lastIndexOf(' ');
            if (lastSpaceIdx === -1) return '';
            return trimmed.substring(0, lastSpaceIdx + 1);
          });
        } else {
          // Normal backspace
          setTypedChars((prev) => prev.slice(0, -1));
        }
        return;
      }

      // Ignore other meta keys and modifiers
      if (
        e.ctrlKey ||
        e.metaKey ||
        e.altKey ||
        ['Tab', 'Enter', 'Escape', 'Shift', 'CapsLock'].includes(e.key)
      ) {
        return;
      }

      e.preventDefault();

      if (e.key.length === 1) {
        if (status === 'running' || status === 'idle') {
          const time = status === 'idle' ? 0 : performance.now() - (startTimeRef.current || performance.now());
          setKeystrokes((prev) => [...prev, { char: e.key, time }]);
        }
        
        setTypedChars((prev) => {
          const nextStr = prev + e.key;
          // Count mistake if the character is wrong
          if (nextStr.length <= words.length) {
            const expectedChar = words[nextStr.length - 1];
            if (e.key !== expectedChar) {
              setMistakes((m) => m + 1);
              setMissedCharsMap((mMap) => ({
                ...mMap,
                [expectedChar]: (mMap[expectedChar] || 0) + 1,
              }));
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
      let lastMistakes = mistakesRef.current;
      timer = setInterval(() => {
        const currentTyped = typedCharsRef.current;
        const currentMistakes = mistakesRef.current;
        const newErrors = currentMistakes - lastMistakes;
        lastMistakes = currentMistakes;

          setTimeElapsed((prev) => {
            const nextTime = prev + 1;
            
            let liveCorrect = 0;
            let liveIncorrect = 0;
            let liveExtra = 0;
            
            const aWords = words.split(' ');
            const tWords = currentTyped.split(' ');
            
            for (let i = 0; i < tWords.length; i++) {
              const aW = aWords[i] || '';
              const tW = tWords[i];
              for (let j = 0; j < Math.max(aW.length, tW.length); j++) {
                if (j < aW.length && j < tW.length) {
                  if (aW[j] === tW[j]) liveCorrect++;
                  else liveIncorrect++;
                } else if (j >= aW.length) {
                  liveExtra++;
                }
              }
              if (i < tWords.length - 1) liveCorrect++;
            }

            const rawWpmNow = ((liveCorrect + liveIncorrect + liveExtra) / 5) / (nextTime / 60);
            const wpmNow = (liveCorrect / 5) / (nextTime / 60);

          setHistory(h => {
            // Prevent duplicate history entries for the same second (Strict Mode issue)
            if (h.length > 0 && h[h.length - 1].time === nextTime) {
              return h;
            }
            return [...h, {
              time: nextTime,
              wpm: Math.round(wpmNow),
              raw: Math.round(rawWpmNow),
              errors: newErrors > 0 ? newErrors : undefined
            }];
          });
          
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

  let correctChars = 0;
  let incorrectChars = 0;
  let extraChars = 0;
  let missedChars = 0;

  const actualWords = words.split(' ');
  const typedWordsList = typedChars.split(' ');

  for (let i = 0; i < typedWordsList.length; i++) {
    const actualWord = actualWords[i] || '';
    const typedWord = typedWordsList[i];

    for (let j = 0; j < Math.max(actualWord.length, typedWord.length); j++) {
      if (j < actualWord.length && j < typedWord.length) {
        if (actualWord[j] === typedWord[j]) {
          correctChars++;
        } else {
          incorrectChars++;
        }
      } else if (j >= actualWord.length) {
        extraChars++;
      } else if (j >= typedWord.length) {
        if (i < typedWordsList.length - 1) {
           missedChars++;
        }
      }
    }
    // Correct spaces are added to correctChars
    if (i < typedWordsList.length - 1) {
      correctChars++;
    }
  }

  const timeForCalc = timeElapsed === 0 ? 1 : timeElapsed;
  
  const rawWpm =
    status === 'finished' || timeElapsed > 0
      ? ((correctChars + incorrectChars + extraChars) / 5 / (timeForCalc / 60)) || 0
      : 0;

  const wpmCalc =
    status === 'finished' || timeElapsed > 0
      ? (correctChars / 5 / (timeForCalc / 60)) || 0
      : 0;
      
  const accuracy = 
    (correctChars + incorrectChars + extraChars + missedChars) > 0 
      ? Math.max(0, (correctChars / (correctChars + incorrectChars + extraChars + missedChars)) * 100)
      : 100;

  const rawWpmPerSec: number[] = [];
  let currentSecKeystrokes = 0;
  let currentSec = 1;
  keystrokes.forEach((k) => {
    while (k.time > currentSec * 1000) {
      rawWpmPerSec.push((currentSecKeystrokes / 5) * 60);
      currentSecKeystrokes = 0;
      currentSec++;
    }
    currentSecKeystrokes++;
  });
  if (timeElapsed > 0 && currentSecKeystrokes > 0) {
    rawWpmPerSec.push((currentSecKeystrokes / 5) * 60);
  }

  let consistency = 0;
  if (rawWpmPerSec.length > 1) {
    const mean = rawWpmPerSec.reduce((a, b) => a + b, 0) / rawWpmPerSec.length;
    const variance = rawWpmPerSec.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / rawWpmPerSec.length;
    const stdDev = Math.sqrt(variance);
    const cv = mean === 0 ? 0 : stdDev / mean;
    consistency = Math.max(0, Math.min(100, Math.round((1 - cv) * 100)));
  } else if (rawWpmPerSec.length === 1) {
    consistency = 100;
  }

  return {
    status,
    timeElapsed,
    timeLeft: mode === 'time' ? Math.max(0, timeLimit - timeElapsed) : 0,
    typedChars,
    mistakes,
    missedCharsMap,
    wpm: Math.round(wpmCalc),
    rawWpm: Math.round(rawWpm),
    accuracy: Math.round(accuracy),
    consistency,
    stats: { correct: correctChars, incorrect: incorrectChars, extra: extraChars, missed: missedChars },
    history,
    keystrokes,
    reset,
  };
};
