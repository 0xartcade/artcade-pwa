import type { MetadataRoute } from 'next'
 
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: '0xArtcade',
    short_name: '0xArtCade',
    description: 'Web3 Artcade Game Sandbox',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#000000',
    icons: [
      {
        src: '/0xArtcade-icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/0xArtcade-icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}