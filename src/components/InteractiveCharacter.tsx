"use client";

import React, { useState, useEffect } from 'react';

interface InteractiveCharacterProps {
  focusedField: 'none' | 'email' | 'password' | 'name' | 'whatsapp' | 'submit';
}

export default function InteractiveCharacter({ focusedField }: InteractiveCharacterProps) {
  const isCoveringEyes = focusedField === 'password';
  const isLookingDown = focusedField === 'email' || focusedField === 'name' || focusedField === 'whatsapp';
  const isExcited = focusedField === 'submit';

  return (
    <div className="relative w-80 h-80 z-20">
      <svg viewBox="0 0 400 400" className="w-full h-full drop-shadow-2xl">
        {/* Hovering Animation Container */}
        <g className={`transition-all duration-500 ease-in-out ${isExcited ? 'animate-[bounce_1s_ease-in-out_infinite]' : 'animate-[bounce_3s_ease-in-out_infinite]'}`}>
          
          {/* Owl Body */}
          <path d="M 120 180 Q 120 100 200 100 Q 280 100 280 180 L 280 280 Q 280 340 200 340 Q 120 340 120 280 Z" fill="#38bdf8" />
          
          {/* Owl Belly */}
          <path d="M 140 220 Q 140 150 200 150 Q 260 150 260 220 L 260 280 Q 260 320 200 320 Q 140 320 140 280 Z" fill="#e0f2fe" />
          
          {/* Ears/Tufts */}
          <path d="M 120 140 L 100 80 L 160 110 Z" fill="#0284c7" />
          <path d="M 280 140 L 300 80 L 240 110 Z" fill="#0284c7" />

          {/* Eyes Base */}
          <circle cx="160" cy="160" r="35" fill="#ffffff" />
          <circle cx="240" cy="160" r="35" fill="#ffffff" />
          
          {/* Pupils (Animated based on focus) */}
          <g className="transition-all duration-300 ease-in-out" style={{ 
            transform: isLookingDown ? 'translate(0px, 12px)' : (isCoveringEyes ? 'translate(0px, 0px)' : 'translate(0px, 0px)') 
          }}>
            <circle cx="160" cy="160" r="15" fill="#0f172a" />
            <circle cx="240" cy="160" r="15" fill="#0f172a" />
            
            {/* Eye highlights */}
            <circle cx="165" cy="155" r="5" fill="#ffffff" />
            <circle cx="245" cy="155" r="5" fill="#ffffff" />
          </g>

          {/* Beak */}
          <path d="M 190 190 L 210 190 L 200 210 Z" fill="#f59e0b" className="transition-all duration-300" style={{ transform: isExcited ? 'translateY(2px) scale(1.1)' : 'none', transformOrigin: '200px 190px' }} />

          {/* Left Wing (Animated) */}
          <g className="transition-all duration-500 ease-in-out origin-[120px_220px]" 
             style={{ 
               transform: isCoveringEyes ? 'rotate(110deg) translate(20px, -60px)' : (isExcited ? 'rotate(-20deg)' : 'rotate(0deg)') 
             }}>
            <path d="M 120 200 Q 80 200 80 260 Q 80 300 120 300 Z" fill="#0284c7" />
          </g>

          {/* Right Wing (Animated) */}
          <g className="transition-all duration-500 ease-in-out origin-[280px_220px]" 
             style={{ 
               transform: isCoveringEyes ? 'rotate(-110deg) translate(-20px, -60px)' : (isExcited ? 'rotate(20deg)' : 'rotate(0deg)') 
             }}>
            <path d="M 280 200 Q 320 200 320 260 Q 320 300 280 300 Z" fill="#0284c7" />
          </g>
          
          {/* Feet */}
          <path d="M 170 330 Q 170 350 150 350 Q 180 360 190 330" fill="#f59e0b" />
          <path d="M 230 330 Q 230 350 250 350 Q 220 360 210 330" fill="#f59e0b" />
          
        </g>
        
        {/* Floating Stars/Notes when excited */}
        {isExcited && (
          <g className="animate-pulse">
            <path d="M 320 80 L 330 60 L 340 80 L 360 90 L 340 100 L 330 120 L 320 100 L 300 90 Z" fill="#fcd34d" className="scale-75 origin-center animate-[ping_1s_ease-in-out_infinite]" />
            <path d="M 60 140 L 65 125 L 70 140 L 85 145 L 70 150 L 65 165 L 60 150 L 45 145 Z" fill="#fcd34d" className="scale-50 origin-center animate-[ping_1.5s_ease-in-out_infinite]" />
          </g>
        )}
      </svg>
    </div>
  );
}
