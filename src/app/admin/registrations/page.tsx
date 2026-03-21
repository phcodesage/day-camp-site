'use client';

import { useEffect, useMemo, useState } from 'react';

type RegistrationItem = {
  _id: string;
  parentName: string;
  studentName: string;
  email: string;
  phone: string;
  activities: string[];
  preferredDays: string;
  startDate: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
};

export default function AdminRegistrationsPage() {
  const [items, setItems] = useState<RegistrationItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const load = useMemo(
    () => async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/admin/registrations?limit=100', {
          method: 'GET',
          credentials: 'same-origin',
        });

        const payload = (await res.json().catch(() => null)) as
          | { error?: string }
          | { items: RegistrationItem[] }
          | null;

        if (!res.ok) {
          setError((payload as { error?: string })?.error || 'Error');
          return;
        }

        if ('items' in (payload as { items?: unknown })) {
          setItems((payload as { items: RegistrationItem[] }).items || []);
        } else {
          setItems([]);
        }
      } catch {
        setError('Could not load registrations.');
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    void load();
  }, [load]);

  async function handleDelete(id: string) {
    const ok = window.confirm('Delete this registration entry?');
    if (!ok) return;

    try {
      const res = await fetch(`/api/admin/registrations/${id}`, {
        method: 'DELETE',
        credentials: 'same-origin',
      });

      if (!res.ok) {
        const payload = (await res.json().catch(() => null)) as
          | { error?: string }
          | null;
        setError(payload?.error || 'Delete failed.');
        return;
      }

      await load();
    } catch {
      setError('Delete failed.');
    }
  }

  return (
    <div className="mx-auto w-full max-w-6xl p-4 pt-[73px] md:p-6 md:pt-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between md:gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-[#1a2945] md:text-2xl">
            Registrations
          </h1>
          <p className="mt-1 text-xs text-[#1a2945]/70 md:text-sm">
            {items.length} registration{items.length === 1 ? '' : 's'} loaded
          </p>
        </div>

        <a
          href="/api/admin/registrations/export"
          className="inline-flex items-center justify-center rounded-xl bg-[#1a2945] px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#0e243a] md:text-sm"
        >
          Download TXT
        </a>
      </div>

      {error ? (
        <div className="mt-4 rounded-xl border border-[#c74444]/30 bg-[#c74444]/10 p-3 text-xs text-[#7a1f1f] md:p-4 md:text-sm">
          {error}
        </div>
      ) : null}

      {isLoading ? (
        <p className="mt-4 text-xs text-[#1a2945]/70 md:text-sm">Loading...</p>
      ) : null}

      <div className="mt-4 overflow-x-auto rounded-2xl bg-white/60 p-4 shadow hidden md:mt-6 md:block">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead>
            <tr className="border-b border-black/5">
              <th className="py-2 font-semibold text-[#1a2945]">Parent</th>
              <th className="py-2 font-semibold text-[#1a2945]">Student</th>
              <th className="py-2 font-semibold text-[#1a2945]">Email</th>
              <th className="py-2 font-semibold text-[#1a2945]">Phone</th>
              <th className="py-2 font-semibold text-[#1a2945]">
                Activities
              </th>
              <th className="py-2 font-semibold text-[#1a2945]">
                Preferred Days
              </th>
              <th className="py-2 font-semibold text-[#1a2945]">
                Start Date
              </th>
              <th className="py-2 font-semibold text-[#1a2945]">
                Notes
              </th>
              <th className="py-2 font-semibold text-[#1a2945]">
                Submitted
              </th>
              <th className="py-2 font-semibold text-[#1a2945]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.length ? (
              items.map((item) => (
                <tr key={item._id} className="border-b border-black/5">
                  <td className="py-2 text-[#1a2945]/90">{item.parentName}</td>
                  <td className="py-2 text-[#1a2945]/90">{item.studentName}</td>
                  <td className="py-2 text-[#1a2945]/90">{item.email}</td>
                  <td className="py-2 text-[#1a2945]/90">{item.phone}</td>
                  <td className="py-2 text-[#1a2945]/90">
                    {item.activities.join(', ')}
                  </td>
                  <td className="py-2 text-[#1a2945]/90">
                    {item.preferredDays}
                  </td>
                  <td className="py-2 text-[#1a2945]/90">
                    {item.startDate
                      ? new Date(item.startDate).toLocaleDateString('en-US', {
                          weekday: 'short',
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })
                      : 'N/A'}
                  </td>
                  <td className="py-2 text-[#1a2945]/90">
                    {item.notes ? (
                      <span
                        title={item.notes}
                        className="max-w-xs truncate block cursor-help"
                      >
                        {item.notes}
                      </span>
                    ) : (
                      '-'
                    )}
                  </td>
                  <td className="py-2 text-[#1a2945]/90">
                    {new Date(item.createdAt).toLocaleString()}
                  </td>
                  <td className="py-2">
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="rounded-xl border border-[#c74444]/30 bg-[#c74444]/10 px-3 py-1 text-xs font-semibold text-[#7a1f1f] hover:bg-[#c74444]/20"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={10} className="py-8 text-center text-[#1a2945]/60">
                  No registrations yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="mt-4 block md:hidden space-y-4">
        {items.length ? (
          items.map((item) => (
            <div
              key={item._id}
              className="rounded-2xl bg-white/60 p-4 shadow"
            >
              <div className="flex items-start justify-between gap-2 mb-3">
                <div>
                  <h3 className="font-semibold text-[#1a2945]">
                    {item.studentName}
                  </h3>
                  <p className="text-sm text-[#1a2945]/70">
                    Parent: {item.parentName}
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(item._id)}
                  className="rounded-xl border border-[#c74444]/30 bg-[#c74444]/10 px-3 py-1 text-xs font-semibold text-[#7a1f1f] hover:bg-[#c74444]/20 shrink-0"
                >
                  Delete
                </button>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex flex-col sm:flex-row sm:gap-2">
                  <span className="text-[#1a2945]/60 font-medium min-w-[80px]">Email:</span>
                  <a href={`mailto:${item.email}`} className="text-[#1a2945]/90 break-all">
                    {item.email}
                  </a>
                </div>
                <div className="flex flex-col sm:flex-row sm:gap-2">
                  <span className="text-[#1a2945]/60 font-medium min-w-[80px]">Phone:</span>
                  <a href={`tel:${item.phone}`} className="text-[#1a2945]/90">
                    {item.phone}
                  </a>
                </div>
                <div className="flex flex-col sm:flex-row sm:gap-2">
                  <span className="text-[#1a2945]/60 font-medium min-w-[80px]">Activities:</span>
                  <span className="text-[#1a2945]/90">{item.activities.join(', ')}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:gap-2">
                  <span className="text-[#1a2945]/60 font-medium min-w-[80px]">Days:</span>
                  <span className="text-[#1a2945]/90">{item.preferredDays}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:gap-2">
                  <span className="text-[#1a2945]/60 font-medium min-w-[80px]">Start Date:</span>
                  <span className="text-[#1a2945]/90">
                    {item.startDate
                      ? new Date(item.startDate).toLocaleDateString('en-US', {
                          weekday: 'short',
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })
                      : 'N/A'}
                  </span>
                </div>
                {item.notes && (
                  <div className="flex flex-col">
                    <span className="text-[#1a2945]/60 font-medium">Notes:</span>
                    <span className="text-[#1a2945]/90 mt-1 bg-[#f6dedd]/50 rounded-lg p-2">
                      {item.notes}
                    </span>
                  </div>
                )}
                <div className="flex flex-col sm:flex-row sm:gap-2 pt-2 border-t border-black/5">
                  <span className="text-[#1a2945]/60 font-medium min-w-[80px]">Submitted:</span>
                  <span className="text-[#1a2945]/70 text-xs">
                    {new Date(item.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-2xl bg-white/60 p-8 text-center text-[#1a2945]/60">
            No registrations yet.
          </div>
        )}
      </div>
    </div>
  );
}
