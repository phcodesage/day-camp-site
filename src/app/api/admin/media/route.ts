import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';
import { requireAdminOrJsonResponse } from '@/lib/admin/requireAdmin';
import {
  deleteMediaByUrl,
  listAdminMedia,
  saveUploadedMedia,
} from '@/lib/admin/mediaServer';
import type { AdminMediaKind } from '@/lib/admin/mediaTypes';

export const runtime = 'nodejs';

function getMediaErrorMessage(
  error: unknown,
  fallbackMessage: string
) {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallbackMessage;
}

export async function GET(request: Request) {
  const authResult = requireAdminOrJsonResponse();
  if (authResult instanceof NextResponse) return authResult;

  const url = new URL(request.url);
  const type = url.searchParams.get('type');
  const mediaType: AdminMediaKind | undefined =
    type === 'image' || type === 'video' ? type : undefined;

  if (type && !mediaType) {
    return NextResponse.json({ error: 'Invalid media type.' }, { status: 400 });
  }

  try {
    const items = await listAdminMedia(mediaType);
    return NextResponse.json({ items });
  } catch (error) {
    console.error('Admin media load failed:', error);
    return NextResponse.json(
      {
        error: getMediaErrorMessage(error, 'Could not load media files.'),
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const authResult = requireAdminOrJsonResponse();
  if (authResult instanceof NextResponse) return authResult;

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json(
      { error: 'Invalid upload payload.' },
      { status: 400 }
    );
  }

  const file = formData.get('file');
  if (!(file instanceof File)) {
    return NextResponse.json(
      { error: 'Select a file to upload.' },
      { status: 400 }
    );
  }

  try {
    const item = await saveUploadedMedia(file);
    return NextResponse.json({ ok: true, item });
  } catch (error) {
    console.error('Admin media upload failed:', error);
    return NextResponse.json(
      {
        error: getMediaErrorMessage(error, 'Could not upload media.'),
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
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

  const { url } = body as { url?: unknown };
  if (typeof url !== 'string' || !url.trim()) {
    return NextResponse.json(
      { error: 'Media URL is required.' },
      { status: 400 }
    );
  }

  try {
    await deleteMediaByUrl(url);
    revalidatePath('/');
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Admin media delete failed:', error);
    return NextResponse.json(
      {
        error: getMediaErrorMessage(error, 'Could not delete media.'),
      },
      { status: 500 }
    );
  }
}
