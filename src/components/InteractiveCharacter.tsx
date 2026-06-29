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
  // Base position is left (0), moves right as text grows
  // For the left eye:
  const leftEyeX = isLookingDown ? -5 + (textLength * 0.4) : 0;
  const leftEyeY = isLookingDown ? 8 : 0;
  
  // For the right eye:
  const rightEyeX = isLookingDown ? -5 + (textLength * 0.4) : 0;
  const rightEyeY = isLookingDown ? 8 : 0;

  // The arms covering eyes
  const leftArmRotate = isPassword ? -130 : 0;
  const leftArmTranslateX = isPassword ? -20 : 0;
  const leftArmTranslateY = isPassword ? -90 : 0;

  const rightArmRotate = isPassword ? 130 : 0;
  const rightArmTranslateX = isPassword ? 20 : 0;
  const rightArmTranslateY = isPassword ? -90 : 0;

  return (
    <div className="relative w-80 h-80 z-20 flex items-center justify-center">
      <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-xl overflow-visible">
        <g className="transition-all duration-300 ease-out">
          {/* Bear Body */}
          <path d="M 60 200 Q 100 120 140 200 Z" fill="#8B5A2B" />
          
          {/* Bear Head */}
          <circle cx="100" cy="110" r="50" fill="#8B5A2B" />
          
          {/* Ears */}
          <circle cx="60" cy="70" r="18" fill="#8B5A2B" />
          <circle cx="60" cy="70" r="10" fill="#D2B48C" />
          
          <circle cx="140" cy="70" r="18" fill="#8B5A2B" />
          <circle cx="140" cy="70" r="10" fill="#D2B48C" />
          
          {/* Snout */}
          <ellipse cx="100" cy="130" rx="25" ry="18" fill="#D2B48C" />
          <circle cx="100" cy="120" r="8" fill="#3E2723" />
          <path d="M 100 128 L 100 138" stroke="#3E2723" strokeWidth="2" />
          <path d="M 90 138 Q 100 145 110 138" stroke="#3E2723" strokeWidth="2" fill="none" />

          {/* Whites of Eyes */}
          <circle cx="80" cy="100" r="12" fill="#FFFFFF" />
          <circle cx="120" cy="100" r="12" fill="#FFFFFF" />

          {/* Pupils */}
          <g className="transition-all duration-75 ease-linear">
            <circle cx={80 + leftEyeX} cy={100 + leftEyeY} r="5" fill="#3E2723" />
            <circle cx={120 + rightEyeX} cy={100 + rightEyeY} r="5" fill="#3E2723" />
          </g>

          {/* Left Arm (Covers Eye) */}
          <g 
            className="transition-all duration-500 ease-in-out" 
            style={{ 
              transformOrigin: '50px 170px',
              transform: `translate(${leftArmTranslateX}px, ${leftArmTranslateY}px) rotate(${leftArmRotate}deg)` 
            }}
          >
            <path d="M 50 170 Q 30 150 40 120 Q 55 110 70 120 Q 80 150 50 170 Z" fill="#8B5A2B" />
            {/* Paw pad */}
            <circle cx="55" cy="130" r="8" fill="#D2B48C" />
          </g>

          {/* Right Arm (Covers Eye) */}
          <g 
            className="transition-all duration-500 ease-in-out" 
            style={{ 
              transformOrigin: '150px 170px',
              transform: `translate(${rightArmTranslateX}px, ${rightArmTranslateY}px) rotate(${rightArmRotate}deg)` 
            }}
          >
            <path d="M 150 170 Q 170 150 160 120 Q 145 110 130 120 Q 120 150 150 170 Z" fill="#8B5A2B" />
            {/* Paw pad */}
            <circle cx="145" cy="130" r="8" fill="#D2B48C" />
          </g>
        </g>
      </svg>
    </div>
  );
}
