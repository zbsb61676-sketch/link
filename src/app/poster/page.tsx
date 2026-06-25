"use client";

import { QRCodeSVG } from "qrcode.react";

export default function PosterPage() {
  const url = "https://getlinkrent.vercel.app";

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-8">
      {/* 
        This container is the actual "Poster" aspect ratio (approx 4:5 or 1:1 suitable for WhatsApp). 
        We use a fixed aspect ratio and size so it always screenshots perfectly.
      */}
      <div 
        id="poster-canvas"
        className="relative bg-white shadow-2xl rounded-3xl overflow-hidden flex flex-col"
        style={{ width: '800px', height: '1000px' }}
      >
        {/* Top Header / Hero Area */}
        <div className="bg-brand text-white p-12 text-center relative overflow-hidden flex-shrink-0">
          {/* Decorative background shapes */}
          <div className="absolute top-0 left-0 w-full h-full opacity-10">
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
              <path d="M0,0 L100,0 L100,100 L0,100 Z" fill="url(#grid)" />
              <defs>
                <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                  <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5" />
                </pattern>
              </defs>
            </svg>
          </div>
          
          <h1 className="relative text-6xl font-extrabold tracking-tight mb-4 drop-shadow-md">
            Turn Your LinkedIn
            <br />
            Into <span className="text-amber-400">Passive Income</span>
          </h1>
          <p className="relative text-2xl font-medium text-blue-100 max-w-lg mx-auto">
            Secure, hassle-free, and guaranteed weekly payouts directly to your bank.
          </p>
        </div>

        {/* Body Content */}
        <div className="flex-1 flex flex-col items-center justify-center p-12 bg-slate-50 relative">
          <div className="grid grid-cols-2 gap-8 w-full max-w-2xl mb-12">
            
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 text-center flex flex-col items-center justify-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4 text-blue-600">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-800">Zero Effort</h3>
              <p className="text-slate-500 mt-2">Just list it and forget it. We handle everything else.</p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 text-center flex flex-col items-center justify-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 text-green-600">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-800">100% Secure</h3>
              <p className="text-slate-500 mt-2">We use strict safety protocols to keep your account safe.</p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 text-center flex flex-col items-center justify-center col-span-2">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-4 text-amber-600">
                <span className="text-3xl font-extrabold">₹</span>
              </div>
              <h3 className="text-2xl font-bold text-slate-800">Weekly Payouts via UPI</h3>
              <p className="text-slate-500 mt-2 text-lg">Guaranteed money in your bank account every 7 days.</p>
            </div>

          </div>
        </div>

        {/* Footer / Call to Action */}
        <div className="bg-slate-900 text-white p-10 flex items-center justify-between">
          <div>
            <p className="text-amber-400 font-bold text-lg mb-1 tracking-wider uppercase">Scan to Start Earning</p>
            <h2 className="text-3xl font-bold text-white mb-2">{url.replace("https://", "")}</h2>
            <p className="text-slate-400">Open your camera app to scan the code.</p>
          </div>
          
          <div className="bg-white p-4 rounded-xl shadow-lg border-4 border-slate-700">
            <QRCodeSVG 
              value={url} 
              size={140} 
              bgColor="#ffffff"
              fgColor="#0f172a"
              level="H"
              includeMargin={false}
            />
          </div>
        </div>
      </div>
      
      {/* Help text for the admin */}
      <div className="absolute top-4 left-0 w-full text-center text-slate-500 text-sm font-medium">
        (Take a screenshot of this page to use as your WhatsApp Poster!)
      </div>
    </div>
  );
}
