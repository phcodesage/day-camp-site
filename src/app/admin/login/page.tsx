'use client';

import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';

function getInputClassName() {
  return 'rounded-2xl border border-[#1a2945]/15 bg-white/95 px-4 py-3.5 text-[#1a2945] outline-none transition-colors placeholder:text-[#1a2945]/35 focus:border-[#1a7b8e] focus:ring-4 focus:ring-[#1a7b8e]/10';
}

function getNotice(searchParams: ReturnType<typeof useSearchParams>) {
  if (searchParams.get('loggedOut') === '1') {
    return {
      tone: 'info' as const,
      title: 'Signed out',
      message: 'Your admin session has been closed successfully.',
    };
  }

  if (searchParams.get('reason') === 'auth') {
    return {
      tone: 'warning' as const,
      title: 'Sign in required',
      message: 'Enter your admin credentials to continue to the dashboard.',
    };
  }

  return null;
}

export default function AdminLoginPage() {
  const searchParams = useSearchParams();
  const notice = getNotice(searchParams);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        cache: 'no-store',
        body: JSON.stringify({
          username: username.trim(),
          password,
        }),
      });

      const data = (await res.json().catch(() => null)) as
        | { error?: string }
        | null;

      if (!res.ok) {
        setError(data?.error || 'Sign-in failed. Please try again.');
        return;
      }

      window.location.assign('/admin');
    } catch {
      setError('Could not reach the server. Check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5e6e0] px-6 py-10">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-md items-center">
        <section className="w-full rounded-3xl border border-black/5 bg-white p-7 shadow-[0_24px_80px_rgba(26,41,69,0.12)] md:p-8">
          <p className="text-xs font-extrabold uppercase tracking-[0.24em] text-[#c74444]/75">
            Secure Login
          </p>
          <h1 className="mt-2 text-3xl font-extrabold text-[#1a2945]">
            Admin Sign In
          </h1>
          <p className="mt-2 text-sm leading-6 text-[#1a2945]/68">
            Use your admin username and password to continue.
          </p>

          <Link
            href="/"
            className="mt-4 inline-flex items-center gap-2 rounded-xl border border-[#1a2945]/15 bg-white px-4 py-2 text-sm font-semibold text-[#1a2945] transition-colors hover:bg-[#f8f4f2]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Site
          </Link>

          {notice ? (
            <div
              className={`mt-5 rounded-2xl border px-4 py-4 text-sm ${
                notice.tone === 'info'
                  ? 'border-[#1a7b8e]/25 bg-[#1a7b8e]/10 text-[#0e243a]'
                  : 'border-[#f5a347]/35 bg-[#f5a347]/12 text-[#6d4b14]'
              }`}
              role="status"
            >
              <p className="font-semibold">{notice.title}</p>
              <p className="mt-1">{notice.message}</p>
            </div>
          ) : null}

          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
              <label className="flex flex-col gap-2">
                <span className="text-sm font-semibold text-[#1a2945]">
                  Username
                </span>
                <input
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  className={getInputClassName()}
                  autoComplete="username"
                  placeholder="Enter admin username"
                  required
                />
              </label>

              <label className="flex flex-col gap-2">
                <span className="text-sm font-semibold text-[#1a2945]">
                  Password
                </span>
                <input
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  type="password"
                  className={getInputClassName()}
                  autoComplete="current-password"
                  placeholder="Enter password"
                  required
                />
              </label>

              {error ? (
                <div
                  className="rounded-2xl border border-[#c74444]/30 bg-[#c74444]/10 px-4 py-4 text-sm text-[#7a1f1f]"
                  role="alert"
                >
                  <p className="font-semibold">Sign-in failed</p>
                  <p className="mt-1">{error}</p>
                </div>
              ) : null}

              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex w-full items-center justify-center rounded-2xl bg-[#c74444] px-8 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-[#a63535] disabled:cursor-not-allowed disabled:bg-[#c74444]/60"
              >
                {isSubmitting ? 'Signing in securely...' : 'Open Admin Dashboard'}
              </button>
          </form>
        </section>
      </div>
    </div>
  );
}
