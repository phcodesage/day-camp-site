'use client';

import { useEffect } from 'react';

const VISIT_SESSION_COOKIE = 'visit_session_id';

function getCookieValue(name: string) {
  const cookies = document.cookie ? document.cookie.split('; ') : [];
  for (const cookie of cookies) {
    const [cookieName, ...rest] = cookie.split('=');
    if (cookieName === name) {
      return decodeURIComponent(rest.join('='));
    }
  }
  return null;
}

function setCookieValue(name: string, value: string, days: number) {
  const expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
}

function generateSessionId() {
  // Prefer cryptographically-strong randomness when available.
  if (typeof crypto !== 'undefined' && 'getRandomValues' in crypto) {
    const bytes = new Uint8Array(16);
    crypto.getRandomValues(bytes);
    return Array.from(bytes)
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
  }

  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

async function recordPageView(sessionId: string, path: string, hash: string) {
  try {
    await fetch('/api/track/page-view', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'same-origin',
      body: JSON.stringify({
        sessionId,
        path,
        hash: hash || null,
      }),
    });
  } catch {
    // Swallow analytics errors; they should not block the user experience.
  }
}

export default function AnalyticsTracker() {
  useEffect(() => {
    const currentPathname = window.location.pathname;
    if (currentPathname.startsWith('/admin')) return;

    const existingSessionId = getCookieValue(VISIT_SESSION_COOKIE);
    const sessionId = existingSessionId || generateSessionId();
    if (!existingSessionId) {
      setCookieValue(VISIT_SESSION_COOKIE, sessionId, 365);
    }

    const recordCurrent = () => {
      const path = window.location.pathname || '/';
      const hash = window.location.hash || '';
      void recordPageView(sessionId, path, hash);
    };

    // Initial load counts as a page view.
    recordCurrent();

    // Public navigation uses hash anchors, so hash changes also count.
    window.addEventListener('hashchange', recordCurrent);
    return () => window.removeEventListener('hashchange', recordCurrent);
  }, []);

  return null;
}

