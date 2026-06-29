"use client";

import React, { useEffect, useState } from 'react';

export default function FallingFlowers() {
  const [elements, setElements] = useState<Array<{ id: number; left: number; delay: number; duration: number; size: number; type: 'flower' | 'leaf' | 'firefly'; color: string; rotation: number }>>([]);

  useEffect(() => {
    // Generate random falling elements and fireflies
    const newElements = Array.from({ length: 25 }).map((_, i) => {
      const isFirefly = Math.random() > 0.6;
      
      return {
        id: i,
        left: Math.random() * 100, // percentage
        delay: Math.random() * 10, // seconds
        duration: isFirefly ? 8 + Math.random() * 10 : 10 + Math.random() * 15, // fireflies move slightly faster
        size: isFirefly ? 4 + Math.random() * 6 : 15 + Math.random() * 15, // slightly smaller sizes
        type: (isFirefly ? 'firefly' : (Math.random() > 0.3 ? 'flower' : 'leaf')) as 'flower' | 'leaf' | 'firefly',
        color: isFirefly 
          ? 'bg-yellow-300 shadow-[0_0_8px_2px_rgba(253,230,138,0.8)]' // Firefly glow
          : '',
        rotation: Math.random() * 360,
      };
    });
    
    setElements(newElements);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      <style>{`
        @keyframes fallAndSway {
          0% { transform: translate3d(0px, -10vh, 0) rotate(0deg); opacity: 0; }
          10% { opacity: 0.8; }
          50% { transform: translate3d(30px, 50vh, 0) rotate(180deg); }
          90% { opacity: 0.8; }
          100% { transform: translate3d(-20px, 110vh, 0) rotate(360deg); opacity: 0; }
        }
        
        @keyframes floatUp {
          0% { transform: translate3d(0px, 110vh, 0); opacity: 0; }
          10% { opacity: 0.8; }
          50% { transform: translate3d(-20px, 50vh, 0); opacity: 1; }
          90% { opacity: 0.8; }
          100% { transform: translate3d(20px, -10vh, 0); opacity: 0; }
        }
        
        .falling-element {
          animation: fallAndSway linear infinite;
          position: absolute;
          top: -50px;
          will-change: transform, opacity;
          transform: translateZ(0);
          user-select: none;
        }
        
        .firefly-element {
          animation: floatUp linear infinite;
          position: absolute;
          bottom: -50px;
          border-radius: 50%;
          will-change: transform, opacity;
          transform: translateZ(0);
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
            className="falling-element"
            style={{
              left: `${el.left}%`,
              animationDuration: `${el.duration}s`,
              animationDelay: `${el.delay}s`,
              fontSize: `${el.size}px`,
              lineHeight: 1,
            }}
          >
            <div style={{ transform: `rotate(${el.rotation}deg)` }}>
              {el.type === 'flower' ? '🌸' : '🍃'}
            </div>
          </div>
        );
      })}
    </div>
  );
}
