import { useEffect, useState, useRef, useCallback } from 'react';
import { useTypingEngine } from '../hooks/useTypingEngine';
import { TypingArea } from '../components/TypingArea';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../../../lib/axios';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const WORD_LIST = ["any", "old", "well", "be", "around", "here", "part", "that", "home", "of", "and", "mean", "make", "never", "both", "might", "other", "then", "become", "head", "have", "present", "show", "govern", "world", "year", "it", "point", "line", "think", "word", "too", "feel", "interest", "on", "could", "say", "hold", "increase", "must", "the", "to", "in", "a", "is", "you", "are", "for", "with", "as", "I", "his", "they", "at", "one", "this", "from", "or", "had", "by", "not", "but", "some", "what", "there", "we", "can", "out", "all", "were", "your", "when", "up", "use", "how", "said", "an", "each", "she", "which", "do", "their", "time", "if", "will", "way", "about", "many", "then", "them", "would", "write", "like", "so", "these", "her", "long", "make", "thing", "see", "him", "two", "has", "look", "more", "day", "go", "come", "did", "my", "sound", "no", "most", "number", "who", "over", "know", "water", "than", "call", "first", "people", "may", "down", "side", "been", "now", "find"];

function generateText(count: number) {
  let result = [];
  for (let i = 0; i < count; i++) {
    result.push(WORD_LIST[Math.floor(Math.random() * WORD_LIST.length)]);
  }
  return result.join(' ');
}

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

export default function TypingPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<'time' | 'words'>('time');
  const [timeConfig, setTimeConfig] = useState(25);
  const [wordsConfig, setWordsConfig] = useState(50);
  const [activeText, setActiveText] = useState(() => generateText(300));
  const resultSaved = useRef(false);

  const {
    status,
    timeElapsed,
    timeLeft,
    typedChars,
    wpm,
    rawWpm,
    accuracy,
    mistakes,
    history,
    reset: engineReset,
  } = useTypingEngine({ 
    mode, 
    timeLimit: timeConfig, 
    words: activeText 
  });

  const handleRestart = useCallback(() => {
    const wordCount = mode === 'words' ? wordsConfig : 300;
    setActiveText(generateText(wordCount));
    engineReset();
    resultSaved.current = false;
  }, [mode, wordsConfig, engineReset]);

  const handleModeChange = (newMode: 'time' | 'words') => {
    setMode(newMode);
    const wordCount = newMode === 'words' ? wordsConfig : 300;
    setActiveText(generateText(wordCount));
    engineReset();
    resultSaved.current = false;
  };

  const handleTimeConfigChange = (val: number) => {
    setTimeConfig(val);
    if (mode === 'time') {
      setActiveText(generateText(300));
      engineReset();
      resultSaved.current = false;
    }
  };

  const handleWordsConfigChange = (val: number) => {
    setWordsConfig(val);
    if (mode === 'words') {
      setActiveText(generateText(val));
      engineReset();
      resultSaved.current = false;
    }
  };

  useEffect(() => {
    if (status === 'finished' && !resultSaved.current) {
      resultSaved.current = true;
      api.post('/typing/results', {
        wpm,
        rawWpm,
        accuracy,
        mistakes,
        characterCount: typedChars.length,
        duration: mode === 'time' ? timeConfig : timeElapsed,
        mode: mode
      }).catch(console.error);
    }
    if (status !== 'finished') {
      resultSaved.current = false;
    }
  }, [status, wpm, rawWpm, accuracy, mistakes, timeConfig, timeElapsed, typedChars.length, mode]);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center p-8 font-mono relative">
      {/* Header */}
      <header className="w-full max-w-5xl flex justify-between items-center py-4 text-muted-foreground">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold tracking-tighter text-foreground flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2" ry="2"></rect><path d="M6 8h.01"></path><path d="M10 8h.01"></path><path d="M14 8h.01"></path><path d="M18 8h.01"></path><path d="M6 12h.01"></path><path d="M10 12h.01"></path><path d="M14 12h.01"></path><path d="M18 12h.01"></path><path d="M7 16h10"></path></svg>
            typesprint
          </h1>
          <button className="hover:text-foreground transition-colors p-2"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg></button>
          <button onClick={() => navigate('/multiplayer')} className="hover:text-foreground transition-colors p-2"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg></button>
          <button onClick={() => navigate('/leaderboard')} className="hover:text-foreground transition-colors p-2"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg></button>
        </div>
        <div className="flex items-center gap-4">
          <button className="hover:text-foreground transition-colors"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg></button>
          <button onClick={() => navigate('/profile')} className="hover:text-foreground transition-colors"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></button>
        </div>
      </header>

      {/* Main Settings Bar */}
      <div className={`mt-8 flex items-center justify-center bg-card rounded-xl px-6 py-2 gap-6 text-sm font-medium text-muted-foreground shadow-sm transition-opacity duration-200 ${status === 'idle' ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className="flex gap-4 items-center border-r border-border pr-6">
          <button className="hover:text-foreground transition-colors flex items-center gap-1.5"><span className="text-primary text-xs">@</span> punctuation</button>
          <button className="hover:text-foreground transition-colors flex items-center gap-1.5"><span className="text-primary text-xs">#</span> numbers</button>
        </div>
        <div className="flex gap-4 items-center border-r border-border pr-6">
          <button onClick={() => handleModeChange('time')} className={`hover:text-foreground transition-colors flex items-center gap-1.5 ${mode === 'time' ? 'text-primary' : ''}`}><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> time</button>
          <button onClick={() => handleModeChange('words')} className={`hover:text-foreground transition-colors flex items-center gap-1.5 ${mode === 'words' ? 'text-primary' : ''}`}><span className="text-xs font-bold font-sans tracking-tight">A</span> words</button>
          <button className="hover:text-foreground transition-colors flex items-center gap-1.5"><span className="text-xs font-serif font-black tracking-tighter">""</span> quote</button>
          <button className="hover:text-foreground transition-colors flex items-center gap-1.5"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg> zen</button>
          <button className="hover:text-foreground transition-colors flex items-center gap-1.5"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/><path d="m15 5 4 4"/></svg> custom</button>
        </div>
        <div className="flex gap-4 items-center">
          {[10, 25, 50, 100].map((t) => {
            const isActive = mode === 'time' ? timeConfig === t : wordsConfig === t;
            return (
              <button
                key={t}
                onClick={() => { mode === 'time' ? handleTimeConfigChange(t) : handleWordsConfigChange(t); }}
                className={`hover:text-foreground transition-colors ${isActive ? 'text-primary' : ''}`}
              >
                {t}
              </button>
            );
          })}
          <button className="hover:text-foreground transition-colors flex items-center"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/></svg></button>
        </div>
      </div>

      {/* Language / Mode info */}
      <div className={`mt-16 text-muted-foreground text-sm flex items-center gap-2 transition-opacity duration-200 ${status === 'idle' ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>
        english
      </div>

      <AnimatePresence mode="wait">
        {status === 'finished' ? (
          <motion.div
            key="results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full max-w-[1000px] mt-8"
          >
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
                  <LineChart data={history} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <XAxis dataKey="time" tick={{ fill: 'hsl(var(--muted-foreground))' }} tickLine={false} axisLine={false} />
                    <YAxis tick={{ fill: 'hsl(var(--muted-foreground))' }} tickLine={false} axisLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '0.5rem' }}
                      itemStyle={{ color: 'hsl(var(--foreground))' }}
                    />
                    <Line type="monotone" dataKey="wpm" stroke="hsl(var(--primary))" strokeWidth={3} dot={false} activeDot={{ r: 6 }} />
                    <Line type="monotone" dataKey="raw" stroke="hsl(var(--muted-foreground))" strokeWidth={2} dot={false} opacity={0.5} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Bottom Stats Row */}
            <div className="grid grid-cols-6 gap-4 w-full mt-10 pl-2">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">test type</p>
                <p className="text-xl text-primary font-semibold">{mode} {mode === 'time' ? timeConfig : wordsConfig}<br/>english</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">other</p>
                <p className="text-xl text-foreground font-semibold">none</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">raw</p>
                <p className="text-4xl text-foreground font-semibold">{rawWpm}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">characters</p>
                <p className="text-4xl text-foreground font-semibold">{typedChars.length}/{mistakes}/0/0</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">consistency</p>
                <p className="text-4xl text-foreground font-semibold">0%</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">time</p>
                <p className="text-4xl text-foreground font-semibold">{mode === 'time' ? timeConfig : formatTime(timeElapsed)}s</p>
              </div>
            </div>
            
            <div className="flex justify-center mt-16">
              <button
                onClick={handleRestart}
                className="text-muted-foreground hover:text-foreground transition-colors p-4"
                title="Restart"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="typing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full max-w-5xl flex flex-col items-center mt-8 relative"
          >
            {/* Timer / Word count */}
            <div className={`w-full max-w-[1000px] text-left mb-4 transition-opacity duration-300 ${status === 'running' ? 'opacity-100' : 'opacity-0'}`}>
              <div className="text-3xl font-bold tracking-tight text-primary font-sans select-none flex items-baseline gap-1">
                {mode === 'time' ? (
                  timeLeft
                ) : (
                  <>
                    <span>{typedChars.split(' ').length}</span>
                    <span className="text-muted-foreground/50 text-xl font-medium">/ {wordsConfig}</span>
                  </>
                )}
              </div>
            </div>
            
            <TypingArea words={activeText} typedChars={typedChars} />
            
            <div className={`mt-12 text-muted-foreground flex justify-center transition-opacity duration-200 ${status === 'idle' ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
              <button
                onClick={handleRestart}
                className="hover:text-foreground transition-colors p-2"
                title="Restart"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer Hints */}
      <div className="mt-auto mb-16 text-center space-y-2">
        <p className="text-muted-foreground text-xs"><span className="bg-card px-1.5 py-0.5 rounded text-foreground font-semibold">tab</span> + <span className="bg-card px-1.5 py-0.5 rounded text-foreground font-semibold">enter</span> - restart test</p>
        <p className="text-muted-foreground text-xs"><span className="bg-card px-1.5 py-0.5 rounded text-foreground font-semibold">escape</span> or <span className="bg-card px-1.5 py-0.5 rounded text-foreground font-semibold">ctrl</span> + <span className="bg-card px-1.5 py-0.5 rounded text-foreground font-semibold">shift</span> + <span className="bg-card px-1.5 py-0.5 rounded text-foreground font-semibold">p</span> - command line</p>
      </div>

      {/* Bottom Nav */}
      <footer className="w-full max-w-5xl flex justify-between text-xs text-muted-foreground mb-4">
        <div className="flex gap-4">
          <a href="#" className="hover:text-foreground transition-colors flex items-center gap-1"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg> contact</a>
          <a href="#" className="hover:text-foreground transition-colors flex items-center gap-1"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg> support</a>
          <a href="#" className="hover:text-foreground transition-colors flex items-center gap-1"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg> github</a>
          <a href="#" className="hover:text-foreground transition-colors flex items-center gap-1"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.5 12h-19"/><path d="M8.5 21a11.9 11.9 0 0 1 0-18"/><path d="M15.5 3a11.9 11.9 0 0 1 0 18"/></svg> discord</a>
          <a href="#" className="hover:text-foreground transition-colors flex items-center gap-1"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg> twitter</a>
          <a href="#" className="hover:text-foreground transition-colors flex items-center gap-1"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M7 7h10"/><path d="M7 12h10"/><path d="M7 17h10"/></svg> terms</a>
          <a href="#" className="hover:text-foreground transition-colors flex items-center gap-1"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg> security</a>
          <a href="#" className="hover:text-foreground transition-colors flex items-center gap-1"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg> privacy</a>
        </div>
        <div className="flex gap-4">
          <button className="hover:text-foreground transition-colors flex items-center gap-1"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="m16.5 16.5-4.5-4.5V6"/></svg> serika dark</button>
          <span className="flex items-center gap-1"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 10h3a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h3"/><path d="M6 4v6"/><path d="M18 4v6"/><path d="M10 2h4"/></svg> v1.0.0</span>
        </div>
      </footer>
    </div>
  );
}

