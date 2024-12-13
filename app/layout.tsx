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
      { url: "/0xArtcade-icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/0xArtcade-icon-512.png", sizes: "512x512", type: "image/png" }
    ],
    apple: [
      { url: "/0xArtcade-icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/0xArtcade-icon-512.png", sizes: "512x512", type: "image/png" }
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
          /* Prevent content flash and ensure full height */
          html, body { 
            background: #000;
            height: 100%;
            overflow: hidden;
          }
          
          /* iOS-specific full height handling */
          @supports (-webkit-touch-callout: none) {
            html, body {
              height: -webkit-fill-available;
            }
            .pwa-safe-area {
              min-height: -webkit-fill-available;
              height: 100%;
              /* Only apply top safe area padding */
              padding-top: env(safe-area-inset-top);
              /* Remove bottom padding to allow content to flow behind */
              padding-bottom: 0;
              /* Optional side padding if needed */
              padding-left: env(safe-area-inset-left);
              padding-right: env(safe-area-inset-right);
            }
          }

          /* Hide browser UI in PWA mode */
          @media all and (display-mode: standalone) {
            body {
              -webkit-touch-callout: none;
              -webkit-user-select: none;
              user-select: none;
            }
          }
        `}</style>
      </head>
      <body className="font-sans bg-black text-white overscroll-none">
        <div className="game-layout pwa-safe-area fixed inset-0">
          {children}
        </div>
      </body>
    </html>
  )
}
