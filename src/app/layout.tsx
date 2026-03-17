import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import './globals.css';

export const metadata: Metadata = {
  title: 'Kids After School Programs',
  description:
    'Kids afterschool programs with online registration and a serverless submission API.',
  icons: {
    icon: '/exceed-logo.png',
    shortcut: '/exceed-logo.png',
    apple: '/exceed-logo.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-[#f5e6e0] text-[#1a2945] antialiased">{children}</body>
    </html>
  );
}
