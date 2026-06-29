"use client";

import React, { useState, useEffect } from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

interface InteractiveCharacterProps {
  focusedField: 'none' | 'email' | 'password' | 'name' | 'whatsapp' | 'submit';
}

export default function InteractiveCharacter({ focusedField }: InteractiveCharacterProps) {
  const isCoveringEyes = focusedField === 'password';
  
  // Use a highly fluid, 60fps Lottie animation to look like a playing video
  // URL 1: Waving robot / friendly character (Idle / Typing)
  // URL 2: Privacy / Covering eyes character (Password)
  
  // We use reliable public Lottie assets
  const lottieUrl = isCoveringEyes 
    ? "https://assets6.lottiefiles.com/packages/lf20_6sxyjyjj.json" // Privacy/Lock/Hidden animation
    : "https://assets3.lottiefiles.com/packages/lf20_KvK0ZJBQzu.json"; // Friendly welcoming robot animation

  return (
    <div className="relative w-96 h-96 z-20 flex items-center justify-center">
      {/* 
        DotLottieReact provides a buttery smooth, video-like animation loop 
        that renders vector graphics at 60fps.
      */}
      <DotLottieReact
        src={lottieUrl}
        loop
        autoplay
        className="w-full h-full drop-shadow-2xl transition-all duration-300"
      />
    </div>
  );
}
