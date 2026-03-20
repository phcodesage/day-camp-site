import mongoose from 'mongoose';
import { NextResponse } from 'next/server';
import { requireAdminOrJsonResponse } from '@/lib/admin/requireAdmin';
import {
  upsertCmsSectionContent,
} from '@/lib/cms/cms';
import { DEFAULT_CMS_CONTENT } from '@/lib/cms/defaultContent';
import type { CmsSectionKey } from '@/lib/cms/types';

export const runtime = 'nodejs';

const ALLOWED_SECTION_KEYS: CmsSectionKey[] = [
  'about',
  'moreInformation',
  'campHighlights',
  'programSchedule',
  'afterschoolPrograms',
];

export async function PUT(request: Request) {
  const authResult = requireAdminOrJsonResponse();
  if (authResult instanceof NextResponse) return authResult;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: 'Invalid request body. Expected JSON.' },
      { status: 400 }
    );
  }

  if (!body || typeof body !== 'object') {
    return NextResponse.json({ error: 'Invalid payload.' }, { status: 400 });
  }

  const { sectionKey, data } = body as {
    sectionKey?: unknown;
    data?: unknown;
  };

  if (typeof sectionKey !== 'string' || !ALLOWED_SECTION_KEYS.includes(sectionKey as CmsSectionKey)) {
    return NextResponse.json(
      { error: 'Invalid sectionKey.' },
      { status: 400 }
    );
  }

  if (!data || typeof data !== 'object') {
    return NextResponse.json({ error: 'Invalid data.' }, { status: 400 });
  }

  const key = sectionKey as CmsSectionKey;
  const merged = {
    ...DEFAULT_CMS_CONTENT[key],
    ...(data as Record<string, unknown>),
  } as unknown as (typeof DEFAULT_CMS_CONTENT)[typeof key];

  try {
    await upsertCmsSectionContent(
      key,
      merged as unknown as Record<string, unknown>
    );
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof mongoose.Error) {
      return NextResponse.json(
        { error: 'Database error.' },
        { status: 500 }
      );
    }

    console.error('Admin CMS upsert failed:', error);
    return NextResponse.json(
      { error: 'Could not save CMS content.' },
      { status: 500 }
    );
  }
}

