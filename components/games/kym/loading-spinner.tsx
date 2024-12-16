import { motion } from 'framer-motion'
import React from 'react'

interface LoadingSpinnerProps {
  size?: number;  // Size in pixels
  className?: string;  // Additional classes
  showText?: boolean;  // Whether to show "Loading" text
  text?: string;  // Custom loading text
}

export function LoadingSpinner({ 
  size = 96,  // Increased default size
  className = '',
  showText = false,
  text = 'Loading'
}: LoadingSpinnerProps) {
  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <motion.div
        className="mb-8" // Increased margin
        style={{ width: size, height: size }}
        animate={{ 
          rotate: 360,
          scale: [1, 1.2, 1]
        }}
        transition={{ 
          rotate: {
            duration: 2,
            repeat: Infinity,
            ease: "linear"
          },
          scale: {
            duration: 1,
            repeat: Infinity,
            ease: "easeInOut"
          }
        }}
      >
        <div className="w-full h-full rounded-full border-[6px] border-t-artcade-purple border-r-artcade-pink border-b-artcade-purple border-l-artcade-pink" />
      </motion.div>
      
      {showText && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="loading-text text-3xl bg-gradient-to-r from-artcade-purple to-artcade-pink text-transparent bg-clip-text"
        >
          {text}
        </motion.div>
      )}
    </div>
  )
} 