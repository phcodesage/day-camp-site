'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV = [
  { href: '/admin/analytics', label: 'Analytics' },
  { href: '/admin/registrations', label: 'Registrations' },
  { href: '/admin/cms', label: 'CMS' },
] as const;

export default function AdminSidebar() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/admin/analytics') return pathname === '/admin' || pathname.startsWith(href);
    return pathname.startsWith(href);
  };

  return (
    <aside className="fixed inset-y-0 left-0 z-20 w-72 overflow-y-auto border-r border-black/5 bg-white/60 backdrop-blur-md">
      <div className="p-6">
        <p className="text-sm font-extrabold tracking-wide text-[#1a2945]">
          ADMIN
        </p>
        <div className="mt-5 space-y-2">
          {NAV.map((item) => {
            const active = isActive(item.href);
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
          })}
        </div>
      </div>
    </aside>
  );
}
