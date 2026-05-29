import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import AnalyticsTracker from '@/components/AnalyticsTracker';
import { getCmsSectionContent } from '@/lib/cms/cms';
import ScrollEffects from '@/components/ScrollEffects';
import './globals.css';

export async function generateMetadata(): Promise<Metadata> {
  const siteChrome = await getCmsSectionContent('siteChrome');

  return {
    title: siteChrome.metadataTitle || siteChrome.brandTitle,
    description: siteChrome.metadataDescription,
    icons: {
      icon: [
        { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
        { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      ],
      shortcut: '/favicon.ico',
      apple: '/apple-touch-icon.png',
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-[#f5e6e0] text-[#1a2945] antialiased">
        <div
          id="scroll-progress"
          aria-hidden="true"
          className="fixed left-0 top-0 z-[100] h-1 w-full origin-left bg-[#c74444] transition-transform duration-75 ease-out md:h-1.5"
          style={{ transform: 'scaleX(0)' }}
        />
        {children}
        <ScrollEffects />
        <AnalyticsTracker />
      </body>
    </html>
  );
}
