"use client";

import { useState } from "react";
import { Copy, CheckCircle2 } from "lucide-react";

export default function ReferralWidget({ userId }: { userId: string }) {
  const [copied, setCopied] = useState(false);
  const referralLink = typeof window !== 'undefined' 
    ? `${window.location.origin}/signup?ref=${userId}`
    : `https://linkrent.com/signup?ref=${userId}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100 rounded-xl p-6 mb-8 flex flex-col md:flex-row gap-6 items-center justify-between">
      <div>
        <h2 className="text-xl font-bold text-indigo-900 mb-1 flex items-center gap-2">
          🎁 Refer a Friend, Earn ₹100!
        </h2>
        <p className="text-sm text-indigo-800 max-w-lg">
          Share your unique link. When your friend signs up and gets their LinkedIn account approved, you instantly get a ₹100 bonus payout. No limits!
        </p>
      </div>
      
      <div className="flex w-full md:w-auto items-center gap-2 bg-white p-2 rounded-lg border border-indigo-200 shadow-sm relative overflow-hidden">
        <input 
          type="text" 
          readOnly 
          value={referralLink} 
          className="bg-transparent text-sm text-slate-600 outline-none w-full md:w-64 px-2 select-all font-mono"
        />
        <button 
          onClick={handleCopy}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-md font-medium text-sm transition-colors whitespace-nowrap ${
            copied ? 'bg-green-100 text-green-700' : 'bg-indigo-600 text-white hover:bg-indigo-700'
          }`}
        >
          {copied ? <CheckCircle2 size={16} /> : <Copy size={16} />}
          {copied ? 'Copied!' : 'Copy Link'}
        </button>
      </div>
    </div>
  );
}
