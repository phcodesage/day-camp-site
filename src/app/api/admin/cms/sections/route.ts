import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';
import { requireAdminOrJsonResponse } from '@/lib/admin/requireAdmin';
import {
  getAllCmsContent,
  upsertCmsSectionContent,
} from '@/lib/cms/cms';
import { DEFAULT_CMS_CONTENT } from '@/lib/cms/defaultContent';
import type { CmsSectionKey } from '@/lib/cms/types';
import { getMongoErrorMessage } from '@/lib/mongodb';

export const runtime = 'nodejs';

const ALLOWED_SECTION_KEYS: CmsSectionKey[] = [
  'about',
  'moreInformation',
  'campHighlights',
  'programSchedule',
  'afterschoolPrograms',
];

export async function GET() {
  const authResult = requireAdminOrJsonResponse();
  if (authResult instanceof NextResponse) return authResult;

  try {
    const content = await getAllCmsContent();
    return NextResponse.json(content);
  } catch (error) {
    console.error('Admin CMS load failed:', error);
    return NextResponse.json(
      {
        error: getMongoErrorMessage(error, 'Could not load CMS content.'),
      },
      { status: 500 }
    );
  }
}

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

  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return NextResponse.json({ error: 'Invalid payload.' }, { status: 400 });
  }

  const payload = body as Record<string, unknown>;
  const updates = {} as Record<CmsSectionKey, Record<string, unknown>>;

  for (const key of ALLOWED_SECTION_KEYS) {
    const sectionData = payload[key];

    if (!sectionData || typeof sectionData !== 'object' || Array.isArray(sectionData)) {
      return NextResponse.json(
        { error: `Invalid section payload for "${key}".` },
        { status: 400 }
      );
    }

    updates[key] = {
      ...DEFAULT_CMS_CONTENT[key],
      ...(sectionData as Record<string, unknown>),
    };
  }

  try {
    await Promise.all(
      ALLOWED_SECTION_KEYS.map((key) =>
        upsertCmsSectionContent(key, updates[key])
      )
    );

    revalidatePath('/');
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Admin CMS bulk save failed:', error);
    return NextResponse.json(
      {
        error: getMongoErrorMessage(error, 'Could not save CMS content.'),
      },
      { status: 500 }
    );
  }
}
