"use client";

import { useState, useEffect } from "react";
import { Calculator, Users, Clock, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function EarningsCalculator() {
  const [connections, setConnections] = useState(1000);
  const [age, setAge] = useState(2);
  const [earnings, setEarnings] = useState(0);

  useEffect(() => {
    // New Tiered Pricing Logic:
    // 0-99 connections: ₹0
    // 100-499 connections (1+ years): ₹200 / week
    // 500-999 connections (1+ years): ₹400 / week
    // 1000+ connections (1+ years): ₹900 / week
    
    let calc = 0;
    if (age >= 1) {
      if (connections >= 1000) {
        calc = 900;
      } else if (connections >= 500) {
        calc = 400;
      } else if (connections >= 100) {
        calc = 200;
      }
    }
    
    setEarnings(calc);
  }, [connections, age]);

  return (
    <div className="w-full max-w-4xl mx-auto relative z-10 -mt-16 sm:-mt-24 mb-24 px-4">
      <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-6 md:p-10 overflow-hidden relative">
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -z-10 transform translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand/10 rounded-full blur-3xl -z-10 transform -translate-x-1/2 translate-y-1/2"></div>
        
        <div className="flex flex-col md:flex-row gap-10 items-center">
          
          {/* Controls Side */}
          <div className="flex-1 w-full space-y-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-brand/10 p-2 rounded-xl text-brand">
                <Calculator size={24} />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">Earnings Calculator</h2>
            </div>
            
            <div className="space-y-6">
              {/* Connections Slider */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                    <Users size={16} className="text-slate-400" />
                    Number of Connections
                  </label>
                  <span className="text-lg font-bold text-brand">
                    {connections >= 10000 ? "10,000+" : connections.toLocaleString()}
                  </span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="10000" 
                  step="100" 
                  value={connections} 
                  onChange={(e) => setConnections(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand"
                />
                <div className="flex justify-between text-xs text-slate-400 font-medium">
                  <span>0</span>
                  <span>10k+</span>
                </div>
              </div>

              {/* Age Slider */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                    <Clock size={16} className="text-slate-400" />
                    Account Age (Years)
                  </label>
                  <span className="text-lg font-bold text-brand">
                    {age >= 10 ? "10+" : age} years
                  </span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="10" 
                  step="1" 
                  value={age} 
                  onChange={(e) => setAge(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand"
                />
                <div className="flex justify-between text-xs text-slate-400 font-medium">
                  <span>New</span>
                  <span>10+ yrs</span>
                </div>
              </div>
            </div>
          </div>

          {/* Results Side */}
          <div className="w-full md:w-80 flex flex-col items-center justify-center p-8 bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl text-white shadow-inner relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
            
            <p className="text-slate-300 text-sm font-medium uppercase tracking-wider mb-2 relative z-10">Estimated Payout</p>
            
            <div className="flex items-start gap-1 relative z-10 mb-6">
              <span className="text-3xl font-bold text-emerald-400 mt-2">₹</span>
              <span className="text-7xl font-extrabold tracking-tight text-white">{earnings}</span>
              <span className="text-slate-400 font-medium self-end mb-2">/week</span>
            </div>

            <Link href="/list-account" className="w-full relative z-10 py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_25px_rgba(16,185,129,0.5)] hover:-translate-y-0.5 flex items-center justify-center gap-2">
              Claim This Rate <ArrowRight size={18} />
            </Link>
            
            <p className="text-xs text-slate-400 mt-4 text-center relative z-10">
              *Estimates are based on current market demand and account quality.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
