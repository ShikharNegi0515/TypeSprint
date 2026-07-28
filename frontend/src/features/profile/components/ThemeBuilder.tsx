import { motion } from 'framer-motion';
import { useTheme, defaultCustomColors, type Theme, type CustomColors } from '../../../hooks/useTheme';

const THEME_OPTIONS = [
  { id: 'default', name: 'Monkeytype (Default)', colors: { bg: '#323437', main: '#e2b714' } },
  { id: 'dracula', name: 'Dracula', colors: { bg: '#282a36', main: '#bd93f9' } },
  { id: 'nord', name: 'Nord (Premium)', colors: { bg: '#242933', main: '#88c0d0' } },
  { id: 'matrix', name: 'Matrix', colors: { bg: '#0d0208', main: '#00ff41' } },
  { id: 'pastel', name: 'Pastel', colors: { bg: '#fdf6e3', main: '#2aa198' } },
  { id: 'custom', name: 'Custom Theme', colors: { bg: 'conic-gradient(from 180deg at 50% 50%, #2a8af6 0deg, #a853ba 180deg, #e92a67 360deg)', main: 'transparent', isGradient: true } },
];

export function ThemeBuilder() {
  const { theme, setTheme, customColors, setCustomColors } = useTheme();

  const handleColorChange = (key: keyof CustomColors, value: string) => {
    setCustomColors((prev: CustomColors) => ({ ...prev, [key]: value }));
  };

  const handleResetCustom = () => {
    setCustomColors(defaultCustomColors);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-card border border-border rounded-2xl p-8"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Theme & Appearance</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Customize your typing experience</p>
        </div>
      </div>

      {/* Preset Themes Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 mb-8">
        {THEME_OPTIONS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTheme(t.id as Theme)}
            className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${
              theme === t.id
                ? 'border-primary bg-primary/10 shadow-[0_0_15px_color-mix(in_srgb,var(--primary)_30%,transparent)]'
                : 'border-border bg-muted/30 hover:bg-muted/80'
            }`}
          >
            <div
              className="w-8 h-8 rounded-full border border-border shadow-inner"
              style={{
                background: t.colors.isGradient ? t.colors.bg : t.colors.bg,
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              {!t.colors.isGradient && (
                <div
                  className="absolute bottom-0 right-0 w-4 h-4 rounded-tl-full"
                  style={{ background: t.colors.main }}
                />
              )}
            </div>
            <span className={`text-[10px] font-bold uppercase tracking-wider text-center ${theme === t.id ? 'text-primary' : 'text-muted-foreground'}`}>
              {t.name}
            </span>
          </button>
        ))}
      </div>

      {/* Custom Theme Builder UI */}
      {theme === 'custom' && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="border-t border-border pt-6 mt-2"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold uppercase tracking-widest text-primary">Theme Builder</h3>
            <button
              onClick={handleResetCustom}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-border bg-muted/40 hover:bg-muted hover:text-foreground transition-colors text-muted-foreground"
            >
              Reset to Default
            </button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { key: 'background', label: 'Background Color', desc: 'Main canvas' },
              { key: 'card', label: 'Card Color', desc: 'Panels & overlays' },
              { key: 'border', label: 'Border Color', desc: 'Dividers & edges' },
              { key: 'primary', label: 'Primary Accent', desc: 'Brand & focus' },
              { key: 'foreground', label: 'Main Text', desc: 'Primary readability' },
              { key: 'muted', label: 'Muted Background', desc: 'Secondary panels' },
              { key: 'destructive', label: 'Error Color', desc: 'Typos & alerts' },
            ].map((field) => (
              <div key={field.key} className="flex items-center gap-3 p-3 rounded-xl border border-border bg-muted/20">
                <div className="relative w-10 h-10 rounded-lg overflow-hidden border border-border shadow-sm flex-shrink-0 cursor-pointer">
                  <input
                    type="color"
                    value={customColors[field.key as keyof CustomColors]}
                    onChange={(e) => handleColorChange(field.key as keyof CustomColors, e.target.value)}
                    className="absolute -top-2 -left-2 w-14 h-14 cursor-pointer opacity-0"
                  />
                  <div
                    className="w-full h-full pointer-events-none"
                    style={{ backgroundColor: customColors[field.key as keyof CustomColors] }}
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold">{field.label}</span>
                  <span className="text-[10px] text-muted-foreground uppercase tracking-widest">{field.desc}</span>
                  <span className="text-[10px] font-mono mt-0.5 opacity-60">
                    {customColors[field.key as keyof CustomColors]}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-5 rounded-xl border border-border bg-card flex flex-col items-center justify-center gap-3">
            <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">Preview Area</p>
            <div className="flex items-center gap-2 text-xl font-mono">
              <span className="text-primary font-bold">const</span>
              <span className="text-foreground">theme</span>
              <span className="text-muted-foreground">=</span>
              <span className="text-accent-foreground">"awesome"</span>
              <span className="text-foreground">;</span>
            </div>
            <div className="flex gap-2 mt-2">
              <button className="px-4 py-1.5 rounded-lg bg-primary text-primary-foreground text-sm font-bold shadow-sm">
                Primary Button
              </button>
              <button className="px-4 py-1.5 rounded-lg bg-destructive text-destructive-foreground text-sm font-bold shadow-sm">
                Error State
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
