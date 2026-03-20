'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';

const NAV = [
  { href: '/admin/analytics', label: 'Analytics' },
  { href: '/admin/registrations', label: 'Registrations' },
  {
    href: '/admin/cms',
    label: 'CMS',
    children: [
      { href: '/admin/cms', label: 'Editor' },
      { href: '/admin/cms/media', label: 'Media' },
    ],
  },
] as const;

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const isActive = (href: string) => {
    if (href === '/admin/analytics') return pathname === '/admin' || pathname.startsWith(href);
    return pathname.startsWith(href);
  };

  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);

    try {
      await fetch('/api/admin/logout', {
        method: 'POST',
        credentials: 'same-origin',
      });
      router.push('/admin/login');
    } catch {
      setIsLoggingOut(false);
    }
  };

  return (
    <aside className="fixed inset-y-0 left-0 z-20 flex w-72 flex-col overflow-y-auto border-r border-black/5 bg-white/60 backdrop-blur-md">
      <div className="flex-1 p-6">
        <Link
          href="/"
          className="mb-4 inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-[#1a2945] transition-colors hover:bg-[#f5e6e0]/70"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back to Site
        </Link>

        <p className="text-sm font-extrabold tracking-wide text-[#1a2945]">
          ADMIN
        </p>
        <div className="mt-5 space-y-2">
          {NAV.map((item) => {
            const active = isActive(item.href);
            if (!('children' in item)) {
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`block rounded-2xl px-4 py-3 text-sm font-semibold transition-colors ${
                    active
                      ? 'bg-[#c74444] text-white'
                      : 'bg-white/0 text-[#1a2945] hover:bg-[#f5e6e0]/70'
                  }`}
                >
                  {item.label}
                </Link>
              );
            }

            return (
              <div key={item.href} className="rounded-2xl">
                <Link
                  href={item.href}
                  className={`block rounded-2xl px-4 py-3 text-sm font-semibold transition-colors ${
                    active
                      ? 'bg-[#c74444] text-white'
                      : 'bg-white/0 text-[#1a2945] hover:bg-[#f5e6e0]/70'
                  }`}
                >
                  {item.label}
                </Link>

                <div className="mt-2 ml-4 space-y-1 border-l border-[#1a2945]/10 pl-4">
                  {item.children.map((child) => {
                    const childActive = pathname === child.href;
                    return (
                      <Link
                        key={child.href}
                        href={child.href}
                        className={`block rounded-xl px-3 py-2 text-sm font-medium transition-colors ${
                          childActive
                            ? 'bg-[#1a2945] text-white'
                            : 'text-[#1a2945]/80 hover:bg-[#f5e6e0]/70'
                        }`}
                      >
                        {child.label}
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="border-t border-black/5 p-6">
        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="w-full rounded-2xl bg-white/0 px-4 py-3 text-sm font-semibold text-[#1a2945] transition-colors hover:bg-[#f5e6e0]/70 disabled:opacity-50"
        >
          {isLoggingOut ? 'Logging out...' : 'Logout'}
        </button>
      </div>
    </aside>
  );
}
