import { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import html2canvas from 'html2canvas';
import { useTypingEngine, type KeystrokeData } from '../hooks/useTypingEngine';
import { TypingArea } from '../components/TypingArea';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../../../lib/axios';
import { useNavigate } from 'react-router-dom';
import { ComposedChart, Line, Scatter, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Footer } from '../../../components/Footer';

const WORD_LIST = ["any", "old", "well", "be", "around", "here", "part", "that", "home", "of", "and", "mean", "make", "never", "both", "might", "other", "then", "become", "head", "have", "present", "show", "govern", "world", "year", "it", "point", "line", "think", "word", "too", "feel", "interest", "on", "could", "say", "hold", "increase", "must", "the", "to", "in", "a", "is", "you", "are", "for", "with", "as", "I", "his", "they", "at", "one", "this", "from", "or", "had", "by", "not", "but", "some", "what", "there", "we", "can", "out", "all", "were", "your", "when", "up", "use", "how", "said", "an", "each", "she", "which", "do", "their", "time", "if", "will", "way", "about", "many", "then", "them", "would", "write", "like", "so", "these", "her", "long", "make", "thing", "see", "him", "two", "has", "look", "more", "day", "go", "come", "did", "my", "sound", "no", "most", "number", "who", "over", "know", "water", "than", "call", "first", "people", "may", "down", "side", "been", "now", "find", "work", "new", "take", "get", "place", "made", "live", "where", "after", "back", "little", "only", "round", "man", "year", "came", "every", "good", "me", "give", "our", "under", "name", "very", "through", "just", "form", "sentence", "great", "think", "say", "help", "low", "line", "differ", "turn", "cause", "much", "mean", "before", "move", "right", "boy", "old", "too", "same", "tell", "does", "set", "three", "want", "air", "well", "also", "play", "small", "end", "put", "home", "read", "hand", "port", "large", "spell", "add", "even", "land", "here", "must", "big", "high", "such", "follow", "act", "why", "ask", "men", "change", "went", "light", "kind", "off", "need", "house", "picture", "try", "us", "again", "animal", "point", "mother", "world", "near", "build", "self", "earth", "father"];

const HARD_WORD_LIST = [
  "ophthalmology", "tasteless", "weathervane", "diffidence", "abounds",
  "caprimulgus", "blameworthy", "unify", "desirously", "stasis",
  "stinker", "ketch", "gotra", "sapphire", "overhear", "decortication",
  "gratuity", "mauser", "scarlatina", "clapper", "incision",
  "undersigned", "gabonese", "xylophone", "labyrinth", "quizzical",
  "juxtapose", "cacophony", "ephemeral", "sycophant", "ubiquitous",
  "obfuscate", "lugubrious", "perspicacious", "magnanimous", "fastidious",
  "trepidation", "mellifluous", "serendipity", "defenestration",
  "idiosyncrasy", "quintessential", "recalcitrant", "surreptitious",
  "belligerent", "clandestine", "efficacious", "gregarious", "ineffable",
  "archetype", "bourgeoisie", "camaraderie", "dichotomy", "enfranchise",
  "facetious", "grandiloquent", "hegemony", "iconoclast", "juxtaposition"
];

function generateText(count: number, includeNumbers: boolean = false, includePunctuation: boolean = false, difficulty: 'easy' | 'medium' | 'hard' = 'medium') {
  let result = [];

  let validWords = WORD_LIST;
  if (difficulty === 'easy') {
    validWords = WORD_LIST.filter(w => w.length <= 4);
  } else if (difficulty === 'hard') {
    validWords = HARD_WORD_LIST;
  }

  for (let i = 0; i < count; i++) {
    let word = "";
    if (includeNumbers && Math.random() < 0.15) {
      const digits = Math.floor(Math.random() * 4) + 1;
      word = Math.floor(Math.random() * Math.pow(10, digits)).toString();
    } else {
      word = validWords[Math.floor(Math.random() * validWords.length)];
    }

    if (includePunctuation) {
      const rand = Math.random();
      if (rand < 0.05) word = word + ",";
      else if (rand < 0.1) word = word + ".";
      else if (rand < 0.13) word = word + ";";
      else if (rand < 0.16) word = word + ":";
      else if (rand < 0.2) word = '"' + word + '"';
      else if (rand < 0.23) word = "'" + word + "'";
      else if (rand < 0.26) word = word + "?";
      else if (rand < 0.29) word = word + "!";
      else if (rand < 0.35) word = word.charAt(0).toUpperCase() + word.slice(1);
    }
    result.push(word);
  }
  return result.join(' ');
}

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

import { getTypingSettingsSnapshot } from '../../../hooks/useTypingSettings';

const initialTypingSettings = getTypingSettingsSnapshot();

export default function TypingPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<'time' | 'words'>(initialTypingSettings.mode);
  const [timeConfig, setTimeConfig] = useState(initialTypingSettings.timeConfig);
  const [wordsConfig, setWordsConfig] = useState(initialTypingSettings.wordsConfig);
  const [includeNumbers, setIncludeNumbers] = useState(initialTypingSettings.includeNumbers);
  const [includePunctuation, setIncludePunctuation] = useState(initialTypingSettings.includePunctuation);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>(initialTypingSettings.difficulty);
  const [activeText, setActiveText] = useState(() =>
    generateText(300, initialTypingSettings.includeNumbers, initialTypingSettings.includePunctuation, initialTypingSettings.difficulty),
  );
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [customInputValue, setCustomInputValue] = useState('');
  const resultSaved = useRef(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  const [wrongWordsList, setWrongWordsList] = useState<string[]>([]);
  const [showPracticeModal, setShowPracticeModal] = useState(false);
  const [showWordsHistory, setShowWordsHistory] = useState(false);
  const [isReplaying, setIsReplaying] = useState(false);
  const [replayTimeMs, setReplayTimeMs] = useState(0);

  const [ghostKeystrokes, setGhostKeystrokes] = useState<KeystrokeData[] | null>(null);
  const [ghostTypedChars, setGhostTypedChars] = useState<string | undefined>(undefined);

  // ── Personal-Best ghost ──────────────────────────────────────────────────
  const [pbWpm, setPbWpm] = useState<number>(() => Number(localStorage.getItem('pb_wpm') || 0));
  const [pbGhostEnabled, setPbGhostEnabled] = useState<boolean>(false);
  const [pbGhostKeystrokes] = useState<KeystrokeData[] | null>(() => {
    try {
      const raw = localStorage.getItem('pb_ghost_keystrokes');
      return raw ? (JSON.parse(raw) as KeystrokeData[]) : null;
    } catch { return null; }
  });

  const {
    status,
    timeElapsed,
    timeLeft,
    typedChars,
    wpm,
    rawWpm,
    accuracy,
    mistakes,
    stats,
    history,
    consistency,
    keystrokes,
    missedCharsMap,
    reset: engineReset,
  } = useTypingEngine({
    mode,
    timeLimit: timeConfig,
    words: activeText
  });

  const handleRestart = useCallback(() => {
    const wordCount = mode === 'words' ? wordsConfig : 300;
    setActiveText(generateText(wordCount, includeNumbers, includePunctuation, difficulty));
    engineReset();
    resultSaved.current = false;
    setIsReplaying(false);
    setShowWordsHistory(false);
    // Load PB ghost automatically if enabled and available
    setGhostKeystrokes(pbGhostEnabled && pbGhostKeystrokes ? pbGhostKeystrokes : null);
  }, [mode, wordsConfig, includeNumbers, includePunctuation, difficulty, engineReset, pbGhostEnabled, pbGhostKeystrokes]);

  const handleRepeat = useCallback(() => {
    setGhostKeystrokes(keystrokes);
    engineReset();
    resultSaved.current = false;
    setIsReplaying(false);
    setShowWordsHistory(false);
    // Award Ghost Mode achievement
    api.post('/achievements/award/ghost_mode').catch(() => {});
  }, [engineReset, keystrokes]);

  const handleModeChange = (newMode: 'time' | 'words') => {
    setMode(newMode);
    const wordCount = newMode === 'words' ? wordsConfig : 300;
    setActiveText(generateText(wordCount, includeNumbers, includePunctuation, difficulty));
    engineReset();
    resultSaved.current = false;
  };

  const handleDifficultyChange = (newDifficulty: 'easy' | 'medium' | 'hard') => {
    setDifficulty(newDifficulty);
    const wordCount = mode === 'words' ? wordsConfig : 300;
    setActiveText(generateText(wordCount, includeNumbers, includePunctuation, newDifficulty));
    engineReset();
    resultSaved.current = false;
  };

  const handleTimeConfigChange = (val: number) => {
    setTimeConfig(val);
    if (mode === 'time') {
      setActiveText(generateText(300, includeNumbers, includePunctuation, difficulty));
      engineReset();
      resultSaved.current = false;
    }
  };

  const handleWordsConfigChange = (val: number) => {
    setWordsConfig(val);
    if (mode === 'words') {
      setActiveText(generateText(val, includeNumbers, includePunctuation, difficulty));
      engineReset();
      resultSaved.current = false;
    }
  };

  const handleCustomConfig = () => {
    setCustomInputValue('');
    setShowCustomModal(true);
  };

  const submitCustomConfig = () => {
    const val = parseInt(customInputValue, 10);
    if (!isNaN(val) && val > 0) {
      if (mode === 'time') {
        handleTimeConfigChange(val);
      } else {
        handleWordsConfigChange(val);
      }
    }
    setShowCustomModal(false);
  };

  const toggleNumbers = () => {
    setIncludeNumbers(!includeNumbers);
    const wordCount = mode === 'words' ? wordsConfig : 300;
    setActiveText(generateText(wordCount, !includeNumbers, includePunctuation, difficulty));
    engineReset();
    resultSaved.current = false;
  };

  const togglePunctuation = () => {
    setIncludePunctuation(!includePunctuation);
    const wordCount = mode === 'words' ? wordsConfig : 300;
    setActiveText(generateText(wordCount, includeNumbers, !includePunctuation, difficulty));
    engineReset();
    resultSaved.current = false;
  };

  useEffect(() => {
    if (status === 'finished' && !resultSaved.current) {
      resultSaved.current = true;
      api.post('/typing/results', {
        wpm,
        rawWpm,
        accuracy,
        mistakes,
        missedChars: missedCharsMap,
        characterCount: typedChars.length,
        duration: mode === 'time' ? timeConfig : timeElapsed,
        mode: mode
      }).catch(console.error);
    }
    if (status !== 'finished') {
      resultSaved.current = false;
    }
    // ── Save PB ghost keystrokes on new personal best ────────────────────────
    if (status === 'finished' && keystrokes && keystrokes.length > 0 && wpm > pbWpm) {
      setPbWpm(wpm);
      localStorage.setItem('pb_wpm', String(wpm));
      localStorage.setItem('pb_ghost_keystrokes', JSON.stringify(keystrokes));
    }
  }, [status, wpm, rawWpm, accuracy, mistakes, missedCharsMap, timeConfig, timeElapsed, typedChars.length, mode, keystrokes, pbWpm]);

  useEffect(() => {
    if (status === 'finished') {
      const activeWords = activeText.split(' ');
      const typedWordsList = typedChars.split(' ');
      const wrong: string[] = [];
      activeWords.forEach((word, idx) => {
        if (idx < typedWordsList.length && typedWordsList[idx] !== word) {
          wrong.push(word);
        }
      });
      setWrongWordsList(wrong);
    }
  }, [status, activeText, typedChars]);

  useEffect(() => {
    let animationFrameId: number;
    let startTimestamp: number | null = null;

    if (isReplaying && keystrokes && keystrokes.length > 0) {
      const duration = keystrokes[keystrokes.length - 1].time;
      const playReplay = (timestamp: number) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const elapsed = (timestamp - startTimestamp) * 1.5; // Playback speed
        setReplayTimeMs(elapsed);

        if (elapsed < duration + 500) {
          animationFrameId = requestAnimationFrame(playReplay);
        } else {
          setIsReplaying(false);
        }
      };
      animationFrameId = requestAnimationFrame(playReplay);
    }

    return () => cancelAnimationFrame(animationFrameId);
  }, [isReplaying, keystrokes]);

  const replayTypedChars = useMemo(() => {
    if (!isReplaying) return typedChars;
    let chars = '';
    if (keystrokes) {
      for (const stroke of keystrokes) {
        if (stroke.time <= replayTimeMs) {
          if (stroke.char === 'Backspace') {
            chars = chars.slice(0, -1);
          } else {
            chars += stroke.char;
          }
        } else {
          break;
        }
      }
    }
    return chars;
  }, [isReplaying, keystrokes, replayTimeMs, typedChars]);

  useEffect(() => {
    let animationFrameId: number;
    let startTimestamp: number | null = null;

    if (status === 'running' && ghostKeystrokes) {
      const updateGhost = (timestamp: number) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const elapsed = timestamp - startTimestamp;

        let chars = '';
        for (const stroke of ghostKeystrokes) {
          if (stroke.time <= elapsed) {
            if (stroke.char === 'Backspace') chars = chars.slice(0, -1);
            else chars += stroke.char;
          } else {
            break;
          }
        }
        setGhostTypedChars(chars);
        animationFrameId = requestAnimationFrame(updateGhost);
      };
      animationFrameId = requestAnimationFrame(updateGhost);
    } else if (status === 'idle') {
      if (ghostKeystrokes) setGhostTypedChars('');
      else setGhostTypedChars(undefined);
    }

    return () => cancelAnimationFrame(animationFrameId);
  }, [status, ghostKeystrokes]);

  const startPractice = () => {
    if (wrongWordsList.length > 0) {
      setActiveText(wrongWordsList.join(' '));
      setMode('words');
      setWordsConfig(wrongWordsList.length); // Update custom word config
      engineReset();
      resultSaved.current = false;
      setIsReplaying(false);
      setShowWordsHistory(false);
    }
    setShowPracticeModal(false);
  };

  const handleCopyScreenshot = async () => {
    if (resultsRef.current) {
      try {
        const canvas = await html2canvas(resultsRef.current, { backgroundColor: '#1f1f1f' });
        canvas.toBlob(blob => {
          if (blob) {
            navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
          }
        });
        // Award Showoff achievement
        api.post('/achievements/award/showoff').catch(() => {});
      } catch (err) {
        console.error('Failed to copy screenshot', err);
      }
    }
  };

  // Handle instant restart shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        handleRestart();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleRestart]);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center p-8 font-mono relative">
      {/* Header */}
      <header className="w-full max-w-7xl flex justify-between items-center py-4 text-muted-foreground">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold tracking-tighter text-foreground flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2" ry="2"></rect><path d="M6 8h.01"></path><path d="M10 8h.01"></path><path d="M14 8h.01"></path><path d="M18 8h.01"></path><path d="M6 12h.01"></path><path d="M10 12h.01"></path><path d="M14 12h.01"></path><path d="M18 12h.01"></path><path d="M7 16h10"></path></svg>
            typesprint
          </h1>
          <button
            type="button"
            onClick={() => navigate('/settings')}
            title="Settings"
            className="hover:text-foreground transition-colors p-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
          </button>
          <button onClick={() => navigate('/multiplayer')} className="hover:text-foreground transition-colors p-2"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg></button>
          <button onClick={() => navigate('/leaderboard')} className="hover:text-foreground transition-colors p-2"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" /><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" /><path d="M4 22h16" /><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" /><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" /><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" /></svg></button>
          <button onClick={() => navigate('/daily')} title="Daily Challenge" className="hover:text-foreground transition-colors p-2"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg></button>
        </div>
        <div className="flex items-center gap-4">
          <button className="hover:text-foreground transition-colors"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" /></svg></button>
          <button onClick={() => navigate('/profile')} className="hover:text-foreground transition-colors"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg></button>
        </div>
      </header>

      {/* Main Settings Bar */}
      <div className={`mt-8 flex items-center justify-center bg-card rounded-xl px-6 py-2 gap-6 text-sm font-medium text-muted-foreground shadow-sm transition-opacity duration-200 ${status === 'idle' ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className="flex gap-4 items-center border-r border-border pr-6">
          <button onClick={togglePunctuation} className={`hover:text-foreground transition-colors flex items-center gap-1.5 ${includePunctuation ? 'text-primary' : ''}`}><span className="text-primary text-xs">@</span> punctuation</button>
          <button onClick={toggleNumbers} className={`hover:text-foreground transition-colors flex items-center gap-1.5 ${includeNumbers ? 'text-primary' : ''}`}><span className="text-primary text-xs">#</span> numbers</button>
        </div>
        {/* Ghost PB toggle */}
        <div className="flex gap-4 items-center border-r border-border pr-6">
          <button
            onClick={() => {
              const next = !pbGhostEnabled;
              setPbGhostEnabled(next);
              localStorage.setItem('pb_ghost_enabled', String(next));
              setGhostKeystrokes(next && pbGhostKeystrokes ? pbGhostKeystrokes : null);
            }}
            title={pbWpm > 0 ? `Race your PB (${pbWpm} WPM)` : 'No PB recorded yet — finish a test first!'}
            className={`hover:text-foreground transition-colors flex items-center gap-1.5 ${pbGhostEnabled && pbGhostKeystrokes ? 'text-primary' : ''}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            ghost {pbWpm > 0 ? `· ${pbWpm}` : ''}
          </button>
        </div>
        <div className="flex gap-4 items-center border-r border-border pr-6">
          <button onClick={() => handleModeChange('time')} className={`hover:text-foreground transition-colors flex items-center gap-1.5 ${mode === 'time' ? 'text-primary' : ''}`}><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg> time</button>
          <button onClick={() => handleModeChange('words')} className={`hover:text-foreground transition-colors flex items-center gap-1.5 ${mode === 'words' ? 'text-primary' : ''}`}><span className="text-xs font-bold font-sans tracking-tight">A</span> words</button>
        </div>
        <div className="flex gap-4 items-center border-r border-border pr-6">
          <button onClick={() => handleDifficultyChange('easy')} className={`hover:text-foreground transition-colors flex items-center gap-1.5 ${difficulty === 'easy' ? 'text-primary' : ''}`}><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" /><path d="m9 12 2 2 4-4" /></svg> easy</button>
          <button onClick={() => handleDifficultyChange('medium')} className={`hover:text-foreground transition-colors flex items-center gap-1.5 ${difficulty === 'medium' ? 'text-primary' : ''}`}><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" /><path d="M8 12h8" /></svg> medium</button>
          <button onClick={() => handleDifficultyChange('hard')} className={`hover:text-foreground transition-colors flex items-center gap-1.5 ${difficulty === 'hard' ? 'text-primary' : ''}`}><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" /><path d="m15 9-6 6" /><path d="m9 9 6 6" /></svg> hard</button>
        </div>
        <div className="flex gap-4 items-center">
          {[10, 25, 50, 100].map((t) => {
            const isActive = mode === 'time' ? timeConfig === t : wordsConfig === t;
            return (
              <button
                key={t}
                onClick={() => mode === 'time' ? handleTimeConfigChange(t) : handleWordsConfigChange(t)}
                className={`hover:text-foreground transition-colors ${isActive ? 'text-primary' : ''}`}
              >
                {t}
              </button>
            );
          })}
          <button
            onClick={handleCustomConfig}
            className={`hover:text-foreground transition-colors flex items-center gap-1.5 ${![10, 25, 50, 100].includes(mode === 'time' ? timeConfig : wordsConfig) ? 'text-primary' : ''
              }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="20" x2="12" y2="10" /><line x1="18" y1="20" x2="18" y2="4" /><line x1="6" y1="20" x2="6" y2="16" /></svg>
            {![10, 25, 50, 100].includes(mode === 'time' ? timeConfig : wordsConfig) && (
              <span>{mode === 'time' ? timeConfig : wordsConfig}</span>
            )}
          </button>
        </div>
      </div>

      {/* Language / Mode info */}
      <div className={`mt-16 text-muted-foreground text-sm flex items-center gap-2 transition-opacity duration-200 ${status === 'idle' ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" /><path d="M2 12h20" /></svg>
        english
      </div>

      <AnimatePresence mode="wait">
        {status === 'finished' ? (
          <motion.div
            key="results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full max-w-7xl mt-8 flex flex-col items-center"
          >
            <div ref={resultsRef} className="w-full bg-background pb-4 pt-4">
              {/* Header Stats & Chart */}
              <div className="grid grid-cols-12 gap-8 w-full">
                {/* Left Stats: WPM and ACC */}
                <div className="col-span-2 flex flex-col justify-center gap-8 pr-4">
                  <div className="space-y-1">
                    <p className="text-3xl text-muted-foreground tracking-tight">wpm</p>
                    <p className="text-[5rem] font-bold text-primary tracking-tighter leading-none">{wpm}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-3xl text-muted-foreground tracking-tight">acc</p>
                    <p className="text-[5rem] font-bold text-primary tracking-tighter leading-none">{accuracy}%</p>
                  </div>
                </div>

                {/* Chart */}
                <div className="col-span-10 h-[250px] w-full mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={history} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <XAxis dataKey="time" tick={{ fill: 'var(--muted-foreground)' }} tickLine={false} axisLine={false} />
                      <YAxis yAxisId="left" tick={{ fill: 'var(--muted-foreground)' }} tickLine={false} axisLine={false} />
                      <YAxis yAxisId="right" orientation="right" tick={{ fill: 'var(--destructive)' }} tickLine={false} axisLine={false} domain={[0, 'dataMax + 2']} />
                      <Tooltip
                        contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', borderRadius: '0.5rem' }}
                        itemStyle={{ color: 'var(--foreground)' }}
                      />
                      <Line yAxisId="left" type="monotone" dataKey="wpm" stroke="var(--primary)" strokeWidth={3} dot={false} activeDot={{ r: 6 }} />
                      <Line yAxisId="left" type="monotone" dataKey="raw" stroke="var(--muted-foreground)" strokeWidth={2} dot={false} opacity={0.5} />
                      <Scatter yAxisId="right" dataKey="errors" fill="var(--destructive)" shape="cross" />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Bottom Stats Row */}
              <div className="grid grid-cols-12 gap-4 w-full mt-10 pl-2">
                <div className="space-y-1 col-span-2">
                  <p className="text-sm text-muted-foreground">test type</p>
                  <p className="text-xl text-primary font-semibold">{mode} {mode === 'time' ? timeConfig : wordsConfig}<br />english</p>
                </div>
                <div className="space-y-1 col-span-2">
                  <p className="text-sm text-muted-foreground">other</p>
                  <p className="text-xl text-foreground font-semibold">none</p>
                </div>
                <div className="space-y-1 col-span-2">
                  <p className="text-sm text-muted-foreground">raw</p>
                  <p className="text-4xl text-foreground font-semibold">{rawWpm}</p>
                </div>
                <div className="space-y-1 col-span-3">
                  <p className="text-sm text-muted-foreground">characters</p>
                  <p className="text-4xl text-foreground font-semibold">{stats.correct}/{stats.incorrect}/{stats.extra}/{stats.missed}</p>
                </div>
                <div className="space-y-1 col-span-2">
                  <p className="text-sm text-muted-foreground">consistency</p>
                  <p className="text-4xl text-foreground font-semibold">{consistency}%</p>
                </div>
                <div className="space-y-1 col-span-1">
                  <p className="text-sm text-muted-foreground">time</p>
                  <p className="text-4xl text-foreground font-semibold">{mode === 'time' ? `${timeConfig}s` : formatTime(timeElapsed)}</p>
                </div>
              </div>
            </div> {/* Close resultsRef */}

            <div className="flex justify-center mt-12 gap-2 text-muted-foreground">
              <button
                onClick={handleRestart}
                className="hover:text-foreground transition-colors p-4 hover:bg-card rounded"
                title="Next test"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
              </button>
              <button
                onClick={handleRepeat}
                className="hover:text-foreground transition-colors p-4 hover:bg-card rounded"
                title="Repeat test"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" /></svg>
              </button>
              <button
                onClick={() => setShowPracticeModal(true)}
                className="hover:text-foreground transition-colors p-4 hover:bg-card rounded"
                title="Practice words"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
              </button>
              <button
                onClick={() => { setShowWordsHistory(prev => !prev); setIsReplaying(false); }}
                className={`transition-colors p-4 hover:bg-card rounded ${showWordsHistory ? 'text-primary' : 'hover:text-foreground'}`}
                title="Toggle words history"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="15" y2="12" /><line x1="3" y1="18" x2="18" y2="18" /></svg>
              </button>
              <button
                onClick={() => { setIsReplaying(true); setShowWordsHistory(false); setReplayTimeMs(0); }}
                className={`transition-colors p-4 hover:bg-card rounded ${isReplaying ? 'text-primary' : 'hover:text-foreground'}`}
                title="Watch replay"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 19 2 12 11 5 11 19" /><polygon points="22 19 13 12 22 5 22 19" /></svg>
              </button>
              <button
                onClick={handleCopyScreenshot}
                className="hover:text-foreground transition-colors p-4 hover:bg-card rounded"
                title="Copy screenshot"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg>
              </button>
            </div>

            {/* Extra Sections (History / Replay) */}
            <div className="w-full mt-8 max-w-4xl text-left">
              {showWordsHistory && (
                <div className="text-sm">
                  <div className="flex items-center gap-2 mb-2 text-muted-foreground">
                    <span>input history</span>
                    <button onClick={() => setShowWordsHistory(false)} className="hover:text-foreground"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg></button>
                  </div>
                  <div className="text-xl leading-relaxed opacity-80 break-words">
                    {activeText.split(' ').slice(0, typedChars.length > 0 ? typedChars.trimEnd().split(' ').length : 0).map((word, wIdx) => {
                      const typedWordList = typedChars.split(' ');
                      const typedWord = typedWordList[wIdx] || '';

                      // Do not render if they haven't typed anything for this word yet
                      if (wIdx === typedWordList.length - 1 && typedWord === '') {
                        return null;
                      }

                      return (
                        <span key={wIdx} className="mr-2">
                          {word.split('').map((char, cIdx) => {
                            const typedChar = typedWord[cIdx];
                            let colorClass = 'text-foreground';
                            if (typedChar === undefined) colorClass = 'text-muted-foreground/50';
                            else if (typedChar !== char) colorClass = 'text-destructive';
                            return <span key={cIdx} className={colorClass}>{char}</span>;
                          })}
                          {typedWord.length > word.length && (
                            <span className="text-destructive opacity-70">
                              {typedWord.slice(word.length)}
                            </span>
                          )}
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}
              {isReplaying && (
                <div className="text-sm">
                  <div className="flex items-center gap-2 mb-2 text-muted-foreground">
                    <span>watch replay</span>
                    <button onClick={() => setIsReplaying(false)} className="hover:text-foreground"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg></button>
                  </div>
                  <div className="scale-75 origin-top-left -ml-4 mt-4 opacity-80 pointer-events-none">
                    <TypingArea words={activeText} typedChars={replayTypedChars} />
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="typing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full max-w-7xl flex flex-col items-center mt-8 relative"
          >
            {/* Timer / Word count */}
            <div className={`w-full max-w-7xl text-left mb-4 transition-opacity duration-300 ${status === 'running' ? 'opacity-100' : 'opacity-0'}`}>
              <div className="text-3xl font-bold tracking-tight text-primary font-sans select-none flex items-baseline gap-1">
                {mode === 'time' ? (
                  timeLeft
                ) : (
                  <>
                    <span>{typedChars.length > 0 ? typedChars.split(' ').length : 0}</span>
                    <span className="text-muted-foreground/50 text-xl font-medium">/ {wordsConfig}</span>
                  </>
                )}
              </div>
            </div>

            <TypingArea words={activeText} typedChars={typedChars} ghostTypedChars={ghostTypedChars} />

            <div className={`mt-12 text-muted-foreground flex justify-center transition-opacity duration-200 ${status === 'idle' ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
              <button
                onClick={handleRestart}
                className="hover:text-foreground transition-colors p-2"
                title="Restart"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" /></svg>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer Hints */}
      <div className="mt-auto mb-16 text-center space-y-2">
        <p className="text-muted-foreground text-xs"><span className="bg-card px-1.5 py-0.5 rounded text-foreground font-semibold">escape</span> - instantly restart test</p>
      </div>

      <Footer />

      {/* Custom Config Modal */}
      <AnimatePresence>
        {showCustomModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-card border border-border p-6 rounded-xl shadow-lg w-full max-w-sm flex flex-col gap-4"
            >
              <h3 className="text-lg font-bold text-foreground">
                Custom {mode === 'time' ? 'Time' : 'Word'} Limit
              </h3>
              <p className="text-sm text-muted-foreground">
                Enter a custom {mode === 'time' ? 'time in seconds' : 'word count'} for your test.
              </p>
              <input
                type="number"
                autoFocus
                className="bg-background border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:border-primary transition-colors"
                value={customInputValue}
                onChange={(e) => setCustomInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') submitCustomConfig();
                  if (e.key === 'Escape') setShowCustomModal(false);
                }}
              />
              <div className="flex justify-end gap-2 mt-2">
                <button
                  onClick={() => setShowCustomModal(false)}
                  className="px-4 py-2 rounded-lg text-muted-foreground hover:text-foreground transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={submitCustomConfig}
                  className="px-4 py-2 bg-primary text-background rounded-lg font-medium hover:opacity-90 transition-opacity"
                >
                  OK
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Practice Modal */}
      <AnimatePresence>
        {showPracticeModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-card border border-border p-6 rounded-xl shadow-lg w-full max-w-sm flex flex-col gap-4"
            >
              <h3 className="text-lg font-bold text-foreground">
                Practice words
              </h3>
              <p className="text-sm text-muted-foreground">
                Practice the words you missed during the test.
                <br /><br />
                {wrongWordsList.length === 0 ? "You didn't miss any words!" : `You missed ${wrongWordsList.length} words.`}
              </p>

              <div className="flex justify-end gap-2 mt-4">
                <button
                  onClick={() => setShowPracticeModal(false)}
                  className="px-4 py-2 rounded-lg text-muted-foreground hover:text-foreground transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={startPractice}
                  disabled={wrongWordsList.length === 0}
                  className="px-4 py-2 bg-primary text-background rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Start
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

