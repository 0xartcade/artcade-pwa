import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
    { media: "(prefers-color-scheme: light)", color: "#000000" }
  ],
};

export const metadata: Metadata = {
  title: "0xArtcade",
  description: "0xArtcade Game Sandbox",
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/icons/0xArtcade-icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/0xArtcade-icon-512.png", sizes: "512x512", type: "image/png" }
    ],
    apple: [
      { url: "/icons/0xArtcade-icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/0xArtcade-icon-512.png", sizes: "512x512", type: "image/png" }
    ],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "0xArtcade",
    startupImage: [
      {
        url: "/splash.png",
        media: "(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2)"
      }
    ]
  },
  applicationName: "0xArtcade",
  formatDetection: {
    telephone: false,
  },
  other: {
    "mobile-web-app-capable": "yes",
    "apple-touch-fullscreen": "yes",
  } as Record<string, string>
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`bg-black ${geistSans.variable} ${geistMono.variable}`}>
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-touch-fullscreen" content="yes" />
        <style>{`
          :root {
            --vh: 1vh;
          }
          
          html { 
            background: #000;
            height: 100vh;
            height: calc(var(--vh, 1vh) * 100);
            overflow: hidden;
            overscroll-behavior: none;
          }
          
          body {
            background: #000;
            height: 100vh;
            height: calc(var(--vh, 1vh) * 100);
            overflow: hidden;
            position: fixed;
            width: 100%;
            -webkit-touch-callout: none;
            -webkit-user-select: none;
            user-select: none;
            opacity: 0;
            animation: fadeIn 0.3s ease-in forwards;
          }

          @keyframes fadeIn {
            to {
              opacity: 1;
            }
          }
          
          @supports (-webkit-touch-callout: none) {
            .pwa-safe-area {
              position: fixed;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              height: 100vh;
              height: calc(var(--vh, 1vh) * 100);
              padding: env(safe-area-inset-top) env(safe-area-inset-right) 0 env(safe-area-inset-left);
              background: #000;
            }
            
            .game-layout {
              height: 100%;
              margin-bottom: env(safe-area-inset-bottom);
            }
          }
        `}</style>
      </head>
      <body className="font-sans text-white overscroll-none">
        <div className="pwa-safe-area">
          <div className="game-layout">
            {children}
          </div>
        </div>
      </body>
    </html>
  )
}
