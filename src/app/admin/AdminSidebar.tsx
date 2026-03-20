'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [logoutError, setLogoutError] = useState<string | null>(null);

  const isActive = (href: string) => {
    if (href === '/admin/analytics') return pathname === '/admin' || pathname.startsWith(href);
    return pathname.startsWith(href);
  };

  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    setLogoutError(null);

    try {
      const response = await fetch('/api/admin/logout', {
        method: 'POST',
        credentials: 'same-origin',
        cache: 'no-store',
      });

      const payload = (await response.json().catch(() => null)) as
        | { error?: string }
        | null;

      if (!response.ok) {
        throw new Error(payload?.error || 'Could not log out right now.');
      }

      window.location.assign('/admin/login?loggedOut=1');
    } catch (error) {
      setLogoutError(
        error instanceof Error ? error.message : 'Could not log out right now.'
      );
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

      <div className="border-t border-black/5 bg-white/40 p-6">
        <div className="mb-4 rounded-2xl border border-[#1a2945]/10 bg-white/80 p-4">
          <p className="text-xs font-extrabold uppercase tracking-[0.24em] text-[#1a2945]/55">
            Secure Session
          </p>
          <p className="mt-2 text-sm text-[#1a2945]/80">
            Sign out when you finish. This workspace controls live CMS content,
            registration data, and analytics.
          </p>
        </div>

        {logoutError ? (
          <div className="mb-4 rounded-xl border border-[#c74444]/30 bg-[#c74444]/10 px-4 py-3 text-sm text-[#7a1f1f]">
            {logoutError}
          </div>
        ) : null}

        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="w-full rounded-2xl bg-[#1a2945] px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#111c31] disabled:opacity-50"
        >
          {isLoggingOut ? 'Ending session...' : 'Logout'}
        </button>
      </div>
    </aside>
  );
}
