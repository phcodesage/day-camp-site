import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import AnalyticsTracker from '@/components/AnalyticsTracker';
import { getCmsSectionContent } from '@/lib/cms/cms';
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
        {children}
        <AnalyticsTracker />
      </body>
    </html>
  );
}
