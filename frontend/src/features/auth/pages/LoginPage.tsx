import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../../../store/slices/authSlice';
import { api } from '../../../lib/axios';
import { motion } from 'framer-motion';
import { useEffect } from 'react';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      // If we got a token from Google OAuth redirect, fetch the user profile
      api.get('/auth/me', { headers: { Authorization: `Bearer ${token}` } })
        .then(res => {
          dispatch(setCredentials({ access_token: token, user: res.data }));
          navigate('/');
        })
        .catch(err => {
          console.error('Failed to login with token', err);
        });
    }
  }, [searchParams, dispatch, navigate]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    try {
      const response = await api.post('/auth/login', data);
      dispatch(setCredentials(response.data));
      navigate('/');
    } catch (error) {
      console.error('Login failed:', error);
      alert('Login failed. Please check credentials.');
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:3000/api/auth/google';
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground relative overflow-hidden font-sans">
      {/* Dynamic Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[150px] pointer-events-none"></div>
      
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="z-10 w-full max-w-[420px] p-8 sm:p-10 rounded-[2rem] bg-card/60 border border-white/10 shadow-[0_8px_40px_-12px_rgba(0,0,0,0.5)] backdrop-blur-xl"
      >
        <div className="text-center mb-10">
          <motion.div 
            initial={{ scale: 0 }} 
            animate={{ scale: 1 }} 
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="w-16 h-16 bg-primary/20 text-primary rounded-2xl flex items-center justify-center mx-auto mb-6 rotate-3"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2" ry="2"></rect><path d="M6 8h.01"></path><path d="M10 8h.01"></path><path d="M14 8h.01"></path><path d="M18 8h.01"></path><path d="M6 12h.01"></path><path d="M10 12h.01"></path><path d="M14 12h.01"></path><path d="M18 12h.01"></path><path d="M7 16h10"></path></svg>
          </motion.div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground mb-3">Welcome Back</h1>
          <p className="text-muted-foreground/80 font-medium">Log in to continue your journey</p>
        </div>

        <button
          onClick={handleGoogleLogin}
          className="w-full py-3.5 px-4 mb-8 bg-background border border-border hover:border-primary/50 text-foreground font-semibold rounded-xl hover:bg-muted/50 transition-all duration-300 flex justify-center items-center gap-3 shadow-sm group"
        >
          <svg className="group-hover:scale-110 transition-transform duration-300" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
          Continue with Google
        </button>

        <div className="relative mb-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border/60"></div>
          </div>
          <div className="relative flex justify-center text-xs font-semibold uppercase tracking-widest">
            <span className="px-4 bg-card text-muted-foreground/60">Or email</span>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-foreground/90 ml-1">Email</label>
            <input
              {...register('email')}
              type="email"
              className="w-full px-5 py-3.5 rounded-xl bg-background border border-border/50 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all duration-300 text-foreground placeholder:text-muted-foreground/40 font-medium shadow-inner"
              placeholder="name@example.com"
            />
            {errors.email && (
              <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-destructive text-xs font-semibold mt-2 ml-1">{errors.email.message}</motion.p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-foreground/90 ml-1">Password</label>
            <input
              {...register('password')}
              type="password"
              className="w-full px-5 py-3.5 rounded-xl bg-background border border-border/50 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all duration-300 text-foreground placeholder:text-muted-foreground/40 font-medium shadow-inner"
              placeholder="••••••••"
            />
            {errors.password && (
              <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-destructive text-xs font-semibold mt-2 ml-1">{errors.password.message}</motion.p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 px-4 mt-4 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-primary/90 hover:shadow-[0_0_20px_rgba(var(--primary),0.3)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 flex justify-center items-center disabled:opacity-70 disabled:hover:translate-y-0 disabled:hover:shadow-none"
          >
            {isSubmitting ? (
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            ) : 'Sign In'}
          </button>
        </form>

        <p className="text-center mt-8 text-sm font-medium text-muted-foreground">
          New to TypeSprint?{' '}
          <Link to="/register" className="text-primary hover:text-primary/80 transition-colors font-bold">
            Create an account
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
