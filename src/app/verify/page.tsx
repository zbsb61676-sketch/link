"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";

function VerifyContent() {
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("Verifying your email address...");
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("No verification token provided. Please check the link in your email.");
      return;
    }

    const verifyEmail = async () => {
      try {
        const res = await fetch("/api/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });

        if (res.ok) {
          setStatus("success");
          setMessage("Your email has been successfully verified! You can now log in.");
        } else {
          const data = await res.json();
          setStatus("error");
          setMessage(data.error || "Failed to verify email. The link may have expired.");
        }
      } catch (err) {
        setStatus("error");
        setMessage("An unexpected error occurred. Please try again later.");
      }
    };

    verifyEmail();
  }, [token]);

  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 w-full max-w-md text-center">
      {status === "loading" && (
        <div className="py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-brand mb-4"></div>
          <p className="text-slate-600">{message}</p>
        </div>
      )}

      {status === "success" && (
        <div className="py-4">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
            <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Email Verified!</h1>
          <p className="text-slate-600 mb-8">{message}</p>
          <Link 
            href="/login" 
            className="block w-full py-3 px-4 bg-brand text-white text-center rounded-lg font-medium hover:bg-brand-hover transition-colors"
          >
            Go to Login
          </Link>
        </div>
      )}

      {status === "error" && (
        <div className="py-4">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-6">
            <svg className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Verification Failed</h1>
          <p className="text-slate-600 mb-8">{message}</p>
          <div className="space-y-4">
            <Link 
              href="/signup" 
              className="block w-full py-3 px-4 bg-white border border-slate-300 text-slate-700 text-center rounded-lg font-medium hover:bg-slate-50 transition-colors"
            >
              Back to Sign Up
            </Link>
            <Link 
              href="/login" 
              className="block w-full py-3 px-4 bg-brand text-white text-center rounded-lg font-medium hover:bg-brand-hover transition-colors"
            >
              Go to Login
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default function VerifyPage() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Navbar />
      <main className="flex-1 flex items-center justify-center p-4">
        <Suspense fallback={<div className="p-8">Loading verification...</div>}>
          <VerifyContent />
        </Suspense>
      </main>
    </div>
  );
}
