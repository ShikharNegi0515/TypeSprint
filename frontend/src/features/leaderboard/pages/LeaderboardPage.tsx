import { useEffect, useState } from 'react';
import { api } from '../../../lib/axios';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';

interface LeaderboardEntry {
  id: string;
  userId: string;
  username: string;
  wpm: number;
  accuracy: number;
  date: string;
}

export default function LeaderboardPage() {
  const navigate = useNavigate();
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLeaderboard() {
      try {
        const res = await api.get('/typing/leaderboard?limit=20');
        setEntries(res.data);
      } catch (err) {
        console.error('Failed to fetch leaderboard:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchLeaderboard();
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center p-8">
      <div className="w-full max-w-4xl flex justify-between items-center mb-12">
        <Link to="/" className="text-3xl font-bold tracking-tighter text-primary hover:opacity-80 transition-opacity">
          TypeSprint
        </Link>
        <button onClick={() => navigate('/')} className="px-4 py-2 rounded-lg bg-card border border-border text-sm font-medium hover:bg-muted transition-colors">
          Back to Typing
        </button>
      </div>

      <div className="w-full max-w-4xl">
        <div className="flex items-center gap-3 mb-8">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-500"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>
          <h1 className="text-3xl font-bold">Global Leaderboard</h1>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <svg className="animate-spin text-primary" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
          </div>
        ) : (
          <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-muted/50 text-muted-foreground border-b border-border text-sm uppercase tracking-wider">
                  <th className="py-4 px-6 font-semibold">Rank</th>
                  <th className="py-4 px-6 font-semibold">User</th>
                  <th className="py-4 px-6 font-semibold text-right">WPM</th>
                  <th className="py-4 px-6 font-semibold text-right">Accuracy</th>
                  <th className="py-4 px-6 font-semibold text-right">Date</th>
                </tr>
              </thead>
              <tbody>
                {entries.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-muted-foreground">
                      No typing records found yet.
                    </td>
                  </tr>
                ) : (
                  entries.map((entry, idx) => (
                    <motion.tr
                      key={entry.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className={`border-b border-border/50 hover:bg-muted/30 transition-colors ${
                        idx === 0 ? 'bg-yellow-500/5 hover:bg-yellow-500/10' :
                        idx === 1 ? 'bg-gray-400/5 hover:bg-gray-400/10' :
                        idx === 2 ? 'bg-amber-700/5 hover:bg-amber-700/10' : ''
                      }`}
                    >
                      <td className="py-4 px-6 font-bold text-lg text-muted-foreground">
                        {idx + 1}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                            idx === 0 ? 'bg-yellow-500/20 text-yellow-600' :
                            idx === 1 ? 'bg-gray-400/20 text-gray-400' :
                            idx === 2 ? 'bg-amber-700/20 text-amber-700' :
                            'bg-primary/10 text-primary'
                          }`}>
                            {entry.username.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-semibold text-foreground">{entry.username}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-right font-bold text-primary text-xl">
                        {entry.wpm}
                      </td>
                      <td className="py-4 px-6 text-right text-foreground font-medium">
                        {entry.accuracy}%
                      </td>
                      <td className="py-4 px-6 text-right text-muted-foreground text-sm">
                        {new Date(entry.date).toLocaleDateString()}
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
