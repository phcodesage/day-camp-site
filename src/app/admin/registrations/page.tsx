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
    <div className="mx-auto w-full max-w-6xl p-6">
      <h1 className="text-2xl font-extrabold text-[#1a2945]">
        Registrations
      </h1>

      {error ? (
        <div className="mt-4 rounded-xl border border-[#c74444]/30 bg-[#c74444]/10 p-4 text-sm text-[#7a1f1f]">
          {error}
        </div>
      ) : null}

      {isLoading ? (
        <p className="mt-4 text-sm text-[#1a2945]/70">Loading...</p>
      ) : null}

      <div className="mt-6 overflow-x-auto rounded-2xl bg-white/60 p-4 shadow">
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
                <td colSpan={8} className="py-8 text-center text-[#1a2945]/60">
                  No registrations yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

