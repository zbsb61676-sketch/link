"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ name: "", email: "", password: "", whatsappNumber: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setSuccess(true);
      } else {
        const data = await res.json();
        setError(data.error || "Failed to register");
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
      <div className="hidden lg:flex w-1/2 bg-slate-900 text-white flex-col justify-between p-12 relative overflow-hidden">
        <div className="relative z-10">
          <Link href="/" className="text-2xl font-black tracking-tight text-white">LinkRent.</Link>
          <div className="mt-16 max-w-lg">
            <h1 className="text-5xl font-bold leading-tight mb-6">
              Join the future of passive income.
            </h1>
            <p className="text-slate-300 text-xl font-medium leading-relaxed mb-8">
              Create an account in less than a minute. List your LinkedIn profile securely and start earning up to ₹3,600 every month.
            </p>
            
            <ul className="space-y-4">
              <li className="flex items-center text-slate-300">
                <div className="w-8 h-8 rounded-full bg-brand/20 text-brand flex items-center justify-center mr-4">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                </div>
                Guaranteed weekly payouts
              </li>
              <li className="flex items-center text-slate-300">
                <div className="w-8 h-8 rounded-full bg-brand/20 text-brand flex items-center justify-center mr-4">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                </div>
                100% secure. We never need your password.
              </li>
              <li className="flex items-center text-slate-300">
                <div className="w-8 h-8 rounded-full bg-brand/20 text-brand flex items-center justify-center mr-4">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                </div>
                Cancel anytime with zero fees
              </li>
            </ul>
          </div>
        </div>
        
        {/* Abstract decorative elements */}
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-brand/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 -left-10 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl"></div>
      </div>

      {/* Right side - Signup Form */}
      <div className="w-full lg:w-1/2 flex flex-col relative overflow-y-auto">
        {/* Mobile Header */}
        <div className="lg:hidden p-6 absolute top-0 left-0 right-0 flex justify-center bg-white/80 backdrop-blur-md z-20">
          <Link href="/" className="text-2xl font-black tracking-tight text-brand">LinkRent.</Link>
        </div>

        <main className="flex-1 flex items-center justify-center p-6 lg:p-12 mt-16 lg:mt-0">
          <div className="w-full max-w-md">
            {success ? (
              <div className="text-center bg-white p-8 rounded-2xl shadow-xl shadow-brand/5 border border-slate-100">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
                  <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3">Check your inbox</h3>
                <p className="text-slate-600 mb-8 leading-relaxed">
                  We've sent a verification link to <strong>{formData.email}</strong>. Please click the link to activate your account.
                </p>
                
                <div className="bg-amber-50 border border-amber-200 text-amber-700 p-4 rounded-xl text-sm mb-8 text-left flex items-start">
                  <svg className="w-5 h-5 mr-3 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                  </svg>
                  <span>If you don't see the email within a minute, please check your <strong>Spam</strong> or <strong>Junk</strong> folder.</span>
                </div>
                
                <Link href="/login" className="inline-block w-full py-3.5 bg-brand text-white rounded-xl font-bold hover:bg-brand-hover transition-colors shadow-md shadow-brand/20">
                  Return to Login
                </Link>
              </div>
            ) : (
              <>
                <div className="mb-10 text-center lg:text-left">
                  <h2 className="text-3xl font-bold text-slate-900 mb-2">Create an Account</h2>
                  <p className="text-slate-500 font-medium">Join LinkRent and start earning today.</p>
                </div>
            
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-6 text-sm flex items-center shadow-sm">
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
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand focus:border-brand outline-none text-slate-900 bg-slate-50 focus:bg-white transition-colors shadow-sm"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
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
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">WhatsApp Number</label>
                <input
                  type="tel"
                  required
                  placeholder="+91 9876543210"
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand focus:border-brand outline-none text-slate-900 bg-slate-50 focus:bg-white transition-colors shadow-sm"
                  value={formData.whatsappNumber}
                  onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Password</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand focus:border-brand outline-none text-slate-900 bg-slate-50 focus:bg-white transition-colors shadow-sm"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                <p className="text-xs text-slate-500 mt-2">Must be at least 8 characters.</p>
              </div>
              
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-brand text-white rounded-xl font-bold hover:bg-brand-hover hover:shadow-lg hover:shadow-brand/20 transition-all disabled:opacity-50 disabled:hover:shadow-none mt-4 text-lg"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    Creating account...
                  </span>
                ) : "Sign Up"}
              </button>
            </form>

            <p className="text-center text-slate-600 font-medium mt-8 pb-8 lg:pb-0">
              Already have an account? <Link href="/login" className="text-brand font-bold hover:text-brand-hover transition-colors">Log in</Link>
            </p>
            </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
