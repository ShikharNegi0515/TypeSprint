import { useEffect, useState, useCallback, useRef } from 'react';
import { api } from '../../../lib/axios';
import { useSelector } from 'react-redux';
import { type RootState } from '../../../store';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { TypingArea } from '../../typing/components/TypingArea';
import { useTypingEngine } from '../../typing/hooks/useTypingEngine';

// ─── Types ───────────────────────────────────────────────────────────────────
interface Challenge {
  id: string;
  date: string;
  text: string;
  completed: boolean;
}

interface LeaderboardEntry {
  rank: number;
  userId: string;
  username: string;
  wpm: number;
  accuracy: number;
  completedAt: string;
}

// ─── Rank badge ──────────────────────────────────────────────────────────────
function RankBadge({ rank }: { rank: number }) {
  if (rank === 1) return <span className="text-yellow-400 font-black text-lg">🥇</span>;
  if (rank === 2) return <span className="text-slate-300 font-black text-lg">🥈</span>;
  if (rank === 3) return <span className="text-amber-600 font-black text-lg">🥉</span>;
  return <span className="text-muted-foreground font-bold text-sm w-5 text-center">{rank}</span>;
}

// ─── Countdown timer ─────────────────────────────────────────────────────────
function CountdownToMidnight() {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      // Calculate next local midnight
      const midnight = new Date();
      midnight.setHours(24, 0, 0, 0);
      const diff = midnight.getTime() - now.getTime();
      
      const h = Math.floor(diff / 3_600_000);
      const m = Math.floor((diff % 3_600_000) / 60_000);
      const s = Math.floor((diff % 60_000) / 1_000);
      setTimeLeft(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`);
    };
    tick();
    const id = setInterval(tick, 1_000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground" title="Local Server Time">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
      </svg>
      <span>resets in <span className="font-mono font-bold text-foreground">{timeLeft}</span> <span className="text-[10px] opacity-70 uppercase tracking-widest">local</span></span>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function DailyChallengePage() {
  const user = useSelector((state: RootState) => state.auth.user);
  const navigate = useNavigate();

  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [submitError, setSubmitError] = useState('');
  const [justCompleted, setJustCompleted] = useState(false);

  const resultSaved = useRef(false);

  // ─── Fetch challenge + leaderboard on mount ──────────────────────────────
  const fetchData = useCallback(async () => {
    try {
      const [cRes, lRes] = await Promise.all([
        api.get('/daily-challenge/today'),
        api.get('/daily-challenge/leaderboard'),
      ]);
      setChallenge(cRes.data);
      setLeaderboard(lRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setPageLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // ─── Typing engine ────────────────────────────────────────────────────────
  const {
    status,
    typedChars,
    wpm,
    rawWpm,
    accuracy,
    mistakes,
    timeElapsed,
  } = useTypingEngine({
    mode: 'words',
    timeLimit: 60,
    words: challenge?.text ?? '',
  });

  // ─── Auto-submit on finish ────────────────────────────────────────────────
  useEffect(() => {
    if (status === 'finished' && challenge && !resultSaved.current) {
      resultSaved.current = true;
      api.post('/daily-challenge/submit', {
        wpm,
        rawWpm,
        accuracy,
        mistakes,
        duration: timeElapsed,
      }).then(() => {
        setJustCompleted(true);
        setChallenge(prev => prev ? { ...prev, completed: true } : prev);
        fetchData(); // refresh leaderboard
      }).catch(err => {
        const msg = err?.response?.data?.message;
        setSubmitError(typeof msg === 'string' ? msg : 'Submission failed');
      });
    }
  }, [status, challenge, wpm, rawWpm, accuracy, mistakes, timeElapsed, fetchData]);

  // ─── Loading skeleton ─────────────────────────────────────────────────────
  if (pageLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-muted-foreground">
          <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm">Loading today's challenge…</p>
        </div>
      </div>
    );
  }

  const alreadyCompleted = challenge?.completed && !justCompleted;
  const d = new Date();
  const todayKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

  return (
    <div className="min-h-screen bg-background text-foreground font-mono flex flex-col items-center">
      {/* ── Header ── */}
      <header className="w-full max-w-5xl flex justify-between items-center px-6 py-5">
        <Link to="/" className="text-2xl font-bold tracking-tighter text-primary hover:opacity-80 transition-opacity">
          typesprint
        </Link>
        <div className="flex items-center gap-3">
          <CountdownToMidnight />
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
            {user?.username?.charAt(0).toUpperCase()}
          </div>
          <button onClick={() => navigate('/profile')} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            {user?.username}
          </button>
        </div>
      </header>

      <main className="w-full max-w-5xl px-6 pb-20 flex flex-col gap-8">
        {/* ── Hero banner ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-2xl border border-border bg-card p-8"
        >
          {/* decorative glow */}
          <div className="absolute -top-20 -left-20 w-72 h-72 rounded-full opacity-8 pointer-events-none"
            style={{ background: 'radial-gradient(circle, var(--primary), transparent 70%)' }} />

          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-3xl">⚡</span>
                <h1 className="text-3xl font-bold tracking-tight">Daily Challenge</h1>
              </div>
              <p className="text-sm text-muted-foreground">
                One challenge. Everyone types the same text. Compete globally.
              </p>
              <p className="text-xs text-muted-foreground mt-1 font-sans">{todayKey}</p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <span className={`px-3 py-1.5 rounded-full text-xs font-bold border ${alreadyCompleted || justCompleted
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                  : 'bg-primary/10 text-primary border-primary/30'
                }`}>
                {alreadyCompleted || justCompleted ? '✓ Completed' : '🎯 Active'}
              </span>
              <span className="text-xs text-muted-foreground">{leaderboard.length} participants</span>
            </div>
          </div>
        </motion.div>

        {/* ── Typing section ── */}
        <AnimatePresence mode="wait">
          {justCompleted ? (
            /* ── Just finished — show result card ── */
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="bg-card border border-border rounded-2xl p-10 flex flex-col items-center text-center gap-6"
            >
              <div className="text-5xl">🎉</div>
              <div>
                <h2 className="text-2xl font-bold">Challenge Complete!</h2>
                <p className="text-muted-foreground text-sm mt-1">Your result has been submitted to the leaderboard.</p>
              </div>
              <div className="grid grid-cols-3 gap-8">
                {[['WPM', wpm], ['Accuracy', `${accuracy}%`], ['Mistakes', mistakes]].map(([label, val]) => (
                  <div key={label as string}>
                    <p className="text-4xl font-bold text-primary">{val}</p>
                    <p className="text-xs uppercase tracking-widest text-muted-foreground mt-1">{label}</p>
                  </div>
                ))}
              </div>
              <p className="text-sm text-muted-foreground">Come back tomorrow for a new challenge!</p>
            </motion.div>
          ) : alreadyCompleted ? (
            /* ── Already completed today ── */
            <motion.div
              key="done"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card border border-border rounded-2xl p-10 flex flex-col items-center text-center gap-4"
            >
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-3xl">✅</div>
              <h2 className="text-xl font-bold">You've already completed today's challenge!</h2>
              <p className="text-sm text-muted-foreground max-w-sm">
                Your result is on the leaderboard below. Come back tomorrow for a fresh challenge.
              </p>
              <CountdownToMidnight />
            </motion.div>
          ) : (
            /* ── Active typing area ── */
            <motion.div
              key="typing"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card border border-border rounded-2xl p-8 flex flex-col gap-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold">Today's Text</h2>
                  <p className="text-xs text-muted-foreground mt-0.5">Type the passage below — one attempt only</p>
                </div>
                {status === 'running' && (
                  <span className="text-sm font-mono font-bold text-primary animate-pulse">typing…</span>
                )}
              </div>

              {submitError && (
                <div className="px-4 py-3 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-sm">
                  {submitError}
                </div>
              )}

              {challenge && (
                <TypingArea words={challenge.text} typedChars={typedChars} />
              )}

              <div className="flex items-center justify-between text-xs text-muted-foreground border-t border-border pt-4">
                <span>Start typing to begin • You get one attempt</span>
                <span className={`font-mono font-bold transition-colors ${status === 'running' ? 'text-primary' : ''}`}>
                  {status === 'running' ? `${wpm} wpm` : status === 'idle' ? 'ready' : ''}
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Leaderboard ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card border border-border rounded-2xl p-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold tracking-tight">Today's Leaderboard</h2>
              <p className="text-xs text-muted-foreground mt-0.5">Live rankings for {todayKey}</p>
            </div>
            <span className="text-xs bg-primary/10 text-primary border border-primary/20 px-3 py-1 rounded-full font-semibold">
              {leaderboard.length} entries
            </span>
          </div>

          {leaderboard.length === 0 ? (
            <div className="py-14 flex flex-col items-center gap-3 text-muted-foreground border border-dashed border-border rounded-xl">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" opacity={0.4}>
                <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/>
                <path d="M4 22h16"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>
              </svg>
              <p className="text-sm">No entries yet — be the first to complete today's challenge!</p>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {leaderboard.map((entry, i) => {
                const isMe = entry.userId === user?.id;
                return (
                  <motion.div
                    key={entry.userId}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className={`flex items-center gap-4 px-5 py-4 rounded-xl border transition-all ${
                      isMe
                        ? 'border-primary/40 bg-primary/5'
                        : 'border-border bg-muted/20 hover:bg-muted/40'
                    }`}
                  >
                    <div className="w-6 flex justify-center">
                      <RankBadge rank={entry.rank} />
                    </div>
                    <div className="flex-1 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-sm">
                        {entry.username.charAt(0).toUpperCase()}
                      </div>
                      <span className={`font-semibold ${isMe ? 'text-primary' : 'text-foreground'}`}>
                        {entry.username}
                        {isMe && <span className="ml-2 text-xs text-primary/60 font-normal">(you)</span>}
                      </span>
                    </div>
                    <div className="flex items-center gap-6 text-sm">
                      <div className="text-right">
                        <p className="font-bold text-foreground text-lg leading-none">{entry.wpm}</p>
                        <p className="text-xs text-muted-foreground">wpm</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-foreground text-lg leading-none">{entry.accuracy}%</p>
                        <p className="text-xs text-muted-foreground">acc</p>
                      </div>
                      <div className="text-right hidden sm:block">
                        <p className="text-xs text-muted-foreground">
                          {new Date(entry.completedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
}
