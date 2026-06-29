"use client";

import React from 'react';

interface InteractiveCharacterProps {
  focusedField: 'none' | 'email' | 'password' | 'name' | 'whatsapp' | 'submit';
  emailValue: string;
}

export default function InteractiveCharacter({ focusedField, emailValue }: InteractiveCharacterProps) {
  const isPassword = focusedField === 'password';
  const isLookingDown = focusedField === 'email' || focusedField === 'name' || focusedField === 'whatsapp';
  
  // Calculate eye position based on text length (max ~30 chars)
  const textLength = Math.min(emailValue.length, 30);
  const trackX = isLookingDown ? -5 + (textLength * 0.4) : 0;
  const trackY = isLookingDown ? 8 : 0;

  // Arms covering eyes for Bear
  const leftArmRotate = isPassword ? -130 : 0;
  const leftArmTranslateX = isPassword ? -15 : 0;
  const leftArmTranslateY = isPassword ? -50 : 0;

  const rightArmRotate = isPassword ? 130 : 0;
  const rightArmTranslateX = isPassword ? 15 : 0;
  const rightArmTranslateY = isPassword ? -50 : 0;

  // Wings covering eyes for Owl
  const leftWingRotate = isPassword ? 120 : 0;
  const rightWingRotate = isPassword ? -120 : 0;

  return (
    <div className="relative w-full h-32 z-20 flex items-end justify-center -mb-2 overflow-visible">
      {/* 
        Container for multiple characters sitting on the top edge of the box. 
        We use an SVG viewBox that is wide enough to hold both.
      */}
      <svg viewBox="0 0 400 150" className="w-[300px] sm:w-[400px] h-auto drop-shadow-xl overflow-visible">
        <g className="transition-all duration-300 ease-out">
          
          {/* ==================== 1. THE BEAR (Left Side) ==================== */}
          <g transform="translate(40, 20)">
            {/* Bear Body */}
            <path d="M 40 130 Q 80 50 120 130 Z" fill="#8B5A2B" />
            
            {/* Bear Head */}
            <circle cx="80" cy="50" r="45" fill="#8B5A2B" />
            
            {/* Ears */}
            <circle cx="45" cy="15" r="15" fill="#8B5A2B" />
            <circle cx="45" cy="15" r="8" fill="#D2B48C" />
            
            <circle cx="115" cy="15" r="15" fill="#8B5A2B" />
            <circle cx="115" cy="15" r="8" fill="#D2B48C" />
            
            {/* Snout */}
            <ellipse cx="80" cy="65" rx="20" ry="15" fill="#D2B48C" />
            <circle cx="80" cy="58" r="6" fill="#3E2723" />
            <path d="M 80 64 L 80 72" stroke="#3E2723" strokeWidth="2" />
            <path d="M 72 72 Q 80 78 88 72" stroke="#3E2723" strokeWidth="2" fill="none" />

            {/* Whites of Eyes */}
            <circle cx="62" cy="40" r="10" fill="#FFFFFF" />
            <circle cx="98" cy="40" r="10" fill="#FFFFFF" />

            {/* Pupils */}
            <g className="transition-all duration-75 ease-linear">
              <circle cx={62 + trackX} cy={40 + trackY} r="4.5" fill="#3E2723" />
              <circle cx={98 + trackX} cy={40 + trackY} r="4.5" fill="#3E2723" />
            </g>

            {/* Left Arm (Covers Eye) */}
            <g className="transition-all duration-500 ease-in-out" style={{ transformOrigin: '40px 100px', transform: `translate(${leftArmTranslateX}px, ${leftArmTranslateY}px) rotate(${leftArmRotate}deg)` }}>
              <path d="M 40 110 Q 20 90 30 65 Q 45 55 55 65 Q 65 90 40 110 Z" fill="#8B5A2B" />
              <circle cx="43" cy="72" r="6" fill="#D2B48C" />
            </g>

            {/* Right Arm (Covers Eye) */}
            <g className="transition-all duration-500 ease-in-out" style={{ transformOrigin: '120px 100px', transform: `translate(${rightArmTranslateX}px, ${rightArmTranslateY}px) rotate(${rightArmRotate}deg)` }}>
              <path d="M 120 110 Q 140 90 130 65 Q 115 55 105 65 Q 95 90 120 110 Z" fill="#8B5A2B" />
              <circle cx="117" cy="72" r="6" fill="#D2B48C" />
            </g>
          </g>


          {/* ==================== 2. THE OWL (Right Side) ==================== */}
          <g transform="translate(200, 25)">
            {/* Owl Body */}
            <path d="M 40 125 Q 40 45 100 45 Q 160 45 160 125 Z" fill="#38bdf8" />
            <path d="M 60 125 Q 60 70 100 70 Q 140 70 140 125 Z" fill="#e0f2fe" />
            
            {/* Ears/Tufts */}
            <path d="M 40 75 L 30 30 L 75 50 Z" fill="#0284c7" />
            <path d="M 160 75 L 170 30 L 125 50 Z" fill="#0284c7" />

            {/* Eyes Base */}
            <circle cx="75" cy="70" r="22" fill="#ffffff" />
            <circle cx="125" cy="70" r="22" fill="#ffffff" />
            
            {/* Pupils */}
            <g className="transition-all duration-75 ease-linear">
              <circle cx={75 + trackX} cy={70 + trackY} r="10" fill="#0f172a" />
              <circle cx={125 + trackX} cy={70 + trackY} r="10" fill="#0f172a" />
              <circle cx={78 + trackX} cy={67 + trackY} r="3" fill="#ffffff" />
              <circle cx={128 + trackX} cy={67 + trackY} r="3" fill="#ffffff" />
            </g>

            {/* Beak */}
            <path d="M 92 88 L 108 88 L 100 102 Z" fill="#f59e0b" />

            {/* Left Wing (Covers Eye) */}
            <g className="transition-all duration-500 ease-in-out origin-[40px_100px]" style={{ transform: `rotate(${leftWingRotate}deg)` }}>
              <path d="M 40 100 Q 15 100 15 130 Q 15 160 40 160 Z" fill="#0284c7" />
            </g>

            {/* Right Wing (Covers Eye) */}
            <g className="transition-all duration-500 ease-in-out origin-[160px_100px]" style={{ transform: `rotate(${rightWingRotate}deg)` }}>
              <path d="M 160 100 Q 185 100 185 130 Q 185 160 160 160 Z" fill="#0284c7" />
            </g>
          </g>

        </g>
      </svg>
    </div>
  );
}
