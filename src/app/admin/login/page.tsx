'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const router = useRouter();

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
        body: JSON.stringify({ username, password }),
      });

      const data = (await res.json().catch(() => null)) as
        | { error?: string }
        | null;

      if (!res.ok) {
        setError(data?.error || 'Login failed.');
        return;
      }

      router.replace('/admin');
    } catch {
      setError('Could not reach the server.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center p-8">
      <div className="w-full max-w-md rounded-2xl bg-white/80 p-6 shadow-xl backdrop-blur">
        <h1 className="mb-2 text-2xl font-extrabold text-[#1a2945]">
          Admin Login
        </h1>
        <p className="mb-6 text-sm text-[#1a2945]/70">
          Sign in to access analytics, registrations, and CMS content.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="flex flex-col gap-2">
            <span className="font-semibold text-[#1a2945]">Username</span>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="rounded-xl border border-[#1a2945]/20 bg-white px-4 py-3 outline-none focus:border-[#1a7b8e] focus:ring-2 focus:ring-[#1a7b8e]/15"
              autoComplete="username"
              required
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="font-semibold text-[#1a2945]">Password</span>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              className="rounded-xl border border-[#1a2945]/20 bg-white px-4 py-3 outline-none focus:border-[#1a7b8e] focus:ring-2 focus:ring-[#1a7b8e]/15"
              autoComplete="current-password"
              required
            />
          </label>

          {error ? (
            <div className="rounded-xl border border-[#c74444]/30 bg-[#c74444]/10 px-4 py-3 text-sm text-[#7a1f1f]">
              {error}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-xl bg-[#c74444] px-8 py-3 font-semibold text-white transition-colors hover:bg-[#a63535] disabled:cursor-not-allowed disabled:bg-[#c74444]/60"
          >
            {isSubmitting ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
}

