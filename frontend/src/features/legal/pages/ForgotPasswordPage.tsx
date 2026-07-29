import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function ForgotPasswordPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground font-mono p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <button
            onClick={() => navigate('/login')}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
          </button>
          <div>
            <h1 className="text-2xl font-bold">Forgot Password</h1>
            <p className="text-xs text-muted-foreground mt-0.5">Reset your account password</p>
          </div>
        </div>

        <div className="bg-card border border-border rounded-2xl p-8 space-y-5">
          {/* Info box */}
          <div className="flex gap-3 p-4 rounded-xl bg-primary/10 border border-primary/20">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 mt-0.5"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
            <p className="text-sm text-muted-foreground leading-relaxed">
              TypeSprint does not currently support automated password resets via email.
            </p>
          </div>

          <div className="space-y-3 text-sm text-muted-foreground">
            <p className="font-semibold text-foreground">How to reset your password:</p>
            <div className="flex gap-3">
              <span className="text-primary font-bold flex-shrink-0">1.</span>
              <span>If you are <strong className="text-foreground">already logged in</strong>, go to <strong className="text-foreground">Settings → Change Password</strong> to update your password directly.</span>
            </div>
            <div className="flex gap-3">
              <span className="text-primary font-bold flex-shrink-0">2.</span>
              <span>If you are <strong className="text-foreground">locked out</strong>, contact support at{' '}
                <a
                  href="mailto:shikharnegi01@gmail.com?subject=[Account Help] Password Reset Request"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline underline-offset-4"
                >
                  shikharnegi01@gmail.com
                </a>{' '}
                with your registered email address.</span>
            </div>
            <div className="flex gap-3">
              <span className="text-primary font-bold flex-shrink-0">3.</span>
              <span>If you signed up with <strong className="text-foreground">Google OAuth</strong>, simply click <em>"Continue with Google"</em> on the login page — no password needed.</span>
            </div>
          </div>

          <div className="pt-2 flex flex-col gap-3">
            <button
              onClick={() => navigate('/login')}
              className="w-full py-3 bg-primary text-background font-bold rounded-xl hover:opacity-90 transition-opacity"
            >
              Back to Login
            </button>
            <a
              href="mailto:shikharnegi01@gmail.com?subject=[Account Help] Password Reset Request"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 border border-border text-muted-foreground font-bold rounded-xl hover:bg-muted/40 transition-colors text-center text-sm"
            >
              Email Support
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
