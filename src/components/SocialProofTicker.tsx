"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, DollarSign, ShieldCheck } from "lucide-react";

const MOCK_EVENTS = [
  { name: "Rahul", location: "Mumbai", action: "received a payout", amount: "₹900", icon: "dollar" },
  { name: "Priya", location: "Bangalore", action: "just listed an account", amount: null, icon: "shield" },
  { name: "Amit", location: "Delhi", action: "received a payout", amount: "₹400", icon: "dollar" },
  { name: "Sneha", location: "Pune", action: "verified their account", amount: null, icon: "check" },
  { name: "Vikram", location: "Hyderabad", action: "received a payout", amount: "₹200", icon: "dollar" },
  { name: "Neha", location: "Chennai", action: "just listed an account", amount: null, icon: "shield" },
];

export default function SocialProofTicker() {
  const [currentEvent, setCurrentEvent] = useState(MOCK_EVENTS[0]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const cycleEvent = () => {
      // Pick a random event
      const randomEvent = MOCK_EVENTS[Math.floor(Math.random() * MOCK_EVENTS.length)];
      setCurrentEvent(randomEvent);
      
      // Show it
      setIsVisible(true);

      // Hide it after 4 seconds
      setTimeout(() => {
        setIsVisible(false);
        
        // Wait a random time between 5-10 seconds before showing the next one
        const nextDelay = Math.floor(Math.random() * 5000) + 5000;
        timeoutId = setTimeout(() => {
          cycleEvent();
        }, nextDelay);
        
      }, 4000);
    };

    // Start the ticker after 3 seconds
    timeoutId = setTimeout(() => {
      cycleEvent();
    }, 3000);

    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <div 
      className={`fixed bottom-6 left-6 z-50 transition-all duration-500 transform ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0 pointer-events-none"
      }`}
    >
      <div className="bg-white rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-slate-100 p-4 flex items-center gap-4 max-w-sm">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
          currentEvent.icon === 'dollar' ? 'bg-green-100 text-green-600' :
          currentEvent.icon === 'shield' ? 'bg-blue-100 text-blue-600' :
          'bg-brand/10 text-brand'
        }`}>
          {currentEvent.icon === 'dollar' && <DollarSign size={20} />}
          {currentEvent.icon === 'shield' && <ShieldCheck size={20} />}
          {currentEvent.icon === 'check' && <CheckCircle2 size={20} />}
        </div>
        
        <div>
          <p className="text-sm text-slate-800 leading-tight">
            <span className="font-bold text-slate-900">{currentEvent.name}</span> from {currentEvent.location} {currentEvent.action}
            {currentEvent.amount && <span className="font-bold text-green-600 ml-1">{currentEvent.amount}</span>}
          </p>
          <p className="text-xs text-slate-500 mt-1">Just now</p>
        </div>
      </div>
    </div>
  );
}
