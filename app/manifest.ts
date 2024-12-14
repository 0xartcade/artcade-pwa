import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: '0xArtcade',
    short_name: '0xArtcade',
    description: 'Web3 Artcade Game Sandbox',
    start_url: '/',
    id: '/',
    display: 'fullscreen',
    display_override: ['fullscreen', 'standalone'],
    background_color: '#000000',
    theme_color: '#000000',
    orientation: 'portrait',
    scope: '/',
    prefer_related_applications: false,
    categories: ['games', 'entertainment'],
    icons: [
      {
        src: '/0xArtcade-icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable'
      },
      {
        src: '/0xArtcade-icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any'
      },
      {
        src: '/0xArtcade-icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable'
      },
      {
        src: '/0xArtcade-icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any'
      }
    ],
    screenshots: [
      {
        src: '/screenshot.png',
        sizes: '1170x2532',
        type: 'image/png',
        form_factor: 'narrow',
      }
    ],
    shortcuts: [
      {
        name: 'Play Game',
        url: '/',
        icons: [{ src: '/0xArtcade-icon-192.png', sizes: '192x192' }]
      }
    ],
    related_applications: [],
  };
}