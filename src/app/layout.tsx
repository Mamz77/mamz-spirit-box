import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Mamz Spirit Box — Professional Paranormal Investigation Tool',
  description:
    'The most realistic browser-based Spirit Box. Real RF sweep simulation, advanced Web Audio DSP, EVP session recording. Created by Mamad Shirali.',
  keywords: ['spirit box', 'ghost box', 'EVP', 'paranormal', 'investigation', 'radio sweep'],
  authors: [{ name: 'Mamad Shirali', url: 'https://t.me/Mamd_shirali' }],
  creator: 'Mamad Shirali',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Mamz Spirit Box',
  },
  openGraph: {
    title: 'Mamz Spirit Box',
    description: 'Professional browser-based Spirit Box for paranormal investigation',
    type: 'website',
  },
};

export const viewport: Viewport = {
  themeColor: '#00ff88',
  colorScheme: 'dark',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=JetBrains+Mono:wght@400;700&family=Inter:wght@400;500&display=swap"
          rel="stylesheet"
        />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
      </head>
      <body className="bg-black text-[#e8e8e8] antialiased">{children}</body>
    </html>
  );
}
