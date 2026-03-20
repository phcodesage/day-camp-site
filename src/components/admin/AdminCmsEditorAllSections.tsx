'use client';

import { useEffect, useMemo, useState } from 'react';
import type {
  AfterschoolProgramsContent,
  AboutSectionContent,
  CampHighlightsContent,
  CmsContentBySectionKey,
  CmsSectionKey,
  MoreInformationContent,
  ProgramScheduleContent,
} from '@/lib/cms/types';

function sectionLabel(key: CmsSectionKey) {
  switch (key) {
    case 'about':
      return 'About Section';
    case 'moreInformation':
      return 'More Information';
    case 'campHighlights':
      return 'Camp Highlights';
    case 'programSchedule':
      return 'Program Schedule';
    case 'afterschoolPrograms':
      return 'Afterschool Programs';
  }
}

function toCommaSeparated(values: string[]) {
  return values.join(', ');
}

function parseCommaSeparated(values: string) {
  return values
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

export default function AdminCmsEditorAllSections() {
  const [sections, setSections] = useState<CmsContentBySectionKey | null>(null);
  const [drafts, setDrafts] = useState<CmsContentBySectionKey | null>(null);

  const [error, setError] = useState<string | null>(null);
  const [savingKey, setSavingKey] = useState<CmsSectionKey | null>(null);
  const [savedKey, setSavedKey] = useState<CmsSectionKey | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setError(null);
      try {
        const res = await fetch('/api/admin/cms/sections', {
          method: 'GET',
          credentials: 'same-origin',
        });

        const payload = (await res.json().catch(() => null)) as
          | { error?: string }
          | CmsContentBySectionKey
          | null;

        if (!res.ok) {
          const err =
            payload && 'error' in payload ? payload.error : 'Error';
          if (!cancelled) setError(typeof err === 'string' ? err : 'Error');
          return;
        }

        if (!cancelled) {
          setSections(payload as CmsContentBySectionKey);
          setDrafts(payload as CmsContentBySectionKey);
        }
      } catch {
        if (!cancelled) setError('Could not load CMS content.');
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const sectionDraft = useMemo(() => drafts, [drafts]);

  function updateDraft<K extends CmsSectionKey>(
    key: K,
    patch: Partial<CmsContentBySectionKey[K]>
  ) {
    setDrafts((current) => {
      if (!current) return current;

      const currentSection = current[key];
      const nextSection = {
        ...currentSection,
        ...patch,
      } as CmsContentBySectionKey[K];

      return { ...current, [key]: nextSection };
    });
  }

  async function handleSave<K extends CmsSectionKey>(key: K) {
    if (!drafts) return;
    setError(null);
    setSavedKey(null);
    setSavingKey(key);

    try {
      const payload = drafts[key] as unknown as Record<string, unknown>;
      const res = await fetch('/api/admin/cms', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ sectionKey: key, data: payload }),
      });

      if (!res.ok) {
        const body = (await res.json().catch(() => null)) as
          | { error?: string }
          | null;
        setError(body?.error || 'Save failed.');
        return;
      }

      setSections((current) => {
        if (!current) return current;
        return current;
      });

      setSavedKey(key);
      window.setTimeout(() => setSavedKey((k) => (k === key ? null : k)), 2500);
    } catch {
      setError('Save failed.');
    } finally {
      setSavingKey(null);
    }
  }

  if (!sections || !sectionDraft) {
    return (
      <div className="mx-auto w-full max-w-6xl p-6">
        <h1 className="text-2xl font-extrabold text-[#1a2945]">CMS Editor</h1>
        <p className="mt-4 text-sm text-[#1a2945]/70">Loading...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-6xl p-6">
      <h1 className="text-2xl font-extrabold text-[#1a2945]">
        CMS Editor
      </h1>
      <p className="mt-2 text-sm text-[#1a2945]/70">
        Edit all sections below. Each section has its own Save button.
      </p>

      {error ? (
        <div className="mt-4 rounded-xl border border-[#c74444]/30 bg-[#c74444]/10 p-4 text-sm text-[#7a1f1f]">
          {error}
        </div>
      ) : null}

      <div className="mt-6 space-y-8">
        {/* About */}
        <div className="rounded-2xl border border-black/5 bg-white/60 p-6 shadow">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-extrabold text-[#1a2945]">
                {sectionLabel('about')}
              </h2>
            </div>
            <button
              type="button"
              onClick={() => void handleSave('about')}
              disabled={savingKey === 'about'}
              className="rounded-xl bg-[#c74444] px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#a63535] disabled:cursor-not-allowed disabled:bg-[#c74444]/60"
            >
              {savingKey === 'about' ? 'Saving...' : 'Save'}
            </button>
          </div>
          {savedKey === 'about' ? (
            <p className="mt-2 text-sm font-semibold text-[#0e243a]">
              Saved.
            </p>
          ) : null}

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {(
              [
                ['heading', 'Heading'],
                ['italicLine', 'Italic Line'],
                ['paragraph1', 'Paragraph 1'],
                ['paragraph2', 'Paragraph 2'],
                ['buttonLabel', 'Button Label'],
                ['buttonHref', 'Button Href'],
              ] as const
            ).map(([field, label]) => {
              const about = (sectionDraft.about as AboutSectionContent) || null;
              const value = (about as unknown as Record<string, unknown>)[
                field as string
              ] as string;
              return (
                <label key={field} className="flex flex-col gap-2">
                  <span className="text-sm font-semibold text-[#1a2945]/70">
                    {label}
                  </span>
                  {field === 'paragraph1' || field === 'paragraph2' ? (
                    <textarea
                      value={value}
                      onChange={(e) =>
                        updateDraft('about', {
                          [field]: e.target.value,
                        } as unknown as Partial<AboutSectionContent>)
                      }
                      className="min-h-24 resize-y rounded-xl border border-[#1a2945]/20 bg-white px-3 py-2 text-sm outline-none focus:border-[#1a7b8e] focus:ring-2 focus:ring-[#1a7b8e]/15"
                    />
                  ) : (
                    <input
                      value={value}
                      onChange={(e) =>
                        updateDraft('about', {
                          [field]: e.target.value,
                        } as unknown as Partial<AboutSectionContent>)
                      }
                      className="rounded-xl border border-[#1a2945]/20 bg-white px-3 py-2 text-sm outline-none focus:border-[#1a7b8e] focus:ring-2 focus:ring-[#1a7b8e]/15"
                    />
                  )}
                </label>
              );
            })}
          </div>
        </div>

        {/* More Information */}
        <div className="rounded-2xl border border-black/5 bg-white/60 p-6 shadow">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-extrabold text-[#1a2945]">
                {sectionLabel('moreInformation')}
              </h2>
            </div>
            <button
              type="button"
              onClick={() => void handleSave('moreInformation')}
              disabled={savingKey === 'moreInformation'}
              className="rounded-xl bg-[#c74444] px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#a63535] disabled:cursor-not-allowed disabled:bg-[#c74444]/60"
            >
              {savingKey === 'moreInformation' ? 'Saving...' : 'Save'}
            </button>
          </div>
          {savedKey === 'moreInformation' ? (
            <p className="mt-2 text-sm font-semibold text-[#0e243a]">
              Saved.
            </p>
          ) : null}

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {(
              [
                ['headingLine1', 'Heading Line 1'],
                ['headingLine2', 'Heading Line 2'],
                ['email', 'Email'],
                ['phone', 'Phone'],
                ['address', 'Address'],
                ['websiteLabel', 'Website Label'],
                ['websiteHref', 'Website Href'],
                ['imageSrc', 'Image Src'],
                ['imageAlt', 'Image Alt'],
                ['videoUrl', 'Video URL'],
              ] as const
            ).map(([field, label]) => {
              const mi = sectionDraft.moreInformation as MoreInformationContent;
              const value = (mi as unknown as Record<string, unknown>)[
                field as string
              ] as string;
              return (
                <label key={field} className="flex flex-col gap-2">
                  <span className="text-sm font-semibold text-[#1a2945]/70">
                    {label}
                  </span>
                  <input
                    value={value}
                    onChange={(e) =>
                      updateDraft('moreInformation', {
                        [field]: e.target.value,
                      } as unknown as Partial<MoreInformationContent>)
                    }
                    className="rounded-xl border border-[#1a2945]/20 bg-white px-3 py-2 text-sm outline-none focus:border-[#1a7b8e] focus:ring-2 focus:ring-[#1a7b8e]/15"
                  />
                </label>
              );
            })}
          </div>

          <div className="mt-6 overflow-hidden rounded-2xl border border-black/5 bg-white p-4">
            <p className="text-sm font-semibold text-[#1a2945]/70">
              Media Preview
            </p>
            <div className="mt-3 overflow-hidden rounded-xl border border-black/5 bg-white">
              {((sectionDraft.moreInformation as MoreInformationContent).videoUrl || '')
                .trim() ? (
                <video
                  src={(sectionDraft.moreInformation as MoreInformationContent).videoUrl}
                  controls
                  className="h-auto w-full"
                />
              ) : (
                <img
                  src={(sectionDraft.moreInformation as MoreInformationContent).imageSrc}
                  alt={(sectionDraft.moreInformation as MoreInformationContent).imageAlt}
                  className="aspect-[4/3] h-full w-full object-cover"
                />
              )}
            </div>
          </div>
        </div>

        {/* Camp Highlights */}
        <div className="rounded-2xl border border-black/5 bg-white/60 p-6 shadow">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-extrabold text-[#1a2945]">
                {sectionLabel('campHighlights')}
              </h2>
            </div>
            <button
              type="button"
              onClick={() => void handleSave('campHighlights')}
              disabled={savingKey === 'campHighlights'}
              className="rounded-xl bg-[#c74444] px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#a63535] disabled:cursor-not-allowed disabled:bg-[#c74444]/60"
            >
              {savingKey === 'campHighlights' ? 'Saving...' : 'Save'}
            </button>
          </div>
          {savedKey === 'campHighlights' ? (
            <p className="mt-2 text-sm font-semibold text-[#0e243a]">
              Saved.
            </p>
          ) : null}

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {(() => {
              const ch = sectionDraft.campHighlights as CampHighlightsContent;
              return (
                <>
                  <label className="flex flex-col gap-2">
                    <span className="text-sm font-semibold text-[#1a2945]/70">
                      Intro Heading
                    </span>
                    <input
                      value={ch.introHeading}
                      onChange={(e) =>
                        updateDraft('campHighlights', {
                          introHeading: e.target.value,
                        } as unknown as Partial<CampHighlightsContent>)
                      }
                      className="rounded-xl border border-[#1a2945]/20 bg-white px-3 py-2 text-sm outline-none focus:border-[#1a7b8e] focus:ring-2 focus:ring-[#1a7b8e]/15"
                    />
                  </label>

                  <label className="flex flex-col gap-2">
                    <span className="text-sm font-semibold text-[#1a2945]/70">
                      Activities (comma separated)
                    </span>
                    <input
                      value={toCommaSeparated(ch.activities)}
                      onChange={(e) =>
                        updateDraft('campHighlights', {
                          activities: parseCommaSeparated(e.target.value),
                        } as unknown as Partial<CampHighlightsContent>)
                      }
                      className="rounded-xl border border-[#1a2945]/20 bg-white px-3 py-2 text-sm outline-none focus:border-[#1a7b8e] focus:ring-2 focus:ring-[#1a7b8e]/15"
                    />
                  </label>

                  <label className="flex flex-col gap-2">
                    <span className="text-sm font-semibold text-[#1a2945]/70">
                      Image Src
                    </span>
                    <input
                      value={ch.imageSrc}
                      onChange={(e) =>
                        updateDraft('campHighlights', {
                          imageSrc: e.target.value,
                        } as unknown as Partial<CampHighlightsContent>)
                      }
                      className="rounded-xl border border-[#1a2945]/20 bg-white px-3 py-2 text-sm outline-none focus:border-[#1a7b8e] focus:ring-2 focus:ring-[#1a7b8e]/15"
                    />
                  </label>

                  <label className="flex flex-col gap-2">
                    <span className="text-sm font-semibold text-[#1a2945]/70">
                      Image Alt
                    </span>
                    <input
                      value={ch.imageAlt}
                      onChange={(e) =>
                        updateDraft('campHighlights', {
                          imageAlt: e.target.value,
                        } as unknown as Partial<CampHighlightsContent>)
                      }
                      className="rounded-xl border border-[#1a2945]/20 bg-white px-3 py-2 text-sm outline-none focus:border-[#1a7b8e] focus:ring-2 focus:ring-[#1a7b8e]/15"
                    />
                  </label>

                  <label className="flex flex-col gap-2">
                    <span className="text-sm font-semibold text-[#1a2945]/70">
                      Video URL
                    </span>
                    <input
                      value={ch.videoUrl}
                      onChange={(e) =>
                        updateDraft('campHighlights', {
                          videoUrl: e.target.value,
                        } as unknown as Partial<CampHighlightsContent>)
                      }
                      className="rounded-xl border border-[#1a2945]/20 bg-white px-3 py-2 text-sm outline-none focus:border-[#1a7b8e] focus:ring-2 focus:ring-[#1a7b8e]/15"
                    />
                  </label>
                </>
              );
            })()}
          </div>

          <div className="mt-6 space-y-4">
            <p className="text-sm font-semibold text-[#1a2945]/70">
              Highlights
            </p>
            {(sectionDraft.campHighlights as CampHighlightsContent).highlights.map(
              (item, idx) => (
                <div
                  key={`${idx}-${item.boldText}`}
                  className="rounded-2xl border border-black/5 bg-white p-4"
                >
                  <p className="text-sm font-semibold text-[#1a2945]/70">
                    Highlight {idx + 1}
                  </p>
                  <div className="mt-3 grid gap-4 md:grid-cols-2">
                    <label className="flex flex-col gap-2">
                      <span className="text-xs font-semibold text-[#1a2945]/70">
                        Bold Text
                      </span>
                      <input
                        value={item.boldText}
                        onChange={(e) => {
                          const next = [...(sectionDraft.campHighlights as CampHighlightsContent).highlights];
                          next[idx] = { ...next[idx], boldText: e.target.value };
                          updateDraft(
                            'campHighlights',
                            { highlights: next } as unknown as Partial<CampHighlightsContent>
                          );
                        }}
                        className="rounded-xl border border-[#1a2945]/20 bg-white px-3 py-2 text-sm outline-none focus:border-[#1a7b8e] focus:ring-2 focus:ring-[#1a7b8e]/15"
                      />
                    </label>
                    <label className="flex flex-col gap-2">
                      <span className="text-xs font-semibold text-[#1a2945]/70">
                        Text
                      </span>
                      <textarea
                        value={item.text}
                        onChange={(e) => {
                          const next = [...(sectionDraft.campHighlights as CampHighlightsContent).highlights];
                          next[idx] = { ...next[idx], text: e.target.value };
                          updateDraft(
                            'campHighlights',
                            { highlights: next } as unknown as Partial<CampHighlightsContent>
                          );
                        }}
                        className="min-h-24 resize-y rounded-xl border border-[#1a2945]/20 bg-white px-3 py-2 text-sm outline-none focus:border-[#1a7b8e] focus:ring-2 focus:ring-[#1a7b8e]/15"
                      />
                    </label>
                  </div>
                </div>
              )
            )}
          </div>

          <div className="mt-6 overflow-hidden rounded-2xl border border-black/5 bg-white p-4">
            <p className="text-sm font-semibold text-[#1a2945]/70">
              Media Preview
            </p>
            <div className="mt-3 overflow-hidden rounded-xl border border-black/5 bg-white">
              {((sectionDraft.campHighlights as CampHighlightsContent).videoUrl || '')
                .trim() ? (
                <video
                  src={(sectionDraft.campHighlights as CampHighlightsContent).videoUrl}
                  controls
                  className="w-full h-auto"
                />
              ) : (
                <img
                  src={(sectionDraft.campHighlights as CampHighlightsContent).imageSrc}
                  alt={(sectionDraft.campHighlights as CampHighlightsContent).imageAlt}
                  className="w-full aspect-[16/9] object-cover"
                />
              )}
            </div>
          </div>
        </div>

        {/* Program Schedule */}
        <div className="rounded-2xl border border-black/5 bg-white/60 p-6 shadow">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-extrabold text-[#1a2945]">
                {sectionLabel('programSchedule')}
              </h2>
            </div>
            <button
              type="button"
              onClick={() => void handleSave('programSchedule')}
              disabled={savingKey === 'programSchedule'}
              className="rounded-xl bg-[#c74444] px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#a63535] disabled:cursor-not-allowed disabled:bg-[#c74444]/60"
            >
              {savingKey === 'programSchedule' ? 'Saving...' : 'Save'}
            </button>
          </div>
          {savedKey === 'programSchedule' ? (
            <p className="mt-2 text-sm font-semibold text-[#0e243a]">
              Saved.
            </p>
          ) : null}

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {(() => {
              const ps = sectionDraft.programSchedule as ProgramScheduleContent;
              return (
                <>
                  <label className="flex flex-col gap-2">
                    <span className="text-sm font-semibold text-[#1a2945]/70">
                      Badge Labels (comma separated)
                    </span>
                    <input
                      value={toCommaSeparated(ps.badgeLabels)}
                      onChange={(e) =>
                        updateDraft('programSchedule', {
                          badgeLabels: parseCommaSeparated(e.target.value),
                        } as unknown as Partial<ProgramScheduleContent>)
                      }
                      className="rounded-xl border border-[#1a2945]/20 bg-white px-3 py-2 text-sm outline-none focus:border-[#1a7b8e] focus:ring-2 focus:ring-[#1a7b8e]/15"
                    />
                  </label>

                  {(
                    [
                      ['enrollPrefix', 'Enroll Prefix'],
                      ['enrollBold', 'Enroll Bold'],
                      ['scheduleTitle', 'Schedule Title'],
                      ['scheduleSubtitle', 'Schedule Subtitle'],
                      ['scheduleBody', 'Schedule Body'],
                    ] as const
                  ).map(([field, label]) => (
                    <label key={field} className="flex flex-col gap-2">
                      <span className="text-sm font-semibold text-[#1a2945]/70">
                        {label}
                      </span>
                      {field === 'scheduleBody' ? (
                        <textarea
                          value={
                            (ps as unknown as Record<string, unknown>)[
                              field as string
                            ] as string
                          }
                          onChange={(e) =>
                            updateDraft('programSchedule', {
                              [field]: e.target.value,
                            } as unknown as Partial<ProgramScheduleContent>)
                          }
                          className="min-h-24 resize-y rounded-xl border border-[#1a2945]/20 bg-white px-3 py-2 text-sm outline-none focus:border-[#1a7b8e] focus:ring-2 focus:ring-[#1a7b8e]/15"
                        />
                      ) : (
                        <input
                          value={
                            (ps as unknown as Record<string, unknown>)[
                              field as string
                            ] as string
                          }
                          onChange={(e) =>
                            updateDraft('programSchedule', {
                              [field]: e.target.value,
                            } as unknown as Partial<ProgramScheduleContent>)
                          }
                          className="rounded-xl border border-[#1a2945]/20 bg-white px-3 py-2 text-sm outline-none focus:border-[#1a7b8e] focus:ring-2 focus:ring-[#1a7b8e]/15"
                        />
                      )}
                    </label>
                  ))}

                  <label className="flex flex-col gap-2">
                    <span className="text-sm font-semibold text-[#1a2945]/70">
                      Image Src
                    </span>
                    <input
                      value={ps.imageSrc}
                      onChange={(e) =>
                        updateDraft('programSchedule', {
                          imageSrc: e.target.value,
                        } as unknown as Partial<ProgramScheduleContent>)
                      }
                      className="rounded-xl border border-[#1a2945]/20 bg-white px-3 py-2 text-sm outline-none focus:border-[#1a7b8e] focus:ring-2 focus:ring-[#1a7b8e]/15"
                    />
                  </label>

                  <label className="flex flex-col gap-2">
                    <span className="text-sm font-semibold text-[#1a2945]/70">
                      Image Alt
                    </span>
                    <input
                      value={ps.imageAlt}
                      onChange={(e) =>
                        updateDraft('programSchedule', {
                          imageAlt: e.target.value,
                        } as unknown as Partial<ProgramScheduleContent>)
                      }
                      className="rounded-xl border border-[#1a2945]/20 bg-white px-3 py-2 text-sm outline-none focus:border-[#1a7b8e] focus:ring-2 focus:ring-[#1a7b8e]/15"
                    />
                  </label>

                  <label className="flex flex-col gap-2">
                    <span className="text-sm font-semibold text-[#1a2945]/70">
                      Video URL
                    </span>
                    <input
                      value={ps.videoUrl}
                      onChange={(e) =>
                        updateDraft('programSchedule', {
                          videoUrl: e.target.value,
                        } as unknown as Partial<ProgramScheduleContent>)
                      }
                      className="rounded-xl border border-[#1a2945]/20 bg-white px-3 py-2 text-sm outline-none focus:border-[#1a7b8e] focus:ring-2 focus:ring-[#1a7b8e]/15"
                    />
                  </label>
                </>
              );
            })()}
          </div>

          <div className="mt-6 overflow-hidden rounded-2xl border border-black/5 bg-white p-4">
            <p className="text-sm font-semibold text-[#1a2945]/70">
              Media Preview
            </p>
            <div className="mt-3 overflow-hidden rounded-xl border border-black/5 bg-white">
              {((sectionDraft.programSchedule as ProgramScheduleContent).videoUrl || '')
                .trim() ? (
                <video
                  src={(sectionDraft.programSchedule as ProgramScheduleContent).videoUrl}
                  controls
                  className="w-full h-auto"
                />
              ) : (
                <img
                  src={(sectionDraft.programSchedule as ProgramScheduleContent).imageSrc}
                  alt={(sectionDraft.programSchedule as ProgramScheduleContent).imageAlt}
                  className="w-full aspect-[1/1] object-cover"
                />
              )}
            </div>
          </div>
        </div>

        {/* Afterschool Programs */}
        <div className="rounded-2xl border border-black/5 bg-white/60 p-6 shadow">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-extrabold text-[#1a2945]">
                {sectionLabel('afterschoolPrograms')}
              </h2>
            </div>
            <button
              type="button"
              onClick={() => void handleSave('afterschoolPrograms')}
              disabled={savingKey === 'afterschoolPrograms'}
              className="rounded-xl bg-[#c74444] px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#a63535] disabled:cursor-not-allowed disabled:bg-[#c74444]/60"
            >
              {savingKey === 'afterschoolPrograms'
                ? 'Saving...'
                : 'Save'}
            </button>
          </div>
          {savedKey === 'afterschoolPrograms' ? (
            <p className="mt-2 text-sm font-semibold text-[#0e243a]">
              Saved.
            </p>
          ) : null}

          {(() => {
            const ap = sectionDraft.afterschoolPrograms as AfterschoolProgramsContent;
            return (
              <>
                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  {(
                    [
                      ['heroTitle', 'Hero Title'],
                      ['heroSubtitle', 'Hero Subtitle'],
                      ['registrationTitle', 'Registration Title'],
                      ['registrationDescription', 'Registration Description'],
                      ['pricingTitle', 'Pricing Title'],
                      ['discountNotice', 'Discount Notice'],
                    ] as const
                  ).map(([field, label]) => (
                    <label key={field} className="flex flex-col gap-2">
                      <span className="text-sm font-semibold text-[#1a2945]/70">
                        {label}
                      </span>
                      {field === 'registrationDescription' ? (
                        <textarea
                          value={
                            (ap as unknown as Record<string, unknown>)[
                              field as string
                            ] as string
                          }
                          onChange={(e) =>
                            updateDraft('afterschoolPrograms', {
                              [field]: e.target.value,
                            } as unknown as Partial<AfterschoolProgramsContent>)
                          }
                          className="min-h-24 resize-y rounded-xl border border-[#1a2945]/20 bg-white px-3 py-2 text-sm outline-none focus:border-[#1a7b8e] focus:ring-2 focus:ring-[#1a7b8e]/15"
                        />
                      ) : (
                        <input
                          value={
                            (ap as unknown as Record<string, unknown>)[
                              field as string
                            ] as string
                          }
                          onChange={(e) =>
                            updateDraft('afterschoolPrograms', {
                              [field]: e.target.value,
                            } as unknown as Partial<AfterschoolProgramsContent>)
                          }
                          className="rounded-xl border border-[#1a2945]/20 bg-white px-3 py-2 text-sm outline-none focus:border-[#1a7b8e] focus:ring-2 focus:ring-[#1a7b8e]/15"
                        />
                      )}
                    </label>
                  ))}
                </div>

                <div className="mt-6 space-y-4">
                  <p className="text-sm font-semibold text-[#1a2945]/70">
                    Pricing Items
                  </p>
                  <div className="space-y-4">
                    {ap.pricingItems.map((item, idx) => (
                      <div
                        key={`${item.durationLabel}-${idx}`}
                        className="rounded-2xl border border-black/5 bg-white p-4"
                      >
                        <p className="text-sm font-semibold text-[#1a2945]/70">
                          Item {idx + 1}
                        </p>
                        <div className="mt-3 grid gap-4 md:grid-cols-2">
                      <label className="flex flex-col gap-2">
                        <span className="text-xs font-semibold text-[#1a2945]/70">
                          Duration Label
                        </span>
                            <input
                              value={item.durationLabel}
                              onChange={(e) => {
                                const next = [...ap.pricingItems];
                                next[idx] = {
                                  ...next[idx],
                                  durationLabel: e.target.value,
                                };
                                updateDraft('afterschoolPrograms', {
                                  pricingItems: next,
                            } as unknown as Partial<AfterschoolProgramsContent>);
                              }}
                              className="rounded-xl border border-[#1a2945]/20 bg-white px-3 py-2 text-sm outline-none focus:border-[#1a7b8e] focus:ring-2 focus:ring-[#1a7b8e]/15"
                            />
                          </label>
                          <label className="flex flex-col gap-2">
                            <span className="text-xs font-semibold text-[#1a2945]/70">
                              Price
                            </span>
                            <input
                              value={item.price}
                              onChange={(e) => {
                                const next = [...ap.pricingItems];
                                next[idx] = { ...next[idx], price: e.target.value };
                                updateDraft('afterschoolPrograms', {
                                  pricingItems: next,
                            } as unknown as Partial<AfterschoolProgramsContent>);
                              }}
                              className="rounded-xl border border-[#1a2945]/20 bg-white px-3 py-2 text-sm outline-none focus:border-[#1a7b8e] focus:ring-2 focus:ring-[#1a7b8e]/15"
                            />
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            );
          })()}
        </div>
      </div>
    </div>
  );
}

