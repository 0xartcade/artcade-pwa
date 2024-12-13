"use client"

import { motion } from 'framer-motion'
import Image from 'next/image'

interface NFTImageProps {
  src: string
  alt: string
  onImageClick: () => void
  layoutId?: string
}

export function NFTImage({ src, alt, onImageClick, layoutId }: NFTImageProps): JSX.Element {
  const isGoogleImage = src.includes('googleusercontent.com')
  
  return (
    <motion.div 
      layoutId={layoutId}
      className="absolute inset-0 w-full h-full rounded-2xl overflow-hidden artcade-nft-container cursor-pointer"
      onClick={onImageClick}
      whileHover={{ 
        scale: 1.01,
        zIndex: 10,
        boxShadow: "0px 5px 15px rgba(0,0,0,0.3)"
      }}
      transition={{ 
        type: "tween",
        duration: 0.3,
        ease: "easeInOut"
      }}
    >
      <Image
        src={src}
        alt={alt}
        fill
        className="w-full h-full object-cover scale-110 artcade-nft-image"
        sizes="100vw"
        priority
        quality={90}
        unoptimized={isGoogleImage}
      />
    </motion.div>
  )
}

