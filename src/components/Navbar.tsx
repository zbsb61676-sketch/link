"use client";

import Link from "next/link";
import { Shield, Briefcase, Menu, LogOut, User } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";

export default function Navbar() {
  const { data: session, status } = useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="bg-brand text-white p-1.5 rounded-lg group-hover:bg-brand-hover transition-colors">
            <Briefcase size={24} />
          </div>
          <span className="font-bold text-xl tracking-tight text-slate-900">LinkRent</span>
        </Link>
        
        <div className="hidden md:flex items-center gap-8">
          {session ? (
            <>
              {(session.user as any)?.role === "ADMIN" && (
                <Link href="/admin/accounts" className="text-sm font-medium text-slate-600 hover:text-brand transition-colors">
                  Admin Panel
                </Link>
              )}
              <Link href="/dashboard" className="text-sm font-medium text-slate-600 hover:text-brand transition-colors">
                My Accounts
              </Link>
              <Link href={(session.user as any)?.role === "ADMIN" ? "/admin/messages" : "/dashboard/messages"} className="text-sm font-medium text-slate-600 hover:text-brand transition-colors">
                Messages
              </Link>
              <Link href="/dashboard/payments" className="text-sm font-medium text-slate-600 hover:text-brand transition-colors">
                Payment History
              </Link>
              <Link href="/list-account" className="text-sm font-medium text-slate-600 hover:text-brand transition-colors">
                List Your Account
              </Link>
              <Link href="/how-it-works" className="text-sm font-medium text-slate-600 hover:text-brand transition-colors">
                How It Works
              </Link>
            </>
          ) : (
            <>
              <Link href="/how-it-works" className="text-sm font-medium text-slate-600 hover:text-brand transition-colors">
                How It Works
              </Link>
            </>
          )}
        </div>

        <div className="hidden md:flex items-center gap-4">
          {status === "loading" ? (
            <div className="w-20 h-8 bg-slate-200 animate-pulse rounded-md"></div>
          ) : session ? (
            <div className="flex items-center gap-4">
              <Link href="/settings" className="flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-brand transition-colors">
                <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center">
                  <User size={16} className="text-slate-500" />
                </div>
                <span>{session.user?.name}</span>
              </Link>
              <button 
                onClick={() => signOut()}
                className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                title="Log out"
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <>
              <Link href="/login" className="text-sm font-medium text-slate-600 hover:text-brand transition-colors">
                Log in
              </Link>
              <Link href="/signup" className="px-4 py-2 bg-brand text-white text-sm font-medium rounded-full hover:bg-brand-hover transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
                Get Started
              </Link>
            </>
          )}
        </div>

        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-2 text-slate-600"
        >
          <Menu size={24} />
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white">
          <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
            {session && (
              <Link href={session.user?.role === "ADMIN" ? "/admin/messages" : "/dashboard/messages"} className="text-sm font-medium text-slate-600 hover:text-brand transition-colors">
                Messages
              </Link>
            )}

            {session ? (
              <>
                <div className="flex items-center gap-2 text-sm font-medium text-slate-700 pb-4 border-b border-slate-100">
                  <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center">
                    <User size={16} className="text-slate-500" />
                  </div>
                  <span>{session.user?.name}</span>
                </div>
                {(session.user as any)?.role === "ADMIN" && (
                  <Link onClick={() => setIsMobileMenuOpen(false)} href="/admin/accounts" className="text-sm font-medium text-slate-600 hover:text-brand">
                    Admin Panel
                  </Link>
                )}
                <Link onClick={() => setIsMobileMenuOpen(false)} href="/dashboard" className="text-sm font-medium text-slate-600 hover:text-brand">
                  My Accounts
                </Link>
                <Link onClick={() => setIsMobileMenuOpen(false)} href="/dashboard/payments" className="text-sm font-medium text-slate-600 hover:text-brand">
                  Payment History
                </Link>
                <Link onClick={() => setIsMobileMenuOpen(false)} href="/list-account" className="text-sm font-medium text-slate-600 hover:text-brand">
                  List Your Account
                </Link>
                <Link onClick={() => setIsMobileMenuOpen(false)} href="/how-it-works" className="text-sm font-medium text-slate-600 hover:text-brand">
                  How It Works
                </Link>
                <Link onClick={() => setIsMobileMenuOpen(false)} href="/settings" className="text-sm font-medium text-slate-600 hover:text-brand">
                  Settings
                </Link>
                <button 
                  onClick={() => signOut()}
                  className="text-left text-sm font-medium text-red-600 pt-4 border-t border-slate-100"
                >
                  Log out
                </button>
              </>
            ) : (
              <>
                <Link onClick={() => setIsMobileMenuOpen(false)} href="/how-it-works" className="text-sm font-medium text-slate-600 hover:text-brand">
                  How It Works
                </Link>
                <Link onClick={() => setIsMobileMenuOpen(false)} href="/login" className="text-sm font-medium text-slate-600 hover:text-brand">
                  Log in
                </Link>
                <Link onClick={() => setIsMobileMenuOpen(false)} href="/signup" className="w-full text-center px-4 py-2 bg-brand text-white text-sm font-medium rounded-lg">
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
