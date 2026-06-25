import React from 'react';

export default function Logo({ className = "", size = 24 }: { className?: string, size?: number }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Outer Hexagon/Shield Shape representing Security */}
      <path 
        d="M12 2L2 7L2 17L12 22L22 17L22 7L12 2Z" 
        stroke="currentColor" 
        strokeWidth="1.5" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      {/* Chain link representing LinkedIn */}
      <path 
        d="M9 14.5a3 3 0 0 1 0-6h1.5" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      <path 
        d="M15 9.5a3 3 0 0 1 0 6h-1.5" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      {/* Center line connecting the links */}
      <line 
        x1="10" 
        y1="12" 
        x2="14" 
        y2="12" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
      />
    </svg>
  );
}
