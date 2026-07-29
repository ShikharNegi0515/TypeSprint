import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Footer } from '../../../components/Footer';
import { motion } from 'framer-motion';

export default function SupportPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') navigate('/');
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center p-8 font-mono">
      <header className="w-full max-w-4xl flex items-center justify-between py-6">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-3 text-2xl font-bold tracking-tighter hover:opacity-80 transition-opacity"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="4" width="20" height="16" rx="2" ry="2"></rect>
            <path d="M6 8h.01"></path><path d="M10 8h.01"></path><path d="M14 8h.01"></path><path d="M18 8h.01"></path>
            <path d="M6 12h.01"></path><path d="M10 12h.01"></path><path d="M14 12h.01"></path><path d="M18 12h.01"></path>
            <path d="M7 16h10"></path>
          </svg>
          <span className="text-muted-foreground font-normal">typesprint</span>
        </button>
        <button
          onClick={() => navigate('/')}
          className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1 bg-card px-3 py-1.5 rounded-lg border border-border"
        >
          esc to return
        </button>
      </header>

      <main className="w-full max-w-3xl flex-1 flex flex-col mt-4">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card border border-border rounded-2xl p-8 space-y-5"
        >
          <h1 className="text-3xl font-bold text-foreground">Support</h1>
          <p className="text-muted-foreground">
            For support inquiries, please visit our Contact page or email us at shikharnegi01@gmail.com.
          </p>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
