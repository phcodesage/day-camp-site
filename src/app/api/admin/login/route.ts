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
      { error: 'Could not read the sign-in request.' },
      {
        status: 400,
        headers: { 'Cache-Control': 'no-store' },
      }
    );
  }

  if (!body || typeof body !== 'object') {
    return NextResponse.json(
      { error: 'Enter both username and password.' },
      {
        status: 400,
        headers: { 'Cache-Control': 'no-store' },
      }
    );
  }

  const { username, password } = body as Record<string, unknown>;

  if (typeof username !== 'string' || typeof password !== 'string') {
    return NextResponse.json(
      { error: 'Enter both username and password.' },
      {
        status: 400,
        headers: { 'Cache-Control': 'no-store' },
      }
    );
  }

  const expectedUsername = process.env.ADMIN_USERNAME;
  const expectedPassword = process.env.ADMIN_PASSWORD;
  if (!expectedUsername || !expectedPassword) {
    return NextResponse.json(
      { error: 'Admin credentials are not configured on the server.' },
      {
        status: 500,
        headers: { 'Cache-Control': 'no-store' },
      }
    );
  }

  if (username.trim() !== expectedUsername || password !== expectedPassword) {
    return NextResponse.json(
      { error: 'Incorrect username or password.' },
      {
        status: 401,
        headers: { 'Cache-Control': 'no-store' },
      }
    );
  }

  const cookieName = getAdminSessionCookieName();
  const cookieValue = createAdminSessionCookieValue(username.trim());

  const response = NextResponse.json(
    { ok: true },
    { headers: { 'Cache-Control': 'no-store' } }
  );
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
