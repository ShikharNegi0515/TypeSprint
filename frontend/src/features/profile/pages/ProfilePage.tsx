import { useEffect, useState } from 'react';
import { api } from '../../../lib/axios';
import { useSelector } from 'react-redux';
import { type RootState } from '../../../store';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../../../store/slices/authSlice';
import { motion } from 'framer-motion';

export default function ProfilePage() {
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [stats, setStats] = useState<any>(null);
  const [analytics, setAnalytics] = useState<any[]>([]);
  const [achievements, setAchievements] = useState<any[]>([]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
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
      }
    }
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground p-8 flex flex-col items-center">
      <div className="w-full max-w-5xl flex justify-between items-center mb-8">
        <Link to="/" className="text-3xl font-bold tracking-tighter text-primary hover:opacity-80 transition-opacity">
          TypeSprint
        </Link>
        <div className="flex gap-4 items-center">
          <span className="text-muted-foreground font-medium">{user?.username}</span>
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
            {user?.username?.charAt(0).toUpperCase()}
          </div>
          <button onClick={handleLogout} className="hover:text-foreground transition-colors text-muted-foreground ml-2" title="Logout"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg></button>
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-4 gap-6 mb-12"
      >
        <div className="p-6 bg-card border border-border rounded-2xl flex flex-col items-center justify-center text-center">
          <p className="text-sm text-muted-foreground mb-1 uppercase tracking-wider">Tests Taken</p>
          <p className="text-4xl font-bold text-foreground">{stats?.totalTests || 0}</p>
        </div>
        <div className="p-6 bg-card border border-border rounded-2xl flex flex-col items-center justify-center text-center">
          <p className="text-sm text-muted-foreground mb-1 uppercase tracking-wider">Average WPM</p>
          <p className="text-4xl font-bold text-foreground">{stats?.averageWpm || 0}</p>
        </div>
        <div className="p-6 bg-card border border-border rounded-2xl flex flex-col items-center justify-center text-center">
          <p className="text-sm text-muted-foreground mb-1 uppercase tracking-wider">Average Acc</p>
          <p className="text-4xl font-bold text-foreground">{stats?.averageAccuracy || 0}%</p>
        </div>
        <div className="p-6 bg-card border border-border rounded-2xl flex flex-col items-center justify-center text-center">
          <p className="text-sm text-muted-foreground mb-1 uppercase tracking-wider">Personal Best</p>
          <p className="text-4xl font-bold text-primary">{stats?.personalBest || 0}</p>
        </div>
      </motion.div>

      <div className="w-full max-w-5xl bg-card border border-border rounded-2xl p-8 mb-8">
        <h2 className="text-2xl font-bold mb-6">WPM Progress</h2>
        <div className="h-80 w-full">
          {analytics.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analytics}>
                <defs>
                  <linearGradient id="colorWpm" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="date" stroke="var(--color-muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)', borderRadius: '8px' }}
                  itemStyle={{ color: 'var(--color-foreground)' }}
                />
                <Area type="monotone" dataKey="wpm" stroke="var(--color-primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorWpm)" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              No typing history available yet.
            </div>
          )}
        </div>
      </div>

      <div className="w-full max-w-5xl bg-card border border-border rounded-2xl p-8 mb-8">
        <h2 className="text-2xl font-bold mb-2">Key Heatmap</h2>
        <p className="text-muted-foreground text-sm mb-6">Keys you miss most frequently are highlighted in red.</p>
        
        <div className="flex flex-col items-center gap-2 mt-8">
          {[
            ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']'],
            ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', "'"],
            ['z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/']
          ].map((row, rIdx) => (
            <div key={rIdx} className="flex justify-center gap-2" style={{ paddingLeft: `${rIdx * 24}px` }}>
              {row.map(char => {
                let colorClass = 'bg-muted/30 text-muted-foreground';
                let missCount = 0;
                
                if (stats?.heatmap && stats.heatmap[char]) {
                  missCount = stats.heatmap[char];
                  const maxMisses = Math.max(...Object.values(stats.heatmap) as number[]);
                  const ratio = missCount / maxMisses;
                  
                  if (ratio > 0.75) colorClass = 'bg-destructive text-destructive-foreground font-bold shadow-[0_0_15px_rgba(202,71,84,0.5)]';
                  else if (ratio > 0.5) colorClass = 'bg-destructive/70 text-destructive-foreground font-bold';
                  else if (ratio > 0.25) colorClass = 'bg-destructive/40 text-foreground';
                  else colorClass = 'bg-destructive/20 text-foreground';
                }
                
                return (
                  <div 
                    key={char} 
                    title={`${char}: ${missCount} misses`}
                    className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg uppercase transition-all duration-300 ${colorClass}`}
                  >
                    {char}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      <div className="w-full max-w-5xl bg-card border border-border rounded-2xl p-8">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <span>Achievements</span>
          <span className="text-sm font-normal px-2 py-1 bg-muted rounded-full text-muted-foreground">
            {achievements.length} Unlocked
          </span>
        </h2>
        
        {achievements.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground bg-muted/20 rounded-xl border border-dashed border-border">
            Complete typing tests to start earning achievements!
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {achievements.map((ach) => (
              <motion.div 
                key={ach.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ y: -5 }}
                className={`p-4 rounded-xl border border-border flex flex-col items-center text-center relative overflow-hidden group ${ach.color.replace('text-', 'bg-opacity-5 ')} bg-card`}
              >
                <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity ${ach.color.split(' ')[0]}`}></div>
                <div className={`text-4xl mb-3 w-16 h-16 rounded-full flex items-center justify-center ${ach.color.split(' ')[0]}`}>
                  {ach.icon}
                </div>
                <h3 className="font-bold text-foreground mb-1">{ach.title}</h3>
                <p className="text-xs text-muted-foreground">{ach.description}</p>
                <p className="text-[10px] text-muted-foreground/60 mt-3 uppercase tracking-wider">
                  {new Date(ach.unlockedAt).toLocaleDateString()}
                </p>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
