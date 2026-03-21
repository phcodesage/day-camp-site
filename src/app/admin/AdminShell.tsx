'use client';

import type { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import AdminSidebar from './AdminSidebar';

export default function AdminShell({
  children,
}: Readonly<{ children: ReactNode }>) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const showSidebar = pathname !== '/admin/login';

  if (!showSidebar) return <>{children}</>;

  return (
    <div className="min-h-screen bg-[#f5e6e0]">
      {/* Mobile Header */}
      <header className="fixed left-0 right-0 top-0 z-50 flex items-center justify-between border-b border-black/5 bg-white/95 px-4 py-3 backdrop-blur-md md:hidden">
        <span className="font-bold text-[#1a2945]">Admin</span>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="rounded-xl p-2 text-[#1a2945] hover:bg-[#f5e6e0]/70"
          aria-label="Toggle menu"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isMobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </header>

      <AdminSidebar isMobileOpen={isMobileMenuOpen} onMobileClose={() => setIsMobileMenuOpen(false)} />
      <div className="min-h-screen pt-[57px] md:pt-0 md:pl-72">{children}</div>
    </div>
  );
}
