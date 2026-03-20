'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

type AdminMeResponse = { authenticated: boolean };

export default function AdminAuthGuard({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const pathname = usePathname();
  const router = useRouter();

  const [isChecking, setIsChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function checkAdmin() {
      try {
        const res = await fetch('/api/admin/me', {
          method: 'GET',
          credentials: 'same-origin',
        });

        if (!res.ok) {
          if (!cancelled) setIsAuthenticated(false);
          return;
        }

        const data = (await res.json()) as AdminMeResponse;
        if (!cancelled) setIsAuthenticated(Boolean(data.authenticated));
      } catch {
        if (!cancelled) setIsAuthenticated(false);
      } finally {
        if (!cancelled) setIsChecking(false);
      }
    }

    checkAdmin();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (isChecking) return;

    const isLoginPage = pathname === '/admin/login';
    if (isAuthenticated && isLoginPage) {
      router.replace('/admin');
      return;
    }

    if (!isAuthenticated && !isLoginPage) {
      router.replace('/admin/login');
    }
  }, [isAuthenticated, isChecking, pathname, router]);

  if (isChecking) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center p-8">
        <p className="text-[#1a2945]">Loading admin...</p>
      </div>
    );
  }

  const isLoginPage = pathname === '/admin/login';
  if (!isAuthenticated && !isLoginPage) {
    return null;
  }

  return <>{children}</>;
}

