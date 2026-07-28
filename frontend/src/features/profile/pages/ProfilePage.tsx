import { useEffect, useState } from 'react';
import { api } from '../../../lib/axios';
import { useSelector } from 'react-redux';
import { type RootState } from '../../../store';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../../../store/slices/authSlice';
import { motion, AnimatePresence } from 'framer-motion';

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
function Key({ char, missCount, maxMisses }: { char: string; missCount: number; maxMisses: number }) {
  const [hovered, setHovered] = useState(false);
  const ratio = maxMisses > 0 ? missCount / maxMisses : 0;

  // Build inline style so it works across all themes (uses CSS vars)
  let bg = 'var(--muted)';
  let textColor = 'var(--muted-foreground)';
  let shadow = 'none';
  let scale = 1;

  if (ratio > 0) {
    const alpha = 0.15 + ratio * 0.85; // 0.15 → 1.0
    bg = `color-mix(in srgb, var(--destructive) ${Math.round(alpha * 100)}%, var(--muted))`;
    textColor = ratio > 0.4 ? 'var(--destructive-foreground)' : 'var(--foreground)';
    if (ratio > 0.7) shadow = '0 0 12px color-mix(in srgb, var(--destructive) 60%, transparent)';
    scale = 1 + ratio * 0.08;
  }

  return (
    <div className="relative" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      <motion.div
        animate={{ scale }}
        transition={{ type: 'spring', stiffness: 400, damping: 20 }}
        style={{
          background: bg,
          color: textColor,
          boxShadow: shadow,
          width: 44,
          height: 44,
          borderRadius: 8,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 14,
          fontWeight: ratio > 0.4 ? 700 : 500,
          fontFamily: 'monospace',
          textTransform: 'uppercase',
          cursor: 'default',
          userSelect: 'none',
          border: ratio > 0 ? '1px solid color-mix(in srgb, var(--destructive) 40%, transparent)' : '1px solid var(--border)',
          transition: 'background 0.3s, box-shadow 0.3s',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* shimmer bar at bottom indicating intensity */}
        {ratio > 0 && (
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              height: 3,
              width: `${ratio * 100}%`,
              background: 'var(--destructive)',
              borderRadius: '0 0 8px 8px',
            }}
          />
        )}
        {char}
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
              bottom: '110%',
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
              boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
            }}
          >
            <span style={{ color: 'var(--muted-foreground)' }}>{char.toUpperCase()}</span>
            {missCount > 0 ? (
              <span style={{ color: 'var(--destructive)', fontWeight: 700, marginLeft: 6 }}>
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
          background: 'linear-gradient(to right, var(--muted), color-mix(in srgb, var(--destructive) 30%, var(--muted)), var(--destructive))',
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
        const [statsRes, analyticsRes, achRes] = await Promise.all([
          api.get('/typing/stats'),
          api.get('/typing/analytics'),
          api.get('/achievements/me'),
        ]);
        setStats(statsRes.data);
        setAnalytics(analyticsRes.data);
        setAchievements(achRes.data);
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
              <div className="flex flex-wrap gap-2">
                {Object.entries(heatmap)
                  .sort(([, a], [, b]) => (b as number) - (a as number))
                  .slice(0, 8)
                  .map(([char, count], i) => (
                    <div key={char} className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border bg-muted/30">
                      <span className="text-xs font-bold text-muted-foreground">#{i + 1}</span>
                      <kbd
                        className="text-sm font-mono font-bold uppercase px-1.5 py-0.5 rounded"
                        style={{ background: 'var(--card)', color: 'var(--destructive)', border: '1px solid var(--border)' }}
                      >
                        {char === ' ' ? 'spc' : char}
                      </kbd>
                      <span className="text-xs text-muted-foreground">{count as number}x</span>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </motion.div>

        {/* ── Achievements ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card border border-border rounded-2xl p-8"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold tracking-tight">Achievements</h2>
            <span className="text-xs bg-primary/10 text-primary border border-primary/20 px-3 py-1 rounded-full font-semibold">
              {achievements.length} unlocked
            </span>
          </div>

          {achievements.length === 0 ? (
            <div className="text-center py-14 text-muted-foreground flex flex-col items-center gap-3 border border-dashed border-border rounded-xl bg-muted/10">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" opacity={0.4}>
                <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/>
                <path d="M4 22h16"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>
              </svg>
              <p className="text-sm">Complete typing tests to earn achievements!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {achievements.map((ach, i) => (
                <motion.div
                  key={ach.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ y: -4, scale: 1.02 }}
                  className="relative overflow-hidden p-5 rounded-xl border border-border bg-card flex flex-col items-center text-center gap-3 cursor-default"
                >
                  <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300"
                    style={{ background: 'radial-gradient(circle at 50% 0%, color-mix(in srgb, var(--primary) 8%, transparent), transparent 60%)' }} />
                  <div className="relative z-10 w-14 h-14 rounded-2xl flex items-center justify-center text-3xl"
                    style={{ background: 'color-mix(in srgb, var(--primary) 12%, var(--muted))', border: '1px solid color-mix(in srgb, var(--primary) 25%, transparent)' }}>
                    {ach.icon}
                  </div>
                  <div className="relative z-10">
                    <h3 className="font-bold text-foreground text-sm">{ach.title}</h3>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{ach.description}</p>
                  </div>
                  <p className="relative z-10 text-[10px] text-muted-foreground/50 uppercase tracking-widest">
                    {new Date(ach.unlockedAt).toLocaleDateString()}
                  </p>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
}
