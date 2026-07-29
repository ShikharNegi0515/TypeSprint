import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center font-mono gap-6 p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center gap-4 text-center"
      >
        <p className="text-8xl font-black text-primary tracking-tighter">404</p>
        <p className="text-2xl font-bold text-foreground tracking-tight">page not found</p>
        <p className="text-muted-foreground text-sm max-w-xs">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <button
          onClick={() => navigate('/')}
          className="mt-4 px-6 py-2.5 bg-primary text-background font-bold rounded-xl hover:opacity-90 transition-opacity text-sm"
        >
          go home
        </button>
      </motion.div>
    </div>
  );
}
