import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../../../lib/axios';

type Step = 'email' | 'otp' | 'password' | 'success';

function getErrorMessage(err: unknown): string {
  if (err && typeof err === 'object' && 'response' in err) {
    const data = (err as { response?: { data?: { message?: string | string[] } } }).response?.data;
    const msg = data?.message;
    if (Array.isArray(msg)) return msg[0] ?? 'Something went wrong';
    if (typeof msg === 'string') return msg;
  }
  return 'Something went wrong. Please try again.';
}

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setInfo('');
    setLoading(true);
    try {
      const res = await api.post('/auth/forgot-password', { email: email.trim() });
      setInfo(res.data.message);
      setStep('otp');
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setError('');
    setInfo('');
    setLoading(true);
    try {
      const res = await api.post('/auth/forgot-password', { email: email.trim() });
      setInfo(res.data.message);
      setOtp('');
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (otp.length !== 6) {
      setError('Please enter the 6-digit code.');
      return;
    }
    setStep('password');
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/auth/reset-password', {
        email: email.trim(),
        otp,
        newPassword,
      });
      setInfo(res.data.message);
      setStep('success');
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground relative overflow-hidden font-sans p-8">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="z-10 w-full max-w-[480px]"
      >
        <div className="flex items-center gap-3 mb-8">
          <button
            type="button"
            onClick={() => (step === 'email' ? navigate('/login') : setStep('email'))}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
          </button>
          <div>
            <h1 className="text-2xl font-bold">Forgot Password</h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              {step === 'email' && 'Enter your email to receive a code'}
              {step === 'otp' && 'Enter the 6-digit code we sent you'}
              {step === 'password' && 'Choose a new password'}
              {step === 'success' && 'All set!'}
            </p>
          </div>
        </div>

        <div className="bg-card/60 border border-white/10 rounded-[2rem] p-8 sm:p-10 backdrop-blur-xl shadow-[0_8px_40px_-12px_rgba(0,0,0,0.5)]">
          <AnimatePresence mode="wait">
            {step === 'email' && (
              <motion.form
                key="email"
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                onSubmit={handleSendOtp}
                className="space-y-5"
              >
                <div className="space-y-1.5">
                  <label className="block text-sm font-semibold ml-1">Email address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="name@example.com"
                    className="w-full px-5 py-3.5 rounded-xl bg-background border border-border/50 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all text-foreground placeholder:text-muted-foreground/40"
                  />
                </div>

                {error && <p className="text-destructive text-sm font-medium">{error}</p>}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-primary/90 transition-all disabled:opacity-60"
                >
                  {loading ? 'Sending…' : 'Send verification code'}
                </button>
              </motion.form>
            )}

            {step === 'otp' && (
              <motion.form
                key="otp"
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                onSubmit={handleVerifyOtp}
                className="space-y-5"
              >
                {info && (
                  <p className="text-sm text-muted-foreground bg-primary/10 border border-primary/20 rounded-xl p-4">
                    {info}
                  </p>
                )}

                <div className="space-y-1.5">
                  <label className="block text-sm font-semibold ml-1">Verification code</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    required
                    placeholder="000000"
                    className="w-full px-5 py-3.5 rounded-xl bg-background border border-border/50 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all text-foreground text-center text-2xl tracking-[0.5em] font-mono"
                  />
                  <p className="text-xs text-muted-foreground mt-2 text-center">
                    Code sent to <span className="text-foreground font-medium">{email}</span>
                  </p>
                </div>

                {error && <p className="text-destructive text-sm font-medium">{error}</p>}

                <button
                  type="submit"
                  className="w-full py-4 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-primary/90 transition-all"
                >
                  Continue
                </button>

                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={loading}
                  className="w-full py-3 text-sm text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
                >
                  {loading ? 'Resending…' : "Didn't get a code? Resend"}
                </button>
              </motion.form>
            )}

            {step === 'password' && (
              <motion.form
                key="password"
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                onSubmit={handleResetPassword}
                className="space-y-5"
              >
                <div className="space-y-1.5">
                  <label className="block text-sm font-semibold ml-1">New password</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    minLength={6}
                    placeholder="At least 6 characters"
                    className="w-full px-5 py-3.5 rounded-xl bg-background border border-border/50 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all text-foreground placeholder:text-muted-foreground/40"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-sm font-semibold ml-1">Confirm password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength={6}
                    placeholder="Re-enter password"
                    className="w-full px-5 py-3.5 rounded-xl bg-background border border-border/50 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all text-foreground placeholder:text-muted-foreground/40"
                  />
                </div>

                {error && <p className="text-destructive text-sm font-medium">{error}</p>}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-primary/90 transition-all disabled:opacity-60"
                >
                  {loading ? 'Resetting…' : 'Reset password'}
                </button>
              </motion.form>
            )}

            {step === 'success' && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-6 text-center"
              >
                <div className="w-14 h-14 rounded-full bg-primary/20 text-primary flex items-center justify-center mx-auto">
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6 9 17l-5-5"/></svg>
                </div>
                <p className="text-muted-foreground">{info}</p>
                <button
                  type="button"
                  onClick={() => navigate('/login')}
                  className="w-full py-4 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-primary/90 transition-all"
                >
                  Back to login
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
