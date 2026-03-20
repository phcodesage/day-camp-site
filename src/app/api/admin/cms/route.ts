import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';
import { requireAdminOrJsonResponse } from '@/lib/admin/requireAdmin';
import {
  mergeCmsSectionContent,
  upsertCmsSectionContent,
} from '@/lib/cms/cms';
import type { CmsSectionKey } from '@/lib/cms/types';
import { getMongoErrorMessage } from '@/lib/mongodb';

export const runtime = 'nodejs';

const ALLOWED_SECTION_KEYS: CmsSectionKey[] = [
  'siteChrome',
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
  const merged = mergeCmsSectionContent(
    key,
    data as Record<string, unknown>
  );

  try {
    await upsertCmsSectionContent(
      key,
      merged as unknown as Record<string, unknown>
    );
    revalidatePath('/');
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Admin CMS upsert failed:', error);
    return NextResponse.json(
      {
        error: getMongoErrorMessage(error, 'Could not save CMS content.'),
      },
      { status: 500 }
    );
  }
}
