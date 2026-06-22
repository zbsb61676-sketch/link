"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ShieldAlert, Check } from "lucide-react";

export function ConsentModal() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Check if the user has already consented
    const hasConsented = localStorage.getItem("linkrent_consent");
    if (!hasConsented) {
      setShow(true);
      // Optional: Prevent scrolling while modal is open
      document.body.style.overflow = "hidden";
    }
  }, []);

  const handleConsent = () => {
    localStorage.setItem("linkrent_consent", "true");
    setShow(false);
    document.body.style.overflow = "auto";
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 md:p-8 animate-slide-up border border-slate-200">
        
        <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShieldAlert size={32} />
        </div>
        
        <h2 className="text-2xl font-bold text-slate-900 text-center mb-4">
          Age & Terms Verification
        </h2>
        
        <div className="space-y-4 text-slate-600 mb-8 text-sm md:text-base">
          <p>
            Welcome to LinkRent! To proceed and use our platform, you must confirm that you meet our legal requirements.
          </p>
          <ul className="space-y-2 bg-slate-50 p-4 rounded-xl border border-slate-100">
            <li className="flex gap-2">
              <Check size={20} className="text-green-500 flex-shrink-0" />
              <span>I am at least <strong>18 years of age</strong> or older.</span>
            </li>
            <li className="flex gap-2">
              <Check size={20} className="text-green-500 flex-shrink-0" />
              <span>I have read and agree to the <Link href="/terms" className="text-brand hover:underline font-medium">Terms of Service</Link>.</span>
            </li>
            <li className="flex gap-2">
              <Check size={20} className="text-green-500 flex-shrink-0" />
              <span>I have read and agree to the <Link href="/privacy" className="text-brand hover:underline font-medium">Privacy Policy</Link>.</span>
            </li>
          </ul>
          <p className="text-xs text-slate-500 text-center mt-4">
            If you do not meet these requirements or do not agree to the terms, please exit the website.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button 
            onClick={() => window.location.href = "https://google.com"}
            className="px-6 py-3 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors w-full sm:w-auto"
          >
            Exit Site
          </button>
          <button 
            onClick={handleConsent}
            className="flex-1 px-6 py-3 bg-brand text-white rounded-lg font-medium hover:bg-brand-hover transition-colors shadow-md shadow-brand/20"
          >
            I am 18+ and Agree
          </button>
        </div>

      </div>
    </div>
  );
}
