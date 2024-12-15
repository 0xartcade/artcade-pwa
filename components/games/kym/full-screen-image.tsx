"use client"

import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { useEffect, useState } from 'react'

interface FullScreenImageProps {
  src: string
  alt: string
  isOpen: boolean
  onClose: () => void
  layoutId?: string
}

export function FullScreenImage({ src, alt, isOpen, onClose, layoutId }: FullScreenImageProps) {
  const [isDesktop, setIsDesktop] = useState(false)
  
  useEffect(() => {
    setIsDesktop(window.matchMedia('(min-width: 768px)').matches)
  }, [])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className={`
            fixed md:absolute inset-0
            flex items-center justify-center 
            bg-black/95
            ${isDesktop ? 'md:rounded-[50px]' : ''}
            z-[100]
          `}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
        >
          <motion.div 
            layoutId={layoutId}
            className="relative w-full h-full p-2"
            transition={{ 
              type: "tween",
              duration: 0.3,
              ease: "easeInOut"
            }}
          >
            <div className="relative w-full h-full flex items-center justify-center">
              <motion.div 
                className="relative"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                transition={{ duration: 0.2 }}
                style={{ 
                  width: '95%',
                  height: '95%',
                  maxWidth: '100%',
                  maxHeight: '95vh',
                }}
              >
                <Image
                  src={src}
                  alt={alt}
                  fill
                  className="object-contain"
                  sizes="100vw"
                  quality={100}
                  priority
                  unoptimized={src.includes('googleusercontent.com')}
                />
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
} 