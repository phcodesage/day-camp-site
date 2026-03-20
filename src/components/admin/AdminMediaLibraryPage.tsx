'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import type { AdminMediaItem, AdminMediaKind } from '@/lib/admin/mediaTypes';

function formatFileSize(size: number) {
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

function filterLabel(filter: AdminMediaKind | 'all') {
  switch (filter) {
    case 'image':
      return 'Images';
    case 'video':
      return 'Videos';
    default:
      return 'All Media';
  }
}

export default function AdminMediaLibraryPage() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [items, setItems] = useState<AdminMediaItem[]>([]);
  const [filter, setFilter] = useState<AdminMediaKind | 'all'>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [deletingUrl, setDeletingUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function loadMedia() {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/admin/media', {
        method: 'GET',
        credentials: 'same-origin',
        cache: 'no-store',
      });

      const payload = (await res.json().catch(() => null)) as
        | { error?: string; items?: AdminMediaItem[] }
        | null;

      if (!res.ok) {
        setError(payload?.error || 'Could not load media files.');
        return;
      }

      setItems(payload?.items || []);
    } catch {
      setError('Could not load media files.');
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void loadMedia();
  }, []);

  async function handleUpload(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    setIsUploading(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch('/api/admin/media', {
        method: 'POST',
        credentials: 'same-origin',
        body: formData,
      });

      const payload = (await res.json().catch(() => null)) as
        | { error?: string }
        | null;

      if (!res.ok) {
        setError(payload?.error || 'Upload failed.');
        return;
      }

      setSuccess('Media uploaded.');
      await loadMedia();
    } catch {
      setError('Upload failed.');
    } finally {
      setIsUploading(false);
      event.target.value = '';
    }
  }

  async function handleDelete(item: AdminMediaItem) {
    const message = item.usage.length
      ? `Delete ${item.name}? It is currently used in: ${item.usage.join(', ')}.`
      : `Delete ${item.name}?`;
    const confirmed = window.confirm(message);
    if (!confirmed) return;

    setDeletingUrl(item.url);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch('/api/admin/media', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ url: item.url }),
      });

      const payload = (await res.json().catch(() => null)) as
        | { error?: string }
        | null;

      if (!res.ok) {
        setError(payload?.error || 'Delete failed.');
        return;
      }

      setSuccess('Media removed.');
      await loadMedia();
    } catch {
      setError('Delete failed.');
    } finally {
      setDeletingUrl(null);
    }
  }

  const visibleItems =
    filter === 'all'
      ? items
      : items.filter((item) => item.kind === filter);

  return (
    <div className="px-6 pt-36">
      <div className="fixed left-72 right-0 top-0 z-30 border-b border-black/5 bg-[#f5e6e0]/95 backdrop-blur">
        <div className="mx-auto w-full max-w-6xl px-6 py-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-extrabold text-[#1a2945]">
                Media Library
              </h1>
              <p className="mt-1 text-sm text-[#1a2945]/70">
                Upload, delete, and manage the files used by the CMS editor.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/admin/cms"
                className="inline-flex items-center justify-center rounded-xl border border-[#1a2945]/15 bg-white px-4 py-2 text-sm font-semibold text-[#1a2945] transition-colors hover:bg-white/80"
              >
                Back to Editor
              </Link>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="inline-flex items-center justify-center rounded-xl bg-[#c74444] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#a63535] disabled:cursor-not-allowed disabled:bg-[#c74444]/60"
              >
                {isUploading ? 'Uploading...' : 'Upload Media'}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,video/*"
                onChange={handleUpload}
                className="hidden"
              />
            </div>
          </div>
        </div>
      </div>

      {error ? (
        <div className="mx-auto mt-4 w-full max-w-6xl rounded-xl border border-[#c74444]/30 bg-[#c74444]/10 p-4 text-sm text-[#7a1f1f]">
          {error}
        </div>
      ) : null}

      {success ? (
        <div className="mx-auto mt-4 w-full max-w-6xl rounded-xl border border-[#1a7b8e]/20 bg-[#1a7b8e]/10 p-4 text-sm text-[#0e243a]">
          {success}
        </div>
      ) : null}

      <div className="mx-auto mt-6 flex w-full max-w-6xl flex-wrap items-center gap-3">
        {(['all', 'image', 'video'] as const).map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setFilter(item)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
              filter === item
                ? 'bg-[#1a2945] text-white'
                : 'bg-white text-[#1a2945] hover:bg-white/80'
            }`}
          >
            {filterLabel(item)}
          </button>
        ))}
      </div>

      {isLoading ? (
        <p className="mx-auto mt-6 w-full max-w-6xl text-sm text-[#1a2945]/70">
          Loading media...
        </p>
      ) : null}

      <div className="mx-auto mt-6 grid w-full max-w-6xl gap-4 md:grid-cols-2 xl:grid-cols-3">
        {visibleItems.map((item) => (
          <div
            key={item.url}
            className="overflow-hidden rounded-2xl border border-black/5 bg-white/70 shadow"
          >
            <div className="aspect-[16/10] overflow-hidden bg-[#0e243a]/5">
              {item.kind === 'image' ? (
                <img
                  src={item.url}
                  alt={item.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <video
                  src={item.url}
                  controls
                  className="h-full w-full object-cover"
                />
              )}
            </div>

            <div className="space-y-3 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-[#1a2945]">{item.name}</p>
                  <p className="mt-1 break-all text-xs text-[#1a2945]/60">
                    {item.url}
                  </p>
                </div>
                <span className="rounded-full bg-[#f5e6e0] px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#1a2945]">
                  {item.kind}
                </span>
              </div>

              <div className="flex flex-wrap gap-2 text-xs text-[#1a2945]/70">
                <span>{formatFileSize(item.size)}</span>
                <span>{new Date(item.modifiedAt).toLocaleString()}</span>
              </div>

              {item.usage.length ? (
                <div className="flex flex-wrap gap-2">
                  {item.usage.map((usage) => (
                    <span
                      key={usage}
                      className="rounded-full bg-[#1a7b8e]/10 px-3 py-1 text-xs font-semibold text-[#0e243a]"
                    >
                      {usage}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-[#1a2945]/55">
                  Not currently used in CMS.
                </p>
              )}

              <button
                type="button"
                onClick={() => void handleDelete(item)}
                disabled={deletingUrl === item.url}
                className="w-full rounded-xl border border-[#c74444]/30 bg-[#c74444]/10 px-4 py-2 text-sm font-semibold text-[#7a1f1f] transition-colors hover:bg-[#c74444]/20 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {deletingUrl === item.url ? 'Deleting...' : 'Delete Media'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {!isLoading && visibleItems.length === 0 ? (
        <div className="mx-auto mt-6 w-full max-w-6xl rounded-2xl border border-dashed border-[#1a2945]/20 bg-white/50 p-8 text-center text-sm text-[#1a2945]/70">
          No media files in this view yet.
        </div>
      ) : null}
    </div>
  );
}
