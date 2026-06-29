"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import InteractiveCharacter from "@/components/InteractiveCharacter";
import FallingFlowers from "@/components/FallingFlowers";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const registered = searchParams.get('registered') === 'true';
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<'none' | 'email' | 'password' | 'submit'>('none');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email: formData.email,
        password: formData.password,
      });

      if (res?.error) {
        setError(res.error);
      } else {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch (err) {
      setError("An error occurred during login. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex flex-col items-center justify-center p-4 md:p-8 overflow-hidden bg-gradient-to-br from-blue-900 via-indigo-900 to-violet-900">
      
      {/* Abstract Glowing Orbs in Background (Lightweight) */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        {/* We use radial-gradient instead of CSS blur to save 90% GPU usage */}
        <div className="absolute -bottom-32 -left-32 w-[40rem] h-[40rem] rounded-full mix-blend-screen opacity-40 animate-pulse duration-1000 transform-gpu" style={{ background: 'radial-gradient(circle, rgba(103,232,249,0.3) 0%, rgba(103,232,249,0) 70%)' }}></div>
        <div className="absolute top-1/4 right-1/4 w-[30rem] h-[30rem] rounded-full mix-blend-screen opacity-30 animate-pulse duration-700 transform-gpu" style={{ background: 'radial-gradient(circle, rgba(232,121,249,0.3) 0%, rgba(232,121,249,0) 70%)' }}></div>
      </div>
      
      {/* Falling Flowers Animation (with fireflies) */}
      <FallingFlowers />
      
      {/* Brand Header */}
      <div className="absolute top-6 left-6 md:top-10 md:left-10 z-30">
        <Link href="/" className="text-3xl font-black tracking-tight text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.3)] hover:scale-105 transition-transform duration-300 block transform-gpu">LinkRent.</Link>
      </div>

      <div className="w-full max-w-md relative z-10 mt-20 md:mt-0">
        {/* Animated Cartoon Characters sitting on top of the box with Magical Glowing Aura */}
        <div className="w-full absolute -top-28 left-0 right-0 flex justify-center pointer-events-none drop-shadow-2xl">
          {/* Glowing Aura Behind Characters */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-32 bg-white/40 blur-2xl rounded-full mix-blend-overlay transform-gpu"></div>
          <InteractiveCharacter focusedField={focusedField} emailValue={formData.email} />
        </div>
        
        {/* Main Login Card - Adding floating animation */}
        <style>{`
          @keyframes float {
            0% { transform: translate3d(0, 0px, 0); }
            50% { transform: translate3d(0, -10px, 0); }
            100% { transform: translate3d(0, 0px, 0); }
          }
          .floating-card {
            animation: float 6s ease-in-out infinite;
            will-change: transform;
            transform: translateZ(0);
          }
        `}</style>
        <main className="floating-card bg-white/90 backdrop-blur-2xl rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.3),inset_0_1px_1px_rgba(255,255,255,0.8)] border border-white/50 p-8 md:p-10 relative pt-12">
          
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 mb-2">Welcome Back</h2>
            <p className="text-slate-500 font-medium">Log in to manage your earnings.</p>
          </div>

          {registered && (
            <div className="bg-green-50/80 backdrop-blur border border-green-200/50 text-green-700 px-4 py-3 rounded-xl mb-6 text-sm flex items-center shadow-sm">
              <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
              Registration successful! Please log in.
            </div>
          )}

          {error && (
            <div className="bg-red-50/80 backdrop-blur border border-red-200/50 text-red-600 px-4 py-3 rounded-xl mb-6 text-sm flex items-center shadow-sm animate-pulse">
              <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"></path></svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email Address</label>
              <input
                type="email"
                required
                placeholder="name@example.com"
                className="w-full px-4 py-3.5 border border-slate-200 rounded-xl focus:ring-4 focus:ring-brand/20 focus:border-brand outline-none text-slate-900 bg-white/50 focus:bg-white transition-all shadow-sm"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                onFocus={() => setFocusedField('email')}
                onBlur={() => setFocusedField('none')}
              />
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-semibold text-slate-700">Password</label>
                <Link href="/forgot-password" className="text-sm font-medium text-brand hover:text-brand-hover">
                  Forgot password?
                </Link>
              </div>
              <input
                type="password"
                required
                placeholder="••••••••"
                className="w-full px-4 py-3.5 border border-slate-200 rounded-xl focus:ring-4 focus:ring-brand/20 focus:border-brand outline-none text-slate-900 bg-white/50 focus:bg-white transition-all shadow-sm"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                onFocus={() => setFocusedField('password')}
                onBlur={() => setFocusedField('none')}
              />
            </div>
            
            <button
              type="submit"
              disabled={loading}
              onMouseEnter={() => setFocusedField('submit')}
              onMouseLeave={() => setFocusedField('none')}
              className="w-full py-4 bg-gradient-to-r from-brand to-blue-600 text-white rounded-xl font-bold hover:shadow-[0_10px_20px_rgba(37,99,235,0.3)] hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:hover:shadow-none disabled:hover:translate-y-0 mt-2 text-lg"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  Logging in...
                </span>
              ) : "Log In"}
            </button>
          </form>
          
          <div className="mt-8 pt-6 border-t border-slate-100">
            <p className="text-center text-slate-600 font-medium">
              Don't have an account? <Link href="/signup" className="text-brand font-bold hover:text-brand-hover hover:underline underline-offset-4 transition-all">Sign up</Link>
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-brand flex items-center justify-center"><div className="animate-pulse w-16 h-16 bg-white/20 rounded-full"></div></div>}>
      <LoginContent />
    </Suspense>
  );
}
