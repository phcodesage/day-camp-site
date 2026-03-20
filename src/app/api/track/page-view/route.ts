import mongoose from 'mongoose';
import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import PageView from '@/lib/models/PageView';
import Visit from '@/lib/models/Visit';

export const runtime = 'nodejs';

function classifyDevice(userAgent: string) {
  const ua = userAgent.toLowerCase();
  if (
    /iphone|ipod|android.*mobile|blackberry|iemobile|opera mini/.test(ua)
  ) {
    return 'Mobile';
  }

  if (/ipad|tablet|android(?!.*mobile)/.test(ua)) {
    return 'Tablet';
  }

  if (/windows|macintosh|linux|cros|x11/.test(ua)) {
    return 'Desktop';
  }

  return 'Other';
}

export async function POST(request: Request) {
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
    return NextResponse.json({ error: 'Invalid request payload.' }, { status: 400 });
  }

  const data = body as Record<string, unknown>;
  const sessionId = data.sessionId;
  const path = data.path;
  const hash = typeof data.hash === 'string' ? data.hash : null;

  if (typeof sessionId !== 'string' || !sessionId) {
    return NextResponse.json({ error: 'Missing sessionId.' }, { status: 400 });
  }
  if (typeof path !== 'string' || !path) {
    return NextResponse.json({ error: 'Missing path.' }, { status: 400 });
  }

  const userAgent = request.headers.get('user-agent') || '';
  const device = classifyDevice(userAgent);

  try {
    await connectToDatabase();

    await Visit.updateOne(
      { sessionId },
      {
        $setOnInsert: { sessionId, device },
        $set: { device },
      },
      { upsert: true }
    );

    await PageView.create({
      sessionId,
      device,
      path,
      hash,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof mongoose.Error) {
      return NextResponse.json({ error: 'Database error.' }, { status: 500 });
    }
    console.error('Track page-view failed:', error);
    return NextResponse.json(
      { error: 'Could not record page view.' },
      { status: 500 }
    );
  }
}

