"use client";

import React, { useEffect, useState } from 'react';

// A simple flower/petal SVG
const FlowerIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={className} fill="currentColor">
    <path d="M50 10 C 60 30, 80 40, 90 50 C 80 60, 60 70, 50 90 C 40 70, 20 60, 10 50 C 20 40, 40 30, 50 10 Z" />
    <circle cx="50" cy="50" r="12" fill="#FCD34D" />
  </svg>
);

const LeafIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={className} fill="currentColor">
    <path d="M50 10 Q 90 50, 50 90 Q 10 50, 50 10 Z" />
  </svg>
);

export default function FallingFlowers() {
  const [elements, setElements] = useState<Array<{ id: number; left: number; delay: number; duration: number; size: number; type: 'flower' | 'leaf' | 'firefly'; color: string; rotation: number }>>([]);

  useEffect(() => {
    // Generate random falling elements and fireflies
    const newElements = Array.from({ length: 50 }).map((_, i) => {
      const isFirefly = Math.random() > 0.6;
      
      return {
        id: i,
        left: Math.random() * 100, // percentage
        delay: Math.random() * 10, // seconds
        duration: isFirefly ? 8 + Math.random() * 10 : 10 + Math.random() * 15, // fireflies move slightly faster
        size: isFirefly ? 4 + Math.random() * 6 : 15 + Math.random() * 25, // fireflies are tiny
        type: isFirefly ? 'firefly' : ((Math.random() > 0.3 ? 'flower' : 'leaf') as 'flower' | 'leaf'),
        color: isFirefly 
          ? 'bg-yellow-200 shadow-[0_0_10px_3px_rgba(253,230,138,0.7)]' // Firefly glow
          : (Math.random() > 0.5 ? 'text-pink-200/60' : (Math.random() > 0.5 ? 'text-rose-200/50' : 'text-purple-200/50')),
        rotation: Math.random() * 360,
      };
    });
    
    setElements(newElements);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      <style>{`
        @keyframes fallAndSway {
          0% { transform: translateY(-10vh) translateX(0px) rotate(0deg); opacity: 0; }
          10% { opacity: 1; }
          50% { transform: translateY(50vh) translateX(40px) rotate(180deg); }
          90% { opacity: 1; }
          100% { transform: translateY(110vh) translateX(-30px) rotate(360deg); opacity: 0; }
        }
        
        @keyframes floatUp {
          0% { transform: translateY(110vh) translateX(0px); opacity: 0; }
          10% { opacity: 0.8; }
          50% { transform: translateY(50vh) translateX(-30px); opacity: 1; }
          90% { opacity: 0.8; }
          100% { transform: translateY(-10vh) translateX(20px); opacity: 0; }
        }
        
        .falling-element {
          animation: fallAndSway linear infinite;
          position: absolute;
          top: -50px;
        }
        
        .firefly-element {
          animation: floatUp linear infinite;
          position: absolute;
          bottom: -50px;
          border-radius: 50%;
        }
      `}</style>
      
      {elements.map((el) => {
        if (el.type === 'firefly') {
          return (
            <div 
              key={el.id}
              className={`firefly-element ${el.color}`}
              style={{
                left: `${el.left}%`,
                animationDuration: `${el.duration}s`,
                animationDelay: `${el.delay}s`,
                width: `${el.size}px`,
                height: `${el.size}px`,
              }}
            />
          );
        }

        return (
          <div 
            key={el.id}
            className={`falling-element ${el.color}`}
            style={{
              left: `${el.left}%`,
              animationDuration: `${el.duration}s`,
              animationDelay: `${el.delay}s`,
              width: `${el.size}px`,
              height: `${el.size}px`,
            }}
          >
            <div style={{ transform: `rotate(${el.rotation}deg)`, width: '100%', height: '100%' }}>
              {el.type === 'flower' ? <FlowerIcon className="w-full h-full drop-shadow-sm" /> : <LeafIcon className="w-full h-full text-green-200/40 drop-shadow-sm" />}
            </div>
          </div>
        );
      })}
    </div>
  );
}
