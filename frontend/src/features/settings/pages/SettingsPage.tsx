import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import { type RootState } from '../../../store';
import { ThemeBuilder } from '../components/ThemeBuilder';
import { useTypingSettings, type TestMode, type Difficulty } from '../../../hooks/useTypingSettings';
import { useTheme } from '../../../hooks/useTheme';

function ToggleRow({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="flex items-center justify-between w-full p-4 rounded-xl border border-border bg-muted/20 hover:bg-muted/40 transition-colors text-left"
    >
      <div>
        <p className="text-sm font-semibold">{label}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
      </div>
      <div
        className={`w-11 h-6 rounded-full relative transition-colors flex-shrink-0 ${checked ? 'bg-primary' : 'bg-muted'}`}
      >
        <span
          className={`absolute top-0.5 w-5 h-5 rounded-full bg-background shadow transition-transform ${checked ? 'translate-x-5' : 'translate-x-0.5'}`}
        />
      </div>
    </button>
  );
}

export default function SettingsPage() {
  const user = useSelector((state: RootState) => state.auth.user);
  const { settings, setSettings, resetSettings } = useTypingSettings();
  const { theme } = useTheme();

  const themeLabel =
    theme === 'default' ? 'Dark' : theme.charAt(0).toUpperCase() + theme.slice(1);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center font-mono pb-16">
      <header className="w-full max-w-3xl flex justify-between items-center px-6 py-5">
        <Link to="/" className="text-2xl font-bold tracking-tighter text-primary hover:opacity-80 transition-opacity">
          typesprint
        </Link>
        <Link
          to="/"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="m15 18-6-6 6-6" />
          </svg>
          Back to test
        </Link>
      </header>

      <main className="w-full max-w-3xl px-6 space-y-8">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-sm text-muted-foreground mt-1">Appearance, typing defaults, and account</p>
        </motion.div>

        <ThemeBuilder />

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-card border border-border rounded-2xl p-8 space-y-6"
        >
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold tracking-tight">Typing Defaults</h2>
              <p className="text-xs text-muted-foreground mt-0.5">Applied when you open the typing test</p>
            </div>
            <button
              type="button"
              onClick={resetSettings}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-border bg-muted/40 hover:bg-muted transition-colors text-muted-foreground"
            >
              Reset defaults
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            <span className="text-xs text-muted-foreground mr-2 self-center">Mode</span>
            {(['time', 'words'] as TestMode[]).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setSettings({ mode: m })}
                className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${settings.mode === m
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border text-muted-foreground hover:text-foreground'
                  }`}
              >
                {m}
              </button>
            ))}
          </div>

          {settings.mode === 'time' ? (
            <div>
              <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Default duration (seconds)</label>
              <div className="flex flex-wrap gap-2 mt-2">
                {[15, 25, 30, 60, 120].map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setSettings({ timeConfig: t })}
                    className={`px-3 py-1.5 rounded-lg text-sm border transition-colors ${settings.timeConfig === t ? 'border-primary text-primary bg-primary/10' : 'border-border text-muted-foreground'
                      }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div>
              <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Default word count</label>
              <div className="flex flex-wrap gap-2 mt-2">
                {[10, 25, 50, 100].map((w) => (
                  <button
                    key={w}
                    type="button"
                    onClick={() => setSettings({ wordsConfig: w })}
                    className={`px-3 py-1.5 rounded-lg text-sm border transition-colors ${settings.wordsConfig === w ? 'border-primary text-primary bg-primary/10' : 'border-border text-muted-foreground'
                      }`}
                  >
                    {w}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div>
            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Difficulty</label>
            <div className="flex flex-wrap gap-2 mt-2">
              {(['easy', 'medium', 'hard'] as Difficulty[]).map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setSettings({ difficulty: d })}
                  className={`px-3 py-1.5 rounded-lg text-sm border capitalize transition-colors ${settings.difficulty === d ? 'border-primary text-primary bg-primary/10' : 'border-border text-muted-foreground'
                    }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <ToggleRow
              label="Punctuation"
              description="Include commas, periods, and quotes in generated text"
              checked={settings.includePunctuation}
              onChange={(v) => setSettings({ includePunctuation: v })}
            />
            <ToggleRow
              label="Numbers"
              description="Mix numeric tokens into word lists"
              checked={settings.includeNumbers}
              onChange={(v) => setSettings({ includeNumbers: v })}
            />
            <ToggleRow
              label="Personal-best ghost"
              description="Show a ghost cursor racing your best WPM on the home test"
              checked={settings.pbGhostEnabled}
              onChange={(v) => setSettings({ pbGhostEnabled: v })}
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card border border-border rounded-2xl p-8"
        >
          <h2 className="text-xl font-bold tracking-tight">Account</h2>
          <p className="text-xs text-muted-foreground mt-0.5 mb-6">Your profile and session</p>

          <dl className="space-y-4 text-sm">
            <div className="flex justify-between gap-4 py-3 border-b border-border">
              <dt className="text-muted-foreground">Username</dt>
              <dd className="font-semibold">{user?.username ?? '—'}</dd>
            </div>
            <div className="flex justify-between gap-4 py-3 border-b border-border">
              <dt className="text-muted-foreground">Email</dt>
              <dd className="font-semibold truncate max-w-[60%]">{user?.email ?? '—'}</dd>
            </div>
            <div className="flex justify-between gap-4 py-3">
              <dt className="text-muted-foreground">Active theme</dt>
              <dd className="font-semibold">{themeLabel}</dd>
            </div>
          </dl>

          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <Link
              to="/profile"
              className="inline-flex items-center gap-2 text-sm text-primary hover:underline font-medium"
            >
              View full profile & stats
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="m9 18 6-6-6-6" />
              </svg>
            </Link>
            <Link
              to="/settings/password"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors font-medium"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              Change Password
            </Link>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
