'use client';

import { ShieldCheck } from 'lucide-react';
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
          cache: 'no-store',
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
      router.replace('/admin/login?reason=auth');
    }
  }, [isAuthenticated, isChecking, pathname, router]);

  if (isChecking) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-[#f5e6e0] p-8">
        <div className="rounded-3xl border border-black/5 bg-white/80 px-8 py-7 text-center shadow-xl backdrop-blur">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#1a2945] text-white">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <p className="mt-4 text-lg font-bold text-[#1a2945]">
            Checking admin access
          </p>
          <p className="mt-2 text-sm text-[#1a2945]/68">
            Verifying your session before opening the dashboard.
          </p>
        </div>
      </div>
    );
  }

  const isLoginPage = pathname === '/admin/login';
  if (!isAuthenticated && !isLoginPage) {
    return null;
  }

  return <>{children}</>;
}
