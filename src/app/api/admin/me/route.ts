import { NextResponse } from 'next/server';
import { requireAdminOrJsonResponse } from '@/lib/admin/requireAdmin';

export async function GET() {
  const result = requireAdminOrJsonResponse();
  if (result instanceof NextResponse) return result;
  return NextResponse.json({ authenticated: true, session: result });
}

