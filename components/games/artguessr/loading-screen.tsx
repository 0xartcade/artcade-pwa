import { motion } from 'framer-motion'
import React from 'react'
import { LoadingSpinner } from './loading-spinner'

interface LoadingScreenProps {
  isVisible: boolean;
  onLoadComplete: () => void;
  text?: string;
}

export function LoadingScreen({ 
  isVisible, 
  onLoadComplete,
  text = 'Loading'
}: LoadingScreenProps) {
  React.useEffect(() => {
    if (isVisible) {
      // Simulate minimum loading time for smooth transition
      const timer = setTimeout(onLoadComplete, 1500)
      return () => clearTimeout(timer)
    }
  }, [isVisible, onLoadComplete])

  if (!isVisible) return null

  return (
    <motion.div 
      className="fixed inset-0 z-[150] bg-black flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <LoadingSpinner 
        size={64}
        showText={true}
        text={text}
      />
    </motion.div>
  )
} 