import { useEffect, useState } from 'react';
import { api } from '../../../lib/axios';
import { useSelector } from 'react-redux';
import { type RootState } from '../../../store';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../../../store/slices/authSlice';
import { motion, AnimatePresence } from 'framer-motion';
import { ThemeBuilder } from '../components/ThemeBuilder';

// ─── Keyboard layout ────────────────────────────────────────────────────────
const ROWS = [
  ['q','w','e','r','t','y','u','i','o','p','[',']'],
  ['a','s','d','f','g','h','j','k','l',';',"'"],
  ['z','x','c','v','b','n','m',',','.','/' ],
];

const ROW_OFFSETS = [0, 18, 36]; // px indent per row

// ─── Stat card ───────────────────────────────────────────────────────────────
function StatCard({ label, value, accent = false, icon }: { label: string; value: string | number; accent?: boolean; icon: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden bg-card border border-border rounded-2xl p-6 flex flex-col gap-3"
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">{label}</span>
        <span className="text-muted-foreground opacity-60">{icon}</span>
      </div>
      <p className={`text-5xl font-bold tracking-tighter leading-none ${accent ? 'text-primary' : 'text-foreground'}`}>
        {value}
      </p>
      {accent && (
        <div className="absolute inset-x-0 bottom-0 h-1 bg-primary/40 rounded-b-2xl" />
      )}
    </motion.div>
  );
}

// ─── Key component ───────────────────────────────────────────────────────────
function Key({ char, missCount, maxMisses, isSpaceBar = false }: { char: string; missCount: number; maxMisses: number; isSpaceBar?: boolean }) {
  const [hovered, setHovered] = useState(false);
  const ratio = maxMisses > 0 ? missCount / maxMisses : 0;

  let bg = 'var(--muted)';
  let textColor = 'var(--muted-foreground)';
  let border = '1px solid var(--border)';
  let shadow = 'inset 0 -3px 0 rgba(0, 0, 0, 0.32), inset 0 1px 1px rgba(255,255,255,0.06), 0 3px 6px rgba(0,0,0,0.18)';
  let scale = 1;

  if (ratio > 0) {
    let colorVal = '';
    if (ratio < 0.35) {
      const p = ratio / 0.35;
      colorVal = `color-mix(in srgb, #f59e0b ${Math.round(p * 100)}%, var(--muted))`;
      textColor = 'var(--foreground)';
      border = '1px solid rgba(245, 158, 11, 0.4)';
    } else if (ratio < 0.7) {
      const p = (ratio - 0.35) / 0.35;
      colorVal = `color-mix(in srgb, #ef4444 ${Math.round(p * 100)}%, #f59e0b)`;
      textColor = '#fff';
      border = '1px solid rgba(239, 68, 68, 0.6)';
      shadow = 'inset 0 -3px 0 rgba(0,0,0,0.4), inset 0 1px 1px rgba(255,255,255,0.14), 0 4px 12px rgba(239,68,68,0.25)';
    } else {
      const p = (ratio - 0.7) / 0.3;
      colorVal = `color-mix(in srgb, #ec4899 ${Math.round(p * 100)}%, #ef4444)`;
      textColor = '#fff';
      border = '1px solid rgba(236, 72, 153, 0.75)';
      shadow = 'inset 0 -3px 0 rgba(0,0,0,0.45), inset 0 1px 1px rgba(255,255,255,0.22), 0 6px 18px rgba(236,72,153,0.38)';
    }
    bg = colorVal;
    scale = 1 + ratio * 0.07;
  } else {
    // Normal keycaps style
    bg = 'color-mix(in srgb, var(--card) 85%, var(--muted))';
    border = '1px solid rgba(255, 255, 255, 0.055)';
    textColor = 'var(--muted-foreground)';
  }

  const width = isSpaceBar ? 260 : 46;
  const height = 46;

  return (
    <div className="relative" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      <motion.div
        animate={{ scale }}
        whileHover={{ y: -2 }}
        transition={{ type: 'spring', stiffness: 450, damping: 20 }}
        style={{
          background: bg,
          color: textColor,
          boxShadow: shadow,
          width,
          height,
          borderRadius: 9,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: isSpaceBar ? 11 : 15,
          fontWeight: ratio > 0 ? 800 : 600,
          fontFamily: 'monospace',
          textTransform: 'uppercase',
          cursor: 'default',
          userSelect: 'none',
          border,
          position: 'relative',
          overflow: 'hidden',
          transition: 'background 0.25s, border-color 0.25s',
        }}
      >
        {isSpaceBar ? (
          <span>space {missCount > 0 ? `· ${missCount} misses` : ''}</span>
        ) : (
          <span>{char}</span>
        )}

        {missCount > 0 && !isSpaceBar && (
          <span
            className="absolute top-1 right-1.5 text-[8.5px] font-black"
            style={{
              color: ratio > 0.4 ? '#fff' : 'var(--muted-foreground)',
              opacity: ratio > 0.4 ? 1 : 0.7,
            }}
          >
            {missCount}
          </span>
        )}

        {/* Shimmer line indicator inside key */}
        {ratio > 0 && (
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              height: 2.5,
              width: `${ratio * 100}%`,
              background: ratio > 0.7 ? '#ec4899' : ratio > 0.35 ? '#ef4444' : '#f59e0b',
              borderRadius: '0 0 9px 9px',
            }}
          />
        )}
      </motion.div>

      {/* Tooltip */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, y: 4, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.9 }}
            transition={{ duration: 0.12 }}
            style={{
              position: 'absolute',
              bottom: '115%',
              left: '50%',
              transform: 'translateX(-50%)',
              background: 'var(--card)',
              border: '1px solid var(--border)',
              borderRadius: 8,
              padding: '4px 10px',
              whiteSpace: 'nowrap',
              fontSize: 11,
              color: 'var(--foreground)',
              zIndex: 50,
              pointerEvents: 'none',
              boxShadow: '0 4px 16px rgba(0,0,0,0.35)',
            }}
          >
            <span style={{ color: 'var(--muted-foreground)' }}>
              {isSpaceBar ? 'SPACE' : char.toUpperCase()}
            </span>
            {missCount > 0 ? (
              <span
                style={{
                  color: ratio > 0.7 ? '#ec4899' : ratio > 0.35 ? '#ef4444' : '#f59e0b',
                  fontWeight: 700,
                  marginLeft: 6
                }}
              >
                {missCount} miss{missCount !== 1 ? 'es' : ''}
              </span>
            ) : (
              <span style={{ color: 'var(--muted-foreground)', marginLeft: 6 }}>clean</span>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Heatmap legend ──────────────────────────────────────────────────────────
function HeatmapLegend() {
  return (
    <div className="flex items-center gap-3 text-xs text-muted-foreground">
      <span>few</span>
      <div
        className="h-2 w-36 rounded-full"
        style={{
          background: 'linear-gradient(to right, var(--muted), #f59e0b, #ef4444, #ec4899)',
        }}
      />
      <span>many</span>
    </div>
  );
}

// ─── Main page ───────────────────────────────────────────────────────────────
export default function ProfilePage() {
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [stats, setStats] = useState<any>(null);
  const [analytics, setAnalytics] = useState<any[]>([]);
  const [achievements, setAchievements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const [statsRes, analyticsRes, achRes] = await Promise.allSettled([
          api.get('/typing/stats'),
          api.get('/typing/analytics'),
          api.get('/achievements/progress'),
        ]);
        if (statsRes.status === 'fulfilled') setStats(statsRes.value.data);
        if (analyticsRes.status === 'fulfilled') setAnalytics(analyticsRes.value.data);
        if (achRes.status === 'fulfilled') setAchievements(achRes.value.data);
      } catch (error) {
        console.error('Failed to fetch profile data', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const heatmap: Record<string, number> = stats?.heatmap || {};
  const maxMisses = Object.values(heatmap).length > 0 ? Math.max(...(Object.values(heatmap) as number[])) : 0;
  const totalMisses = Object.values(heatmap).reduce((a: number, b) => a + (b as number), 0);

  const mostMissedKey = maxMisses > 0
    ? Object.entries(heatmap).sort(([, a], [, b]) => (b as number) - (a as number))[0]?.[0]
    : null;

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center font-mono">
      {/* ── Top Nav ── */}
      <header className="w-full max-w-5xl flex justify-between items-center px-6 py-5">
        <Link to="/" className="text-2xl font-bold tracking-tighter text-primary hover:opacity-80 transition-opacity">
          typesprint
        </Link>
        <div className="flex items-center gap-3">
          <Link to="/daily" title="Daily Challenge" className="p-2 rounded-lg hover:bg-card text-muted-foreground hover:text-foreground transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
          </Link>
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
            {user?.username?.charAt(0).toUpperCase()}
          </div>
          <span className="text-sm text-muted-foreground">{user?.username}</span>
          <button
            onClick={handleLogout}
            title="Logout"
            className="ml-1 p-2 rounded-lg hover:bg-card text-muted-foreground hover:text-foreground transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
          </button>
        </div>
      </header>

      <main className="w-full max-w-5xl px-6 pb-16 flex flex-col gap-8">
        {/* ── Hero ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-2xl border border-border bg-card p-8 flex flex-col sm:flex-row items-center sm:items-start gap-6"
        >
          {/* decorative primary blob */}
          <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full opacity-10"
            style={{ background: 'radial-gradient(circle, var(--primary), transparent 70%)' }} />

          <div className="relative z-10 w-20 h-20 rounded-2xl bg-primary/20 border border-primary/30 flex items-center justify-center text-primary text-4xl font-bold flex-shrink-0">
            {user?.username?.charAt(0).toUpperCase()}
          </div>
          <div className="relative z-10 flex flex-col gap-1 text-center sm:text-left">
            <h1 className="text-3xl font-bold tracking-tighter text-foreground">{user?.username}</h1>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
            <div className="flex flex-wrap gap-3 mt-3 justify-center sm:justify-start">
              <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold border border-primary/20">
                {stats?.totalTests || 0} tests
              </span>
              <span className="px-3 py-1 rounded-full bg-muted text-muted-foreground text-xs font-semibold border border-border">
                {achievements.length} achievements
              </span>
              {mostMissedKey && (
                <span className="px-3 py-1 rounded-full text-xs font-semibold border"
                  style={{ background: 'color-mix(in srgb, var(--destructive) 15%, transparent)', color: 'var(--destructive)', borderColor: 'color-mix(in srgb, var(--destructive) 30%, transparent)' }}>
                  weakest: <strong className="uppercase">{mostMissedKey}</strong>
                </span>
              )}
            </div>
          </div>
        </motion.div>

        {/* ── Stat Cards ── */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-card border border-border rounded-2xl p-6 h-28 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard label="Tests Taken" value={stats?.totalTests || 0} icon={
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
            } />
            <StatCard label="Avg WPM" value={stats?.averageWpm || 0} icon={
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
            } />
            <StatCard label="Avg Accuracy" value={`${stats?.averageAccuracy || 0}%`} icon={
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>
            } />
            <StatCard label="Personal Best" value={stats?.personalBest || 0} accent icon={
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>
            } />
          </div>
        )}

        {/* ── Theme Builder ── */}
        <ThemeBuilder />

        {/* ── WPM Chart ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card border border-border rounded-2xl p-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold tracking-tight">WPM Progress</h2>
              <p className="text-xs text-muted-foreground mt-0.5">Your typing speed over time</p>
            </div>
            <span className="text-xs text-muted-foreground bg-muted px-3 py-1 rounded-full border border-border">
              {analytics.length} sessions
            </span>
          </div>
          <div className="h-64 w-full">
            {analytics.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={analytics} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gradWpm" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.35} />
                      <stop offset="100%" stopColor="var(--primary)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                  <XAxis dataKey="date" tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', borderRadius: 10, fontSize: 12 }}
                    itemStyle={{ color: 'var(--foreground)' }}
                    labelStyle={{ color: 'var(--muted-foreground)' }}
                  />
                  <Area type="monotone" dataKey="wpm" stroke="var(--primary)" strokeWidth={2.5} fillOpacity={1} fill="url(#gradWpm)" dot={false} activeDot={{ r: 5, fill: 'var(--primary)' }} />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-muted-foreground">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" opacity={0.4}><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
                <p className="text-sm">No typing sessions yet — start a test!</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* ── Heatmap ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-card border border-border rounded-2xl p-8"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h2 className="text-xl font-bold tracking-tight">Key Heatmap</h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Keys you miss most often — darker = more errors
              </p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <HeatmapLegend />
              {totalMisses > 0 && (
                <span className="text-xs text-muted-foreground">{totalMisses} total errors tracked</span>
              )}
            </div>
          </div>

          {/* Keyboard */}
          <div className="flex flex-col items-center gap-2 select-none">
            {ROWS.map((row, rIdx) => (
              <div key={rIdx} className="flex gap-1.5" style={{ paddingLeft: ROW_OFFSETS[rIdx] }}>
                {row.map(char => (
                  <Key
                    key={char}
                    char={char}
                    missCount={heatmap[char] || 0}
                    maxMisses={maxMisses}
                  />
                ))}
              </div>
            ))}

            {/* Space bar */}
            <div className="mt-1" style={{ paddingLeft: ROW_OFFSETS[1] }}>
              <motion.div
                style={{
                  background: heatmap[' '] ? `color-mix(in srgb, var(--destructive) ${Math.round(((heatmap[' '] || 0) / Math.max(maxMisses, 1)) * 80 + 10)}%, var(--muted))` : 'var(--muted)',
                  border: '1px solid var(--border)',
                  borderRadius: 8,
                  height: 36,
                  width: 220,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 11,
                  color: 'var(--muted-foreground)',
                  fontFamily: 'monospace',
                }}
              >
                space {heatmap[' '] ? `· ${heatmap[' ']} misses` : ''}
              </motion.div>
            </div>
          </div>

          {/* Top missed keys summary */}
          {Object.keys(heatmap).length > 0 && (
            <div className="mt-8 pt-6 border-t border-border">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">Most Missed</p>
              <div className="flex flex-wrap gap-2.5">
                {Object.entries(heatmap)
                  .sort(([, a], [, b]) => (b as number) - (a as number))
                  .slice(0, 8)
                  .map(([char, count], i) => {
                    const r = maxMisses > 0 ? (count as number) / maxMisses : 0;
                    let kbdBg = 'var(--card)';
                    let kbdColor = 'var(--foreground)';
                    let kbdBorder = 'var(--border)';
                    
                    if (r > 0) {
                      if (r < 0.35) {
                        kbdBg = 'color-mix(in srgb, #f59e0b 15%, var(--card))';
                        kbdColor = '#f59e0b';
                        kbdBorder = 'rgba(245, 158, 11, 0.4)';
                      } else if (r < 0.7) {
                        kbdBg = 'color-mix(in srgb, #ef4444 15%, var(--card))';
                        kbdColor = '#ef4444';
                        kbdBorder = 'rgba(239, 68, 68, 0.6)';
                      } else {
                        kbdBg = 'color-mix(in srgb, #ec4899 15%, var(--card))';
                        kbdColor = '#ec4899';
                        kbdBorder = 'rgba(236, 72, 153, 0.75)';
                      }
                    }

                    return (
                      <div key={char} className="flex items-center gap-3 px-3.5 py-2 rounded-xl border bg-muted/40 transition-colors hover:bg-muted/80" style={{ borderColor: 'var(--border)' }}>
                        <span className="text-[10px] font-black text-muted-foreground opacity-60 w-4 text-right">#{i + 1}</span>
                        <kbd
                          className="text-xs font-mono font-bold uppercase px-2 py-0.5 rounded-md"
                          style={{ background: kbdBg, color: kbdColor, border: `1px solid ${kbdBorder}`, boxShadow: `0 2px 6px ${kbdBorder.replace('0.', '0.1')}` }}
                        >
                          {char === ' ' ? 'SPC' : char}
                        </kbd>
                        <div className="flex items-baseline gap-1 w-14">
                          <span className="text-sm font-bold" style={{ color: kbdColor }}>{count as number}</span>
                          <span className="text-[9px] font-semibold text-muted-foreground uppercase tracking-widest opacity-70">miss</span>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}
        </motion.div>

        {/* ── Achievements Showcase ── */}
        <AchievementsShowcase achievements={achievements} loading={loading} />
      </main>
    </div>
  );
}

// ─── Types ───────────────────────────────────────────────────────────────────
type AchievementRarity = 'common' | 'rare' | 'epic' | 'legendary';
type AchievementCategory = 'speed' | 'accuracy' | 'volume' | 'time' | 'special';

interface Achievement {
  id: string; title: string; description: string; hint: string;
  icon: string; color: string;
  category: AchievementCategory; rarity: AchievementRarity;
  unlocked: boolean; unlockedAt: string | null;
  progress: { current: number; required: number; unit?: string } | null;
}

// ─── Rarity palette — each tier has escalating visual weight ────────────────
const R = {
  common: {
    label: 'Common',    stars: 1,
    strip: '#6b7280',   glow: '107,114,128', dot: '#9ca3af',
    grad: '#6b7280, #9ca3af',
    pulse: false, animBorder: false,
    lockedBorder: 0.20, lockedBg: 0.04, lockedStrip: 0.20,
    stripH: '2px', borderW: '1px', iconSize: '62px', iconR: '14px',
  },
  rare: {
    label: 'Rare',      stars: 2,
    strip: '#3b82f6',   glow: '59,130,246',  dot: '#60a5fa',
    grad: '#1d4ed8, #3b82f6, #60a5fa',
    pulse: false, animBorder: false,
    lockedBorder: 0.30, lockedBg: 0.07, lockedStrip: 0.35,
    stripH: '3px', borderW: '1px', iconSize: '66px', iconR: '16px',
  },
  epic: {
    label: 'Epic',      stars: 3,
    strip: '#a855f7',   glow: '168,85,247',  dot: '#c084fc',
    grad: '#7c3aed, #a855f7, #c084fc, #a855f7, #7c3aed',
    pulse: true, animBorder: false,
    lockedBorder: 0.40, lockedBg: 0.10, lockedStrip: 0.55,
    stripH: '4px', borderW: '1.5px', iconSize: '70px', iconR: '18px',
  },
  legendary: {
    label: 'Legendary', stars: 4,
    strip: '#f59e0b',   glow: '245,158,11',  dot: '#fbbf24',
    grad: '#d97706, #f59e0b, #fbbf24, #fde68a, #fbbf24, #f59e0b, #d97706',
    pulse: true, animBorder: true,
    lockedBorder: 0.50, lockedBg: 0.12, lockedStrip: 0.70,
    stripH: '3px', borderW: '0px', iconSize: '76px', iconR: '20px',
  },
} satisfies Record<AchievementRarity, {
  label: string; stars: number; strip: string; glow: string; dot: string; grad: string;
  pulse: boolean; animBorder: boolean;
  lockedBorder: number; lockedBg: number; lockedStrip: number;
  stripH: string; borderW: string; iconSize: string; iconR: string;
}>;

const CATEGORY_META: Record<AchievementCategory | 'all', { icon: string; label: string; color: string }> = {
  all:      { icon: '🌟', label: 'All',      color: 'var(--primary)' },
  speed:    { icon: '⚡', label: 'Speed',    color: '#f59e0b' },
  accuracy: { icon: '🎯', label: 'Accuracy', color: '#ef4444' },
  volume:   { icon: '📊', label: 'Volume',   color: '#3b82f6' },
  time:     { icon: '⏱️', label: 'Time',     color: '#8b5cf6' },
  special:  { icon: '✨', label: 'Special',  color: '#10b981' },
};

// ─── Corner ornaments (L-shaped brackets in card corners) ─────────────────────
function CornerOrnaments({ color, opacity = 1 }: { color: string; opacity?: number }) {
  const s: React.CSSProperties = { position: 'absolute', width: 14, height: 14, opacity, pointerEvents: 'none' };
  const b = `1.5px solid ${color}`;
  return (
    <>
      <div style={{ ...s, top: 6, left: 6, borderTop: b, borderLeft: b, borderRadius: '3px 0 0 0' }} />
      <div style={{ ...s, top: 6, right: 6, borderTop: b, borderRight: b, borderRadius: '0 3px 0 0' }} />
      <div style={{ ...s, bottom: 6, left: 6, borderBottom: b, borderLeft: b, borderRadius: '0 0 0 3px' }} />
      <div style={{ ...s, bottom: 6, right: 6, borderBottom: b, borderRight: b, borderRadius: '0 0 3px 0' }} />
    </>
  );
}

// ─── Rotating gradient border wrapper (Legendary only) ───────────────────────
function LegendaryBorderWrapper({ children, unlocked }: { children: React.ReactNode; unlocked: boolean }) {
  return (
    <div className="relative rounded-[20px] overflow-hidden" style={{ padding: '2px' }}>
      {/* Rotating conic gradient — forms the animated border */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: unlocked
            ? 'conic-gradient(from 0deg, #d97706, #f59e0b, #fbbf24, #fde68a, #fbbf24, #f59e0b, #ea580c, #d97706)'
            : 'conic-gradient(from 0deg, rgba(180,83,9,0.6), rgba(245,158,11,0.45), rgba(251,191,36,0.25), rgba(245,158,11,0.45), rgba(180,83,9,0.6))',
        }}
        animate={{ rotate: [0, 360] }}
        transition={{ repeat: Infinity, duration: unlocked ? 3.5 : 7, ease: 'linear' }}
      />
      {/* Outer glow layer */}
      {unlocked && (
        <motion.div
          className="absolute inset-0 rounded-[20px]"
          style={{ boxShadow: '0 0 28px rgba(245,158,11,0.55), 0 0 56px rgba(245,158,11,0.2)' }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
        />
      )}
      {/* Inner card surface */}
      <div className="relative rounded-[18px] overflow-hidden" style={{ background: 'var(--card)' }}>
        {children}
      </div>
    </div>
  );
}

// ─── Achievement Card ─────────────────────────────────────────────────────────
function AchievementCard({ ach, idx }: { ach: Achievement; idx: number }) {
  const r        = R[ach.rarity];
  const catMeta  = CATEGORY_META[ach.category];
  const progressPct = ach.progress
    ? Math.min(100, Math.round((ach.progress.current / ach.progress.required) * 100))
    : 0;
  const barPct      = ach.unlocked ? 100 : progressPct;
  const isLegendary = ach.rarity === 'legendary';
  const isEpic      = ach.rarity === 'epic';
  const isEpicPlus  = isEpic || isLegendary;
  const borderOpacity = ach.unlocked ? 0.65 : r.lockedBorder;
  const bgOpacity     = ach.unlocked ? 0.16 : r.lockedBg;

  // Inner card JSX (shared between legendary wrapper and regular card)
  const inner = (
    <>
      {/* ── Accent strip ── */}
      <div
        className="w-full shrink-0"
        style={{
          height: r.stripH,
          background: ach.unlocked
            ? `linear-gradient(90deg, transparent, ${r.strip} 20%, ${ach.color} 50%, ${r.strip} 80%, transparent)`
            : `linear-gradient(90deg, transparent, rgba(${r.glow},${r.lockedStrip}) 35%, rgba(${r.glow},${r.lockedStrip}) 65%, transparent)`,
        }}
      />

      {/* ── Category watermark ── */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
        style={{ fontSize: '7rem', opacity: ach.unlocked ? 0.04 : 0.025, zIndex: 0 }}
        aria-hidden
      >
        {catMeta.icon}
      </div>

      {/* ── Shimmer sweep (all rarities when unlocked, also locked legendary) ── */}
      {(ach.unlocked || isLegendary) && (
        <motion.div
          className="absolute inset-0 pointer-events-none z-10"
          style={{ background: 'linear-gradient(110deg, transparent 28%, rgba(255,255,255,0.07) 50%, transparent 72%)' }}
          animate={{ x: ['-130%', '230%'] }}
          transition={{
            repeat: Infinity,
            duration: isLegendary && !ach.unlocked ? 10 : isLegendary ? 3.5 : 6,
            ease: 'easeInOut',
            repeatDelay: isLegendary ? 1.5 : 3,
          }}
        />
      )}

      {/* ── Breathing radial glow (epic+ unlocked) ── */}
      {ach.unlocked && isEpicPlus && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{ background: `radial-gradient(ellipse at 50% 35%, rgba(${r.glow},0.14) 0%, transparent 65%)` }}
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ repeat: Infinity, duration: 2.8, ease: 'easeInOut' }}
        />
      )}

      {/* ── Corner ornaments (epic+) ── */}
      {isEpicPlus && <CornerOrnaments color={r.dot} opacity={ach.unlocked ? 0.7 : 0.3} />}

      {/* ── Card body ── */}
      <div className="relative z-10 flex flex-col items-center text-center flex-1 px-4 pt-3 pb-3 gap-2.5">

        {/* Row 1: rarity badge | star dots | status indicator */}
        <div className="w-full flex items-center justify-between">
          <span
            className="text-[8px] font-black uppercase tracking-[0.18em] px-2 py-0.5 rounded-full"
            style={{
              color: ach.unlocked ? r.dot : 'var(--muted-foreground)',
              background: ach.unlocked ? `rgba(${r.glow},0.15)` : 'var(--muted)',
              border: `1px solid ${ach.unlocked ? `rgba(${r.glow},0.38)` : 'var(--border)'}`,
              opacity: ach.unlocked ? 1 : 0.8,
            }}
          >
            {r.label}
          </span>

          {/* Star dots */}
          <div className="flex gap-[3px] items-center">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="rounded-full"
                style={{
                  width:  i < r.stars ? '6px' : '4px',
                  height: i < r.stars ? '6px' : '4px',
                  background: i < r.stars
                    ? ach.unlocked ? r.dot : 'var(--muted-foreground)'
                    : 'var(--border)',
                  opacity: i < r.stars ? (ach.unlocked ? 1 : 0.65) : 0.25,
                  boxShadow: i < r.stars && ach.unlocked ? `0 0 5px ${r.strip}` : 'none',
                  transition: 'all 0.3s',
                }}
              />
            ))}
          </div>

          {/* Status */}
          {ach.unlocked ? (
            <motion.div
              className="rounded-full"
              style={{
                width: '10px', height: '10px',
                background: r.dot,
                boxShadow: `0 0 8px ${r.strip}, 0 0 16px rgba(${r.glow},0.35)`,
              }}
              animate={r.pulse ? { scale: [1, 1.4, 1], opacity: [0.7, 1, 0.7] } : {}}
              transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
            />
          ) : (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
              style={{ color: 'var(--muted-foreground)', opacity: 0.65 }}>
              <rect width="18" height="11" x="3" y="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
          )}
        </div>

        {/* Icon */}
        <div className="relative flex items-center justify-center">
          {ach.unlocked && isEpicPlus && (
            <motion.div
              className="absolute"
              style={{
                inset: '-6px',
                borderRadius: `calc(${r.iconR} + 6px)`,
                boxShadow: isLegendary
                  ? `0 0 22px rgba(${r.glow},0.7), 0 0 44px rgba(${r.glow},0.28)`
                  : `0 0 16px rgba(${r.glow},0.55), 0 0 30px rgba(${r.glow},0.18)`,
              }}
              animate={{ opacity: [0.3, 0.9, 0.3] }}
              transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
            />
          )}
          <div
            className="flex items-center justify-center relative overflow-hidden"
            style={{
              width: r.iconSize, height: r.iconSize,
              borderRadius: r.iconR,
              fontSize: `calc(${r.iconSize} * 0.46)`,
              background: ach.unlocked
                ? `radial-gradient(circle at 35% 25%, rgba(${r.glow},0.4), color-mix(in srgb, ${ach.color} 20%, var(--muted)))`
                : `radial-gradient(circle at 35% 25%, rgba(${r.glow},${r.lockedBg * 2}), var(--muted))`,
              border: r.animBorder
                ? 'none'
                : `${r.borderW} solid rgba(${r.glow},${ach.unlocked ? 0.55 : r.lockedBorder + 0.05})`,
              filter: ach.unlocked ? 'none' : 'grayscale(0.85) brightness(0.65)',
              boxShadow: ach.unlocked && isEpicPlus ? `inset 0 0 18px rgba(${r.glow},0.22)` : 'none',
            }}
          >
            {ach.icon}
            {ach.unlocked && (
              <div className="absolute inset-0 pointer-events-none"
                style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 55%)' }} />
            )}
          </div>
        </div>

        {/* Text */}
        <div className="flex-1 flex flex-col items-center justify-center gap-1 px-1">
          {/* Legendary unlocked title gets shimmering gold gradient */}
          {isLegendary && ach.unlocked ? (
            <motion.h3
              className="font-black leading-tight"
              style={{
                fontSize: '0.82rem',
                letterSpacing: '-0.01em',
                background: `linear-gradient(90deg, ${r.grad})`,
                backgroundSize: '200% auto',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
              animate={{ backgroundPosition: ['0% 50%', '200% 50%'] }}
              transition={{ repeat: Infinity, duration: 3, ease: 'linear' }}
            >
              {ach.title}
            </motion.h3>
          ) : (
            <h3
              className="font-bold leading-tight"
              style={{
                fontSize: '0.8rem',
                color: 'var(--foreground)',
                opacity: ach.unlocked ? 1 : 0.72,
                letterSpacing: '-0.01em',
              }}
            >
              {ach.title}
            </h3>
          )}
          <p
            className="text-[10.5px] leading-snug"
            style={{
              color: 'var(--muted-foreground)',
              opacity: ach.unlocked ? 0.8 : 0.65,
              maxWidth: '95%',
            }}
          >
            {ach.unlocked ? ach.description : ach.hint}
          </p>
        </div>

        {/* Unlock date OR progress */}
        {ach.unlocked ? (
          <div
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[9.5px] font-bold uppercase tracking-wider w-full justify-center"
            style={{
              background: `rgba(${r.glow},0.1)`,
              border: `1px solid rgba(${r.glow},0.22)`,
              color: r.dot,
            }}
          >
            <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <path d="M20 6L9 17l-5-5"/>
            </svg>
            {ach.unlockedAt
              ? new Date(ach.unlockedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' })
              : 'Unlocked'}
          </div>
        ) : ach.progress && progressPct > 0 ? (
          <div className="w-full flex justify-between text-[9.5px] font-semibold px-0.5"
            style={{ color: 'var(--muted-foreground)', opacity: 0.8 }}>
            <span>
              {ach.progress.current}
              <span style={{ opacity: 0.5 }}>/{ach.progress.required}</span>
              {' '}{ach.progress.unit}
            </span>
            <span style={{ color: ach.unlocked ? r.dot : 'var(--muted-foreground)', opacity: ach.unlocked ? 1 : 0.8 }}>{progressPct}%</span>
          </div>
        ) : null}
      </div>

      {/* ── Bottom progress strip ── */}
      <div className="relative z-10 w-full shrink-0"
        style={{ height: r.stripH, background: `rgba(${r.glow},0.08)` }}>
        <motion.div
          className="h-full"
          style={{
            background: ach.unlocked
              ? `linear-gradient(90deg, ${r.strip}, ${ach.color})`
              : `linear-gradient(90deg, rgba(${r.glow},0.22), rgba(${r.glow},${r.lockedStrip * 0.75}))`,
            boxShadow: barPct > 5
              ? `0 0 ${ach.unlocked ? '10px' : '4px'} rgba(${r.glow},${ach.unlocked ? 0.7 : 0.3})`
              : 'none',
          }}
          initial={{ width: 0 }}
          animate={{ width: `${barPct}%` }}
          transition={{ delay: idx * 0.05 + 0.35, duration: 0.9, ease: 'easeOut' }}
        />
      </div>
    </>
  );

  // Epic: double box-shadow ring on the outer motion wrapper
  const epicBoxShadow = isEpic && ach.unlocked
    ? `0 0 0 1.5px rgba(${r.glow},0.55), 0 0 0 3px rgba(${r.glow},0.15), 0 12px 40px rgba(${r.glow},0.28)`
    : undefined;

  const cardEl = (
    <motion.div
      initial={{ opacity: 0, y: 28, scale: 0.93 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: idx * 0.05, type: 'spring', stiffness: 220, damping: 22 }}
      whileHover={ach.unlocked ? { y: -10, scale: 1.045 } : { y: -3, scale: 1.015 }}
      className="relative flex flex-col rounded-2xl overflow-hidden cursor-default select-none"
      style={{
        minHeight: '255px',
        background: `radial-gradient(ellipse at 50% -5%, rgba(${r.glow},${bgOpacity}) 0%, var(--card) 58%)`,
        border: isLegendary ? 'none' : `${r.borderW} solid rgba(${r.glow},${borderOpacity})`,
        boxShadow: isLegendary
          ? 'none'
          : epicBoxShadow ?? (ach.unlocked
              ? `0 0 0 1px rgba(${r.glow},0.12), 0 10px 36px rgba(${r.glow},0.2), inset 0 1px 0 rgba(255,255,255,0.06)`
              : isEpicPlus ? `0 4px 18px rgba(${r.glow},0.1)` : 'none'),
        // Locked cards are visibly dimmed — unlocked cards are vivid
        opacity: ach.unlocked ? 1 : 0.82,
        filter: ach.unlocked ? 'none' : 'saturate(0.3) brightness(0.85)',
        transition: 'filter 0.3s, opacity 0.3s',
      }}
    >
      {inner}
    </motion.div>
  );


  // Legendary cards get the rotating gradient border wrapper
  if (isLegendary) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 28, scale: 0.93 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: idx * 0.05, type: 'spring', stiffness: 220, damping: 22 }}
        whileHover={ach.unlocked ? { y: -10, scale: 1.045 } : { y: -3, scale: 1.015 }}
        style={{
          // Dim the entire card + border wrapper when locked
          opacity: ach.unlocked ? 1 : 0.8,
          filter: ach.unlocked ? 'none' : 'saturate(0.28) brightness(0.82)',
          transition: 'filter 0.3s, opacity 0.3s',
        }}
      >
        <LegendaryBorderWrapper unlocked={ach.unlocked}>
          <div
            className="relative flex flex-col overflow-hidden cursor-default select-none"
            style={{
              minHeight: '255px',
              background: `radial-gradient(ellipse at 50% -5%, rgba(${r.glow},${bgOpacity}) 0%, var(--card) 58%)`,
            }}
          >
            {inner}
          </div>
        </LegendaryBorderWrapper>
      </motion.div>
    );
  }

  return cardEl;
}

// ─── Category Tab ─────────────────────────────────────────────────────────────
function CategoryTab({
  cat, active, unlockedCount, totalCount, onClick,
}: {
  cat: AchievementCategory | 'all'; active: boolean;
  unlockedCount: number; totalCount: number; onClick: () => void;
}) {
  const meta = CATEGORY_META[cat];
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.97 }}
      className="relative flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-colors duration-200"
      style={{
        background: active ? 'var(--primary)' : 'var(--muted)',
        color: active ? 'var(--primary-foreground)' : 'var(--muted-foreground)',
        border: active ? '1px solid var(--primary)' : '1px solid var(--border)',
        boxShadow: active ? '0 4px 16px color-mix(in srgb, var(--primary) 40%, transparent)' : 'none',
      }}
    >
      <span>{meta.icon}</span>
      <span className="hidden sm:inline capitalize">{meta.label}</span>
      <span
        className="text-[9px] font-black px-1.5 py-0.5 rounded-full"
        style={{
          background: active ? 'rgba(255,255,255,0.22)' : 'var(--card)',
          color: active ? 'var(--primary-foreground)' : 'var(--muted-foreground)',
        }}
      >
        {unlockedCount}/{totalCount}
      </span>
    </motion.button>
  );
}

// ─── Achievements Showcase ────────────────────────────────────────────────────
const CATEGORIES: Array<AchievementCategory | 'all'> = ['all', 'speed', 'accuracy', 'volume', 'time', 'special'];
const RARITY_ORDER: Record<AchievementRarity, number> = { legendary: 0, epic: 1, rare: 2, common: 3 };

function AchievementsShowcase({ achievements, loading }: { achievements: Achievement[]; loading: boolean }) {
  const [activeCategory, setActiveCategory] = useState<AchievementCategory | 'all'>('all');
  const [showAll, setShowAll] = useState(false);

  const unlockedTotal = achievements.filter((a) => a.unlocked).length;
  const pctTotal = achievements.length > 0 ? (unlockedTotal / achievements.length) * 100 : 0;
  const circumference = 2 * Math.PI * 18;

  const filtered = activeCategory === 'all'
    ? achievements
    : achievements.filter((a) => a.category === activeCategory);

  const displayed = showAll ? filtered : filtered.filter((a) => a.unlocked);

  const sorted = [...displayed].sort((a, b) => {
    if (a.unlocked !== b.unlocked) return a.unlocked ? -1 : 1;
    return RARITY_ORDER[a.rarity] - RARITY_ORDER[b.rarity];
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="rounded-2xl border overflow-hidden"
      style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
    >
      {/* ── Header ── */}
      <div
        className="px-8 pt-8 pb-0"
        style={{
          background: 'linear-gradient(180deg, color-mix(in srgb, var(--primary) 4%, var(--card)) 0%, var(--card) 100%)',
        }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 mb-6">
          <div>
            <h2 className="text-2xl font-black tracking-tight" style={{ color: 'var(--foreground)' }}>
              Achievements
            </h2>
            <p className="text-xs mt-1 font-medium" style={{ color: 'var(--muted-foreground)' }}>
              Complete typing milestones to earn exclusive badges
            </p>
          </div>
          <div
            className="flex items-center gap-4 px-5 py-3.5 rounded-2xl border shrink-0"
            style={{
              background: 'color-mix(in srgb, var(--primary) 6%, var(--muted))',
              borderColor: 'color-mix(in srgb, var(--primary) 20%, var(--border))',
            }}
          >
            <div>
              <p className="text-3xl font-black leading-none" style={{ color: 'var(--foreground)' }}>
                {unlockedTotal}
                <span className="text-base font-medium" style={{ color: 'var(--muted-foreground)' }}>
                  /{achievements.length}
                </span>
              </p>
              <p className="text-[9px] font-black uppercase tracking-[0.2em] mt-1" style={{ color: 'var(--muted-foreground)' }}>
                Unlocked
              </p>
            </div>
            <div className="relative w-14 h-14 shrink-0">
              <svg viewBox="0 0 44 44" className="w-full h-full -rotate-90">
                <circle cx="22" cy="22" r="18" fill="none" stroke="var(--border)" strokeWidth="4" />
                <motion.circle
                  cx="22" cy="22" r="18" fill="none" stroke="var(--primary)"
                  strokeWidth="4" strokeLinecap="round"
                  strokeDasharray={circumference}
                  initial={{ strokeDashoffset: circumference }}
                  animate={{ strokeDashoffset: circumference * (1 - pctTotal / 100) }}
                  transition={{ duration: 1.2, ease: 'easeOut', delay: 0.4 }}
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-[10px] font-black" style={{ color: 'var(--primary)' }}>
                {Math.round(pctTotal)}%
              </span>
            </div>
          </div>
        </div>

        {/* ── Rarity legend ── */}
        <div className="flex flex-wrap gap-x-5 gap-y-2 mb-5">
          {(['common', 'rare', 'epic', 'legendary'] as AchievementRarity[]).map((rar) => {
            const rr = R[rar];
            return (
              <div key={rar} className="flex items-center gap-2">
                <div className="flex gap-[3px]">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="rounded-full" style={{
                      width: i < rr.stars ? '6px' : '4px',
                      height: i < rr.stars ? '6px' : '4px',
                      background: i < rr.stars ? rr.dot : 'var(--border)',
                      boxShadow: i < rr.stars ? `0 0 4px ${rr.strip}` : 'none',
                    }} />
                  ))}
                </div>
                <span className="text-[10px] font-semibold" style={{ color: rr.dot }}>{rr.label}</span>
              </div>
            );
          })}
        </div>

        {/* ── Category tabs & Toggle ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b" style={{ borderColor: 'var(--border)' }}>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => {
              const catAchs = cat === 'all' ? achievements : achievements.filter((a) => a.category === cat);
              return (
                <CategoryTab
                  key={cat} cat={cat}
                  active={activeCategory === cat}
                  unlockedCount={catAchs.filter((a) => a.unlocked).length}
                  totalCount={catAchs.length}
                  onClick={() => setActiveCategory(cat)}
                />
              );
            })}
          </div>

          <motion.button
            whileHover={{ scale: 1.025 }}
            whileTap={{ scale: 0.975 }}
            onClick={() => setShowAll(!showAll)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer self-start sm:self-auto"
            style={{
              background: showAll ? 'var(--primary)' : 'var(--muted)',
              color: showAll ? 'var(--primary-foreground)' : 'var(--muted-foreground)',
              borderColor: showAll ? 'var(--primary)' : 'var(--border)',
              boxShadow: showAll ? '0 4px 14px color-mix(in srgb, var(--primary) 25%, transparent)' : 'none',
            }}
          >
            <span>{showAll ? '🔓' : '🔒'}</span>
            <span>{showAll ? 'Show All' : 'Show Locked'}</span>
          </motion.button>
        </div>
      </div>

      {/* ── Grid ── */}
      <div className="p-8 pt-6">
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="rounded-2xl animate-pulse" style={{ minHeight: 255, background: 'var(--muted)' }} />
            ))}
          </div>
        ) : sorted.length === 0 ? (
          <div className="py-20 flex flex-col items-center gap-4 rounded-2xl border border-dashed" style={{ borderColor: 'var(--border)' }}>
            <span className="text-5xl opacity-20">{CATEGORY_META[activeCategory].icon}</span>
            <p className="text-sm font-medium" style={{ color: 'var(--muted-foreground)' }}>
              No achievements in this category yet
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
            {sorted.map((ach, i) => (
              <AchievementCard key={ach.id} ach={ach} idx={i} />
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
