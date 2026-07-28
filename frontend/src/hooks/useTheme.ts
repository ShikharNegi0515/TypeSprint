import { useState, useEffect } from 'react';

export type Theme = 'default' | 'dracula' | 'nord' | 'matrix' | 'pastel' | 'custom';

export interface CustomColors {
  background: string;
  foreground: string;
  primary: string;
  card: string;
  muted: string;
  destructive: string;
  border: string;
}

export const defaultCustomColors: CustomColors = {
  background: '#111111',
  foreground: '#eeeeee',
  primary: '#00ffcc',
  card: '#1a1a1a',
  muted: '#2a2a2a',
  destructive: '#ff3366',
  border: '#333333',
};

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    return (localStorage.getItem('theme') as Theme) || 'default';
  });

  const [customColors, setCustomColors] = useState<CustomColors>(() => {
    try {
      const stored = localStorage.getItem('customThemeColors');
      return stored ? JSON.parse(stored) : defaultCustomColors;
    } catch {
      return defaultCustomColors;
    }
  });

  useEffect(() => {
    localStorage.setItem('theme', theme);
    localStorage.setItem('customThemeColors', JSON.stringify(customColors));
    
    // Remove all theme classes first
    document.documentElement.classList.remove(
      'theme-dracula',
      'theme-nord',
      'theme-matrix',
      'theme-pastel',
      'theme-custom'
    );
    
    // Clean up existing custom style tag if any
    const existingStyle = document.getElementById('custom-theme-style');
    if (existingStyle) {
      existingStyle.remove();
    }

    if (theme === 'custom') {
      document.documentElement.classList.add('theme-custom');
      const style = document.createElement('style');
      style.id = 'custom-theme-style';
      // Muted foreground is usually halfway between muted and foreground
      // Here we just apply an opacity filter or a custom color, but to keep it simple, we use a distinct color or hex.
      style.textContent = `
        .theme-custom {
          --background: ${customColors.background};
          --foreground: ${customColors.foreground};
          --card: ${customColors.card};
          --card-foreground: ${customColors.foreground};
          --popover: ${customColors.card};
          --popover-foreground: ${customColors.foreground};
          --primary: ${customColors.primary};
          --primary-foreground: ${customColors.background};
          --secondary: ${customColors.card};
          --secondary-foreground: ${customColors.foreground};
          --muted: ${customColors.muted};
          --muted-foreground: color-mix(in srgb, ${customColors.foreground} 60%, ${customColors.muted});
          --accent: ${customColors.card};
          --accent-foreground: ${customColors.primary};
          --destructive: ${customColors.destructive};
          --destructive-foreground: #ffffff;
          --border: ${customColors.border};
          --input: ${customColors.card};
          --ring: ${customColors.primary};
        }
      `;
      document.head.appendChild(style);
    } else if (theme !== 'default') {
      document.documentElement.classList.add(`theme-${theme}`);
    }
  }, [theme, customColors]);

  return { theme, setTheme, customColors, setCustomColors };
}
