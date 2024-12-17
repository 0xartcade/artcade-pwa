'use client';

import { useEffect } from 'react';

export function ViewportHandler() {
  useEffect(() => {
    function updateHeight() {
      // Use requestAnimationFrame to batch the DOM updates
      requestAnimationFrame(() => {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
      });
    }

    // Initial update
    updateHeight();

    // Update on resize and orientation change
    window.addEventListener('resize', updateHeight);
    window.addEventListener('orientationchange', updateHeight);
    
    // Update after a short delay to ensure proper height on iOS
    setTimeout(updateHeight, 100);

    return () => {
      window.removeEventListener('resize', updateHeight);
      window.removeEventListener('orientationchange', updateHeight);
    };
  }, []);

  return null;
} 