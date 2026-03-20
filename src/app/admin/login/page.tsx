'use client';

import { AlertTriangle, ArrowLeft, LockKeyhole, ShieldCheck } from 'lucide-react';
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
    <div className="relative min-h-screen overflow-hidden bg-[#f5e6e0]">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-8rem] top-[-4rem] h-56 w-56 rounded-full bg-[#c74444]/12 blur-3xl" />
        <div className="absolute bottom-[-5rem] right-[-3rem] h-72 w-72 rounded-full bg-[#1a7b8e]/14 blur-3xl" />
        <div className="absolute left-[8%] top-[14%] h-16 w-16 rounded-full bg-white/55" />
        <div className="absolute left-[11%] top-[20%] h-8 w-8 rounded-full bg-[#f5a347]/65" />
      </div>

      <div className="relative mx-auto flex min-h-screen w-full max-w-6xl items-center px-6 py-10 md:px-10 lg:px-12">
        <div className="grid w-full gap-8 lg:grid-cols-[1.05fr_minmax(380px,460px)]">
          <section className="rounded-[2rem] border border-white/50 bg-[#1a2945] px-7 py-8 text-white shadow-[0_24px_70px_rgba(26,41,69,0.18)] md:px-9 md:py-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-extrabold uppercase tracking-[0.24em] text-white/80">
              <ShieldCheck className="h-4 w-4" />
              Admin Access
            </div>

            <h1 className="mt-6 max-w-lg text-4xl font-extrabold leading-tight md:text-5xl">
              Manage live content, registrations, and analytics from one secure workspace.
            </h1>

            <p className="mt-5 max-w-xl text-base leading-7 text-white/78 md:text-lg">
              Sign in with your assigned admin account to update the public
              website, review registrations, and monitor dashboard activity.
            </p>

            <div className="mt-8 grid gap-4 md:grid-cols-2">
              <div className="rounded-3xl border border-white/10 bg-white/8 p-5">
                <p className="text-sm font-extrabold uppercase tracking-[0.2em] text-[#f5a347]">
                  Live Impact
                </p>
                <p className="mt-3 text-sm leading-6 text-white/78">
                  CMS changes affect the live site, and registration records are
                  visible here immediately after submission.
                </p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/8 p-5">
                <p className="text-sm font-extrabold uppercase tracking-[0.2em] text-[#76b9d4]">
                  Access Policy
                </p>
                <p className="mt-3 text-sm leading-6 text-white/78">
                  Use trusted devices only and end your session when you finish
                  working in the admin area.
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-[2rem] border border-black/5 bg-white/82 p-7 shadow-[0_24px_80px_rgba(26,41,69,0.12)] backdrop-blur md:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-extrabold uppercase tracking-[0.24em] text-[#c74444]/75">
                  Secure Login
                </p>
                <h2 className="mt-2 text-3xl font-extrabold text-[#1a2945]">
                  Admin Sign In
                </h2>
                <p className="mt-2 text-sm leading-6 text-[#1a2945]/68">
                  Use your admin username and password to enter the protected dashboard.
                </p>
                <Link
                  href="/"
                  className="mt-4 inline-flex items-center gap-2 rounded-xl border border-[#1a2945]/15 bg-white px-4 py-2 text-sm font-semibold text-[#1a2945] transition-colors hover:bg-[#f8f4f2]"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Site
                </Link>
              </div>

              <div className="rounded-2xl bg-[#f5e6e0] p-3 text-[#c74444]">
                <LockKeyhole className="h-6 w-6" />
              </div>
            </div>

            {notice ? (
              <div
                className={`mt-6 rounded-2xl border px-4 py-4 text-sm ${
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

            <div className="mt-6 rounded-2xl border border-[#f5a347]/28 bg-[#fff4db] px-4 py-4 text-sm text-[#6d4b14]">
              <div className="flex items-start gap-3">
                <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
                <div>
                  <p className="font-semibold">Authorized staff only</p>
                  <p className="mt-1 leading-6">
                    This area contains live site controls and student
                    registration data. Do not sign in on shared or public
                    computers.
                  </p>
                </div>
              </div>
            </div>

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
    </div>
  );
}
