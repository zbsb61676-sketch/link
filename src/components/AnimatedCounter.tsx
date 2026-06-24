"use client";

import { useEffect, useState } from "react";

export default function AnimatedCounter({ value, prefix = "₹" }: { value: number, prefix?: string }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number;
    const duration = 2000; // 2 seconds
    
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      
      // Ease out cubic
      const easeOut = 1 - Math.pow(1 - Math.min(progress / duration, 1), 3);
      
      setCount(Math.floor(easeOut * value));
      
      if (progress < duration) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }, [value]);

  return <span>{prefix}{count.toLocaleString()}</span>;
}
