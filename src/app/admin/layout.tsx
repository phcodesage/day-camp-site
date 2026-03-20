import type { ReactNode } from 'react';
import AdminAuthGuard from './AdminAuthGuard';
import AdminShell from './AdminShell';

export default function AdminLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <AdminAuthGuard>
      <AdminShell>{children}</AdminShell>
    </AdminAuthGuard>
  );
}

