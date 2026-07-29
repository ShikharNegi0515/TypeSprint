import { useNavigate } from 'react-router-dom';
import { useTheme, type Theme } from '../hooks/useTheme';

export function Footer() {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();

  const themes: Theme[] = ['default', 'dracula', 'nord', 'matrix', 'pastel', 'custom'];
  const themeNames: Record<Theme, string> = {
    'default': 'dark',
    'dracula': 'dracula',
    'nord': 'nord',
    'matrix': 'matrix',
    'pastel': 'pastel',
    'custom': 'custom theme',
  };

  return (
    <footer className="w-full max-w-7xl flex justify-between text-xs text-muted-foreground mb-4 pt-8 border-t border-border/20 font-mono">
      <div className="flex gap-4 flex-wrap items-center">
        <button
          onClick={() => navigate('/contact')}
          className="hover:text-foreground transition-colors flex items-center gap-1"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
          contact
        </button>
        <button
          onClick={() => navigate('/support')}
          className="hover:text-foreground transition-colors flex items-center gap-1"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
          support
        </button>
        <a
          href="https://github.com/ShikharNegi0515/TypeSprint"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-foreground transition-colors flex items-center gap-1"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" /><path d="M9 18c-4.51 2-5-2-7-2" /></svg>
          github
        </a>
        <button
          onClick={() => navigate('/terms')}
          className="hover:text-foreground transition-colors flex items-center gap-1"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" /><path d="M7 7h10" /><path d="M7 12h10" /><path d="M7 17h10" /></svg>
          terms
        </button>
        <button
          onClick={() => navigate('/security')}
          className="hover:text-foreground transition-colors flex items-center gap-1"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
          security
        </button>
        <button
          onClick={() => navigate('/privacy')}
          className="hover:text-foreground transition-colors flex items-center gap-1"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
          privacy
        </button>
      </div>

      <div className="flex gap-4 items-center">
        <div className="relative group flex items-center">
          <button
            type="button"
            className="hover:text-foreground transition-colors flex items-center gap-1 py-1"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>
            {themeNames[theme] || theme}
          </button>
          
          <div className="absolute bottom-full right-0 mb-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 flex-col bg-card border border-border rounded-lg shadow-lg overflow-hidden py-1 z-50 min-w-[120px] flex">
            {themes.map((t) => (
              <button
                key={t}
                onClick={() => setTheme(t)}
                className={`text-left px-4 py-2 text-xs hover:bg-muted transition-colors ${theme === t ? 'text-primary font-bold' : 'text-muted-foreground'}`}
              >
                {themeNames[t]}
              </button>
            ))}
          </div>
        </div>

        <span className="flex items-center gap-1"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 10h3a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h3" /><path d="M6 4v6" /><path d="M18 4v6" /><path d="M10 2h4" /></svg> v1.0.0</span>
      </div>
    </footer>
  );
}
