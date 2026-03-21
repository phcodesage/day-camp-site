'use client';

import { useEffect, useState } from 'react';

type AnalyticsSummary = {
  totalPageViews: number;
  totalVisits: number;
  visitsByDevice: Array<{ device: string; count: number }>;
};

export default function AdminAnalyticsPage() {
  const [data, setData] = useState<AnalyticsSummary | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const res = await fetch('/api/admin/analytics/summary', {
          method: 'GET',
          credentials: 'same-origin',
        });

        const payload = (await res.json().catch(() => null)) as
          | { error?: string }
          | AnalyticsSummary
          | null;

        if (!res.ok) {
          if (!cancelled) setError((payload as { error?: string })?.error || 'Error');
          return;
        }

        if (!cancelled) setData(payload as AnalyticsSummary);
      } catch {
        if (!cancelled) setError('Could not load analytics.');
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="mx-auto w-full max-w-6xl p-4 pt-[73px] md:p-6 md:pt-6">
      <h1 className="text-xl font-extrabold text-[#1a2945] md:text-2xl">
        Analytics Dashboard
      </h1>

      {error ? (
        <div className="mt-4 rounded-xl border border-[#c74444]/30 bg-[#c74444]/10 p-3 text-xs text-[#7a1f1f] md:p-4 md:text-sm">
          {error}
        </div>
      ) : null}

      {!data && !error ? (
        <p className="mt-4 text-sm text-[#1a2945]/70">Loading...</p>
      ) : null}

      {data ? (
        <div className="mt-4 space-y-4 md:mt-6 md:space-y-6">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl bg-white/80 p-4 shadow md:p-5">
              <p className="text-xs font-semibold text-[#1a2945]/70 md:text-sm">
                Total Visits
              </p>
              <p className="mt-2 text-2xl font-extrabold text-[#1a2945] md:text-3xl">
                {data.totalVisits}
              </p>
            </div>
            <div className="rounded-2xl bg-white/80 p-4 shadow md:col-span-2 md:p-5">
              <p className="text-xs font-semibold text-[#1a2945]/70 md:text-sm">
                Total Page Views
              </p>
              <p className="mt-2 text-2xl font-extrabold text-[#1a2945] md:text-3xl">
                {data.totalPageViews}
              </p>
            </div>
          </div>

          <div className="rounded-2xl bg-white/80 p-4 shadow md:p-5">
            <p className="text-xs font-semibold text-[#1a2945]/70 md:text-sm">
              Visits by Device
            </p>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-left text-xs md:text-sm">
                <thead>
                  <tr className="border-b border-black/5">
                    <th className="py-2 font-semibold text-[#1a2945]">Device</th>
                    <th className="py-2 font-semibold text-[#1a2945]">
                      Visits
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data.visitsByDevice.length ? (
                    data.visitsByDevice.map((item) => (
                      <tr key={item.device} className="border-b border-black/5">
                        <td className="py-2 text-[#1a2945]/90">
                          {item.device}
                        </td>
                        <td className="py-2 font-semibold">{item.count}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td className="py-3 text-[#1a2945]/60" colSpan={2}>
                        No data yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

