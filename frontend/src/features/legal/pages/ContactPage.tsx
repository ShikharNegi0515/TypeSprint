import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Footer } from '../../../components/Footer';
import { motion } from 'framer-motion';

const CONTACT_EMAIL = 'shikharnegi01@gmail.com';

const subjects = [
  {
    label: 'Question',
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>,
  },
  {
    label: 'Feedback',
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
  },
  {
    label: 'Bug Report',
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 2l1.88 1.88"/><path d="M14.12 3.88 16 2"/><path d="M9 7.13v-1a3.003 3.003 0 1 1 6 0v1"/><path d="M12 20c-3.3 0-6-2.7-6-6v-3a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v3c0 3.3-2.7 6-6 6"/><path d="M12 20v-9"/><path d="M6.53 9C4.6 8.8 3 7.1 3 5"/><path d="M6 13H2"/><path d="M3 21c0-2.1 1.7-3.9 3.8-4"/><path d="M20.97 5c0 2.1-1.6 3.8-3.5 4"/><path d="M22 13h-4"/><path d="M17.2 17c2.1.1 3.8 1.9 3.8 4"/></svg>,
  },
  {
    label: 'Account Help',
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  },
  {
    label: 'Business Inquiry',
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>,
  },
  {
    label: 'Other',
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>,
  },
];

export default function ContactPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') navigate('/');
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);

  const handleSelect = (subject: string) => {
    // Open in new window
    window.open(`mailto:${CONTACT_EMAIL}?subject=[${subject}]`, '_blank');
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center font-mono relative overflow-hidden">
      
      {/* Fake blurred typing text background to simulate popup over the app */}
      <div className="absolute inset-0 overflow-hidden opacity-30 select-none pointer-events-none flex flex-col items-center justify-center p-8 blur-[3px]">
        <div className="w-full max-w-5xl flex flex-wrap gap-2 text-2xl font-medium text-muted-foreground opacity-50">
          {Array.from({ length: 150 }).map((_, i) => (
            <span key={i} className={i % 7 === 0 ? 'text-foreground' : ''}>
              {['the', 'quick', 'brown', 'fox', 'jumps', 'over', 'lazy', 'dog', 'type', 'sprint', 'monkey'][Math.floor(Math.random() * 11)]}
            </span>
          ))}
        </div>
      </div>

      <div className="absolute inset-0 bg-background/60 z-0"></div>

      <header className="w-full max-w-7xl flex items-center justify-between p-8 z-10 opacity-70">
        <div className="flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="4" width="20" height="16" rx="2" ry="2"></rect>
            <path d="M6 8h.01"></path><path d="M10 8h.01"></path><path d="M14 8h.01"></path><path d="M18 8h.01"></path>
            <path d="M6 12h.01"></path><path d="M10 12h.01"></path><path d="M14 12h.01"></path><path d="M18 12h.01"></path>
            <path d="M7 16h10"></path>
          </svg>
          <span className="text-xl font-bold tracking-tight text-muted-foreground">typesprint</span>
        </div>
        <button
          onClick={() => navigate('/')}
          className="px-3 py-1.5 rounded-lg bg-card border border-border text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2 shadow-sm"
        >
          esc to return
        </button>
      </header>

      <main className="flex-1 w-full flex items-center justify-center z-10 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.15 }}
          className="w-full max-w-2xl bg-card rounded-3xl p-10 shadow-2xl border border-border/50"
        >
          <h1 className="text-2xl font-bold text-foreground mb-4">Contact</h1>
          <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
            Feel free to send an email to{' '}
            <span className="text-primary font-medium">{CONTACT_EMAIL}</span>. 
            For business inquiries, email <span className="text-foreground">{CONTACT_EMAIL}</span> (the buttons below will open the default mail client).
          </p>
          <p className="text-sm text-muted-foreground mb-8">
            Please <span className="text-destructive font-bold">do not send</span> requests to delete account, update email, update name or clear personal bests — you can do that in the settings page.
          </p>

          <div className="grid grid-cols-2 gap-3">
            {subjects.map((s) => (
              <button
                key={s.label}
                onClick={() => handleSelect(s.label)}
                className="flex items-center gap-4 px-5 py-4 rounded-xl bg-background/40 hover:bg-background transition-colors border border-transparent hover:border-border/50 text-muted-foreground hover:text-foreground group"
              >
                <span className="group-hover:text-primary transition-colors">
                  {s.icon}
                </span>
                <span className="text-sm font-medium">{s.label}</span>
              </button>
            ))}
          </div>
        </motion.div>
      </main>

      <div className="w-full max-w-7xl px-8 z-10">
        <Footer />
      </div>
    </div>
  );
}
