import { NextResponse } from 'next/server';
import {
  createAdminSessionCookieValue,
  getAdminSessionCookieName,
} from '@/lib/admin/session';

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

  const { username, password } = body as Record<string, unknown>;

  if (typeof username !== 'string' || typeof password !== 'string') {
    return NextResponse.json(
      { error: 'Username and password are required.' },
      { status: 400 }
    );
  }

  const expectedUsername = process.env.ADMIN_USERNAME;
  const expectedPassword = process.env.ADMIN_PASSWORD;
  if (!expectedUsername || !expectedPassword) {
    return NextResponse.json(
      { error: 'Admin credentials are not configured.' },
      { status: 500 }
    );
  }

  if (username !== expectedUsername || password !== expectedPassword) {
    return NextResponse.json({ error: 'Invalid credentials.' }, { status: 401 });
  }

  const cookieName = getAdminSessionCookieName();
  const cookieValue = createAdminSessionCookieValue(username);

  const response = NextResponse.json({ ok: true });
  response.cookies.set(cookieName, cookieValue, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    // Max-Age is encoded in the cookie payload; cookie attribute here just makes browser respect eviction.
    maxAge: Number(process.env.ADMIN_SESSION_MAX_AGE_SECONDS) || 60 * 60 * 24,
  });

  return response;
}

