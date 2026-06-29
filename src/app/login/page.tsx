"use client";

import { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const registered = searchParams.get("registered");
  
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
        setError("Invalid email or password");
      } else {
        router.push("/");
        router.refresh();
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Left side - Visual/Brand */}
      <div className="hidden lg:flex w-1/2 bg-brand text-white flex-col justify-between p-12 relative overflow-hidden">
        <div className="relative z-10">
          <Link href="/" className="text-2xl font-black tracking-tight">LinkRent.</Link>
          <div className="mt-16 max-w-lg">
            <h1 className="text-5xl font-bold leading-tight mb-6">
              Turn your LinkedIn into a passive income stream.
            </h1>
            <p className="text-brand-100 text-xl font-medium leading-relaxed">
              Log in to manage your rented accounts, track your payouts, and monitor your earnings in real-time.
            </p>
          </div>
        </div>
        
        {/* Abstract decorative elements */}
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute top-32 -right-32 w-80 h-80 bg-blue-400/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-cyan-400/20 rounded-full blur-2xl"></div>
        
        <div className="relative z-10 text-brand-100 font-medium">
          Trusted by over 1,000+ professionals worldwide.
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="w-full lg:w-1/2 flex flex-col relative">
        {/* Mobile Header */}
        <div className="lg:hidden p-6 absolute top-0 left-0 right-0 flex justify-center">
          <Link href="/" className="text-2xl font-black tracking-tight text-brand">LinkRent.</Link>
        </div>

        <main className="flex-1 flex items-center justify-center p-6 lg:p-12 mt-16 lg:mt-0">
          <div className="w-full max-w-md">
            <div className="mb-10 text-center lg:text-left">
              <h2 className="text-3xl font-bold text-slate-900 mb-2">Welcome Back</h2>
              <p className="text-slate-500 font-medium">Log in to your LinkRent account</p>
            </div>
            
            {registered && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl mb-6 text-sm flex items-center shadow-sm">
                <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                Registration successful! Please log in.
              </div>
            )}
            
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-6 text-sm flex items-center shadow-sm">
                <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"></path></svg>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand focus:border-brand outline-none text-slate-900 bg-slate-50 focus:bg-white transition-colors shadow-sm"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-sm font-semibold text-slate-700">Password</label>
                  <Link href="/forgot-password" className="text-sm text-brand hover:text-brand-hover font-semibold transition-colors">Forgot Password?</Link>
                </div>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand focus:border-brand outline-none text-slate-900 bg-slate-50 focus:bg-white transition-colors shadow-sm"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>
              
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-brand text-white rounded-xl font-bold hover:bg-brand-hover hover:shadow-lg hover:shadow-brand/20 transition-all disabled:opacity-50 disabled:hover:shadow-none mt-4 text-lg"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    Logging in...
                  </span>
                ) : "Log In"}
              </button>
            </form>

            <p className="text-center text-slate-600 font-medium mt-8">
              Don't have an account? <Link href="/signup" className="text-brand font-bold hover:text-brand-hover transition-colors">Sign up</Link>
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center"><div className="animate-spin w-8 h-8 border-4 border-brand border-t-transparent rounded-full"></div></div>}>
      <LoginContent />
    </Suspense>
  );
}
