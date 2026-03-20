import mongoose from 'mongoose';
import { NextResponse } from 'next/server';
import { requireAdminOrJsonResponse } from '@/lib/admin/requireAdmin';
import { getAllCmsContent } from '@/lib/cms/cms';

export const runtime = 'nodejs';

export async function GET() {
  const authResult = requireAdminOrJsonResponse();
  if (authResult instanceof NextResponse) return authResult;

  try {
    const content = await getAllCmsContent();
    return NextResponse.json(content);
  } catch (error) {
    if (error instanceof mongoose.Error) {
      return NextResponse.json({ error: 'Database error.' }, { status: 500 });
    }

    console.error('Admin CMS load failed:', error);
    return NextResponse.json(
      { error: 'Could not load CMS content.' },
      { status: 500 }
    );
  }
}

