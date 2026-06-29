"use client";

import { useState } from "react";
import Link from "next/link";
import InteractiveCharacter from "@/components/InteractiveCharacter";
import FallingFlowers from "@/components/FallingFlowers";

export default function SignupPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    whatsappNumber: "",
    password: "",
  });
  
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [focusedField, setFocusedField] = useState<'none' | 'email' | 'password' | 'name' | 'whatsapp' | 'submit'>('none');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "An error occurred during registration.");
      }

      setSuccess(true);
    } catch (err: any) {
      setError(err.message);
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
        
        {/* Main Signup Card - Adding floating animation */}
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
          
          {success ? (
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6 shadow-inner">
                <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">Check your inbox</h3>
              <p className="text-slate-600 mb-8 leading-relaxed">
                We've sent a verification link to <strong>{formData.email}</strong>. Please click the link to activate your account.
              </p>
              
              <div className="bg-amber-50/80 backdrop-blur border border-amber-200/50 text-amber-700 p-4 rounded-xl text-sm mb-8 text-left flex items-start shadow-sm">
                <svg className="w-5 h-5 mr-3 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                </svg>
                <span>If you don't see the email within a minute, please check your <strong>Spam</strong> or <strong>Junk</strong> folder.</span>
              </div>
              
              <Link href="/login" className="inline-block w-full py-4 bg-gradient-to-r from-brand to-blue-600 text-white rounded-xl font-bold hover:shadow-[0_10px_20px_rgba(37,99,235,0.3)] hover:-translate-y-0.5 transition-all">
                Return to Login
              </Link>
            </div>
          ) : (
            <>
              <div className="mb-8 text-center">
                <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 mb-2">Create an Account</h2>
                <p className="text-slate-500 font-medium">Join LinkRent and start earning today.</p>
              </div>
          
          {error && (
            <div className="bg-red-50/80 backdrop-blur border border-red-200/50 text-red-600 px-4 py-3 rounded-xl mb-6 text-sm flex items-center shadow-sm animate-pulse">
              <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"></path></svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Full Name</label>
              <input
                type="text"
                required
                placeholder="John Doe"
                className="w-full px-4 py-3.5 border border-slate-200 rounded-xl focus:ring-4 focus:ring-brand/20 focus:border-brand outline-none text-slate-900 bg-white/50 focus:bg-white transition-all shadow-sm"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                onFocus={() => setFocusedField('name')}
                onBlur={() => setFocusedField('none')}
              />
            </div>
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
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">WhatsApp Number</label>
              <input
                type="tel"
                required
                placeholder="+91 9876543210"
                className="w-full px-4 py-3.5 border border-slate-200 rounded-xl focus:ring-4 focus:ring-brand/20 focus:border-brand outline-none text-slate-900 bg-white/50 focus:bg-white transition-all shadow-sm"
                value={formData.whatsappNumber}
                onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                onFocus={() => setFocusedField('whatsapp')}
                onBlur={() => setFocusedField('none')}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Password</label>
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
              <p className="text-xs text-slate-500 mt-2">Must be at least 8 characters.</p>
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
                  Creating account...
                </span>
              ) : "Sign Up"}
            </button>
          </form>
          
          <div className="mt-8 pt-6 border-t border-slate-100">
            <p className="text-center text-slate-600 font-medium">
              Already have an account? <Link href="/login" className="text-brand font-bold hover:text-brand-hover hover:underline underline-offset-4 transition-all">Log in</Link>
            </p>
          </div>
          </>
          )}
        </main>
      </div>
    </div>
  );
}
