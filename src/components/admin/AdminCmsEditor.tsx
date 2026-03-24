'use client';

import { useEffect, useMemo, useState } from 'react';
import type {
  CmsContentBySectionKey,
  CmsSectionKey,
  CampHighlightsContent,
  AboutSectionContent,
  MoreInformationContent,
  ProgramScheduleContent,
  AfterschoolProgramsContent,
  SiteChromeContent,
} from '@/lib/cms/types';

const SECTION_KEYS: CmsSectionKey[] = [
  'about',
  'moreInformation',
  'programSchedule',
  'afterschoolPrograms',
];

function sectionLabel(key: CmsSectionKey) {
  switch (key) {
    case 'siteChrome':
      return 'Site Chrome';
    case 'about':
      return 'About Section';
    case 'moreInformation':
      return 'More Information';
    case 'programSchedule':
      return 'Program Schedule';
    case 'afterschoolPrograms':
      return 'Afterschool Programs';
  }
}

export default function AdminCmsEditor() {
  const [sections, setSections] = useState<CmsContentBySectionKey | null>(null);
  const [selectedKey, setSelectedKey] = useState<CmsSectionKey>('about');
  const [draft, setDraft] = useState<
    CmsContentBySectionKey[CmsSectionKey] | null
  >(null);

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setError(null);
      setSuccess(null);

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
            payload && 'error' in payload ? payload.error : undefined;
          setError(typeof err === 'string' ? err : 'Error');
          return;
        }

        if (!cancelled) setSections(payload as CmsContentBySectionKey);
      } catch {
        if (!cancelled) setError('Could not load CMS content.');
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!sections) return;
    setDraft(sections[selectedKey]);
  }, [sections, selectedKey]);

  const contentAs = useMemo(() => {
    return {
      siteChrome: draft as SiteChromeContent | null,
      about: draft as AboutSectionContent | null,
      moreInformation: draft as MoreInformationContent | null,
      campHighlights: draft as CampHighlightsContent | null,
      programSchedule: draft as ProgramScheduleContent | null,
      afterschoolPrograms: draft as AfterschoolProgramsContent | null,
    }[selectedKey];
  }, [draft, selectedKey]);

  async function handleSave() {
    if (!draft) return;

    setIsSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch('/api/admin/cms', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ sectionKey: selectedKey, data: draft }),
      });

      const payload = (await res.json().catch(() => null)) as
        | { error?: string }
        | null;

      if (!res.ok) {
        setError(payload?.error || 'Save failed.');
        return;
      }

      setSections((current) =>
        current
          ? ({ ...current, [selectedKey]: draft } as CmsContentBySectionKey)
          : current
      );
      setSuccess('Saved.');
    } catch {
      setError('Save failed.');
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-6xl p-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-extrabold text-[#1a2945]">CMS Editor</h1>
      </div>

      {!sections ? (
        <p className="mt-4 text-sm text-[#1a2945]/70">Loading...</p>
      ) : null}

      {error ? (
        <div className="mt-4 rounded-xl border border-[#c74444]/30 bg-[#c74444]/10 p-4 text-sm text-[#7a1f1f]">
          {error}
        </div>
      ) : null}

      {success ? (
        <div className="mt-4 rounded-xl border border-[#1a7b8e]/20 bg-[#1a7b8e]/10 p-4 text-sm text-[#0e243a]">
          {success}
        </div>
      ) : null}

      {draft ? (
        <div className="mt-6 space-y-6">
          <div className="flex flex-wrap items-center gap-4">
            <label className="flex flex-col gap-2">
              <span className="text-sm font-semibold text-[#1a2945]/70">
                Section
              </span>
              <select
                value={selectedKey}
                onChange={(e) => setSelectedKey(e.target.value as CmsSectionKey)}
                className="rounded-xl border border-[#1a2945]/20 bg-white px-3 py-2 text-sm outline-none focus:border-[#1a7b8e] focus:ring-2 focus:ring-[#1a7b8e]/15"
              >
                {SECTION_KEYS.map((key) => (
                  <option key={key} value={key}>
                    {sectionLabel(key)}
                  </option>
                ))}
              </select>
            </label>

            <button
              type="button"
              disabled={isSaving}
              onClick={() => void handleSave()}
              className="mt-6 rounded-xl bg-[#c74444] px-6 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#a63535] disabled:cursor-not-allowed disabled:bg-[#c74444]/60"
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>

          {selectedKey === 'about' && contentAs ? (
            <div className="space-y-4">
              {(
                [
                  ['heading', 'Heading'],
                  ['italicLine', 'Italic Line'],
                  ['paragraph1', 'Paragraph 1'],
                  ['paragraph2', 'Paragraph 2'],
                  ['buttonLabel', 'Button Label'],
                  ['buttonHref', 'Button Href'],
                ] as const
              ).map(([field, label]) => (
                <label key={field} className="flex flex-col gap-2">
                  <span className="text-sm font-semibold text-[#1a2945]/70">
                    {label}
                  </span>
                  <input
                    value={(contentAs as AboutSectionContent)[field]}
                    onChange={(e) =>
                      setDraft((current) =>
                        current && selectedKey === 'about'
                          ? ({
                              ...(current as AboutSectionContent),
                              [field]: e.target.value,
                            } as CmsContentBySectionKey[CmsSectionKey])
                          : current
                      )
                    }
                    className="rounded-xl border border-[#1a2945]/20 bg-white px-3 py-2 text-sm outline-none focus:border-[#1a7b8e] focus:ring-2 focus:ring-[#1a7b8e]/15"
                  />
                </label>
              ))}
            </div>
          ) : null}

          {selectedKey === 'moreInformation' && contentAs ? (
            <div className="space-y-4">
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
              ).map(([field, label]) => (
                <label key={field} className="flex flex-col gap-2">
                  <span className="text-sm font-semibold text-[#1a2945]/70">
                    {label}
                  </span>
                  <input
                    value={(contentAs as MoreInformationContent)[field]}
                    onChange={(e) =>
                      setDraft((current) =>
                        current && selectedKey === 'moreInformation'
                          ? ({
                              ...(current as MoreInformationContent),
                              [field]: e.target.value,
                            } as CmsContentBySectionKey[CmsSectionKey])
                          : current
                      )
                    }
                    className="rounded-xl border border-[#1a2945]/20 bg-white px-3 py-2 text-sm outline-none focus:border-[#1a7b8e] focus:ring-2 focus:ring-[#1a7b8e]/15"
                  />
                </label>
              ))}

              <div className="rounded-2xl border border-black/5 bg-white p-4">
                <p className="text-sm font-semibold text-[#1a2945]/70">
                  Media Preview
                </p>

                <div className="mt-3 overflow-hidden rounded-xl border border-black/5 bg-white">
                  {((contentAs as MoreInformationContent).videoUrl || '')
                    .trim() ? (
                    <video
                      src={(contentAs as MoreInformationContent).videoUrl}
                      controls
                      className="h-auto w-full"
                    />
                  ) : (
                    <img
                      src={(contentAs as MoreInformationContent).imageSrc}
                      alt={(contentAs as MoreInformationContent).imageAlt}
                      className="aspect-[4/3] h-full w-full object-cover"
                    />
                  )}
                </div>
              </div>
            </div>
          ) : null}

          {selectedKey === 'campHighlights' && contentAs ? (
            <div className="space-y-6">
              <label className="flex flex-col gap-2">
                <span className="text-sm font-semibold text-[#1a2945]/70">
                  Intro Heading
                </span>
                <input
                  value={(contentAs as CampHighlightsContent).introHeading}
                  onChange={(e) =>
                    setDraft((current) =>
                      current && selectedKey === 'campHighlights'
                        ? ({
                            ...(current as CampHighlightsContent),
                            introHeading: e.target.value,
                          } as CmsContentBySectionKey[CmsSectionKey])
                        : current
                    )
                  }
                  className="rounded-xl border border-[#1a2945]/20 bg-white px-3 py-2 text-sm outline-none focus:border-[#1a7b8e] focus:ring-2 focus:ring-[#1a7b8e]/15"
                />
              </label>

              <label className="flex flex-col gap-2">
                <span className="text-sm font-semibold text-[#1a2945]/70">
                  Activities (comma separated)
                </span>
                <input
                  value={(contentAs as CampHighlightsContent).activities.join(
                    ', '
                  )}
                  onChange={(e) =>
                    setDraft((current) =>
                      current && selectedKey === 'campHighlights'
                        ? ({
                            ...(current as CampHighlightsContent),
                            activities: e.target.value
                              .split(',')
                              .map((s) => s.trim())
                              .filter(Boolean),
                          } as CmsContentBySectionKey[CmsSectionKey])
                        : current
                    )
                  }
                  className="rounded-xl border border-[#1a2945]/20 bg-white px-3 py-2 text-sm outline-none focus:border-[#1a7b8e] focus:ring-2 focus:ring-[#1a7b8e]/15"
                />
              </label>

              <div className="rounded-2xl border border-black/5 bg-white p-4">
                <p className="text-sm font-semibold text-[#1a2945]/70">
                  Media
                </p>

                <div className="mt-3 space-y-3">
                  <label className="flex flex-col gap-2">
                    <span className="text-xs font-semibold text-[#1a2945]/70">
                      Image Src
                    </span>
                    <input
                      value={(contentAs as CampHighlightsContent).imageSrc}
                      onChange={(e) =>
                        setDraft((current) => {
                          if (!current || selectedKey !== 'campHighlights')
                            return current;
                          return {
                            ...(current as CampHighlightsContent),
                            imageSrc: e.target.value,
                          } as CmsContentBySectionKey[CmsSectionKey];
                        })
                      }
                      className="rounded-xl border border-[#1a2945]/20 bg-white px-3 py-2 text-sm outline-none focus:border-[#1a7b8e] focus:ring-2 focus:ring-[#1a7b8e]/15"
                    />
                  </label>

                  <label className="flex flex-col gap-2">
                    <span className="text-xs font-semibold text-[#1a2945]/70">
                      Image Alt
                    </span>
                    <input
                      value={(contentAs as CampHighlightsContent).imageAlt}
                      onChange={(e) =>
                        setDraft((current) => {
                          if (!current || selectedKey !== 'campHighlights')
                            return current;
                          return {
                            ...(current as CampHighlightsContent),
                            imageAlt: e.target.value,
                          } as CmsContentBySectionKey[CmsSectionKey];
                        })
                      }
                      className="rounded-xl border border-[#1a2945]/20 bg-white px-3 py-2 text-sm outline-none focus:border-[#1a7b8e] focus:ring-2 focus:ring-[#1a7b8e]/15"
                    />
                  </label>

                  <label className="flex flex-col gap-2">
                    <span className="text-xs font-semibold text-[#1a2945]/70">
                      Video URL
                    </span>
                    <input
                      value={(contentAs as CampHighlightsContent).videoUrl}
                      onChange={(e) =>
                        setDraft((current) => {
                          if (!current || selectedKey !== 'campHighlights')
                            return current;
                          return {
                            ...(current as CampHighlightsContent),
                            videoUrl: e.target.value,
                          } as CmsContentBySectionKey[CmsSectionKey];
                        })
                      }
                      className="rounded-xl border border-[#1a2945]/20 bg-white px-3 py-2 text-sm outline-none focus:border-[#1a7b8e] focus:ring-2 focus:ring-[#1a7b8e]/15"
                    />
                  </label>

                  <div className="overflow-hidden rounded-xl border border-black/5 bg-white">
                    {(
                      (contentAs as CampHighlightsContent).videoUrl || ''
                    ).trim() ? (
                      <video
                        src={(contentAs as CampHighlightsContent).videoUrl}
                        controls
                        className="w-full h-auto"
                      />
                    ) : (
                      <img
                        src={(contentAs as CampHighlightsContent).imageSrc}
                        alt={(contentAs as CampHighlightsContent).imageAlt}
                        className="w-full aspect-[16/9] object-cover"
                      />
                    )}
                  </div>
                </div>
              </div>

              {(contentAs as CampHighlightsContent).highlights.map((item, idx) => (
                <div key={idx} className="rounded-2xl border border-black/5 bg-white p-4">
                  <p className="text-sm font-semibold text-[#1a2945]/70">
                    Highlight {idx + 1}
                  </p>
                  <div className="mt-3 space-y-3">
                    <label className="flex flex-col gap-2">
                      <span className="text-xs font-semibold text-[#1a2945]/70">
                        Bold Text
                      </span>
                      <input
                        value={item.boldText}
                        onChange={(e) =>
                          setDraft((current) => {
                            if (!current || selectedKey !== 'campHighlights') return current;
                            const next = { ...(current as CampHighlightsContent) };
                            const nextHighlights = [...next.highlights];
                            nextHighlights[idx] = {
                              ...nextHighlights[idx],
                              boldText: e.target.value,
                            };
                            next.highlights = nextHighlights;
                            return next as CmsContentBySectionKey[CmsSectionKey];
                          })
                        }
                        className="rounded-xl border border-[#1a2945]/20 bg-white px-3 py-2 text-sm outline-none focus:border-[#1a7b8e] focus:ring-2 focus:ring-[#1a7b8e]/15"
                      />
                    </label>
                    <label className="flex flex-col gap-2">
                      <span className="text-xs font-semibold text-[#1a2945]/70">
                        Text
                      </span>
                      <textarea
                        value={item.text}
                        onChange={(e) =>
                          setDraft((current) => {
                            if (!current || selectedKey !== 'campHighlights') return current;
                            const next = { ...(current as CampHighlightsContent) };
                            const nextHighlights = [...next.highlights];
                            nextHighlights[idx] = {
                              ...nextHighlights[idx],
                              text: e.target.value,
                            };
                            next.highlights = nextHighlights;
                            return next as CmsContentBySectionKey[CmsSectionKey];
                          })
                        }
                        className="min-h-24 resize-y rounded-xl border border-[#1a2945]/20 bg-white px-3 py-2 text-sm outline-none focus:border-[#1a7b8e] focus:ring-2 focus:ring-[#1a7b8e]/15"
                      />
                    </label>
                  </div>
                </div>
              ))}
            </div>
          ) : null}

          {selectedKey === 'programSchedule' && contentAs ? (
            <div className="space-y-4">
              <label className="flex flex-col gap-2">
                <span className="text-sm font-semibold text-[#1a2945]/70">
                  Badge Labels (comma separated)
                </span>
                <input
                  value={(contentAs as ProgramScheduleContent).badgeLabels.join(
                    ', '
                  )}
                  onChange={(e) =>
                    setDraft((current) =>
                      current && selectedKey === 'programSchedule'
                        ? ({
                            ...(current as ProgramScheduleContent),
                            badgeLabels: e.target.value
                              .split(',')
                              .map((s) => s.trim())
                              .filter(Boolean),
                          } as CmsContentBySectionKey[CmsSectionKey])
                        : current
                    )
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
                  <input
                    value={(contentAs as ProgramScheduleContent)[field]}
                    onChange={(e) =>
                      setDraft((current) =>
                        current && selectedKey === 'programSchedule'
                          ? ({
                              ...(current as ProgramScheduleContent),
                              [field]: e.target.value,
                            } as CmsContentBySectionKey[CmsSectionKey])
                          : current
                      )
                    }
                    className="rounded-xl border border-[#1a2945]/20 bg-white px-3 py-2 text-sm outline-none focus:border-[#1a7b8e] focus:ring-2 focus:ring-[#1a7b8e]/15"
                  />
                </label>
              ))}

              <div className="rounded-2xl border border-black/5 bg-white p-4">
                <p className="text-sm font-semibold text-[#1a2945]/70">Media</p>

                <div className="mt-3 space-y-3">
                  <label className="flex flex-col gap-2">
                    <span className="text-xs font-semibold text-[#1a2945]/70">
                      Image Src
                    </span>
                    <input
                      value={(contentAs as ProgramScheduleContent).imageSrc}
                      onChange={(e) =>
                        setDraft((current) => {
                          if (
                            !current ||
                            selectedKey !== 'programSchedule'
                          )
                            return current;
                          return {
                            ...(current as ProgramScheduleContent),
                            imageSrc: e.target.value,
                          } as CmsContentBySectionKey[CmsSectionKey];
                        })
                      }
                      className="rounded-xl border border-[#1a2945]/20 bg-white px-3 py-2 text-sm outline-none focus:border-[#1a7b8e] focus:ring-2 focus:ring-[#1a7b8e]/15"
                    />
                  </label>

                  <label className="flex flex-col gap-2">
                    <span className="text-xs font-semibold text-[#1a2945]/70">
                      Image Alt
                    </span>
                    <input
                      value={(contentAs as ProgramScheduleContent).imageAlt}
                      onChange={(e) =>
                        setDraft((current) => {
                          if (
                            !current ||
                            selectedKey !== 'programSchedule'
                          )
                            return current;
                          return {
                            ...(current as ProgramScheduleContent),
                            imageAlt: e.target.value,
                          } as CmsContentBySectionKey[CmsSectionKey];
                        })
                      }
                      className="rounded-xl border border-[#1a2945]/20 bg-white px-3 py-2 text-sm outline-none focus:border-[#1a7b8e] focus:ring-2 focus:ring-[#1a7b8e]/15"
                    />
                  </label>

                  <label className="flex flex-col gap-2">
                    <span className="text-xs font-semibold text-[#1a2945]/70">
                      Video URL
                    </span>
                    <input
                      value={(contentAs as ProgramScheduleContent).videoUrl}
                      onChange={(e) =>
                        setDraft((current) => {
                          if (
                            !current ||
                            selectedKey !== 'programSchedule'
                          )
                            return current;
                          return {
                            ...(current as ProgramScheduleContent),
                            videoUrl: e.target.value,
                          } as CmsContentBySectionKey[CmsSectionKey];
                        })
                      }
                      className="rounded-xl border border-[#1a2945]/20 bg-white px-3 py-2 text-sm outline-none focus:border-[#1a7b8e] focus:ring-2 focus:ring-[#1a7b8e]/15"
                    />
                  </label>

                  <div className="overflow-hidden rounded-xl border border-black/5 bg-white">
                    {(
                      (contentAs as ProgramScheduleContent).videoUrl || ''
                    ).trim() ? (
                      <video
                        src={(contentAs as ProgramScheduleContent).videoUrl}
                        controls
                        className="w-full h-auto"
                      />
                    ) : (
                      <img
                        src={(contentAs as ProgramScheduleContent).imageSrc}
                        alt={(contentAs as ProgramScheduleContent).imageAlt}
                        className="w-full aspect-[1/1] object-cover"
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : null}

          {selectedKey === 'afterschoolPrograms' && contentAs ? (
            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
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
                        value={(contentAs as AfterschoolProgramsContent)[field]}
                        onChange={(e) =>
                          setDraft((current) =>
                            current && selectedKey === 'afterschoolPrograms'
                              ? ({
                                  ...(current as AfterschoolProgramsContent),
                                  [field]: e.target.value,
                                } as CmsContentBySectionKey[CmsSectionKey])
                              : current
                          )
                        }
                        className="min-h-24 resize-y rounded-xl border border-[#1a2945]/20 bg-white px-3 py-2 text-sm outline-none focus:border-[#1a7b8e] focus:ring-2 focus:ring-[#1a7b8e]/15"
                      />
                    ) : (
                      <input
                        value={(contentAs as AfterschoolProgramsContent)[field]}
                        onChange={(e) =>
                          setDraft((current) =>
                            current && selectedKey === 'afterschoolPrograms'
                              ? ({
                                  ...(current as AfterschoolProgramsContent),
                                  [field]: e.target.value,
                                } as CmsContentBySectionKey[CmsSectionKey])
                              : current
                          )
                        }
                        className="rounded-xl border border-[#1a2945]/20 bg-white px-3 py-2 text-sm outline-none focus:border-[#1a7b8e] focus:ring-2 focus:ring-[#1a7b8e]/15"
                      />
                    )}
                  </label>
                ))}
              </div>

              <div className="space-y-3">
                <p className="text-sm font-semibold text-[#1a2945]/70">
                  Pricing Items
                </p>
                {(contentAs as AfterschoolProgramsContent).pricingItems.map(
                  (item, idx) => (
                    <div key={item.durationLabel} className="rounded-2xl border border-black/5 bg-white p-4">
                      <p className="text-xs font-semibold text-[#1a2945]/70">
                        Item {idx + 1}
                      </p>
                      <div className="mt-3 grid gap-3 md:grid-cols-2">
                        <label className="flex flex-col gap-2">
                          <span className="text-xs font-semibold text-[#1a2945]/70">
                            Duration Label
                          </span>
                          <input
                            value={item.durationLabel}
                            onChange={(e) =>
                              setDraft((current) => {
                                if (
                                  !current ||
                                  selectedKey !== 'afterschoolPrograms'
                                )
                                  return current;
                                const next = {
                                  ...(current as AfterschoolProgramsContent),
                                };
                                const nextItems = [...next.pricingItems];
                                nextItems[idx] = {
                                  ...nextItems[idx],
                                  durationLabel: e.target.value,
                                };
                                next.pricingItems = nextItems;
                                return next as CmsContentBySectionKey[CmsSectionKey];
                              })
                            }
                            className="rounded-xl border border-[#1a2945]/20 bg-white px-3 py-2 text-sm outline-none focus:border-[#1a7b8e] focus:ring-2 focus:ring-[#1a7b8e]/15"
                          />
                        </label>
                        <label className="flex flex-col gap-2">
                          <span className="text-xs font-semibold text-[#1a2945]/70">
                            Price
                          </span>
                          <input
                            value={item.price}
                            onChange={(e) =>
                              setDraft((current) => {
                                if (
                                  !current ||
                                  selectedKey !== 'afterschoolPrograms'
                                )
                                  return current;
                                const next = {
                                  ...(current as AfterschoolProgramsContent),
                                };
                                const nextItems = [...next.pricingItems];
                                nextItems[idx] = {
                                  ...nextItems[idx],
                                  price: e.target.value,
                                };
                                next.pricingItems = nextItems;
                                return next as CmsContentBySectionKey[CmsSectionKey];
                              })
                            }
                            className="rounded-xl border border-[#1a2945]/20 bg-white px-3 py-2 text-sm outline-none focus:border-[#1a7b8e] focus:ring-2 focus:ring-[#1a7b8e]/15"
                          />
                        </label>
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
