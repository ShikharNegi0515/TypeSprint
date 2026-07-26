import { useState, useEffect } from 'react';

export type Theme = 'default' | 'dracula' | 'nord' | 'matrix' | 'pastel';

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    return (localStorage.getItem('theme') as Theme) || 'default';
  });

  useEffect(() => {
    localStorage.setItem('theme', theme);
    
    // Remove all theme classes first
    document.documentElement.classList.remove(
      'theme-dracula',
      'theme-nord',
      'theme-matrix',
      'theme-pastel'
    );
    
    // Add the selected theme class if not default
    if (theme !== 'default') {
      document.documentElement.classList.add(`theme-${theme}`);
    }
  }, [theme]);

  return { theme, setTheme };
}
