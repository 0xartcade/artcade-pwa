//////////////////////////////////////////////////////
/// DEVICE DETECTION UTILITIES
//////////////////////////////////////////////////////

export const isMobile = (): boolean => {
  // Check if window is defined (client-side)
  if (typeof window === 'undefined') return false;
  
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    window.navigator.userAgent
  );
};

export const isPWA = (): boolean => {
  // Check if window is defined (client-side)
  if (typeof window === 'undefined') return false;
  
  return window.matchMedia('(display-mode: standalone)').matches ||
         (window.navigator as any).standalone === true;
}; 