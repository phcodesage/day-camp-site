import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import {
  getAdminSessionCookieName,
  verifyAdminSessionCookieValue,
} from './session';

export function getAdminSessionFromRequest() {
  const cookieStore = cookies();
  const cookieName = getAdminSessionCookieName();
  const cookieValue = cookieStore.get(cookieName)?.value;
  if (!cookieValue) return null;

  return verifyAdminSessionCookieValue(cookieValue);
}

export function requireAdminOrJsonResponse() {
  const session = getAdminSessionFromRequest();
  if (!session) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  return session;
}

