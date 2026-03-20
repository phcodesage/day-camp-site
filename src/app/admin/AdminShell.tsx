'use client';

import type { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import AdminSidebar from './AdminSidebar';

export default function AdminShell({
  children,
}: Readonly<{ children: ReactNode }>) {
  const pathname = usePathname();
  const showSidebar = pathname !== '/admin/login';

  if (!showSidebar) return <>{children}</>;

  return (
    <div className="min-h-screen bg-[#f5e6e0]">
      <AdminSidebar />
      <div className="min-h-screen pl-72">{children}</div>
    </div>
  );
}
