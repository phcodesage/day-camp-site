'use client';

import { useEffect } from 'react';

const VISIT_SESSION_COOKIE = 'visit_session_id';
const PAGE_VIEW_DEDUP_WINDOW_MS = 2000;

declare global {
  interface Window {
    __kidsAfterSchoolLastPageView?: {
      key: string;
      recordedAt: number;
    };
  }
}

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

function shouldRecordPageView(key: string) {
  const lastPageView = window.__kidsAfterSchoolLastPageView;
  const now = Date.now();

  if (
    lastPageView &&
    lastPageView.key === key &&
    now - lastPageView.recordedAt < PAGE_VIEW_DEDUP_WINDOW_MS
  ) {
    return false;
  }

  window.__kidsAfterSchoolLastPageView = {
    key,
    recordedAt: now,
  };

  return true;
}

async function recordPageView(sessionId: string, path: string, hash: string) {
  try {
    const response = await fetch('/api/track/page-view', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'same-origin',
      cache: 'no-store',
      keepalive: true,
      body: JSON.stringify({
        sessionId,
        path,
        hash: hash || null,
      }),
    });

    if (!response.ok) {
      const result = (await response.json().catch(() => null)) as
        | { error?: string }
        | null;
      console.error(
        '[Analytics] Failed to record page view:',
        result?.error || response.status
      );
    }
  } catch (error) {
    console.error('[Analytics] Error recording page view:', error);
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
      const pageKey = `${path}${hash}`;
      if (!shouldRecordPageView(pageKey)) return;
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
